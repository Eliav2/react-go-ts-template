import { useQuery, useInfiniteQuery, useMutation, type UseQueryOptions, type UseInfiniteQueryOptions, type InfiniteData, type UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch('/graphql' as string, {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateTodoInput = {
  title: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodo: Todo;
  createUser: User;
  deleteTodo: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  updateTodo: Todo;
  updateUser: User;
};


export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteTodoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTodoArgs = {
  input: UpdateTodoInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  todos: Array<Todo>;
  users: Array<User>;
};

export type Todo = {
  __typename?: 'Todo';
  completed: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type UpdateTodoInput = {
  done?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  todos: Array<Todo>;
};

export type GetTodosQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTodosQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'Todo', id: string, title: string, completed: boolean, userId?: string | null, user?: { __typename?: 'User', id: string, name: string, email: string } | null }> };

export type CreateTodoMutationVariables = Exact<{
  input: CreateTodoInput;
}>;


export type CreateTodoMutation = { __typename?: 'Mutation', createTodo: { __typename?: 'Todo', id: string, title: string, completed: boolean, userId?: string | null } };

export type UpdateTodoMutationVariables = Exact<{
  input: UpdateTodoInput;
}>;


export type UpdateTodoMutation = { __typename?: 'Mutation', updateTodo: { __typename?: 'Todo', id: string, title: string, completed: boolean, userId?: string | null } };

export type DeleteTodoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTodoMutation = { __typename?: 'Mutation', deleteTodo: boolean };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string, email: string }> };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, name: string, email: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, name: string, email: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };



export const GetTodosDocument = `
    query GetTodos {
  todos {
    id
    title
    completed
    userId
    user {
      id
      name
      email
    }
  }
}
    `;

export const useGetTodosQuery = <
      TData = GetTodosQuery,
      TError = unknown
    >(
      variables?: GetTodosQueryVariables,
      options?: Omit<UseQueryOptions<GetTodosQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTodosQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetTodosQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetTodos'] : ['GetTodos', variables],
    queryFn: fetcher<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, variables),
    ...options
  }
    )};

useGetTodosQuery.getKey = (variables?: GetTodosQueryVariables) => variables === undefined ? ['GetTodos'] : ['GetTodos', variables];

export const useInfiniteGetTodosQuery = <
      TData = InfiniteData<GetTodosQuery>,
      TError = unknown
    >(
      variables: GetTodosQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetTodosQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetTodosQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetTodosQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['GetTodos.infinite'] : ['GetTodos.infinite', variables],
      queryFn: (metaData) => fetcher<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetTodosQuery.getKey = (variables?: GetTodosQueryVariables) => variables === undefined ? ['GetTodos.infinite'] : ['GetTodos.infinite', variables];


useGetTodosQuery.fetcher = (variables?: GetTodosQueryVariables) => fetcher<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, variables);

export const CreateTodoDocument = `
    mutation CreateTodo($input: CreateTodoInput!) {
  createTodo(input: $input) {
    id
    title
    completed
    userId
  }
}
    `;

export const useCreateTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTodoMutation, TError, CreateTodoMutationVariables, TContext>) => {
    
    return useMutation<CreateTodoMutation, TError, CreateTodoMutationVariables, TContext>(
      {
    mutationKey: ['CreateTodo'],
    mutationFn: (variables?: CreateTodoMutationVariables) => fetcher<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, variables)(),
    ...options
  }
    )};

useCreateTodoMutation.getKey = () => ['CreateTodo'];


useCreateTodoMutation.fetcher = (variables: CreateTodoMutationVariables) => fetcher<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, variables);

export const UpdateTodoDocument = `
    mutation UpdateTodo($input: UpdateTodoInput!) {
  updateTodo(input: $input) {
    id
    title
    completed
    userId
  }
}
    `;

export const useUpdateTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateTodoMutation, TError, UpdateTodoMutationVariables, TContext>) => {
    
    return useMutation<UpdateTodoMutation, TError, UpdateTodoMutationVariables, TContext>(
      {
    mutationKey: ['UpdateTodo'],
    mutationFn: (variables?: UpdateTodoMutationVariables) => fetcher<UpdateTodoMutation, UpdateTodoMutationVariables>(UpdateTodoDocument, variables)(),
    ...options
  }
    )};

