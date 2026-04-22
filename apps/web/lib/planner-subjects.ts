import { getOfficialCareerStudyPlanSemesterTitles } from "@/lib/official-study-plan-fallbacks";
import { parseEntryTerm } from "@/lib/onboarding";
import type {
  BulletinDocument,
  SchedulePeriodSummary,
} from "@/lib/types";

export type SubjectDirectoryEntry = {
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
): number | null {
  const semesterEstimateInput = buildSemesterEstimateInput(entryTerm, currentPeriod);

  if (semesterEstimateInput === null) {
    return null;
  }

  const { currentPeriodYear, entrySeasonKey, entryYear, periodSeason } = semesterEstimateInput;
  const yearDifference = currentPeriodYear - entryYear;
  const estimated =
    yearDifference * 2 +
    (REGULAR_TERM_ORDER[periodSeason] - REGULAR_TERM_ORDER[entrySeasonKey]) +
    1;

  return Number.isInteger(estimated) ? Math.max(1, Math.min(8, estimated)) : null;
}

export function buildSubjectDirectory(documents: BulletinDocument[]): SubjectDirectoryEntry[] {
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

export function buildSubjectTitleLookup(documents: BulletinDocument[]): Map<string, string> {
  return new Map(
    buildSubjectDirectory(documents).map((entry) => [entry.courseCode, entry.title] as const),
  );
}

export function buildRecommendedSubjectCodes(
  documents: BulletinDocument[],
  estimatedSemester: number | null,
  options?: {
    allDocuments?: BulletinDocument[];
    fallbackCareerIds?: string[];
  },
): string[] {
  if (estimatedSemester === null) {
    return [];
  }

  const recommendedCodes = collectRecommendedSubjectCodes(documents, estimatedSemester);

  if (recommendedCodes.length > 0 || !hasFallbackCareerIds(options?.fallbackCareerIds)) {
    return recommendedCodes;
  }

  return buildFallbackSubjectCodesFromOfficialStudyPlans(
    options.fallbackCareerIds,
    estimatedSemester,
    options.allDocuments ?? documents,
  );
}

export function buildSelectedSubjectSummary(
  selectedSubjectCodes: string[],
  directory: SubjectDirectoryEntry[],
): SubjectDirectoryEntry[] {
  const selected = new Set(selectedSubjectCodes);

  return directory.filter((entry) => selected.has(entry.courseCode));
}

export function searchSubjectDirectory(
  directory: SubjectDirectoryEntry[],
  query: string,
): SubjectDirectoryEntry[] {
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
): string {
  const canonicalTitle = titleLookup.get(courseCode)?.trim();

  if (canonicalTitle) {
    return canonicalTitle;
  }

  return formatVisibleAcademicTitle(fallbackTitle);
}

function normalizePeriodSeason(value: string | null): "spring" | "fall" | null {
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

function normalizeQuery(value: string): string {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\ufb01/gu, "fi")
    .replace(/\ufb02/gu, "fl")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\((?:[a-z0-9]+)\)/giu, " ")
    .replace(/\bing\.?\b/giu, "ingenieria")
    .replace(/\bi\.a\.?\b/giu, "inteligencia artificial")
    .replace(/\s+/gu, " ")
    .trim();
}

function buildFallbackSubjectCodesFromOfficialStudyPlans(
  careerIds: string[],
  estimatedSemester: number,
  documents: BulletinDocument[],
): string[] {
  const titleIndex = buildTitleIndex(documents);
  const collected = new Set<string>();

  for (const careerId of careerIds) {
    const titles = getOfficialCareerStudyPlanSemesterTitles(careerId, estimatedSemester);

    for (const title of titles) {
      const resolvedCourseCode = resolveCourseCodeFromOfficialStudyPlanTitle(title, titleIndex);

      if (resolvedCourseCode) {
        collected.add(resolvedCourseCode);
      }
    }
  }

  return [...collected].sort((left, right) => left.localeCompare(right, "es-MX"));
}

function buildTitleIndex(documents: BulletinDocument[]): Map<string, string[]> {
  const titleIndex = new Map<string, string[]>();

  for (const document of documents) {
    for (const requirement of document.requirements) {
      const normalizedTitle = normalizeQuery(requirement.display_title);
      const courseCode =
        typeof requirement.course_code === "string" ? requirement.course_code.trim() : "";

      if (!normalizedTitle || !courseCode) {
        continue;
      }

      const existing = titleIndex.get(normalizedTitle) ?? [];
      if (!existing.includes(courseCode)) {
        titleIndex.set(normalizedTitle, [...existing, courseCode].sort((left, right) => left.localeCompare(right, "es-MX")));
      }
    }
  }

  return titleIndex;
}

