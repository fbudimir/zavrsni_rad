import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { email: true, id: true, name: true },
    });
    return res.status(200).json({ status: 200, data: users });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { email: true, id: true, name: true },
    });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    } else {
      return res.status(200).json({ status: 200, data: user });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Failed creating user." });
  }

  const passwordHashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: passwordHashed },
    });

    const { password: _, ...userWOPWD } = user;

    return res.status(200).json({ status: 200, data: userWOPWD });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ status: 409, message: "Unique constraint violation" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let passwordHashed = undefined;
  if (password) {
    passwordHashed = await bcrypt.hash(password, 10);
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, password: passwordHashed },
    });
    const { password: _, ...userWOPWD } = user;

    return res.status(200).json({ status: 200, data: userWOPWD });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ status: 409, message: "Unique constraint violation" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({
      where: { id: req.params.id },
    });
    const { password: _, ...userWOPWD } = user;

    return res.status(200).json({ status: 200, data: userWOPWD });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const deleteMultipleUsers = async (req: Request, res: Response) => {
  await prisma.user
    .deleteMany({
      where: { id: { in: req.body.userIds } },
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ status: 500, message: "Failed deleting users." });
    });

  return res.status(200).json({ status: 200, message: "Success" });
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  deleteMultipleUsers,
};
