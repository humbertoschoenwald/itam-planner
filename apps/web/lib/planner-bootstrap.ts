import { hasApplicableActivePlans, isValidEntryTerm } from "@/lib/onboarding";
import type { BulletinSummary, PlannerWidgetId, StudentProfile } from "@/lib/types";

export function hasCompletedPlannerBootstrap(
  profile: StudentProfile,
  plannerWidgetIds: PlannerWidgetId[],
  plans: BulletinSummary[],
): boolean {
  return (
    hasPlannerWidgets(plannerWidgetIds) &&
    isValidEntryTerm(profile.entryTerm) &&
    hasCompletedPlannerBootstrapForLevel(profile, plans)
  );
}

function hasPlannerWidgets(plannerWidgetIds: PlannerWidgetId[]): boolean {
  return plannerWidgetIds.length > 0;
}

function hasValidActivePlanSelection(
  profile: StudentProfile,
  plans: BulletinSummary[],
): boolean {
  return profile.activePlanIds.length === 0 || hasApplicableActivePlans(profile, plans);
}

function hasCompletedPlannerBootstrapForLevel(
  profile: StudentProfile,
  plans: BulletinSummary[],
): boolean {
  switch (profile.academicLevel) {
    case null:
      return false;
    case "graduate":
      return true;
    case "jointPrograms":
      return profile.selectedJointProgramIds.length > 0 && hasValidActivePlanSelection(profile, plans);
    case "undergraduate":
      return profile.selectedCareerIds.length > 0 && hasValidActivePlanSelection(profile, plans);
  }
}
