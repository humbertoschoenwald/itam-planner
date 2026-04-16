import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RouteError from "@/app/error";
import { DEFAULT_STUDENT_PROFILE, useStudentProfileStore } from "@/stores/student-profile-store";

const clearPlannerBrowserStateMock = vi.fn();

vi.mock("@/lib/browser-state", () => ({
  clearPlannerBrowserState: () => clearPlannerBrowserStateMock(),
}));

describe("RouteError", () => {
  beforeEach(() => {
    clearPlannerBrowserStateMock.mockReset();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("keeps manual recovery actions available while clearing browser-local state", () => {
    const reset = vi.fn();

    render(
      <RouteError
        error={new Error("boom")}
        reset={reset}
      />,
    );

    expect(clearPlannerBrowserStateMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: /Ir a onboarding/u })).toHaveAttribute(
      "href",
      "/onboarding?from=planner",
    );

    fireEvent.click(screen.getByRole("button", { name: /Reintentar/u }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
