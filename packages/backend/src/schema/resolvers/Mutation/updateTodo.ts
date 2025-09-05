import type { MutationResolvers } from "./../../../resolvers/types.generated";
export const updateTodo: NonNullable<MutationResolvers['updateTodo']> = async (_parent, _arg, _ctx) => {
  return { id: "1", title: "Test", completed: false };
};
