// @vitest-environment node

import { describe, expect, it } from "vitest";

import { resolveCatalogUrl } from "@/lib/api";

describe("resolveCatalogUrl", () => {
  it("maps public catalog paths to static JSON when no external API base is configured", () => {
    expect(resolveCatalogUrl("/boletines", null)).toBe("/catalog/latest/boletines/index.json");
    expect(resolveCatalogUrl("/boletines/bulletin:ma-e", null)).toBe(
      "/catalog/latest/boletines/documents/bulletin__ma-e.json",
    );
    expect(resolveCatalogUrl("/schedules/periods", null)).toBe(
      "/catalog/latest/schedules/periods.json",
    );
    expect(resolveCatalogUrl("/schedules/periods/2938", null)).toBe(
      "/catalog/latest/schedules/periods/2938.json",
    );
    expect(resolveCatalogUrl("/sources", null)).toBe("/catalog/latest/sources.json");
  });

  it("keeps an external API origin when one is configured", () => {
    expect(resolveCatalogUrl("/boletines", "https://api.example.com")).toBe(
      "https://api.example.com/boletines",
    );
  });
});
