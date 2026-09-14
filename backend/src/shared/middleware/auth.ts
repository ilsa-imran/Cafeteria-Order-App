import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { AppError } from "../lib/AppError.js";
import { verifyAuthToken } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    const payload = verifyAuthToken(header.slice("Bearer ".length));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have permission to do this"));
    }
    next();
  };
}
