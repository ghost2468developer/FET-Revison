import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

export const JWT_SECRET = process.env.JWT_SECRET || "fet-dev-secret-change-me";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(user: Pick<User, "id" | "role">): string {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): { sub: string; role: string } {
  return jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
}
