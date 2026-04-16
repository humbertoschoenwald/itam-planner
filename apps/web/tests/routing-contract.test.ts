import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = join(import.meta.dirname, "..", "app");

describe("routing contract", () => {
  it("keeps the legacy onboarding route as a compatibility redirect to planner onboarding", () => {
    const source = readFileSync(join(appRoot, "onboarding", "page.tsx"), "utf8");

    expect(source).toContain('redirect("/planner/onboarding")');
  });

  it("keeps legacy Spanish utility routes as compatibility redirects to English canonicals", () => {
    const legacyInscriptions = readFileSync(join(appRoot, "inscripciones", "page.tsx"), "utf8");
    const legacyMap = readFileSync(join(appRoot, "mapa", "page.tsx"), "utf8");
    const legacySettings = readFileSync(
      join(appRoot, "planner", "settings", "page.tsx"),
      "utf8",
    );

    expect(legacyInscriptions).toContain('redirect("/registration")');
    expect(legacyMap).toContain('redirect("/map")');
    expect(legacySettings).toContain('redirect("/settings")');
  });
});
