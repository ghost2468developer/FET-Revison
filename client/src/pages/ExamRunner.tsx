import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GQL_EXAMS, M_START_EXAM, M_SUBMIT_EXAM, M_SUBMIT_EXAM_ANSWER } from "../gql";
import {
  Card,
  DifficultyBadge,
  ErrorText,
  LoadingBlock,
  TypeBadge,
} from "../components/ui";
import type { ExamSession, ExamSummary, PracticeQuestion } from "../types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "intro" | "loading" | "runner" | "submitting";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function ExamRunner() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const [error, setError] = useState("");
  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answerId?: string; answerText?: string; saved?: boolean }>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const submittedRef = useRef(false);

  const { data: examsData, loading: eLoading } = useQuery<{ exams: ExamSummary[] }>(GQL_EXAMS);
  const [startExam] = useMutation(M_START_EXAM);
  const [saveAnswer] = useMutation(M_SUBMIT_EXAM_ANSWER);
  const [submitExam] = useMutation(M_SUBMIT_EXAM);

  const exam = examsData?.exams.find((e) => e.id === examId);

  const doSubmit = useCallback(async () => {
    if (submittedRef.current || !session) return;
    submittedRef.current = true;
    setPhase("submitting");
    try {
      const res = await submitExam({ variables: { attemptId: session.attemptId } });
      navigate(`/results/${res.data.submitExam.id}`, { replace: true });
    } catch (e: any) {
      submittedRef.current = false;
      setError(e.message);
      setPhase("runner");
    }
  }, [session, submitExam, navigate]);

  // countdown
  useEffect(() => {
    if (phase !== "runner" || !session) return;
    const deadline = new Date(session.deadlineAt).getTime();
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) void doSubmit();
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [phase, session, doSubmit]);

  const begin = async () => {
    setError("");
    setPhase("loading");
    try {
      const res = await startExam({ variables: { examId: examId! } });
      const s = res.data.startExam as ExamSession;
      const shuffled = shuffle(s.questions);
      setSession(s);
      setQuestions(shuffled);
      setPhase("runner");
    } catch (e: any) {
      setError(e.message);
      setPhase("intro");
    }
  };

  const selectOption = async (qid: string, optionId: string) => {
    if (!session) return;
    setAnswers((prev) => ({ ...prev, [qid]: { answerId: optionId, saved: false } }));
    try {
      await saveAnswer({
        variables: { attemptId: session.attemptId, questionId: qid, answerId: optionId },
      });
      setAnswers((prev) => ({ ...prev, [qid]: { answerId: optionId, saved: true } }));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const saveText = async (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: { answerText: value, saved: false } }));
    if (!session) return;
    try {
      await saveAnswer({
        variables: { attemptId: session.attemptId, questionId: qid, answerText: value },
      });
      setAnswers((prev) => ({ ...prev, [qid]: { ...prev[qid], saved: true } }));
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (phase === "intro") {
    if (eLoading) return <LoadingBlock label="Loading exam…" />;
    if (!exam) {
      return (
        <div className="card">
          <div className="empty">
            <div className="empty-title">Exam not found</div>
            <Link to="/exams" className="btn btn-primary mt-16">
              Back to exams
            </Link>
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="page-head">
          <div>
            <h1 className="page-title">{exam.title}</h1>
            <p className="page-sub">
              <span className="swatch" style={{ background: exam.subject.color, marginRight: 6 }} />
              {exam.subject.name} · {exam.subject.grade.name}
            </p>
          </div>
        </div>
        {error ? <ErrorText message={error} /> : null}
        <Card className="q-card">
          <div className="row" style={{ marginBottom: 18 }}>
            <span className="chip">⏱ {exam.durationMinutes} minutes</span>
            <span className="chip">❓ {exam.questionCount} questions</span>
            <span className="chip">🏅 {exam.totalPoints} points</span>
          </div>
          <h3 style={{ marginTop: 0 }}>Before you start</h3>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>The timer starts as soon as you begin - it cannot be paused.</li>
            <li>You can move between questions and change your answers any time.</li>
            <li>Answers are saved automatically as you go.</li>
            <li>The exam is submitted automatically when time runs out.</li>
            <li>There is no negative marking.</li>
          </ul>
          <div className="q-actions">
            <Link to="/exams" className="btn btn-outline">
              Back
            </Link>
            <button className="btn btn-primary" onClick={begin}>
              I'm ready - start exam →
            </button>
          </div>
        </Card>
      </>
    );
  }

  if (phase === "loading") return <LoadingBlock label="Preparing your exam…" />;
  if (phase === "submitting") return <LoadingBlock label="Marking your exam…" />;
  if (!session) return <LoadingBlock />;

  const q = questions[index];
  const isShort = q?.type === "SHORT_ANSWER";
  const answeredCount = Object.values(answers).filter((a) => a.answerId || (a.answerText ?? "").trim()).length;
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const timeWarn = secondsLeft < 300;

  return (
    <div>
      <div className="session-bar">
        <div className="row" style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{session.title}</h1>
          <span className="muted small">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <div className={`timer ${timeWarn ? "warn" : ""}`}>
          ⏱ {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </div>
      </div>
      <div className="dots" style={{ marginBottom: 18 }}>
        {questions.map((x, i) => {
          const a = answers[x.id];
          const has = !!(a?.answerId || (a?.answerText ?? "").trim());
          return (
            <button
              key={x.id}
              className={`dot ${has ? "answered" : ""} ${i === index ? "current" : ""}`}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {error ? <ErrorText message={error} /> : null}

      {q ? (
        <Card className="q-card">
          <div className="q-head">
            <span className="muted small">Question {index + 1} of {questions.length}</span>
            <TypeBadge type={q.type} />
            <DifficultyBadge level={q.difficulty} />
            <span className="badge gray">{q.points} pts</span>
            {answers[q.id]?.saved ? <span className="muted small">✓ saved</span> : null}
          </div>
          <div className="q-text">{q.text}</div>

          {!isShort ? (
            q.options.map((opt, i) => (
              <button
                key={opt.id}
                className={`option ${answers[q.id]?.answerId === opt.id ? "selected" : ""}`}
                onClick={() => selectOption(q.id, opt.id)}
              >
                <span className="letter">{LETTERS[i]}</span>
                <span>{opt.text}</span>
              </button>
            ))
          ) : (
            <textarea
              className="textarea"
              rows={4}
              placeholder="Type your answer here…"
              value={answers[q.id]?.answerText ?? ""}
              onChange={(e) => saveText(q.id, e.target.value)}
            />
          )}

          <div className="q-actions">
            <button className="btn btn-outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              ← Previous
            </button>
            <div className="row">
              {index + 1 < questions.length ? (
                <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>
                  Next →
                </button>
              ) : null}
              {confirming ? (
                <>
                  <span className="small muted">Submit final answers?</span>
                  <button className="btn btn-danger" onClick={doSubmit}>
                    Yes, submit
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setConfirming(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    answeredCount < questions.length
                      ? setConfirming(true)
                      : doSubmit()
                  }
                >
                  Submit exam ✓
                </button>
              )}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
