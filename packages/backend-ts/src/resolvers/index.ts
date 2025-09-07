import { eq } from "drizzle-orm";
import { todosTable, usersTable } from "../db/schema";
import type { Resolvers, User, Todo } from "../generated/types";

export const resolvers: Resolvers = {
  Query: {
    todos: async (_, __, { db }) => {
      const todos = await db.select().from(todosTable);
      return todos as Todo[];
    },
    users: async (_, __, { db }) => {
      const users = await db.select().from(usersTable);
      return users as User[];
    },
  },

  Mutation: {
    createTodo: async (_, { input }, { db }) => {
      const [todo] = await db
        .insert(todosTable)
        .values({
          title: input.title,
          userId: input.userId || null,
          completed: false,
        })
        .returning();
      return todo as Todo;
    },

    updateTodo: async (_, { input }, { db }) => {
      const updateData: Partial<typeof todosTable.$inferInsert> = {};

      if (input.title !== undefined && input.title !== null)
        updateData.title = input.title;
      if (input.done !== undefined && input.done !== null)
        updateData.completed = input.done;
      if (input.userId !== undefined && input.userId !== null)
        updateData.userId = input.userId;

      const [todo] = await db
        .update(todosTable)
        .set(updateData)
        .where(eq(todosTable.id, input.id))
        .returning();
      return todo as Todo;
    },

    deleteTodo: async (_, { id }, { db }) => {
      const result = await db
        .delete(todosTable)
        .where(eq(todosTable.id, id))
        .returning();
      return result.length > 0;
    },

    createUser: async (_, { input }, { db }) => {
      const [user] = await db
        .insert(usersTable)
        .values({
          email: input.email,
          name: input.name,
        })
        .returning();
      return user as User;
    },

    updateUser: async (_, { input }, { db }) => {
      const updateData: Partial<typeof usersTable.$inferInsert> = {};

      if (input.email !== undefined && input.email !== null)
        updateData.email = input.email;
      if (input.name !== undefined && input.name !== null)
        updateData.name = input.name;

      const [user] = await db
        .update(usersTable)
        .set(updateData)
        .where(eq(usersTable.id, input.id))
        .returning();
      return user as User;
    },

    deleteUser: async (_, { id }, { db }) => {
      const result = await db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning();
      return result.length > 0;
    },
  },

  Todo: {
    user: async (parent, _, { db }) => {
      if (!parent.userId) return null;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, parent.userId));
      return (user as User) || null;
    },
  },

  User: {
    todos: async (parent, _, { db }) => {
      const todos = await db
        .select()
        .from(todosTable)
        .where(eq(todosTable.userId, parent.id));
      return todos as Todo[];
    },
  },
};
