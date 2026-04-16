import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OnboardingPanel } from "@/components/onboarding-panel";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const pushSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushSpy,
  }),
}));

describe("OnboardingPanel", () => {
  beforeEach(() => {
    pushSpy.mockReset();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("explains when the user was redirected from the planner route", () => {
    render(<OnboardingPanel plans={[]} redirectedFromPlanner />);

    expect(screen.getByText(/Termina el onboarding para entrar al planner/u)).toBeInTheDocument();
  });

  it("blocks planner navigation until the required selectors and plans are complete", () => {
    render(<OnboardingPanel plans={[]} />);

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(pushSpy).not.toHaveBeenCalled();
    expect(screen.getByText(/Falta completar onboarding/u)).toBeInTheDocument();
  });

  it("keeps plans hidden until the entry term is complete", () => {
    render(
      <OnboardingPanel
        plans={[
          {
            bulletin_id: "bulletin:ma-e",
            source_code: "MA-E",
            title: "LICENCIATURA EN MATEMATICAS APLICADAS Plan E",
            program_title: "LICENCIATURA EN MATEMATICAS APLICADAS",
            plan_code: "E",
            plan_id: "licenciatura-en-matematicas-aplicadas:e",
            application_term: "PRIMAVERA 2026",
            application_year: 2026,
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            entry_from_term: "PRIMAVERA 2021",
            entry_to_term: "OTOÑO 2026",
          },
        ]}
      />,
    );

    expect(screen.getByText(/Primero selecciona tu periodo de ingreso/u)).toBeInTheDocument();
    expect(
      screen.queryByText(/LICENCIATURA EN MATEMATICAS APLICADAS · E/u),
    ).not.toBeInTheDocument();
  });

  it("keeps the selected season visible before the year is chosen", () => {
    render(<OnboardingPanel plans={[]} />);

    fireEvent.change(screen.getByLabelText(/Ciclo/u), {
      target: { value: "spring" },
    });

    expect(screen.getByLabelText(/Ciclo/u)).toHaveValue("spring");
    expect(screen.getByText(/Primero selecciona tu periodo de ingreso/u)).toBeInTheDocument();
  });

  it("filters active plans to the selected entry term", () => {
    render(
      <OnboardingPanel
        plans={[
          {
            bulletin_id: "bulletin:ma-e",
            source_code: "MA-E",
            title: "LICENCIATURA EN MATEMATICAS APLICADAS Plan E",
            program_title: "LICENCIATURA EN MATEMATICAS APLICADAS",
            plan_code: "E",
            plan_id: "licenciatura-en-matematicas-aplicadas:e",
            application_term: "PRIMAVERA 2026",
            application_year: 2026,
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            entry_from_term: "PRIMAVERA 2021",
            entry_to_term: "OTOÑO 2026",
          },
          {
            bulletin_id: "bulletin:dac-b",
            source_code: "DAC-B",
            title: "LICENCIATURA EN DERECHO Plan B",
            program_title: "LICENCIATURA EN DERECHO",
            plan_code: "B",
            plan_id: "licenciatura-en-derecho:b",
            application_term: "PRIMAVERA 2026",
            application_year: 2026,
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            entry_from_term: "PRIMAVERA 2015",
            entry_to_term: "PRIMAVERA 2019",
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Ciclo/u), {
      target: { value: "fall" },
    });
    fireEvent.change(screen.getByLabelText(/Año/u), {
      target: { value: "2025" },
    });

    expect(screen.getByText(/LICENCIATURA EN MATEMATICAS APLICADAS · E/u)).toBeInTheDocument();
    expect(screen.queryByText(/LICENCIATURA EN DERECHO · B/u)).not.toBeInTheDocument();
  });

  it("navigates to the planner after valid selector choices and an active plan", () => {
    render(
      <OnboardingPanel
        plans={[
          {
            bulletin_id: "bulletin:ma-e",
            source_code: "MA-E",
            title: "LICENCIATURA EN MATEMATICAS APLICADAS Plan E",
            program_title: "LICENCIATURA EN MATEMATICAS APLICADAS",
            plan_code: "E",
            plan_id: "licenciatura-en-matematicas-aplicadas:e",
            application_term: "PRIMAVERA 2026",
            application_year: 2026,
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            entry_from_term: "PRIMAVERA 2021",
            entry_to_term: "OTOÑO 2026",
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Ciclo/u), {
      target: { value: "fall" },
    });
    fireEvent.change(screen.getByLabelText(/Año/u), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(pushSpy).toHaveBeenCalledWith("/planner");
  });
});
