/**
 * Root resolver map.
 *
 * Each feature owns its resolvers in  src/components/<feature>/resolvers.ts
 * alongside its schema fragment. They are merged into one Apollo resolver map here.
 */
import { authResolvers } from "./components/auth/resolvers";
import { subjectsResolvers } from "./components/subjects/resolvers";
import { practiceResolvers } from "./components/practice/resolvers";
import { examResolvers } from "./components/exams/resolvers";
import { dashboardResolvers } from "./components/dashboard/resolvers";
import { adminResolvers } from "./components/admin/resolvers";

function merge(objs: Record<string, any>[]): Record<string, any> {
  return objs.reduce((acc, o) => {
    for (const [type, fields] of Object.entries(o)) {
      acc[type] = { ...(acc[type] ?? {}), ...(fields as any) };
    }
    return acc;
  }, {} as Record<string, any>);
}

export const resolvers = merge([
  authResolvers,
  subjectsResolvers,
  practiceResolvers,
  examResolvers,
  dashboardResolvers,
  adminResolvers,
]);
