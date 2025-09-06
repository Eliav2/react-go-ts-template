import type { QueryResolvers } from "./../types.generated";

export const todos: NonNullable<QueryResolvers["todos"]> = async (_parent, _arg, _ctx) => {
  // Basic implementation - returns empty array for now
  return [];
};
