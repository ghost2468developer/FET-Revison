import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import { LoadingBlock } from "./components/ui";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import TopicDetail from "./pages/TopicDetail";
import PracticeRunner from "./pages/PracticeRunner";
import Exams from "./pages/Exams";
import ExamRunner from "./pages/ExamRunner";
import ResultPage from "./pages/ResultPage";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

export default function App() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <LoadingBlock label="Loading FETRevise…" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
        <Route path="/subjects/:subjectId/topics/:topicId" element={<TopicDetail />} />
        <Route path="/practice/:topicId" element={<PracticeRunner />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:examId" element={<ExamRunner />} />
        <Route path="/results/:attemptId" element={<ResultPage />} />
        <Route path="/profile" element={<Profile />} />
        {user && (user.role === "ADMIN" || user.role === "TEACHER") ? (
          <Route path="/admin" element={<Admin />} />
        ) : null}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
