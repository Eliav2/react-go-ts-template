import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/schema/**/*.graphqls",
  generates: {
    "src/generated/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
        contextType: "../context#Context",
      },
    },
  },
};
export default config;
