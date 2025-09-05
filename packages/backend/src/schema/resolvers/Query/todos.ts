import type { QueryResolvers } from "./../../../resolvers/types.generated";
export const todos: NonNullable<QueryResolvers['todos']> = async (_parent, _arg, _ctx) => {
  return [];
};