/**
 * PRACTICE — schema fragment
 * Instant-marking practice sessions per topic.
 */
export const schema: string = /* GraphQL */ `
enum AttemptMode { PRACTICE EXAM }
enum AttemptStatus { IN_PROGRESS SUBMITTED }

type AnswerResult {
  isCorrect: Boolean!
  awardedPoints: Int!
  correctOptionId: String
  correctOptionText: String
  correctText: String
  explanation: String
  totalPoints: Int!
  maxPoints: Int!
  answeredCount: Int!
}

type AttemptSummary {
  id: ID!
  mode: AttemptMode!
  title: String!
  subjectName: String!
  grade: Int!
  percentage: Float!
  totalPoints: Int!
  maxPoints: Int!
  submittedAt: String!
}

extend type Query {
  myAttempts(limit: Int, mode: AttemptMode): [AttemptSummary!]!
}

extend type Mutation {
  startPracticeSession(topicId: ID!, questionIds: [ID!]): ID!
  submitPracticeAnswer(attemptId: ID!, questionId: ID!, answerId: ID, answerText: String): AnswerResult!
  finishPracticeSession(attemptId: ID!): AttemptView!
}
`;
