import type { MutationResolvers } from "./../types.generated";

export const createTodo: NonNullable<MutationResolvers["createTodo"]> = async (_parent, { input }, _ctx) => {
  // Basic implementation - returns a mock todo
  return {
    id: "1",
    title: input.title,
    completed: false,
  };
};
