import fs from "fs";
import path from "path";

// SDL is read from src/schema.graphql in dev (tsx) and from dist/schema.graphql
// in production (copied next to the compiled code by the build script).
const candidates = [
  path.join(__dirname, "schema.graphql"),
  path.join(__dirname, "..", "src", "schema.graphql"),
];
const schemaPath = candidates.find((p) => fs.existsSync(p));
if (!schemaPath) throw new Error("schema.graphql not found");

export const typeDefs: string = fs.readFileSync(schemaPath, "utf8");
