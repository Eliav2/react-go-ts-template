import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/schema/**/*.graphqls",
  documents: "src/queries/**/*.gql",
  generates: {
    "src/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        reactQueryVersion: 5,
        useTypeImports: true,
        fetcher: {
          // endpoint is treated as a raw TS expression. Wrap the literal in quotes.
          endpoint: "'/graphql'",
          fetchParams: JSON.stringify({
            headers: {
              "Content-Type": "application/json",
            },
          }),
        },
        dedupeFragments: true,
        exposeFetcher: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        addInfiniteQuery: true,
        legacyMode: false,
      },
    },
  },
};

export default config;
