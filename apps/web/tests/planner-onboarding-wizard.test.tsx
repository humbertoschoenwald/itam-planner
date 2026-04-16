import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlannerOnboardingWizard } from "@/components/planner-onboarding-wizard";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import { DEFAULT_PLANNER_UI_STATE, usePlannerUiStore } from "@/stores/planner-ui-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const pushSpy = vi.fn();
const replaceSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushSpy,
    replace: replaceSpy,
  }),
}));

const samplePlans = [
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
] as const;

describe("PlannerOnboardingWizard", () => {
  beforeEach(() => {
    pushSpy.mockReset();
    replaceSpy.mockReset();
    window.localStorage.clear();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
  });

  it("keeps plan selection hidden until season and year are complete", () => {
    render(<PlannerOnboardingWizard plans={[...samplePlans]} />);

    expect(screen.getByText(/¿En qué ciclo ingresaste\?/u)).toBeInTheDocument();
    expect(
      screen.queryByText(/LICENCIATURA EN MATEMATICAS APLICADAS · E/u),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/Falta completar onboarding/u)).toBeInTheDocument();
  });

  it("walks through the embedded wizard and persists widget preferences before opening planner", () => {
    render(<PlannerOnboardingWizard plans={[...samplePlans]} />);

    fireEvent.click(screen.getByRole("button", { name: /Otoño/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/¿Qué año corresponde a ese ciclo\?/u)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/¿Qué planes te aplican hoy\?/u)).toBeInTheDocument();
    expect(screen.getByText(/LICENCIATURA EN MATEMATICAS APLICADAS · E/u)).toBeInTheDocument();
    expect(screen.queryByText(/LICENCIATURA EN DERECHO · B/u)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/¿En qué idioma quieres ver el planner\?/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/¿Qué quieres ver en tu planner\?/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: /Hoy/u }));

    expect(usePlannerUiStore.getState().state.plannerWidgetIds).toEqual(["today"]);

    fireEvent.click(screen.getByRole("button", { name: /Abrir planner/u }));

    expect(pushSpy).toHaveBeenCalledWith("/planner");
  });
});
