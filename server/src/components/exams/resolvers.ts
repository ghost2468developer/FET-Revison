import { prisma } from "../../db";
import { gradeSelection } from "../../grading";
import { Ctx, userError, requireUser } from "../../context";
import { mapSubject, toPracticeQuestion } from "../subjects/resolvers";

export async function mapExamSummary(e: any, userId?: string | null): Promise<any> {
  let bestPercentage: number | null = null;
  if (userId) {
    const best = await prisma.attempt.findFirst({
      where: { examId: e.id, studentId: userId, status: "SUBMITTED" },
      orderBy: { percentage: "desc" },
      select: { percentage: true },
    });
    bestPercentage = best?.percentage ?? null;
  }
  return {
    id: e.id,
    title: e.title,
    description: e.description ?? "",
    durationMinutes: e.durationMinutes,
    questionCount: e.questions?.length ?? 0,
    totalPoints: e.totalPoints,
    subject: mapSubject(e.subject),
    grade: { id: e.gradeId, name: `Grade ${e.gradeId}` },
    bestPercentage,
  };
}

const TOPIC_INCLUDE = { subject: { include: { grade: true } }, _count: { select: { materials: true, questions: true } } };

export async function resolveAttemptView(attemptId: string, studentId: string) {
  const attempt = await prisma.attempt.findFirst({
    where: { id: attemptId, studentId },
    include: {
      exam: { include: { subject: { include: { grade: true } }, questions: true } },
      answers: {
        include: { question: { include: { topic: true, answers: { orderBy: { order: "asc" } } } } },
        orderBy: { answeredAt: "asc" },
      },
    },
  });
  if (!attempt) throw userError("Attempt not found.");

  const topic = attempt.topicId
    ? await prisma.topic.findUnique({ where: { id: attempt.topicId }, include: TOPIC_INCLUDE })
    : null;

  const examSummary = attempt.exam
    ? await mapExamSummary({ ...attempt.exam, gradeId: attempt.exam.gradeId }, studentId)
    : null;

  return {
    id: attempt.id,
    mode: attempt.mode,
    status: attempt.status,
    exam: examSummary,
    topic: topic
      ? {
          id: topic.id,
          name: topic.name,
          description: topic.description ?? "",
          order: topic.order,
          subject: mapSubject(topic.subject),
          materialCount: topic._count.materials,
          questionCount: topic._count.questions,
        }
      : null,
    startedAt: attempt.startedAt.toISOString(),
    submittedAt: attempt.submittedAt ? attempt.submittedAt.toISOString() : null,
    totalPoints: attempt.totalPoints,
    maxPoints: attempt.maxPoints,
    percentage: attempt.percentage,
    durationSeconds: attempt.durationSeconds,
    answers: attempt.answers.map((aa: any) => {
      const q = aa.question;
      const sel = q.answers.find((a: any) => a.id === aa.answerId);
      const correctAns = q.answers.find((a: any) => a.isCorrect);
      return {
        question: {
          id: q.id,
          type: q.type,
          difficulty: q.difficulty,
          points: q.points,
          text: q.text,
          explanation: q.explanation,
          options: q.answers.map((a: any) => ({ id: a.id, text: a.text, isCorrect: a.isCorrect })),
          correctText: q.type === "SHORT_ANSWER" ? correctAns?.text ?? null : null,
        },
        selectedOptionId: aa.answerId,
        selectedOptionText: sel?.text ?? aa.answerText ?? null,
        correctText:
          q.type === "SHORT_ANSWER" ? correctAns?.text ?? null : sel?.text ?? null,
        isCorrect: aa.isCorrect,
        awardedPoints: aa.awardedPoints,
      };
    }),
  };
}

