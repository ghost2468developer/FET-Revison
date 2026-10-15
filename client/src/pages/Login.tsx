import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { M_GOOGLE, M_LOGIN, M_REGISTER } from "../gql";
import { useAuth } from "../auth";
import GoogleButton, { googleConfigured } from "../components/GoogleButton";
import { ErrorText, Field } from "../components/ui";

function graphqlelError(err: { graphQLErrors?: { message: string }[]; networkError?: unknown }): string {
  return err.graphQLErrors?.[0]?.message ?? "Something went wrong. Please try again.";
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [register] = useMutation(M_REGISTER);
  const [doLogin] = useMutation(M_LOGIN);
  const [googleLogin] = useMutation(M_GOOGLE);

  const finish = (token: string) => {
    login(token);
    navigate("/", { replace: true });
  };

  const onGoogle = async (credential: string, nameFromGoogle?: string, picture?: string) => {
    setError("");
    setBusy(true);
    try {
      const res = await googleLogin({ variables: { credential, name: nameFromGoogle, picture } });
      finish(res.data.loginWithGoogle.token);
    } catch (e: any) {
      setError(graphqlelError(e));
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res =
        mode === "register"
          ? await register({ variables: { name, email, password } })
          : await doLogin({ variables: { email, password } });
      const token = mode === "register" ? res.data.register.token : res.data.login.token;
      finish(token);
    } catch (err: any) {
      setError(graphqlelError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-hero">
        <div className="brand">
          <div className="logo">📚</div>
          <div>
            <div className="brand-name">FETRevise</div>
            <div className="brand-sub">South African Grade 10–12</div>
          </div>
        </div>
        <h1 className="hero-title">Revise smarter. Walk into your exams ready.</h1>
        <p className="hero-sub">
          Topic-by-topic revision notes, instant-marking practice questions, and timed mock
          exams for FET subjects - with progress tracking that shows you exactly what to
          work on.
        </p>
        <div className="feature">
          <div className="ico">📚</div>
          <div>
            <div className="feature-t">Grade → Subject → Topic</div>
            <div className="feature-d">Summaries, definitions, formulas and worked examples per topic.</div>
          </div>
        </div>
        <div className="feature">
          <div className="ico">⚡</div>
          <div>
            <div className="feature-t">Instant marking</div>
            <div className="feature-d">MCQ, true/false and short-answer questions with explanations.</div>
          </div>
        </div>
        <div className="feature">
          <div className="ico">🧪</div>
          <div>
            <div className="feature-t">Timed mock exams</div>
            <div className="feature-d">Auto-marked papers with a full question-by-question review.</div>
          </div>
        </div>
        <div className="feature">
          <div className="ico">📈</div>
          <div>
            <div className="feature-t">Know your weak spots</div>
            <div className="feature-d">Your dashboard highlights weak topics, strong topics and your trend.</div>
          </div>
        </div>
      </div>

      <div className="login-side">
        <div className="login-card">
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="sub">
            {mode === "login"
              ? "Log in to continue your revision."
              : "Register in seconds and start revising today."}
          </p>

          {error ? <ErrorText message={error} /> : null}

          {googleConfigured ? (
            <>
              <GoogleButton onCredential={onGoogle} />
              <div className="divider">or with your email</div>
            </>
          ) : (
            <div className="login-note" style={{ marginBottom: 18, textAlign: "left" }}>
              🔑 <b>Google sign-in</b> is available once a Google OAuth client ID is configured
              (see the README). You can use email login below in the meantime.
            </div>
          )}

          <form onSubmit={submit}>
            {mode === "register" ? (
              <Field label="Full name">
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Thandi Mokoena"
                  required
                />
              </Field>
            ) : null}
            <Field label="Email">
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Field>
            <Field label="Password" hint={mode === "register" ? "At least 6 characters." : undefined}>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </Field>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="login-note">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <a
              style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
