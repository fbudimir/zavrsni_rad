import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authRoutes";
import equipmentRouter from "./routes/equipmentRoutes";
import indexRouter from "./routes/index";
import orderRouter from "./routes/orderRoutes";
import soldierRouter from "./routes/soldierRoutes";
import unitRouter from "./routes/unitRoutes";
import userRouter from "./routes/userRoutes";
import {
  decryptRequestMiddleware,
  encryptResponseMiddleware,
} from "./middlewares/encryptDecrypt";
import { authCheckMiddleware } from "./middlewares/authCheckMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.ORIGIN || "http://localhost:3000",
      "http://localhost:3000",
      "*.vercel.app", // za deployment na Vercel
      "*", // za development
    ],
    credentials: true,
  })
);

app.use(decryptRequestMiddleware);
app.use(encryptResponseMiddleware);

app.use("/auth", authRouter);

app.use(authCheckMiddleware);

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/soldiers", soldierRouter);
app.use("/equipment", equipmentRouter);
app.use("/units", unitRouter);
app.use("/orders", orderRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
