import { hasApplicableActivePlans, isValidEntryTerm } from "@/lib/onboarding";
import type { BulletinSummary, PlannerWidgetId, StudentProfile } from "@/lib/types";

export function hasCompletedPlannerBootstrap(
  profile: StudentProfile,
  plannerWidgetIds: PlannerWidgetId[],
  plans: BulletinSummary[],
) {
  if (profile.academicLevel === null || !profile.hasExplicitLocalePreference) {
    return false;
  }

  if (profile.academicLevel === "graduate") {
    return isValidEntryTerm(profile.entryTerm) && plannerWidgetIds.length > 0;
  }

  if (profile.academicLevel === "jointPrograms") {
    return (
      isValidEntryTerm(profile.entryTerm) &&
      profile.selectedJointProgramIds.length > 0 &&
      (profile.activePlanIds.length === 0 || hasApplicableActivePlans(profile, plans)) &&
      plannerWidgetIds.length > 0
    );
  }

  return (
    isValidEntryTerm(profile.entryTerm) &&
    profile.selectedCareerIds.length > 0 &&
    (profile.activePlanIds.length === 0 || hasApplicableActivePlans(profile, plans)) &&
    plannerWidgetIds.length > 0
  );
}
