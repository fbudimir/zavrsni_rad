import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Prisma, SoldierRank, SoldierStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type CreateSoldierInput = {
  name: string;
  rank: SoldierRank;
  unitId?: string;
  class?: number;
};

type UpdateSoldierInput = {
  name?: string;
  rank?: SoldierRank;
  unitId?: string;
  class?: number;
  status?: SoldierStatus;
};

const rankToClassMapping: { [key in SoldierRank]: number } = {
  [SoldierRank.PVT]: 0,
  [SoldierRank.PFC]: 0,
  [SoldierRank.CPL]: 1,
  [SoldierRank.SGT]: 1,
  [SoldierRank.SSGT]: 2,
  [SoldierRank.SFC]: 2,
  [SoldierRank.MSGT]: 3,
  [SoldierRank.FSG]: 3,
  [SoldierRank.SGM]: 3,
  [SoldierRank.SLT]: 3,
  [SoldierRank.FLT]: 4,
  [SoldierRank.CPT]: 4,
  [SoldierRank.MAJ]: 4,
  [SoldierRank.LTC]: 5,
  [SoldierRank.COL]: 5,
  [SoldierRank.BG]: 5,
  [SoldierRank.MG]: 5,
  [SoldierRank.LTG]: 5,
  [SoldierRank.GEN]: 5,
};

export const getAllSoldiers = async (req: Request, res: Response) => {
  const soldiers = await prisma.soldier.findMany({
    include: { unit: { select: { name: true } } },
  });
  return res.status(200).json({ status: 200, data: soldiers });
};

export const getSoldierById = async (req: Request, res: Response) => {
  const soldier = await prisma.soldier.findUnique({
    where: { id: req.params.id },
    include: {
      leadsUnit: true,
      unit: {
        include: {
          parentUnit: {
            include: {
              parentUnit: {
                include: {
                  parentUnit: {
                    include: {
                      parentUnit: {
                        include: {
                          parentUnit: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!soldier) {
    return res.status(404).json({ status: 404, message: "soldier not found" });
  } else {
    return res.status(200).json({ status: 200, data: soldier });
  }
};

export const createSoldier = async (req: Request, res: Response) => {
  try {
    let soldierInput: CreateSoldierInput = req.body;

    if (!soldierInput.name || !soldierInput.rank) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (!Object.values(SoldierRank).includes(soldierInput.rank)) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (!soldierInput.class) {
      soldierInput.class = rankToClassMapping[soldierInput.rank!];
    }

    const newSoldier = await prisma.soldier.create({
      data: soldierInput,
    });
    return res.status(201).json({ status: 201, data: newSoldier });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed creating soldier." });
  }
};

export const updateSoldier = async (req: Request, res: Response) => {
  try {
    const soldierInput: UpdateSoldierInput = req.body;
    if (
      soldierInput.rank &&
      !Object.values(SoldierRank).includes(soldierInput.rank)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (
      soldierInput.status &&
      !Object.values(SoldierStatus).includes(soldierInput.status)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (!soldierInput.class && soldierInput.rank) {
      soldierInput.class = rankToClassMapping[soldierInput.rank!];
    }

    const soldier = await prisma.soldier.findUnique({
      where: { id: req.params.id },
      include: { leadsUnit: true },
    });

    if (!soldier) {
      return res.status(404).json({ status: 404, message: "Not found." });
    }

    if (soldierInput.class) {
      if (
        soldier.leadsUnit &&
        soldier.leadsUnit.type !== "TASK_FORCE" &&
        soldier.leadsUnit.class > soldierInput.class
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Cannot lower the class of this Soldier because he is leading a Unit with a higher class than his new class, first choose a new leader for the Unit before demoting this Soldier.",
        });
      }
    }

    let newSoldier;
    if (soldierInput.status === "RETIRED") {
      if (soldier.leadsUnit) {
        return res.status(400).json({
          status: 400,
          message:
            "You are trying to retire a leader of a Unit, please assign a new leader to the Unit before retiring this Soldier.",
        });
      }

      const { unitId, ...newSoldierInput } = soldierInput;

      newSoldier = await prisma.soldier.update({
        where: { id: req.params.id },
        data: { ...newSoldierInput, unit: { disconnect: true } },
      });
    } else {
      newSoldier = await prisma.soldier.update({
        where: { id: req.params.id },
        data: soldierInput,
      });
    }

    return res.status(200).json({ status: 200, data: newSoldier });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed updating soldier." });
  }
};

export const deleteSoldier = async (req: Request, res: Response) => {
  const soldier = await prisma.soldier
    .delete({
      where: { id: req.params.id },
    })
    .catch((error) => {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "You are trying to delete a leader of a Unit, please assign a new leader to the Unit before deleting this Soldier.",
        });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
    });
  return res.status(200).json({ status: 200, data: soldier });
};

export const deleteMultipleSoldiers = async (req: Request, res: Response) => {
  const soldiers = await prisma.soldier
    .deleteMany({
      where: { id: { in: req.body.soldierIds } },
    })
    .catch((error) => {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "You are trying to delete a leader of a Unit, please assign a new leader to the Unit before deleting the Soldier.",
        });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
    });
  return res.status(200).json({ status: 200, data: soldiers });
};

export const getAvailableSoldiers = async (req: Request, res: Response) => {
  const soldiers = await prisma.soldier
    .findMany({
      where: {
        status: "ACTIVE",
        leadsUnit: undefined || null,
        unitId: undefined || null,
      },
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({ status: 400, message: err.message });
      }
      return res
        .status(500)
        .json({ status: 500, message: "Failed getting soldiers." });
    });

  return res.status(200).json({ status: 200, data: soldiers });
};

export default {
  getAllSoldiers,
  getSoldierById,
  createSoldier,
  updateSoldier,
  deleteSoldier,

  deleteMultipleSoldiers,
  getAvailableSoldiers,
};
