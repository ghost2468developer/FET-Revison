import { prisma } from "../db";
import { Ctx, userError, requireStaff, requireAdmin, publicUser } from "../context";
import { mapSubject, toAdminQuestion } from "./browse";
import { mapExamSummary } from "./exams";

async function recalcExamPoints(examId: string) {
  const rows = await prisma.examQuestion.findMany({
    where: { examId },
    include: { question: { select: { points: true } } },
  });
  const total = rows.reduce((s, r) => s + r.question.points, 0);
  await prisma.exam.update({ where: { id: examId }, data: { totalPoints: total } });
}

function validateOptions(type: string, options: any[]): void {
  if (!Array.isArray(options) || options.length === 0) throw userError("At least one option is required.");
  const correctCount = options.filter((o) => o.isCorrect).length;
  if (type === "MCQ") {
    if (options.length < 2 || options.length > 6) throw userError("Multiple choice questions need 2–6 options.");
    if (correctCount !== 1) throw userError("Mark exactly one option as correct.");
  } else if (type === "TRUE_FALSE") {
    if (options.length !== 2 || correctCount !== 1) throw userError("True/False needs exactly two options, one correct.");
  } else if (type === "SHORT_ANSWER") {
    if (correctCount < 1) throw userError("Mark at least one expected answer as correct.");
  }
}

