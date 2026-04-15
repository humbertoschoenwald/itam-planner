import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PlannerRouteShell } from "@/components/planner-route-shell";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const replaceSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceSpy,
  }),
}));

vi.mock("@/components/planner-home", () => ({
  PlannerHome: () => <div>Planner shell</div>,
}));

describe("PlannerRouteShell", () => {
  beforeEach(() => {
    replaceSpy.mockReset();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    vi.spyOn(useStudentProfileStore.persist, "hasHydrated").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to onboarding when the required profile state is missing", async () => {
    render(
      <PlannerRouteShell
        periodDetailsById={{}}
        plans={[]}
        periods={[]}
        sourcesMetadata={null}
      />,
    );

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith("/onboarding");
    });

    expect(screen.getByText(/Redirigiendo a onboarding/u)).toBeInTheDocument();
  });

  it("renders the planner shell when onboarding is complete", () => {
    useStudentProfileStore.setState({
      profile: {
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
        locale: "es-MX",
      },
    });

    render(
      <PlannerRouteShell
        periodDetailsById={{}}
        plans={[]}
        periods={[]}
        sourcesMetadata={null}
      />,
    );

    expect(screen.getByText("Planner shell")).toBeInTheDocument();
    expect(replaceSpy).not.toHaveBeenCalled();
  });
});
