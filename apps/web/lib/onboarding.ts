import {
  findApplicableJointPlansForEntryTerm,
  isIndividualCareerProgram,
  matchesOfficialCareerProgramTitle,
  normalizeAcademicTitle,
  OFFICIAL_CAREERS,
  OFFICIAL_JOINT_PROGRAMS,
} from "@/lib/official-academics";
import type { AcademicLevel, BulletinSummary, SchedulePeriodSummary, StudentProfile } from "@/lib/types";

export const ENTRY_TERM_SEASON_KEYS = ["spring", "fall"] as const;
export type EntryTermSeasonKey = (typeof ENTRY_TERM_SEASON_KEYS)[number];
export type ProgramChoiceKind = "degree" | "engineering" | "mixed" | "career";
export const ACADEMIC_LEVELS = [
  "undergraduate",
  "jointPrograms",
  "graduate",
] as const satisfies readonly AcademicLevel[];

export interface ProgramChoiceOption {
  displayLabel: string;
  kind: Exclude<ProgramChoiceKind, "mixed" | "career"> | "career";
  planIds: string[];
  programKey: string;
  programTitle: string;
  sourceCodes: string[];
}

export interface CareerChoiceOption {
  category: "engineering" | "degree";
  careerId: string;
  displayLabel: string;
  planIds: string[];
}

export interface JointProgramChoiceOption {
  componentCareerIds: string[];
  displayLabel: string;
  jointProgramId: string;
  planIds: string[];
}

const ENTRY_TERM_SEASON_TO_ACADEMIC_SEASON: Record<EntryTermSeasonKey, "PRIMAVERA" | "OTOÑO"> =
  {
    spring: "PRIMAVERA",
    fall: "OTOÑO",
  };
const ACADEMIC_SEASON_TO_ENTRY_TERM_SEASON = {
  OTOÑO: "fall",
  PRIMAVERA: "spring",
} as const;

const ENTRY_TERM_PATTERN = /^(PRIMAVERA|OTOÑO) (\d{4})$/u;
const ACADEMIC_TERM_PATTERN = /^(PRIMAVERA|VERANO|OTOÑO) (\d{4})$/u;
const ENTRY_TERM_MIN_YEAR = 2000;
const ACADEMIC_LEVEL_PERIOD_MATCHERS = {
  graduate: ["HIBRIDO", "MAESTRIA"],
  jointPrograms: ["LICENCIATURA"],
  undergraduate: ["LICENCIATURA"],
} as const;
const TERM_SEASON_ORDER = {
  PRIMAVERA: 1,
  VERANO: 2,
  OTOÑO: 3,
} as const;

export function buildEntryTerm(seasonKey: string, year: string) {
  return isEntryTermSeasonKey(seasonKey) && /^\d{4}$/u.test(year)
    ? `${ENTRY_TERM_SEASON_TO_ACADEMIC_SEASON[seasonKey]} ${year}`
    : "";
}

export function parseEntryTerm(entryTerm: string) {
  const match = ENTRY_TERM_PATTERN.exec(entryTerm.trim());

  return {
    seasonKey: getEntryTermSeasonKey(match?.[1] ?? ""),
    year: match?.[2] ?? "",
  };
}

export function formatEntryTermLabel(
  entryTerm: string,
  seasonLabels: Record<EntryTermSeasonKey, string>,
) {
  const parsedEntryTerm = parseEntryTerm(entryTerm);

  return parsedEntryTerm.seasonKey && parsedEntryTerm.year
    ? `${seasonLabels[parsedEntryTerm.seasonKey]} ${parsedEntryTerm.year}`
    : entryTerm.trim();
}

export function isValidEntryTerm(entryTerm: string) {
  const match = ENTRY_TERM_PATTERN.exec(entryTerm.trim());

  if (!match) {
    return false;
  }

  const year = Number.parseInt(match[2] ?? "", 10);

  return Number.isInteger(year) && year >= ENTRY_TERM_MIN_YEAR && year <= getMaximumEntryTermYear();
}

