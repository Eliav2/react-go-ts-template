import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";
import { todosTable } from "./db/schema";
import { createYoga } from "graphql-yoga";
import { createSchema } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { createContext, Context } from "./context";
import { readFileSync } from "fs";
import { join } from "path";

const app = new Hono();

// Enable CORS
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

const rootPath = join(__dirname, "../../..");

// Read the schema files directly from the API directory
const todosSchema = readFileSync(
  join(rootPath, "api/schema/todos.graphqls"),
  "utf8"
);
const usersSchema = readFileSync(
  join(rootPath, "api/schema/users.graphqls"),
  "utf8"
);
const typeDefs = [todosSchema, usersSchema];

// Create GraphQL schema
const schema = createSchema<Context>({
  typeDefs,
  resolvers,
});

// Create GraphQL Yoga instance
const yoga = createYoga<Context>({
  schema,
  graphqlEndpoint: "/graphql",
  landingPage: false,
  context: () => createContext(),
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
  const { db } = createContext();
  const todos = await db.select().from(todosTable);
  return c.json(todos);
});

app.post("/api/todos", async (c) => {
  const { db } = createContext();
  const { title } = await c.req.json();
  const [todo] = await db
    .insert(todosTable)
    .values({ title, completed: false })
    .returning();
  return c.json(todo);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