function resolveCourseCodeFromOfficialStudyPlanTitle(
  title: string,
  titleIndex: ReadonlyMap<string, string[]>,
): string | null {
  const normalizedTitle = normalizeOfficialStudyPlanTitle(title);
  const directMatch = getFirstCourseCode(titleIndex.get(normalizedTitle));

  if (directMatch) {
    return directMatch;
  }

  const aliasMatch = getFirstCourseCode(
    titleIndex.get(OFFICIAL_STUDY_PLAN_TITLE_ALIASES[normalizedTitle] ?? ""),
  );

  if (aliasMatch) {
    return aliasMatch;
  }

  return resolveRankedCourseCodeMatch(normalizedTitle, titleIndex);
}

function normalizeOfficialStudyPlanTitle(value: string): string {
  return OFFICIAL_STUDY_PLAN_TITLE_ALIASES[normalizeQuery(value)] ?? normalizeQuery(value);
}

function scoreAcademicTitleMatch(left: string, right: string): number {
  if (left === right) {
    return 1;
  }

  const leftTokens = new Set(left.split(" ").filter(Boolean));
  const rightTokens = new Set(right.split(" ").filter(Boolean));
  const sharedTokens = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const unionSize = new Set([...leftTokens, ...rightTokens]).size || 1;
  const tokenScore = sharedTokens / unionSize;
  const containmentBonus = left.includes(right) || right.includes(left) ? 0.18 : 0;

  return Math.min(tokenScore + containmentBonus, 0.99);
}

const OFFICIAL_STUDY_PLAN_TITLE_ALIASES: Record<string, string> = {
  "estrategia de comunicacion escrita": "estrategias de comunicacion escrita",
  "ideas instituciones politicas y sociales i": "ideas e instituciones politicas y sociales i",
  "ideas instituciones politicas y sociales ii": "ideas e instituciones politicas y sociales ii",
  "ideas instituciones politicas y sociales iii": "ideas e instituciones politicas y sociales iii",
  "comunicacion escrita para ingenieria en inteligencia artificial":
    "comunicacion escrita para ingenieria",
  "comunicacion profesional para ingenieria en inteligencia artificial":
    "comunicacion profesional para ingenieria",
};

function formatVisibleAcademicTitle(value: string): string {
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

function buildSemesterEstimateInput(
  entryTerm: string,
  currentPeriod: SchedulePeriodSummary | null,
): {
  currentPeriodYear: number;
  entrySeasonKey: "fall" | "spring";
  entryYear: number;
  periodSeason: "fall" | "spring";
} | null {
  const parsedEntryTerm = parseEntryTerm(entryTerm);

  if (
    !parsedEntryTerm.seasonKey ||
    !parsedEntryTerm.year ||
    currentPeriod === null ||
    currentPeriod.year === null
  ) {
    return null;
  }

  const entryYear = Number.parseInt(parsedEntryTerm.year, 10);
  const periodSeason = normalizePeriodSeason(currentPeriod.term ?? currentPeriod.label);

  if (!Number.isInteger(entryYear) || periodSeason === null) {
    return null;
  }

  return {
    currentPeriodYear: currentPeriod.year,
    entrySeasonKey: parsedEntryTerm.seasonKey,
    entryYear,
    periodSeason,
  };
}

function collectRecommendedSubjectCodes(
  documents: BulletinDocument[],
  estimatedSemester: number,
): string[] {
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

function hasFallbackCareerIds(fallbackCareerIds: string[] | undefined): fallbackCareerIds is string[] {
  return Array.isArray(fallbackCareerIds) && fallbackCareerIds.length > 0;
}

function getFirstCourseCode(courseCodes: string[] | undefined): string | null {
  return courseCodes?.[0] ?? null;
}

function resolveRankedCourseCodeMatch(
  normalizedTitle: string,
  titleIndex: ReadonlyMap<string, string[]>,
): string | null {
  const rankedMatches = [...titleIndex.entries()]
    .map(([candidateTitle, courseCodes]) => ({
      candidateTitle,
      courseCode: getFirstCourseCode(courseCodes),
      score: scoreAcademicTitleMatch(normalizedTitle, candidateTitle),
    }))
    .filter((candidate) => candidate.courseCode !== null && candidate.score >= 0.78)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.candidateTitle.localeCompare(right.candidateTitle, "es-MX"),
    );

  const bestMatch = rankedMatches[0];
  const secondMatch = rankedMatches[1];

  if (!bestMatch?.courseCode) {
    return null;
  }

  return secondMatch && bestMatch.score - secondMatch.score < 0.08
    ? null
    : bestMatch.courseCode;
}
