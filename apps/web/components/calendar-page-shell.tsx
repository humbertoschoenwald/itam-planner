"use client";

import { useEffect, useMemo, useState } from "react";

import { TodayClassesCard } from "@/components/today-classes-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSchedulePeriodDetail } from "@/lib/api";
import { getUiCopy } from "@/lib/copy";
import { hasCompletedPlannerBootstrap } from "@/lib/planner-bootstrap";
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
  const [loadedSelectedOfferings, setLoadedSelectedOfferings] = useState<
    Awaited<ReturnType<typeof fetchSchedulePeriodDetail>>["offerings"]
  >([]);
  const todayIso = useMemo(() => getMexicoCityTodayIso(), []);

  const shouldLoadTodayContext =
    plannerState.selectedPeriodId !== null && plannerState.selectedOfferingIds.length > 0;
  const selectedOfferings = shouldLoadTodayContext ? loadedSelectedOfferings : [];

  const onboardingComplete = hasCompletedPlannerBootstrap(profile, plannerWidgetIds, plans);

  useEffect(() => {
    if (!shouldLoadTodayContext || plannerState.selectedPeriodId === null) {
      return;
    }

    let active = true;

    void fetchSchedulePeriodDetail(plannerState.selectedPeriodId)
      .then((detail) => {
        if (!active) {
          return;
        }

        setLoadedSelectedOfferings(
          detail.offerings.filter((offering) =>
            plannerState.selectedOfferingIds.includes(offering.offering_id),
          ),
        );
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setLoadedSelectedOfferings([]);
      });

    return () => {
      active = false;
    };
  }, [plannerState.selectedOfferingIds, plannerState.selectedPeriodId, shouldLoadTodayContext]);

  const upcomingSchoolEvents = useMemo(
    () => getRelevantSchoolEvents(schoolCalendar.events, todayIso).slice(0, 8),
    [schoolCalendar.events, todayIso],
  );
  const paymentHighlights = useMemo(
    () => getRelevantPaymentEvents(paymentCalendar.payment_events, todayIso).slice(0, 6),
    [paymentCalendar.payment_events, todayIso],
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
  return [...events].sort((left, right) => {
    const leftDistance = Math.abs(compareDateDistance(left.event_date, todayIso));
    const rightDistance = Math.abs(compareDateDistance(right.event_date, todayIso));

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }

    return left.event_date.localeCompare(right.event_date, "en");
  });
}

function getRelevantPaymentEvents(
  events: PaymentCalendarDocument["payment_events"],
  todayIso: string,
) {
  return [...events].sort((left, right) => {
    const leftAnchor = left.event_date ?? left.date_range_start ?? left.active_from ?? "9999-12-31";
    const rightAnchor = right.event_date ?? right.date_range_start ?? right.active_from ?? "9999-12-31";
    const leftDistance = Math.abs(compareDateDistance(leftAnchor, todayIso));
    const rightDistance = Math.abs(compareDateDistance(rightAnchor, todayIso));

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }

    return leftAnchor.localeCompare(rightAnchor, "en");
  });
}

function compareDateDistance(leftIso: string, rightIso: string) {
  const left = Date.parse(`${leftIso}T00:00:00Z`);
  const right = Date.parse(`${rightIso}T00:00:00Z`);

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return Number.POSITIVE_INFINITY;
  }

  return left - right;
}
