import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.js";
import { createStaffAccount, getProfile, login, registerStudent } from "./service.js";
import { createStaffSchema, loginSchema, registerSchema } from "./schema.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const user = await registerStudent(name, email, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await login(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await getProfile(req.user!.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/staff", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { name, email, password, role } = createStaffSchema.parse(req.body);
    const user = await createStaffAccount(name, email, password, role);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
