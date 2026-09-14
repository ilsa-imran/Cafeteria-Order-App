import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.js";
import { confirmPickup } from "../orders/service.js";

export const pickupVerificationRouter = Router();

pickupVerificationRouter.post(
  "/:id/pickup",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  async (req, res, next) => {
    try {
      const order = await confirmPickup(req.params.id as string);
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  },
);
