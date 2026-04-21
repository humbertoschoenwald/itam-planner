import { describe, expect, it } from "vitest";

import {
  ACADEMIC_CAREER_DEFINITIONS,
  getAcademicCareerMatchAliases,
  getAcademicCareerStudyPlanFallback,
} from "@/lib/academic-catalog";
import { OFFICIAL_CAREERS } from "@/lib/official-academics";

describe("academic catalog", () => {
  it("keeps one canonical definition per career", () => {
    const careerIds = ACADEMIC_CAREER_DEFINITIONS.map((definition) => definition.careerId);
    const displayNames = ACADEMIC_CAREER_DEFINITIONS.map((definition) => definition.displayName);

    expect(new Set(careerIds).size).toBe(careerIds.length);
    expect(new Set(displayNames).size).toBe(displayNames.length);
  });

  it("derives the official careers list from the canonical catalog", () => {
    expect(OFFICIAL_CAREERS.map((career) => career.career_id)).toEqual(
      ACADEMIC_CAREER_DEFINITIONS.map((definition) => definition.careerId),
    );
  });

  it("keeps aliases and study-plan fallbacks on the same canonical record", () => {
    expect(getAcademicCareerMatchAliases("computacion")).toContain(
      "ingenieria y ciencias de la computacion",
    );
    expect(
      getAcademicCareerStudyPlanFallback("inteligencia-artificial")?.semesters[1],
    ).toContain("Razonamiento Algorítmico");
  });
});
