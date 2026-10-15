import { authResolvers } from "./auth";
import { browseResolvers } from "./browse";
import { practiceResolvers } from "./practice";
import { examResolvers } from "./exams";
import { dashboardResolvers } from "./dashboard";
import { adminResolvers } from "./admin";

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
  browseResolvers,
  practiceResolvers,
  examResolvers,
  dashboardResolvers,
  adminResolvers,
]);