export function getEntryTermYearOptions(
  plans: BulletinSummary[],
  academicLevel: AcademicLevel | null,
  periods: SchedulePeriodSummary[] = [],
) {
  const years = new Set<number>();
  const relevantPlans = academicLevel === "graduate" ? [] : plans;

  for (const plan of relevantPlans) {
    const start = parseComparableAcademicTerm(plan.entry_from_term);
    const end = parseComparableAcademicTerm(plan.entry_to_term);

    if (start !== null && end !== null) {
      for (let year = Math.min(start.year, end.year); year <= Math.max(start.year, end.year); year += 1) {
        years.add(year);
      }
    } else if (start !== null && end === null) {
      for (let year = start.year; year <= getMaximumEntryTermYear(); year += 1) {
        years.add(year);
      }
    } else if (end !== null) {
      years.add(end.year);
    } else if (typeof plan.application_year === "number") {
      years.add(plan.application_year);
    } else if (typeof plan.active_from === "string") {
      const year = Number.parseInt(plan.active_from.slice(0, 4), 10);
      if (Number.isInteger(year)) {
        years.add(year);
      }
    }

    if (start !== null) {
      years.add(start.year);
    }
  }

  for (const period of filterPeriodsForAcademicLevel(periods, academicLevel)) {
    if (typeof period.year === "number") {
      years.add(period.year);
    }
  }

  return [...years]
    .filter((year) => year >= ENTRY_TERM_MIN_YEAR && year <= getMaximumEntryTermYear())
    .sort((left, right) => right - left)
    .map(String);
}

export function hasCompletedOnboarding(profile: StudentProfile, plans?: BulletinSummary[]) {
  if (
    profile.academicLevel === null ||
    !profile.hasExplicitLocalePreference ||
    !isValidEntryTerm(profile.entryTerm)
  ) {
    return false;
  }

  if (!plans) {
    return profile.academicLevel === "graduate"
      ? true
      : profile.academicLevel === "jointPrograms"
        ? profile.selectedJointProgramIds.length > 0
        : profile.selectedCareerIds.length > 0;
  }

  if (profile.academicLevel === "graduate") {
    return true;
  }

  if (profile.academicLevel === "jointPrograms") {
    return profile.selectedJointProgramIds.length > 0 && hasApplicableActivePlans(profile, plans);
  }

  if (profile.selectedCareerIds.length === 0) {
    return false;
  }

  return profile.activePlanIds.length === 0 || hasApplicableActivePlans(profile, plans);
}

export function hasApplicableActivePlans(profile: StudentProfile, plans: BulletinSummary[]) {
  if (profile.academicLevel === "graduate" || !isValidEntryTerm(profile.entryTerm)) {
    return false;
  }

  const visiblePlanIds = new Set(
    filterPlansForEntryTerm(plans, profile.entryTerm).map((plan) => plan.plan_id),
  );

  return profile.activePlanIds.some((planId) => visiblePlanIds.has(planId));
}

export function filterPlansForEntryTerm(plans: BulletinSummary[], entryTerm: string) {
  if (!isValidEntryTerm(entryTerm)) {
    return [];
  }

  return plans
    .filter((plan) => matchesEntryTerm(plan, entryTerm))
    .sort((left, right) => {
      const programComparison = left.program_title.localeCompare(right.program_title, "es-MX");
      if (programComparison !== 0) {
        return programComparison;
      }

      return left.plan_code.localeCompare(right.plan_code, "es-MX");
    });
}

