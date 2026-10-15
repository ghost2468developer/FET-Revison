import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";
import { initials } from "./ui";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/subjects", label: "Subjects", icon: "📚", end: false },
  { to: "/exams", label: "Mock exams", icon: "🧪", end: false },
  { to: "/profile", label: "My profile", icon: "👤", end: false },
];

export default function Layout() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const isStaff = user.role === "ADMIN" || user.role === "TEACHER";

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">📚</div>
          <div>
            <div className="brand-name">FETRevise</div>
            <div className="brand-sub">Grade 10–12 prep</div>
          </div>
        </div>
        <nav>
          {navItems.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-link">
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
          {isStaff ? (
            <NavLink to="/admin" className="nav-link">
              <span className="nav-icon">⚙️</span>
              {user.role === "ADMIN" ? "Admin" : "Teacher panel"}
            </NavLink>
          ) : null}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{initials(user.name)}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-sub">
              {user.role.toLowerCase()}
              {user.profile ? ` · Grade ${user.profile.grade}` : ""}
            </div>
          </div>
          <button className="icon-btn" title="Sign out" onClick={logout}>
            ⏻
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
