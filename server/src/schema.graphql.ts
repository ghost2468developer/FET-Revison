/**
 * Root GraphQL schema.
 *
 * The full SDL is assembled from per-feature fragments, each living next to
 * its resolvers:  src/components/<feature>/schema.graphql.ts
 *
 * Each fragment exports `schema`; the auth fragment owns the base
 * `type Query` / `type Mutation`, and the rest `extend` them.
 */
import { schema as authSchema } from "./components/auth/schema.graphql";
import { schema as subjectsSchema } from "./components/subjects/schema.graphql";
import { schema as practiceSchema } from "./components/practice/schema.graphql";
import { schema as examsSchema } from "./components/exams/schema.graphql";
import { schema as dashboardSchema } from "./components/dashboard/schema.graphql";
import { schema as adminSchema } from "./components/admin/schema.graphql";

export const typeDefs: string = [
  authSchema,
  subjectsSchema,
  practiceSchema,
  examsSchema,
  dashboardSchema,
  adminSchema,
].join("\n");
