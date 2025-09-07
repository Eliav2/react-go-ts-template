import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  server: {
    proxy: {
      // go backend
      "/graphql": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, "/query"),
      },
      // // ts backend
      // "/graphql": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/graphql/, "/query"),
      // },
    },
  },
});
