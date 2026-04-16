import { beforeEach, describe, expect, it } from "vitest";

import { STORAGE_KEYS } from "@/lib/storage-keys";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import { DEFAULT_PLANNER_UI_STATE, usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("persisted stores", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
    useStudentCodeStore.setState({ code: "" });
  });

  it("persists and rehydrates the student profile", async () => {
    useStudentProfileStore.getState().setEntryTerm("OTOÑO 2025");
    useStudentProfileStore.getState().setActivePlanIds(["plan:ma-e", "plan:ma-e"]);

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

  it("sanitizes malformed student profile state during rehydration", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.studentProfile,
      JSON.stringify({
        state: {
          profile: {
            activePlanIds: "plan:broken",
            entryTerm: 2025,
            locale: "pt-BR",
          },
        },
        version: 0,
      }),
    );

    await useStudentProfileStore.persist.rehydrate();

    expect(useStudentProfileStore.getState().profile).toEqual(DEFAULT_STUDENT_PROFILE);
  });

  it("sanitizes malformed planner state during rehydration", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.plannerState,
      JSON.stringify({
        state: {
          state: {
            selectedOfferingIds: "2938:ACT-11300:001",
            selectedPeriodId: 2938,
          },
        },
        version: 0,
      }),
    );

    await usePlannerStore.persist.rehydrate();

    expect(usePlannerStore.getState().state).toEqual(DEFAULT_PLANNER_STATE);
  });

  it("persists and rehydrates planner UI preferences", async () => {
    usePlannerUiStore.getState().setNavSwipePreference("natural");
    usePlannerUiStore.getState().setPlannerWidgetIds(["today", "week", "today"]);

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.plannerUi) ?? "{}");
    expect(stored.state.state.navSwipePreference).toBe("natural");

    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
    window.localStorage.setItem(STORAGE_KEYS.plannerUi, JSON.stringify(stored));
    await usePlannerUiStore.persist.rehydrate();

    expect(usePlannerUiStore.getState().state).toEqual({
      navSwipePreference: "natural",
      plannerWidgetIds: ["today", "week"],
    });
  });

  it("sanitizes malformed planner UI state during rehydration", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.plannerUi,
      JSON.stringify({
        state: {
          state: {
            navSwipePreference: "sideways",
            plannerWidgetIds: ["today", "broken", 7],
          },
        },
        version: 0,
      }),
    );

    await usePlannerUiStore.persist.rehydrate();

    expect(usePlannerUiStore.getState().state).toEqual({
      navSwipePreference: null,
      plannerWidgetIds: ["today"],
    });
  });

  it("keeps student code derived in memory instead of persisting it", () => {
    useStudentCodeStore.getState().setCode("itp1.example-token");

    expect(window.localStorage.getItem("itamPlanner.studentCode.v1")).toBeNull();
    expect(useStudentCodeStore.getState().code).toBe("itp1.example-token");
  });
});
