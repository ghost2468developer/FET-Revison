import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GQL_ATTEMPT } from "../gql";
import {
  Badge,
  Card,
  DifficultyBadge,
  Empty,
  fmtDuration,
  LoadingBlock,
  ScoreRing,
  TypeBadge,
} from "../components/ui";
import type { AttemptView } from "../types";

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { data, loading, error } = useQuery<{ attempt: AttemptView }>(GQL_ATTEMPT, {
    variables: { id: attemptId! },
    skip: !attemptId,
  });

  if (loading) return <LoadingBlock label="Loading your results…" />;
  if (error || !data?.attempt) {
    return (
      <div className="card">
        <Empty
          title="Results not found"
          hint={error ? error.message : "This attempt does not exist."}
          action={<Link to="/" className="btn btn-primary">Back to dashboard</Link>}
        />
      </div>
    );
  }

  const a = data.attempt;
  const title = a.exam ? a.exam.title : a.topic ? `Practice - ${a.topic.name}` : "Session";
  const subjectName = a.exam?.subject.name ?? a.topic?.subject.name;
  const pct = a.percentage ?? 0;
  const correctCount = a.answers.filter((x) => x.isCorrect).length;

  return (
    <>
      <h1 className="page-title">Results: {title}</h1>
      <p className="page-sub">{subjectName ? `${subjectName} · ` : ""}{a.mode === "EXAM" ? "Mock exam" : "Practice session"}</p>

      <Card className="q-card">
        <div className="result-hero">
          <div className="ring-wrap">
            <ScoreRing percentage={pct} size={130} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
              {pct >= 70 ? "Strong result! 🎉" : pct >= 40 ? "Solid effort - keep pushing." : "This one's not done with you yet."}
            </div>
            <div className="result-facts">
              <div className="result-fact">
                <div className="val">
                  {a.totalPoints}/{a.maxPoints}
                </div>
                <div className="lbl">points</div>
              </div>
              <div className="result-fact">
                <div className="val">
                  {correctCount}/{a.answers.length}
                </div>
                <div className="lbl">correct</div>
              </div>
              <div className="result-fact">
                <div className="val">{fmtDuration(a.durationSeconds)}</div>
                <div className="lbl">time taken</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-24">
          <Link to="/" className="btn btn-primary">
            Back to dashboard
          </Link>
          {a.mode === "EXAM" ? (
            <Link to="/exams" className="btn btn-outline">
              All mock exams
            </Link>
          ) : (
            <Link to={`/subjects/${a.topic?.subject.id}`} className="btn btn-outline">
              Back to {subjectName}
            </Link>
          )}
        </div>
      </Card>

      <h2 className="section-title">Question-by-question review</h2>
      {a.answers.map((aa, i) => {
        const q = aa.question;
        const wasCorrect = aa.isCorrect;
        return (
          <div key={q.id} className={`result-q ${wasCorrect ? "ok" : "bad"}`}>
            <div className="row" style={{ marginBottom: 8 }}>
              <span className="muted small">Q{i + 1}</span>
              <TypeBadge type={q.type} />
              <DifficultyBadge level={q.difficulty} />
              <span className="badge gray">
                {aa.awardedPoints}/{q.points} pts
              </span>
              <span className={`badge ${wasCorrect ? "green" : "red"}`}>
                {wasCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>
            <div className="rq-text">{q.text}</div>
            {q.type === "SHORT_ANSWER" ? (
              <>
                <div className="ans-line you">
                  <b>Your answer:</b> {aa.selectedOptionText || <span className="muted">(not answered)</span>}
                </div>
                <div className="ans-line corr">
                  <b>Expected:</b> {q.correctText}
                </div>
              </>
            ) : (
              q.options.map((opt) => {
                const isSel = opt.id === aa.selectedOptionId;
                const isCorr = opt.isCorrect;
                return (
                  <div
                    key={opt.id}
                    className="ans-line"
                    style={{
                      fontWeight: isCorr ? 600 : 400,
                      color: isCorr ? "#166534" : isSel ? "#b91c1c" : "#475569",
                    }}
                  >
                    {isCorr ? "✅" : isSel ? "❌" : "•"} {opt.text}
                    {isSel ? " (your pick)" : ""}
                  </div>
                );
              })
            )}
            {q.explanation ? (
              <div className="feedback" style={{ background: "#f8fafc", marginTop: 10 }}>
                💡 {q.explanation}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
