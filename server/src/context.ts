import type { PrismaClient, User } from "@prisma/client";
import { prisma } from "./db";
import { verifyToken } from "./auth";

export interface Ctx {
  prisma: PrismaClient;
  user: (User & { profile?: { id: string; grade: number; school: string | null } | null }) | null;
}

export async function createContext(_args: { req: any }): Promise<Ctx> {
  let user: Ctx["user"] = null;
  const auth = _args?.req?.headers?.authorization || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (match) {
    try {
      const payload = verifyToken(match[1]);
      const u = await prisma.user.findUnique({
        where: { id: payload.sub },
        include: { profile: true },
      });
      if (u) user = u;
    } catch {
      // invalid / expired token → treat as anonymous
    }
  }
  return { prisma, user };
}

export function userError(message: string): Error {
  const e = new Error(message);
  (e as any).extensions = { code: "BAD_USER_INPUT" };
  return e;
}

export function forbidden(message = "You do not have permission to do that."): Error {
  const e = new Error(message);
  (e as any).extensions = { code: "FORBIDDEN" };
  return e;
}

export function unauthorized(message = "You must be logged in."): Error {
  const e = new Error(message);
  (e as any).extensions = { code: "UNAUTHENTICATED" };
  return e;
}

export function requireUser(ctx: Ctx): NonNullable<Ctx["user"]> {
  if (!ctx.user) throw unauthorized();
  return ctx.user;
}

/** Teachers and admins. */
export function requireStaff(ctx: Ctx): NonNullable<Ctx["user"]> {
  const u = requireUser(ctx);
  if (u.role === "STUDENT") throw forbidden("Only teachers and admins can manage content.");
  return u;
}

/** Admins only. */
export function requireAdmin(ctx: Ctx): NonNullable<Ctx["user"]> {
  const u = requireUser(ctx);
  if (u.role !== "ADMIN") throw forbidden("Only admins can do that.");
  return u;
}

/** Public (serialisable) shape of a user. */
export function publicUser(u: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  createdAt: Date;
  profile?: { id: string; grade: number; school: string | null } | null;
}) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    profile: u.profile
      ? { id: u.profile.id, grade: u.profile.grade, school: u.profile.school }
      : null,
  };
}
