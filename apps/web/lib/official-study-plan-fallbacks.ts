import { getAcademicCareerStudyPlanFallback } from "@/lib/academic-catalog";

export function hasOfficialCareerStudyPlanFallback(careerId: string): boolean {
  return getAcademicCareerStudyPlanFallback(careerId) !== null;
}

export function getOfficialCareerStudyPlanSemesterTitles(
  careerId: string,
  semesterOrder: number,
): string[] {
  const fallback = getAcademicCareerStudyPlanFallback(careerId);
  const semesterTitles =
    fallback?.semesters[semesterOrder as keyof typeof fallback.semesters] ?? [];

  return [...semesterTitles];
}

export function getOfficialCareerStudyPlanFallbackSourceUrl(careerId: string): string | null {
  return getAcademicCareerStudyPlanFallback(careerId)?.sourceUrl ?? null;
}
