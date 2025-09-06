import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { todosTable } from "./db/schema";
import { createYoga } from "graphql-yoga";
import { createSchema } from "graphql-yoga";
import { resolvers } from "./resolvers/resolvers.generated";
import { readFileSync } from "fs";
import { join } from "path";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();

// Enable CORS
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// Read the schema from the generated file
const typeDefs = readFileSync(join(__dirname, "resolvers/schema.generated.graphqls"), "utf8");

// Create GraphQL schema
const schema = createSchema({
  typeDefs,
  resolvers,
});

// Create GraphQL Yoga instance
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  landingPage: false,
});

// Add GraphQL endpoint
app.all("/graphql", async (c) => {
  return yoga.handle(c.req.raw, {});
});

// Basic route
app.get("/", (c) => {
  return c.text("TypeScript GraphQL Backend with Shared Schema");
});

// REST endpoints (keep for comparison)
app.get("/api/todos", async (c) => {
  const todos = db.select().from(todosTable);
  return c.json(todos);
});

app.post("/api/todos", async (c) => {
  const { title } = await c.req.json();
  const todo = db.insert(todosTable).values({ title });
  return c.json(todo);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
