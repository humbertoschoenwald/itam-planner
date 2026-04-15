import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { OnboardingPanel } from "@/components/onboarding-panel";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("OnboardingPanel", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("explains when the user was redirected from the planner route", () => {
    render(<OnboardingPanel plans={[]} redirectedFromPlanner />);

    expect(screen.getByText(/Termina el onboarding para entrar al planner/u)).toBeInTheDocument();
  });
});