useUpdateTodoMutation.getKey = () => ['UpdateTodo'];


useUpdateTodoMutation.fetcher = (variables: UpdateTodoMutationVariables) => fetcher<UpdateTodoMutation, UpdateTodoMutationVariables>(UpdateTodoDocument, variables);

export const DeleteTodoDocument = `
    mutation DeleteTodo($id: ID!) {
  deleteTodo(id: $id)
}
    `;

export const useDeleteTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTodoMutation, TError, DeleteTodoMutationVariables, TContext>) => {
    
    return useMutation<DeleteTodoMutation, TError, DeleteTodoMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTodo'],
    mutationFn: (variables?: DeleteTodoMutationVariables) => fetcher<DeleteTodoMutation, DeleteTodoMutationVariables>(DeleteTodoDocument, variables)(),
    ...options
  }
    )};

useDeleteTodoMutation.getKey = () => ['DeleteTodo'];


useDeleteTodoMutation.fetcher = (variables: DeleteTodoMutationVariables) => fetcher<DeleteTodoMutation, DeleteTodoMutationVariables>(DeleteTodoDocument, variables);

export const GetUsersDocument = `
    query GetUsers {
  users {
    id
    name
    email
  }
}
    `;

export const useGetUsersQuery = <
      TData = GetUsersQuery,
      TError = unknown
    >(
      variables?: GetUsersQueryVariables,
      options?: Omit<UseQueryOptions<GetUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetUsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetUsers'] : ['GetUsers', variables],
    queryFn: fetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables),
    ...options
  }
    )};

useGetUsersQuery.getKey = (variables?: GetUsersQueryVariables) => variables === undefined ? ['GetUsers'] : ['GetUsers', variables];

export const useInfiniteGetUsersQuery = <
      TData = InfiniteData<GetUsersQuery>,
      TError = unknown
    >(
      variables: GetUsersQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<GetUsersQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['GetUsers.infinite'] : ['GetUsers.infinite', variables],
      queryFn: (metaData) => fetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteGetUsersQuery.getKey = (variables?: GetUsersQueryVariables) => variables === undefined ? ['GetUsers.infinite'] : ['GetUsers.infinite', variables];


useGetUsersQuery.fetcher = (variables?: GetUsersQueryVariables) => fetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables);

export const CreateUserDocument = `
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
    `;

export const useCreateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateUserMutation, TError, CreateUserMutationVariables, TContext>) => {
    
    return useMutation<CreateUserMutation, TError, CreateUserMutationVariables, TContext>(
      {
    mutationKey: ['CreateUser'],
    mutationFn: (variables?: CreateUserMutationVariables) => fetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables)(),
    ...options
  }
    )};

useCreateUserMutation.getKey = () => ['CreateUser'];


useCreateUserMutation.fetcher = (variables: CreateUserMutationVariables) => fetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables);

export const UpdateUserDocument = `
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    name
    email
  }
}
    `;

export const useUpdateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUserMutation, TError, UpdateUserMutationVariables, TContext>) => {
    
    return useMutation<UpdateUserMutation, TError, UpdateUserMutationVariables, TContext>(
      {
    mutationKey: ['UpdateUser'],
    mutationFn: (variables?: UpdateUserMutationVariables) => fetcher<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, variables)(),
    ...options
  }
    )};

useUpdateUserMutation.getKey = () => ['UpdateUser'];


useUpdateUserMutation.fetcher = (variables: UpdateUserMutationVariables) => fetcher<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, variables);

export const DeleteUserDocument = `
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;

export const useDeleteUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>) => {
    
    return useMutation<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>(
      {
    mutationKey: ['DeleteUser'],
    mutationFn: (variables?: DeleteUserMutationVariables) => fetcher<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables)(),
    ...options
  }
    )};

useDeleteUserMutation.getKey = () => ['DeleteUser'];


useDeleteUserMutation.fetcher = (variables: DeleteUserMutationVariables) => fetcher<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables);
