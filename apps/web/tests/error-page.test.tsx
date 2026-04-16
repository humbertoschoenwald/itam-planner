import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RouteError from "@/app/error";
import { DEFAULT_STUDENT_PROFILE, useStudentProfileStore } from "@/stores/student-profile-store";

describe("RouteError", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("keeps manual recovery actions available without wiping browser-local state on mount", () => {
    const reset = vi.fn();

    render(
      <RouteError
        error={new Error("boom")}
        reset={reset}
      />,
    );

    expect(screen.getByRole("link", { name: /Abrir onboarding/u })).toHaveAttribute(
      "href",
      "/planner/onboarding",
    );

    fireEvent.click(screen.getByRole("button", { name: /Reintentar/u }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
