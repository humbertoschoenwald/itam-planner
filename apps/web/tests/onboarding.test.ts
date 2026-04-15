import { describe, expect, it } from "vitest";

import {
  buildEntryTerm,
  getEntryTermYearOptions,
  hasCompletedOnboarding,
  isValidEntryTerm,
  parseEntryTerm,
} from "@/lib/onboarding";

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

  it("only accepts canonical entry terms", () => {
    expect(isValidEntryTerm("OTOÑO 2025")).toBe(true);
    expect(isValidEntryTerm("PRIMAVERA 2026")).toBe(true);
    expect(isValidEntryTerm("hola")).toBe(false);
    expect(isValidEntryTerm("2025 OTOÑO")).toBe(false);
  });

  it("builds and parses entry terms from structured selectors", () => {
    expect(buildEntryTerm("OTOÑO", "2025")).toBe("OTOÑO 2025");
    expect(buildEntryTerm("OTOÑO", "")).toBe("");
    expect(parseEntryTerm("PRIMAVERA 2026")).toEqual({
      season: "PRIMAVERA",
      year: "2026",
    });
    expect(parseEntryTerm("broken")).toEqual({
      season: "",
      year: "",
    });
  });

  it("exposes descending year options for the selectors", () => {
    const years = getEntryTermYearOptions();

    expect(years[0]).toMatch(/^\d{4}$/u);
    expect(Number(years[0])).toBeGreaterThan(Number(years[years.length - 1]));
  });
});
