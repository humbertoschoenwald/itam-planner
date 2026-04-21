// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  extractOfficialDoubleDegreesFromHtml,
  extractOfficialGraduateProgramsFromHtml,
  extractOfficialJointProgramRowsFromHtml,
  extractOfficialJointProgramsFromHtml,
  findApplicableJointPlansForEntryTerm,
  isIndividualCareerProgram,
  normalizeAcademicTitle,
  OFFICIAL_CAREERS,
  OFFICIAL_DOUBLE_DEGREES,
  OFFICIAL_GRADUATE_PROGRAMS,
  OFFICIAL_JOINT_PROGRAMS,
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
  const officialJointProgramsFixture = fs.readFileSync(
    path.resolve(process.cwd(), "tests/fixtures/itam-programas-conjuntos.html"),
    "utf8",
  );
  const officialGraduateProgramsFixture = fs.readFileSync(
    path.resolve(process.cwd(), "tests/fixtures/itam-posgrados.html"),
    "utf8",
  );
  const officialDoubleDegreesFixture = fs.readFileSync(
    path.resolve(process.cwd(), "tests/fixtures/itam-dobles-grados.html"),
    "utf8",
  );

  it("normalizes official and catalog title variants consistently", () => {
    expect(normalizeAcademicTitle("LICENCIATURA EN ACTUARÍA")).toBe("actuaria");
    expect(
      normalizeAcademicTitle("Ingeniería Industrial y Sistemas Inteligentes"),
    ).toBe("ingenieria industrial y en sistemas inteligentes");
  });

  it("keeps the official career vocabulary aligned with ITAM-owned sources", () => {
    expect(OFFICIAL_CAREERS.map((career) => career.career_id)).toEqual(
      expect.arrayContaining([
        "contaduria-analitica-finanzas-corporativas",
        "direccion-mercadotecnia",
        "inteligencia-artificial",
      ]),
    );
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

  it("extracts every official joint-program row from the official ITAM fixture", () => {
    const extractedRows = extractOfficialJointProgramRowsFromHtml(officialJointProgramsFixture);

    expect(extractedRows).toHaveLength(39);
    expect(extractedRows[0]).toMatchObject({
      component_titles: ["Licenciatura en Actuaría", "Licenciatura en Matemáticas Aplicadas"],
      contact_emails: ["mercedes@itam.mx", "ezequiel.soto@itam.mx"],
      phone_extensions: ["3839", "3812"],
    });
  });

  it("matches the committed joint-program reference against the official ITAM fixture", () => {
    const extractedPrograms = extractOfficialJointProgramsFromHtml(officialJointProgramsFixture);

    expect(extractedPrograms).toHaveLength(39);
    expect(extractedPrograms).toEqual(OFFICIAL_JOINT_PROGRAMS);
  });

  it("matches the committed graduate-program reference against the official ITAM fixture", () => {
    const extractedPrograms = extractOfficialGraduateProgramsFromHtml(
      officialGraduateProgramsFixture,
    );

    expect(extractedPrograms).toHaveLength(12);
    expect(extractedPrograms).toEqual(OFFICIAL_GRADUATE_PROGRAMS);
  });

  it("matches the committed double-degree reference against the official ITAM fixture", () => {
    const extractedPrograms = extractOfficialDoubleDegreesFromHtml(
      officialDoubleDegreesFixture,
    );

    expect(extractedPrograms).toHaveLength(10);
    expect(extractedPrograms).toEqual(OFFICIAL_DOUBLE_DEGREES);
  });
});
