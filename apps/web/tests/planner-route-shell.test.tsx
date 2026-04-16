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
    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to onboarding when the required profile state is missing", async () => {
    render(
      <PlannerRouteShell
        plans={[]}
        periods={[]}
        sourcesMetadata={null}
      />,
    );

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith("/onboarding?from=planner");
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
        plans={[
          {
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            application_term: "PRIMAVERA 2026",
            application_year: 2026,
            bulletin_id: "bulletin:ma-e",
            entry_from_term: null,
            entry_to_term: null,
            plan_code: "E",
            plan_id: "plan:ma-e",
            program_title: "LICENCIATURA EN MATEMATICAS APLICADAS",
            source_code: "MA-E",
            title: "LICENCIATURA EN MATEMATICAS APLICADAS Plan E",
          },
        ]}
        periods={[]}
        sourcesMetadata={null}
      />,
    );

    expect(screen.getByText("Planner shell")).toBeInTheDocument();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("redirects to onboarding when the stored active plans no longer apply", async () => {
    useStudentProfileStore.setState({
      profile: {
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
        locale: "es-MX",
      },
    });

    render(
      <PlannerRouteShell
        plans={[
          {
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            application_term: "PRIMAVERA 2026",
            application_year: 2026,
            bulletin_id: "bulletin:dac-b",
            entry_from_term: "PRIMAVERA 2015",
            entry_to_term: "PRIMAVERA 2019",
            plan_code: "B",
            plan_id: "plan:dac-b",
            program_title: "LICENCIATURA EN DERECHO",
            source_code: "DAC-B",
            title: "LICENCIATURA EN DERECHO Plan B",
          },
        ]}
        periods={[]}
        sourcesMetadata={null}
      />,
    );

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith("/onboarding?from=planner");
    });

    expect(screen.queryByText("Planner shell")).not.toBeInTheDocument();
  });

  it("keeps a stable fallback path to onboarding in standalone mode", async () => {
    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      value: true,
    });

    render(<PlannerRouteShell plans={[]} periods={[]} sourcesMetadata={null} />);

    await waitFor(() => {
      expect(screen.getByText(/Termina el onboarding para entrar al planner/u)).toBeInTheDocument();
    });

    expect(replaceSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /Ir a onboarding/u })).toHaveAttribute(
      "href",
      "/onboarding?from=planner",
    );
  });
});
