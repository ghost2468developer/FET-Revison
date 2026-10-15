import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GQL_MATERIALS, GQL_TOPIC } from "../gql";
import { Badge, Card, Empty, LoadingBlock, Rich } from "../components/ui";
import type { MaterialType, StudyMaterial, Topic } from "../types";

const TABS: { key: string; label: string; types: MaterialType[] }[] = [
  { key: "summary", label: "Summary", types: ["SUMMARY", "STUDY_NOTE"] },
  { key: "defs", label: "Definitions & formulas", types: ["DEFINITION", "FORMULA"] },
  { key: "examples", label: "Worked examples", types: ["EXAMPLE"] },
];

const TYPE_LABEL: Record<MaterialType, string> = {
  SUMMARY: "Summary",
  DEFINITION: "Definition",
  FORMULA: "Formula",
  EXAMPLE: "Example",
  STUDY_NOTE: "Study note",
};

export default function TopicDetail() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState("summary");

  const { data: topicData, loading: l1 } = useQuery<{ topic: Topic }>(GQL_TOPIC, {
    variables: { id: topicId! },
    skip: !topicId,
  });
  const { data, loading } = useQuery<{ studyMaterials: StudyMaterial[] }>(GQL_MATERIALS, {
    variables: { topicId: topicId! },
    skip: !topicId,
  });

  if (l1 || loading) return <LoadingBlock label="Loading topic…" />;
  const topic = topicData?.topic;
  if (!topic) {
    return (
      <div className="card">
        <Empty title="Topic not found" action={<Link to="/subjects" className="btn btn-primary">Back to subjects</Link>} />
      </div>
    );
  }

  const materials = data?.studyMaterials ?? [];
  const active = TABS.find((t) => t.key === tab)!;
  const shown = materials.filter((m) => active.types.includes(m.type));

  return (
    <>
      <Link to={`/subjects/${subjectId}`} className="small" style={{ color: "var(--muted)" }}>
        ← {topic.subject.name}
      </Link>
      <div className="page-head mt-8">
        <div>
          <h1 className="page-title mb-0">{topic.name}</h1>
          {topic.description ? <p className="page-sub mb-0">{topic.description}</p> : null}
        </div>
        {topic.questionCount > 0 ? (
          <button className="btn btn-primary" onClick={() => navigate(`/practice/${topic.id}`)}>
            Start practice ({topic.questionCount} questions) →
          </button>
        ) : null}
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
        <div className="row" style={{ marginLeft: "auto" }}>
          <Badge tone="gray">{topic.materialCount} study notes</Badge>
          <Badge tone="gray">{topic.questionCount} practice questions</Badge>
        </div>
      </div>

      {shown.length === 0 ? (
        <Card>
          <Empty
            title="Nothing here yet"
            hint={`No ${active.label.toLowerCase()} have been added for this topic yet.`}
          />
        </Card>
      ) : (
        shown.map((m) => (
          <Card key={m.id} className="material-card">
            <div className="material-title">
              <Badge tone="indigo">{TYPE_LABEL[m.type]}</Badge>
              <span>{m.title}</span>
            </div>
            <Rich text={m.content} />
          </Card>
        ))
      )}
    </>
  );
}
