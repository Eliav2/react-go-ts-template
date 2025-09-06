import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/schema/**/*.graphqls",
  generates: {
    "src/resolvers": defineConfig({
      // generates resolver files + types; minimal == root fields only
      resolverGeneration: "recommended",
      mode: "merged",
      // typesPluginsConfig: { contextType: "../server/context#Context" },
    }),
  },
};
export default config;
