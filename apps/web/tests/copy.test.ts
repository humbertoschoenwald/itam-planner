import { describe, expect, it } from "vitest";

import { getUiCopy } from "@/lib/copy";

describe("getUiCopy", () => {
  it("returns Spanish-first copy by default locale selection", () => {
    expect(getUiCopy("es-MX").plannerHome.noAccountRequired).toMatch(/No necesitas cuenta/u);
  });

  it("returns English copy when requested", () => {
    expect(getUiCopy("en").common.community).toBe("Community");
  });
});
