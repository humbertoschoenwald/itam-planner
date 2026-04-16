"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CatalogFreshnessCard } from "@/components/catalog-freshness-card";
import { SelectedWeekBoard } from "@/components/selected-week-board";
import { SubjectsPlansCard } from "@/components/subjects-plans-card";
import { TodayClassesCard } from "@/components/today-classes-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSchedulePeriodDetail } from "@/lib/api";
import { getUiCopy } from "@/lib/copy";
import type {
  BulletinSummary,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

const INPUT_CLASS_NAME = "field-shell text-sm";

interface PlannerHomeProps {
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export function PlannerHome({
  plans,
  periods,
  sourcesMetadata,
}: PlannerHomeProps) {
  const profile = useStudentProfileStore((state) => state.profile);
  const copy = getUiCopy(profile.locale);

  const plannerState = usePlannerStore((state) => state.state);
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const setSelectedPeriodId = usePlannerStore((state) => state.setSelectedPeriodId);
  const toggleOfferingId = usePlannerStore((state) => state.toggleOfferingId);
  const resetPlanner = usePlannerStore((state) => state.resetPlanner);
  const [selectedPeriod, setSelectedPeriod] = useState<Awaited<
    ReturnType<typeof fetchSchedulePeriodDetail>
  > | null>(null);
  const [resolvedPeriodId, setResolvedPeriodId] = useState<string | null>(null);
  const [selectedPeriodError, setSelectedPeriodError] = useState<string | null>(null);
  const localeOptions = Object.entries(copy.common.localeLabels).map(([value, label]) => ({
    label,
    value,
  }));

  const defaultPeriodId = periods[0]?.period_id ?? null;
  const activePeriodId = plannerState.selectedPeriodId ?? defaultPeriodId;
  const resolvedSelectedPeriod = resolvedPeriodId === activePeriodId ? selectedPeriod : null;
  const resolvedSelectedPeriodError =
    resolvedPeriodId === activePeriodId ? selectedPeriodError : null;
  const selectedPeriodLoading =
    activePeriodId !== null &&
    resolvedPeriodId !== activePeriodId &&
    resolvedSelectedPeriodError === null;

  useEffect(() => {
    if (!plannerState.selectedPeriodId && defaultPeriodId) {
      setSelectedPeriodId(defaultPeriodId);
    }
  }, [defaultPeriodId, plannerState.selectedPeriodId, setSelectedPeriodId]);

  useEffect(() => {
    if (!activePeriodId) {
      return;
    }

    let active = true;

    void fetchSchedulePeriodDetail(activePeriodId)
      .then((detail) => {
        if (!active) {
          return;
        }
        setResolvedPeriodId(activePeriodId);
        setSelectedPeriod(detail);
        setSelectedPeriodError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setResolvedPeriodId(activePeriodId);
        setSelectedPeriod(null);
        setSelectedPeriodError(copy.plannerHome.selectedPeriodLoadError);
      });

    return () => {
      active = false;
    };
  }, [activePeriodId, copy.plannerHome.selectedPeriodLoadError]);

  const selectedOfferings =
    resolvedSelectedPeriod?.offerings.filter((offering) =>
      plannerState.selectedOfferingIds.includes(offering.offering_id),
    ) ?? [];
  const hasPlannerData =
    plannerState.selectedPeriodId !== null || plannerState.selectedOfferingIds.length > 0;
  const currentLocaleLabel =
    localeOptions.find((option) => option.value === profile.locale)?.label ?? profile.locale;
  const activePeriodLabel =
    periods.find((period) => period.period_id === activePeriodId)?.label ??
    copy.plannerHome.activePeriodFallback;
  const showTodayWidget = plannerWidgetIds.includes("today");
  const showWeekWidget = plannerWidgetIds.includes("week");
  const showSubjectsWidget = plannerWidgetIds.includes("subjects");

  const heroMetrics = [
    { label: copy.plannerHome.plansMetric, value: String(plans.length) },
    { label: copy.plannerHome.periodsMetric, value: String(periods.length) },
    { label: copy.plannerHome.groupsSelected, value: String(selectedOfferings.length) },
    { label: copy.plannerHome.currentLocale, value: currentLocaleLabel },
  ] as const;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="overflow-hidden rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_30px_90px_rgba(40,43,24,0.08)] sm:p-8">
        <div className="hero-grid">
          <div className="space-y-5">
            <p className="eyebrow text-accent">{copy.plannerHome.title}</p>
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">
                {copy.plannerHome.plannerTitle}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                {copy.plannerHome.intro}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/planner/onboarding" prefetch={false}>
                  {copy.plannerHome.updateOnboarding}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/calendar" prefetch={false}>
                  {copy.common.calendar}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/" prefetch={false}>
                  {copy.common.home}
                </Link>
              </Button>
            </div>

            <div className="metric-grid">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="metric-chip">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-accent rounded-[1.9rem] border border-white/10 px-5 py-5 shadow-[0_24px_50px_rgba(18,40,33,0.26)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-inverse-muted">
              {copy.plannerHome.surfaceEyebrow}
            </p>
            <p className="mt-3 text-sm leading-6 text-inverse-muted">
              {copy.plannerHome.surfaceBody}
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-inverse-muted">
                <p className="font-semibold text-accent-contrast">{copy.plannerHome.noAccountRequired}</p>
                <p className="mt-2">{copy.plannerHome.noAccountRequiredText}</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-4 text-sm leading-6 text-inverse-muted">
                <p className="font-semibold text-accent-contrast">{copy.plannerHome.browserOnlyLabel}</p>
                <p className="mt-2">{copy.plannerHome.browserOnlyText}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {copy.plannerHome.timeline.map((step, index) => (
                <div key={step.title} className="rounded-2xl bg-white/8 p-4 text-sm leading-6 text-inverse-muted">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-inverse-muted">
                    0{index + 1}
                  </p>
                  <p className="mt-2 font-semibold text-accent-contrast">{step.title}</p>
                  <p className="mt-2">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-grid">
        <Card>
          <CardHeader>
            <p className="eyebrow">{copy.plannerHome.step1}</p>
            <CardTitle>{copy.plannerHome.plannerShell}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="soft-panel">
              <p className="font-semibold text-foreground">{activePeriodLabel}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{copy.plannerHome.activePeriodTitle}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="period">
                {copy.plannerHome.period}
              </label>
              <select
                id="period"
                className={INPUT_CLASS_NAME}
                onChange={(event) => setSelectedPeriodId(event.target.value)}
                value={activePeriodId ?? ""}
              >
                <option value="">{copy.plannerHome.selectPeriod}</option>
                {periods.map((period) => (
                  <option key={period.period_id} value={period.period_id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedPeriodLoading ? (
              <p className="text-sm text-muted">{copy.plannerHome.selectedPeriodLoading}</p>
            ) : resolvedSelectedPeriodError ? (
              <p className="text-sm text-muted">{resolvedSelectedPeriodError}</p>
            ) : resolvedSelectedPeriod ? (
              <>
                <div className="rounded-[1.35rem] bg-surface-strong px-4 py-3 text-sm text-foreground">
                  <p className="font-semibold">{resolvedSelectedPeriod.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {copy.plannerHome.plannerShellHelp}
                  </p>
                </div>

                <div className="grid gap-3">
                  {resolvedSelectedPeriod.offerings.map((offering) => {
                    const checked = plannerState.selectedOfferingIds.includes(offering.offering_id);
                    return (
                      <label
                        key={offering.offering_id}
                        className="choice-card cursor-pointer items-start text-sm"
                      >
                        <input
                          checked={checked}
                          className="mt-1 h-4 w-4 accent-accent"
                          onChange={() => toggleOfferingId(offering.offering_id)}
                          type="checkbox"
                        />
                        <span>
                          <span className="block font-semibold text-foreground">
                            {offering.course_code} · {copy.plannerHome.groupLabel}{" "}
                            {offering.group_code}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted">
                            {offering.display_title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted">
                            {offering.instructor_name ?? copy.plannerHome.offeredBy} ·{" "}
                            {offering.room_code ?? copy.plannerHome.roomPending}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">
                    {copy.plannerHome.groupsSelected}: {selectedOfferings.length}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {selectedOfferings.length > 0 ? (
                      selectedOfferings.map((offering) => (
                        <div
                          key={offering.offering_id}
                          className="rounded-[1.15rem] bg-background px-3 py-3 text-xs leading-5 text-muted"
                        >
                          <span className="font-semibold text-foreground">
                            {offering.course_code} · {offering.group_code}
                          </span>
                          <span className="mt-1 block">
                            {offering.meetings
                              .map(
                                (meeting) =>
                                  `${meeting.weekday_code} ${meeting.start_time.slice(0, 5)}-${meeting.end_time.slice(0, 5)}`,
                              )
                              .join(" · ")}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted">
                        {copy.plannerHome.selectAtLeastOne}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted">
                {copy.plannerHome.noPeriodData}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => resetPlanner()} variant="secondary">
                {copy.plannerHome.resetPlanner}
              </Button>
              <span className="rounded-full border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-muted">
                {hasPlannerData ? copy.plannerHome.plannerExists : copy.plannerHome.noPlannerData}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="page-grid">
        {showTodayWidget ? <TodayClassesCard locale={profile.locale} offerings={selectedOfferings} /> : null}
        <CatalogFreshnessCard
          isLoading={false}
          locale={profile.locale}
          metadata={sourcesMetadata}
        />
      </section>

      <section className="page-grid">
        {showWeekWidget ? <SelectedWeekBoard locale={profile.locale} offerings={selectedOfferings} /> : null}
        {showSubjectsWidget ? (
          <SubjectsPlansCard
            locale={profile.locale}
            offerings={selectedOfferings}
            plans={plans}
            selectedPlanIds={profile.activePlanIds}
          />
        ) : null}
      </section>
    </main>
  );
}
