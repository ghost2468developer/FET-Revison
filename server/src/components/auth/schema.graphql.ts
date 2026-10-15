/**
 * AUTH - schema fragment
 * User model, roles and all authentication operations.
 */
export const schema: string = /* GraphQL */ `
enum Role { STUDENT TEACHER ADMIN }

type StudentProfile {
  id: ID!
  grade: Int!
  school: String
}

type User {
  id: ID!
  name: String!
  email: String!
  avatarUrl: String
  role: Role!
  profile: StudentProfile
  createdAt: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  me: User
}

type Mutation {
  register(name: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  loginWithGoogle(credential: String!, name: String, picture: String): AuthPayload!
  updateProfile(name: String, grade: Int, school: String): User!
}
`;
