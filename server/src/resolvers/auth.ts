import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { signToken } from "../auth";
import { verifyGoogleToken } from "../google";
import { publicUser, userError, requireUser, Ctx } from "../context";

async function roleForEmail(email: string): Promise<"ADMIN" | "STUDENT"> {
  if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
    return "ADMIN";
  }
  const count = await prisma.user.count();
  return count === 0 ? "ADMIN" : "STUDENT";
}

export const authResolvers = {
  Query: {
    me: (_: any, __: any, ctx: Ctx) => (ctx.user ? publicUser(ctx.user) : null),
  },
  Mutation: {
    register: async (_: any, args: any) => {
      const email = String(args.email).toLowerCase().trim();
      const name = String(args.name).trim();
      if (!name) throw userError("Please enter your name.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw userError("Please enter a valid email address.");
      if (String(args.password).length < 6) throw userError("Password must be at least 6 characters long.");
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw userError("An account with this email already exists — try logging in instead.");
      const passwordHash = await bcrypt.hash(args.password, 10);
      const role = await roleForEmail(email);
      const user = await prisma.user.create({
        data: { email, name, passwordHash, role, profile: { create: {} } },
        include: { profile: true },
      });
      return { token: signToken(user), user: publicUser(user) };
    },

    login: async (_: any, args: any) => {
      const email = String(args.email).toLowerCase().trim();
      const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
      if (!user || !user.passwordHash || !(await bcrypt.compare(String(args.password), user.passwordHash))) {
        throw userError("Incorrect email or password.");
      }
      return { token: signToken(user), user: publicUser(user) };
    },

    loginWithGoogle: async (_: any, args: any) => {
      const g = await verifyGoogleToken(args.credential);
      let user = await prisma.user.findUnique({ where: { googleId: g.googleId }, include: { profile: true } });
      if (!user) {
        // A local account with the same email exists → link Google to it.
        user = await prisma.user.findUnique({ where: { email: g.email }, include: { profile: true } });
      }
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: g.googleId,
            name: user.name || g.name,
            avatarUrl: user.avatarUrl || g.picture,
          },
          include: { profile: true },
        });
      } else {
        const role = await roleForEmail(g.email);
        user = await prisma.user.create({
          data: {
            email: g.email,
            googleId: g.googleId,
            name: g.name,
            avatarUrl: g.picture,
            role,
            profile: { create: {} },
          },
          include: { profile: true },
        });
      }
      return { token: signToken(user), user: publicUser(user) };
    },

    updateProfile: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const data: any = {};
      const profileData: any = {};
      if (args.name != null) data.name = String(args.name).trim();
      if (args.grade != null) {
        if (![10, 11, 12].includes(Number(args.grade))) throw userError("Grade must be 10, 11 or 12.");
        profileData.grade = Number(args.grade);
      }
      if (args.school != null) profileData.school = String(args.school).trim();
      if (Object.keys(profileData).length > 0) {
        data.profile = { upsert: { update: profileData, create: { ...profileData } } };
      }
      const updated = await prisma.user.update({
        where: { id: user.id },
        data,
        include: { profile: true },
      });
      return publicUser(updated);
    },
  },
};
