import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CalendarPageShell } from "@/components/calendar-page-shell";
import type {
  BulletinSummary,
  PaymentCalendarDocument,
  SchoolCalendarDocument,
} from "@/lib/types";
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

const schoolCalendar: SchoolCalendarDocument = {
  active_from: "2026-01-01",
  active_to: "2026-12-31",
  calendar_id: "school:2026",
  calendar_kind: "school",
  legend: [],
  period_label: "2026",
  source_snapshot_id: "snapshot:school",
  title: "Calendario escolar 2026",
  events: [
    {
      active_from: "2026-01-01",
      active_to: "2026-12-31",
      event_date: "2026-01-05",
      label: "Inicio de clases",
      notes: null,
      symbol: "IC",
    },
  ],
};

const paymentCalendar: PaymentCalendarDocument = {
  active_from: "2026-01-01",
  active_to: "2026-12-31",
  calendar_id: "payment:2026",
  calendar_kind: "payment",
  events: [],
  legend: [],
  period_label: "2026",
  source_snapshot_id: "snapshot:payment",
  title: "Pagos 2026",
  payment_events: [
    {
      academic_period: "PRIMAVERA 2026",
      active_from: "2026-01-01",
      active_to: "2026-01-31",
      code: "P1",
      event_date: "2026-01-10",
      label: "Primer pago",
      date_range_start: null,
      date_range_end: null,
      notes: null,
    },
  ],
};

const plans: BulletinSummary[] = [
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
];

describe("CalendarPageShell", () => {
  beforeEach(() => {
    fetchSchedulePeriodDetailMock.mockReset();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
  });

  it("shows the public calendar when planner onboarding is incomplete", () => {
    render(
      <CalendarPageShell
        paymentCalendar={paymentCalendar}
        plans={[...plans]}
        schoolCalendar={schoolCalendar}
      />,
    );

    expect(screen.getByText(/Primero el calendario público/u)).toBeInTheDocument();
    expect(screen.queryByText(/Clases de hoy/u)).not.toBeInTheDocument();
  });

  it("enriches the calendar with today context once planner onboarding exists", async () => {
    fetchSchedulePeriodDetailMock.mockResolvedValue({
      active_from: "2026-01-01",
      active_to: "2026-05-31",
      label: "PRIMAVERA 2026 LICENCIATURA",
      level: "LICENCIATURA",
      offerings: [],
      period_id: "2938",
      subjects: [],
      term: "PRIMAVERA",
      year: 2026,
    });

    useStudentProfileStore.setState({
      profile: {
        ...DEFAULT_STUDENT_PROFILE,
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
    usePlannerStore.setState({
      state: {
        ...DEFAULT_PLANNER_STATE,
        selectedOfferingIds: ["2938:ACT-11300:001"],
        selectedPeriodId: "2938",
      },
    });

    render(
      <CalendarPageShell
        paymentCalendar={paymentCalendar}
        plans={[...plans]}
        schoolCalendar={schoolCalendar}
      />,
    );

    await waitFor(() => {
      expect(fetchSchedulePeriodDetailMock).toHaveBeenCalledWith("2938");
    });

    expect(screen.getByText(/Clases de hoy/u)).toBeInTheDocument();
  });
});
