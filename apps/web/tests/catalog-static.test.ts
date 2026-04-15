import { describe, expect, it } from "vitest";

import { readPlannerHomeBootstrap } from "@/lib/catalog-static";

describe("readPlannerHomeBootstrap", () => {
  it("loads the published planner catalog from the local artifact", async () => {
    const bootstrap = await readPlannerHomeBootstrap();

    expect(bootstrap.plans.length).toBeGreaterThan(0);
    expect(bootstrap.periods.length).toBeGreaterThan(0);
    expect(bootstrap.sourcesMetadata).not.toBeNull();

    const firstPeriodId = bootstrap.periods[0]?.period_id;
    expect(firstPeriodId).toBeTruthy();
    expect(bootstrap.periodDetailsById[firstPeriodId!]?.period_id).toBe(firstPeriodId);
  });
});
