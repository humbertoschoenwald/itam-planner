import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

function SyncHarness(): null {
  useSyncStudentCode();
  return null;
}

describe("useSyncStudentCode", () => {
  const originalBuffer = globalThis.Buffer;

  beforeEach(() => {
    window.localStorage.clear();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    useStudentCodeStore.setState({ code: "" });
  });

  afterEach(() => {
    globalThis.Buffer = originalBuffer;
  });

  it("regenerates the student code when planner data changes", async () => {
    render(<SyncHarness />);

    await act(async () => {
      useStudentProfileStore.getState().setEntryTerm("OTOÑO 2025");
      useStudentProfileStore.getState().toggleActivePlanId("plan:ma-e");
      usePlannerStore.getState().setSelectedPeriodId("2938");
      usePlannerStore.getState().toggleOfferingId("2938:ACT-11300:001");
    });

    await waitFor(() => {
      expect(useStudentCodeStore.getState().code).toMatch(/^itp1\./u);
    });
  });

  it("does not crash the route when code generation hits a browser-incompatible Buffer implementation", async () => {
    const unsupportedBuffer = Object.assign(function UnsupportedBuffer() {}, {
      from: () => {
        throw new Error("Unsupported browser Buffer polyfill");
      },
    });

    globalThis.Buffer = unsupportedBuffer as unknown as typeof Buffer;

    render(<SyncHarness />);

    await act(async () => {
      useStudentProfileStore.getState().setEntryTerm("PRIMAVERA 2024");
      useStudentProfileStore.getState().toggleActivePlanId("plan:ma-e");
    });

    await waitFor(() => {
      expect(useStudentCodeStore.getState().code).toMatch(/^itp1\./u);
    });
  });
});
