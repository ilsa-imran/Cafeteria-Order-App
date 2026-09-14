import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "./env.js";

export interface AuthTokenPayload {
  sub: string;
  role: Role;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
