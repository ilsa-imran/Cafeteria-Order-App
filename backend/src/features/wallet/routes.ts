import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.js";
import { findStudentByEmail, topUpWallet } from "./service.js";
import { lookupQuerySchema, topUpSchema } from "./schema.js";

export const walletRouter = Router();

walletRouter.get(
  "/lookup",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  async (req, res, next) => {
    try {
      const { email } = lookupQuerySchema.parse({ email: req.query.email });
      const student = await findStudentByEmail(email);
      res.status(200).json(student);
    } catch (err) {
      next(err);
    }
  },
);

walletRouter.post(
  "/:userId/topup",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  async (req, res, next) => {
    try {
      const { amount } = topUpSchema.parse(req.body);
      const student = await topUpWallet(req.params.userId as string, amount);
      res.status(200).json(student);
    } catch (err) {
      next(err);
    }
  },
);
