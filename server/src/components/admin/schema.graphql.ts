/**
 * ADMIN - schema fragment
 * Teacher/admin content management and user roles.
 */
export const schema: string = /* GraphQL */ `
input OptionInput {
  text: String!
  isCorrect: Boolean!
  keywords: [String!]
  alternatives: [String!]
}

extend type Query {
  users: [User!]!
}

extend type Mutation {
  createSubject(gradeId: Int!, code: String!, name: String!, color: String): Subject!
  updateSubject(id: ID!, code: String, name: String, color: String): Subject!
  deleteSubject(id: ID!): Boolean!
  createTopic(subjectId: ID!, name: String!, description: String): Topic!
  updateTopic(id: ID!, name: String, description: String): Topic!
  deleteTopic(id: ID!): Boolean!
  createStudyMaterial(topicId: ID!, type: MaterialType!, title: String!, content: String!): StudyMaterial!
  deleteStudyMaterial(id: ID!): Boolean!
  createQuestion(topicId: ID!, type: QuestionType!, difficulty: Difficulty, points: Int, text: String!, explanation: String, options: [OptionInput!]!): AdminQuestion!
  updateQuestion(id: ID!, text: String, explanation: String, points: Int, options: [OptionInput!]): AdminQuestion!
  deleteQuestion(id: ID!): Boolean!
  createExam(gradeId: Int!, subjectId: ID!, title: String!, description: String, durationMinutes: Int): ExamSummary!
  updateExam(id: ID!, title: String, description: String, durationMinutes: Int): ExamSummary!
  deleteExam(id: ID!): Boolean!
  addExamQuestion(examId: ID!, questionId: ID!): ExamSummary!
  removeExamQuestion(examId: ID!, questionId: ID!): ExamSummary!
  setUserRole(userId: ID!, role: Role!): User!
}
`;
