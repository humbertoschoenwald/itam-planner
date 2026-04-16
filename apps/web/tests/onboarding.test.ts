import { describe, expect, it } from "vitest";

import {
  buildEntryTerm,
  filterPlansForEntryTerm,
  formatEntryTermLabel,
  getEntryTermYearOptions,
  hasApplicableActivePlans,
  parseEntryTerm,
} from "@/lib/onboarding";
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
  it("keeps English-like selector keys separate from localized display labels", () => {
    expect(buildEntryTerm("spring", "2025")).toBe("PRIMAVERA 2025");
    expect(buildEntryTerm("fall", "2025")).toBe("OTOÑO 2025");
    expect(parseEntryTerm("PRIMAVERA 2025")).toEqual({
      seasonKey: "spring",
      year: "2025",
    });
    expect(
      formatEntryTermLabel("PRIMAVERA 2025", {
        fall: "Otoño",
        spring: "Primavera",
      }),
    ).toBe("Primavera 2025");
  });

  it("returns no plans until the entry term is valid", () => {
    expect(filterPlansForEntryTerm(samplePlans, "")).toEqual([]);
    expect(filterPlansForEntryTerm(samplePlans, "2025")).toEqual([]);
  });

  it("derives the year selector from the published plan ranges", () => {
    expect(getEntryTermYearOptions(samplePlans)).toEqual([
      "2026",
      "2025",
      "2024",
      "2023",
      "2022",
      "2021",
      "2019",
      "2018",
      "2017",
      "2016",
      "2015",
    ]);
  });

  it("keeps only the plans that apply to the selected entry term", () => {
    expect(
      filterPlansForEntryTerm(samplePlans, "OTOÑO 2025").map((plan) => plan.source_code),
    ).toEqual(["MA-E"]);
  });

  it("requires at least one active plan that still applies to the selected entry term", () => {
    expect(
      hasApplicableActivePlans(
        {
          activePlanIds: ["licenciatura-en-matematicas-aplicadas:e"],
          entryTerm: "OTOÑO 2025",
          locale: "es-MX",
        },
        samplePlans,
      ),
    ).toBe(true);

    expect(
      hasApplicableActivePlans(
        {
          activePlanIds: ["licenciatura-en-matematicas-aplicadas:e"],
          entryTerm: "OTOÑO 2011",
          locale: "es-MX",
        },
        samplePlans,
      ),
    ).toBe(false);
  });
});
