import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { M_UPDATE_PROFILE } from "../gql";
import { useAuth } from "../auth";
import { Badge, Card, ErrorText, Field } from "../components/ui";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [grade, setGrade] = useState<number>(user?.profile?.grade ?? 10);
  const [school, setSchool] = useState(user?.profile?.school ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [updateProfile] = useMutation(M_UPDATE_PROFILE);

  if (!user) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setBusy(true);
    try {
      await updateProfile({ variables: { name, grade, school } });
      setSaved(true);
    } catch (err: any) {
      setError(err.graphQLErrors?.[0]?.message ?? "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="page-title">My profile</h1>
      <p className="page-sub">Your grade decides which subjects and mock exams you see.</p>

      <Card className="q-card">
        <div className="row" style={{ marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
            <div className="muted small">{user.email}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Badge tone={user.role === "ADMIN" ? "red" : user.role === "TEACHER" ? "amber" : "indigo"}>
              {user.role}
            </Badge>
          </div>
        </div>

        {error ? <ErrorText message={error} /> : null}
        {saved ? (
          <div className="feedback ok" style={{ marginBottom: 14 }}>
            ✅ Profile saved.
          </div>
        ) : null}

        <form onSubmit={save}>
          <Field label="Full name">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Grade" hint="You can change this at any time.">
            <select className="select" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </Field>
          <Field label="School (optional)">
            <input className="input" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Johannesburg College of Science" />
          </Field>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
      </Card>
    </>
  );
}
