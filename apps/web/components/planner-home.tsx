"use client";

import { useEffect, useMemo, useState } from "react";

import { SelectedWeekBoard } from "@/components/selected-week-board";
import { SubjectsPlansCard } from "@/components/subjects-plans-card";
import { TodayClassesCard } from "@/components/today-classes-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSchedulePeriodDetail } from "@/lib/api";
import { getUiCopy } from "@/lib/copy";
import {
  filterPeriodsForAcademicLevel,
  formatSchedulePeriodLabel,
} from "@/lib/onboarding";
import {
  buildRecommendedSubjectCodes,
  buildSubjectDirectory,
  estimateSemesterNumber,
} from "@/lib/planner-subjects";
import { getProductCopy } from "@/lib/product-copy";
import type {
  BulletinDocument,
  BulletinSummary,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

const INPUT_CLASS_NAME = "field-shell text-sm";

interface PlannerHomeProps {
  bulletinDocuments: BulletinDocument[];
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export function PlannerHome({
  bulletinDocuments,
  plans,
  periods,
  sourcesMetadata: _sourcesMetadata,
}: PlannerHomeProps) {
  void _sourcesMetadata;

  const profile = useStudentProfileStore((state) => state.profile);
  const copy = getUiCopy(profile.locale);
  const productCopy = getProductCopy(profile.locale);
  const plannerState = usePlannerStore((state) => state.state);
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const setSelectedOfferingIds = usePlannerStore((state) => state.setSelectedOfferingIds);
  const setSelectedPeriodId = usePlannerStore((state) => state.setSelectedPeriodId);
  const setSelectedSubjectCodes = usePlannerStore((state) => state.setSelectedSubjectCodes);
  const toggleOfferingId = usePlannerStore((state) => state.toggleOfferingId);
  const [selectedPeriod, setSelectedPeriod] = useState<Awaited<
    ReturnType<typeof fetchSchedulePeriodDetail>
  > | null>(null);
  const [resolvedPeriodId, setResolvedPeriodId] = useState<string | null>(null);
  const [selectedPeriodError, setSelectedPeriodError] = useState<string | null>(null);

  const filteredPeriods = useMemo(
    () => filterPeriodsForAcademicLevel(periods, profile.academicLevel),
    [periods, profile.academicLevel],
  );
  const defaultPeriodId = filteredPeriods[0]?.period_id ?? null;
  const activePeriodId = filteredPeriods.some(
    (period) => period.period_id === plannerState.selectedPeriodId,
  )
    ? plannerState.selectedPeriodId
    : defaultPeriodId;
  const activePeriodSummary =
    filteredPeriods.find((period) => period.period_id === activePeriodId) ?? null;
  const activePlanDocuments = useMemo(
    () => bulletinDocuments.filter((document) => profile.activePlanIds.includes(document.plan_id)),
    [bulletinDocuments, profile.activePlanIds],
  );
  const estimatedSemester = useMemo(
    () => estimateSemesterNumber(profile.entryTerm, activePeriodSummary),
    [activePeriodSummary, profile.entryTerm],
  );
  const recommendedSubjectCodes = useMemo(
    () => buildRecommendedSubjectCodes(activePlanDocuments, estimatedSemester),
    [activePlanDocuments, estimatedSemester],
  );
  const fullSubjectDirectory = useMemo(
    () => buildSubjectDirectory(bulletinDocuments),
    [bulletinDocuments],
  );
  const effectiveSubjectCodes =
    plannerState.selectedSubjectCodes.length > 0
      ? plannerState.selectedSubjectCodes
      : recommendedSubjectCodes;
  const selectedSubjectEntries = fullSubjectDirectory.filter((entry) =>
    effectiveSubjectCodes.includes(entry.courseCode),
  );
  const resolvedSelectedPeriod = resolvedPeriodId === activePeriodId ? selectedPeriod : null;
  const resolvedSelectedPeriodError =
    resolvedPeriodId === activePeriodId ? selectedPeriodError : null;
  const selectedPeriodLoading =
    activePeriodId !== null &&
    resolvedPeriodId !== activePeriodId &&
    resolvedSelectedPeriodError === null;

  useEffect(() => {
    const validPeriodIds = new Set(filteredPeriods.map((period) => period.period_id));

    if ((!plannerState.selectedPeriodId || !validPeriodIds.has(plannerState.selectedPeriodId)) && defaultPeriodId) {
      setSelectedPeriodId(defaultPeriodId);
    }
  }, [defaultPeriodId, filteredPeriods, plannerState.selectedPeriodId, setSelectedPeriodId]);

  useEffect(() => {
    if (plannerState.selectedSubjectCodes.length > 0 || recommendedSubjectCodes.length === 0) {
      return;
    }

    setSelectedSubjectCodes(recommendedSubjectCodes);
  }, [
    plannerState.selectedSubjectCodes.length,
    recommendedSubjectCodes,
    setSelectedSubjectCodes,
  ]);

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

  const visibleOfferings = useMemo(
    () =>
      resolvedSelectedPeriod?.offerings.filter(
        (offering) =>
          effectiveSubjectCodes.length === 0 ||
          effectiveSubjectCodes.includes(offering.course_code),
      ) ?? [],
    [effectiveSubjectCodes, resolvedSelectedPeriod],
  );

  useEffect(() => {
    if (plannerState.selectedOfferingIds.length > 0 || visibleOfferings.length === 0) {
      return;
    }

    const defaultOfferingIds = [...new Set(visibleOfferings.map((offering) => offering.course_code))]
      .map(
        (courseCode) =>
          visibleOfferings.find((offering) => offering.course_code === courseCode)?.offering_id ?? null,
      )
      .filter((offeringId): offeringId is string => typeof offeringId === "string");

    if (defaultOfferingIds.length > 0) {
      setSelectedOfferingIds(defaultOfferingIds);
    }
  }, [plannerState.selectedOfferingIds.length, setSelectedOfferingIds, visibleOfferings]);

  const selectedOfferings =
    resolvedSelectedPeriod?.offerings.filter((offering) =>
      plannerState.selectedOfferingIds.includes(offering.offering_id),
    ) ?? [];
  const activePeriodLabel =
    formatSchedulePeriodLabel(
      filteredPeriods.find((period) => period.period_id === activePeriodId)?.label ??
        copy.plannerHome.activePeriodFallback,
    );
  const showTodayWidget = plannerWidgetIds.includes("today");
  const showWeekWidget = plannerWidgetIds.includes("week");
  const showSubjectsWidget = plannerWidgetIds.includes("subjects");

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="page-grid">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle>{copy.common.planner}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <label className="space-y-3">
                <span className="text-sm font-medium text-foreground">{copy.plannerHome.period}</span>
                <select
                  id="period"
                  className={INPUT_CLASS_NAME}
                  onChange={(event) => setSelectedPeriodId(event.target.value)}
                  value={activePeriodId ?? ""}
                >
                  <option value="">{copy.plannerHome.selectPeriod}</option>
                  {filteredPeriods.map((period) => (
                    <option key={period.period_id} value={period.period_id}>
                      {formatSchedulePeriodLabel(period.label)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  {productCopy.plannerPage.filteredSubjectsTitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSubjectEntries.length > 0 ? (
                    selectedSubjectEntries.map((entry) => (
                      <span
                        key={entry.courseCode}
                        className="rounded-full border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-foreground"
                      >
                        {entry.courseCode}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-muted">
                      {productCopy.plannerPage.filteredSubjectsEmpty}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedPeriodLoading ? (
              <p className="text-sm text-muted">{copy.plannerHome.selectedPeriodLoading}</p>
            ) : resolvedSelectedPeriodError ? (
              <p className="text-sm text-muted">{resolvedSelectedPeriodError}</p>
            ) : resolvedSelectedPeriod ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="grid gap-3">
                  <p className="text-sm font-medium text-foreground">{activePeriodLabel}</p>
                  {visibleOfferings.length > 0 ? (
                    visibleOfferings.map((offering) => {
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
                              {offering.course_code} · {copy.plannerHome.groupLabel} {offering.group_code}
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
                    })
                  ) : (
                    <div className="soft-panel text-sm leading-6 text-muted">
                      {productCopy.plannerPage.filteredSubjectsEmpty}
                    </div>
                  )}
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
                      <p className="text-xs text-muted">{copy.plannerHome.selectAtLeastOne}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">{copy.plannerHome.noPeriodData}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="page-grid">
        {showTodayWidget ? (
          <TodayClassesCard locale={profile.locale} offerings={selectedOfferings} />
        ) : null}
        {showWeekWidget ? (
          <SelectedWeekBoard locale={profile.locale} offerings={selectedOfferings} />
        ) : null}
      </section>

      {showSubjectsWidget ? (
        <section className="page-grid">
          <SubjectsPlansCard
            locale={profile.locale}
            offerings={selectedOfferings}
            plans={plans}
            selectedPlanIds={profile.activePlanIds}
          />
        </section>
      ) : null}
    </main>
  );
}
