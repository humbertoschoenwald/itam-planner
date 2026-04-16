import type { BulletinSummary, StudentProfile } from "@/lib/types";

export const ENTRY_TERM_SEASON_KEYS = ["spring", "fall"] as const;
export type EntryTermSeasonKey = (typeof ENTRY_TERM_SEASON_KEYS)[number];

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

export function getEntryTermYearOptions(plans: BulletinSummary[]) {
  const years = new Set<number>();

  for (const plan of plans) {
    const start = parseComparableAcademicTerm(plan.entry_from_term);
    const end = parseComparableAcademicTerm(plan.entry_to_term);

    if (start !== null && end !== null) {
      for (let year = Math.min(start.year, end.year); year <= Math.max(start.year, end.year); year += 1) {
        years.add(year);
      }
      continue;
    }

    if (start !== null) {
      years.add(start.year);
    }

    if (end !== null) {
      years.add(end.year);
    }
  }

  return [...years]
    .filter((year) => year >= ENTRY_TERM_MIN_YEAR && year <= getMaximumEntryTermYear())
    .sort((left, right) => right - left)
    .map(String);
}

export function hasCompletedOnboarding(profile: StudentProfile, plans?: BulletinSummary[]) {
  if (!isValidEntryTerm(profile.entryTerm)) {
    return false;
  }

  if (!plans) {
    return profile.activePlanIds.length > 0;
  }

  return hasApplicableActivePlans(profile, plans);
}

export function hasApplicableActivePlans(profile: StudentProfile, plans: BulletinSummary[]) {
  if (!isValidEntryTerm(profile.entryTerm)) {
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

function getMaximumEntryTermYear() {
  return new Date().getFullYear() + 1;
}

function matchesEntryTerm(plan: BulletinSummary, entryTerm: string) {
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
