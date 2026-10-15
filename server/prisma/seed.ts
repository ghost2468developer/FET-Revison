import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SUBJECTS, SubjectSeed, SeedQuestion } from "./data";
import { gradeSelection, QuestionLike } from "../src/grading";

const prisma = new PrismaClient();

const DAY = 86_400_000;
const MIN = 60_000;

function seedQuestionToLike(q: SeedQuestion): QuestionLike {
  return {
    type: q.type,
    points: q.points ?? 2,
    answers: q.options.map((o) => ({
      text: o.text,
      isCorrect: !!o.correct,
      keywords: o.keywords ?? [],
      alternatives: o.alternatives ?? [],
    })),
  };
}

async function main() {
  console.log("🌱 Seeding FETRevise...");

  // ---- clean slate ----
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.grade.deleteMany();

  // ---- grades ----
  for (const g of [
    { id: 10, name: "Grade 10" },
    { id: 11, name: "Grade 11" },
    { id: 12, name: "Grade 12" },
  ]) {
    await prisma.grade.create({ data: g });
  }

  // ---- subjects / topics / materials / questions ----
  const subjectQuestions: Record<string, { id: string; seed: SeedQuestion }[]> = {};

  for (const ss of SUBJECTS) {
    const subject = await prisma.subject.create({
      data: {
        gradeId: ss.grade,
        code: ss.code,
        name: ss.name,
        color: ss.color,
      },
    });

    const subjectPool: { id: string; seed: SeedQuestion }[] = [];

    for (let t = 0; t < ss.topics.length; t++) {
      const st = ss.topics[t];
      const topic = await prisma.topic.create({
        data: {
          subjectId: subject.id,
          name: st.name,
          description: st.description ?? null,
          order: t,
        },
      });

      for (let m = 0; m < st.materials.length; m++) {
        const mat = st.materials[m];
        await prisma.studyMaterial.create({
          data: {
            topicId: topic.id,
            type: mat.type,
            title: mat.title,
            content: mat.content,
            order: m,
          },
        });
      }

      for (let qi = 0; qi < st.questions.length; qi++) {
        const sq = st.questions[qi];
        const question = await prisma.question.create({
          data: {
            topicId: topic.id,
            type: sq.type,
            difficulty: sq.difficulty ?? "MEDIUM",
            points: sq.points ?? 2,
            text: sq.text,
            explanation: sq.explanation ?? null,
            answers: {
              create: sq.options.map((o, i) => ({
                text: o.text,
                isCorrect: !!o.correct,
                order: i,
                keywords: o.keywords ?? [],
                alternatives: o.alternatives ?? [],
              })),
            },
          },
        });
        subjectPool.push({ id: question.id, seed: sq });
      }
    }
    subjectQuestions[subject.id] = subjectPool;
  }

  // ---- mock exams (10 questions each, drawn across the topics) ----
  for (const ss of SUBJECTS) {
    const subject = await prisma.subject.findUniqueOrThrow({ where: { gradeId_code: { gradeId: ss.grade, code: ss.code } } });
    const pool = subjectQuestions[subject.id];
    // take 4 from the first topic, 3 from the second, 3 from the third
    const chosen = pool.slice(0, 10);
    const exam = await prisma.exam.create({
      data: {
        gradeId: ss.grade,
        subjectId: subject.id,
        title: ss.examTitle ?? `Grade ${ss.grade} ${ss.name} Mock Exam`,
        description: `A timed mock paper drawn from the Grade ${ss.grade} ${ss.name} topics. ${chosen.length} questions, marked automatically.`,
        durationMinutes: ss.examDuration ?? 45,
      },
    });
    for (let i = 0; i < chosen.length; i++) {
      await prisma.examQuestion.create({
        data: { examId: exam.id, questionId: chosen[i].id, order: i },
      });
    }
    const totalPoints = chosen.reduce((s, c) => s + (c.seed.points ?? 2), 0);
    await prisma.exam.update({ where: { id: exam.id }, data: { totalPoints } });
  }

  // ---- demo accounts ----
  await prisma.user.create({
    data: {
      email: "admin@fet.co.za",
      name: "Naledi Admin",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      role: "ADMIN",
      profile: { create: { grade: 12 } },
    },
  });
  await prisma.user.create({
    data: {
      email: "teacher@fet.co.za",
      name: "Sipho Teacher",
      passwordHash: await bcrypt.hash("Teacher123!", 10),
      role: "TEACHER",
      profile: { create: { grade: 12 } },
    },
  });
  const demo = await prisma.user.create({
    data: {
      email: "demo@fet.co.za",
      name: "Thandi Mokoena",
      passwordHash: await bcrypt.hash("Student123!", 10),
      role: "STUDENT",
      profile: { create: { grade: 12, school: "Johannesburg College of Science" } },
    },
  });

  // ---- realistic study history for the demo student ----
  const math12 = (await prisma.subject.findUniqueOrThrow({ where: { gradeId_code: { gradeId: 12, code: "MATH" } } }));
  const phy12 = (await prisma.subject.findUniqueOrThrow({ where: { gradeId_code: { gradeId: 12, code: "PHY" } } }));
  const life12 = (await prisma.subject.findUniqueOrThrow({ where: { gradeId_code: { gradeId: 12, code: "LS" } } }));

  const topicOf = async (subjectId: string, index: number) =>
    prisma.topic.findFirstOrThrow({ where: { subjectId }, orderBy: { order: "asc" }, skip: index });

  const qsOfTopic = async (topicId: string) => {
    const rows = await prisma.question.findMany({
      where: { topicId },
      include: { answers: { orderBy: { order: "asc" } } },
      orderBy: { id: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      seed: {
        type: row.type,
        points: row.points,
        options: row.answers.map((a) => ({
          text: a.text,
          correct: a.isCorrect,
          keywords: a.keywords,
          alternatives: a.alternatives,
        })),
      } as SeedQuestion,
    }));
  };

  interface Pick {
    qid: string;
    like: QuestionLike;
    correct: boolean;
  }

  async function makeAttempt(opts: {
    mode: "PRACTICE" | "EXAM";
    examId?: string;
    topicId?: string;
    daysAgo: number;
    startOffsetMin?: number;
    durationMin: number;
    picks: Pick[];
  }) {
    const startedAt = new Date(Date.now() - opts.daysAgo * DAY - (opts.startOffsetMin ?? 0) * MIN);
    const submittedAt = new Date(startedAt.getTime() + opts.durationMin * MIN);
    const maxPoints = opts.picks.reduce((s, p) => s + p.like.points, 0);
    const attempt = await prisma.attempt.create({
      data: {
        studentId: demo.id,
        examId: opts.examId,
        topicId: opts.topicId,
        mode: opts.mode,
        status: "SUBMITTED",
        startedAt,
        submittedAt,
        maxPoints,
        percentage: 0,
        durationSeconds: Math.round(opts.durationMin * 60),
      },
    });
    let total = 0;
    for (const [i, p] of opts.picks.entries()) {
      // correct → the correct answer row; incorrect → first incorrect row / a wrong text
      const correctRow = p.like.answers.find((a) => a.isCorrect);
      const wrongRow = p.like.answers.find((a) => !a.isCorrect);
      let answerId: string | null = null;
      let answerText: string | null = null;
      if (p.like.type === "SHORT_ANSWER") {
        answerText = p.correct ? correctRow!.text : "I'm not sure";
      } else {
        const row = p.correct ? correctRow! : wrongRow ?? correctRow!;
        // look up the real row id in the DB by text
        const dbRow = await prisma.answer.findFirst({
          where: { questionId: p.qid, text: row.text },
        });
        answerId = dbRow?.id ?? null;
      }
      const res = gradeSelection(p.like, p.correct ? correctRow : (p.like.type === "SHORT_ANSWER" ? null : wrongRow ?? null), answerText);
      total += res.awarded;
      await prisma.attemptAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: p.qid,
          answerId,
          answerText,
          isCorrect: res.isCorrect,
          awardedPoints: res.awarded,
          answeredAt: new Date(startedAt.getTime() + (i + 1) * 90_000),
        },
      });
    }
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: { totalPoints: total, percentage: Math.round((total / maxPoints) * 1000) / 10 },
    });
  }

  const buildPicks = (qs: Awaited<ReturnType<typeof qsOfTopic>>, correctFlags: boolean[]): Pick[] =>
    qs.slice(0, correctFlags.length).map((q, i) => ({
      qid: q.id,
      like: seedQuestionToLike(q.seed),
      correct: correctFlags[i],
    }));

  // 1) 12 days ago - MATH: Functions & transformations (4 questions, 3 correct)
  {
    const topic = await topicOf(math12.id, 0);
    const qs = await qsOfTopic(topic.id);
    await makeAttempt({
      mode: "PRACTICE", topicId: topic.id, daysAgo: 12, durationMin: 9,
      picks: buildPicks(qs, [true, true, false, true]),
    });
  }
  // 2) 9 days ago - PHYS: Geometrical optics (4 questions, 2 correct)
  {
    const topic = await topicOf(phy12.id, 0);
    const qs = await qsOfTopic(topic.id);
    await makeAttempt({
      mode: "PRACTICE", topicId: topic.id, daysAgo: 9, durationMin: 10,
      picks: buildPicks(qs, [true, false, true, true]),
    });
  }
  // 3) 6 days ago - MATH: Trig graphs & addition formulas (4 correct)
  {
    const topic = await topicOf(math12.id, 1);
    const qs = await qsOfTopic(topic.id);
    await makeAttempt({
      mode: "PRACTICE", topicId: topic.id, daysAgo: 6, durationMin: 8,
      picks: buildPicks(qs, [true, true, true, true]),
    });
  }
  // 4) 5 days ago - MATH mock exam (10 questions, 8 correct)
  {
    const exam = await prisma.exam.findFirstOrThrow({ where: { subjectId: math12.id } });
    const rows = await prisma.examQuestion.findMany({
      where: { examId: exam.id },
      include: { question: { include: { answers: { orderBy: { order: "asc" } } } } },
      orderBy: { order: "asc" },
    });
    const picks: Pick[] = rows.map((r, i) => ({
      qid: r.questionId,
      like: {
        type: r.question.type,
        points: r.question.points,
        answers: r.question.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect, keywords: a.keywords, alternatives: a.alternatives })),
      },
      correct: i !== 3 && i !== 7,
    }));
    await makeAttempt({ mode: "EXAM", examId: exam.id, daysAgo: 5, durationMin: 42, picks });
  }
  // 5) 3 days ago - LIFE: Cell respiration & photosynthesis (4 questions, 3 correct)
  {
    const topic = await topicOf(life12.id, 0);
    const qs = await qsOfTopic(topic.id);
    await makeAttempt({
      mode: "PRACTICE", topicId: topic.id, daysAgo: 3, durationMin: 7,
      picks: buildPicks(qs, [true, true, false, true]),
    });
  }
  // 6) 1 day ago - PHYS mock exam (10 questions, 6 correct)
  {
    const exam = await prisma.exam.findFirstOrThrow({ where: { subjectId: phy12.id } });
    const rows = await prisma.examQuestion.findMany({
      where: { examId: exam.id },
      include: { question: { include: { answers: { orderBy: { order: "asc" } } } } },
      orderBy: { order: "asc" },
    });
    const picks: Pick[] = rows.map((r, i) => ({
      qid: r.questionId,
      like: {
        type: r.question.type,
        points: r.question.points,
        answers: r.question.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect, keywords: a.keywords, alternatives: a.alternatives })),
      },
      correct: [true, false, true, true, false, true, false, true, true, false][i] === true,
    }));
    await makeAttempt({ mode: "EXAM", examId: exam.id, daysAgo: 1, durationMin: 38, picks });
  }
  // 7) today - MATH: Permutations & combinations (3 questions, 2 correct)
  {
    const topic = await topicOf(math12.id, 2);
    const qs = await qsOfTopic(topic.id);
    await makeAttempt({
      mode: "PRACTICE", topicId: topic.id, daysAgo: 0, startOffsetMin: 30, durationMin: 5,
      picks: buildPicks(qs, [true, false, true]),
    });
  }

  const counts = {
    users: await prisma.user.count(),
    subjects: await prisma.subject.count(),
    topics: await prisma.topic.count(),
    materials: await prisma.studyMaterial.count(),
    questions: await prisma.question.count(),
    answers: await prisma.answer.count(),
    exams: await prisma.exam.count(),
    examQuestions: await prisma.examQuestion.count(),
    attempts: await prisma.attempt.count(),
    attemptAnswers: await prisma.attemptAnswer.count(),
  };
  console.log("✅ Seed complete:", JSON.stringify(counts, null, 2));
  console.log("   Demo accounts:");
  console.log("     admin@fet.co.za    / Admin123!    (ADMIN)");
  console.log("     teacher@fet.co.za  / Teacher123!  (TEACHER)");
  console.log("     demo@fet.co.za     / Student123!  (STUDENT, Grade 12, with study history)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
