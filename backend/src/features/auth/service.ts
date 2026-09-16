import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { AppError } from "../../shared/lib/AppError.js";
import { signAuthToken } from "../../shared/lib/jwt.js";
import { prisma } from "../../shared/lib/prisma.js";

async function createUser(name: string, email: string, password: string, role: Role) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletBalance: user.walletBalance,
  };
}

export function registerStudent(name: string, email: string, password: string) {
  return createUser(name, email, password, "STUDENT");
}

export function createStaffAccount(
  name: string,
  email: string,
  password: string,
  role: "STAFF" | "ADMIN",
) {
  return createUser(name, email, password, role);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signAuthToken({ sub: user.id, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
    },
  };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(401, "User no longer exists");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletBalance: user.walletBalance,
  };
}
