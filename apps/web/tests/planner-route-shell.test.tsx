import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PlannerRouteShell } from "@/components/planner-route-shell";
import { DEFAULT_PLANNER_UI_STATE, usePlannerUiStore } from "@/stores/planner-ui-store";
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
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
    vi.spyOn(useStudentProfileStore.persist, "hasHydrated").mockReturnValue(true);
    vi.spyOn(usePlannerUiStore.persist, "hasHydrated").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to planner onboarding when the required local state is missing", async () => {
    render(
      <PlannerRouteShell
        bulletinDocuments={[]}
        periods={[]}
        plans={[]}
        sourcesMetadata={null}
      />,
    );

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith("/planner/onboarding");
    });

    expect(screen.getByText(/Planner está preparando tu onboarding/u)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Continuar onboarding/u })).toHaveAttribute(
      "href",
      "/planner/onboarding",
    );
  });

  it("renders the planner shell when onboarding and widget preferences are complete", () => {
    useStudentProfileStore.setState({
      profile: {
        ...DEFAULT_STUDENT_PROFILE,
        academicLevel: "undergraduate",
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
        selectedCareerIds: ["matematicas-aplicadas"],
      },
    });
    usePlannerUiStore.setState({
      state: {
        hasCompletedSetupAnimation: false,
        navSwipePreference: null,
        plannerWidgetIds: ["today", "week"],
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
            entry_from_term: "PRIMAVERA 2021",
            entry_to_term: "OTOÑO 2026",
            plan_code: "E",
            plan_id: "plan:ma-e",
            program_title: "LICENCIATURA EN MATEMATICAS APLICADAS",
            source_code: "MA-E",
            title: "LICENCIATURA EN MATEMATICAS APLICADAS Plan E",
          },
        ]}
        bulletinDocuments={[]}
        periods={[]}
        sourcesMetadata={null}
      />,
    );

    expect(screen.getByText("Planner shell")).toBeInTheDocument();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("treats stale active plans as incomplete and redirects back to planner onboarding", async () => {
    useStudentProfileStore.setState({
      profile: {
        ...DEFAULT_STUDENT_PROFILE,
        academicLevel: "undergraduate",
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
        selectedCareerIds: ["matematicas-aplicadas"],
      },
    });
    usePlannerUiStore.setState({
      state: {
        hasCompletedSetupAnimation: false,
        navSwipePreference: null,
        plannerWidgetIds: ["today"],
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
        bulletinDocuments={[]}
        periods={[]}
        sourcesMetadata={null}
      />,
    );

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith("/planner/onboarding");
    });

    expect(screen.queryByText("Planner shell")).not.toBeInTheDocument();
  });

  it("keeps a stable fallback link to planner onboarding while redirecting", () => {
    render(
      <PlannerRouteShell
        bulletinDocuments={[]}
        periods={[]}
        plans={[]}
        sourcesMetadata={null}
      />,
    );

    expect(screen.getByRole("link", { name: /Continuar onboarding/u })).toHaveAttribute(
      "href",
      "/planner/onboarding",
    );
    expect(screen.getByRole("link", { name: /Volver al inicio/u })).toHaveAttribute("href", "/");
  });
});
