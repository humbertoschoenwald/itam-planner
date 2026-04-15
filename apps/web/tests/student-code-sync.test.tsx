import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

function SyncHarness() {
  useSyncStudentCode();
  return null;
}

describe("useSyncStudentCode", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    useStudentCodeStore.setState({ code: "" });
  });

  it("regenerates the student code when planner data changes", async () => {
    render(<SyncHarness />);

    useStudentProfileStore.getState().setEntryTerm("OTOÑO 2025");
    useStudentProfileStore.getState().toggleActivePlanId("plan:ma-e");
    usePlannerStore.getState().setSelectedPeriodId("2938");
    usePlannerStore.getState().toggleOfferingId("2938:ACT-11300:001");

    await waitFor(() => {
      expect(useStudentCodeStore.getState().code).toMatch(/^itp1\./u);
    });
  });
});