export function buildProgramChoiceOptions(plans: BulletinSummary[], entryTerm: string) {
  const groupedPrograms = new Map<string, ProgramChoiceOption>();

  for (const plan of filterPlansForEntryTerm(plans, entryTerm)) {
    const programKey = normalizeProgramTitle(plan.program_title);
    const existing = groupedPrograms.get(programKey);

    if (existing) {
      existing.planIds = [...new Set([...existing.planIds, plan.plan_id])];
      existing.sourceCodes = [...new Set([...existing.sourceCodes, plan.source_code])];
      continue;
    }

    groupedPrograms.set(programKey, {
      displayLabel: formatProgramChoiceLabel(plan.program_title),
      kind: getProgramChoiceKind(plan.program_title),
      planIds: [plan.plan_id],
      programKey,
      programTitle: plan.program_title,
      sourceCodes: [plan.source_code],
    });
  }

  return [...groupedPrograms.values()].sort((left, right) =>
    left.displayLabel.localeCompare(right.displayLabel, "es-MX", { sensitivity: "base" }),
  );
}

export function buildCareerChoiceOptions(plans: BulletinSummary[], entryTerm: string) {
  const applicablePlans = filterPlansForEntryTerm(plans, entryTerm).filter((plan) =>
    isIndividualCareerProgram(plan.program_title),
  );
  const options = OFFICIAL_CAREERS.map((career) => ({
    category: career.category,
    careerId: career.career_id,
    displayLabel: career.display_name,
    planIds: applicablePlans
      .filter((plan) => matchesOfficialCareerProgramTitle(plan.program_title, career.career_id))
      .map((plan) => plan.plan_id),
  }));

  return options.sort((left, right) =>
    left.displayLabel.localeCompare(right.displayLabel, "es-MX", { sensitivity: "base" }),
  );
}

export function buildCareerChoiceOptionsForLevel(
  plans: BulletinSummary[],
  entryTerm: string,
  academicLevel: AcademicLevel | null,
) {
  if (academicLevel !== "undergraduate") {
    return [];
  }

  return buildCareerChoiceOptions(plans, entryTerm);
}

export function filterCareerChoiceOptions(options: CareerChoiceOption[], query: string) {
  const normalizedQuery = normalizeAcademicTitle(query);

  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) =>
    normalizeAcademicTitle(
      `${option.displayLabel} ${option.careerId} ${
        option.category === "engineering"
          ? "ingenieria engineering"
          : "licenciatura degree carrera"
      }`,
    ).includes(normalizedQuery),
  );
}

export function buildJointProgramChoiceOptions(
  plans: BulletinSummary[],
  entryTerm: string,
  selectedCareerIds: string[],
) {
  if (selectedCareerIds.length === 0) {
    return [];
  }

  const applicablePlans = filterPlansForEntryTerm(plans, entryTerm);
  const selectedCareerSet = new Set(selectedCareerIds);

  return OFFICIAL_JOINT_PROGRAMS.filter((program) =>
    program.component_career_ids.every((careerId) => selectedCareerSet.has(careerId)),
  )
    .map((program) => ({
      componentCareerIds: [...program.component_career_ids],
      displayLabel: program.display_name,
      jointProgramId: program.joint_program_id,
      planIds: findApplicableJointPlansForEntryTerm(applicablePlans, program.joint_program_id).map(
        (plan) => plan.plan_id,
      ),
    }))
    .filter((program) => program.planIds.length > 0)
    .sort((left, right) =>
      left.displayLabel.localeCompare(right.displayLabel, "es-MX", { sensitivity: "base" }),
    );
}

export function buildJointProgramChoiceOptionsForLevel(
  plans: BulletinSummary[],
  entryTerm: string,
  academicLevel: AcademicLevel | null,
  selectedCareerIds: string[],
) {
  if (academicLevel === "jointPrograms") {
    const applicablePlans = filterPlansForEntryTerm(plans, entryTerm);

    return OFFICIAL_JOINT_PROGRAMS.map((program) => ({
      componentCareerIds: [...program.component_career_ids],
      displayLabel: program.display_name,
      jointProgramId: program.joint_program_id,
      planIds: findApplicableJointPlansForEntryTerm(applicablePlans, program.joint_program_id).map(
        (plan) => plan.plan_id,
      ),
    }))
      .filter((program) => program.planIds.length > 0)
      .sort((left, right) =>
        left.displayLabel.localeCompare(right.displayLabel, "es-MX", {
          sensitivity: "base",
        }),
      );
  }

  if (academicLevel !== "undergraduate") {
    return [];
  }

  return buildJointProgramChoiceOptions(plans, entryTerm, selectedCareerIds);
}

