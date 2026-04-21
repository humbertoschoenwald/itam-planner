import { getAcademicCareerStudyPlanFallback } from "@/lib/academic-catalog";

export function hasOfficialCareerStudyPlanFallback(careerId: string) {
  return getAcademicCareerStudyPlanFallback(careerId) !== null;
}

export function getOfficialCareerStudyPlanSemesterTitles(
  careerId: string,
  semesterOrder: number,
) {
  const fallback = getAcademicCareerStudyPlanFallback(careerId);
  const semesterTitles =
    fallback?.semesters[semesterOrder as keyof typeof fallback.semesters] ?? [];

  return [...semesterTitles];
}

export function getOfficialCareerStudyPlanFallbackSourceUrl(careerId: string) {
  return getAcademicCareerStudyPlanFallback(careerId)?.sourceUrl ?? null;
}
