import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GQL_GRADES, GQL_SUBJECTS } from "../gql";
import { useAuth } from "../auth";
import { Badge, Card, LoadingBlock } from "../components/ui";
import type { Grade, Subject } from "../types";

export default function Subjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role === "ADMIN" || user?.role === "TEACHER";
  const [gradeId, setGradeId] = useState<number | undefined>(undefined);

  const { data: gradesData } = useQuery<{ grades: Grade[] }>(GQL_GRADES, { skip: !isStaff });
  const { data, loading } = useQuery<{ subjects: Subject[] }>(GQL_SUBJECTS, {
    variables: { gradeId: isStaff ? gradeId : undefined },
  });

  if (loading) return <LoadingBlock label="Loading subjects…" />;
  const subjects = data?.subjects ?? [];
  const gradeName = isStaff
    ? gradeId
      ? `Grade ${gradeId}`
      : "All grades"
    : user?.profile
      ? `Grade ${user.profile.grade}`
      : "";

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-sub">
            {isStaff
              ? "All subjects across grades — pick a grade to filter."
              : `${gradeName} subjects. Want a different grade? Update it in My profile.`}
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

      {subjects.length === 0 ? (
        <div className="card">
          <Card>
            <div className="empty">
              <div className="empty-title">No subjects here yet</div>
              <div className="empty-hint">A teacher hasn't added subjects for this grade yet.</div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-3">
          {subjects.map((s) => (
            <div key={s.id} className="card subject-card" onClick={() => navigate(`/subjects/${s.id}`)}>
              <div className="subject-head">
                <span className="swatch" style={{ background: s.color }} />
                <div>
                  <div className="subject-name">{s.name}</div>
                  <div className="subject-code">
                    {s.code} · {s.grade.name}
                  </div>
                </div>
              </div>
              <div className="row">
                <Badge tone="gray">{s.topicCount} topics</Badge>
                <Badge tone="gray">{s.examCount} exams</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
