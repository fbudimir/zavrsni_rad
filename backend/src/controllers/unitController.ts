import { Order, Prisma, UnitStatus, UnitType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

type CreateUnitInput = {
  name: string;
  type: UnitType;
  parentUnitId?: string;
  leaderId?: string;
  nPosition?: number;
  ePosition?: number;
};

type UpdateUnitInput = {
  name?: string;
  parentUnitId?: string;
  status?: UnitStatus;
  leaderId?: string;
  nPosition?: number;
  ePosition?: number;
};

const typeToClassMapping: { [key in UnitType]: number } = {
  [UnitType.TEAM]: 1,
  [UnitType.SQUAD]: 2,
  [UnitType.PLATOON]: 3,
  [UnitType.COMPANY]: 4,
  [UnitType.BATTALION]: 5,
  [UnitType.TASK_FORCE]: 6,
};

export const getAllUnits = async (req: Request, res: Response) => {
  const units = await prisma.unit.findMany({
    include: { parentUnit: { select: { name: true } } },
  });
  return res.status(200).json({ status: 200, data: units });
};

export const getUnitById = async (req: Request, res: Response) => {
  const unit = await prisma.unit.findUnique({
    where: { id: req.params.id },
    include: {
      soldiers: true,
      equipment: true,
      leader: true,
      subUnits: true,
      orders: true,
      parentUnit: {
        include: {
          parentUnit: {
            include: {
              parentUnit: {
                include: { parentUnit: { include: { parentUnit: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!unit) {
    return res.status(404).json({ status: 404, message: "Unit not found" });
  } else {
    return res.status(200).json({ status: 200, data: unit });
  }
};

export const createUnit = async (req: Request, res: Response) => {
  try {
    let unitInput: CreateUnitInput = req.body;

    if (!unitInput.name || !unitInput.type) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    // if (!unitInput.leaderId) {
    //   return res
    //     .status(400)
    //     .json({ status: 400, message: "Leader must be provided." });
    // }

    if (!Object.values(UnitType).includes(unitInput.type)) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    if (
      (!unitInput.ePosition && unitInput.nPosition) ||
      (unitInput.ePosition && !unitInput.nPosition)
    ) {
      return res.status(400).json({
        status: 400,
        message: "Please provide either both or no coordinates.",
      });
    }
    if (unitInput.ePosition && unitInput.nPosition) {
      if (
        unitInput.ePosition > 180 ||
        unitInput.ePosition < -180 ||
        unitInput.nPosition > 90 ||
        unitInput.nPosition < -90
      ) {
        return res.status(400).json({
          status: 400,
          message: "Bad coordinates input.",
        });
      }
    }

    const unitInputWithClass: CreateUnitInput & { class: number } = {
      ...unitInput,
      class: typeToClassMapping[unitInput.type!],
    };

    if (unitInputWithClass.parentUnitId) {
      const parentUnit = await prisma.unit.findUnique({
        where: { id: unitInputWithClass.parentUnitId },
      });
      if (
        !parentUnit ||
        parentUnit.class <= 1 ||
        (unitInputWithClass.class &&
          unitInputWithClass.class >= parentUnit.class)
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Parent unit does not exist or it's class is lower than or equal to this Unit's class",
        });
      }
    }

    let leader = undefined;
    if (unitInput.leaderId) {
      leader = await prisma.soldier.findUnique({
        where: { id: unitInputWithClass.leaderId },
        include: { leadsUnit: true },
      });

      if (!leader || leader.class < 1) {
        return res.status(400).json({
          status: 400,
          message: "Chosen leader does not exist or its class is too low.",
        });
      }
      if (leader.leadsUnit) {
        return res.status(400).json({
          status: 400,
          message: "Chosen leader already leads a unit.",
        });
      }
      if (
        unitInputWithClass.class &&
        unitInputWithClass.class > leader.class &&
        unitInputWithClass.type != "TASK_FORCE"
      ) {
        return res.status(400).json({
          status: 400,
          message: "Chosen leader's class is lower than this Unit's class",
        });
      }
    }

    let newUnit: any;
    await prisma
      .$transaction(async (prisma) => {
        newUnit = await prisma.unit.create({
          data: unitInputWithClass,
        });

        if (leader) {
          await prisma.soldier.update({
            where: { id: leader.id },
            data: { unitId: newUnit.id },
          });
        }
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          return res
            .status(400)
            .json({ status: 400, message: "Invalid input." });
        }
        return res
          .status(500)
          .json({ status: 500, message: "Unexpected error occurred." });
      });

    return res.status(201).json({ status: 201, data: newUnit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed creating unit." });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  try {
    const unitInput: UpdateUnitInput = req.body;

    if (
      unitInput.status &&
      !Object.values(UnitStatus).includes(unitInput.status)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    const thisUnit = await prisma.unit.findUnique({
      where: { id: req.params.id },
    });

    if (!thisUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit to update does not exist.",
      });
    }

    if (
      (!unitInput.ePosition && unitInput.nPosition && !thisUnit.ePosition) ||
      (unitInput.ePosition && !unitInput.nPosition && !thisUnit.nPosition)
    ) {
      return res.status(400).json({
        status: 400,
        message: "Please provide either both or no coordinates.",
      });
    }
    if (unitInput.ePosition && unitInput.nPosition) {
      if (
        unitInput.ePosition > 180 ||
        unitInput.ePosition < -180 ||
        unitInput.nPosition > 90 ||
        unitInput.nPosition < -90
      ) {
        return res.status(400).json({
          status: 400,
          message: "Bad coordinates input.",
        });
      }
    }

    if (unitInput.parentUnitId) {
      const parentUnit = await prisma.unit.findUnique({
        where: { id: unitInput.parentUnitId },
      });

      if (!parentUnit) {
        return res.status(400).json({
          status: 400,
          message: "Parent Unit does not exist.",
        });
      }
      if (parentUnit.class <= 1) {
        return res.status(400).json({
          status: 400,
          message: "Parent Unit's class is too low.",
        });
      }
      if (thisUnit.class >= parentUnit.class) {
        return res.status(400).json({
          status: 400,
          message:
            "Parent unit's class is lower than or equal to this Unit's class.",
        });
      }
    }

    let leader: any;
    if (unitInput.leaderId) {
      leader = await prisma.soldier.findUnique({
        where: { id: unitInput.leaderId },
      });

      if (!leader || leader.class < 1) {
        return res.status(400).json({
          status: 400,
          message: "Chosen leader does not exist or its class is too low.",
        });
      }

      if (leader.leadsUnit) {
        return res.status(400).json({
          status: 400,
          message: "Chosen leader already leads a unit.",
        });
      }

      if (thisUnit.type !== "TASK_FORCE" && thisUnit.class > leader.class) {
        return res.status(400).json({
          status: 400,
          message: "Chosen leader's class is lower than this Unit's class.",
        });
      }
    }

    let updatedUnit: any;
    await prisma
      .$transaction(async (prisma) => {
        if (leader && unitInput.status !== "DECOMMISSIONED") {
          await prisma.soldier.update({
            where: { id: leader.id },
            data: { unitId: req.params.id },
          });
        }

        if (unitInput.status === "DECOMMISSIONED") {
          const { leaderId, parentUnitId, ...newUnitInput } = unitInput;

          updatedUnit = await prisma.unit.update({
            where: { id: req.params.id },
            data: {
              ...newUnitInput,
              soldiers: {
                set: [], // disconnect all soldiers if decommissioned
              },
              leader: { disconnect: true },
              subUnits: {
                set: [], // disconnect all subUnits if decommissioned
              },
              orders: {
                set: [], // disconnect all orders if decommissioned
              },

              equipment: {
                set: [], // disconnect all equipment if decommissioned
              },
              parentUnit: { disconnect: true },
            },
          });
        } else {
          updatedUnit = await prisma.unit.update({
            where: { id: req.params.id },
            data: unitInput,
          });
        }

        return res.status(200).json({ status: 200, data: updatedUnit });
      })
      .catch((err) => {
        return res.status(500).json({ status: 500, message: err.message });
      });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed updating unit." });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  const deletedUnit = await prisma.unit
    .delete({
      where: { id: req.params.id },
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({ status: 400, message: err.message });
      }
      return res
        .status(500)
        .json({ status: 500, message: "Failed deleting unit." });
    });
  return res.status(200).json({ status: 200, data: deletedUnit });
};

export const deleteMultipleUnits = async (req: Request, res: Response) => {
  const units = await prisma.unit
    .deleteMany({
      where: { id: { in: req.body.unitIds } },
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ status: 500, message: "Failed deleting units." });
    });
  return res.status(200).json({ status: 200, data: units });
};

export const addSoldiers = async (req: Request, res: Response) => {
  try {
    const soldierIds: string[] = req.body.soldierIds;
    const unitId: string = req.body.unitId;

    // for (const id of soldierIds) {
    //   const soldier = await prisma.soldier.findUnique({
    //     where: { id },
    //   });

    //   if (!soldier || soldier.unitId) {
    //     return res.status(400).json({
    //       status: 400,
    //       message:
    //         "One or more Soldiers are nonexistent or are already attached to another Unit.",
    //     });
    //   }
    // }

    const unit = await prisma.unit
      .update({
        where: { id: unitId },
        data: {
          soldiers: {
            connect: soldierIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(400).json({
            status: 400,
            message:
              "One or more soldiers are possibly attached to other units.",
          });
        }
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });

    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed adding soldiers." });
  }
};

export const removeSoldiers = async (req: Request, res: Response) => {
  try {
    const soldierIds: string[] = req.body.soldierIds;
    const unitId: string = req.body.unitId;

    const checkUnit = await prisma.unit.findUnique({
      where: { id: unitId },
    });

    if (!checkUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit not found.",
      });
    }
    for (const id of soldierIds) {
      if (id == checkUnit.leaderId) {
        return res.status(400).json({
          status: 400,
          message:
            "You are trying to remove the leader from the Unit, please assign a new leader before removing that Soldier from the Unit.",
        });
      }
    }

    const unit = await prisma.unit
      .update({
        where: { id: unitId },
        data: {
          soldiers: {
            disconnect: soldierIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });

    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed removing soldiers." });
  }
};

export const getAvailableUnits = async (req: Request, res: Response) => {
  try {
    const ofClassLowerThan: number = req.body.ofClassLowerThan || undefined;
    const ofClassHigherThan: number = req.body.ofClassHigherThan || undefined;

    let units;
    if (ofClassLowerThan) {
      units = await prisma.unit.findMany({
        where: {
          status: "ACTIVE",
          parentUnit: undefined || null,
          class: { lt: ofClassLowerThan },
        },
      });
    } else if (ofClassHigherThan) {
      units = await prisma.unit.findMany({
        where: {
          status: "ACTIVE",
          class: { gt: ofClassHigherThan },
        },
      });
    } else {
      units = await prisma.unit.findMany({
        where: { status: "ACTIVE" },
      });
    }
    return res.status(200).json({ status: 200, data: units });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed getting units." });
  }
};

export const addSubUnits = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;
    let subUnitIds: string[] = req.body.subUnitIds;

    const inUnit = await prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!inUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit to update not found.",
      });
    }

    for (const id of subUnitIds) {
      const unit = await prisma.unit.findUnique({
        where: { id },
      });

      if (!unit || unit.class >= inUnit.class) {
        return res.status(400).json({
          status: 400,
          message:
            "One or more Units are nonexistent or of higher or equal class than the chosen Unit's class.",
        });
      }
      if (unit.parentUnitId) {
        return res.status(400).json({
          status: 400,
          message: "One or more Units are already attached to another Unit.",
        });
      }
    }

    const unit = await prisma.unit
      .update({
        where: { id: req.body.unitId },
        data: {
          subUnits: {
            connect: subUnitIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(400).json({
            status: 400,
            message: "One or more units are possibly attached to other units.",
          });
        }
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });
    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed adding subunits." });
  }
};

export const removeSubUnits = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;
    let subUnitIds: string[] = req.body.subUnitIds;

    const inUnit = await prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!inUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit to update not found.",
      });
    }

    const unit = await prisma.unit
      .update({
        where: { id: req.body.unitId },
        data: {
          subUnits: {
            disconnect: subUnitIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });
    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed removing subunits." });
  }
};

export const getEligibleLeaders = async (req: Request, res: Response) => {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id: req.body.unitId },
    });

    if (!unit) {
      return res.status(404).json({ status: 404, message: "Unit not found." });
    }

    let soldiers = null;
    if (unit.type === "TASK_FORCE") {
      soldiers = await prisma.soldier.findMany({
        where: {
          leadsUnit: undefined || null,
          status: "ACTIVE",
          OR: [{ unitId: undefined || null }, { unitId: req.body.unitId }],
        },
      });
    } else {
      soldiers = await prisma.soldier.findMany({
        where: {
          leadsUnit: undefined || null,
          class: {
            gte: unit.class,
          },
          status: "ACTIVE",
          OR: [{ unitId: undefined || null }, { unitId: req.body.unitId }],
        },
      });
    }

    return res.status(200).json({ status: 200, data: soldiers });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed getting soldiers." });
  }
};

