"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import {
  buildEntryTerm,
  type EntryTermSeasonKey,
  ENTRY_TERM_SEASON_KEYS,
  filterPlansForEntryTerm,
  getEntryTermYearOptions,
  parseEntryTerm,
} from "@/lib/onboarding";
import { hasCompletedPlannerBootstrap } from "@/lib/planner-bootstrap";
import type { BulletinSummary, PlannerWidgetId } from "@/lib/types";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { PLANNER_WIDGET_IDS, usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type PlannerOnboardingStep = "season" | "year" | "plans" | "locale" | "widgets";

const WIZARD_STEPS: PlannerOnboardingStep[] = ["season", "year", "plans", "locale", "widgets"];
const INPUT_CLASS_NAME = "field-shell text-sm";

interface PlannerOnboardingWizardProps {
  plans: BulletinSummary[];
}

export function PlannerOnboardingWizard({ plans }: PlannerOnboardingWizardProps) {
  useSyncStudentCode();

  const router = useRouter();
  const profile = useStudentProfileStore((state) => state.profile);
  const setActivePlanIds = useStudentProfileStore((state) => state.setActivePlanIds);
  const setEntryTerm = useStudentProfileStore((state) => state.setEntryTerm);
  const setLocale = useStudentProfileStore((state) => state.setLocale);
  const togglePlan = useStudentProfileStore((state) => state.toggleActivePlanId);
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const togglePlannerWidgetId = usePlannerUiStore((state) => state.togglePlannerWidgetId);
  const copy = getUiCopy(profile.locale);

  const [entryTermDraft, setEntryTermDraft] = useState(parseEntryTerm(profile.entryTerm));
  const [currentStep, setCurrentStep] = useState<PlannerOnboardingStep>(
    getInitialWizardStep(profile.entryTerm, profile.activePlanIds, plans),
  );
  const [showValidation, setShowValidation] = useState(false);

  const yearOptions = getEntryTermYearOptions(plans);
  const localeOptions = Object.entries(copy.common.localeLabels).map(([value, label]) => ({
    label,
    value,
  }));
  const draftEntryTerm = buildEntryTerm(entryTermDraft.seasonKey, entryTermDraft.year);
  const visiblePlans = filterPlansForEntryTerm(plans, draftEntryTerm);
  const canShowPlans = draftEntryTerm.length > 0;
  const activeVisiblePlanCount = profile.activePlanIds.filter((planId) =>
    visiblePlans.some((plan) => plan.plan_id === planId),
  ).length;
  const onboardingComplete = hasCompletedPlannerBootstrap(profile, plannerWidgetIds, plans);
  const [redirectIfAlreadyComplete] = useState(onboardingComplete);

  useEffect(() => {
    if (redirectIfAlreadyComplete && onboardingComplete) {
      router.replace("/planner");
    }
  }, [onboardingComplete, redirectIfAlreadyComplete, router]);

  useEffect(() => {
    const visiblePlanIds = new Set(visiblePlans.map((plan) => plan.plan_id));

    if (profile.activePlanIds.every((planId) => visiblePlanIds.has(planId))) {
      return;
    }

    setActivePlanIds(profile.activePlanIds.filter((planId) => visiblePlanIds.has(planId)));
  }, [profile.activePlanIds, setActivePlanIds, visiblePlans]);

  const progressIndex = WIZARD_STEPS.indexOf(currentStep);
  const isLastStep = progressIndex === WIZARD_STEPS.length - 1;

  function handleEntrySeasonChange(nextSeasonKey: EntryTermSeasonKey | "") {
    const nextDraft = { ...entryTermDraft, seasonKey: nextSeasonKey };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setShowValidation(false);
  }

  function handleEntryYearChange(nextYear: string) {
    const nextDraft = {
      ...entryTermDraft,
      year: yearOptions.includes(nextYear) ? nextYear : "",
    };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setShowValidation(false);
  }

  function handleNext() {
    if (
      !isStepValid(
        currentStep,
        entryTermDraft,
        activeVisiblePlanCount,
        plannerWidgetIds,
        yearOptions,
      )
    ) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);

    if (isLastStep) {
      router.push("/planner");
      return;
    }

    setCurrentStep(WIZARD_STEPS[progressIndex + 1] ?? currentStep);
  }

  function handleBack() {
    if (progressIndex === 0) {
      router.push("/");
      return;
    }

    setShowValidation(false);
    setCurrentStep(WIZARD_STEPS[progressIndex - 1] ?? currentStep);
  }

  let stepContent: React.ReactNode;

  switch (currentStep) {
    case "season":
      stepContent = (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.entrySeasonTitle}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {copy.plannerOnboarding.entrySeasonBody}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ENTRY_TERM_SEASON_KEYS.map((seasonKey) => (
              <button
                key={seasonKey}
                className={[
                  "choice-card text-left",
                  entryTermDraft.seasonKey === seasonKey ? "border-accent bg-surface-hover" : "",
                ].join(" ")}
                onClick={() => handleEntrySeasonChange(seasonKey)}
                type="button"
              >
                <span className="block font-semibold text-foreground">
                  {copy.onboardingPage.seasonOptions[seasonKey]}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
      break;
    case "year":
      stepContent = (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.entryYearTitle}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {copy.plannerOnboarding.entryYearBody}
            </p>
          </div>
          <select
            aria-invalid={showValidation && entryTermDraft.year.length === 0}
            className={INPUT_CLASS_NAME}
            onChange={(event) => handleEntryYearChange(event.target.value)}
            value={entryTermDraft.year}
          >
            <option value="">{copy.onboardingPage.selectYear}</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      );
      break;
    case "plans":
      stepContent = (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.activePlansTitle}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {copy.plannerOnboarding.activePlansBody}
            </p>
          </div>
          {!canShowPlans ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {copy.onboardingPage.plansLockedBody}
            </div>
          ) : visiblePlans.length === 0 ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {copy.onboardingPage.noPlansForTermBody}
            </div>
          ) : (
            <div className="grid gap-3">
              {visiblePlans.map((plan) => {
                const checked = profile.activePlanIds.includes(plan.plan_id);
                return (
                  <label key={plan.bulletin_id} className="choice-card cursor-pointer items-start text-sm">
                    <input
                      checked={checked}
                      className="mt-1 h-4 w-4 accent-accent"
                      onChange={() => togglePlan(plan.plan_id)}
                      type="checkbox"
                    />
                    <span>
                      <span className="block font-semibold text-foreground">
                        {plan.program_title} · {plan.plan_code}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted">{plan.title}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      );
      break;
    case "locale":
      stepContent = (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.localeTitle}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {copy.plannerOnboarding.localeBody}
            </p>
          </div>
          <select
            className={INPUT_CLASS_NAME}
            onChange={(event) => setLocale(event.target.value as "es-MX" | "en")}
            value={profile.locale}
          >
            {localeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
      break;
    case "widgets":
      stepContent = (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.widgetsTitle}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {copy.plannerOnboarding.widgetsBody}
            </p>
          </div>
          <div className="grid gap-3">
            {PLANNER_WIDGET_IDS.map((widgetId) => {
              const checked = plannerWidgetIds.includes(widgetId);
              return (
                <label key={widgetId} className="choice-card cursor-pointer items-start text-sm">
                  <input
                    checked={checked}
                    className="mt-1 h-4 w-4 accent-accent"
                    onChange={() => togglePlannerWidgetId(widgetId)}
                    type="checkbox"
                  />
                  <span>
                    <span className="block font-semibold text-foreground">
                      {copy.plannerOnboarding.widgetLabels[widgetId]}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted">
                      {copy.plannerOnboarding.widgetDescriptions[widgetId]}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      );
      break;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <Card className="section-shell">
        <CardHeader>
          <p className="eyebrow">{copy.plannerOnboarding.eyebrow}</p>
          <CardTitle>{copy.plannerOnboarding.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="soft-panel">
            <p className="font-semibold text-foreground">{copy.plannerOnboarding.swipeTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{copy.plannerOnboarding.swipeBody}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {WIZARD_STEPS.map((step, index) => (
              <span
                key={step}
                className={[
                  "rounded-full px-3 py-2 text-xs font-medium",
                  index <= progressIndex
                    ? "bg-accent-soft text-accent"
                    : "border border-border bg-surface-elevated text-muted",
                ].join(" ")}
              >
                0{index + 1}
              </span>
            ))}
          </div>

          {stepContent}

          {showValidation ? (
            <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4 text-sm leading-6 text-muted">
              <p className="font-semibold text-foreground">{copy.onboardingPage.validationTitle}</p>
              <p className="mt-2">{copy.onboardingPage.validationBody}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleBack} variant="secondary">
              {copy.plannerOnboarding.back}
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? copy.plannerOnboarding.openPlanner : copy.plannerOnboarding.next}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function getInitialWizardStep(
  entryTerm: string,
  activePlanIds: string[],
  plans: BulletinSummary[],
): PlannerOnboardingStep {
  const parsedEntryTerm = parseEntryTerm(entryTerm);

  if (!parsedEntryTerm.seasonKey) {
    return "season";
  }

  if (!parsedEntryTerm.year) {
    return "year";
  }

  if (filterPlansForEntryTerm(plans, entryTerm).length === 0 || activePlanIds.length === 0) {
    return "plans";
  }

  return "locale";
}

function isStepValid(
  step: PlannerOnboardingStep,
  draftEntryTerm: { seasonKey: EntryTermSeasonKey | ""; year: string },
  activeVisiblePlanCount: number,
  plannerWidgetIds: PlannerWidgetId[],
  validYears: string[],
) {
  switch (step) {
    case "season":
      return draftEntryTerm.seasonKey.length > 0;
    case "year":
      return validYears.includes(draftEntryTerm.year);
    case "plans":
      return activeVisiblePlanCount > 0;
    case "locale":
      return true;
    case "widgets":
      return plannerWidgetIds.length > 0;
  }
}
