import { Hono } from "hono";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { todosTable } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/todos", async (c) => {
  const todos = db.select().from(todosTable);
  return c.json(todos);
});

app.post("/api/todos", async (c) => {
  const { title } = await c.req.json();
  const todo = db.insert(todosTable).values({ title });
  return c.json(todo);
});

export default app;
