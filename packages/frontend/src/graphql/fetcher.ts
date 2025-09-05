export const fetcher = <TData, TVariables>(query: string, variables?: TVariables) => {
  return async (): Promise<TData> => {
    const res = await fetch("/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data as TData;
  };
};