export const adminResolvers = {
  Query: {
    users: async (_: any, __: any, ctx: Ctx) => {
      requireAdmin(ctx);
      const rows = await prisma.user.findMany({ orderBy: { createdAt: "asc" }, include: { profile: true } });
      return rows.map(publicUser);
    },

    examQuestions: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const rows = await prisma.examQuestion.findMany({
        where: { examId: args.examId },
        include: { question: { include: { topic: true, answers: { orderBy: { order: "asc" } } } } },
        orderBy: { order: "asc" },
      });
      return rows.map((r) => toAdminQuestion(r.question));
    },
  },

  Mutation: {
    // ---------------- subjects ----------------
    createSubject: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      if (![10, 11, 12].includes(Number(args.gradeId))) throw userError("Grade must be 10, 11 or 12.");
      const code = String(args.code).toUpperCase().trim();
      const name = String(args.name).trim();
      if (!code || !name) throw userError("Code and name are required.");
      const dup = await prisma.subject.findUnique({
        where: { gradeId_code: { gradeId: Number(args.gradeId), code } },
      });
      if (dup) throw userError(`Grade ${args.gradeId} already has a subject with code "${code}".`);
      const s = await prisma.subject.create({
        data: {
          gradeId: Number(args.gradeId),
          code,
          name,
          color: args.color || "#4f46e5",
        },
        include: { grade: true, _count: { select: { topics: true, exams: true } } },
      });
      return mapSubject(s);
    },

    updateSubject: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const data: any = {};
      if (args.code != null) data.code = String(args.code).toUpperCase().trim();
      if (args.name != null) data.name = String(args.name).trim();
      if (args.color != null) data.color = String(args.color).trim();
      const s = await prisma.subject.update({
        where: { id: args.id },
        data,
        include: { grade: true, _count: { select: { topics: true, exams: true } } },
      });
      return mapSubject(s);
    },

    deleteSubject: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const topics = await prisma.topic.findMany({ where: { subjectId: args.id }, select: { id: true } });
      await prisma.attempt.deleteMany({ where: { topicId: { in: topics.map((t) => t.id) } } });
      await prisma.subject.delete({ where: { id: args.id } });
      return true;
    },

    // ---------------- topics ----------------
    createTopic: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const count = await prisma.topic.count({ where: { subjectId: args.subjectId } });
      const t = await prisma.topic.create({
        data: {
          subjectId: args.subjectId,
          name: String(args.name).trim(),
          description: args.description ?? null,
          order: count,
        },
        include: { subject: { include: { grade: true } }, _count: { select: { materials: true, questions: true } } },
      });
      const { mapTopic } = await import("./browse");
      return mapTopic(t);
    },

    updateTopic: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const data: any = {};
      if (args.name != null) data.name = String(args.name).trim();
      if (args.description != null) data.description = String(args.description).trim();
      const t = await prisma.topic.update({
        where: { id: args.id },
        data,
        include: { subject: { include: { grade: true } }, _count: { select: { materials: true, questions: true } } },
      });
      const { mapTopic } = await import("./browse");
      return mapTopic(t);
    },

    deleteTopic: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      await prisma.attempt.deleteMany({ where: { topicId: args.id } });
      await prisma.topic.delete({ where: { id: args.id } });
      return true;
    },

    // ---------------- study materials ----------------
    createStudyMaterial: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const order = (await prisma.studyMaterial.count({ where: { topicId: args.topicId } }));
      return prisma.studyMaterial.create({
        data: {
          topicId: args.topicId,
          type: args.type,
          title: String(args.title).trim(),
          content: String(args.content).trim(),
          order,
        },
      });
    },

    deleteStudyMaterial: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      await prisma.studyMaterial.delete({ where: { id: args.id } });
      return true;
    },

    // ---------------- questions ----------------
    createQuestion: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      validateOptions(args.type, args.options);
      const topic = await prisma.topic.findUnique({ where: { id: args.topicId } });
      if (!topic) throw userError("Topic not found.");
      const q = await prisma.question.create({
        data: {
          topicId: args.topicId,
          type: args.type,
          difficulty: args.difficulty ?? "MEDIUM",
          points: Number(args.points) || 2,
          text: String(args.text).trim(),
          explanation: args.explanation ?? null,
          answers: {
            create: args.options.map((o: any, i: number) => ({
              text: String(o.text).trim(),
              isCorrect: !!o.isCorrect,
              order: i,
              keywords: o.keywords ?? [],
              alternatives: o.alternatives ?? [],
            })),
          },
        },
        include: { topic: true, answers: { orderBy: { order: "asc" } } },
      });
      return toAdminQuestion(q);
    },

    updateQuestion: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const q = await prisma.question.findUnique({ where: { id: args.id }, include: { answers: true } });
      if (!q) throw userError("Question not found.");
      const data: any = {};
      if (args.text != null) data.text = String(args.text).trim();
      if (args.explanation != null) data.explanation = args.explanation;
      if (args.points != null) data.points = Number(args.points) || q.points;
      if (args.options) {
        validateOptions(q.type, args.options);
        await prisma.answer.deleteMany({ where: { questionId: q.id } });
        data.answers = {
          create: args.options.map((o: any, i: number) => ({
            text: String(o.text).trim(),
            isCorrect: !!o.isCorrect,
            order: i,
            keywords: o.keywords ?? [],
            alternatives: o.alternatives ?? [],
          })),
        };
      }
      const updated = await prisma.question.update({
        where: { id: q.id },
        data,
        include: { topic: true, answers: { orderBy: { order: "asc" } } },
      });
      return toAdminQuestion(updated);
    },

    deleteQuestion: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const q = await prisma.question.findUnique({ where: { id: args.id }, include: { examEntries: true } });
      if (q && q.examEntries.length) throw userError("Remove this question from any exams first.");
      await prisma.question.delete({ where: { id: args.id } });
      return true;
    },

    // ---------------- exams ----------------
    createExam: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const subject = await prisma.subject.findUnique({ where: { id: args.subjectId }, include: { grade: true } });
      if (!subject) throw userError("Subject not found.");
      if (Number(args.gradeId) !== subject.gradeId) throw userError("The exam grade must match the subject's grade.");
      const e = await prisma.exam.create({
        data: {
          gradeId: Number(args.gradeId),
          subjectId: subject.id,
          title: String(args.title).trim(),
          description: args.description ?? null,
          durationMinutes: Number(args.durationMinutes) || 45,
        },
        include: { subject: { include: { grade: true, _count: { select: { topics: true, exams: true } } } }, questions: true },
      });
      return mapExamSummary(e);
    },

    updateExam: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const data: any = {};
      if (args.title != null) data.title = String(args.title).trim();
      if (args.description != null) data.description = args.description;
      if (args.durationMinutes != null) data.durationMinutes = Number(args.durationMinutes) || 45;
      const e = await prisma.exam.update({
        where: { id: args.id },
        data,
        include: { subject: { include: { grade: true, _count: { select: { topics: true, exams: true } } } }, questions: true },
      });
      return mapExamSummary(e);
    },

    deleteExam: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      await prisma.exam.delete({ where: { id: args.id } });
      return true;
    },

    addExamQuestion: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const exam = await prisma.exam.findUnique({ where: { id: args.examId }, include: { subject: true } });
      if (!exam) throw userError("Exam not found.");
      const q = await prisma.question.findFirst({
        where: { id: args.questionId, topic: { subjectId: exam.subjectId } },
      });
      if (!q) throw userError("That question does not belong to the exam's subject.");
      const existing = await prisma.examQuestion.findUnique({
        where: { examId_questionId: { examId: exam.id, questionId: q.id } },
      });
      if (existing) throw userError("That question is already in the exam.");
      const order = await prisma.examQuestion.count({ where: { examId: exam.id } });
      await prisma.examQuestion.create({ data: { examId: exam.id, questionId: q.id, order } });
      await recalcExamPoints(exam.id);
      const e = await prisma.exam.findUnique({
        where: { id: exam.id },
        include: { subject: { include: { grade: true, _count: { select: { topics: true, exams: true } } } }, questions: true },
      });
      return mapExamSummary(e);
    },

    removeExamQuestion: async (_: any, args: any, ctx: Ctx) => {
      requireStaff(ctx);
      const removed = await prisma.examQuestion.deleteMany({
        where: { examId: args.examId, questionId: args.questionId },
      });
      if (!removed.count) throw userError("That question is not in this exam.");
      // renumber
      const rows = await prisma.examQuestion.findMany({ where: { examId: args.examId }, orderBy: { order: "asc" } });
      await Promise.all(rows.map((r, i) => prisma.examQuestion.update({ where: { id: r.id }, data: { order: i } })));
      await recalcExamPoints(args.examId);
      const e = await prisma.exam.findUnique({
        where: { id: args.examId },
        include: { subject: { include: { grade: true, _count: { select: { topics: true, exams: true } } } }, questions: true },
      });
      return mapExamSummary(e);
    },

    // ---------------- users (admin) ----------------
    setUserRole: async (_: any, args: any, ctx: Ctx) => {
      const admin = requireAdmin(ctx);
      if (args.userId === admin.id) throw userError("You cannot change your own role.");
      const target = await prisma.user.findUnique({ where: { id: args.userId }, include: { profile: true } });
      if (!target) throw userError("User not found.");
      const updated = await prisma.user.update({ where: { id: target.id }, data: { role: args.role } });
      return publicUser({ ...updated, profile: target.profile });
    },
  },
};