export function resolveCareerSelectionPlanIds(
  plans: BulletinSummary[],
  entryTerm: string,
  selectedCareerIds: string[],
) {
  const visibleCareerIds = new Set(selectedCareerIds);

  return buildCareerChoiceOptions(plans, entryTerm)
    .filter((option) => visibleCareerIds.has(option.careerId))
    .flatMap((option) => option.planIds);
}

export function resolveJointProgramSelectionPlanIds(
  plans: BulletinSummary[],
  entryTerm: string,
  selectedJointProgramIds: string[],
) {
  const applicablePlans = filterPlansForEntryTerm(plans, entryTerm);

  return selectedJointProgramIds.flatMap((jointProgramId) =>
    findApplicableJointPlansForEntryTerm(applicablePlans, jointProgramId).map((plan) => plan.plan_id),
  );
}

export function resolveActivePlanIdsFromSelections(
  plans: BulletinSummary[],
  entryTerm: string,
  selectedCareerIds: string[],
  selectedJointProgramIds: string[],
) {
  return [
    ...new Set([
      ...resolveCareerSelectionPlanIds(plans, entryTerm, selectedCareerIds),
      ...resolveJointProgramSelectionPlanIds(plans, entryTerm, selectedJointProgramIds),
    ]),
  ];
}

export function getCareerChoiceMode(options: CareerChoiceOption[]): ProgramChoiceKind {
  const hasDegree = options.some((option) => option.category === "degree");
  const hasEngineering = options.some((option) => option.category === "engineering");

  if (hasDegree && hasEngineering) {
    return "mixed";
  }

  if (hasDegree) {
    return "degree";
  }

  if (hasEngineering) {
    return "engineering";
  }

  return "career";
}

export function filterPeriodsForAcademicLevel(
  periods: SchedulePeriodSummary[],
  academicLevel: AcademicLevel | null,
) {
  if (academicLevel === null) {
    return periods;
  }

  const allowedLevels = ACADEMIC_LEVEL_PERIOD_MATCHERS[academicLevel];

  return periods.filter((period) =>
    allowedLevels.some((allowedLevel) =>
      normalizeAcademicTitle(period.level).includes(normalizeAcademicTitle(allowedLevel)),
    ),
  );
}

export function getDefaultPeriodForAcademicLevel(
  periods: SchedulePeriodSummary[],
  academicLevel: AcademicLevel | null,
) {
  return filterPeriodsForAcademicLevel(periods, academicLevel)[0] ?? null;
}

export function formatSchedulePeriodLabel(label: string) {
  return label.replace(/^\((.*)\)$/u, "$1").trim();
}

export function filterProgramChoiceOptions(
  options: ProgramChoiceOption[],
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");

  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) =>
    `${option.displayLabel} ${option.programTitle} ${option.sourceCodes.join(" ")}`
      .toLocaleLowerCase("es-MX")
      .includes(normalizedQuery),
  );
}

export function getProgramChoiceMode(options: ProgramChoiceOption[]): ProgramChoiceKind {
  const hasDegree = options.some((option) => option.kind === "degree");
  const hasEngineering = options.some((option) => option.kind === "engineering");
  const hasCareer = options.some((option) => option.kind === "career");

  if (hasCareer || (hasDegree && hasEngineering)) {
    return hasDegree && hasEngineering ? "mixed" : "career";
  }

  if (hasDegree) {
    return "degree";
  }

  if (hasEngineering) {
    return "engineering";
  }

  return "career";
}

export function findSelectedProgramChoice(
  options: ProgramChoiceOption[],
  activePlanIds: string[],
) {
  return (
    options.find((option) => option.planIds.some((planId) => activePlanIds.includes(planId))) ?? null
  );
}

