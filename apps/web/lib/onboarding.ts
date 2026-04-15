import type { StudentProfile } from "@/lib/types";

export function hasCompletedOnboarding(profile: StudentProfile) {
  return profile.entryTerm.trim().length > 0 && profile.activePlanIds.length > 0;
}
