/**
 * SUBJECTS — schema fragment
 * Grade → Subject → Topic → StudyMaterial / Question browsing.
 */
export const schema: string = /* GraphQL */ `
enum QuestionType { MCQ TRUE_FALSE SHORT_ANSWER }
enum Difficulty { EASY MEDIUM HARD }
enum MaterialType { SUMMARY DEFINITION FORMULA EXAMPLE STUDY_NOTE }

type Grade {
  id: Int!
  name: String!
}

type Subject {
  id: ID!
  code: String!
  name: String!
  color: String!
  grade: Grade!
  topicCount: Int!
  examCount: Int!
}

type Topic {
  id: ID!
  name: String!
  description: String!
  order: Int!
  subject: Subject!
  materialCount: Int!
  questionCount: Int!
}

type StudyMaterial {
  id: ID!
  type: MaterialType!
  title: String!
  content: String!
}

type AnswerOption {
  id: ID!
  text: String!
}

type PracticeQuestion {
  id: ID!
  type: QuestionType!
  difficulty: Difficulty!
  points: Int!
  text: String!
  options: [AnswerOption!]!
}

type AdminOption {
  id: ID!
  text: String!
  isCorrect: Boolean!
  keywords: [String!]!
  alternatives: [String!]!
}

type AdminQuestion {
  id: ID!
  topicId: ID!
  topicName: String!
  type: QuestionType!
  difficulty: Difficulty!
  points: Int!
  text: String!
  explanation: String!
  options: [AdminOption!]!
}

extend type Query {
  grades: [Grade!]!
  subjects(gradeId: Int): [Subject!]!
  subject(id: ID!): Subject
  topics(subjectId: ID!): [Topic!]!
  topic(id: ID!): Topic
  studyMaterials(topicId: ID!): [StudyMaterial!]!
  questions(topicId: ID!, questionIds: [ID!], type: QuestionType, difficulty: Difficulty): [PracticeQuestion!]!
  adminQuestions(topicId: ID!): [AdminQuestion!]!
  adminQuestion(id: ID!): AdminQuestion!
  subjectQuestions(subjectId: ID!): [AdminQuestion!]!
}
`;
