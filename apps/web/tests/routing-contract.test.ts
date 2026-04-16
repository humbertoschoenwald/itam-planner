import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = join(import.meta.dirname, "..", "app");

describe("routing contract", () => {
  it("keeps the legacy onboarding route as a compatibility redirect to planner onboarding", () => {
    const source = readFileSync(join(appRoot, "onboarding", "page.tsx"), "utf8");

    expect(source).toContain('redirect("/planner/onboarding")');
  });
});
