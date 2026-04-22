import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlannerSettingsShell } from "@/components/planner-settings-shell";
import {
  DEFAULT_SCHEDULE_GENERATION_PREFERENCES,
  usePlannerPreferencesStore,
} from "@/stores/planner-preferences-store";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import { DEFAULT_PLANNER_UI_STATE, usePlannerUiStore } from "@/stores/planner-ui-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const fetchSchedulePeriodDetailMock = vi.fn();

vi.mock("@/lib/api", () => ({
  fetchSchedulePeriodDetail: (...args: unknown[]) => fetchSchedulePeriodDetailMock(...args),
}));

describe("PlannerSettingsShell", () => {
  beforeEach(() => {
    fetchSchedulePeriodDetailMock.mockReset();
    useStudentProfileStore.setState({
      profile: {
        ...DEFAULT_STUDENT_PROFILE,
        academicLevel: "undergraduate",
        entryTerm: "PRIMAVERA 2026",
        activePlanIds: ["plan:act-g"],
        selectedCareerIds: ["actuaria"],
      },
    });
    usePlannerStore.setState({
      state: {
        ...DEFAULT_PLANNER_STATE,
        selectedOfferingIds: ["2938:ACT-15360:001"],
        selectedPeriodId: "2938",
        selectedSubjectCodes: ["ACT-15360"],
      },
    });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
    usePlannerPreferencesStore.setState({
      preferences: DEFAULT_SCHEDULE_GENERATION_PREFERENCES,
    });
  });

  it("keeps period and public-group controls in configuration", async () => {
    fetchSchedulePeriodDetailMock.mockResolvedValue({
      active_from: "2026-01-01",
      active_to: "2026-05-31",
      label: "PRIMAVERA 2026 LICENCIATURA",
      level: "LICENCIATURA",
      offerings: [
        {
          campus_name: "RIO HONDO",
          course_code: "ACT-15360",
          credits: 6,
          crn: "1521",
          display_title: "INTRODUCCION A LA ACTUARIA",
          group_code: "001",
          instructor_name: "MARIA DE LOS ANGELES YAÑEZ ACOSTA",
          meetings: [
            {
              campus_name: "RIO HONDO",
              end_time: "13:00:00",
              room_code: "RH104",
              start_time: "11:30:00",
              weekday_code: "MA",
            },
          ],
          offering_id: "2938:ACT-15360:001",
          period_id: "2938",
          raw_comments: null,
          room_code: "RH104",
          section_type: "T",
        },
      ],
      period_id: "2938",
      subjects: [],
      term: "PRIMAVERA",
      year: 2026,
    });

    render(
      <PlannerSettingsShell
        bulletinDocuments={[
          {
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            application_term: "PRIMAVERA 2026",
            application_year: 2026,
            bulletin_id: "bulletin:act-g",
            entry_from_term: "PRIMAVERA 2026",
            entry_to_term: "OTOÑO 2026",
            plan_code: "G",
            plan_id: "plan:act-g",
            program_title: "LICENCIATURA EN ACTUARIA",
            requirements: [
              {
                course_code: "ACT-15360",
                credits: 6,
                display_title: "INTRODUCCION A LA ACTUARIA",
                prerequisite_references: [],
                raw_prerequisite_text: null,
                requirement_id: "req:1",
                semester_label: "1",
                semester_order: 1,
                sort_order: 1,
              },
            ],
            source_code: "ACT-G",
            title: "LICENCIATURA EN ACTUARIA Plan G",
          },
        ]}
        periods={[
          {
            active_from: "2026-01-01",
            active_to: "2026-05-31",
            label: "PRIMAVERA 2026 LICENCIATURA",
            level: "LICENCIATURA",
            period_id: "2938",
            term: "PRIMAVERA",
            year: 2026,
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Configuración del horario" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Horario público" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Preferencias del horario" })).toBeInTheDocument();

    await flushAsyncState();
    expect(fetchSchedulePeriodDetailMock).toHaveBeenCalledWith("2938");

    expect(screen.getByRole("button", { name: /ACT-15360 · 001/u })).toBeInTheDocument();
    expect(screen.getByText(/Clases seleccionadas: 1/u)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Materias/u })).toBeInTheDocument();
  });
});

async function flushAsyncState(iterations: number = 3): Promise<void> {
  await act(async () => {
    for (let index = 0; index < iterations; index += 1) {
      await Promise.resolve();
    }
  });
}
