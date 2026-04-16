import { describe, expect, it } from "vitest";

import { filterPlansForEntryTerm } from "@/lib/onboarding";
import type { BulletinSummary } from "@/lib/types";

const samplePlans: BulletinSummary[] = [
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:ma-e",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "E",
    plan_id: "licenciatura-en-matematicas-aplicadas:e",
    program_title: "LICENCIATURA EN MATEMATICAS APLICADAS",
    source_code: "MA-E",
    title: "LICENCIATURA EN MATEMATICAS APLICADAS Plan E",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:dac-b",
    entry_from_term: "PRIMAVERA 2015",
    entry_to_term: "PRIMAVERA 2019",
    plan_code: "B",
    plan_id: "licenciatura-en-derecho:b",
    program_title: "LICENCIATURA EN DERECHO",
    source_code: "DAC-B",
    title: "LICENCIATURA EN DERECHO Plan B",
  },
];

describe("filterPlansForEntryTerm", () => {
  it("returns no plans until the entry term is valid", () => {
    expect(filterPlansForEntryTerm(samplePlans, "")).toEqual([]);
    expect(filterPlansForEntryTerm(samplePlans, "2025")).toEqual([]);
  });

  it("keeps only the plans that apply to the selected entry term", () => {
    expect(
      filterPlansForEntryTerm(samplePlans, "OTOÑO 2025").map((plan) => plan.source_code),
    ).toEqual(["MA-E"]);
  });
});
