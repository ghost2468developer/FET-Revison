import React, { useEffect, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  GQL_ADMIN_QUESTIONS,
  GQL_ADMIN_QUESTION,
  GQL_EXAM_QUESTIONS,
  GQL_MATERIALS,
  GQL_SUBJECTS,
  GQL_TOPICS,
  GQL_USERS,
  M_ADD_EXAM_QUESTION,
  M_CREATE_EXAM,
  M_CREATE_MATERIAL,
  M_CREATE_QUESTION,
  M_CREATE_SUBJECT,
  M_CREATE_TOPIC,
  M_DELETE_EXAM,
  M_DELETE_MATERIAL,
  M_DELETE_QUESTION,
  M_DELETE_SUBJECT,
  M_DELETE_TOPIC,
  M_REMOVE_EXAM_QUESTION,
  M_SET_ROLE,
  M_UPDATE_QUESTION,
  M_UPDATE_SUBJECT,
} from "../gql";
import { useAuth } from "../auth";
import { Badge, Card, DifficultyBadge, Empty, ErrorText, LoadingBlock, TypeBadge } from "../components/ui";
import type {
  AdminQuestion,
  Difficulty,
  Grade,
  QuestionType,
  Role,
  StudyMaterial,
  Subject,
  Topic,
  User,
} from "../types";
import { gql } from "@apollo/client";

const GQL_GRADES = gql`
  query Grades {
    grades {
      id
      name
    }
  }
`;

const GQL_TOPICS_FULL = gql`
  query Topics($subjectId: ID!) {
    topics(subjectId: $subjectId) {
      id
      name
      description
      order
      materialCount
      questionCount
    }
  }
`;

function errMsg(e: unknown): string {
  const err = e as { graphQLErrors?: { message: string }[] };
  return err?.graphQLErrors?.[0]?.message ?? "Something went wrong.";
}

/* ================= Content tab ================= */

