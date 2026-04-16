"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSchedulePeriodDetail } from "@/lib/api";
import { clearPlannerBrowserState } from "@/lib/browser-state";
import { getUiCopy } from "@/lib/copy";
import { filterPeriodsForAcademicLevel, formatSchedulePeriodLabel } from "@/lib/onboarding";
import {
  buildSubjectDirectory,
  buildSelectedSubjectSummary,
  searchSubjectDirectory,
} from "@/lib/planner-subjects";
import { getProductCopy } from "@/lib/product-copy";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import type { BulletinDocument, SchedulePeriodSummary } from "@/lib/types";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

interface PlannerSettingsShellProps {
  bulletinDocuments: BulletinDocument[];
  periods: SchedulePeriodSummary[];
}

const INPUT_CLASS_NAME = "field-shell text-sm";

export function PlannerSettingsShell({
  bulletinDocuments,
  periods,
}: PlannerSettingsShellProps) {
  const profile = useStudentProfileStore((state) => state.profile);
  const locale = profile.locale;
  const copy = getUiCopy(locale);
  const productCopy = getProductCopy(locale);
  const plannerState = usePlannerStore((state) => state.state);
  const plannerUi = usePlannerUiStore((state) => state.state);
  const resetProfile = useStudentProfileStore((state) => state.resetProfile);
  const resetPlanner = usePlannerStore((state) => state.resetPlanner);
  const resetPlannerUi = usePlannerUiStore((state) => state.resetPlannerUi);
  const setNavSwipePreference = usePlannerUiStore((state) => state.setNavSwipePreference);
  const setSelectedPeriodId = usePlannerStore((state) => state.setSelectedPeriodId);
  const toggleOfferingId = usePlannerStore((state) => state.toggleOfferingId);
  const toggleSubjectCode = usePlannerStore((state) => state.toggleSubjectCode);
  const isPhoneViewport = usePhoneViewport();
  const [query, setQuery] = useState("");
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
  const activePlanDocs = useMemo(
    () => bulletinDocuments.filter((document) => profile.activePlanIds.includes(document.plan_id)),
    [bulletinDocuments, profile.activePlanIds],
  );
  const recommendedDirectory = useMemo(() => buildSubjectDirectory(activePlanDocs), [activePlanDocs]);
  const fullDirectory = useMemo(() => buildSubjectDirectory(bulletinDocuments), [bulletinDocuments]);
  const visibleDirectory = useMemo(
    () =>
      (query.trim() ? searchSubjectDirectory(fullDirectory, query) : recommendedDirectory).filter(
        (entry) => !plannerState.selectedSubjectCodes.includes(entry.courseCode),
      ),
    [fullDirectory, plannerState.selectedSubjectCodes, query, recommendedDirectory],
  );
  const selectedSubjects = useMemo(
    () => buildSelectedSubjectSummary(plannerState.selectedSubjectCodes, fullDirectory),
    [fullDirectory, plannerState.selectedSubjectCodes],
  );
  const resolvedSelectedPeriod = resolvedPeriodId === activePeriodId ? selectedPeriod : null;
  const resolvedSelectedPeriodError =
    resolvedPeriodId === activePeriodId ? selectedPeriodError : null;
  const selectedPeriodLoading =
    activePeriodId !== null &&
    resolvedPeriodId !== activePeriodId &&
    resolvedSelectedPeriodError === null;
  const visibleOfferings = useMemo(
    () =>
      resolvedSelectedPeriod?.offerings.filter(
        (offering) =>
          plannerState.selectedSubjectCodes.length === 0 ||
          plannerState.selectedSubjectCodes.includes(offering.course_code),
      ) ?? [],
    [plannerState.selectedSubjectCodes, resolvedSelectedPeriod],
  );
  const selectedOfferings =
    resolvedSelectedPeriod?.offerings.filter((offering) =>
      plannerState.selectedOfferingIds.includes(offering.offering_id),
    ) ?? [];
  const activePeriodLabel =
    filteredPeriods.find((period) => period.period_id === activePeriodId)?.label ??
    copy.plannerHome.activePeriodFallback;

  useEffect(() => {
    const validPeriodIds = new Set(filteredPeriods.map((period) => period.period_id));

    if ((!plannerState.selectedPeriodId || !validPeriodIds.has(plannerState.selectedPeriodId)) && defaultPeriodId) {
      setSelectedPeriodId(defaultPeriodId);
    }
  }, [defaultPeriodId, filteredPeriods, plannerState.selectedPeriodId, setSelectedPeriodId]);

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
        setSelectedPeriodError(productCopy.plannerSettings.scheduleLoadError);
      });

    return () => {
      active = false;
    };
  }, [activePeriodId, productCopy.plannerSettings.scheduleLoadError]);

  function handleReset() {
    if (!window.confirm(productCopy.plannerSettings.resetConfirm)) {
      return;
    }

    clearPlannerBrowserState();
    resetPlanner();
    resetPlannerUi();
    resetProfile();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="space-y-3">
        <Link
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          href="/planner"
          prefetch={false}
        >
          {copy.common.backToPlanner}
        </Link>
        <p className="eyebrow">{productCopy.plannerSettings.eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {productCopy.plannerSettings.title}
        </h1>
      </div>

      <div className="hero-grid">
        {isPhoneViewport ? (
          <Card>
            <CardHeader>
              <CardTitle>{productCopy.plannerSettings.swipeTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted">
              <p>{productCopy.plannerSettings.swipeBody}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["natural", "inverted"] as const).map((preference) => (
                  <button
                    key={preference}
                    aria-pressed={plannerUi.navSwipePreference === preference}
                    className={[
                      "choice-card text-left",
                      plannerUi.navSwipePreference === preference
                        ? "border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]"
                        : "",
                    ].join(" ")}
                    onClick={() => setNavSwipePreference(preference)}
                    type="button"
                  >
                    <span className="block font-semibold text-foreground">
                      {copy.plannerOnboarding.swipeOptions[preference].title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted">
                      {copy.plannerOnboarding.swipeOptions[preference].body}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>{productCopy.plannerSettings.resetButton}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted">
            <p>{productCopy.plannerSettings.resetBody}</p>
            <div className="soft-panel">
              <p className="font-semibold text-foreground">
                {formatSchedulePeriodLabel(activePeriodLabel)}
              </p>
              <p className="mt-2 text-sm text-muted">
                {copy.plannerHome.entryTerm}:{" "}
                {profile.entryTerm || copy.plannerOnboarding.finishSummary.pending}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleReset} variant="secondary">
                {productCopy.plannerSettings.resetButton}
              </Button>
              <Button asChild>
                <Link href="/planner/onboarding" prefetch={false}>
                  {copy.plannerHome.updateOnboarding}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{productCopy.plannerSettings.scheduleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-6 text-muted">{productCopy.plannerSettings.scheduleBody}</p>

          <label className="space-y-3">
            <span className="text-sm font-medium text-foreground">{copy.plannerHome.period}</span>
            <select
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

          {selectedPeriodLoading ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {productCopy.plannerSettings.scheduleLoading}
            </div>
          ) : resolvedSelectedPeriodError ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {resolvedSelectedPeriodError}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="grid gap-3">
                <p className="text-sm font-medium text-foreground">
                  {formatSchedulePeriodLabel(activePeriodLabel)}
                </p>
                {visibleOfferings.length > 0 ? (
                  visibleOfferings.map((offering) => {
                    const selected = plannerState.selectedOfferingIds.includes(offering.offering_id);

                    return (
                      <button
                        key={offering.offering_id}
                        aria-pressed={selected}
                        className={[
                          "choice-card text-left",
                          selected
                            ? "border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]"
                            : "",
                        ].join(" ")}
                        onClick={() => toggleOfferingId(offering.offering_id)}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="block font-semibold text-foreground">
                              {offering.course_code} · {copy.plannerHome.groupLabel}{" "}
                              {offering.group_code}
                            </span>
                            <span className="mt-1 block text-sm leading-6 text-muted">
                              {offering.display_title}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted">
                              {offering.instructor_name ?? copy.plannerHome.offeredBy} ·{" "}
                              {offering.room_code ?? copy.plannerHome.roomPending}
                            </span>
                          </div>
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
                              selected
                                ? "bg-accent text-accent-contrast"
                                : "bg-surface-elevated text-muted",
                            ].join(" ")}
                          >
                            {selected
                              ? productCopy.plannerSettings.selectedSubjectBadge
                              : productCopy.plannerSettings.availableSubjectBadge}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="soft-panel text-sm leading-6 text-muted">
                    {productCopy.plannerSettings.scheduleEmpty}
                  </div>
                )}
              </div>

              <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4">
                <p className="text-sm font-semibold text-foreground">
                  {productCopy.plannerSettings.selectedOfferingsTitle}: {selectedOfferings.length}
                </p>
                <div className="mt-3 grid gap-2">
                  {selectedOfferings.length > 0 ? (
                    selectedOfferings.map((offering) => (
                      <div
                        key={offering.offering_id}
                        className="rounded-[1.15rem] border border-accent/30 bg-accent-soft px-3 py-3 text-xs leading-5 text-muted"
                      >
                        <span className="font-semibold text-foreground">
                          {offering.course_code} · {offering.group_code}
                        </span>
                        <span className="mt-1 block">{offering.display_title}</span>
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
                      {productCopy.plannerSettings.selectedOfferingsEmpty}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{productCopy.plannerSettings.subjectsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-6 text-muted">{productCopy.plannerSettings.subjectsBody}</p>

          <label className="space-y-3">
            <span className="text-sm font-medium text-foreground">
              {productCopy.plannerSettings.subjectsSearch}
            </span>
            <input
              className="field-shell text-sm"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={productCopy.plannerSettings.subjectsSearch}
              type="search"
              value={query}
            />
          </label>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerSettings.subjectsSelectedTitle}
            </p>
            {selectedSubjects.length === 0 ? (
              <div className="soft-panel text-sm leading-6 text-muted">
                {productCopy.plannerSettings.subjectsEmpty}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedSubjects.map((entry) => (
                  <button
                    key={entry.courseCode}
                    aria-pressed
                    className="choice-card text-left border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]"
                    onClick={() => toggleSubjectCode(entry.courseCode)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="block font-semibold text-foreground">
                          {entry.courseCode}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-muted">
                          {entry.title}
                        </span>
                      </div>
                      <span className="rounded-full bg-accent px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent-contrast">
                        {productCopy.plannerSettings.selectedSubjectBadge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {query.trim()
                ? productCopy.common.search
                : productCopy.plannerSettings.subjectsDefaultTitle}
            </p>
            {visibleDirectory.length === 0 ? (
              <div className="soft-panel text-sm leading-6 text-muted">
                {productCopy.plannerSettings.subjectsEmpty}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleDirectory.map((entry) => (
                  <button
                    key={entry.courseCode}
                    className="choice-card text-left"
                    onClick={() => toggleSubjectCode(entry.courseCode)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="block font-semibold text-foreground">
                          {entry.courseCode}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-muted">
                          {entry.title}
                        </span>
                      </div>
                      <span className="rounded-full bg-surface-elevated px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        {productCopy.plannerSettings.availableSubjectBadge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
