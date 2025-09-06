/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { todos as Query_todos } from './Query/todos';
import    { createTodo as Mutation_createTodo } from './Mutation/createTodo';
import    { deleteTodo as Mutation_deleteTodo } from './Mutation/deleteTodo';
import    { updateTodo as Mutation_updateTodo } from './Mutation/updateTodo';
import    { Todo } from './Todo';
    export const resolvers: Resolvers = {
      Query: { todos: Query_todos },
      Mutation: { createTodo: Mutation_createTodo,deleteTodo: Mutation_deleteTodo,updateTodo: Mutation_updateTodo },
      
      Todo: Todo
    }