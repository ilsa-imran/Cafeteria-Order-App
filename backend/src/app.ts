import cors from "cors";
import express from "express";
import { authRouter } from "./features/auth/routes.js";
import { menuRouter } from "./features/menu/routes.js";
import { ordersRouter } from "./features/orders/routes.js";
import { pickupVerificationRouter } from "./features/pickup-verification/routes.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/auth", authRouter);
  app.use("/menu", menuRouter);
  app.use("/orders", ordersRouter);
  app.use("/orders", pickupVerificationRouter);

  app.use(errorHandler);

  return app;
}
