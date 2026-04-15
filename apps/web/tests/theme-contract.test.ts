import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = join(import.meta.dirname, "..");

describe("theme contract", () => {
  it("keeps system light and dark theme support in layout metadata", () => {
    const layoutSource = readFileSync(join(appRoot, "app", "layout.tsx"), "utf8");

    expect(layoutSource).toContain('colorScheme: "dark light"');
    expect(layoutSource).toContain("prefers-color-scheme: light");
    expect(layoutSource).toContain("prefers-color-scheme: dark");
  });

  it("defines a dark palette override in the global stylesheet", () => {
    const globalCss = readFileSync(join(appRoot, "app", "globals.css"), "utf8");

    expect(globalCss).toContain("@media (prefers-color-scheme: dark)");
    expect(globalCss).toContain("--surface-elevated");
    expect(globalCss).toContain("--accent-contrast");
  });
});
