import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GQL_DASHBOARD } from "../gql";
import { useAuth } from "../auth";
import { Badge, Card, Empty, fmtDateTime, LoadingBlock, Stat } from "../components/ui";
import type { Dashboard as DashType } from "../types";

function pctTone(v: number) {
  return v >= 70 ? "green" : v >= 40 ? "amber" : "red";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery<{ dashboard: DashType }>(GQL_DASHBOARD);

  if (loading) return <LoadingBlock label="Loading your dashboard…" />;
  if (error) return <div className="error-text">{error.message}</div>;
  const d = data!.dashboard;
  const firstName = user?.name.split(" ")[0];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Sawubona, {firstName} 👋</h1>
          <p className="page-sub">
            {user?.profile ? `Grade ${user.profile.grade}` : ""}
            {user?.profile?.school ? ` · ${user.profile.school}` : ""} — here's how your revision
            is going.
          </p>
        </div>
        <Link to="/subjects" className="btn btn-primary">Browse subjects →</Link>
      </div>

      <div className="grid stats-grid">
        <Stat icon="✍️" label="Questions attempted" value={d.questionsAttempted} sub={`${d.correctRate}% correct overall`} />
        <Stat icon="🎯" label="Average score" value={d.averagePercentage == null ? "—" : `${Math.round(d.averagePercentage)}%`} sub="across finished sessions & exams" />
        <Stat icon="🔥" label="Day streak" value={d.currentStreak} sub="keep it alive today!" />
        <Stat icon="🧪" label="Mock exams done" value={d.examCount} sub={`${d.studyMinutes} min of study time`} />
      </div>

      {d.questionsAttempted === 0 ? (
        <div className="card mt-24">
          <Empty
            title="You haven't attempted any questions yet"
            hint="Pick a subject, open a topic and start a practice session — your progress will show up here."
            action={
              <Link to="/subjects" className="btn btn-primary">
                Start with a subject
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-2 mt-24">
            <Card>
              <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Score trend</h3>
              {d.scoreTrend.length === 0 ? (
                <Empty title="No results yet" hint="Finish a session or exam to see your trend." />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={d.scoreTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: any) => [`${v}%`, "Score"]} />
                    <Line type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
            <Card>
              <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Accuracy by subject</h3>
              {d.subjectAccuracy.length === 0 ? (
                <Empty title="Nothing yet" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={d.subjectAccuracy}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis dataKey="subject.name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: any) => [`${v}%`, "Accuracy"]} />
                    <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                      {d.subjectAccuracy.map((s, i) => (
                        <Cell key={i} fill={s.subject.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          <div className="grid grid-2 mt-24">
            <Card>
              <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>📌 Weak topics — focus here</h3>
              {d.weakTopics.length === 0 ? (
                <p className="muted small mb-0">
                  No weak topics detected (topics need at least 3 attempts to be ranked). Keep
                  practising!
                </p>
              ) : (
                <div className="row">
                  {d.weakTopics.map((t) => (
                    <Link key={t.topic.id} to={`/subjects/${t.topic.subject.id}/topics/${t.topic.id}`} className="chip red">
                      {t.topic.name} <span className="chip-val">{t.accuracy}%</span>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
            <Card>
              <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>💪 Strong topics — keep it up</h3>
              {d.strongTopics.length === 0 ? (
                <p className="muted small mb-0">Your strong topics will appear once you practice more.</p>
              ) : (
                <div className="row">
                  {d.strongTopics.map((t) => (
                    <Link key={t.topic.id} to={`/subjects/${t.topic.subject.id}/topics/${t.topic.id}`} className="chip green">
                      {t.topic.name} <span className="chip-val">{t.accuracy}%</span>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-2 mt-24">
            <Card>
              <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Recent activity</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Subject</th>
                    <th className="right">Score</th>
                    <th className="right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {d.recentActivity.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          <Badge tone={a.mode === "EXAM" ? "indigo" : "gray"}>
                            {a.mode === "EXAM" ? "Exam" : "Practice"}
                          </Badge>
                          <span className="truncate">{a.title}</span>
                        </div>
                      </td>
                      <td className="muted">{a.subjectName}</td>
                      <td className="right">
                        <Badge tone={pctTone(a.percentage)}>{Math.round(a.percentage)}%</Badge>
                      </td>
                      <td className="right muted small">{fmtDateTime(a.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card>
              <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>
                Exam results{" "}
                <Link to="/exams" className="small" style={{ color: "var(--primary)" }}>
                  all exams →
                </Link>
              </h3>
              {d.examResults.length === 0 ? (
                <Empty title="No mock exams taken yet" hint="Timed, auto-marked papers are waiting for you." action={<Link to="/exams" className="btn btn-primary btn-sm">See mock exams</Link>} />
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th className="right">Score</th>
                      <th className="right">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.examResults.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <Link to={`/results/${a.id}`}>
                            <div>{a.title}</div>
                            <div className="muted small">{a.subjectName}</div>
                          </Link>
                        </td>
                        <td className="right">
                          <Badge tone={pctTone(a.percentage)}>{Math.round(a.percentage)}%</Badge>
                        </td>
                        <td className="right muted small">{fmtDateTime(a.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
