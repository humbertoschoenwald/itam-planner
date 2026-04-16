import { parseEntryTerm } from "@/lib/onboarding";
import type {
  BulletinDocument,
  SchedulePeriodSummary,
} from "@/lib/types";

export interface SubjectDirectoryEntry {
  courseCode: string;
  semesterOrder: number | null;
  title: string;
}

const REGULAR_TERM_ORDER: Record<"fall" | "spring", number> = {
  spring: 1,
  fall: 2,
};

export function estimateSemesterNumber(
  entryTerm: string,
  currentPeriod: SchedulePeriodSummary | null,
) {
  const parsedEntryTerm = parseEntryTerm(entryTerm);
  const resolvedCurrentPeriod = currentPeriod;

  if (
    !parsedEntryTerm.seasonKey ||
    !parsedEntryTerm.year ||
    resolvedCurrentPeriod === null ||
    resolvedCurrentPeriod.year === null
  ) {
    return null;
  }

  const entryYear = Number.parseInt(parsedEntryTerm.year, 10);
  const periodSeason = normalizePeriodSeason(
    resolvedCurrentPeriod.term ?? resolvedCurrentPeriod.label,
  );

  if (!Number.isInteger(entryYear) || periodSeason === null) {
    return null;
  }

  const yearDifference = resolvedCurrentPeriod.year - entryYear;
  const estimated =
    yearDifference * 2 +
    (REGULAR_TERM_ORDER[periodSeason] - REGULAR_TERM_ORDER[parsedEntryTerm.seasonKey]) +
    1;

  return Number.isInteger(estimated) ? Math.max(1, Math.min(8, estimated)) : null;
}

export function buildSubjectDirectory(documents: BulletinDocument[]) {
  const entries = new Map<string, SubjectDirectoryEntry>();

  for (const document of documents) {
    for (const requirement of document.requirements) {
      const courseCode =
        typeof requirement.course_code === "string" ? requirement.course_code.trim() : "";
      const title =
        typeof requirement.display_title === "string"
          ? requirement.display_title.trim()
          : "";

      if (!courseCode || !title) {
        continue;
      }

      const existing = entries.get(courseCode);

      if (existing) {
        continue;
      }

      entries.set(courseCode, {
        courseCode,
        semesterOrder: requirement.semester_order,
        title,
      });
    }
  }

  return [...entries.values()].sort((left, right) =>
    left.courseCode.localeCompare(right.courseCode, "es-MX"),
  );
}

export function buildSubjectTitleLookup(documents: BulletinDocument[]) {
  return new Map(
    buildSubjectDirectory(documents).map((entry) => [entry.courseCode, entry.title] as const),
  );
}

export function buildRecommendedSubjectCodes(
  documents: BulletinDocument[],
  estimatedSemester: number | null,
) {
  if (estimatedSemester === null) {
    return [];
  }

  const collected = new Set<string>();

  for (const document of documents) {
    for (const requirement of document.requirements) {
      const courseCode =
        typeof requirement.course_code === "string" ? requirement.course_code.trim() : "";

      if (requirement.semester_order === estimatedSemester && courseCode) {
        collected.add(courseCode);
      }
    }
  }

  return [...collected].sort((left, right) => left.localeCompare(right, "es-MX"));
}

export function buildSelectedSubjectSummary(
  selectedSubjectCodes: string[],
  directory: SubjectDirectoryEntry[],
) {
  const selected = new Set(selectedSubjectCodes);

  return directory.filter((entry) => selected.has(entry.courseCode));
}

export function searchSubjectDirectory(
  directory: SubjectDirectoryEntry[],
  query: string,
) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return directory;
  }

  return directory.filter((entry) =>
    normalizeQuery(`${entry.courseCode} ${entry.title}`).includes(normalizedQuery),
  );
}

export function getCanonicalSubjectTitle(
  courseCode: string,
  titleLookup: ReadonlyMap<string, string>,
  fallbackTitle: string,
) {
  const canonicalTitle = titleLookup.get(courseCode)?.trim();

  if (canonicalTitle) {
    return canonicalTitle;
  }

  return formatVisibleAcademicTitle(fallbackTitle);
}

function normalizePeriodSeason(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = normalizeQuery(value);

  if (normalized.includes("primavera")) {
    return "spring" as const;
  }

  if (normalized.includes("otono")) {
    return "fall" as const;
  }

  return null;
}

function normalizeQuery(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function formatVisibleAcademicTitle(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  if (/[a-záéíóúñ]/u.test(normalized)) {
    return normalized;
  }

  return normalized
    .toLocaleLowerCase("es-MX")
    .split(/\s+/u)
    .filter(Boolean)
    .map((word) => {
      if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/u.test(word)) {
        return word.toUpperCase();
      }

      const [firstLetter = "", ...rest] = [...word];
      return `${firstLetter.toLocaleUpperCase("es-MX")}${rest.join("")}`;
    })
    .join(" ");
}
