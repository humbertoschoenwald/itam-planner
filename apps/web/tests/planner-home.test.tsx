import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlannerHome } from "@/components/planner-home";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const fetchSchedulePeriodDetailMock = vi.fn();

vi.mock("@/lib/api", () => ({
  fetchSchedulePeriodDetail: (...args: unknown[]) => fetchSchedulePeriodDetailMock(...args),
}));

describe("PlannerHome", () => {
  beforeEach(() => {
    fetchSchedulePeriodDetailMock.mockReset();
    window.localStorage.clear();
    useStudentProfileStore.setState({
      profile: {
        ...DEFAULT_STUDENT_PROFILE,
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["licenciatura-en-matematicas-aplicadas:e"],
        selectedCareerIds: ["matematicas-aplicadas"],
      },
    });
    usePlannerStore.setState({
      state: {
        ...DEFAULT_PLANNER_STATE,
        selectedSubjectCodes: ["ACT-11300"],
      },
    });
  });

  it("loads the selected public period detail on demand", async () => {
    fetchSchedulePeriodDetailMock.mockResolvedValue({
      period_id: "2938",
      label: "(PRIMAVERA 2026 LICENCIATURA)",
      level: "LICENCIATURA",
      year: 2026,
      term: "PRIMAVERA",
      active_from: "2026-01-01",
      active_to: "2026-05-31",
      subjects: [],
      offerings: [
        {
          offering_id: "2938:ACT-11300:001:1521",
          period_id: "2938",
          course_code: "ACT-11300",
          group_code: "001",
          crn: "1521",
          section_type: "T",
          display_title: "CALCULO ACTUARIAL I",
          instructor_name: "SERGIO GARCIA ALQUICIRA",
          credits: 6,
          room_code: "RH105",
          campus_name: "RIO HONDO",
          raw_comments: null,
          meetings: [
            {
              weekday_code: "MA",
              start_time: "17:30:00",
              end_time: "19:00:00",
              room_code: "RH105",
              campus_name: "RIO HONDO",
            },
          ],
        },
      ],
    });

    render(
      <PlannerHome
        bulletinDocuments={[]}
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
            entry_to_term: "PRIMAVERA 2024",
          },
        ]}
        periods={[
          {
            period_id: "2938",
            label: "(PRIMAVERA 2026 LICENCIATURA)",
            level: "LICENCIATURA",
            year: 2026,
            term: "PRIMAVERA",
            active_from: "2026-01-01",
            active_to: "2026-05-31",
          },
        ]}
        sourcesMetadata={null}
      />,
    );

    await waitFor(() => {
      expect(fetchSchedulePeriodDetailMock).toHaveBeenCalledWith("2938");
    });

    await waitFor(() => {
      expect(screen.getByText(/ACT-11300 · Grupo 001/u)).toBeInTheDocument();
    });
  });
});
