import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GQL_SUBJECTS, GQL_TOPICS } from "../gql";
import { Badge, Empty, LoadingBlock } from "../components/ui";
import type { Grade, Subject, Topic } from "../types";

export default function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { data: subjectsData, loading: l1 } = useQuery<{ subjects: Subject[] }>(GQL_SUBJECTS);
  const { data, loading } = useQuery<{ topics: Topic[] }>(GQL_TOPICS, {
    variables: { subjectId: subjectId! },
    skip: !subjectId,
  });

  if (l1 || loading) return <LoadingBlock label="Loading subject…" />;
  const subject = subjectsData?.subjects.find((s) => s.id === subjectId);
  const topics = data?.topics ?? [];

  if (!subject) {
    return (
      <div className="card">
        <Empty title="Subject not found" action={<Link to="/subjects" className="btn btn-primary">Back to subjects</Link>} />
      </div>
    );
  }

  return (
    <>
      <Link to="/subjects" className="small" style={{ color: "var(--muted)" }}>
        ← All subjects
      </Link>
      <div className="page-head mt-8">
        <div className="row" style={{ gap: 12 }}>
          <span className="swatch" style={{ background: subject.color, width: 18, height: 18, borderRadius: 6 }} />
          <div>
            <h1 className="page-title mb-0">{subject.name}</h1>
            <p className="page-sub mb-0">
              {subject.grade.name} · {subject.code}
            </p>
          </div>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="card mt-16">
          <Empty title="No topics yet" hint="Topics will appear here once they are added." />
        </div>
      ) : (
        <div>
          {topics.map((t) => (
            <div key={t.id} className="topic-row" onClick={() => navigate(`/subjects/${subject.id}/topics/${t.id}`)}>
              <div>
                <div className="topic-name">{t.name}</div>
                {t.description ? <div className="topic-desc">{t.description}</div> : null}
              </div>
              <div className="topic-meta">
                <Badge tone="gray">{t.materialCount} notes</Badge>
                <Badge tone="gray">{t.questionCount} questions</Badge>
                <div className="row">
                  <Link
                    to={`/subjects/${subject.id}/topics/${t.id}`}
                    className="btn btn-outline btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Revise
                  </Link>
                  {t.questionCount > 0 ? (
                    <Link
                      to={`/practice/${t.id}`}
                      className="btn btn-primary btn-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Practice →
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
