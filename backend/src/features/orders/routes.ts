import { Router } from "express";
import type { OrderStatus } from "@prisma/client";
import { AppError } from "../../shared/lib/AppError.js";
import { requireAuth, requireRole } from "../../shared/middleware/auth.js";
import {
  cancelOrder,
  createOrder,
  getOrder,
  getOrderQrCode,
  listOrders,
  updateOrderStatus,
} from "./service.js";
import { createOrderSchema, updateOrderStatusSchema } from "./schema.js";

export const ordersRouter = Router();

ordersRouter.post("/", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const { items, pickupTime, pickupTimeMinutes } = createOrderSchema.parse(req.body);
    const order = await createOrder(req.user!.id, items, pickupTime, pickupTimeMinutes);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

ordersRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const status = req.query.status as OrderStatus | undefined;
    const orderNumber = req.query.orderNumber as string | undefined;
    const isStaff = req.user!.role === "STAFF" || req.user!.role === "ADMIN";

    if (!isStaff && (status || orderNumber)) {
      throw new AppError(403, "Students may only list their own orders");
    }

    const orders = await listOrders(
      status,
      orderNumber,
      isStaff ? undefined : req.user!.id,
    );
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

ordersRouter.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id as string, req.user!);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

ordersRouter.get("/:id/qr", requireAuth, async (req, res, next) => {
  try {
    const qrCodeUrl = await getOrderQrCode(req.params.id as string, req.user!);
    res.status(200).json({ qrCodeUrl });
  } catch (err) {
    next(err);
  }
});

ordersRouter.patch(
  "/:id/status",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  async (req, res, next) => {
    try {
      const { status } = updateOrderStatusSchema.parse(req.body);
      const order = await updateOrderStatus(req.params.id as string, status);
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  },
);

ordersRouter.post(
  "/:id/cancel",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  async (req, res, next) => {
    try {
      const order = await cancelOrder(req.params.id as string);
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  },
);
