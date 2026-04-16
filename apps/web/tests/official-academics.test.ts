import { describe, expect, it } from "vitest";

import {
  findApplicableJointPlansForEntryTerm,
  isIndividualCareerProgram,
  normalizeAcademicTitle,
} from "@/lib/official-academics";
import type { BulletinSummary } from "@/lib/types";

const samplePlans: BulletinSummary[] = [
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:act-ma",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "A",
    plan_id: "plan:act-ma-a",
    program_title: "LICENCIATURA EN ACTUARÍA Y MATEMÁTICAS APLICADAS",
    source_code: "ACTMA-A",
    title: "LICENCIATURA EN ACTUARÍA Y MATEMÁTICAS APLICADAS Plan A",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:act-g",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "G",
    plan_id: "plan:act-g",
    program_title: "LICENCIATURA EN ACTUARÍA",
    source_code: "ACT-G",
    title: "LICENCIATURA EN ACTUARÍA Plan G",
  },
];

describe("official academics helpers", () => {
  it("normalizes official and catalog title variants consistently", () => {
    expect(normalizeAcademicTitle("LICENCIATURA EN ACTUARÍA")).toBe("actuaria");
    expect(
      normalizeAcademicTitle("Ingeniería Industrial y Sistemas Inteligentes"),
    ).toBe("ingenieria industrial y en sistemas inteligentes");
  });

  it("distinguishes individual careers from joint programs", () => {
    expect(isIndividualCareerProgram("LICENCIATURA EN ACTUARÍA")).toBe(true);
    expect(
      isIndividualCareerProgram("INGENIERÍA INDUSTRIAL Y EN SISTEMAS INTELIGENTES"),
    ).toBe(true);
    expect(
      isIndividualCareerProgram("INGENIERÍA Y CIENCIAS DE LA COMPUTACIÓN"),
    ).toBe(true);
    expect(
      isIndividualCareerProgram("LICENCIATURA EN ACTUARÍA Y MATEMÁTICAS APLICADAS"),
    ).toBe(false);
  });

  it("matches official joint-program references against published plans", () => {
    expect(
      findApplicableJointPlansForEntryTerm(samplePlans, "actuaria-matematicas-aplicadas").map(
        (plan) => plan.plan_id,
      ),
    ).toEqual(["plan:act-ma-a"]);
  });
});
