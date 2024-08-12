import { EquipmentStatus, EquipmentType, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

type CreateEquipmentInput = {
  name: string;
  type?: EquipmentType;
  description?: string;
  assignedToId?: string;
};

type UpdateEquipmentInput = {
  name?: string;
  type?: EquipmentType;
  description?: string;
  status?: EquipmentStatus;
  assignedToId?: string;
};

export const getAllEquipment = async (req: Request, res: Response) => {
  const equipment = await prisma.equipment.findMany({
    include: { assignedTo: { select: { name: true } } },
  });

  return res.status(200).json({ status: 200, data: equipment });
};

export const getEquipmentById = async (req: Request, res: Response) => {
  const equipment = await prisma.equipment.findUnique({
    where: { id: req.params.id },
    include: { assignedTo: true },
  });
  if (!equipment) {
    return res
      .status(404)
      .json({ status: 404, message: "Equipment not found" });
  } else {
    return res.status(200).json({ status: 200, data: equipment });
  }
};

export const createEquipment = async (req: Request, res: Response) => {
  try {
    const equipmentInput: CreateEquipmentInput = req.body;

    if (
      equipmentInput.type &&
      !Object.values(EquipmentType).includes(equipmentInput.type)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (equipmentInput.assignedToId) {
      const assignedTo = await prisma.unit.findUnique({
        where: { id: equipmentInput.assignedToId },
      });
      if (!assignedTo) {
        return res
          .status(404)
          .json({ status: 404, message: "Unit to assign to is not found." });
      }
    }

    const newEquipment = await prisma.equipment.create({
      data: equipmentInput,
    });
    return res.status(201).json({ status: 201, data: newEquipment });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed creating equipment." });
  }
};

export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const equipmentInput: UpdateEquipmentInput = req.body;

    if (
      equipmentInput.type &&
      !Object.values(EquipmentType).includes(equipmentInput.type)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (
      equipmentInput.status &&
      !Object.values(EquipmentStatus).includes(equipmentInput.status)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (equipmentInput.assignedToId || equipmentInput.assignedToId === "") {
      const assignedTo = await prisma.unit.findUnique({
        where: { id: equipmentInput.assignedToId },
      });
      if (!assignedTo) {
        return res
          .status(404)
          .json({ status: 404, message: "Unit to assign to is not found." });
      }
    }

    let updatedEquipment;
    if (equipmentInput.status === "DECOMMISSIONED") {
      const { assignedToId, ...newEquipmentInput } = equipmentInput;

      updatedEquipment = await prisma.equipment.update({
        where: { id: req.params.id },
        data: {
          ...newEquipmentInput,
          assignedTo: { disconnect: true },
        },
      });
    } else {
      updatedEquipment = await prisma.equipment.update({
        where: { id: req.params.id },
        data: equipmentInput,
      });
    }

    return res.status(200).json({ status: 200, data: updatedEquipment });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed updating equipment." });
  }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const equipment = await prisma.equipment.delete({
      where: { id: req.params.id },
    });
    return res.status(200).json({ status: 200, data: equipment });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed deleting equipment." });
  }
};

export const deleteMultipleEquipment = async (req: Request, res: Response) => {
  try {
    const equipment = await prisma.equipment
      .deleteMany({
        where: { id: { in: req.body.equipmentIds } },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed deleting equipment." });
      });

    return res.status(200).json({ status: 200, data: equipment });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed deleting equipment." });
  }
};

export const getAvailableEquipment = async (req: Request, res: Response) => {
  const equipment = await prisma.equipment.findMany({
    where: { assignedToId: null, status: "ACTIVE" },
  });
  return res.status(200).json({ status: 200, data: equipment });
};

export default {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,

  deleteMultipleEquipment,
  getAvailableEquipment,
};
