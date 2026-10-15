import { prisma } from "../../db";
import { Ctx, requireUser } from "../../context";
import { mapSubject } from "../subjects/resolvers";

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export const dashboardResolvers = {
  Query: {
    dashboard: async (_: any, __: any, ctx: Ctx) => {
      const user = requireUser(ctx);

      const [answers, attempts] = await Promise.all([
        prisma.attemptAnswer.findMany({
          where: { attempt: { studentId: user.id, status: "SUBMITTED" } },
          include: { question: { select: { topicId: true } } },
        }),
        prisma.attempt.findMany({
          where: { studentId: user.id, status: "SUBMITTED" },
          include: { exam: { include: { subject: { include: { grade: true } } } } },
          orderBy: { submittedAt: "desc" },
        }),
      ]);

      // Practice attempts have a topicId (plain scalar) → resolve topic names in bulk.
      const topicIds = Array.from(
        new Set(attempts.map((a) => a.topicId).filter((t): t is string => !!t))
      );
      const topicsById = new Map<string, { id: string; name: string; subjectId: string }>();
      const subjectsById = new Map<string, { id: string; name: string; color: string; gradeId: number }>();
      if (topicIds.length > 0) {
        const topics = await prisma.topic.findMany({
          where: { id: { in: topicIds } },
          select: { id: true, name: true, subjectId: true },
        });
        topics.forEach((t) => topicsById.set(t.id, t));
        const subjIds = Array.from(new Set(topics.map((t) => t.subjectId)));
        if (subjIds.length > 0) {
          const subjs = await prisma.subject.findMany({
            where: { id: { in: subjIds } },
            select: { id: true, name: true, color: true, gradeId: true },
          });
          subjs.forEach((s) => subjectsById.set(s.id, s));
        }
      }

      const summaryOf = (a: any) => {
        const topic = a.topicId ? topicsById.get(a.topicId) : undefined;
        const subj = topic ? subjectsById.get(topic.subjectId) : undefined;
        return {
          id: a.id,
          mode: a.mode,
          title: a.exam ? a.exam.title : `Practice — ${topic?.name ?? "Topic"}`,
          subjectName: a.exam?.subject?.name ?? subj?.name ?? "",
          grade: a.exam ? a.exam.gradeId : subj ? subj.gradeId : 0,
          percentage: a.percentage ?? 0,
          totalPoints: a.totalPoints,
          maxPoints: a.maxPoints,
          submittedAt: (a.submittedAt ?? a.startedAt).toISOString(),
        };
      };

      const questionsAttempted = answers.length;
      const correct = answers.filter((a) => a.isCorrect).length;
      const correctRate = questionsAttempted ? Math.round((correct / questionsAttempted) * 1000) / 10 : 0;

      const graded = attempts.filter((a) => a.percentage != null);
      const averagePercentage = graded.length
        ? Math.round((graded.reduce((s, a) => s + (a.percentage as number), 0) / graded.length) * 10) / 10
        : null;

      const examCount = attempts.filter((a) => a.mode === "EXAM").length;
      const studyMinutes = Math.round(attempts.reduce((s, a) => s + (a.durationSeconds ?? 0), 0) / 60);

      // Streak: consecutive days (ending today, or yesterday if nothing yet today) with answered questions.
      const daySet = new Set(answers.map((a) => isoDay(a.answeredAt)));
      let streak = 0;
      const cursor = new Date();
      if (!daySet.has(isoDay(cursor))) cursor.setDate(cursor.getDate() - 1);
      while (daySet.has(isoDay(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }

      // Per-topic accuracy (needs at least 3 attempts to count).
      const byTopic: Record<string, { correct: number; total: number }> = {};
      for (const a of answers) {
        const key = a.question.topicId;
        const entry = byTopic[key] || (byTopic[key] = { correct: 0, total: 0 });
        entry.total += 1;
        if (a.isCorrect) entry.correct += 1;
      }
      const topicRows: { topicId: string; accuracy: number; attempts: number }[] = [];
      for (const [topicId, r] of Object.entries(byTopic)) {
        if (r.total < 3) continue;
        topicRows.push({ topicId, accuracy: Math.round((r.correct / r.total) * 1000) / 10, attempts: r.total });
      }
      const topicScore = async (t: { topicId: string; accuracy: number; attempts: number }) => {
        const topic = await prisma.topic.findUnique({
          where: { id: t.topicId },
          include: { subject: { include: { grade: true } }, _count: { select: { materials: true, questions: true } } },
        });
        if (!topic) return null;
        return {
          topic: {
            id: topic.id,
            name: topic.name,
            description: topic.description ?? "",
            order: topic.order,
            subject: mapSubject(topic.subject),
            materialCount: topic._count.materials,
            questionCount: topic._count.questions,
          },
          accuracy: t.accuracy,
          attempts: t.attempts,
        };
      };
      const weak = (await Promise.all(
        topicRows.filter((t) => t.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy).slice(0, 5).map(topicScore)
      )).filter(Boolean);
      const strong = (await Promise.all(
        [...topicRows].filter((t) => t.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy).slice(0, 5).map(topicScore)
      )).filter(Boolean);

      // Per-subject accuracy (map topic → subject in bulk).
      const answerTopicIds = Array.from(new Set(answers.map((a) => a.question.topicId)));
      const topicToSubject = new Map<string, string>();
      if (answerTopicIds.length > 0) {
        const tRows = await prisma.topic.findMany({
          where: { id: { in: answerTopicIds } },
          select: { id: true, subjectId: true },
        });
        tRows.forEach((t) => topicToSubject.set(t.id, t.subjectId));
      }
      const bySubject: Record<string, { correct: number; total: number }> = {};
      for (const a of answers) {
        const subjectId = topicToSubject.get(a.question.topicId);
        if (!subjectId) continue;
        const entry = bySubject[subjectId] || (bySubject[subjectId] = { correct: 0, total: 0 });
        entry.total += 1;
        if (a.isCorrect) entry.correct += 1;
      }
      const subjectIds = Object.keys(bySubject);
      const subjects =
        subjectIds.length > 0
          ? await prisma.subject.findMany({ where: { id: { in: subjectIds } }, include: { grade: true } })
          : [];
      const subjectAccuracy = subjects
        .map((s) => {
          const r = bySubject[s.id];
          return {
            subject: mapSubject(s),
            accuracy: Math.round((r.correct / r.total) * 1000) / 10,
            attempts: r.total,
          };
        })
        .sort((a, b) => b.attempts - a.attempts);

      const recentActivity = attempts.slice(0, 10).map(summaryOf);
      const examResults = attempts.filter((a) => a.mode === "EXAM").slice(0, 12).map(summaryOf);
      const scoreTrend = [...attempts]
        .filter((a) => a.percentage != null)
        .sort((a, b) => a.submittedAt!.getTime() - b.submittedAt!.getTime())
        .slice(-12)
        .map((a) => ({ date: (a.submittedAt as Date).toISOString().slice(0, 10), percentage: a.percentage as number }));

      return {
        questionsAttempted,
        correctRate,
        averagePercentage,
        examCount,
        studyMinutes,
        currentStreak: streak,
        weakTopics: weak,
        strongTopics: strong,
        subjectAccuracy,
        recentActivity,
        examResults,
        scoreTrend,
      };
    },
  },
};
