"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { buildSubjectDirectory, buildSelectedSubjectSummary, searchSubjectDirectory } from "@/lib/planner-subjects";
import { getProductCopy } from "@/lib/product-copy";
import type { BulletinDocument, SchedulePeriodSummary } from "@/lib/types";
import { clearPlannerBrowserState } from "@/lib/browser-state";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";
import { usePhoneViewport } from "@/lib/use-phone-viewport";

interface PlannerSettingsShellProps {
  bulletinDocuments: BulletinDocument[];
  periods: SchedulePeriodSummary[];
}

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
  const toggleSubjectCode = usePlannerStore((state) => state.toggleSubjectCode);
  const isPhoneViewport = usePhoneViewport();
  const [query, setQuery] = useState("");

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
  const activePeriodLabel =
    periods.find((period) => period.period_id === plannerState.selectedPeriodId)?.label ??
    copy.plannerHome.activePeriodFallback;

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
              <p className="font-semibold text-foreground">{activePeriodLabel}</p>
              <p className="mt-2 text-sm text-muted">{copy.plannerHome.entryTerm}: {profile.entryTerm || copy.plannerOnboarding.finishSummary.pending}</p>
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
                    className="choice-card text-left border-accent bg-surface-hover"
                    onClick={() => toggleSubjectCode(entry.courseCode)}
                    type="button"
                  >
                    <span className="block font-semibold text-foreground">
                      {entry.courseCode}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted">{entry.title}</span>
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
                {visibleDirectory.map((entry) => {
                  const selected = plannerState.selectedSubjectCodes.includes(entry.courseCode);
                  return (
                    <button
                      key={entry.courseCode}
                      className={[
                        "choice-card text-left",
                        selected ? "border-accent bg-surface-hover" : "",
                      ].join(" ")}
                      onClick={() => toggleSubjectCode(entry.courseCode)}
                      type="button"
                    >
                      <span className="block font-semibold text-foreground">{entry.courseCode}</span>
                      <span className="mt-2 block text-sm leading-6 text-muted">{entry.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