export const examResolvers = {
  Query: {
    exams: async (_: any, args: any, ctx: Ctx) => {
      const gradeId =
        args.gradeId ?? (ctx.user?.role === "STUDENT" ? ctx.user.profile?.grade : undefined);
      const rows = await prisma.exam.findMany({
        where: gradeId ? { gradeId } : {},
        include: {
          subject: { include: { grade: true, _count: { select: { topics: true, exams: true } } } },
          questions: true,
        },
        orderBy: [{ gradeId: "asc" }, { createdAt: "asc" }],
      });
      return Promise.all(rows.map((e) => mapExamSummary(e, ctx.user?.id)));
    },

    exam: async (_: any, args: any, ctx: Ctx) => {
      const e = await prisma.exam.findUnique({
        where: { id: args.id },
        include: { subject: { include: { grade: true, _count: { select: { topics: true, exams: true } } } }, questions: true },
      });
      if (!e) return null;
      return mapExamSummary(e, ctx.user?.id);
    },

    attempt: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      return resolveAttemptView(args.id, user.id);
    },
  },

  Mutation: {
    startExam: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const exam = await prisma.exam.findUnique({
        where: { id: args.examId },
        include: {
          subject: { include: { grade: true } },
          questions: { orderBy: { order: "asc" }, include: { question: { include: { answers: { orderBy: { order: "asc" } } } } } },
        },
      });
      if (!exam) throw userError("Exam not found.");
      if (!exam.questions.length) throw userError("This exam has no questions yet.");
      const grade = user.profile?.grade;
      if (user.role === "STUDENT" && grade && grade !== exam.gradeId) {
        throw userError(`This exam is for Grade ${exam.gradeId}, but your profile says Grade ${grade}. Update your grade in Profile first.`);
      }

      // Abandon any earlier in-progress attempt for this exam.
      await prisma.attempt.deleteMany({
        where: { studentId: user.id, examId: exam.id, status: "IN_PROGRESS" },
      });

      const qs = exam.questions.map((eq: any) => eq.question);
      const totalPoints = qs.reduce((s: number, q: any) => s + q.points, 0);
      const attempt = await prisma.attempt.create({
        data: { studentId: user.id, examId: exam.id, mode: "EXAM", maxPoints: totalPoints },
      });

      return {
        attemptId: attempt.id,
        examId: exam.id,
        title: exam.title,
        subjectName: exam.subject.name,
        durationMinutes: exam.durationMinutes,
        deadlineAt: new Date(Date.now() + exam.durationMinutes * 60_000).toISOString(),
        questions: qs.map(toPracticeQuestion),
      };
    },

    submitExamAnswer: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const attempt = await prisma.attempt.findFirst({
        where: { id: args.attemptId, studentId: user.id, mode: "EXAM" },
      });
      if (!attempt) throw userError("Exam attempt not found.");
      if (attempt.status === "SUBMITTED") throw userError("This exam has already been submitted.");

      const entry = await prisma.examQuestion.findUnique({
        where: { examId_questionId: { examId: attempt.examId!, questionId: args.questionId } },
      });
      if (!entry) throw userError("This question does not belong to the exam.");

      await prisma.attemptAnswer.upsert({
        where: { attemptId_questionId: { attemptId: attempt.id, questionId: args.questionId } },
        update: { answerId: args.answerId ?? null, answerText: args.answerText ?? null, isCorrect: null, awardedPoints: 0 },
        create: {
          attemptId: attempt.id,
          questionId: args.questionId,
          answerId: args.answerId ?? null,
          answerText: args.answerText ?? null,
          isCorrect: null,
          awardedPoints: 0,
        },
      });
      return true;
    },

    submitExam: async (_: any, args: any, ctx: Ctx) => {
      const user = requireUser(ctx);
      const attempt = await prisma.attempt.findFirst({
        where: { id: args.attemptId, studentId: user.id, mode: "EXAM" },
        include: { exam: { include: { questions: { include: { question: { include: { answers: { orderBy: { order: "asc" } } } } } } } } },
      });
      if (!attempt) throw userError("Exam attempt not found.");
      if (attempt.status === "SUBMITTED") throw userError("This exam has already been submitted.");

      const saved = await prisma.attemptAnswer.findMany({ where: { attemptId: attempt.id } });
      let total = 0;
      if (!attempt.exam) throw userError("Attempt is not linked to an exam.");

      for (const eq of attempt.exam.questions) {
        const q = eq.question;
        const sa = saved.find((s) => s.questionId === q.id);
        let isCorrect = false;
        let awarded = 0;
        if (sa) {
          const selected = q.answers.find((a: any) => a.id === sa.answerId);
          const res = gradeSelection(q, selected, sa.answerText);
          isCorrect = res.isCorrect;
          awarded = res.awarded;
        }
        if (sa) {
          await prisma.attemptAnswer.update({ where: { id: sa.id }, data: { isCorrect, awardedPoints: awarded } });
        } else {
          await prisma.attemptAnswer.create({
            data: { attemptId: attempt.id, questionId: q.id, isCorrect: false, awardedPoints: 0 },
          });
        }
        total += awarded;
      }

      const submittedAt = new Date();
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: {
          status: "SUBMITTED",
          submittedAt,
          totalPoints: total,
          percentage: attempt.maxPoints ? Math.round((total / attempt.maxPoints) * 1000) / 10 : 0,
          durationSeconds: Math.max(1, Math.round((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)),
        },
      });

      return resolveAttemptView(attempt.id, user.id);
    },
  },
};
