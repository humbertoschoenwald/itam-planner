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
    exclude: ["tests/e2e/**"],
    globals: true,
    hookTimeout: 40_000,
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 40_000,
  },
});
