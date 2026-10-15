import { prisma } from "../db";
import { gradeSelection } from "../grading";
import { Ctx, userError, requireUser } from "../context";
import { toPracticeQuestion, mapTopic } from "./browse";
import { mapExamSummary, resolveAttemptView } from "./exams";

async function finishAttempt(attemptId: string) {
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId } });
  if (!attempt || attempt.status === "SUBMITTED") return attempt;
  const agg = await prisma.attemptAnswer.aggregate({
    where: { attemptId },
    _sum: { awardedPoints: true },
  });
  const total = agg._sum.awardedPoints ?? 0;
  return prisma.attempt.update({
    where: { id: attemptId },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
      totalPoints: total,
      percentage: attempt.maxPoints ? Math.round((total / attempt.maxPoints) * 1000) / 10 : 0,
      durationSeconds: Math.max(1, Math.round((Date.now() - attempt.startedAt.getTime()) / 1000)),
    },
  });
}

export const practiceResolvers = {
  Mutation: {
    startPracticeSession: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const topic = await prisma.topic.findUnique({ where: { id: args.topicId } });
      if (!topic) throw userError("Topic not found.");

      // Abandon any earlier in-progress session for this topic.
      await prisma.attempt.deleteMany({
        where: { studentId: user.id, topicId: topic.id, mode: "PRACTICE", status: "IN_PROGRESS" },
      });

      let ids: string[] | undefined = args.questionIds?.length ? args.questionIds : undefined;
      if (!ids) {
        const qs = await prisma.question.findMany({ where: { topicId: topic.id }, select: { id: true } });
        ids = qs.map((q) => q.id);
      }
      if (!ids?.length) throw userError("No questions available for this topic yet.");
      const qs = await prisma.question.findMany({ where: { id: { in: ids } } });
      if (!qs.length) throw userError("No questions found for this topic.");
      const total = qs.reduce((s: number, q: any) => s + q.points, 0);

      const attempt = await prisma.attempt.create({
        data: { studentId: user.id, topicId: topic.id, mode: "PRACTICE", maxPoints: total },
      });
      return attempt.id;
    },

    submitPracticeAnswer: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const attempt = await prisma.attempt.findFirst({
        where: { id: args.attemptId, studentId: user.id, mode: "PRACTICE" },
      });
      if (!attempt) throw userError("Practice session not found - please start a new one.");
      if (attempt.status === "SUBMITTED") throw userError("This session is already finished.");

      const q = await prisma.question.findFirst({
        where: { id: args.questionId, ...(attempt.topicId ? { topicId: attempt.topicId } : {}) },
        include: { answers: { orderBy: { order: "asc" } } },
      });
      if (!q) throw userError("This question does not belong to the topic you are practising.");

      const selected = q.answers.find((a: any) => a.id === args.answerId);
      const res = gradeSelection(q, selected, args.answerText);

      await prisma.attemptAnswer.upsert({
        where: { attemptId_questionId: { attemptId: attempt.id, questionId: q.id } },
        update: {
          answerId: args.answerId ?? null,
          answerText: args.answerText ?? null,
          isCorrect: res.isCorrect,
          awardedPoints: res.awarded,
        },
        create: {
          attemptId: attempt.id,
          questionId: q.id,
          answerId: args.answerId ?? null,
          answerText: args.answerText ?? null,
          isCorrect: res.isCorrect,
          awardedPoints: res.awarded,
        },
      });

      const agg = await prisma.attemptAnswer.aggregate({
        where: { attemptId: attempt.id },
        _sum: { awardedPoints: true },
        _count: { _all: true },
      });
      const correctAns = q.answers.find((a: any) => a.isCorrect);
      const isShort = q.type === "SHORT_ANSWER";
      return {
        isCorrect: res.isCorrect,
        awardedPoints: res.awarded,
        correctOptionId: isShort ? null : correctAns?.id ?? null,
        correctOptionText: isShort ? null : correctAns?.text ?? null,
        correctText: isShort ? correctAns?.text ?? null : null,
        explanation: q.explanation ?? null,
        totalPoints: agg._sum.awardedPoints ?? 0,
        maxPoints: attempt.maxPoints,
        answeredCount: agg._count._all,
      };
    },

    finishPracticeSession: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const attempt = await prisma.attempt.findFirst({
        where: { id: args.attemptId, studentId: user.id, mode: "PRACTICE" },
      });
      if (!attempt) throw userError("Practice session not found.");
      await finishAttempt(attempt.id);
      return resolveAttemptView(attempt.id, user.id);
    },
  },

  Query: {
    myAttempts: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const limit = Math.min(Number(args.limit) || 30, 100);
      const rows = await prisma.attempt.findMany({
        where: { studentId: user.id, status: "SUBMITTED", ...(args.mode ? { mode: args.mode } : {}) },
        include: { exam: { include: { subject: { include: { grade: true } } } } },
        orderBy: { submittedAt: "desc" },
        take: limit,
      });
      const topicIds = Array.from(new Set(rows.map((a) => a.topicId).filter((t): t is string => !!t)));
      const topics = topicIds.length
        ? await prisma.topic.findMany({ where: { id: { in: topicIds } }, include: { subject: { include: { grade: true } } } })
        : [];
      const topicById = new Map(topics.map((t) => [t.id, t]));
      return rows.map((a: any) => {
        const t = a.topicId ? topicById.get(a.topicId) : undefined;
        return {
          id: a.id,
          mode: a.mode,
          title: a.exam ? a.exam.title : `Practice - ${t?.name ?? "Topic"}`,
          subjectName: a.exam?.subject?.name ?? t?.subject?.name ?? "",
          grade: a.exam?.gradeId ?? t?.subject?.gradeId ?? 0,
          percentage: a.percentage ?? 0,
          totalPoints: a.totalPoints,
          maxPoints: a.maxPoints,
          submittedAt: (a.submittedAt ?? a.startedAt).toISOString(),
        };
      });
    },
  },
};