function getMaximumEntryTermYear() {
  return new Date().getFullYear() + 1;
}

function matchesEntryTerm(plan: BulletinSummary, entryTerm: string) {
  if (plan.entry_from_term === null && plan.entry_to_term === null) {
    const target = parseComparableAcademicTerm(entryTerm);
    const fallbackStartYear = getPlanFallbackEntryYear(plan);

    return target !== null && fallbackStartYear !== null
      ? target.year >= fallbackStartYear && target.year <= getMaximumEntryTermYear()
      : false;
  }

  return isTermWithinRange(entryTerm, plan.entry_from_term, plan.entry_to_term);
}

function isTermWithinRange(entryTerm: string, rangeStart: string | null, rangeEnd: string | null) {
  const target = parseComparableAcademicTerm(entryTerm);

  if (target === null) {
    return false;
  }

  const parsedStart = parseComparableAcademicTerm(rangeStart);
  const parsedEnd = parseComparableAcademicTerm(rangeEnd);

  if (parsedStart !== null && compareAcademicTerms(target, parsedStart) < 0) {
    return false;
  }

  if (parsedEnd !== null && compareAcademicTerms(target, parsedEnd) > 0) {
    return false;
  }

  return true;
}

function parseComparableAcademicTerm(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  const match = ACADEMIC_TERM_PATTERN.exec(normalized);

  if (!match) {
    return null;
  }

  const season = match[1] as keyof typeof TERM_SEASON_ORDER;
  const year = Number.parseInt(match[2] ?? "", 10);

  if (!Number.isInteger(year)) {
    return null;
  }

  return {
    season,
    seasonOrder: TERM_SEASON_ORDER[season],
    year,
  };
}

function getPlanFallbackEntryYear(plan: BulletinSummary) {
  if (typeof plan.application_year === "number" && Number.isInteger(plan.application_year)) {
    return plan.application_year;
  }

  if (typeof plan.active_from === "string") {
    const year = Number.parseInt(plan.active_from.slice(0, 4), 10);
    if (Number.isInteger(year)) {
      return year;
    }
  }

  return null;
}

function compareAcademicTerms(
  left: { seasonOrder: number; year: number },
  right: { seasonOrder: number; year: number },
) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }

  return left.seasonOrder - right.seasonOrder;
}

function getEntryTermSeasonKey(value: string): EntryTermSeasonKey | "" {
  const normalized = value.trim().toUpperCase();

  return ACADEMIC_SEASON_TO_ENTRY_TERM_SEASON[
    normalized as keyof typeof ACADEMIC_SEASON_TO_ENTRY_TERM_SEASON
  ] ?? "";
}

function isEntryTermSeasonKey(value: string): value is EntryTermSeasonKey {
  return ENTRY_TERM_SEASON_KEYS.includes(value as EntryTermSeasonKey);
}

function normalizeProgramTitle(programTitle: string) {
  return programTitle.trim().replace(/\s+/gu, " ").toUpperCase();
}

function getProgramChoiceKind(programTitle: string): ProgramChoiceOption["kind"] {
  const normalizedTitle = normalizeProgramTitle(programTitle);

  if (normalizedTitle.startsWith("LICENCIATURA EN ")) {
    return "degree";
  }

  if (
    normalizedTitle.startsWith("INGENIERIA EN ") ||
    normalizedTitle.startsWith("INGENIERÍA EN ")
  ) {
    return "engineering";
  }

  return "career";
}

function formatProgramChoiceLabel(programTitle: string) {
  const normalizedTitle = programTitle
    .trim()
    .replace(/^LICENCIATURA EN /iu, "")
    .replace(/^INGENIER[IÍ]A EN /iu, "")
    .toLocaleLowerCase("es-MX");

  return normalizedTitle
    .split(/\s+/u)
    .filter(Boolean)
    .map((word) => {
      const [firstLetter = "", ...rest] = [...word];
      return `${firstLetter.toLocaleUpperCase("es-MX")}${rest.join("")}`;
    })
    .join(" ");
}
