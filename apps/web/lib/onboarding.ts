import type { BulletinSummary, StudentProfile } from "@/lib/types";

export const ENTRY_TERM_SEASONS = ["PRIMAVERA", "OTOÑO"] as const;

const ENTRY_TERM_PATTERN = /^(PRIMAVERA|OTOÑO) (\d{4})$/u;
const ACADEMIC_TERM_PATTERN = /^(PRIMAVERA|VERANO|OTOÑO) (\d{4})$/u;
const ENTRY_TERM_MIN_YEAR = 2000;
const TERM_SEASON_ORDER = {
  PRIMAVERA: 1,
  VERANO: 2,
  OTOÑO: 3,
} as const;

export function buildEntryTerm(season: string, year: string) {
  return ENTRY_TERM_SEASONS.includes(season as (typeof ENTRY_TERM_SEASONS)[number]) &&
    /^\d{4}$/u.test(year)
    ? `${season} ${year}`
    : "";
}

export function parseEntryTerm(entryTerm: string) {
  const match = ENTRY_TERM_PATTERN.exec(entryTerm.trim());

  return {
    season: match?.[1] ?? "",
    year: match?.[2] ?? "",
  };
}

export function isValidEntryTerm(entryTerm: string) {
  const match = ENTRY_TERM_PATTERN.exec(entryTerm.trim());

  if (!match) {
    return false;
  }

  const year = Number.parseInt(match[2] ?? "", 10);

  return Number.isInteger(year) && year >= ENTRY_TERM_MIN_YEAR && year <= getMaximumEntryTermYear();
}

export function getEntryTermYearOptions() {
  const years: string[] = [];

  for (let year = getMaximumEntryTermYear(); year >= ENTRY_TERM_MIN_YEAR; year -= 1) {
    years.push(String(year));
  }

  return years;
}

export function hasCompletedOnboarding(profile: StudentProfile) {
  return isValidEntryTerm(profile.entryTerm) && profile.activePlanIds.length > 0;
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
