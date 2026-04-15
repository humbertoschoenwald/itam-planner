import { describe, expect, it } from "vitest";

import { clearPlannerBrowserState } from "@/lib/browser-state";
import { STORAGE_KEYS } from "@/lib/storage-keys";

describe("clearPlannerBrowserState", () => {
  it("removes every browser-owned planner key", () => {
    for (const key of Object.values(STORAGE_KEYS)) {
      window.localStorage.setItem(key, "value");
    }

    clearPlannerBrowserState();

    for (const key of Object.values(STORAGE_KEYS)) {
      expect(window.localStorage.getItem(key)).toBeNull();
    }
  });
});
