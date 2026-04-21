"use client";

import { useMemo } from "react";

import { TodayClassesCard } from "@/components/today-classes-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { hasCompletedPlannerBootstrap } from "@/lib/presenters/bootstrap-client";
import { useSchedulePeriodDetail } from "@/lib/use-schedule-period-detail";
import type { PaymentCalendarDocument, SchoolCalendarDocument } from "@/lib/types";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

interface CalendarPageShellProps {
  paymentCalendar: PaymentCalendarDocument;
  schoolCalendar: SchoolCalendarDocument;
  plans: Parameters<typeof hasCompletedPlannerBootstrap>[2];
}

export function CalendarPageShell({
  paymentCalendar,
  schoolCalendar,
  plans,
}: CalendarPageShellProps) {
  const profile = useStudentProfileStore((state) => state.profile);
  const plannerState = usePlannerStore((state) => state.state);
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const copy = getUiCopy(profile.locale);
  const todayIso = useMemo(() => getMexicoCityTodayIso(), []);

  const shouldLoadTodayContext =
    plannerState.selectedPeriodId !== null && plannerState.selectedOfferingIds.length > 0;
  const { detail: selectedPeriodDetail } = useSchedulePeriodDetail(
    shouldLoadTodayContext ? plannerState.selectedPeriodId : null,
    copy.plannerHome.selectedPeriodLoadError,
  );
  const selectedOfferings = useMemo(
    () =>
      shouldLoadTodayContext
        ? (selectedPeriodDetail?.offerings.filter((offering) =>
            plannerState.selectedOfferingIds.includes(offering.offering_id),
          ) ?? [])
        : [],
    [plannerState.selectedOfferingIds, selectedPeriodDetail, shouldLoadTodayContext],
  );

  const onboardingComplete = hasCompletedPlannerBootstrap(profile, plannerWidgetIds, plans);

  const upcomingSchoolEvents = useMemo(
    () => getRelevantSchoolEvents(schoolCalendar.events, todayIso).slice(0, 8),
    [schoolCalendar.events, todayIso],
  );
  const focusCalendarMonthIso = upcomingSchoolEvents[0]?.event_date ?? todayIso;
  const calendarMonthView = useMemo(
    () => buildCalendarMonthView(focusCalendarMonthIso, schoolCalendar.events, profile.locale, todayIso),
    [focusCalendarMonthIso, profile.locale, schoolCalendar.events, todayIso],
  );
  const paymentHighlights = useMemo(
    () =>
      getRelevantPaymentEvents(
        paymentCalendar.payment_events,
        todayIso,
        resolvedSelectedAcademicPeriod(selectedPeriodDetail?.label ?? null),
      ).slice(0, 6),
    [paymentCalendar.payment_events, selectedPeriodDetail?.label, todayIso],
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="overflow-hidden rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_30px_90px_rgba(40,43,24,0.08)] sm:p-8">
        <div className="space-y-4">
          <p className="eyebrow text-accent">{copy.calendarPage.eyebrow}</p>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">
            {copy.calendarPage.title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">
            {copy.calendarPage.description}
          </p>
        </div>
      </section>

      {onboardingComplete ? (
        <TodayClassesCard locale={profile.locale} offerings={selectedOfferings} />
      ) : (
        <Card className="section-shell">
          <CardHeader>
            <p className="eyebrow">{copy.calendarPage.generalCalendarEyebrow}</p>
            <CardTitle>{copy.calendarPage.generalCalendarTitle}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted">
            {copy.calendarPage.generalCalendarBody}
          </CardContent>
        </Card>
      )}

      <section className="page-grid">
        <Card className="section-shell">
          <CardHeader>
            <p className="eyebrow">{copy.calendarPage.schoolEyebrow}</p>
            <CardTitle>{schoolCalendar.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-surface-elevated p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-foreground">
                  {calendarMonthView.monthLabel}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {calendarMonthView.eventCount} {copy.calendarPage.calendarGridEventDays}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                {calendarMonthView.weekdayLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-2">
                {calendarMonthView.days.map((day) => (
                  <div
                    key={day.iso}
                    className={[
                      "min-h-16 rounded-[1rem] border px-2 py-2 text-left",
                      day.inCurrentMonth
                        ? "border-border bg-background"
                        : "border-transparent bg-surface text-muted/70",
                      day.isToday ? "ring-1 ring-accent/70" : "",
                      day.events.length > 0 ? "shadow-[0_12px_24px_rgba(31,77,63,0.08)]" : "",
                    ].join(" ")}
                  >
                    <p className="text-xs font-semibold text-foreground">{day.dayLabel}</p>
                    <div className="mt-2 grid gap-1">
                      {day.events.slice(0, 2).map((event) => (
                        <span
                          key={`${day.iso}:${event.symbol}:${event.label}`}
                          className="rounded-full bg-accent-soft px-2 py-1 text-[0.68rem] font-medium leading-4 text-foreground"
                        >
                          {event.symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {upcomingSchoolEvents.map((event) => (
                <div key={`${event.symbol}-${event.event_date}`} className="soft-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {event.event_date}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {event.symbol} · {event.label}
                  </p>
                  {event.notes ? (
                    <p className="mt-1 text-xs leading-5 text-muted">{event.notes}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="section-shell">
          <CardHeader>
            <p className="eyebrow">{copy.calendarPage.paymentsEyebrow}</p>
            <CardTitle>{copy.calendarPage.paymentsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {paymentHighlights.map((event) => (
                <div key={`${event.code}-${event.active_from ?? event.date_range_start}`} className="soft-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {event.academic_period ?? copy.calendarPage.noAcademicPeriod}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {event.code} · {event.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {event.event_date ??
                      (event.date_range_start && event.date_range_end
                        ? `${event.date_range_start} → ${event.date_range_end}`
                        : copy.calendarPage.datePending)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function getMexicoCityTodayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Mexico_City",
    year: "numeric",
  }).format(new Date());
}

function getRelevantSchoolEvents(
  events: SchoolCalendarDocument["events"],
  todayIso: string,
) {
  const upcomingEvents = events
    .filter((event) => compareDateDistance(event.event_date, todayIso) >= 0)
    .sort((left, right) => left.event_date.localeCompare(right.event_date, "en"));
  const recentPastEvents = events
    .filter((event) => compareDateDistance(event.event_date, todayIso) < 0)
    .sort((left, right) => right.event_date.localeCompare(left.event_date, "en"));

  return [...upcomingEvents, ...recentPastEvents];
}

function getRelevantPaymentEvents(
  events: PaymentCalendarDocument["payment_events"],
  todayIso: string,
  preferredAcademicPeriod: string | null,
) {
  const candidateEvents =
    preferredAcademicPeriod !== null
      ? events.filter((event) => academicPeriodMatches(event.academic_period, preferredAcademicPeriod))
      : [];

  const relevantEvents = candidateEvents.length > 0 ? candidateEvents : events;
  const upcomingEvents = relevantEvents
    .filter((event) => compareDateDistance(resolvePaymentAnchor(event), todayIso) >= 0)
    .sort((left, right) =>
      resolvePaymentAnchor(left).localeCompare(resolvePaymentAnchor(right), "en"),
    );
  const recentPastEvents = relevantEvents
    .filter((event) => compareDateDistance(resolvePaymentAnchor(event), todayIso) < 0)
    .sort((left, right) =>
      resolvePaymentAnchor(right).localeCompare(resolvePaymentAnchor(left), "en"),
    );

  return [...upcomingEvents, ...recentPastEvents];
}

function resolvedSelectedAcademicPeriod(label: string | null) {
  if (!label) {
    return null;
  }

  return label
    .replace(/[()]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function academicPeriodMatches(source: string | null, target: string) {
  if (!source) {
    return false;
  }

  const normalizedSource = source.toLocaleUpperCase("es-MX");
  const normalizedTarget = target.toLocaleUpperCase("es-MX");

  return normalizedSource.includes(normalizedTarget) || normalizedTarget.includes(normalizedSource);
}

function resolvePaymentAnchor(event: PaymentCalendarDocument["payment_events"][number]) {
  return event.event_date ?? event.date_range_start ?? event.active_from ?? "9999-12-31";
}

function buildCalendarMonthView(
  focusIso: string,
  events: SchoolCalendarDocument["events"],
  locale: string,
  todayIso: string,
) {
  const [yearPart, monthPart] = focusIso.split("-").map(Number);
  const firstOfMonth = new Date(Date.UTC(yearPart, monthPart - 1, 1));
  const firstWeekday = (firstOfMonth.getUTCDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setUTCDate(gridStart.getUTCDate() - firstWeekday);
  const eventMap = new Map<string, SchoolCalendarDocument["events"]>();

  for (const event of events) {
    const existing = eventMap.get(event.event_date) ?? [];
    existing.push(event);
    eventMap.set(event.event_date, existing);
  }

  const days = Array.from({ length: 35 }, (_, index) => {
    const current = new Date(gridStart);
    current.setUTCDate(gridStart.getUTCDate() + index);
    const iso = current.toISOString().slice(0, 10);

    return {
      dayLabel: current.getUTCDate().toString(),
      events: eventMap.get(iso) ?? [],
      inCurrentMonth: current.getUTCMonth() === firstOfMonth.getUTCMonth(),
      isToday: iso === todayIso,
      iso,
    };
  });

  return {
    days,
    eventCount: days.filter((day) => day.events.length > 0).length,
    monthLabel: new Intl.DateTimeFormat(locale, {
      month: "long",
      timeZone: "UTC",
      year: "numeric",
    }).format(firstOfMonth),
    weekdayLabels: Array.from({ length: 7 }, (_, index) => {
      const date = new Date(Date.UTC(2026, 0, 5 + index));
      return new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        weekday: "short",
      })
        .format(date)
        .replace(/\./gu, "")
        .slice(0, 3);
    }),
  };
}

function compareDateDistance(leftIso: string, rightIso: string) {
  const left = Date.parse(`${leftIso}T00:00:00Z`);
  const right = Date.parse(`${rightIso}T00:00:00Z`);

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return Number.POSITIVE_INFINITY;
  }

  return left - right;
}