export const getIncompleteOrders = async (req: Request, res: Response) => {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id: req.body.unitId },
      select: {
        orders: {
          where: { OR: [{ status: "IN_PROGRESS" }, { status: "PENDING" }] },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({ status: 404, message: "Unit not found." });
    }

    const orders = unit.orders;

    return res.status(200).json({ status: 200, data: orders });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed getting orders." });
  }
};

export const addOrders = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;
    let orderIds: string[] = req.body.orderIds;

    const inUnit = await prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!inUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit to update not found.",
      });
    }

    const unit = await prisma.unit
      .update({
        where: { id: req.body.unitId },
        data: {
          orders: {
            connect: orderIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });
    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed adding orders." });
  }
};

export const removeOrders = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;
    let orderIds: string[] = req.body.orderIds;

    const inUnit = await prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!inUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit to update not found.",
      });
    }

    const unit = await prisma.unit
      .update({
        where: { id: req.body.unitId },
        data: {
          orders: {
            disconnect: orderIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });
    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed removing orders." });
  }
};

export const addEquipment = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;
    let equipmentIds: string[] = req.body.equipmentIds;

    const inUnit = await prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!inUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit to update not found.",
      });
    }

    const unit = await prisma.unit
      .update({
        where: { id: req.body.unitId },
        data: {
          equipment: {
            connect: equipmentIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });
    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed adding equipment." });
  }
};

