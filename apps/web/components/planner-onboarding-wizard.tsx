"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import {
  buildCareerChoiceOptions,
  buildEntryTerm,
  buildJointProgramChoiceOptions,
  type CareerChoiceOption,
  type EntryTermSeasonKey,
  ENTRY_TERM_SEASON_KEYS,
  filterCareerChoiceOptions,
  formatEntryTermLabel,
  getCareerChoiceMode,
  getEntryTermYearOptions,
  parseEntryTerm,
  resolveActivePlanIdsFromSelections,
} from "@/lib/onboarding";
import { getProductCopy } from "@/lib/product-copy";
import type { BulletinSummary } from "@/lib/types";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { usePlannerStore } from "@/stores/planner-store";
import { PLANNER_WIDGET_IDS, usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type PlannerOnboardingStep =
  | "intro"
  | "entryTerm"
  | "careers"
  | "jointPrograms"
  | "swipe"
  | "finish";

const MOBILE_WIZARD_STEPS: PlannerOnboardingStep[] = [
  "intro",
  "entryTerm",
  "careers",
  "jointPrograms",
  "swipe",
  "finish",
];

const INPUT_CLASS_NAME = "field-shell text-sm";
const MAX_SELECTED_CAREERS = 2;
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
  const setSelectedCareerIds = useStudentProfileStore((state) => state.setSelectedCareerIds);
  const setSelectedJointProgramIds = useStudentProfileStore(
    (state) => state.setSelectedJointProgramIds,
  );
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
  const setSelectedSubjectCodes = usePlannerStore((state) => state.setSelectedSubjectCodes);
  const isPhoneViewport = usePhoneViewport();
  const copy = getUiCopy(profile.locale);
  const productCopy = getProductCopy(profile.locale);

  const [entryTermDraft, setEntryTermDraft] = useState(parseEntryTerm(profile.entryTerm));
  const [careerSearch, setCareerSearch] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [currentStep, setCurrentStep] = useState<PlannerOnboardingStep>(
    getInitialWizardStep(
      profile.entryTerm,
      profile.selectedCareerIds,
      profile.selectedJointProgramIds,
      navSwipePreference,
      plans,
      false,
    ),
  );

  const yearOptions = getEntryTermYearOptions(plans);
  const draftEntryTerm = buildEntryTerm(entryTermDraft.seasonKey, entryTermDraft.year);
  const careerOptions = buildCareerChoiceOptions(plans, draftEntryTerm);
  const filteredCareerOptions = filterCareerChoiceOptions(careerOptions, careerSearch);
  const jointProgramOptions = buildJointProgramChoiceOptions(
    plans,
    draftEntryTerm,
    profile.selectedCareerIds,
  );
  const wizardSteps = (isPhoneViewport
    ? MOBILE_WIZARD_STEPS
    : MOBILE_WIZARD_STEPS.filter((step) => step !== "swipe")
  ).filter((step) => step !== "jointPrograms" || jointProgramOptions.length > 0);
  const careerChoiceMode = getCareerChoiceMode(careerOptions);
  const activeStep = wizardSteps.includes(currentStep)
    ? currentStep
    : getInitialWizardStep(
        profile.entryTerm,
        profile.selectedCareerIds,
        profile.selectedJointProgramIds,
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
    const nextActivePlanIds = resolveActivePlanIdsFromSelections(
      plans,
      draftEntryTerm,
      profile.selectedCareerIds,
      profile.selectedJointProgramIds,
    );

    if (arraysMatch(nextActivePlanIds, profile.activePlanIds)) {
      return;
    }

    setActivePlanIds(nextActivePlanIds);
  }, [
    draftEntryTerm,
    plans,
    profile.activePlanIds,
    profile.selectedCareerIds,
    profile.selectedJointProgramIds,
    setActivePlanIds,
  ]);

  useEffect(() => {
    const visibleJointProgramIds = new Set(jointProgramOptions.map((option) => option.jointProgramId));
    const sanitized = profile.selectedJointProgramIds.filter((value) => visibleJointProgramIds.has(value));

    if (arraysMatch(sanitized, profile.selectedJointProgramIds)) {
      return;
    }

    setSelectedJointProgramIds(sanitized);
  }, [jointProgramOptions, profile.selectedJointProgramIds, setSelectedJointProgramIds]);

  const finishSummary = [
    {
      label: copy.plannerOnboarding.finishSummary.entryTerm,
      value: draftEntryTerm
        ? formatEntryTermLabel(draftEntryTerm, copy.onboardingPage.seasonOptions)
        : copy.plannerOnboarding.finishSummary.pending,
    },
    {
      label: productCopy.plannerWizard.stepLabels.careers,
      value:
        profile.selectedCareerIds.length > 0
          ? profile.selectedCareerIds
              .map((careerId) => careerOptions.find((option) => option.careerId === careerId)?.displayLabel)
              .filter((value): value is string => typeof value === "string")
              .join(" · ")
          : copy.plannerOnboarding.finishSummary.pending,
    },
    {
      label: productCopy.plannerWizard.stepLabels.jointPrograms,
      value:
        profile.selectedJointProgramIds.length > 0
          ? jointProgramOptions
              .filter((option) => profile.selectedJointProgramIds.includes(option.jointProgramId))
              .map((option) => option.displayLabel)
              .join(" · ")
          : copy.plannerOnboarding.finishSummary.pending,
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

  function resetDownstreamPlannerState() {
    setSelectedSubjectCodes([]);
  }

  function handleEntrySeasonChange(nextSeasonKey: EntryTermSeasonKey | "") {
    const nextDraft = { ...entryTermDraft, seasonKey: nextSeasonKey };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setCareerSearch("");
    setSelectedCareerIds([]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleEntryYearChange(nextYear: string) {
    const nextDraft = {
      ...entryTermDraft,
      year: yearOptions.includes(nextYear) ? nextYear : "",
    };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setCareerSearch("");
    setSelectedCareerIds([]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleCareerToggle(option: CareerChoiceOption) {
    const exists = profile.selectedCareerIds.includes(option.careerId);

    if (exists) {
      setSelectedCareerIds(profile.selectedCareerIds.filter((careerId) => careerId !== option.careerId));
      setSelectedJointProgramIds([]);
      resetDownstreamPlannerState();
      setShowValidation(false);
      return;
    }

    if (profile.selectedCareerIds.length >= MAX_SELECTED_CAREERS) {
      setShowValidation(true);
      return;
    }

    setSelectedCareerIds([...profile.selectedCareerIds, option.careerId]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleJointProgramToggle(jointProgramId: string) {
    const exists = profile.selectedJointProgramIds.includes(jointProgramId);
    setSelectedJointProgramIds(
      exists
        ? profile.selectedJointProgramIds.filter((value) => value !== jointProgramId)
        : [...profile.selectedJointProgramIds, jointProgramId],
    );
    resetDownstreamPlannerState();
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
      !isStepValid({
        activeStep,
        careerSelectionCount: profile.selectedCareerIds.length,
        draftEntryTerm,
        navSwipePreference,
        validYears: yearOptions,
      })
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
                    {getStepLabel(step, copy, productCopy)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {renderStepContent({
            careerChoiceMode,
            careerOptions: filteredCareerOptions,
            careerSearch,
            copy,
            currentStep: activeStep,
            entryTermDraft,
            handleCareerToggle,
            handleEntrySeasonChange,
            handleEntryYearChange,
            handleJointProgramToggle,
            handleSwipePreferenceSelection,
            isPhoneViewport,
            jointProgramOptions,
            navSwipePreference,
            productCopy,
            selectedCareerIds: profile.selectedCareerIds,
            selectedJointProgramIds: profile.selectedJointProgramIds,
            setCareerSearch,
            yearOptions,
          })}

          {showValidation ? (
            <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4 text-sm leading-6 text-muted">
              <p className="font-semibold text-foreground">
                {copy.plannerOnboarding.validationTitle}
              </p>
              <p className="mt-2">
                {getValidationBody({
                  activeStep,
                  copy,
                  productCopy,
                  selectedCareerIds: profile.selectedCareerIds,
                })}
              </p>
            </div>
          ) : null}

          {activeStep === "finish" ? (
            <div className={`grid gap-3 ${isPhoneViewport ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
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
  careerChoiceMode,
  careerOptions,
  careerSearch,
  copy,
  currentStep,
  entryTermDraft,
  handleCareerToggle,
  handleEntrySeasonChange,
  handleEntryYearChange,
  handleJointProgramToggle,
  handleSwipePreferenceSelection,
  isPhoneViewport,
  jointProgramOptions,
  navSwipePreference,
  productCopy,
  selectedCareerIds,
  selectedJointProgramIds,
  setCareerSearch,
  yearOptions,
}: {
  careerChoiceMode: ReturnType<typeof getCareerChoiceMode>;
  careerOptions: CareerChoiceOption[];
  careerSearch: string;
  copy: ReturnType<typeof getUiCopy>;
  currentStep: PlannerOnboardingStep;
  entryTermDraft: { seasonKey: EntryTermSeasonKey | ""; year: string };
  handleCareerToggle: (option: CareerChoiceOption) => void;
  handleEntrySeasonChange: (nextSeasonKey: EntryTermSeasonKey | "") => void;
  handleEntryYearChange: (nextYear: string) => void;
  handleJointProgramToggle: (jointProgramId: string) => void;
  handleSwipePreferenceSelection: (preference: "natural" | "inverted") => void;
  isPhoneViewport: boolean;
  jointProgramOptions: ReturnType<typeof buildJointProgramChoiceOptions>;
  navSwipePreference: "natural" | "inverted" | null;
  productCopy: ReturnType<typeof getProductCopy>;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
  setCareerSearch: (value: string) => void;
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
            <p className="text-sm leading-6 text-muted">{copy.plannerOnboarding.introBody}</p>
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
    case "careers":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerWizard.careerTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {productCopy.plannerWizard.careerBody}
            </p>
          </div>

          <div className="soft-panel flex flex-wrap items-center justify-between gap-3 text-sm leading-6 text-muted">
            <span>{productCopy.plannerWizard.careerLimit}</span>
            <span className="font-semibold text-foreground">
              {productCopy.plannerWizard.selectedCount}: {selectedCareerIds.length}/{MAX_SELECTED_CAREERS}
            </span>
          </div>

          <input
            aria-label={productCopy.plannerWizard.careerSearch}
            className={INPUT_CLASS_NAME}
            onChange={(event) => setCareerSearch(event.target.value)}
            placeholder={copy.plannerOnboarding.programSearchPlaceholder[careerChoiceMode]}
            type="search"
            value={careerSearch}
          />

          {careerOptions.length === 0 ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {copy.plannerOnboarding.programSearchEmpty}
            </div>
          ) : (
            <div className="grid gap-3">
              {careerOptions.map((option) => {
                const selected = selectedCareerIds.includes(option.careerId);
                return (
                  <button
                    key={option.careerId}
                    className={[
                      "choice-card text-left",
                      selected ? "border-accent bg-surface-hover" : "",
                    ].join(" ")}
                    onClick={() => handleCareerToggle(option)}
                    type="button"
                  >
                    <span className="block font-semibold text-foreground">{option.displayLabel}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    case "jointPrograms":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerWizard.jointProgramsTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {productCopy.plannerWizard.jointProgramsBody}
            </p>
          </div>

          {selectedCareerIds.length === 0 ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {productCopy.plannerWizard.careerNone}
            </div>
          ) : jointProgramOptions.length === 0 ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {productCopy.plannerWizard.jointProgramsEmpty}
            </div>
          ) : (
            <div className="grid gap-3">
              {jointProgramOptions.map((option) => (
                <button
                  key={option.jointProgramId}
                  className={[
                    "choice-card text-left",
                    selectedJointProgramIds.includes(option.jointProgramId)
                      ? "border-accent bg-surface-hover"
                      : "",
                  ].join(" ")}
                  onClick={() => handleJointProgramToggle(option.jointProgramId)}
                  type="button"
                >
                  <span className="block font-semibold text-foreground">{option.displayLabel}</span>
                </button>
              ))}
            </div>
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
  selectedCareerIds: string[],
  selectedJointProgramIds: string[],
  navSwipePreference: "natural" | "inverted" | null,
  plans: BulletinSummary[],
  isPhoneViewport: boolean,
): PlannerOnboardingStep {
  const parsedEntryTerm = parseEntryTerm(entryTerm);

  if (
    !parsedEntryTerm.seasonKey &&
    !parsedEntryTerm.year &&
    selectedCareerIds.length === 0 &&
    selectedJointProgramIds.length === 0 &&
    navSwipePreference === null
  ) {
    return "intro";
  }

  if (!parsedEntryTerm.seasonKey || !parsedEntryTerm.year) {
    return "entryTerm";
  }

  if (selectedCareerIds.length === 0) {
    return "careers";
  }

  if (buildJointProgramChoiceOptions(plans, entryTerm, selectedCareerIds).length > 0 && selectedJointProgramIds.length === 0) {
    return "jointPrograms";
  }

  if (isPhoneViewport && navSwipePreference === null) {
    return "swipe";
  }

  return "finish";
}

function getStepLabel(
  step: PlannerOnboardingStep,
  copy: ReturnType<typeof getUiCopy>,
  productCopy: ReturnType<typeof getProductCopy>,
) {
  switch (step) {
    case "careers":
      return productCopy.plannerWizard.stepLabels.careers;
    case "jointPrograms":
      return productCopy.plannerWizard.stepLabels.jointPrograms;
    default:
      return copy.plannerOnboarding.stepLabels[step];
  }
}

function getValidationBody({
  activeStep,
  copy,
  productCopy,
  selectedCareerIds,
}: {
  activeStep: PlannerOnboardingStep;
  copy: ReturnType<typeof getUiCopy>;
  productCopy: ReturnType<typeof getProductCopy>;
  selectedCareerIds: string[];
}) {
  switch (activeStep) {
    case "careers":
      return selectedCareerIds.length >= MAX_SELECTED_CAREERS
        ? productCopy.plannerWizard.careerLimit
        : productCopy.plannerWizard.validation.careers;
    case "jointPrograms":
      return productCopy.plannerWizard.validation.jointPrograms;
    default:
      return copy.plannerOnboarding.validationBody[activeStep];
  }
}

function isStepValid({
  activeStep,
  careerSelectionCount,
  draftEntryTerm,
  navSwipePreference,
  validYears,
}: {
  activeStep: PlannerOnboardingStep;
  careerSelectionCount: number;
  draftEntryTerm: string;
  navSwipePreference: "natural" | "inverted" | null;
  validYears: string[];
}) {
  switch (activeStep) {
    case "intro":
    case "jointPrograms":
    case "finish":
      return true;
    case "entryTerm": {
      const parsedEntryTerm = parseEntryTerm(draftEntryTerm);
      return parsedEntryTerm.seasonKey.length > 0 && validYears.includes(parsedEntryTerm.year);
    }
    case "careers":
      return careerSelectionCount > 0 && careerSelectionCount <= MAX_SELECTED_CAREERS;
    case "swipe":
      return navSwipePreference !== null;
  }
}

function arraysMatch(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export function getPlannerSetupDelayMs(randomValue: number = Math.random()) {
  const clampedRandom = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 0.999999)
    : 0.5;

  return (
    SETUP_DELAY_MIN_MS +
    Math.floor(clampedRandom * (SETUP_DELAY_MAX_MS - SETUP_DELAY_MIN_MS + 1))
  );
}
