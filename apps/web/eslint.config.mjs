import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const UI_LAYER_GUARD_MESSAGE =
  "UI modules must consume presenter functions instead of raw data or domain modules.";
const WEB_ROOT = path.dirname(fileURLToPath(import.meta.url));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    name: "project/base-rules",
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      complexity: ["error", 8],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "object-shorthand": ["error", "always"],

      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message:
            "Do not use enums. Prefer union types or const objects with inferred types.",
        },
        {
          selector: "TryStatement[handler=null]",
          message:
            "Do not use try/finally without a catch handler. Handle failures explicitly.",
        },
      ],
    },
  },

  {
    name: "project/typescript-rules",
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: WEB_ROOT,
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-check": false,
          "ts-expect-error": "allow-with-description",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },

  {
    name: "project/react-next-rules",
    files: ["**/*.{tsx}"],
    rules: {
      "react/jsx-boolean-value": ["error", "never"],
      "react/self-closing-comp": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },

  {
    name: "project/ui-boundaries",
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/lib/academic-catalog",
                "@/lib/api",
                "@/lib/catalog-insights",
                "@/lib/catalog-static",
                "@/lib/official-academics",
                "@/lib/official-study-plan-fallbacks",
                "@/lib/onboarding",
                "@/lib/planner-bootstrap",
                "@/lib/planner-subjects",
                "@/lib/search-index",
                "@/lib/site-content",
                "@/lib/time",
                "@/lib/timetable-grid",
              ],
              message: UI_LAYER_GUARD_MESSAGE,
            },
          ],
        },
      ],
    },
  },

  globalIgnores([
    "node_modules/**",
    "dist/**",
    ".next/**",
    "out/**",
    "build/**",
    "playwright-report/**",
    "test-results/**",
    "**/*.config.js",
    "**/*.config.mjs",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
