"use client";

import type { JSX } from "react";
import { useMemo } from "react";

import { TodayClassesCard } from "@/components/today-classes-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { hasCompletedPlannerBootstrap } from "@/lib/presenters/bootstrap-client";
import {
  buildCalendarMonthView,
  buildPaymentEventKey,
  buildSchoolEventKey,
  getCalendarPageDisplayLimits,
  getMexicoCityTodayIso,
  getRelevantPaymentEvents,
  getRelevantSchoolEvents,
  resolveSelectedAcademicPeriod,
} from "@/lib/presenters/calendar-page";
import { useSchedulePeriodDetail } from "@/lib/use-schedule-period-detail";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import type {
  PaymentCalendarDocument,
  SchoolCalendarDocument,
} from "@/lib/types";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type CalendarPageShellProps = {
  paymentCalendar: PaymentCalendarDocument;
  schoolCalendar: SchoolCalendarDocument;
  plans: Parameters<typeof hasCompletedPlannerBootstrap>[2];
}

export function CalendarPageShell({
  paymentCalendar,
  schoolCalendar,
  plans,
}: CalendarPageShellProps): JSX.Element {
  const profile = useStudentProfileStore((state) => state.profile);
  const plannerState = usePlannerStore((state) => state.state);
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const isPhoneViewport = usePhoneViewport();
  const copy = getUiCopy(profile.locale);
  const todayIso = useMemo(() => getMexicoCityTodayIso(), []);
  const displayLimits = useMemo(
    () => getCalendarPageDisplayLimits(isPhoneViewport),
    [isPhoneViewport],
  );

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
    () =>
      getRelevantSchoolEvents(schoolCalendar.events, todayIso).slice(
        0,
        displayLimits.schoolEvents,
      ),
    [displayLimits.schoolEvents, schoolCalendar.events, todayIso],
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
        resolveSelectedAcademicPeriod(selectedPeriodDetail?.label ?? null),
      ).slice(0, displayLimits.paymentEvents),
    [displayLimits.paymentEvents, paymentCalendar.payment_events, selectedPeriodDetail?.label, todayIso],
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell overflow-hidden rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className="hero-grid min-[960px]:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] min-[960px]:items-stretch">
          <div className="space-y-4">
            <p className="eyebrow text-accent">{copy.calendarPage.eyebrow}</p>
            <h1 className="text-balance font-display text-[clamp(1.68rem,6.8vw,4.2rem)] leading-[0.95] text-foreground">
              {copy.calendarPage.title}
            </h1>
            <p className="max-w-3xl text-[0.94rem] leading-5.5 text-muted sm:text-lg sm:leading-7">
              {copy.calendarPage.description}
            </p>
          </div>

          <div className="grid gap-3">
            <div className="soft-panel">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                {copy.calendarPage.schoolEyebrow}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">{schoolCalendar.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {calendarMonthView.monthLabel}
              </p>
            </div>
            <div className="metric-grid">
              <div className="metric-chip">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  {copy.calendarPage.calendarGridEventDays}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {calendarMonthView.eventCount}
                </p>
              </div>
              <div className="metric-chip">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  {copy.calendarPage.paymentsEyebrow}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {paymentHighlights.length}
                </p>
              </div>
            </div>
          </div>
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

      <section className="page-grid min-[820px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] min-[820px]:items-start">
        <Card className="section-shell">
          <CardHeader>
            <p className="eyebrow">{copy.calendarPage.schoolEyebrow}</p>
            <CardTitle className="text-balance font-display text-[clamp(1.55rem,5.8vw,3.15rem)] leading-[0.95]">
              {schoolCalendar.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-hidden rounded-[1.35rem] border border-border bg-surface-elevated p-3 sm:rounded-[1.5rem] sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                <p className="text-sm font-semibold text-foreground">
                  {calendarMonthView.monthLabel}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {calendarMonthView.eventCount} {copy.calendarPage.calendarGridEventDays}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted sm:mt-4 sm:gap-2 sm:text-[0.68rem] sm:tracking-[0.18em]">
                {calendarMonthView.weekdayLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-2">
                {calendarMonthView.days.map((day) => (
                  <div
                    key={day.iso}
                    className={[
                      "calendar-matrix-cell text-left",
                      day.inCurrentMonth
                        ? "border-border bg-background/88"
                        : "border-transparent bg-surface text-muted/70",
                      day.isToday ? "ring-1 ring-accent/70" : "",
                      day.events.length > 0 ? "shadow-[0_12px_24px_rgba(31,77,63,0.08)]" : "",
                    ].join(" ")}
                  >
                    <p className="text-[0.66rem] font-semibold text-foreground sm:text-xs">
                      {day.dayLabel}
                    </p>
                    <div className="mt-1.5 grid gap-1 sm:mt-2">
                      {day.events.slice(0, displayLimits.dayEventBadges).map((event, index) => (
                        <span
                          key={buildSchoolEventKey(event, index, day.iso)}
                          className="calendar-matrix-badge"
                        >
                          {event.symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="list-stack">
              {upcomingSchoolEvents.map((event, index) => (
                <div
                  key={buildSchoolEventKey(event, index)}
                  className="soft-panel px-3.5 py-3 sm:px-4 sm:py-4"
                >
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
            <CardTitle className="text-balance font-display text-[clamp(1.5rem,5.1vw,2.7rem)] leading-[0.97]">
              {copy.calendarPage.paymentsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="list-stack">
              {paymentHighlights.map((event, index) => (
                <div
                  key={buildPaymentEventKey(event, index)}
                  className="soft-panel px-3.5 py-3 sm:px-4 sm:py-4"
                >
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
