/**
 * DASHBOARD — schema fragment
 * Progress analytics: weak/strong topics, accuracy, trends.
 */
export const schema: string = /* GraphQL */ `
type TopicScore {
  topic: Topic!
  accuracy: Float!
  attempts: Int!
}

type SubjectScore {
  subject: Subject!
  accuracy: Float!
  attempts: Int!
}

type ScorePoint {
  date: String!
  percentage: Float!
}

type Dashboard {
  questionsAttempted: Int!
  correctRate: Float!
  averagePercentage: Float
  examCount: Int!
  studyMinutes: Int!
  currentStreak: Int!
  weakTopics: [TopicScore!]!
  strongTopics: [TopicScore!]!
  subjectAccuracy: [SubjectScore!]!
  recentActivity: [AttemptSummary!]!
  examResults: [AttemptSummary!]!
  scoreTrend: [ScorePoint!]!
}

extend type Query {
  dashboard: Dashboard
}
`;