function ContentTab() {
  const client = useApolloClient();
  const [gradeId, setGradeId] = useState(12);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { data: gradesData, loading: gLoading } = useQuery<{ grades: Grade[] }>(GQL_GRADES);
  const { loading: sLoading, refetch: refetchSubjects } = useQuery(
    GQL_SUBJECTS_RAW,
    { variables: { gradeId }, onCompleted: (d) => setSubjects(d.subjects) }
  );

  useEffect(() => {
    setSelectedSubject(null);
    setSelectedTopic(null);
  }, [gradeId]);

  if (gLoading || sLoading && subjects.length === 0) return <LoadingBlock />;

  const subject = subjects.find((s) => s.id === selectedSubject) ?? null;

  return (
    <div>
      <div className="row" style={{ marginBottom: 20 }}>
        <select className="select" style={{ maxWidth: 170 }} value={gradeId} onChange={(e) => setGradeId(Number(e.target.value))}>
          {(gradesData?.grades ?? []).map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <span className="muted small">Manage subjects, topics, study notes and questions for the selected grade.</span>
      </div>

      <SubjectList
        subjects={subjects}
        gradeId={gradeId}
        selectedId={selectedSubject}
        onSelect={setSelectedSubject}
        onSaved={async () => {
          await refetchSubjects();
        }}
      />

      {subject ? <TopicList key={subject.id} subjectId={subject.id} selectedId={selectedTopic} onSelect={setSelectedTopic} /> : null}
    </div>
  );
}

const GQL_SUBJECTS_RAW = gql`
  query SubjectsRaw($gradeId: Int) {
    subjects(gradeId: $gradeId) {
      id
      code
      name
      color
      topicCount
      examCount
      grade {
        id
        name
      }
    }
  }
`;

function SubjectList({
  subjects,
  gradeId,
  selectedId,
  onSelect,
  onSaved,
}: {
  subjects: Subject[];
  gradeId: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSaved: () => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4f46e5");
  const [error, setError] = useState("");
  const [createSubject] = useMutation(M_CREATE_SUBJECT);

  const create = async () => {
    setError("");
    try {
      await createSubject({ variables: { gradeId, code, name, color } });
      setCode("");
      setName("");
      setColor("#4f46e5");
      setAdding(false);
      await onSaved();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="admin-section">
      <div className="row spread">
        <h3>Subjects</h3>
        <button className="btn btn-sm btn-outline" onClick={() => setAdding(!adding)}>
          {adding ? "Cancel" : "+ Add subject"}
        </button>
      </div>
      {error ? <ErrorText message={error} /> : null}
      {adding ? (
        <div className="q-editor">
          <div className="field-inline">
            <div>
              <input className="input" placeholder="Code (e.g. MATH)" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            </div>
            <div>
              <input className="input" placeholder="Subject name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ flex: "none" }}>
              <input type="color" className="input" style={{ width: 46, padding: 4 }} value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={create} disabled={!code.trim() || !name.trim()}>
              Add
            </button>
          </div>
        </div>
      ) : null}
      {subjects.length === 0 ? (
        <Empty title="No subjects for this grade yet" />
      ) : (
        subjects.map((s) => (
          <SubjectRow key={s.id} subject={s} active={s.id === selectedId} onClick={() => onSelect(s.id)} onSaved={onSaved} />
        ))
      )}
    </div>
  );
}

function SubjectRow({
  subject,
  active,
  onClick,
  onSaved,
}: {
  subject: Subject;
  active: boolean;
  onClick: () => void;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState(subject.code);
  const [name, setName] = useState(subject.name);
  const [color, setColor] = useState(subject.color);
  const [error, setError] = useState("");
  const [updateSubject] = useMutation(M_UPDATE_SUBJECT);
  const [deleteSubject] = useMutation(M_DELETE_SUBJECT);

  const save = async () => {
    setError("");
    try {
      await updateSubject({ variables: { id: subject.id, code, name, color } });
      setEditing(false);
      await onSaved();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const del = async () => {
    if (!window.confirm(`Delete "${subject.name}" and ALL its topics, questions and exams? This cannot be undone.`)) return;
    try {
      await deleteSubject({ variables: { id: subject.id } });
      await onSaved();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="list-row" style={active ? { borderColor: "var(--primary)" } : undefined}>
      <div className="lr-main" style={{ cursor: "pointer" }} onClick={onClick}>
        <div className="lr-title">
          <span className="swatch" style={{ background: color, marginRight: 8 }} />
          {name} <span className="muted small">({code})</span>
        </div>
        <div className="lr-sub">
          {subject.topicCount} topics · {subject.examCount} exams
        </div>
      </div>
      {editing ? (
        <div className="row" onClick={(e) => e.stopPropagation()}>
          <input className="input" style={{ width: 110 }} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          <input className="input" style={{ width: 200 }} value={name} onChange={(e) => setName(e.target.value)} />
          <input type="color" className="input" style={{ width: 44, padding: 3 }} value={color} onChange={(e) => setColor(e.target.value)} />
          <button className="btn btn-primary btn-sm" onClick={save}>
            Save
          </button>
          <button className="btn btn-sm" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="row">
          <button className="btn btn-sm btn-outline" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="btn btn-sm btn-danger" onClick={del}>
            Delete
          </button>
        </div>
      )}
      {error ? <div style={{ width: "100%" }}><ErrorText message={error} /></div> : null}
    </div>
  );
}

function TopicList({
  subjectId,
  selectedId,
  onSelect,
}: {
  subjectId: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { data, loading, refetch } = useQuery<{ topics: Topic[] }>(GQL_TOPICS_FULL, {
    variables: { subjectId },
  });
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [createTopic] = useMutation(M_CREATE_TOPIC);

  const create = async () => {
    setError("");
    try {
      await createTopic({ variables: { subjectId, name, description: desc } });
      setName("");
      setDesc("");
      setAdding(false);
      await refetch();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (loading) return <LoadingBlock />;
  const topics = data?.topics ?? [];

  return (
    <div className="admin-section" style={{ borderLeft: "3px solid var(--primary)", paddingLeft: 16 }}>
      <div className="row spread">
        <h3>Topics</h3>
        <button className="btn btn-sm btn-outline" onClick={() => setAdding(!adding)}>
          {adding ? "Cancel" : "+ Add topic"}
        </button>
      </div>
      {error ? <ErrorText message={error} /> : null}
      {adding ? (
        <div className="q-editor">
          <div className="field-inline">
            <div>
              <input className="input" placeholder="Topic name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <input className="input" placeholder="Short description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={create} disabled={!name.trim()}>
              Add
            </button>
          </div>
        </div>
      ) : null}
      {topics.length === 0 ? (
        <Empty title="No topics yet — add the first one" />
      ) : (
        topics.map((t) => (
          <TopicRow
            key={t.id}
            topic={t}
            active={t.id === selectedId}
            onClick={() => onSelect(t.id === selectedId ? null : t.id)}
            onSaved={refetch}
          />
        ))
      )}
      {selectedId ? (
        <TopicDetailEditor key={selectedId} topicId={selectedId} onSaved={refetch} />
      ) : null}
    </div>
  );
}

function TopicRow({
  topic,
  active,
  onClick,
  onSaved,
}: {
  topic: Topic;
  active: boolean;
  onClick: () => void;
  onSaved: () => Promise<unknown>;
}) {
  const [error, setError] = useState("");
  const [deleteTopic] = useMutation(M_DELETE_TOPIC);

  const del = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete topic "${topic.name}" and its study notes and questions?`)) return;
    try {
      await deleteTopic({ variables: { id: topic.id } });
      await onSaved();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="list-row" style={active ? { borderColor: "var(--primary)" } : undefined}>
      <div className="lr-main" style={{ cursor: "pointer" }} onClick={onClick}>
        <div className="lr-title">{topic.name}</div>
        <div className="lr-sub">
          {topic.materialCount} study notes · {topic.questionCount} questions
        </div>
      </div>
      <button className="btn btn-sm btn-danger" onClick={del}>
        Delete
      </button>
      {error ? <div style={{ width: "100%" }}><ErrorText message={error} /></div> : null}
    </div>
  );
}

function TopicDetailEditor({ topicId, onSaved }: { topicId: string; onSaved: () => Promise<unknown> }) {
  const { data: materialsData, loading, refetch: refetchMaterials } = useQuery<{ studyMaterials: StudyMaterial[] }>(
    GQL_MATERIALS_RAW,
    { variables: { topicId } }
  );
  return (
    <div className="grid grid-2 mt-16" style={{ alignItems: "start" }}>
      <StudyMaterialEditor topicId={topicId} materials={materialsData?.studyMaterials ?? []} loading={loading} refetch={refetchMaterials} />
      <QuestionEditor topicId={topicId} onSaved={onSaved} />
    </div>
  );
}

const GQL_MATERIALS_RAW = gql`
  query MaterialsRaw($topicId: ID!) {
    studyMaterials(topicId: $topicId) {
      id
      type
      title
      content
    }
  }
`;

function StudyMaterialEditor({
  topicId,
  materials,
  loading,
  refetch,
}: {
  topicId: string;
  materials: StudyMaterial[];
  loading: boolean;
  refetch: () => Promise<unknown>;
}) {
  const [type, setType] = useState<StudyMaterial["type"]>("SUMMARY");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [createMaterial] = useMutation(M_CREATE_MATERIAL);
  const [deleteMaterial] = useMutation(M_DELETE_MATERIAL);

  const create = async () => {
    setError("");
    setBusy(true);
    try {
      await createMaterial({ variables: { topicId, type, title, content } });
      setTitle("");
      setContent("");
      await refetch();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    try {
      await deleteMaterial({ variables: { id } });
      await refetch();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (loading) return <LoadingBlock />;

  return (
    <Card>
      <h3 style={{ margin: "0 0 12px" }}>📝 Study notes & materials</h3>
      {error ? <ErrorText message={error} /> : null}
      {materials.map((m) => (
        <div key={m.id} className="list-row">
          <div className="lr-main">
            <div className="lr-title">
              <Badge tone="indigo">{m.type.toLowerCase().replace("_", " ")}</Badge> <b>{m.title}</b>
            </div>
            <div className="lr-sub" style={{ whiteSpace: "normal" }}>
              {m.content.slice(0, 120)}
              {m.content.length > 120 ? "…" : ""}
            </div>
          </div>
          <button className="btn btn-sm btn-danger" onClick={() => del(m.id)}>
            Delete
          </button>
        </div>
      ))}
      {materials.length === 0 ? <Empty title="No study notes yet" /> : null}
      <div className="q-editor">
        <div className="field-inline" style={{ marginBottom: 10 }}>
          <div style={{ maxWidth: 160, flex: "none" }}>
            <select className="select" value={type} onChange={(e) => setType(e.target.value as StudyMaterial["type"])}>
              <option value="SUMMARY">Summary</option>
              <option value="DEFINITION">Definition</option>
              <option value="FORMULA">Formula</option>
              <option value="EXAMPLE">Example</option>
              <option value="STUDY_NOTE">Study note</option>
            </select>
          </div>
          <div>
            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
        <textarea className="textarea" rows={5} placeholder="Content (use **bold**, - bullets, ## headings, `code`)" value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="row mt-8" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-primary btn-sm" onClick={create} disabled={busy || !title.trim() || !content.trim()}>
            {busy ? "Saving…" : "Add material"}
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- question editor ---------------- */

interface OptionDraft {
  text: string;
  correct: boolean;
  keywords: string;
  alternatives: string;
}

function QuestionEditor({ topicId, onSaved }: { topicId: string; onSaved: () => Promise<unknown> }) {
  const { data, loading, refetch } = useQuery<{ adminQuestions: AdminQuestion[] }>(GQL_ADMIN_QUESTIONS, {
    variables: { topicId },
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "MCQ" as QuestionType,
    difficulty: "MEDIUM" as Difficulty,
    points: 2,
    text: "",
    explanation: "",
  });
  const [options, setOptions] = useState<OptionDraft[]>(defaultOptions("MCQ"));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [createQuestion] = useMutation(M_CREATE_QUESTION);
  const [updateQuestion] = useMutation(M_UPDATE_QUESTION);
  const [deleteQuestion] = useMutation(M_DELETE_QUESTION);

  const reset = () => {
    setEditingId(null);
    setForm({ type: "MCQ", difficulty: "MEDIUM", points: 2, text: "", explanation: "" });
    setOptions(defaultOptions("MCQ"));
    setError("");
  };

  const setType = (t: QuestionType) => {
    setForm((f) => ({ ...f, type: t }));
    setOptions(defaultOptions(t));
  };

  const startEdit = async (q: AdminQuestion) => {
    setEditingId(q.id);
    setForm({ type: q.type, difficulty: q.difficulty, points: q.points, text: q.text, explanation: q.explanation });
    setOptions(
      q.options.map((o) => ({
        text: o.text,
        correct: o.isCorrect,
        keywords: o.keywords.join(", "),
        alternatives: o.alternatives.join(", "),
      }))
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildVars = () => ({
    type: form.type,
    difficulty: form.difficulty,
    points: form.points,
    text: form.text,
    explanation: form.explanation,
    options: options
      .filter((o) => o.text.trim())
      .map((o) => ({
        text: o.text.trim(),
        isCorrect: o.correct,
        keywords: o.keywords ? o.keywords.split(",").map((s) => s.trim()).filter(Boolean) : [],
        alternatives: o.alternatives ? o.alternatives.split(",").map((s) => s.trim()).filter(Boolean) : [],
      })),
  });

  const save = async () => {
    setError("");
    setBusy(true);
    try {
      const vars = buildVars();
      if (editingId) {
        await updateQuestion({ variables: { id: editingId, ...vars } });
      } else {
        await createQuestion({ variables: { topicId, ...vars } });
      }
      reset();
      await refetch();
      await onSaved();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await deleteQuestion({ variables: { id } });
      if (editingId === id) reset();
      await refetch();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const setOption = (i: number, patch: Partial<OptionDraft>) =>
    setOptions((prev) => prev.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const setCorrect = (i: number) =>
    setOptions((prev) => prev.map((o, j) => ({ ...o, correct: j === i })));
  const addOption = () => setOptions((prev) => [...prev, { text: "", correct: false, keywords: "", alternatives: "" }]);
  const removeOption = (i: number) => setOptions((prev) => prev.filter((_, j) => j !== i));

  if (loading) return <LoadingBlock />;
  const questions = data?.adminQuestions ?? [];

  return (
    <Card>
      <div className="row spread">
        <h3 style={{ margin: 0 }}>❓ Questions</h3>
        <button className="btn btn-sm btn-outline" onClick={reset}>
          + New question
        </button>
      </div>
      {error ? <ErrorText message={error} /> : null}

      {questions.map((q) => (
        <div key={q.id} className="list-row">
          <div className="lr-main">
            <div className="lr-title">{q.text.slice(0, 90)}{q.text.length > 90 ? "…" : ""}</div>
            <div className="row mt-8" style={{ gap: 6, flexWrap: "wrap" }}>
              <TypeBadge type={q.type} />
              <DifficultyBadge level={q.difficulty} />
              <Badge tone="gray">{q.points} pts</Badge>
            </div>
          </div>
          <div className="row">
            <button className="btn btn-sm btn-outline" onClick={() => startEdit(q)}>
              Edit
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => del(q.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
      {questions.length === 0 ? <Empty title="No questions yet" /> : null}

      <div className="q-editor">
        <h4 style={{ margin: "0 0 12px" }}>{editingId ? "Edit question" : "New question"}</h4>
        <div className="field-inline" style={{ marginBottom: 12 }}>
          <div style={{ maxWidth: 150, flex: "none" }}>
            <select className="select" value={form.type} onChange={(e) => setType(e.target.value as QuestionType)} disabled={!!editingId}>
              <option value="MCQ">Multiple choice</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="SHORT_ANSWER">Short answer</option>
            </select>
          </div>
          <div style={{ maxWidth: 130, flex: "none" }}>
            <select className="select" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div style={{ maxWidth: 90, flex: "none" }}>
            <input className="input" type="number" min={1} max={10} value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) || 1 }))} />
          </div>
        </div>
        <textarea className="textarea" rows={3} placeholder="Question text" value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
        <textarea className="textarea mt-8" rows={2} placeholder="Explanation shown after answering (optional)" value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} />

        <div className="mt-16">
          {form.type === "SHORT_ANSWER" ? (
            <div className="hint" style={{ marginBottom: 8 }}>
              Expected answers — mark at least one as correct.
              <br />
              <b>Keywords</b> (comma-separated): ALL must appear in the learner's answer (for multi-part answers).
              <br />
              <b>Alternatives</b> (comma-separated): at least ONE must appear (acceptable other phrasings).
            </div>
          ) : (
            <div className="hint" style={{ marginBottom: 8 }}>Mark exactly one correct option.</div>
          )}
          {options.map((o, i) => (
            <div key={i}>
              <div className="option-edit">
                {form.type !== "SHORT_ANSWER" ? (
                  <input
                    type="radio"
                    name="correct-opt"
                    checked={o.correct}
                    onChange={() => setCorrect(i)}
                    title="correct"
                  />
                ) : (
                  <input type="checkbox" checked={o.correct} onChange={(e) => setOption(i, { correct: e.target.checked })} title="correct" />
                )}
                <input
                  className="input"
                  placeholder={
                    form.type === "SHORT_ANSWER"
                      ? "Expected answer"
                      : form.type === "TRUE_FALSE"
                        ? i === 0
                          ? "True"
                          : "False"
                        : `Option ${i + 1}`
                  }
                  value={form.type === "TRUE_FALSE" && !o.text ? (i === 0 ? "True" : "False") : o.text}
                  onChange={(e) => setOption(i, { text: e.target.value })}
                />
                {form.type !== "SHORT_ANSWER" && options.length > 2 ? (
                  <button className="icon-btn" title="Remove option" onClick={() => removeOption(i)}>
                    ✕
                  </button>
                ) : null}
              </div>
              {form.type === "SHORT_ANSWER" ? (
                <div className="field-inline" style={{ marginBottom: 8, paddingLeft: 26 }}>
                  <div>
                    <input className="input" placeholder="keywords (all required), e.g. 24, left" value={o.keywords} onChange={(e) => setOption(i, { keywords: e.target.value })} />
                  </div>
                  <div>
                    <input className="input" placeholder="alternatives (any one), e.g. capital, equity" value={o.alternatives} onChange={(e) => setOption(i, { alternatives: e.target.value })} />
                  </div>
                  <button className="icon-btn" title="Remove expected answer" onClick={() => removeOption(i)}>
                    ✕
                  </button>
                </div>
              ) : null}
            </div>
          ))}
          {form.type === "MCQ" && options.length < 6 ? (
            <button className="btn btn-sm btn-outline" onClick={addOption}>
              + Add option
            </button>
          ) : null}
          {form.type === "SHORT_ANSWER" ? (
            <button className="btn btn-sm btn-outline" onClick={addOption}>
              + Add another acceptable answer
            </button>
          ) : null}
        </div>

        <div className="row mt-16" style={{ justifyContent: "flex-end" }}>
          {editingId ? (
            <button className="btn btn-outline" onClick={reset}>
              Cancel
            </button>
          ) : null}
          <button className="btn btn-primary" onClick={save} disabled={busy || !form.text.trim()}>
            {busy ? "Saving…" : editingId ? "Save changes" : "Add question"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function defaultOptions(type: QuestionType): OptionDraft[] {
  if (type === "TRUE_FALSE") return [{ text: "True", correct: true, keywords: "", alternatives: "" }, { text: "False", correct: false, keywords: "", alternatives: "" }];
  if (type === "SHORT_ANSWER") return [{ text: "", correct: true, keywords: "", alternatives: "" }];
  return [
    { text: "", correct: true, keywords: "", alternatives: "" },
    { text: "", correct: false, keywords: "", alternatives: "" },
    { text: "", correct: false, keywords: "", alternatives: "" },
    { text: "", correct: false, keywords: "", alternatives: "" },
  ];
}

/* ================= Exams tab ================= */

function ExamsTab() {
  const [gradeId, setGradeId] = useState(12);
  const { data: gradesData } = useQuery<{ grades: Grade[] }>(GQL_GRADES);
  const { data: subjectsData, loading: sLoading } = useQuery<{ subjects: Subject[] }>(GQL_SUBJECTS_RAW, {
    variables: { gradeId },
  });
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [duration, setDuration] = useState(45);
  const [error, setError] = useState("");
  const [createExam] = useMutation(M_CREATE_EXAM);

  const loadExams = async (grade?: number) => {
    setLoadingExams(true);
    try {
      const res = await client.query({ query: GQL_EXAMS_RAW, variables: { gradeId: grade } });
      setExams(res.data.exams);
    } finally {
      setLoadingExams(false);
    }
  };

  const client = useApolloClient();

  useEffect(() => {
    setSelectedExam(null);
    setSubjectId("");
    void loadExams(gradeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeId]);

  const create = async () => {
    setError("");
    if (!subjectId) {
      setError("Pick a subject first.");
      return;
    }
    try {
      await createExam({
        variables: { gradeId, subjectId, title, durationMinutes: duration },
      });
      setTitle("");
      await loadExams(gradeId);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const subjects = subjectsData?.subjects ?? [];

  return (
    <div>
      <div className="row" style={{ marginBottom: 20 }}>
        <select className="select" style={{ maxWidth: 170 }} value={gradeId} onChange={(e) => setGradeId(Number(e.target.value))}>
          {(gradesData?.grades ?? []).map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-section">
        <h3>New mock exam</h3>
        {error ? <ErrorText message={error} /> : null}
        <div className="field-inline">
          <div>
            <select className="select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Pick a subject…</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <input className="input" placeholder="Exam title, e.g. Term 1 Mathematics Paper 1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ maxWidth: 110, flex: "none" }}>
            <input className="input" type="number" min={5} max={240} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 45)} />
            <div className="hint">minutes</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={create} disabled={!title.trim()}>
            Create
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h3>Exams</h3>
        {loadingExams ? <LoadingBlock /> : null}
        {!loadingExams && exams.length === 0 ? <Empty title="No exams for this grade yet" /> : null}
        {exams.map((e) => (
          <ExamRowCard
            key={e.id}
            exam={e}
            active={e.id === selectedExam}
            onToggle={() => setSelectedExam(e.id === selectedExam ? null : e.id)}
            onDeleted={() => void loadExams(gradeId)}
          />
        ))}
      </div>
    </div>
  );
}

interface ExamRow {
  id: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  totalPoints: number;
  subject: { id: string; name: string };
}

const GQL_EXAMS_RAW = gql`
  query ExamsRaw($gradeId: Int) {
    exams(gradeId: $gradeId) {
      id
      title
      durationMinutes
      questionCount
      totalPoints
      subject {
        id
        name
      }
    }
  }
`;

function ExamRowCard({
  exam,
  active,
  onToggle,
  onDeleted,
}: {
  exam: ExamRow;
  active: boolean;
  onToggle: () => void;
  onDeleted: () => void;
}) {
  const [error, setError] = useState("");
  const [deleteExam] = useMutation(M_DELETE_EXAM);

  const del = async () => {
    if (!window.confirm(`Delete exam "${exam.title}"? Student results for it will also be removed.`)) return;
    try {
      await deleteExam({ variables: { id: exam.id } });
      onDeleted();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      <div className="list-row" style={active ? { borderColor: "var(--primary)" } : undefined}>
        <div className="lr-main" style={{ cursor: "pointer" }} onClick={onToggle}>
          <div className="lr-title">{exam.title}</div>
          <div className="lr-sub">
            {exam.subject.name} · {exam.durationMinutes} min · {exam.questionCount} questions · {exam.totalPoints} pts
          </div>
        </div>
        <div className="row">
          <button className="btn btn-sm btn-outline" onClick={onToggle}>
            {active ? "Close" : "Manage questions"}
          </button>
          <button className="btn btn-sm btn-danger" onClick={del}>
            Delete
          </button>
        </div>
      </div>
      {error ? <ErrorText message={error} /> : null}
      {active ? <ExamQuestionManager examId={exam.id} subjectId={exam.subject.id} onDeleted={onDeleted} /> : null}
    </div>
  );
}

function ExamQuestionManager({
  examId,
  subjectId,
  onDeleted,
}: {
  examId: string;
  subjectId: string;
  onDeleted: () => void;
}) {
  const { data, loading, refetch } = useQuery<{ examQuestions: AdminQuestion[] }>(GQL_EXAM_QUESTIONS, {
    variables: { examId },
  });
  const { data: allData, loading: aLoading } = useQuery<{
    subjectQuestions: { id: string; type: QuestionType; text: string; topicName: string; points: number }[];
  }>(GQL_SUBJECT_WITH_QUESTIONS, {
    variables: { subjectId },
  });
  const [error, setError] = useState("");
  const [pick, setPick] = useState("");
  const [addExamQuestion] = useMutation(M_ADD_EXAM_QUESTION);
  const [removeExamQuestion] = useMutation(M_REMOVE_EXAM_QUESTION);

  const inExam = new Set((data?.examQuestions ?? []).map((q) => q.id));
  const available = (allData?.subjectQuestions ?? []).filter((q) => !inExam.has(q.id));

  const add = async () => {
    setError("");
    if (!pick) return;
    try {
      await addExamQuestion({ variables: { examId, questionId: pick } });
      setPick("");
      await refetch();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const remove = async (qid: string) => {
    try {
      await removeExamQuestion({ variables: { examId, questionId: qid } });
      await refetch();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (loading || aLoading) return <LoadingBlock />;
  const examQuestions = data?.examQuestions ?? [];

  return (
    <div className="q-editor mt-8">
      <div className="row spread" style={{ marginBottom: 10 }}>
        <b>{examQuestions.length} questions in this exam</b>
        {error ? <span className="error-text" style={{ marginBottom: 0 }}>{error}</span> : null}
      </div>
      {examQuestions.map((q, i) => (
        <div key={q.id} className="list-row">
          <div className="lr-main">
            <div className="lr-title">
              {i + 1}. {q.text.slice(0, 90)}
              {q.text.length > 90 ? "…" : ""}
            </div>
            <div className="row mt-8" style={{ gap: 6 }}>
              <TypeBadge type={q.type} />
              <Badge tone="gray">{q.points} pts</Badge>
              <Badge tone="gray">{q.topicName}</Badge>
            </div>
          </div>
          <button className="btn btn-sm btn-danger" onClick={() => remove(q.id)}>
            Remove
          </button>
        </div>
      ))}
      {examQuestions.length === 0 ? <Empty title="No questions in this exam yet" hint="Add questions from the subject's question bank below." /> : null}

      <div className="mt-16">
        <div className="hint" style={{ marginBottom: 8 }}>
          Add questions from the subject's question bank:
        </div>
        <div className="field-inline">
          <div>
            <select className="select" value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Pick a question…</option>
              {available.map((q) => (
                <option key={q.id} value={q.id}>
                  [{q.type}] {q.text.slice(0, 70)}
                  {q.text.length > 70 ? "…" : ""} — {q.topicName}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={add} disabled={!pick}>
            Add to exam
          </button>
        </div>
      </div>
    </div>
  );
}

const GQL_SUBJECT_WITH_QUESTIONS = gql`
  query SubjectWithQuestions($subjectId: ID!) {
    subjectQuestions(subjectId: $subjectId) {
      id
      type
      text
      topicName
      points
    }
  }
`;

/* ================= Users tab ================= */

function UsersTab() {
  const { data, loading, refetch } = useQuery<{ users: User[] }>(GQL_USERS);
  const [setRole] = useMutation(M_SET_ROLE);
  const [error, setError] = useState("");

  if (loading) return <LoadingBlock />;
  const users = data?.users ?? [];

  const change = async (userId: string, role: Role) => {
    setError("");
    try {
      await setRole({ variables: { userId, role } });
      await refetch();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      {error ? <ErrorText message={error} /> : null}
      <Card style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td className="muted">{u.email}</td>
                <td>{u.profile ? `Grade ${u.profile.grade}` : "—"}</td>
                <td>
                  <select
                    className="select"
                    style={{ maxWidth: 130, display: "inline-block" }}
                    value={u.role}
                    onChange={(e) => change(u.id, e.target.value as Role)}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="muted small mt-8">
        The first account registered (or the ADMIN_EMAIL set in the server .env) is an admin.
      </p>
    </div>
  );
}

/* ================= main ================= */

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("content");
  if (!user) return null;
  const isAdmin = user.role === "ADMIN";

  return (
    <>
      <h1 className="page-title">Admin panel</h1>
      <p className="page-sub">Manage curriculum content, mock exams and (as admin) user roles.</p>

      <div className="tabs">
        <button className={`tab ${tab === "content" ? "active" : ""}`} onClick={() => setTab("content")}>
          Subjects & content
        </button>
        <button className={`tab ${tab === "exams" ? "active" : ""}`} onClick={() => setTab("exams")}>
          Mock exams
        </button>
        {isAdmin ? (
          <button className={`tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
            Users
          </button>
        ) : null}
      </div>

      {tab === "content" ? <ContentTab /> : null}
      {tab === "exams" ? <ExamsTab /> : null}
      {tab === "users" && isAdmin ? <UsersTab /> : null}
    </>
  );
}
