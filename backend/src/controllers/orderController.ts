import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { OrderPriority, OrderStatus, Prisma } from "@prisma/client";

type CreateOrderInput = {
  priority?: OrderPriority;
  status?: OrderStatus;
  description?: string;
};

type UpdateOrderInput = {
  priority?: OrderPriority;
  status?: OrderStatus;
  description?: string;
};

const fixedColors = [
  "#001aff",
  "#ffa600",
  "#9d00ff",
  "#62bd00",
  "#ff00aa",
  "#ff0000",
  "#027d52",
  "#008cff",
  "#607a00",
  "#c2b200",
  "#008c99",
  "#008528",
  "#940099",
  "#ff6a00",
];

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      assignedUnits: true,
    },
  });
  return res.status(200).json({ status: 200, data: orders });
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      assignedUnits: true,
    },
  });
  if (!order) {
    return res.status(404).json({ status: 404, message: "Order not found" });
  }

  let newMapData = JSON.parse(order.mapData);
  for (const unit of order.assignedUnits) {
    if (
      unit.ePosition !== null &&
      unit.ePosition !== undefined &&
      unit.nPosition !== null &&
      unit.nPosition !== undefined
    ) {
      const mapUnit = newMapData.units.find((u: any) => u.id === unit.id);
      if (mapUnit) {
        mapUnit.nPosition = unit.nPosition;
        mapUnit.ePosition = unit.ePosition;
      }
    }
  }

  const newOrder = { ...order, mapData: JSON.stringify(newMapData) };
  // console.log(newOrder);

  return res.status(200).json({ status: 200, data: newOrder });
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderInput: CreateOrderInput = req.body;
    if (
      orderInput.priority &&
      !Object.values(OrderPriority).includes(orderInput.priority)
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid arguments." });
    }

    if (
      orderInput.status &&
      !Object.values(OrderStatus).includes(orderInput.status)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    const mapData = {
      shapes: undefined,
      circles: undefined,
      center: undefined,
      zoom: undefined,
      units: [
        { id: "123", name: "Draw Red", color: "#9e271e" },
        { id: "345", name: "Draw Gray", color: "#595959" },
      ],
    };

    const newOrder = await prisma.order
      .create({
        data: { ...orderInput, mapData: JSON.stringify(mapData) },
      })
      .catch((err) => {
        if (
          (err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2000") ||
          err.code === "P2004"
        ) {
          return res
            .status(400)
            .json({ status: 400, message: "Invalid arguments." });
        } else {
          return res
            .status(500)
            .json({ status: 500, message: "Unexpected error occured." });
        }
      });

    return res.status(200).json({ status: 200, data: newOrder });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed creating order." });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const orderInput: UpdateOrderInput = req.body;
    if (
      orderInput.priority &&
      !Object.values(OrderPriority).includes(orderInput.priority)
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid arguments." });
    }

    if (
      orderInput.status &&
      !Object.values(OrderStatus).includes(orderInput.status)
    ) {
      return res.status(400).json({ status: 400, message: "Bad input." });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: orderInput,
    });

    return res.status(200).json({ status: 200, data: updatedOrder });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed updating order." });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await prisma.order.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({ status: 200, data: deletedOrder });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed deleting order." });
  }
};

export const deleteMultipleOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order
    .deleteMany({
      where: { id: { in: req.body.orderIds } },
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ status: 500, message: "Failed deleting orders." });
    });
  return res.status(200).json({ status: 200, data: orders });
};

export const getAvailableOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "PENDING" || "IN_PROGRESS" },
    });

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

export const addUnits = async (req: Request, res: Response) => {
  try {
    const unitIds: string[] = req.body.unitIds;
    const orderId: string = req.body.orderId;

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ status: 404, message: "Not found." });
    }

    let newMapData = JSON.parse(order.mapData);
    const mapDataUnits: any[] = newMapData.units;
    const mapDataUnitsIds: string[] = mapDataUnits.map((unit) => unit.id);
    // let count = mapDataUnits.length - 2;

    for (const id of unitIds) {
      const name = (await prisma.unit.findUnique({ where: { id } }))?.name;

      if (name && !mapDataUnitsIds.includes(id)) {
        // random color generator ali prvih 14 su predvidivo razlicite i vidljive
        let color;
        // if (count < 14) {
        //   color = fixedColors[count];
        // } else {
        color =
          "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
        // }
        // count++;

        mapDataUnits.push({ id, name, color });
      }
    }
    newMapData.units = mapDataUnits;
    newMapData = JSON.stringify(newMapData);

    const updatedOrder = await prisma.order
      .update({
        where: { id: orderId },
        data: {
          assignedUnits: {
            connect: unitIds.map((id) => ({ id })),
          },
          mapData: newMapData,
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating order." });
      });

    return res.status(200).json({ status: 200, data: updatedOrder });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed adding units." });
  }
};

export const removeUnits = async (req: Request, res: Response) => {
  try {
    const unitIds: string[] = req.body.unitIds;
    const orderId: string = req.body.orderId;

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ status: 404, message: "Not found." });
    }

    let newMapData = JSON.parse(order.mapData);
    const mapDataUnits: any[] = newMapData.units;

    newMapData.units = mapDataUnits.filter((unit) => {
      return !unitIds.includes(unit.id);
    });
    newMapData = JSON.stringify(newMapData);

    const updatedOrder = await prisma.order
      .update({
        where: { id: orderId },
        data: {
          assignedUnits: {
            disconnect: unitIds.map((id) => ({ id })),
          },
          mapData: newMapData,
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating order." });
      });

    return res.status(200).json({ status: 200, data: updatedOrder });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed removing units." });
  }
};

export const updateMapData = async (req: Request, res: Response) => {
  try {
    const orderId: string = req.body.orderId;
    const data: any = JSON.parse(req.body.otherMapData);

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ status: 404, message: "Not found." });
    }

    let newMapData = JSON.parse(order.mapData);
    newMapData = { ...data, units: newMapData.units };
    newMapData = JSON.stringify(newMapData);

    const updatedOrder = await prisma.order
      .update({
        where: { id: orderId },
        data: {
          mapData: newMapData,
        },
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Failed updating order." });
      });

    return res.status(200).json({ status: 200, data: updatedOrder });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ status: 400, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Failed updating map data." });
  }
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,

  deleteMultipleOrders,
  getAvailableOrders,
  addUnits,
  removeUnits,
  updateMapData,
};
