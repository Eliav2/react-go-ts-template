import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/schema/**/*.graphqls",
  documents: "src/queries/**/*.gql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-query"],
      config: {
        fetcher: "fetch",
      },
    },
  },
};

export default config;
