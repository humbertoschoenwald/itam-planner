import { describe, expect, it } from "vitest";

import { buildLocalSearchIndex, searchLocalIndex } from "@/lib/search-index";
import type { SearchIndexBootstrap } from "@/lib/search-index";

const bootstrap: SearchIndexBootstrap = {
  careers: [
    {
      career_id: "actuaria",
      category: "licenciatura",
      display_name: "Actuaría",
      source_url: "https://carreras.itam.mx/carreras/",
      study_plan_url: "https://carreras.itam.mx/plan-actuaria.pdf",
    },
  ],
  jointPrograms: [
    {
      contact_emails: ["mercedes@itam.mx", "ezequiel.soto@itam.mx"],
      component_career_ids: ["actuaria", "matematicas-aplicadas"],
      coordinators: ["Dra. María Mercedes Gregorio Domínguez", "Dr. José Ezequiel Soto Sánchez"],
      display_name: "Actuaría + Matemáticas Aplicadas",
      joint_program_id: "actuaria-matematicas-aplicadas",
      phone_extensions: ["3839", "3812"],
      source_url: "https://www.itam.mx/es/programas-conjuntos",
    },
  ],
  newsItems: [
    {
      category: "Official update",
      href: "https://news.itam.mx/",
      published_at: null,
      source_label: "ITAM News",
      source_url: "https://news.itam.mx/",
      summary: "Noticias institucionales oficiales.",
      title: "ITAM News",
    },
  ],
  paymentCalendar: {
    active_from: "2026-01-01",
    active_to: "2026-12-31",
    calendar_id: "payment:2026",
    calendar_kind: "payment",
    events: [],
    legend: [],
    payment_events: [
      {
        academic_period: "PRIMAVERA 2026",
        active_from: "2026-01-01",
        active_to: "2026-01-31",
        code: "P1",
        date_range_end: null,
        date_range_start: null,
        event_date: "2026-01-10",
        label: "Primer pago",
        notes: null,
      },
    ],
    period_label: "2026",
    source_snapshot_id: "snapshot:payment",
    title: "Pagos 2026",
  },
  plans: [
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
  ],
  periods: [
    {
      active_from: "2026-01-01",
      active_to: "2026-05-31",
      label: "PRIMAVERA 2026 LICENCIATURA",
      level: "LICENCIATURA",
      period_id: "2938",
      term: "PRIMAVERA",
      year: 2026,
    },
  ],
  schoolCalendar: {
    active_from: "2026-01-01",
    active_to: "2026-12-31",
    calendar_id: "school:2026",
    calendar_kind: "school",
    events: [
      {
        active_from: "2026-01-01",
        active_to: "2026-12-31",
        event_date: "2026-01-05",
        label: "Inicio de clases",
        notes: null,
        symbol: "IC",
      },
    ],
    legend: [],
    period_label: "2026",
    source_snapshot_id: "snapshot:school",
    title: "Calendario escolar 2026",
  },
};

describe("local search index", () => {
  it("indexes static routes, official references, and published catalog data", () => {
    const index = buildLocalSearchIndex(bootstrap);

    expect(index.some((item) => item.href === "/search")).toBe(true);
    expect(index.some((item) => item.title === "Actuaría")).toBe(true);
    expect(index.some((item) => item.title === "PRIMAVERA 2026 LICENCIATURA")).toBe(true);
  });

  it("searches accent-insensitively across titles, bodies, and keywords", () => {
    const index = buildLocalSearchIndex(bootstrap);

    expect(searchLocalIndex(index, "actuaria").map((item) => item.title)).toContain(
      "Actuaría",
    );
    expect(searchLocalIndex(index, "primer pago").map((item) => item.title)).toContain(
      "Primer pago",
    );
    expect(
      searchLocalIndex(index, "ezequiel.soto@itam.mx").map((item) => item.title),
    ).toContain("Actuaría + Matemáticas Aplicadas");
  });
});
