import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  GQL_QUESTIONS,
  GQL_TOPIC,
  M_FINISH_PRACTICE,
  M_START_PRACTICE,
  M_SUBMIT_PRACTICE,
} from "../gql";
import {
  Badge,
  Card,
  DifficultyBadge,
  Empty,
  ErrorText,
  LoadingBlock,
  ScoreRing,
  TypeBadge,
} from "../components/ui";
import type { AnswerResult, PracticeQuestion, Topic } from "../types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "loading" | "running" | "finishing" | "done";

export default function PracticeRunner() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [total, setTotal] = useState(0);
  const [finalPct, setFinalPct] = useState<number | null>(null);
  const [finalPoints, setFinalPoints] = useState<[number, number]>([0, 0]);

  const { data: topicData } = useQuery<{ topic: Topic }>(GQL_TOPIC, {
    variables: { id: topicId! },
    skip: !topicId,
  });
  const { data: qData, loading: qLoading } = useQuery<{ questions: PracticeQuestion[] }>(GQL_QUESTIONS, {
    variables: { topicId: topicId! },
    skip: !topicId,
  });

  const [startSession] = useMutation(M_START_PRACTICE);
  const [submitAnswer] = useMutation(M_SUBMIT_PRACTICE);
  const [finishSession] = useMutation(M_FINISH_PRACTICE);

  const beginSession = useCallback(async () => {
    setPhase("loading");
    setIndex(0);
    setSelected(null);
    setText("");
    setResult(null);
    setError("");
    setTotal(0);
    setFinalPct(null);
    const qs = qData?.questions ?? [];
    if (!qs.length) {
      setPhase("done");
      return;
    }
    try {
      const shuffled = shuffle(qs);
      const res = await startSession({
        variables: { topicId: topicId!, questionIds: shuffled.map((x) => x.id) },
      });
      setQuestions(shuffled);
      setAttemptId(res.data.startPracticeSession);
      setPhase("running");
    } catch (e: any) {
      setError(e.message);
      setPhase("done");
    }
  }, [qData, topicId, startSession]);

  useEffect(() => {
    if (qLoading) return;
    void beginSession();
  }, [qLoading, beginSession]);

  const q = questions[index];
  const isShort = q?.type === "SHORT_ANSWER";
  const answered = result !== null;

  const submit = useCallback(async () => {
    if (!q || !attemptId) return;
    if (!isShort && !selected) return;
    if (isShort && !text.trim()) return;
    try {
      const res = await submitAnswer({
        variables: {
          attemptId,
          questionId: q.id,
          answerId: isShort ? null : selected,
          answerText: isShort ? text : null,
        },
      });
      setResult(res.data.submitPracticeAnswer);
      setTotal(res.data.submitPracticeAnswer.totalPoints);
    } catch (e: any) {
      setError(e.message);
    }
  }, [q, attemptId, isShort, selected, text, submitAnswer]);

  const next = async () => {
    if (index + 1 >= questions.length) {
      setPhase("finishing");
      try {
        const res = await finishSession({ variables: { attemptId } });
        const av = res.data.finishPracticeSession;
        setFinalPoints([av.totalPoints, av.maxPoints]);
        setFinalPct(av.percentage ?? 0);
      } catch {
        /* keep going */
      }
      setPhase("done");
    } else {
      setIndex(index + 1);
      setSelected(null);
      setText("");
      setResult(null);
      setError("");
    }
  };

  const topic = topicData?.topic;

  if (phase === "loading") return <LoadingBlock label="Setting up your practice session…" />;

  if (phase === "done") {
    if (error && finalPct == null) {
      return (
        <Card className="q-card">
          <ErrorText message={error} />
          <Link to="/subjects" className="btn btn-primary">
            Back to subjects
          </Link>
        </Card>
      );
    }
    if (finalPct == null && questions.length === 0) {
      return (
        <Card className="q-card">
          <Empty
            title="No questions for this topic yet"
            hint="A teacher can add questions from the admin panel."
            action={<Link to="/subjects" className="btn btn-primary">Back to subjects</Link>}
          />
        </Card>
      );
    }
    return (
      <Card className="q-card">
        <div className="result-hero" style={{ justifyContent: "center", textAlign: "center" }}>
          <div className="ring-wrap">
            <ScoreRing percentage={finalPct ?? 0} size={140} />
          </div>
          <div>
            <h2 style={{ margin: "0 0 6px" }}>
              {finalPct != null && finalPct >= 70
                ? "Well done! 🎉"
                : finalPct != null && finalPct >= 40
                  ? "Good effort - keep going!"
                  : "Keep practising - you've got this."}
            </h2>
            <p className="muted mb-0">
              You scored {finalPoints[0]} of {finalPoints[1]} points in{" "}
              {topic ? `${topic.subject.name}: ${topic.name}` : "this topic"}.
            </p>
            <div className="row mt-16" style={{ justifyContent: "center" }}>
              <button className="btn btn-outline" onClick={beginSession}>
                Try again
              </button>
              <Link to={`/subjects/${topic?.subject.id}`} className="btn btn-primary">
                Back to {topic?.subject.name ?? "subject"}
              </Link>
              <Link to="/" className="btn btn-outline">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (phase === "finishing") return <LoadingBlock label="Marking your session…" />;
  if (!q) return <LoadingBlock />;

  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Practice</h1>
          <p className="page-sub">
            {topic ? `${topic.subject.name} · ${topic.name}` : ""}
          </p>
        </div>
        <div className="muted small">
          {index + 1} of {questions.length} · {total} pts so far
        </div>
      </div>

      <div className="progress mb-0" style={{ marginBottom: 18 }}>
        <div style={{ width: `${(answered ? index + 1 : index) / questions.length * 100}%` }} />
      </div>

      {error ? <ErrorText message={error} /> : null}

      <Card className="q-card">
        <div className="q-head">
          <TypeBadge type={q.type} />
          <DifficultyBadge level={q.difficulty} />
          <Badge tone="gray">{q.points} pts</Badge>
        </div>
        <div className="q-text">{q.text}</div>

        {!isShort ? (
          q.options.map((opt, i) => {
            let cls = "option";
            if (answered) {
              if (opt.id === result?.correctOptionId) cls += " correct";
              else if (opt.id === selected) cls += " incorrect";
            } else if (opt.id === selected) {
              cls += " selected";
            }
            return (
              <button
                key={opt.id}
                className={cls}
                disabled={answered}
                onClick={() => setSelected(opt.id)}
              >
                <span className="letter">{letters[i]}</span>
                <span>{opt.text}</span>
              </button>
            );
          })
        ) : (
          <div>
            <textarea
              className="textarea"
              rows={4}
              placeholder="Type your answer here…"
              value={text}
              disabled={answered}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        )}

        {!answered ? (
          <div className="q-actions">
            <span />
            <button
              className="btn btn-primary"
              disabled={isShort ? !text.trim() : !selected}
              onClick={submit}
            >
              Check answer
            </button>
          </div>
        ) : (
          <>
            <div className={`feedback ${result!.isCorrect ? "ok" : "bad"}`}>
              <div className="feedback-title">
                {result!.isCorrect
                  ? `✅ Correct - +${result!.awardedPoints} pts`
                  : "❌ Not quite"}
              </div>
              {!result!.isCorrect ? (
                <div className="feedback correct-note">
                  Correct answer:{" "}
                  {q.type === "SHORT_ANSWER" ? result!.correctText : result!.correctOptionText}
                </div>
              ) : null}
              {result!.explanation ? <div>{result!.explanation}</div> : null}
            </div>
            <div className="q-actions">
              <span className="muted small">
                Score so far: {result!.totalPoints}/{result!.maxPoints} pts
              </span>
              <button className="btn btn-primary" onClick={next}>
                {index + 1 >= questions.length ? "Finish session" : "Next question →"}
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
