// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  buildRecommendedSubjectCodes,
  buildSelectedSubjectSummary,
  buildSubjectDirectory,
  estimateSemesterNumber,
  searchSubjectDirectory,
} from "@/lib/planner-subjects";
import type { BulletinDocument, SchedulePeriodSummary } from "@/lib/types";

const currentPeriod: SchedulePeriodSummary = {
  active_from: "2026-01-01",
  active_to: "2026-05-31",
  label: "PRIMAVERA 2026 LICENCIATURA",
  level: "LICENCIATURA",
  period_id: "2938",
  term: "PRIMAVERA",
  year: 2026,
};

const actuarialBulletinDocument: BulletinDocument = {
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
  requirements: [
    {
      course_code: "ACT-11300",
      credits: 6,
      display_title: "Cálculo Actuarial I",
      prerequisite_references: [],
      raw_prerequisite_text: null,
      requirement_id: "req:1",
      semester_label: "2",
      semester_order: 2,
      sort_order: 1,
    },
    {
      course_code: "MAT-14000",
      credits: 6,
      display_title: "Álgebra Lineal I",
      prerequisite_references: [],
      raw_prerequisite_text: null,
      requirement_id: "req:2",
      semester_label: "3",
      semester_order: 3,
      sort_order: 2,
    },
  ],
  source_code: "ACT-G",
  title: "LICENCIATURA EN ACTUARÍA Plan G",
};

const bulletinDocuments: BulletinDocument[] = [actuarialBulletinDocument];

function cloneBulletinDocument(
  summary: BulletinDocument,
  overrides: Partial<BulletinDocument>,
): BulletinDocument {
  return {
    ...summary,
    ...overrides,
    requirements: overrides.requirements ?? summary.requirements,
  };
}

describe("planner subject helpers", () => {
  it("estimates the current semester from the entry term and active public period", () => {
    expect(estimateSemesterNumber("OTOÑO 2025", currentPeriod)).toBe(2);
    expect(estimateSemesterNumber("PRIMAVERA 2026", currentPeriod)).toBe(1);
  });

  it("builds recommended subject codes from the estimated semester", () => {
    expect(buildRecommendedSubjectCodes(bulletinDocuments, 2)).toEqual(["ACT-11300"]);
  });

  it("falls back to official study-plan subjects when no applicable bulletin plan exists", () => {
    expect(
      buildRecommendedSubjectCodes([], 1, {
        allDocuments: [
          ...bulletinDocuments,
          cloneBulletinDocument(actuarialBulletinDocument, {
            bulletin_id: "bulletin:ai-fallback",
            plan_id: "plan:ai-fallback",
            program_title: "LICENCIATURA EN CIENCIA DE DATOS",
            requirements: [
              {
                course_code: "COM-16306",
                credits: 6,
                display_title: "Razonamiento Algorítmico",
                prerequisite_references: [],
                raw_prerequisite_text: null,
                requirement_id: "req:ai-1",
                semester_label: "1",
                semester_order: 1,
                sort_order: 1,
              },
              {
                course_code: "MAT-14280",
                credits: 6,
                display_title: "Pensamiento Matemático",
                prerequisite_references: [],
                raw_prerequisite_text: null,
                requirement_id: "req:ai-2",
                semester_label: "1",
                semester_order: 1,
                sort_order: 2,
              },
              {
                course_code: "MAT-12200",
                credits: 6,
                display_title: "Cálculo Univariado",
                prerequisite_references: [],
                raw_prerequisite_text: null,
                requirement_id: "req:ai-3",
                semester_label: "1",
                semester_order: 1,
                sort_order: 3,
              },
              {
                course_code: "MAT-14250",
                credits: 6,
                display_title: "Geometría Vectorial",
                prerequisite_references: [],
                raw_prerequisite_text: null,
                requirement_id: "req:ai-4",
                semester_label: "1",
                semester_order: 1,
                sort_order: 4,
              },
              {
                course_code: "EGN-17141",
                credits: 6,
                display_title: "Problemas de la Civilización Contemporánea I",
                prerequisite_references: [],
                raw_prerequisite_text: null,
                requirement_id: "req:ai-5",
                semester_label: "1",
                semester_order: 1,
                sort_order: 5,
              },
              {
                course_code: "LEN-12701",
                credits: 6,
                display_title: "Estrategias de Comunicación Escrita",
                prerequisite_references: [],
                raw_prerequisite_text: null,
                requirement_id: "req:ai-6",
                semester_label: "1",
                semester_order: 1,
                sort_order: 6,
              },
            ],
            source_code: "CDA-C",
            title: "LICENCIATURA EN CIENCIA DE DATOS Plan C",
          }),
        ],
        fallbackCareerIds: ["inteligencia-artificial"],
      }),
    ).toEqual([
      "COM-16306",
      "EGN-17141",
      "LEN-12701",
      "MAT-12200",
      "MAT-14250",
      "MAT-14280",
    ]);
  });

  it("builds and searches the subject directory without accents", () => {
    const directory = buildSubjectDirectory(bulletinDocuments);

    expect(buildSelectedSubjectSummary(["ACT-11300"], directory)).toEqual([
      {
        courseCode: "ACT-11300",
        semesterOrder: 2,
        title: "Cálculo Actuarial I",
      },
    ]);
    expect(searchSubjectDirectory(directory, "calculo actuarial")).toEqual([
      {
        courseCode: "ACT-11300",
        semesterOrder: 2,
        title: "Cálculo Actuarial I",
      },
    ]);
  });
});
