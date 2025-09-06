import type { MutationResolvers } from "./../types.generated";

export const deleteTodo: NonNullable<MutationResolvers["deleteTodo"]> = async (_parent, { id }, _ctx) => {
  // Basic implementation - always returns true for now
  return true;
};
