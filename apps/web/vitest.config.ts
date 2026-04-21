import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "cobertura"],
      reportsDirectory: path.resolve(root, "./coverage"),
    },
    environment: "jsdom",
    globals: true,
    hookTimeout: 40_000,
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 40_000,
  },
});
