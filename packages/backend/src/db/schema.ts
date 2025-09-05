import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
});
