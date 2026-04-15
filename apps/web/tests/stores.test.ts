import { beforeEach, describe, expect, it } from "vitest";

import { STORAGE_KEYS } from "@/lib/storage-keys";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("persisted stores", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
  });

  it("persists and rehydrates the student profile", async () => {
    useStudentProfileStore.getState().setEntryTerm("OTOÑO 2025");
    useStudentProfileStore.getState().toggleActivePlanId("plan:ma-e");

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.studentProfile) ?? "{}");
    expect(stored.state.profile.entryTerm).toBe("OTOÑO 2025");

    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    window.localStorage.setItem(STORAGE_KEYS.studentProfile, JSON.stringify(stored));
    await useStudentProfileStore.persist.rehydrate();

    expect(useStudentProfileStore.getState().profile.entryTerm).toBe("OTOÑO 2025");
    expect(useStudentProfileStore.getState().profile.activePlanIds).toEqual(["plan:ma-e"]);
  });

  it("persists and rehydrates planner state", async () => {
    usePlannerStore.getState().setSelectedPeriodId("2938");
    usePlannerStore.getState().toggleOfferingId("2938:ACT-11300:001");

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.plannerState) ?? "{}");
    expect(stored.state.state.selectedPeriodId).toBe("2938");

    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    window.localStorage.setItem(STORAGE_KEYS.plannerState, JSON.stringify(stored));
    await usePlannerStore.persist.rehydrate();

    expect(usePlannerStore.getState().state.selectedPeriodId).toBe("2938");
    expect(usePlannerStore.getState().state.selectedOfferingIds).toEqual([
      "2938:ACT-11300:001",
    ]);
  });
});
