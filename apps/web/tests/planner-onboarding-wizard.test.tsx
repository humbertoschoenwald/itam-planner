import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  PlannerOnboardingWizard,
  getPlannerSetupDelayMs,
} from "@/components/planner-onboarding-wizard";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import {
  DEFAULT_PLANNER_UI_STATE,
  PLANNER_WIDGET_IDS,
  usePlannerUiStore,
} from "@/stores/planner-ui-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const pushSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushSpy,
    replace: vi.fn(),
  }),
}));

const samplePlans = [
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:act-g",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "G",
    plan_id: "plan:act-g",
    program_title: "LICENCIATURA EN ACTUARÍA",
    source_code: "ACT-G",
    title: "LICENCIATURA EN ACTUARÍA Plan G",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:act-h",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "H",
    plan_id: "plan:act-h",
    program_title: "LICENCIATURA EN ACTUARÍA",
    source_code: "ACT-H",
    title: "LICENCIATURA EN ACTUARÍA Plan H",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:econ-f",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "F",
    plan_id: "plan:econ-f",
    program_title: "LICENCIATURA EN ECONOMÍA",
    source_code: "ECO-F",
    title: "LICENCIATURA EN ECONOMÍA Plan F",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:iin-a",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "A",
    plan_id: "plan:iin-a",
    program_title: "INGENIERÍA EN INDUSTRIAL",
    source_code: "IIN-A",
    title: "INGENIERÍA EN INDUSTRIAL Plan A",
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
    vi.useRealTimers();
    vi.restoreAllMocks();
    setViewportWidth(390);
    window.localStorage.clear();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
  });

  it("starts with the intro step and blocks program search until entry term is complete", () => {
    render(<PlannerOnboardingWizard plans={[...samplePlans]} />);

    expect(screen.getByText(/Vamos a configurar el planner una sola vez/u)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Buscar carrera/u)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/¿Cuál es tu periodo de ingreso\?/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/Todavía falta un paso obligatorio/u)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Buscar carrera/u)).not.toBeInTheDocument();
  });

  it("skips the swipe step outside phone layouts", () => {
    setViewportWidth(1280);
    render(<PlannerOnboardingWizard plans={[...samplePlans]} />);

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Otoño/u }));
    fireEvent.change(screen.getByRole("combobox", { name: /Año de ingreso/u }), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: "Economía" }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/Ya puedes crear tu planner/u)).toBeInTheDocument();
    expect(
      screen.queryByText(/¿Cómo quieres que se sienta el deslizamiento\?/u),
    ).not.toBeInTheDocument();
  });

  it("deduplicates careers, filters alphabetically, and finishes setup with a bounded delay", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);

    render(<PlannerOnboardingWizard plans={[...samplePlans]} />);

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    fireEvent.click(screen.getByRole("button", { name: /Otoño/u }));
    fireEvent.change(screen.getByRole("combobox", { name: /Año de ingreso/u }), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/Selecciona tu licenciatura \/ ingeniería:/u)).toBeInTheDocument();
    expect(screen.getAllByText("Actuaría")).toHaveLength(1);

    const visibleChoices = screen
      .getAllByRole("button")
      .map((button) => button.textContent?.trim())
      .filter((text): text is string =>
        ["Actuaría", "Economía", "Industrial"].includes(text ?? ""),
      );

    expect(visibleChoices).toEqual(["Actuaría", "Economía", "Industrial"]);

    fireEvent.change(screen.getByRole("searchbox", { name: /Buscar carrera/u }), {
      target: { value: "eco" },
    });

    expect(screen.getByRole("button", { name: "Economía" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Actuaría" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Economía" }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(
      screen.getByText(/¿Cómo quieres que se sienta el deslizamiento\?/u),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Movimiento natural/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/Perfecto, configuraste ITAM Planner\./u)).toBeInTheDocument();
    expect(screen.getByText("Otoño 2025")).toBeInTheDocument();
    expect(screen.getByText("Economía")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Finalizar e ir al planner/u }));

    expect(usePlannerUiStore.getState().state.plannerWidgetIds).toEqual([...PLANNER_WIDGET_IDS]);
    expect(usePlannerUiStore.getState().state.hasCompletedSetupAnimation).toBe(true);
    expect(screen.getByText(/Preparando tu planner/u)).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(getPlannerSetupDelayMs(0));
    });

    expect(pushSpy).toHaveBeenCalledWith("/planner");
  });
});

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });
  window.dispatchEvent(new Event("resize"));
}
