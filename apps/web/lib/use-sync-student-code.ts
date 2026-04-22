"use client";

import { useEffect } from "react";

import { buildStudentCode } from "@/lib/student-code";
import { usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function useSyncStudentCode(): void {
  const academicLevel = useStudentProfileStore((state) => state.profile.academicLevel);
  const entryTerm = useStudentProfileStore((state) => state.profile.entryTerm);
  const activePlanIds = useStudentProfileStore((state) => state.profile.activePlanIds);
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const selectedCareerIds = useStudentProfileStore((state) => state.profile.selectedCareerIds);
  const selectedJointProgramIds = useStudentProfileStore(
    (state) => state.profile.selectedJointProgramIds,
  );
  const selectedPeriodId = usePlannerStore((state) => state.state.selectedPeriodId);
  const selectedOfferingIds = usePlannerStore((state) => state.state.selectedOfferingIds);
  const selectedSubjectCodes = usePlannerStore((state) => state.state.selectedSubjectCodes);
  const setCode = useStudentCodeStore((state) => state.setCode);
  const clearCode = useStudentCodeStore((state) => state.clearCode);

  useEffect(() => {
    const hasProfileData = hasStudentProfileCodeInput({
      academicLevel,
      activePlanIds,
      entryTerm,
      selectedCareerIds,
      selectedJointProgramIds,
    });
    const hasPlannerData = hasPlannerCodeInput({
      selectedOfferingIds,
      selectedPeriodId,
      selectedSubjectCodes,
    });

    if (!hasProfileData && !hasPlannerData) {
      clearCode();
      return;
    }

    try {
      setCode(
        buildStudentCode(
          {
            academicLevel,
            entryTerm,
            activePlanIds,
            locale,
            selectedCareerIds,
            selectedJointProgramIds,
          },
          {
            selectedPeriodId,
            selectedOfferingIds,
            selectedSubjectCodes,
          },
        ),
      );
    } catch {
      clearCode();
    }
  }, [
    activePlanIds,
    academicLevel,
    clearCode,
    entryTerm,
    locale,
    selectedCareerIds,
    selectedJointProgramIds,
    selectedOfferingIds,
    selectedPeriodId,
    selectedSubjectCodes,
    setCode,
  ]);
}

function hasStudentProfileCodeInput({
  academicLevel,
  activePlanIds,
  entryTerm,
  selectedCareerIds,
  selectedJointProgramIds,
}: {
  academicLevel: ReturnType<typeof useStudentProfileStore.getState>["profile"]["academicLevel"];
  activePlanIds: string[];
  entryTerm: string;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
}): boolean {
  return (
    academicLevel !== null ||
    entryTerm.trim().length > 0 ||
    activePlanIds.length > 0 ||
    selectedCareerIds.length > 0 ||
    selectedJointProgramIds.length > 0
  );
}

function hasPlannerCodeInput({
  selectedOfferingIds,
  selectedPeriodId,
  selectedSubjectCodes,
}: {
  selectedOfferingIds: string[];
  selectedPeriodId: string | null;
  selectedSubjectCodes: string[];
}): boolean {
  return (
    selectedPeriodId !== null ||
    selectedOfferingIds.length > 0 ||
    selectedSubjectCodes.length > 0
  );
}
