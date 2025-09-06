import type { MutationResolvers } from "./../types.generated";

export const updateTodo: NonNullable<MutationResolvers["updateTodo"]> = async (_parent, { input }, _ctx) => {
  // Basic implementation - returns a mock updated todo
  return {
    id: input.id,
    title: input.title || "Updated Todo",
    completed: input.done ?? false,
  };
};
