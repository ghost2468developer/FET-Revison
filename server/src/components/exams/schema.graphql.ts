/**
 * EXAMS - schema fragment
 * Timed mock exams: sessions, auto-marking and results review.
 */
export const schema: string = /* GraphQL */ `
type ExamSummary {
  id: ID!
  title: String!
  description: String!
  durationMinutes: Int!
  questionCount: Int!
  totalPoints: Int!
  subject: Subject!
  grade: Grade!
  bestPercentage: Float
}

type ExamSession {
  attemptId: ID!
  examId: ID!
  title: String!
  subjectName: String!
  durationMinutes: Int!
  deadlineAt: String!
  questions: [PracticeQuestion!]!
}

type ReviewOption {
  id: ID!
  text: String!
  isCorrect: Boolean!
}

type ReviewQuestion {
  id: ID!
  type: QuestionType!
  difficulty: Difficulty!
  points: Int!
  text: String!
  explanation: String
  options: [ReviewOption!]!
  correctText: String
}

type AttemptAnswerView {
  question: ReviewQuestion!
  selectedOptionId: String
  selectedOptionText: String
  correctText: String
  isCorrect: Boolean
  awardedPoints: Int!
}

type AttemptView {
  id: ID!
  mode: AttemptMode!
  status: AttemptStatus!
  exam: ExamSummary
  topic: Topic
  startedAt: String!
  submittedAt: String
  totalPoints: Int!
  maxPoints: Int!
  percentage: Float
  durationSeconds: Int
  answers: [AttemptAnswerView!]!
}

extend type Query {
  exams(gradeId: Int): [ExamSummary!]!
  exam(id: ID!): ExamSummary
  examQuestions(examId: ID!): [AdminQuestion!]!
  attempt(id: ID!): AttemptView
}

extend type Mutation {
  startExam(examId: ID!): ExamSession!
  submitExamAnswer(attemptId: ID!, questionId: ID!, answerId: ID, answerText: String): Boolean!
  submitExam(attemptId: ID!): AttemptView!
}
`;
