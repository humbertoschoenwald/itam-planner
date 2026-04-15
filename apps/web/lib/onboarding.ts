import type { StudentProfile } from "@/lib/types";

export const ENTRY_TERM_SEASONS = ["PRIMAVERA", "OTOÑO"] as const;

const ENTRY_TERM_PATTERN = /^(PRIMAVERA|OTOÑO) (\d{4})$/u;
const ENTRY_TERM_MIN_YEAR = 2000;

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

function getMaximumEntryTermYear() {
  return new Date().getFullYear() + 1;
}
