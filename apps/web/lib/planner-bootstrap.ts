import { hasApplicableActivePlans, isValidEntryTerm } from "@/lib/onboarding";
import type { BulletinSummary, PlannerWidgetId, StudentProfile } from "@/lib/types";

export function hasCompletedPlannerBootstrap(
  profile: StudentProfile,
  plannerWidgetIds: PlannerWidgetId[],
  plans: BulletinSummary[],
) {
  return (
    isValidEntryTerm(profile.entryTerm) &&
    hasApplicableActivePlans(profile, plans) &&
    plannerWidgetIds.length > 0
  );
}
