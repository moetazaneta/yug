import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
    },
  },
});
