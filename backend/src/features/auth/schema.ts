import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must include at least one letter")
  .regex(/[0-9]/, "Password must include at least one number");

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: strongPassword,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createStaffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: strongPassword,
  role: z.enum(["STAFF", "ADMIN"]),
});
