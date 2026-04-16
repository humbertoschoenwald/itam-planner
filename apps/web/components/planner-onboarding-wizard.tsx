"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import {
  buildEntryTerm,
  buildProgramChoiceOptions,
  type EntryTermSeasonKey,
  ENTRY_TERM_SEASON_KEYS,
  filterProgramChoiceOptions,
  findSelectedProgramChoice,
  formatEntryTermLabel,
  getEntryTermYearOptions,
  getProgramChoiceMode,
  parseEntryTerm,
} from "@/lib/onboarding";
import type { BulletinSummary } from "@/lib/types";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { PLANNER_WIDGET_IDS, usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type PlannerOnboardingStep = "intro" | "entryTerm" | "program" | "swipe" | "finish";

const MOBILE_WIZARD_STEPS: PlannerOnboardingStep[] = [
  "intro",
  "entryTerm",
  "program",
  "swipe",
  "finish",
];
const INPUT_CLASS_NAME = "field-shell text-sm";
const SETUP_DELAY_MIN_MS = 3000;
const SETUP_DELAY_MAX_MS = 5000;

interface PlannerOnboardingWizardProps {
  plans: BulletinSummary[];
}

export function PlannerOnboardingWizard({ plans }: PlannerOnboardingWizardProps) {
  useSyncStudentCode();

  const router = useRouter();
  const setupTimeoutRef = useRef<number | null>(null);

  const profile = useStudentProfileStore((state) => state.profile);
  const setActivePlanIds = useStudentProfileStore((state) => state.setActivePlanIds);
  const setEntryTerm = useStudentProfileStore((state) => state.setEntryTerm);
  const setNavSwipePreference = usePlannerUiStore((state) => state.setNavSwipePreference);
  const setPlannerWidgetIds = usePlannerUiStore((state) => state.setPlannerWidgetIds);
  const setHasCompletedSetupAnimation = usePlannerUiStore(
    (state) => state.setHasCompletedSetupAnimation,
  );
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const navSwipePreference = usePlannerUiStore((state) => state.state.navSwipePreference);
  const hasCompletedSetupAnimation = usePlannerUiStore(
    (state) => state.state.hasCompletedSetupAnimation,
  );
  const isPhoneViewport = usePhoneViewport();
  const copy = getUiCopy(profile.locale);
  const wizardSteps = isPhoneViewport
    ? MOBILE_WIZARD_STEPS
    : MOBILE_WIZARD_STEPS.filter((step) => step !== "swipe");

  const [entryTermDraft, setEntryTermDraft] = useState(parseEntryTerm(profile.entryTerm));
  const [programSearch, setProgramSearch] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [currentStep, setCurrentStep] = useState<PlannerOnboardingStep>(
    getInitialWizardStep(
      profile.entryTerm,
      profile.activePlanIds,
      navSwipePreference,
      plans,
      false,
    ),
  );

  const yearOptions = getEntryTermYearOptions(plans);
  const draftEntryTerm = buildEntryTerm(entryTermDraft.seasonKey, entryTermDraft.year);
  const programOptions = buildProgramChoiceOptions(plans, draftEntryTerm);
  const filteredProgramOptions = filterProgramChoiceOptions(programOptions, programSearch);
  const selectedProgram = findSelectedProgramChoice(programOptions, profile.activePlanIds);
  const programChoiceMode = getProgramChoiceMode(programOptions);
  const activeStep = wizardSteps.includes(currentStep)
    ? currentStep
    : getInitialWizardStep(
        profile.entryTerm,
        profile.activePlanIds,
        navSwipePreference,
        plans,
        isPhoneViewport,
      );
  const progressIndex = wizardSteps.indexOf(activeStep);
  const progressPercent = ((progressIndex + 1) / wizardSteps.length) * 100;
  const isFinishStep = activeStep === "finish";

  useEffect(() => {
    return () => {
      if (setupTimeoutRef.current !== null) {
        window.clearTimeout(setupTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const visiblePlanIds = new Set(programOptions.flatMap((option) => option.planIds));

    if (profile.activePlanIds.every((planId) => visiblePlanIds.has(planId))) {
      return;
    }

    setActivePlanIds(profile.activePlanIds.filter((planId) => visiblePlanIds.has(planId)));
  }, [profile.activePlanIds, programOptions, setActivePlanIds]);

  const finishSummary = [
    {
      label: copy.plannerOnboarding.finishSummary.entryTerm,
      value: draftEntryTerm
        ? formatEntryTermLabel(draftEntryTerm, copy.onboardingPage.seasonOptions)
        : copy.plannerOnboarding.finishSummary.pending,
    },
    {
      label: copy.plannerOnboarding.finishSummary.program,
      value: selectedProgram?.displayLabel ?? copy.plannerOnboarding.finishSummary.pending,
    },
    ...(isPhoneViewport
      ? [
          {
            label: copy.plannerOnboarding.finishSummary.swipe,
            value:
              navSwipePreference === "inverted"
                ? copy.plannerOnboarding.swipeOptions.inverted.title
                : navSwipePreference === "natural"
                  ? copy.plannerOnboarding.swipeOptions.natural.title
                  : copy.plannerOnboarding.finishSummary.pending,
          },
        ]
      : []),
  ];

  function handleEntrySeasonChange(nextSeasonKey: EntryTermSeasonKey | "") {
    const nextDraft = { ...entryTermDraft, seasonKey: nextSeasonKey };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setProgramSearch("");
    setShowValidation(false);
  }

  function handleEntryYearChange(nextYear: string) {
    const nextDraft = {
      ...entryTermDraft,
      year: yearOptions.includes(nextYear) ? nextYear : "",
    };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setProgramSearch("");
    setShowValidation(false);
  }

  function handleProgramSelection(programKey: string) {
    const nextProgram = programOptions.find((option) => option.programKey === programKey);

    if (!nextProgram) {
      return;
    }

    setActivePlanIds(nextProgram.planIds);
    setShowValidation(false);
  }

  function handleSwipePreferenceSelection(preference: "natural" | "inverted") {
    setNavSwipePreference(preference);
    setShowValidation(false);
  }

  function handleBack() {
    if (isFinishing) {
      return;
    }

    if (progressIndex === 0) {
      router.push("/");
      return;
    }

    setShowValidation(false);
    setCurrentStep(wizardSteps[progressIndex - 1] ?? activeStep);
  }

  function handleNext() {
    if (isFinishing) {
      return;
    }

    if (
      !isStepValid(
        activeStep,
        draftEntryTerm,
        selectedProgram !== null,
        navSwipePreference,
        yearOptions,
      )
    ) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);

    if (isFinishStep) {
      finalizePlannerSetup();
      return;
    }

    setCurrentStep(wizardSteps[progressIndex + 1] ?? activeStep);
  }

  function finalizePlannerSetup() {
    if (plannerWidgetIds.length === 0) {
      setPlannerWidgetIds([...PLANNER_WIDGET_IDS]);
    }

    if (hasCompletedSetupAnimation) {
      router.push("/planner");
      return;
    }

    const delayMs = getPlannerSetupDelayMs();

    setHasCompletedSetupAnimation(true);
    setIsFinishing(true);
    setupTimeoutRef.current = window.setTimeout(() => {
      router.push("/planner");
    }, delayMs);
  }

  if (isFinishing) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
        <Card className="section-shell overflow-hidden">
          <CardHeader>
            <p className="eyebrow">{copy.plannerOnboarding.eyebrow}</p>
            <CardTitle>{copy.plannerOnboarding.loadingTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="h-12 w-12 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  {copy.plannerOnboarding.loadingEyebrow}
                </p>
                <p className="text-sm leading-6 text-muted">
                  {copy.plannerOnboarding.loadingBody}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {copy.plannerOnboarding.loadingCards.map((card) => (
                <div key={card.title} className="soft-panel">
                  <p className="font-semibold text-foreground">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <Card className="section-shell overflow-hidden">
        <CardHeader className="space-y-5">
          <div className="space-y-3">
            <p className="eyebrow">{copy.plannerOnboarding.eyebrow}</p>
            <CardTitle>{copy.plannerOnboarding.title}</CardTitle>
          </div>

          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${wizardSteps.length}, minmax(0, 1fr))` }}
            >
              {wizardSteps.map((step, index) => (
                <div
                  key={step}
                  className={[
                    "rounded-[1.15rem] border px-3 py-3 text-left text-xs transition",
                    index <= progressIndex
                      ? "border-accent/20 bg-accent-soft text-accent"
                      : "border-border bg-surface-elevated text-muted",
                  ].join(" ")}
                >
                  <p className="font-semibold tracking-[0.16em]">0{index + 1}</p>
                  <p className="mt-2 text-[11px] leading-5">
                    {copy.plannerOnboarding.stepLabels[step]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {renderStepContent({
            canShowPrograms: draftEntryTerm.length > 0,
            copy,
            currentStep: activeStep,
            entryTermDraft,
            filteredProgramOptions,
            handleEntrySeasonChange,
            handleEntryYearChange,
            handleProgramSelection,
            handleSwipePreferenceSelection,
            isPhoneViewport,
            navSwipePreference,
            programChoiceMode,
            programSearch,
            selectedProgramKey: selectedProgram?.programKey ?? null,
            setProgramSearch,
            yearOptions,
          })}

          {showValidation ? (
            <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4 text-sm leading-6 text-muted">
              <p className="font-semibold text-foreground">
                {copy.plannerOnboarding.validationTitle}
              </p>
              <p className="mt-2">{copy.plannerOnboarding.validationBody[activeStep]}</p>
            </div>
          ) : null}

          {activeStep === "finish" ? (
            <div className={`grid gap-3 ${isPhoneViewport ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {finishSummary.map((item) => (
                <div key={item.label} className="soft-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleBack} variant="secondary">
              {copy.plannerOnboarding.back}
            </Button>
            <Button onClick={handleNext}>
              {isFinishStep ? copy.plannerOnboarding.finish : copy.plannerOnboarding.next}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function renderStepContent({
  canShowPrograms,
  copy,
  currentStep,
  entryTermDraft,
  filteredProgramOptions,
  handleEntrySeasonChange,
  handleEntryYearChange,
  handleProgramSelection,
  handleSwipePreferenceSelection,
  isPhoneViewport,
  navSwipePreference,
  programChoiceMode,
  programSearch,
  selectedProgramKey,
  setProgramSearch,
  yearOptions,
}: {
  canShowPrograms: boolean;
  copy: ReturnType<typeof getUiCopy>;
  currentStep: PlannerOnboardingStep;
  entryTermDraft: { seasonKey: EntryTermSeasonKey | ""; year: string };
  filteredProgramOptions: ReturnType<typeof filterProgramChoiceOptions>;
  handleEntrySeasonChange: (nextSeasonKey: EntryTermSeasonKey | "") => void;
  handleEntryYearChange: (nextYear: string) => void;
  handleProgramSelection: (programKey: string) => void;
  handleSwipePreferenceSelection: (preference: "natural" | "inverted") => void;
  isPhoneViewport: boolean;
  navSwipePreference: "natural" | "inverted" | null;
  programChoiceMode: ReturnType<typeof getProgramChoiceMode>;
  programSearch: string;
  selectedProgramKey: string | null;
  setProgramSearch: (value: string) => void;
  yearOptions: string[];
}) {
  switch (currentStep) {
    case "intro":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.introTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {copy.plannerOnboarding.introBody}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {copy.plannerOnboarding.introCards.map((card) => (
              <div key={card.title} className="soft-panel">
                <p className="font-semibold text-foreground">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "entryTerm":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.entryTermTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {copy.plannerOnboarding.entryTermBody}
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

          <select
            aria-label={copy.plannerOnboarding.entryYearLabel}
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
    case "program":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.programTitles[programChoiceMode]}
            </p>
            <p className="text-sm leading-6 text-muted">
              {copy.plannerOnboarding.programBody}
            </p>
          </div>

          {!canShowPrograms ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {copy.plannerOnboarding.programLockedBody}
            </div>
          ) : (
            <>
              <input
                aria-label={copy.plannerOnboarding.programSearchLabel}
                className={INPUT_CLASS_NAME}
                onChange={(event) => setProgramSearch(event.target.value)}
                placeholder={copy.plannerOnboarding.programSearchPlaceholder[programChoiceMode]}
                type="search"
                value={programSearch}
              />

              {filteredProgramOptions.length === 0 ? (
                <div className="soft-panel text-sm leading-6 text-muted">
                  {copy.plannerOnboarding.programSearchEmpty}
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredProgramOptions.map((option) => (
                    <button
                      key={option.programKey}
                      className={[
                        "choice-card text-left",
                        selectedProgramKey === option.programKey
                          ? "border-accent bg-surface-hover"
                          : "",
                      ].join(" ")}
                      onClick={() => handleProgramSelection(option.programKey)}
                      type="button"
                    >
                      <span className="block font-semibold text-foreground">
                        {option.displayLabel}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      );
    case "swipe":
      if (!isPhoneViewport) {
        return null;
      }

      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.swipePreferenceTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {copy.plannerOnboarding.swipePreferenceBody}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(["natural", "inverted"] as const).map((preference) => (
              <button
                key={preference}
                className={[
                  "choice-card text-left",
                  navSwipePreference === preference ? "border-accent bg-surface-hover" : "",
                ].join(" ")}
                onClick={() => handleSwipePreferenceSelection(preference)}
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
        </div>
      );
    case "finish":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {copy.plannerOnboarding.finishTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {copy.plannerOnboarding.finishBody}
            </p>
          </div>
          <div className="soft-panel">
            <p className="font-semibold text-foreground">
              {copy.plannerOnboarding.finishHighlight}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {copy.plannerOnboarding.finishSupport}
            </p>
          </div>
        </div>
      );
  }
}

function getInitialWizardStep(
  entryTerm: string,
  activePlanIds: string[],
  navSwipePreference: "natural" | "inverted" | null,
  plans: BulletinSummary[],
  isPhoneViewport: boolean,
): PlannerOnboardingStep {
  const parsedEntryTerm = parseEntryTerm(entryTerm);

  if (
    !parsedEntryTerm.seasonKey &&
    !parsedEntryTerm.year &&
    activePlanIds.length === 0 &&
    navSwipePreference === null
  ) {
    return "intro";
  }

  if (!parsedEntryTerm.seasonKey || !parsedEntryTerm.year) {
    return "entryTerm";
  }

  const selectedProgram = findSelectedProgramChoice(
    buildProgramChoiceOptions(plans, entryTerm),
    activePlanIds,
  );

  if (selectedProgram === null) {
    return "program";
  }

  if (isPhoneViewport && navSwipePreference === null) {
    return "swipe";
  }

  return "finish";
}

function isStepValid(
  step: PlannerOnboardingStep,
  draftEntryTerm: string,
  hasSelectedProgram: boolean,
  navSwipePreference: "natural" | "inverted" | null,
  validYears: string[],
) {
  switch (step) {
    case "intro":
      return true;
    case "entryTerm": {
      const parsedEntryTerm = parseEntryTerm(draftEntryTerm);
      return parsedEntryTerm.seasonKey.length > 0 && validYears.includes(parsedEntryTerm.year);
    }
    case "program":
      return hasSelectedProgram;
    case "swipe":
      return navSwipePreference !== null;
    case "finish":
      return true;
  }
}

export function getPlannerSetupDelayMs(randomValue: number = Math.random()) {
  const clampedRandom = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 0.999999)
    : 0.5;

  return SETUP_DELAY_MIN_MS + Math.floor(clampedRandom * (SETUP_DELAY_MAX_MS - SETUP_DELAY_MIN_MS + 1));
}
