import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.js";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  updateMenuItem,
} from "./service.js";
import { createMenuItemSchema, updateMenuItemSchema } from "./schema.js";

export const menuRouter = Router();

menuRouter.get("/", async (_req, res, next) => {
  try {
    const items = await listMenuItems();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

menuRouter.post("/", requireAuth, requireRole("STAFF", "ADMIN"), async (req, res, next) => {
  try {
    const data = createMenuItemSchema.parse(req.body);
    const item = await createMenuItem(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

menuRouter.patch(
  "/:id",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  async (req, res, next) => {
    try {
      const data = updateMenuItemSchema.parse(req.body);
      const item = await updateMenuItem(req.params.id as string, data);
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  },
);

menuRouter.delete(
  "/:id",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  async (req, res, next) => {
    try {
      await deleteMenuItem(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);
