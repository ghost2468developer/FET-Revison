import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema.graphql";
import { resolvers } from "./resolvers";
import { createContext } from "./context";

async function main() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: (args: any) => createContext({ req: args.req }),
    })
  );

  // Serve the built React app (production mode: single port).
  const dist = path.resolve(__dirname, "..", "..", "client", "dist");
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get(/^(?!\/graphql).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));
  } else {
    app.get("/", (_req, res) =>
      res
        .type("text/plain")
        .send("API is running. GraphQL endpoint: /graphql — client build not found (run `npm run build` in client/).")
    );
  }

  const port = Number(process.env.PORT || 4000);
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ FETRevise running on http://localhost:${port}`);
    console.log(`   GraphQL endpoint:  http://localhost:${port}/graphql`);
    console.log(`   Google sign-in:    ${process.env.GOOGLE_CLIENT_ID ? "ENABLED" : "not configured (set GOOGLE_CLIENT_ID)"}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
