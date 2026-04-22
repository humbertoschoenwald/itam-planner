// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const FORBIDDEN_UI_IMPORTS = new Set([
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
]);
const UI_DIRECTORIES = ["app", "components"];

describe("ui architecture boundaries", () => {
  it("keeps pages and components on presenter-layer imports", () => {
    const violations = UI_DIRECTORIES.flatMap((directory) =>
      collectUiFiles(path.resolve(process.cwd(), directory)).flatMap((filePath) =>
        collectImportSources(filePath)
          .filter((source) => FORBIDDEN_UI_IMPORTS.has(source))
          .map((source) => `${path.relative(process.cwd(), filePath)} -> ${source}`),
      ),
    );

    expect(violations).toEqual([]);
  });
});

function collectUiFiles(directoryPath: string): string[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return collectUiFiles(nextPath);
    }

    return /\.(ts|tsx)$/u.test(entry.name) ? [nextPath] : [];
  });
}

function collectImportSources(filePath: string): string[] {
  const source = fs.readFileSync(filePath, "utf8");
  return [...source.matchAll(/from\s+"([^"]+)"/gu)].map((match) => match[1] ?? "");
}
