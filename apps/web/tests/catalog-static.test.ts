import { describe, expect, it } from "vitest";

import { readOnboardingBootstrap, readPlannerShellBootstrap } from "@/lib/catalog-static";

describe("catalog static bootstrap readers", () => {
  it("loads the lean planner shell bootstrap from the local artifact", async () => {
    const bootstrap = await readPlannerShellBootstrap();

    expect(bootstrap.plans.length).toBeGreaterThan(0);
    expect(bootstrap.periods.length).toBeGreaterThan(0);
    expect(bootstrap.graduatePrograms.length).toBeGreaterThan(0);
    expect(bootstrap.doubleDegrees.length).toBeGreaterThan(0);
    expect(bootstrap.sourcesMetadata).not.toBeNull();
  });

  it("loads only the public plan list for onboarding", async () => {
    const bootstrap = await readOnboardingBootstrap();

    expect(bootstrap.plans.length).toBeGreaterThan(0);
  });
});
