import React from "react";
import type { Difficulty, QuestionType } from "../types";

export function Card({
  children,
  className = "",
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`card ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
}

export function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="card stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub ? <div className="stat-sub">{sub}</div> : null}
      </div>
    </div>
  );
}

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const tone = level === "EASY" ? "green" : level === "MEDIUM" ? "amber" : "red";
  return <Badge tone={tone}>{level.toLowerCase()}</Badge>;
}

export function TypeBadge({ type }: { type: QuestionType }) {
  const label = type === "MCQ" ? "Multiple choice" : type === "TRUE_FALSE" ? "True / False" : "Short answer";
  return <Badge tone="indigo">{label}</Badge>;
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="progress">
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="loading-block">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function Empty({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-title">{title}</div>
      {hint ? <div className="empty-hint">{hint}</div> : null}
      {action}
    </div>
  );
}

/** SVG score ring. */
export function ScoreRing({ percentage, size = 120 }: { percentage: number; size?: number }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, percentage));
  const tone = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--amber)" : "var(--red)";
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>
      <div className="ring-val">
        {Math.round(pct)}
        <span>%</span>
      </div>
    </div>
  );
}

/** Tiny markdown-ish renderer: ## headings, - bullets, **bold**, `code`. */
export function Rich({ text }: { text: string }) {
  const inline = (s: string, key: number) => {
    const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
    return (
      <React.Fragment key={key}>
        {parts.map((p, i) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={i}>{p.slice(2, -2)}</strong>
          ) : p.startsWith("`") && p.endsWith("`") ? (
            <code key={i}>{p.slice(1, -1)}</code>
          ) : (
            <React.Fragment key={i}>{p}</React.Fragment>
          )
        )}
      </React.Fragment>
    );
  };
  const lines = text.split("\n");
  return (
    <div className="rich">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="rich-gap" />;
        if (line.startsWith("## ")) return <h4 key={i}>{inline(line.slice(3), i)}</h4>;
        if (line.startsWith("- ") || line.startsWith("• "))
          return <div key={i} className="rich-li">{inline(line.slice(2), i)}</div>;
        if (/^\d+\.\s/.test(line))
          return <div key={i} className="rich-li">{inline(line.replace(/^\d+\.\s/, ""), i)}</div>;
        return <p key={i}>{inline(line, i)}</p>;
      })}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="form-row">
      <label>{label}</label>
      {children}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

export function ErrorText({ message }: { message: string }) {
  return <div className="error-text">{message}</div>;
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtDuration(totalSeconds: number | null) {
  if (totalSeconds == null) return "-";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
