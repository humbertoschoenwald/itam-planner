"use client";

import { useEffect } from "react";

import { buildStudentCode } from "@/lib/student-code";
import { usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function useSyncStudentCode() {
  const entryTerm = useStudentProfileStore((state) => state.profile.entryTerm);
  const activePlanIds = useStudentProfileStore((state) => state.profile.activePlanIds);
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const selectedPeriodId = usePlannerStore((state) => state.state.selectedPeriodId);
  const selectedOfferingIds = usePlannerStore((state) => state.state.selectedOfferingIds);
  const setCode = useStudentCodeStore((state) => state.setCode);
  const clearCode = useStudentCodeStore((state) => state.clearCode);

  useEffect(() => {
    const hasProfileData = entryTerm.trim().length > 0 || activePlanIds.length > 0;
    const hasPlannerData = selectedPeriodId !== null || selectedOfferingIds.length > 0;

    if (!hasProfileData && !hasPlannerData) {
      clearCode();
      return;
    }

    try {
      setCode(
        buildStudentCode(
          {
            entryTerm,
            activePlanIds,
            locale,
          },
          {
            selectedPeriodId,
            selectedOfferingIds,
          },
        ),
      );
    } catch {
      clearCode();
    }
  }, [activePlanIds, clearCode, entryTerm, locale, selectedOfferingIds, selectedPeriodId, setCode]);
}
