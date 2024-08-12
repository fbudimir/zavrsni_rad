import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const secret_auth = process.env.JWT_SECRET_AUTH || "secret";

export const authCheckMiddleware = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .send({ status: 401, message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ status: 401, message: "Token missing" });
  }

  jwt.verify(token, secret_auth, async (err: any, session: any) => {
    if (err) {
      return res
        .status(403)
        .send({ status: 403, message: "Token is not valid or expired" });
    }

    const checkUser = await prisma.user
      .findUnique({
        where: { email: session.user.email },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          return res
            .status(403)
            .send({ status: 403, message: "Token is not valid or expired" });
        }
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      });
    if (!checkUser) {
      return res
        .status(403)
        .send({ status: 403, message: "Token is not valid or expired" });
    }

    next();
  });
};
