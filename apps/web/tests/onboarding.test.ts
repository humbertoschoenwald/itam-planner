import { describe, expect, it } from "vitest";

import { hasCompletedOnboarding } from "@/lib/onboarding";

describe("hasCompletedOnboarding", () => {
  it("requires a non-empty entry term and at least one active plan", () => {
    expect(
      hasCompletedOnboarding({
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
        locale: "es-MX",
      }),
    ).toBe(true);
    expect(
      hasCompletedOnboarding({
        entryTerm: "",
        activePlanIds: ["plan:ma-e"],
        locale: "es-MX",
      }),
    ).toBe(false);
    expect(
      hasCompletedOnboarding({
        entryTerm: "OTOÑO 2025",
        activePlanIds: [],
        locale: "es-MX",
      }),
    ).toBe(false);
  });
});
