import { prisma } from "../../db";
import { Ctx, userError, requireUser } from "../../context";

export function mapSubject(s: any) {
  return {
    id: s.id,
    code: s.code,
    name: s.name,
    color: s.color,
    grade: { id: s.grade.id, name: s.grade.name },
    topicCount: s._count?.topics ?? 0,
    examCount: s._count?.exams ?? 0,
  };
}

export function mapTopic(t: any) {
  return {
    id: t.id,
    name: t.name,
    description: t.description ?? "",
    order: t.order,
    subject: t.subject ? mapSubject(t.subject) : null,
    materialCount: t._count?.materials ?? 0,
    questionCount: t._count?.questions ?? 0,
  };
}

export function toPracticeQuestion(q: any) {
  return {
    id: q.id,
    type: q.type,
    difficulty: q.difficulty,
    points: q.points,
    text: q.text,
    options: (q.answers ?? []).map((a: any) => ({ id: a.id, text: a.text })),
  };
}

export function toAdminQuestion(q: any) {
  return {
    id: q.id,
    topicId: q.topicId,
    topicName: q.topic?.name ?? "",
    type: q.type,
    difficulty: q.difficulty,
    points: q.points,
    text: q.text,
    explanation: q.explanation ?? "",
    options: (q.answers ?? []).map((a: any) => ({
      id: a.id,
      text: a.text,
      isCorrect: a.isCorrect,
      keywords: a.keywords ?? [],
      alternatives: a.alternatives ?? [],
    })),
  };
}

export const subjectsResolvers = {
  Query: {
    grades: () =>
      prisma.grade.findMany({ orderBy: { id: "asc" } }).then((gs) =>
        gs.map((g) => ({ id: g.id, name: g.name }))
      ),

    subjects: async (_: any, args: any, ctx: Ctx) => {
      const gradeId = args.gradeId ?? (ctx.user?.role === "STUDENT" ? ctx.user.profile?.grade : undefined);
      const rows = await prisma.subject.findMany({
        where: gradeId ? { gradeId } : {},
        include: { grade: true, _count: { select: { topics: true, exams: true } } },
        orderBy: [{ gradeId: "asc" }, { code: "asc" }],
      });
      return rows.map(mapSubject);
    },

    subject: async (_: any, args: any) => {
      const s = await prisma.subject.findUnique({
        where: { id: args.id },
        include: { grade: true, _count: { select: { topics: true, exams: true } } },
      });
      return s ? mapSubject(s) : null;
    },

    topics: async (_: any, args: any) => {
      const rows = await prisma.topic.findMany({
        where: { subjectId: args.subjectId },
        include: { subject: { include: { grade: true } }, _count: { select: { materials: true, questions: true } } },
        orderBy: { order: "asc" },
      });
      return rows.map(mapTopic);
    },

    topic: async (_: any, args: any) => {
      const t = await prisma.topic.findUnique({
        where: { id: args.id },
        include: { subject: { include: { grade: true } }, _count: { select: { materials: true, questions: true } } },
      });
      return t ? mapTopic(t) : null;
    },

    studyMaterials: (_: any, args: any) =>
      prisma.studyMaterial.findMany({ where: { topicId: args.topicId }, orderBy: { order: "asc" } }),

    questions: async (_: any, args: any) => {
      const where: any = { topicId: args.topicId };
      if (args.questionIds?.length) where.id = { in: args.questionIds };
      if (args.type) where.type = args.type;
      if (args.difficulty) where.difficulty = args.difficulty;
      const rows = await prisma.question.findMany({
        where,
        include: { answers: { orderBy: { order: "asc" } } },
        orderBy: { id: "asc" },
      });
      return rows.map(toPracticeQuestion);
    },

    adminQuestions: async (_: any, args: any, ctx: Ctx) => {
      const { requireStaff } = await import("../../context");
      requireStaff(ctx);
      const rows = await prisma.question.findMany({
        where: { topicId: args.topicId },
        include: { topic: true, answers: { orderBy: { order: "asc" } } },
        orderBy: { id: "asc" },
      });
      return rows.map(toAdminQuestion);
    },

    adminQuestion: async (_: any, args: any, ctx: Ctx) => {
      const { requireStaff } = await import("../../context");
      requireStaff(ctx);
      const q = await prisma.question.findUnique({
        where: { id: args.id },
        include: { topic: true, answers: { orderBy: { order: "asc" } } },
      });
      if (!q) throw userError("Question not found.");
      return toAdminQuestion(q);
    },

    subjectQuestions: async (_: any, args: any, ctx: Ctx) => {
      const { requireStaff } = await import("../../context");
      requireStaff(ctx);
      const rows = await prisma.question.findMany({
        where: { topic: { subjectId: args.subjectId } },
        include: { topic: true, answers: { orderBy: { order: "asc" } } },
        orderBy: { id: "asc" },
      });
      return rows.map(toAdminQuestion);
    },
  },
};
