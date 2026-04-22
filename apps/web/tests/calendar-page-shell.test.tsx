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
let mockedPhoneViewport = false;

vi.mock("@/lib/api", () => ({
  fetchSchedulePeriodDetail: (...args: unknown[]) => fetchSchedulePeriodDetailMock(...args),
}));

vi.mock("@/lib/use-phone-viewport", () => ({
  usePhoneViewport: () => mockedPhoneViewport,
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
    {
      academic_period: "OTOÑO 2026",
      active_from: "2026-08-01",
      active_to: "2026-08-31",
      code: "P2",
      event_date: "2026-08-10",
      label: "Pago otoño",
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
    mockedPhoneViewport = false;
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
    expect(screen.getAllByText(/días con eventos/u).length).toBeGreaterThan(0);
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
    expect(screen.getByText("PRIMAVERA 2026")).toBeInTheDocument();
    expect(screen.queryByText("OTOÑO 2026")).not.toBeInTheDocument();
  });

  it("renders payment highlights without duplicate React keys when source data misses codes", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const malformedPaymentCalendar = {
      ...paymentCalendar,
      payment_events: [
        {
          ...paymentCalendar.payment_events[0],
          active_from: "2026-05-13",
          code: undefined,
          event_date: null,
        },
        {
          ...paymentCalendar.payment_events[0],
          active_from: "2026-05-13",
          code: undefined,
          event_date: null,
        },
      ],
    } as unknown as PaymentCalendarDocument;

    render(
      <CalendarPageShell
        paymentCalendar={malformedPaymentCalendar}
        plans={[...plans]}
        schoolCalendar={schoolCalendar}
      />,
    );

    expect(
      consoleErrorSpy.mock.calls.find(([message]) =>
        String(message).includes("Encountered two children with the same key"),
      ),
    ).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });

  it("shows a shorter default school and payment feed on phone layouts", () => {
    mockedPhoneViewport = true;

    const phoneSchoolCalendar: SchoolCalendarDocument = {
      ...schoolCalendar,
      events: Array.from({ length: 7 }, (_, index) => ({
        active_from: "2026-01-01",
        active_to: "2026-12-31",
        event_date: `2026-05-0${index + 1}`,
        label: `Evento ${index + 1}`,
        notes: null,
        symbol: `E${index + 1}`,
      })),
    };
    const phonePaymentCalendar: PaymentCalendarDocument = {
      ...paymentCalendar,
      payment_events: Array.from({ length: 6 }, (_, index) => ({
        academic_period: "PRIMAVERA 2026",
        active_from: "2026-01-01",
        active_to: "2026-12-31",
        code: `P${index + 1}`,
        event_date: `2026-05-${10 + index}`,
        label: `Pago ${index + 1}`,
        date_range_start: null,
        date_range_end: null,
        notes: null,
      })),
    };

    render(
      <CalendarPageShell
        paymentCalendar={phonePaymentCalendar}
        plans={[...plans]}
        schoolCalendar={phoneSchoolCalendar}
      />,
    );

    expect(screen.getByText("E1 · Evento 1")).toBeInTheDocument();
    expect(screen.getByText("E4 · Evento 4")).toBeInTheDocument();
    expect(screen.queryByText("E5 · Evento 5")).not.toBeInTheDocument();
    expect(screen.getByText("P1 · Pago 1")).toBeInTheDocument();
    expect(screen.getByText("P3 · Pago 3")).toBeInTheDocument();
    expect(screen.queryByText("P4 · Pago 4")).not.toBeInTheDocument();
  });
});
