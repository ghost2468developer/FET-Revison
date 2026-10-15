export type Role = "STUDENT" | "TEACHER" | "ADMIN";
export type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type MaterialType = "SUMMARY" | "DEFINITION" | "FORMULA" | "EXAMPLE" | "STUDY_NOTE";

export interface Grade {
  id: number;
  name: string;
}
export interface Profile {
  id: string;
  grade: number;
  school: string | null;
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  profile: Profile | null;
  createdAt: string;
}
export interface Subject {
  id: string;
  code: string;
  name: string;
  color: string;
  grade: Grade;
  topicCount: number;
  examCount: number;
}
export interface Topic {
  id: string;
  name: string;
  description: string;
  order: number;
  subject: Subject;
  materialCount: number;
  questionCount: number;
}
export interface StudyMaterial {
  id: string;
  type: MaterialType;
  title: string;
  content: string;
}
export interface AnswerOption {
  id: string;
  text: string;
}
export interface PracticeQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  points: number;
  text: string;
  options: AnswerOption[];
}
export interface AnswerResult {
  isCorrect: boolean;
  awardedPoints: number;
  correctOptionId: string | null;
  correctOptionText: string | null;
  correctText: string | null;
  explanation: string | null;
  totalPoints: number;
  maxPoints: number;
  answeredCount: number;
}
export interface ExamSummary {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  totalPoints: number;
  subject: Subject;
  grade: Grade;
  bestPercentage: number | null;
}
export interface ExamSession {
  attemptId: string;
  examId: string;
  title: string;
  subjectName: string;
  durationMinutes: number;
  deadlineAt: string;
  questions: PracticeQuestion[];
}
export interface ReviewOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
export interface ReviewQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  points: number;
  text: string;
  explanation: string | null;
  options: ReviewOption[];
  correctText: string | null;
}
export interface AttemptAnswerView {
  question: ReviewQuestion;
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  correctText: string | null;
  isCorrect: boolean | null;
  awardedPoints: number;
}
export interface AttemptView {
  id: string;
  mode: "PRACTICE" | "EXAM";
  status: "IN_PROGRESS" | "SUBMITTED";
  exam: ExamSummary | null;
  topic: Topic | null;
  startedAt: string;
  submittedAt: string | null;
  totalPoints: number;
  maxPoints: number;
  percentage: number | null;
  durationSeconds: number | null;
  answers: AttemptAnswerView[];
}
export interface AttemptSummary {
  id: string;
  mode: "PRACTICE" | "EXAM";
  title: string;
  subjectName: string;
  grade: number;
  percentage: number;
  totalPoints: number;
  maxPoints: number;
  submittedAt: string;
}
export interface TopicScore {
  topic: Topic;
  accuracy: number;
  attempts: number;
}
export interface SubjectScore {
  subject: Subject;
  accuracy: number;
  attempts: number;
}
export interface ScorePoint {
  date: string;
  percentage: number;
}
export interface Dashboard {
  questionsAttempted: number;
  correctRate: number;
  averagePercentage: number | null;
  examCount: number;
  studyMinutes: number;
  currentStreak: number;
  weakTopics: TopicScore[];
  strongTopics: TopicScore[];
  subjectAccuracy: SubjectScore[];
  recentActivity: AttemptSummary[];
  examResults: AttemptSummary[];
  scoreTrend: ScorePoint[];
}
export interface AdminOption {
  id: string;
  text: string;
  isCorrect: boolean;
  keywords: string[];
  alternatives: string[];
}
export interface AdminQuestion {
  id: string;
  topicId: string;
  topicName: string;
  type: QuestionType;
  difficulty: Difficulty;
  points: number;
  text: string;
  explanation: string;
  options: AdminOption[];
}