export const removeEquipment = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;
    let equipmentIds: string[] = req.body.equipmentIds;

    const inUnit = await prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!inUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit to update not found.",
      });
    }

    const unit = await prisma.unit
      .update({
        where: { id: req.body.unitId },
        data: {
          equipment: {
            disconnect: equipmentIds.map((id) => ({ id })),
          },
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating unit." });
      });
    return res.status(200).json({ status: 200, data: unit });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed removing equipment." });
  }
};

export const getActiveDirectOrders = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        orders: {
          where: { OR: [{ status: "IN_PROGRESS" }, { status: "PENDING" }] },
        },
      },
    });
    if (!unit) {
      return res.status(404).json({
        status: 404,
        message: "Unit not found.",
      });
    }

    return res.status(200).json({ status: 200, data: unit.orders });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed getting orders." });
  }
};

export const getActiveIndirectOrders = async (req: Request, res: Response) => {
  try {
    const unitId: string = req.body.unitId;

    const inUnit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: { parentUnitId: true },
    });
    if (!inUnit) {
      return res.status(404).json({
        status: 404,
        message: "Unit not found.",
      });
    }
    let parentUnitId = inUnit.parentUnitId;

    let unit,
      indirectOrders: Order[] = [];
    while (parentUnitId) {
      unit = await prisma.unit
        .findUnique({
          where: { id: parentUnitId },
          include: {
            orders: {
              where: { OR: [{ status: "IN_PROGRESS" }, { status: "PENDING" }] },
            },
          },
        })
        .then((data) => {
          parentUnitId = data?.parentUnitId || null;
          if (!data) return null;
          for (const order of data.orders) {
            indirectOrders.push(order);
          }
        });
    }

    return res.status(200).json({ status: 200, data: indirectOrders });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed getting orders." });
  }
};

export default {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,

  deleteMultipleUnits,
  addSoldiers,
  removeSoldiers,
  getAvailableUnits,
  addSubUnits,
  removeSubUnits,
  getEligibleLeaders,
  getIncompleteOrders,
  addOrders,
  removeOrders,
  addEquipment,
  removeEquipment,
  getActiveDirectOrders,
  getActiveIndirectOrders,
};
