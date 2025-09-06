import type { MutationResolvers } from "../../../resolvers/types.generated";
export const createTodo: NonNullable<MutationResolvers["createTodo"]> = async (_parent, _arg, _ctx) => {
  return { id: "1", title: "Test", completed: false };
};
