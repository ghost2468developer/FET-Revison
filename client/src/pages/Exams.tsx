import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GQL_EXAMS, GQL_GRADES } from "../gql";
import { useAuth } from "../auth";
import { Badge, Card, Empty, LoadingBlock } from "../components/ui";
import type { ExamSummary, Grade } from "../types";

function pctTone(v: number | null) {
  if (v == null) return "gray";
  return v >= 70 ? "green" : v >= 40 ? "amber" : "red";
}

export default function Exams() {
  const { user } = useAuth();
  const isStaff = user?.role === "ADMIN" || user?.role === "TEACHER";
  const [gradeId, setGradeId] = useState<number | undefined>(undefined);

  const { data: gradesData } = useQuery<{ grades: Grade[] }>(GQL_GRADES, { skip: !isStaff });
  const { data, loading } = useQuery<{ exams: ExamSummary[] }>(GQL_EXAMS, {
    variables: { gradeId: isStaff ? gradeId : undefined },
  });

  if (loading) return <LoadingBlock label="Loading mock exams…" />;
  const exams = data?.exams ?? [];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Mock exams</h1>
          <p className="page-sub">
            Timed papers drawn from your topics. They are marked automatically and you get a
            full question-by-question review afterwards.
          </p>
        </div>
        {isStaff ? (
          <select
            className="select"
            style={{ maxWidth: 170 }}
            value={gradeId ?? ""}
            onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">All grades</option>
            {(gradesData?.grades ?? []).map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {exams.length === 0 ? (
        <div className="card">
          <Empty title="No mock exams yet" hint="Mock exams will appear here when they are created." />
        </div>
      ) : (
        <div>
          {exams.map((e) => (
            <div key={e.id} className="card exam-card" style={{ marginBottom: 12 }}>
              <div>
                <div className="exam-title">
                  <span className="swatch" style={{ background: e.subject.color, marginRight: 8 }} />
                  {e.title}
                </div>
                <div className="exam-meta">
                  <span>
                    <b>{e.subject.name}</b> · {e.subject.grade.name}
                  </span>
                  <span>⏱ {e.durationMinutes} min</span>
                  <span>❓ {e.questionCount} questions</span>
                  <span>
                    🏅 {e.totalPoints} points
                  </span>
                  <Badge tone={pctTone(e.bestPercentage)}>
                    {e.bestPercentage != null ? `Your best: ${Math.round(e.bestPercentage)}%` : "Not attempted yet"}
                  </Badge>
                </div>
              </div>
              {e.questionCount > 0 ? (
                <Link to={`/exams/${e.id}`} className="btn btn-primary" style={{ flex: "none" }}>
                  Start exam →
                </Link>
              ) : (
                <span className="muted small">No questions yet</span>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
