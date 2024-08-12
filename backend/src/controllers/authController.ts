import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid credentials" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid credentials" });
  }

  const { password: _, ...userWOPassword } = user;
  return res
    .status(200)
    .json({ status: 200, message: "Login successful", data: userWOPassword });
};

export default {
  login,
};
