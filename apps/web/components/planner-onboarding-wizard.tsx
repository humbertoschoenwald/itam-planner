"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { PublicClassSelectionPanel } from "@/components/public-class-selection-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import {
  ACADEMIC_LEVELS,
  buildCareerChoiceOptionsForLevel,
  buildEntryTerm,
  buildJointProgramChoiceOptionsForLevel,
  buildRecommendedSubjectCodes,
  buildSelectedSubjectSummary,
  buildSubjectDirectory,
  buildSubjectTitleLookup,
  filterPeriodsForAcademicLevel,
  formatSchedulePeriodLabel,
  type EntryTermSeasonKey,
  ENTRY_TERM_SEASON_KEYS,
  estimateSemesterNumber,
  filterCareerChoiceOptions,
  formatEntryTermLabel,
  getDefaultPeriodForAcademicLevel,
  getCareerChoiceMode,
  getEntryTermYearOptions,
  parseEntryTerm,
  resolveActivePlanIdsFromSelections,
  searchSubjectDirectory,
} from "@/lib/presenters/schedule";
import { getProductCopy } from "@/lib/product-copy";
import { useSchedulePeriodDetail } from "@/lib/use-schedule-period-detail";
import type {
  AcademicLevel,
  BulletinDocument,
  BulletinSummary,
  LocaleCode,
  PlannerWidgetId,
  SchedulePeriodDetail,
  SchedulePeriodSummary,
} from "@/lib/types";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { usePlannerStore } from "@/stores/planner-store";
import { PLANNER_WIDGET_IDS, usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type PlannerOnboardingStep =
  | "intro"
  | "academicLevel"
  | "entryTerm"
  | "locale"
  | "careers"
  | "jointPrograms"
  | "subjects"
  | "classes"
  | "swipe"
  | "finish";

const MOBILE_WIZARD_STEPS: PlannerOnboardingStep[] = [
  "intro",
  "academicLevel",
  "entryTerm",
  "locale",
  "careers",
  "jointPrograms",
  "subjects",
  "classes",
  "swipe",
  "finish",
];

const INPUT_CLASS_NAME = "field-shell text-sm";
const MAX_SELECTED_CAREERS = 2;
const SETUP_DELAY_MIN_MS = 3000;
const SETUP_DELAY_MAX_MS = 5000;
const STEP_COUNTER_DIGITS = 2;

type PlannerOnboardingWizardProps = {
  bulletinDocuments: BulletinDocument[];
  periods: SchedulePeriodSummary[];
  plans: BulletinSummary[];
};

export function PlannerOnboardingWizard({
  bulletinDocuments,
  periods,
  plans,
}: PlannerOnboardingWizardProps): JSX.Element {
  useSyncStudentCode();

  const router = useRouter();
  const setupTimeoutRef = useRef<number | null>(null);

  const profile = useStudentProfileStore((state) => state.profile);
  const setAcademicLevel = useStudentProfileStore((state) => state.setAcademicLevel);
  const setActivePlanIds = useStudentProfileStore((state) => state.setActivePlanIds);
  const setEntryTerm = useStudentProfileStore((state) => state.setEntryTerm);
  const setLocale = useStudentProfileStore((state) => state.setLocale);
  const setSelectedCareerIds = useStudentProfileStore((state) => state.setSelectedCareerIds);
  const setSelectedJointProgramIds = useStudentProfileStore(
    (state) => state.setSelectedJointProgramIds,
  );
  const plannerState = usePlannerStore((state) => state.state);
  const setSelectedOfferingIds = usePlannerStore((state) => state.setSelectedOfferingIds);
  const setSelectedPeriodId = usePlannerStore((state) => state.setSelectedPeriodId);
  const toggleOfferingId = usePlannerStore((state) => state.toggleOfferingId);
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
  const toggleSubjectCode = usePlannerStore((state) => state.toggleSubjectCode);
  const isPhoneViewport = usePhoneViewport();
  const copy = getUiCopy(profile.locale);
  const productCopy = getProductCopy(profile.locale);

  const [entryTermDraft, setEntryTermDraft] = useState(parseEntryTerm(profile.entryTerm));
  const [careerSearch, setCareerSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [currentStep, setCurrentStep] = useState<PlannerOnboardingStep>(
    getInitialWizardStep(
      profile.academicLevel,
      profile.entryTerm,
      profile.selectedCareerIds,
      profile.selectedJointProgramIds,
      plannerState.selectedSubjectCodes.length,
      plannerState.selectedOfferingIds.length,
      navSwipePreference,
      false,
      false,
      false,
    ),
  );

  const draftEntryTerm = buildEntryTerm(entryTermDraft.seasonKey, entryTermDraft.year);
  const filteredPeriods = useMemo(
    () => filterPeriodsForAcademicLevel(periods, profile.academicLevel),
    [periods, profile.academicLevel],
  );
  const defaultPeriod = useMemo(
    () => getDefaultPeriodForAcademicLevel(periods, profile.academicLevel),
    [periods, profile.academicLevel],
  );
  const yearOptions = useMemo(
    () => getEntryTermYearOptions(plans, profile.academicLevel, periods),
    [periods, plans, profile.academicLevel],
  );
  const careerOptions = useMemo(
    () => buildCareerChoiceOptionsForLevel(plans, draftEntryTerm, profile.academicLevel),
    [draftEntryTerm, plans, profile.academicLevel],
  );
  const filteredCareerOptions = useMemo(
    () => filterCareerChoiceOptions(careerOptions, careerSearch),
    [careerOptions, careerSearch],
  );
  const jointProgramOptions = useMemo(
    () =>
      buildJointProgramChoiceOptionsForLevel(
        plans,
        draftEntryTerm,
        profile.academicLevel,
        profile.selectedCareerIds,
      ),
    [draftEntryTerm, plans, profile.academicLevel, profile.selectedCareerIds],
  );
  const activePlanDocuments = useMemo(
    () =>
      bulletinDocuments.filter((document) => profile.activePlanIds.includes(document.plan_id)),
    [bulletinDocuments, profile.activePlanIds],
  );
  const estimatedSemester = resolveEstimatedSemester(
    profile.academicLevel,
    draftEntryTerm,
    defaultPeriod,
  );
  const recommendedSubjectCodes = useMemo(
    () =>
      buildRecommendedSubjectCodes(activePlanDocuments, estimatedSemester, {
        allDocuments: bulletinDocuments,
        fallbackCareerIds: profile.selectedCareerIds,
      }),
    [activePlanDocuments, bulletinDocuments, estimatedSemester, profile.selectedCareerIds],
  );
  const subjectTitleLookup = useMemo(
    () => buildSubjectTitleLookup(bulletinDocuments),
    [bulletinDocuments],
  );
  const fullSubjectDirectory = useMemo(
    () => buildSubjectDirectory(bulletinDocuments),
    [bulletinDocuments],
  );
  const recommendedDirectory = useMemo(() => {
    const planBackedDirectory = buildSubjectDirectory(activePlanDocuments);

    if (planBackedDirectory.length > 0) {
      return planBackedDirectory;
    }

    return buildSelectedSubjectSummary(recommendedSubjectCodes, fullSubjectDirectory);
  }, [activePlanDocuments, fullSubjectDirectory, recommendedSubjectCodes]);
  const selectedSubjectCodeSet = useMemo(
    () => new Set(plannerState.selectedSubjectCodes),
    [plannerState.selectedSubjectCodes],
  );
  const subjectResults = useMemo(
    () =>
      buildWizardSubjectResults(
        fullSubjectDirectory,
        recommendedDirectory,
        selectedSubjectCodeSet,
        subjectSearch,
      ),
    [fullSubjectDirectory, recommendedDirectory, selectedSubjectCodeSet, subjectSearch],
  );
  const selectedSubjectEntries = useMemo(
    () => buildSelectedSubjectSummary(plannerState.selectedSubjectCodes, fullSubjectDirectory),
    [fullSubjectDirectory, plannerState.selectedSubjectCodes],
  );
  const shouldShowCareerSteps = profile.academicLevel === "undergraduate";
  const shouldShowJointPrograms = resolveShouldShowJointPrograms(
    profile.academicLevel,
    shouldShowCareerSteps,
    jointProgramOptions.length,
  );
  const shouldShowSubjects = profile.academicLevel !== "graduate";
  const shouldShowClasses = shouldShowSubjects;
  const wizardSteps = buildWizardSteps({
    isPhoneViewport,
    shouldShowCareerSteps,
    shouldShowClasses,
    shouldShowJointPrograms,
    shouldShowSubjects,
  });
  const activePeriodId = resolveWizardActivePeriodId(
    filteredPeriods,
    plannerState.selectedPeriodId,
    defaultPeriod?.period_id ?? null,
  );
  const {
    detail: resolvedSelectedPeriod,
    error: resolvedSelectedPeriodError,
    isLoading: selectedPeriodLoading,
  } = useSchedulePeriodDetail(activePeriodId, productCopy.plannerSettings.scheduleLoadError);
  const visibleOfferings = useMemo(
    () =>
      resolvedSelectedPeriod?.offerings.filter((offering) =>
        plannerState.selectedSubjectCodes.includes(offering.course_code),
      ) ?? [],
    [plannerState.selectedSubjectCodes, resolvedSelectedPeriod],
  );
  const careerChoiceMode = getCareerChoiceMode(careerOptions);
  const activeStep = resolveWizardActiveStep(
    currentStep,
    wizardSteps,
    getInitialWizardStep(
      profile.academicLevel,
      profile.entryTerm,
      profile.selectedCareerIds,
      profile.selectedJointProgramIds,
      plannerState.selectedSubjectCodes.length,
      plannerState.selectedOfferingIds.length,
      navSwipePreference,
      shouldShowJointPrograms,
      shouldShowSubjects,
      isPhoneViewport,
    ),
  );
  const progressIndex = wizardSteps.indexOf(activeStep);
  const progressPercent = ((progressIndex + 1) / wizardSteps.length) * 100;
  const isFinishStep = activeStep === "finish";
  const validationBody = getValidationBody({
    academicLevel: profile.academicLevel,
    activeStep,
    copy,
    productCopy,
    selectedCareerIds: profile.selectedCareerIds,
    selectedJointProgramIds: profile.selectedJointProgramIds,
  });

  useEffect(() => {
    return () => {
      if (setupTimeoutRef.current !== null) {
        window.clearTimeout(setupTimeoutRef.current);
      }
    };
  }, []);

  useSyncWizardActivePlans({
    activePlanIds: profile.activePlanIds,
    academicLevel: profile.academicLevel,
    draftEntryTerm,
    plans,
    selectedCareerIds: profile.selectedCareerIds,
    selectedJointProgramIds: profile.selectedJointProgramIds,
    setActivePlanIds,
    setSelectedCareerIds,
    setSelectedJointProgramIds,
  });
  useSanitizeWizardJointPrograms({
    academicLevel: profile.academicLevel,
    jointProgramOptions,
    selectedJointProgramIds: profile.selectedJointProgramIds,
    setSelectedJointProgramIds,
  });
  useSeedWizardSubjects({
    academicLevel: profile.academicLevel,
    recommendedSubjectCodes,
    selectedSubjectCount: plannerState.selectedSubjectCodes.length,
    setSelectedSubjectCodes,
  });
  useSyncWizardSelectedPeriod(activePeriodId, setSelectedPeriodId);
  useSanitizeWizardSelectedOfferings({
    resolvedSelectedPeriod,
    selectedOfferingIds: plannerState.selectedOfferingIds,
    selectedSubjectCodes: plannerState.selectedSubjectCodes,
    setSelectedOfferingIds,
  });
  const finishSummary = buildFinishSummary({
    careerOptions,
    copy,
    draftEntryTerm,
    isPhoneViewport,
    jointProgramOptions,
    navSwipePreference,
    plannerState,
    productCopy,
    profile,
    shouldShowCareerSteps,
  });
  const {
    handleAcademicLevelChange,
    handleBack,
    handleCareerToggle,
    handleEntrySeasonChange,
    handleEntryYearChange,
    handleJointProgramToggle,
    handleLocaleChange,
    handleNext,
    handleSwipePreferenceSelection,
  } = usePlannerOnboardingWizardActions({
    activeStep,
    draftEntryTerm,
    entryTermDraft,
    finalizePlannerSetup,
    isFinishStep,
    isFinishing,
    navSwipePreference,
    plannerState,
    profile,
    progressIndex,
    router,
    setAcademicLevel,
    setCareerSearch,
    setCurrentStep,
    setEntryTerm,
    setEntryTermDraft,
    setLocale,
    setNavSwipePreference,
    setSelectedCareerIds,
    setSelectedJointProgramIds,
    setSelectedOfferingIds,
    setSelectedPeriodId,
    setSelectedSubjectCodes,
    setShowValidation,
    setSubjectSearch,
    selectedPeriodLoading,
    visibleOfferings,
    wizardSteps,
    yearOptions,
  });

  function finalizePlannerSetup(): void {
    seedPlannerWidgets(plannerWidgetIds, setPlannerWidgetIds);
    seedPlannerPeriod(
      defaultPeriod?.period_id ?? "",
      filteredPeriods,
      plannerState.selectedPeriodId,
      setSelectedPeriodId,
    );
    seedPlannerSubjects(
      profile.academicLevel,
      plannerState.selectedSubjectCodes.length,
      recommendedSubjectCodes,
      setSelectedSubjectCodes,
    );

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
    return <PlannerSetupLoadingState copy={copy} />;
  }

  return (
    <PlannerOnboardingCard
      academicLevel={profile.academicLevel}
      activePeriodLabel={resolveActivePeriodLabel(
        activePeriodId,
        copy.plannerHome.activePeriodFallback,
        filteredPeriods,
      )}
      activeStep={activeStep}
      careerChoiceMode={careerChoiceMode}
      careerOptions={careerOptions}
      careerSearch={careerSearch}
      classSelectionError={resolvedSelectedPeriodError}
      classSelectionLoading={selectedPeriodLoading}
      copy={copy}
      currentStep={activeStep}
      entryTermDraft={entryTermDraft}
      filteredCareerOptions={filteredCareerOptions}
      finishSummary={finishSummary}
      handleAcademicLevelChange={handleAcademicLevelChange}
      handleBack={handleBack}
      handleCareerToggle={handleCareerToggle}
      handleEntrySeasonChange={handleEntrySeasonChange}
      handleEntryYearChange={handleEntryYearChange}
      handleJointProgramToggle={handleJointProgramToggle}
      handleLocaleChange={handleLocaleChange}
      handleNext={handleNext}
      handleSwipePreferenceSelection={handleSwipePreferenceSelection}
      isFinishStep={isFinishStep}
      isPhoneViewport={isPhoneViewport}
      jointProgramOptions={jointProgramOptions}
      locale={profile.locale}
      navSwipePreference={navSwipePreference}
      productCopy={productCopy}
      progressIndex={progressIndex}
      progressPercent={progressPercent}
      selectedCareerIds={profile.selectedCareerIds}
      selectedJointProgramIds={profile.selectedJointProgramIds}
      selectedOfferingIds={plannerState.selectedOfferingIds}
      selectedSubjectCodes={plannerState.selectedSubjectCodes}
      selectedSubjectEntries={selectedSubjectEntries}
      setCareerSearch={setCareerSearch}
      setSubjectSearch={setSubjectSearch}
      showValidation={showValidation}
      subjectResults={subjectResults}
      subjectSearch={subjectSearch}
      subjectTitleLookup={subjectTitleLookup}
      toggleOfferingId={toggleOfferingId}
      toggleSubjectCode={toggleSubjectCode}
      validationBody={validationBody}
      visibleOfferings={visibleOfferings}
      wizardSteps={wizardSteps}
      yearOptions={yearOptions}
    />
  );
}

function PlannerSetupLoadingState({
  copy,
}: {
  copy: ReturnType<typeof getUiCopy>;
}): JSX.Element {
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
              <p className="text-sm leading-6 text-muted">{copy.plannerOnboarding.loadingBody}</p>
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

type PlannerOnboardingCardProps = RenderStepContentProps & {
  activeStep: PlannerOnboardingStep;
  copy: ReturnType<typeof getUiCopy>;
  finishSummary: { label: string; value: string }[];
  handleBack: () => void;
  handleNext: () => void;
  isFinishStep: boolean;
  productCopy: ReturnType<typeof getProductCopy>;
  progressIndex: number;
  progressPercent: number;
  showValidation: boolean;
  validationBody: string;
  wizardSteps: PlannerOnboardingStep[];
};

function PlannerOnboardingCard({
  activeStep,
  copy,
  finishSummary,
  handleBack,
  handleNext,
  isFinishStep,
  productCopy,
  progressIndex,
  progressPercent,
  showValidation,
  validationBody,
  wizardSteps,
  ...stepContentProps
}: PlannerOnboardingCardProps): JSX.Element {
  const isPhoneViewport = stepContentProps.isPhoneViewport;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-8 sm:py-12">
      <Card className="section-shell overflow-hidden shadow-[var(--shadow-strong)]">
        <CardHeader className="space-y-4 sm:space-y-5">
          <div className="space-y-2.5 sm:space-y-3">
            <p className="eyebrow text-accent">{copy.plannerOnboarding.eyebrow}</p>
            <CardTitle
              className={[
                "text-balance font-display text-foreground",
                isPhoneViewport
                  ? "text-[clamp(1.52rem,6.25vw,2.7rem)] leading-[0.98]"
                  : "text-[clamp(2rem,8vw,3.9rem)] leading-[0.93]",
              ].join(" ")}
            >
              {copy.plannerOnboarding.title}
            </CardTitle>
          </div>

          <WizardProgress
            copy={copy}
            productCopy={productCopy}
            progressIndex={progressIndex}
            progressPercent={progressPercent}
            wizardSteps={wizardSteps}
          />
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-5">
          {renderStepContent({
            ...stepContentProps,
            copy,
            currentStep: activeStep,
            productCopy,
          })}

          <WizardValidationNotice
            showValidation={showValidation}
            title={copy.plannerOnboarding.validationTitle}
            validationBody={validationBody}
          />
          <WizardFinishSummary
            finishSummary={finishSummary}
            isPhoneViewport={stepContentProps.isPhoneViewport}
            showSummary={activeStep === "finish"}
          />

          <div className="flex flex-wrap gap-3 pt-1">
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

function WizardProgress({
  copy,
  productCopy,
  progressIndex,
  progressPercent,
  wizardSteps,
}: {
  copy: ReturnType<typeof getUiCopy>;
  productCopy: ReturnType<typeof getProductCopy>;
  progressIndex: number;
  progressPercent: number;
  wizardSteps: PlannerOnboardingStep[];
}): JSX.Element {
  const currentStepNumber = (progressIndex + 1).toString().padStart(STEP_COUNTER_DIGITS, "0");
  const totalStepCount = wizardSteps.length.toString().padStart(STEP_COUNTER_DIGITS, "0");
  const activeStep = wizardSteps[progressIndex] ?? wizardSteps[0] ?? "intro";

  return (
    <div className="space-y-3.5">
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-elevated shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_92%,white),var(--accent))] transition-[width] duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-2.5 md:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-[1.1rem] border border-border/80 bg-surface-elevated px-3 py-2.5 shadow-[0_14px_28px_rgba(31,36,24,0.05)] sm:rounded-[1.2rem] sm:px-4 sm:py-3">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent">
            {currentStepNumber} / {totalStepCount}
          </p>
          <p className="text-[0.92rem] font-medium leading-5 text-foreground">
            {getStepLabel(activeStep, copy, productCopy)}
          </p>
        </div>
      </div>

      <div
        className="hidden gap-2 md:grid"
        style={{ gridTemplateColumns: `repeat(${wizardSteps.length}, minmax(0, 1fr))` }}
      >
        {wizardSteps.map((step, index) => (
          <div
            key={step}
            className={[
              "rounded-[1.2rem] border px-3 py-3 text-left text-xs transition",
              index <= progressIndex
                ? "border-accent/24 bg-accent-soft/95 text-accent shadow-[0_16px_30px_rgba(31,77,63,0.1)]"
                : "border-border/80 bg-surface-elevated text-muted",
            ].join(" ")}
          >
            <p className="font-semibold tracking-[0.16em]">0{index + 1}</p>
            <p className="mt-2 text-[11px] leading-5">{getStepLabel(step, copy, productCopy)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WizardValidationNotice({
  showValidation,
  title,
  validationBody,
}: {
  showValidation: boolean;
  title: string;
  validationBody: string;
}): JSX.Element | null {
  if (!showValidation) {
    return null;
  }

  return (
    <div className="rounded-[1.35rem] border border-border/80 bg-surface-elevated px-4 py-4 text-sm leading-6 text-muted shadow-[0_16px_32px_rgba(31,36,24,0.05)]">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2">{validationBody}</p>
    </div>
  );
}

function WizardFinishSummary({
  finishSummary,
  isPhoneViewport,
  showSummary,
}: {
  finishSummary: { label: string; value: string }[];
  isPhoneViewport: boolean;
  showSummary: boolean;
}): JSX.Element | null {
  if (!showSummary) {
    return null;
  }

  return (
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
  );
}

function buildWizardSteps({
  isPhoneViewport,
  shouldShowCareerSteps,
  shouldShowClasses,
  shouldShowJointPrograms,
  shouldShowSubjects,
}: {
  isPhoneViewport: boolean;
  shouldShowCareerSteps: boolean;
  shouldShowClasses: boolean;
  shouldShowJointPrograms: boolean;
  shouldShowSubjects: boolean;
}): PlannerOnboardingStep[] {
  const visibilityByStep: Record<PlannerOnboardingStep, boolean> = {
    academicLevel: true,
    careers: shouldShowCareerSteps,
    classes: shouldShowClasses,
    entryTerm: true,
    finish: true,
    intro: true,
    jointPrograms: shouldShowJointPrograms,
    locale: true,
    subjects: shouldShowSubjects,
    swipe: isPhoneViewport,
  };

  return MOBILE_WIZARD_STEPS.filter((step) => visibilityByStep[step]);
}

function resolveWizardActiveStep(
  currentStep: PlannerOnboardingStep,
  wizardSteps: PlannerOnboardingStep[],
  initialStep: PlannerOnboardingStep,
): PlannerOnboardingStep {
  return wizardSteps.includes(currentStep) ? currentStep : initialStep;
}

function useSyncWizardActivePlans({
  activePlanIds,
  academicLevel,
  draftEntryTerm,
  plans,
  selectedCareerIds,
  selectedJointProgramIds,
  setActivePlanIds,
  setSelectedCareerIds,
  setSelectedJointProgramIds,
}: {
  activePlanIds: string[];
  academicLevel: AcademicLevel | null;
  draftEntryTerm: string;
  plans: BulletinSummary[];
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
  setActivePlanIds: (planIds: string[]) => void;
  setSelectedCareerIds: (careerIds: string[]) => void;
  setSelectedJointProgramIds: (jointProgramIds: string[]) => void;
}): void {
  useEffect(() => {
    const graduateResetRequired =
      academicLevel === "graduate" &&
      (selectedCareerIds.length > 0 || selectedJointProgramIds.length > 0 || activePlanIds.length > 0);

    if (graduateResetRequired) {
      setSelectedCareerIds([]);
      setSelectedJointProgramIds([]);
      setActivePlanIds([]);
      return;
    }

    if (academicLevel === "jointPrograms" && selectedCareerIds.length > 0) {
      setSelectedCareerIds([]);
      return;
    }

    const nextActivePlanIds = resolveActivePlanIdsFromSelections(
      plans,
      draftEntryTerm,
      selectedCareerIds,
      selectedJointProgramIds,
    );

    if (!arraysMatch(nextActivePlanIds, activePlanIds)) {
      setActivePlanIds(nextActivePlanIds);
    }
  }, [
    academicLevel,
    activePlanIds,
    draftEntryTerm,
    plans,
    selectedCareerIds,
    selectedJointProgramIds,
    setActivePlanIds,
    setSelectedCareerIds,
    setSelectedJointProgramIds,
  ]);
}

function useSanitizeWizardJointPrograms({
  academicLevel,
  jointProgramOptions,
  selectedJointProgramIds,
  setSelectedJointProgramIds,
}: {
  academicLevel: AcademicLevel | null;
  jointProgramOptions: ReturnType<typeof buildJointProgramChoiceOptionsForLevel>;
  selectedJointProgramIds: string[];
  setSelectedJointProgramIds: (jointProgramIds: string[]) => void;
}): void {
  useEffect(() => {
    if (academicLevel === "graduate") {
      return;
    }

    const visibleJointProgramIds = new Set(
      jointProgramOptions.map((option) => option.jointProgramId),
    );
    const sanitized = selectedJointProgramIds.filter((value) => visibleJointProgramIds.has(value));

    if (!arraysMatch(sanitized, selectedJointProgramIds)) {
      setSelectedJointProgramIds(sanitized);
    }
  }, [academicLevel, jointProgramOptions, selectedJointProgramIds, setSelectedJointProgramIds]);
}

function useSeedWizardSubjects({
  academicLevel,
  recommendedSubjectCodes,
  selectedSubjectCount,
  setSelectedSubjectCodes,
}: {
  academicLevel: AcademicLevel | null;
  recommendedSubjectCodes: string[];
  selectedSubjectCount: number;
  setSelectedSubjectCodes: (subjectCodes: string[]) => void;
}): void {
  useEffect(() => {
    if (
      academicLevel !== "graduate" &&
      selectedSubjectCount === 0 &&
      recommendedSubjectCodes.length > 0
    ) {
      setSelectedSubjectCodes(recommendedSubjectCodes);
    }
  }, [academicLevel, recommendedSubjectCodes, selectedSubjectCount, setSelectedSubjectCodes]);
}

function useSyncWizardSelectedPeriod(
  activePeriodId: string | null,
  setSelectedPeriodId: (periodId: string) => void,
): void {
  useEffect(() => {
    if (activePeriodId) {
      setSelectedPeriodId(activePeriodId);
    }
  }, [activePeriodId, setSelectedPeriodId]);
}

function useSanitizeWizardSelectedOfferings({
  resolvedSelectedPeriod,
  selectedOfferingIds,
  selectedSubjectCodes,
  setSelectedOfferingIds,
}: {
  resolvedSelectedPeriod: SchedulePeriodDetail | null;
  selectedOfferingIds: string[];
  selectedSubjectCodes: string[];
  setSelectedOfferingIds: (offeringIds: string[]) => void;
}): void {
  useEffect(() => {
    if (!resolvedSelectedPeriod) {
      return;
    }

    const visibleOfferingIds = new Set(
      resolvedSelectedPeriod.offerings
        .filter((offering) => selectedSubjectCodes.includes(offering.course_code))
        .map((offering) => offering.offering_id),
    );
    const sanitizedSelectedOfferingIds = selectedOfferingIds.filter((offeringId) =>
      visibleOfferingIds.has(offeringId),
    );

    if (sanitizedSelectedOfferingIds.length !== selectedOfferingIds.length) {
      setSelectedOfferingIds(sanitizedSelectedOfferingIds);
    }
  }, [
    resolvedSelectedPeriod,
    selectedOfferingIds,
    selectedSubjectCodes,
    setSelectedOfferingIds,
  ]);
}

function buildFinishSummary({
  careerOptions,
  copy,
  draftEntryTerm,
  isPhoneViewport,
  jointProgramOptions,
  navSwipePreference,
  plannerState,
  productCopy,
  profile,
  shouldShowCareerSteps,
}: {
  careerOptions: ReturnType<typeof buildCareerChoiceOptionsForLevel>;
  copy: ReturnType<typeof getUiCopy>;
  draftEntryTerm: string;
  isPhoneViewport: boolean;
  jointProgramOptions: ReturnType<typeof buildJointProgramChoiceOptionsForLevel>;
  navSwipePreference: "natural" | "inverted" | null;
  plannerState: ReturnType<typeof usePlannerStore.getState>["state"];
  productCopy: ReturnType<typeof getProductCopy>;
  profile: ReturnType<typeof useStudentProfileStore.getState>["profile"];
  shouldShowCareerSteps: boolean;
}): { label: string; value: string }[] {
  const summary = [
    {
      label: productCopy.plannerWizard.stepLabels.academicLevel,
      value: getFinishAcademicLevelLabel(profile.academicLevel, copy, productCopy),
    },
    {
      label: copy.plannerOnboarding.finishSummary.entryTerm,
      value: draftEntryTerm
        ? formatEntryTermLabel(draftEntryTerm, copy.onboardingPage.seasonOptions)
        : copy.plannerOnboarding.finishSummary.pending,
    },
    {
      label: copy.plannerOnboarding.finishSummary.locale,
      value: copy.common.localeLabels[profile.locale],
    },
  ];

  if (shouldShowCareerSteps) {
    summary.push(
      {
        label: productCopy.plannerWizard.stepLabels.careers,
        value: getSelectedCareerSummary(profile.selectedCareerIds, careerOptions, copy),
      },
      {
        label: productCopy.plannerWizard.stepLabels.subjects,
        value: String(plannerState.selectedSubjectCodes.length),
      },
      {
        label: productCopy.plannerWizard.stepLabels.classes,
        value: String(plannerState.selectedOfferingIds.length),
      },
    );

    if (profile.selectedJointProgramIds.length > 0) {
      summary.push({
        label: productCopy.plannerWizard.stepLabels.jointPrograms,
        value: getSelectedJointProgramSummary(
          profile.selectedJointProgramIds,
          jointProgramOptions,
          copy,
        ),
      });
    }
  }

  if (profile.academicLevel === "jointPrograms") {
    summary.push(
      {
        label: productCopy.plannerWizard.stepLabels.jointPrograms,
        value: getSelectedJointProgramSummary(
          profile.selectedJointProgramIds,
          jointProgramOptions,
          copy,
        ),
      },
      {
        label: productCopy.plannerWizard.stepLabels.subjects,
        value: String(plannerState.selectedSubjectCodes.length),
      },
      {
        label: productCopy.plannerWizard.stepLabels.classes,
        value: String(plannerState.selectedOfferingIds.length),
      },
    );
  }

  if (isPhoneViewport) {
    summary.push({
      label: copy.plannerOnboarding.finishSummary.swipe,
      value: getSwipePreferenceSummary(navSwipePreference, copy),
    });
  }

  return summary;
}

function getFinishAcademicLevelLabel(
  academicLevel: AcademicLevel | null,
  copy: ReturnType<typeof getUiCopy>,
  productCopy: ReturnType<typeof getProductCopy>,
): string {
  switch (academicLevel) {
    case "graduate":
      return productCopy.plannerWizard.academicLevelOptions.graduate.title;
    case "jointPrograms":
      return productCopy.plannerWizard.academicLevelOptions.jointPrograms.title;
    case "undergraduate":
      return productCopy.plannerWizard.academicLevelOptions.undergraduate.title;
    case null:
      return copy.plannerOnboarding.finishSummary.pending;
  }
}

function getSelectedCareerSummary(
  selectedCareerIds: string[],
  careerOptions: ReturnType<typeof buildCareerChoiceOptionsForLevel>,
  copy: ReturnType<typeof getUiCopy>,
): string {
  return selectedCareerIds.length > 0
    ? selectedCareerIds
        .map((careerId) => careerOptions.find((option) => option.careerId === careerId)?.displayLabel)
        .filter((value): value is string => typeof value === "string")
        .join(" · ")
    : copy.plannerOnboarding.finishSummary.pending;
}

function getSelectedJointProgramSummary(
  selectedJointProgramIds: string[],
  jointProgramOptions: ReturnType<typeof buildJointProgramChoiceOptionsForLevel>,
  copy: ReturnType<typeof getUiCopy>,
): string {
  return selectedJointProgramIds.length > 0
    ? jointProgramOptions
        .filter((option) => selectedJointProgramIds.includes(option.jointProgramId))
        .map((option) => option.displayLabel)
        .join(" · ")
    : copy.plannerOnboarding.finishSummary.pending;
}

function getSwipePreferenceSummary(
  navSwipePreference: "natural" | "inverted" | null,
  copy: ReturnType<typeof getUiCopy>,
): string {
  switch (navSwipePreference) {
    case "inverted":
      return copy.plannerOnboarding.swipeOptions.inverted.title;
    case "natural":
      return copy.plannerOnboarding.swipeOptions.natural.title;
    case null:
      return copy.plannerOnboarding.finishSummary.pending;
  }
}

function seedPlannerWidgets(
  plannerWidgetIds: string[],
  setPlannerWidgetIds: (widgetIds: PlannerWidgetId[]) => void,
): void {
  if (plannerWidgetIds.length === 0) {
    setPlannerWidgetIds([...PLANNER_WIDGET_IDS]);
  }
}

function seedPlannerPeriod(
  defaultPeriodId: string,
  filteredPeriods: SchedulePeriodSummary[],
  selectedPeriodId: string | null,
  setSelectedPeriodId: (periodId: string) => void,
): void {
  const validPeriodIds = new Set(filteredPeriods.map((period) => period.period_id));

  if (defaultPeriodId && (!selectedPeriodId || !validPeriodIds.has(selectedPeriodId))) {
    setSelectedPeriodId(defaultPeriodId);
  }
}

function seedPlannerSubjects(
  academicLevel: AcademicLevel | null,
  selectedSubjectCount: number,
  recommendedSubjectCodes: string[],
  setSelectedSubjectCodes: (subjectCodes: string[]) => void,
): void {
  if (
    academicLevel !== "graduate" &&
    selectedSubjectCount === 0 &&
    recommendedSubjectCodes.length > 0
  ) {
    setSelectedSubjectCodes(recommendedSubjectCodes);
  }
}

function resolveEstimatedSemester(
  academicLevel: AcademicLevel | null,
  draftEntryTerm: string,
  defaultPeriod: SchedulePeriodSummary | null,
): number | null {
  return academicLevel === "graduate"
    ? null
    : estimateSemesterNumber(draftEntryTerm, defaultPeriod);
}

function buildWizardSubjectResults(
  fullSubjectDirectory: ReturnType<typeof buildSubjectDirectory>,
  recommendedDirectory: ReturnType<typeof buildSubjectDirectory>,
  selectedSubjectCodeSet: ReadonlySet<string>,
  subjectSearch: string,
): ReturnType<typeof buildSubjectDirectory> {
  const visibleDirectory = subjectSearch.trim()
    ? searchSubjectDirectory(fullSubjectDirectory, subjectSearch)
    : recommendedDirectory;

  return visibleDirectory.filter((entry) => !selectedSubjectCodeSet.has(entry.courseCode));
}

function resolveShouldShowJointPrograms(
  academicLevel: AcademicLevel | null,
  shouldShowCareerSteps: boolean,
  jointProgramOptionCount: number,
): boolean {
  return academicLevel === "jointPrograms" || (shouldShowCareerSteps && jointProgramOptionCount > 0);
}

function resolveWizardActivePeriodId(
  filteredPeriods: SchedulePeriodSummary[],
  selectedPeriodId: string | null,
  defaultPeriodId: string | null,
): string | null {
  const visiblePeriodIds = new Set(filteredPeriods.map((period) => period.period_id));

  if (selectedPeriodId && visiblePeriodIds.has(selectedPeriodId)) {
    return selectedPeriodId;
  }

  return defaultPeriodId;
}

function resolveActivePeriodLabel(
  activePeriodId: string | null,
  fallbackLabel: string,
  filteredPeriods: SchedulePeriodSummary[],
): string {
  if (activePeriodId === null) {
    return fallbackLabel;
  }

  const matchingPeriod = filteredPeriods.find((period) => period.period_id === activePeriodId);
  return formatSchedulePeriodLabel(matchingPeriod?.label ?? fallbackLabel);
}

type WizardStepState = {
  academicLevel: AcademicLevel | null;
  entryTerm: string;
  isPhoneViewport: boolean;
  navSwipePreference: "natural" | "inverted" | null;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
  selectedOfferingCount: number;
  selectedSubjectCount: number;
  shouldShowJointPrograms: boolean;
  shouldShowSubjects: boolean;
};

type StepValidationState = {
  academicLevel: AcademicLevel | null;
  activeStep: PlannerOnboardingStep;
  careerSelectionCount: number;
  draftEntryTerm: string;
  isClassSelectionLoading: boolean;
  navSwipePreference: "natural" | "inverted" | null;
  selectedOfferingCount: number;
  selectedJointProgramCount: number;
  selectedSubjectCount: number;
  validYears: string[];
  visibleOfferingCount: number;
};

type UsePlannerOnboardingWizardActionsArgs = {
  activeStep: PlannerOnboardingStep;
  draftEntryTerm: string;
  entryTermDraft: { seasonKey: EntryTermSeasonKey | ""; year: string };
  finalizePlannerSetup: () => void;
  isFinishStep: boolean;
  isFinishing: boolean;
  navSwipePreference: "natural" | "inverted" | null;
  plannerState: ReturnType<typeof usePlannerStore.getState>["state"];
  profile: ReturnType<typeof useStudentProfileStore.getState>["profile"];
  progressIndex: number;
  router: { push: (href: string) => void };
  selectedPeriodLoading: boolean;
  setAcademicLevel: (academicLevel: AcademicLevel | null) => void;
  setCareerSearch: (value: string) => void;
  setCurrentStep: (step: PlannerOnboardingStep) => void;
  setEntryTerm: (entryTerm: string) => void;
  setEntryTermDraft: (value: { seasonKey: EntryTermSeasonKey | ""; year: string }) => void;
  setLocale: (locale: LocaleCode) => void;
  setNavSwipePreference: (preference: Exclude<"natural" | "inverted" | null, null>) => void;
  setSelectedCareerIds: (careerIds: string[]) => void;
  setSelectedJointProgramIds: (jointProgramIds: string[]) => void;
  setSelectedOfferingIds: (offeringIds: string[]) => void;
  setSelectedPeriodId: (periodId: string) => void;
  setSelectedSubjectCodes: (subjectCodes: string[]) => void;
  setShowValidation: (value: boolean) => void;
  setSubjectSearch: (value: string) => void;
  visibleOfferings: SchedulePeriodDetail["offerings"];
  wizardSteps: PlannerOnboardingStep[];
  yearOptions: string[];
};

function usePlannerOnboardingWizardActions({
  activeStep,
  draftEntryTerm,
  entryTermDraft,
  finalizePlannerSetup,
  isFinishStep,
  isFinishing,
  navSwipePreference,
  plannerState,
  profile,
  progressIndex,
  router,
  selectedPeriodLoading,
  setAcademicLevel,
  setCareerSearch,
  setCurrentStep,
  setEntryTerm,
  setEntryTermDraft,
  setLocale,
  setNavSwipePreference,
  setSelectedCareerIds,
  setSelectedJointProgramIds,
  setSelectedOfferingIds,
  setSelectedPeriodId,
  setSelectedSubjectCodes,
  setShowValidation,
  setSubjectSearch,
  visibleOfferings,
  wizardSteps,
  yearOptions,
}: UsePlannerOnboardingWizardActionsArgs): {
  handleAcademicLevelChange: (nextAcademicLevel: AcademicLevel) => void;
  handleBack: () => void;
  handleCareerToggle: (careerId: string) => void;
  handleEntrySeasonChange: (nextSeasonKey: EntryTermSeasonKey | "") => void;
  handleEntryYearChange: (nextYear: string) => void;
  handleJointProgramToggle: (jointProgramId: string) => void;
  handleLocaleChange: (nextLocale: LocaleCode) => void;
  handleNext: () => void;
  handleSwipePreferenceSelection: (preference: "natural" | "inverted") => void;
} {
  function resetDownstreamPlannerState(): void {
    setSelectedOfferingIds([]);
    setSelectedPeriodId("");
    setSelectedSubjectCodes([]);
    setCareerSearch("");
    setSubjectSearch("");
  }

  function handleAcademicLevelChange(nextAcademicLevel: AcademicLevel): void {
    setAcademicLevel(nextAcademicLevel);
    setEntryTerm("");
    setEntryTermDraft({ seasonKey: "", year: "" });
    setSelectedCareerIds([]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleEntrySeasonChange(nextSeasonKey: EntryTermSeasonKey | ""): void {
    const nextDraft = { ...entryTermDraft, seasonKey: nextSeasonKey };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setSelectedCareerIds([]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleEntryYearChange(nextYear: string): void {
    const nextDraft = { ...entryTermDraft, year: nextYear };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setSelectedCareerIds([]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleCareerToggle(careerId: string): void {
    const alreadySelected = profile.selectedCareerIds.includes(careerId);
    const nextSelectedCareerIds = alreadySelected
      ? profile.selectedCareerIds.filter((value) => value !== careerId)
      : profile.selectedCareerIds.length >= MAX_SELECTED_CAREERS
        ? profile.selectedCareerIds
        : [...profile.selectedCareerIds, careerId];

    if (!arraysMatch(nextSelectedCareerIds, profile.selectedCareerIds)) {
      setSelectedCareerIds(nextSelectedCareerIds);
      setSelectedJointProgramIds([]);
      resetDownstreamPlannerState();
    }

    setShowValidation(false);
  }

  function handleLocaleChange(nextLocale: LocaleCode): void {
    setLocale(nextLocale);
    setShowValidation(false);
  }

  function handleJointProgramToggle(jointProgramId: string): void {
    const alreadySelected = profile.selectedJointProgramIds.includes(jointProgramId);
    const nextSelectedJointProgramIds = alreadySelected
      ? profile.selectedJointProgramIds.filter((value) => value !== jointProgramId)
      : [...profile.selectedJointProgramIds, jointProgramId];

    setSelectedJointProgramIds(nextSelectedJointProgramIds);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleSwipePreferenceSelection(preference: "natural" | "inverted"): void {
    setNavSwipePreference(preference);
    setShowValidation(false);
  }

  function handleBack(): void {
    if (isFinishing) {
      return;
    }

    setShowValidation(false);

    if (progressIndex <= 0) {
      router.push("/planner");
      return;
    }

    setCurrentStep(wizardSteps[progressIndex - 1] ?? wizardSteps[0] ?? "intro");
  }

  function handleNext(): void {
    if (isFinishing) {
      return;
    }

    const nextIsValid = isStepValid({
      academicLevel: profile.academicLevel,
      activeStep,
      careerSelectionCount: profile.selectedCareerIds.length,
      draftEntryTerm,
      isClassSelectionLoading: selectedPeriodLoading,
      navSwipePreference,
      selectedJointProgramCount: profile.selectedJointProgramIds.length,
      selectedOfferingCount: plannerState.selectedOfferingIds.length,
      selectedSubjectCount: plannerState.selectedSubjectCodes.length,
      validYears: yearOptions,
      visibleOfferingCount: visibleOfferings.length,
    });

    if (!nextIsValid) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);

    if (isFinishStep) {
      finalizePlannerSetup();
      return;
    }

    setCurrentStep(wizardSteps[progressIndex + 1] ?? wizardSteps[wizardSteps.length - 1] ?? "finish");
  }

  return {
    handleAcademicLevelChange,
    handleBack,
    handleCareerToggle,
    handleEntrySeasonChange,
    handleEntryYearChange,
    handleJointProgramToggle,
    handleLocaleChange,
    handleNext,
    handleSwipePreferenceSelection,
  };
}

type RenderStepContentProps = {
  activePeriodLabel: string;
  academicLevel: AcademicLevel | null;
  careerChoiceMode: ReturnType<typeof getCareerChoiceMode>;
  careerOptions: ReturnType<typeof buildCareerChoiceOptionsForLevel>;
  careerSearch: string;
  classSelectionError: string | null;
  classSelectionLoading: boolean;
  copy: ReturnType<typeof getUiCopy>;
  currentStep: PlannerOnboardingStep;
  entryTermDraft: { seasonKey: EntryTermSeasonKey | ""; year: string };
  filteredCareerOptions: ReturnType<typeof buildCareerChoiceOptionsForLevel>;
  handleAcademicLevelChange: (nextAcademicLevel: AcademicLevel) => void;
  handleCareerToggle: (careerId: string) => void;
  handleEntrySeasonChange: (nextSeasonKey: EntryTermSeasonKey | "") => void;
  handleEntryYearChange: (nextYear: string) => void;
  handleJointProgramToggle: (jointProgramId: string) => void;
  handleLocaleChange: (nextLocale: LocaleCode) => void;
  handleSwipePreferenceSelection: (preference: "natural" | "inverted") => void;
  isPhoneViewport: boolean;
  jointProgramOptions: ReturnType<typeof buildJointProgramChoiceOptionsForLevel>;
  locale: LocaleCode;
  navSwipePreference: "natural" | "inverted" | null;
  selectedOfferingIds: string[];
  productCopy: ReturnType<typeof getProductCopy>;
  selectedSubjectCodes: string[];
  selectedSubjectEntries: ReturnType<typeof buildSelectedSubjectSummary>;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
  setCareerSearch: (value: string) => void;
  setSubjectSearch: (value: string) => void;
  subjectResults: ReturnType<typeof buildSubjectDirectory>;
  subjectSearch: string;
  subjectTitleLookup: ReadonlyMap<string, string>;
  toggleOfferingId: (offeringId: string) => void;
  toggleSubjectCode: (subjectCode: string) => void;
  visibleOfferings: SchedulePeriodDetail["offerings"];
  yearOptions: string[];
};

function renderStepContent(props: RenderStepContentProps): JSX.Element | null {
  return STEP_CONTENT_RENDERERS[props.currentStep](props);
}

const STEP_CONTENT_RENDERERS: Record<
  PlannerOnboardingStep,
  (props: RenderStepContentProps) => JSX.Element | null
> = {
  intro: renderIntroStep,
  academicLevel: renderAcademicLevelStep,
  entryTerm: renderEntryTermStep,
  locale: renderLocaleStep,
  careers: renderCareersStep,
  jointPrograms: renderJointProgramsStep,
  subjects: renderSubjectsStep,
  classes: renderClassesStep,
  swipe: renderSwipeStep,
  finish: renderFinishStep,
};

function renderIntroStep({ copy }: RenderStepContentProps): JSX.Element {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-2.5 sm:space-y-3">
        <p className="text-sm font-medium text-foreground">{copy.plannerOnboarding.introTitle}</p>
        <p className="text-sm leading-5.5 text-muted sm:leading-6">
          {copy.plannerOnboarding.introBody}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {copy.plannerOnboarding.introCards.map((card) => (
          <div key={card.title} className="soft-panel px-3.5 py-3 sm:px-4 sm:py-4">
            <p className="font-semibold text-foreground">{card.title}</p>
            <p className="mt-2 text-sm leading-5.5 text-muted sm:leading-6">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderAcademicLevelStep({
  academicLevel,
  handleAcademicLevelChange,
  productCopy,
}: RenderStepContentProps): JSX.Element {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">
          {productCopy.plannerWizard.academicLevelTitle}
        </p>
        <p className="text-sm leading-6 text-muted">{productCopy.plannerWizard.academicLevelBody}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ACADEMIC_LEVELS.map((value) => {
          const selected = academicLevel === value;
          const option = productCopy.plannerWizard.academicLevelOptions[value];
          return (
            <button
              key={value}
              aria-pressed={selected}
              className={getSelectableChoiceCardClassName(selected)}
              onClick={() => handleAcademicLevelChange(value)}
              type="button"
            >
              <div className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{option.title}</span>
                <span className="mt-2 block text-sm leading-6 text-muted">{option.body}</span>
              </div>
              <SelectionIndicator selected={selected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderEntryTermStep({
  copy,
  entryTermDraft,
  handleEntrySeasonChange,
  handleEntryYearChange,
  yearOptions,
}: RenderStepContentProps): JSX.Element {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{copy.plannerOnboarding.entryTermTitle}</p>
        <p className="text-sm leading-6 text-muted">{copy.plannerOnboarding.entryTermBody}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ENTRY_TERM_SEASON_KEYS.map((seasonKey) => (
          <button
            key={seasonKey}
            aria-pressed={entryTermDraft.seasonKey === seasonKey}
            className={getSelectableChoiceCardClassName(entryTermDraft.seasonKey === seasonKey)}
            onClick={() => handleEntrySeasonChange(seasonKey)}
            type="button"
          >
            <div className="min-w-0 flex-1">
              <span className="block font-semibold text-foreground">
                {copy.onboardingPage.seasonOptions[seasonKey]}
              </span>
            </div>
            <SelectionIndicator selected={entryTermDraft.seasonKey === seasonKey} />
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
}

function renderLocaleStep({
  copy,
  handleLocaleChange,
  locale,
  productCopy,
}: RenderStepContentProps): JSX.Element {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{productCopy.plannerWizard.localeTitle}</p>
        <p className="text-sm leading-6 text-muted">{productCopy.plannerWizard.localeBody}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SUPPORTED_LOCALES.map((localeCode) => {
          const selected = locale === localeCode;
          return (
            <button
              key={localeCode}
              aria-pressed={selected}
              className={getSelectableChoiceCardClassName(selected)}
              onClick={() => handleLocaleChange(localeCode)}
              type="button"
            >
              <div className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">
                  {copy.common.localeLabels[localeCode]}
                </span>
              </div>
              <SelectionIndicator selected={selected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderCareersStep({
  careerChoiceMode,
  careerOptions,
  careerSearch,
  copy,
  filteredCareerOptions,
  handleCareerToggle,
  productCopy,
  selectedCareerIds,
  setCareerSearch,
}: RenderStepContentProps): JSX.Element {
  const hasVisibleCareerOptions = careerOptions.length > 0 && filteredCareerOptions.length > 0;

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{productCopy.plannerWizard.careerTitle}</p>
        <p className="text-sm leading-6 text-muted">{productCopy.plannerWizard.careerBody}</p>
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

      {hasVisibleCareerOptions ? (
        <div className="grid gap-3">
          {filteredCareerOptions.map((option) => {
            const selected = selectedCareerIds.includes(option.careerId);
            return (
              <button
                key={option.careerId}
                aria-pressed={selected}
                className={getSelectableChoiceCardClassName(selected)}
                onClick={() => handleCareerToggle(option.careerId)}
                type="button"
              >
                <div className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">{option.displayLabel}</span>
                </div>
                <SelectionIndicator selected={selected} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="soft-panel text-sm leading-6 text-muted">
          {copy.plannerOnboarding.programSearchEmpty}
        </div>
      )}
    </div>
  );
}

function renderJointProgramsStep({
  academicLevel,
  jointProgramOptions,
  productCopy,
  selectedCareerIds,
  selectedJointProgramIds,
  handleJointProgramToggle,
}: RenderStepContentProps): JSX.Element {
  const jointProgramState = getJointProgramStepState(
    academicLevel,
    jointProgramOptions.length,
    selectedCareerIds.length,
  );

  if (jointProgramState === "missingCareerSelection") {
    return (
      <div className="space-y-5">
        <StepHeading
          body={productCopy.plannerWizard.jointProgramsBody}
          title={productCopy.plannerWizard.jointProgramsTitle}
        />
        <div className="soft-panel text-sm leading-6 text-muted">
          {productCopy.plannerWizard.careerNone}
        </div>
      </div>
    );
  }

  if (jointProgramState === "empty") {
    return (
      <div className="space-y-5">
        <StepHeading
          body={productCopy.plannerWizard.jointProgramsBody}
          title={productCopy.plannerWizard.jointProgramsTitle}
        />
        <div className="soft-panel text-sm leading-6 text-muted">
          {productCopy.plannerWizard.jointProgramsEmpty}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <StepHeading
        body={productCopy.plannerWizard.jointProgramsBody}
        title={productCopy.plannerWizard.jointProgramsTitle}
      />
      <div className="grid gap-3">
        {jointProgramOptions.map((option) => {
          const selected = selectedJointProgramIds.includes(option.jointProgramId);
          return (
            <button
              key={option.jointProgramId}
              aria-pressed={selected}
              className={getSelectableChoiceCardClassName(selected)}
              onClick={() => handleJointProgramToggle(option.jointProgramId)}
              type="button"
            >
              <div className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{option.displayLabel}</span>
              </div>
              <SelectionIndicator selected={selected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderSubjectsStep({
  productCopy,
  selectedSubjectCodes,
  selectedSubjectEntries,
  setSubjectSearch,
  subjectResults,
  subjectSearch,
  toggleSubjectCode,
}: RenderStepContentProps): JSX.Element {
  return (
    <div className="space-y-5">
      <StepHeading
        body={productCopy.plannerWizard.subjectsBody}
        title={productCopy.plannerWizard.subjectsTitle}
      />

      <div className="soft-panel flex flex-wrap items-center justify-between gap-3 text-sm leading-6 text-muted">
        <span>{productCopy.plannerWizard.subjectsCount}</span>
        <span className="font-semibold text-foreground">{selectedSubjectCodes.length}</span>
      </div>

      <SelectedWizardSubjects
        productCopy={productCopy}
        selectedSubjectEntries={selectedSubjectEntries}
        toggleSubjectCode={toggleSubjectCode}
      />

      <input
        aria-label={productCopy.plannerSettings.subjectsSearch}
        className={INPUT_CLASS_NAME}
        onChange={(event) => setSubjectSearch(event.target.value)}
        placeholder={productCopy.plannerWizard.subjectsSearchPlaceholder}
        type="search"
        value={subjectSearch}
      />

      <AvailableWizardSubjects
        productCopy={productCopy}
        selectedSubjectEntries={selectedSubjectEntries}
        selectedSubjectCodes={selectedSubjectCodes}
        subjectResults={subjectResults}
        subjectSearch={subjectSearch}
        toggleSubjectCode={toggleSubjectCode}
      />
    </div>
  );
}

function renderClassesStep({
  activePeriodLabel,
  classSelectionError,
  classSelectionLoading,
  locale,
  productCopy,
  selectedOfferingIds,
  subjectTitleLookup,
  toggleOfferingId,
  visibleOfferings,
}: RenderStepContentProps): JSX.Element {
  return (
    <div className="space-y-5">
      <StepHeading
        body={productCopy.plannerWizard.classesBody}
        title={productCopy.plannerWizard.classesTitle}
      />

      <div className="soft-panel flex flex-wrap items-center justify-between gap-3 text-sm leading-6 text-muted">
        <span>{productCopy.plannerWizard.classesCount}</span>
        <span className="font-semibold text-foreground">{selectedOfferingIds.length}</span>
      </div>

      <PublicClassSelectionPanel
        activePeriodLabel={activePeriodLabel}
        isLoading={classSelectionLoading}
        loadError={classSelectionError}
        locale={locale}
        offerings={visibleOfferings}
        selectedOfferingIds={selectedOfferingIds}
        subjectTitleLookup={subjectTitleLookup}
        toggleOfferingId={toggleOfferingId}
      />
    </div>
  );
}

function renderSwipeStep({
  copy,
  handleSwipePreferenceSelection,
  isPhoneViewport,
  navSwipePreference,
}: RenderStepContentProps): JSX.Element | null {
  if (!isPhoneViewport) {
    return null;
  }

  return (
    <div className="space-y-5">
      <StepHeading
        body={copy.plannerOnboarding.swipePreferenceBody}
        title={copy.plannerOnboarding.swipePreferenceTitle}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {(["natural", "inverted"] as const).map((preference) => {
          const selected = navSwipePreference === preference;
          return (
            <button
              key={preference}
              aria-pressed={selected}
              className={getSelectableChoiceCardClassName(selected)}
              onClick={() => handleSwipePreferenceSelection(preference)}
              type="button"
            >
              <div className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">
                  {copy.plannerOnboarding.swipeOptions[preference].title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-muted">
                  {copy.plannerOnboarding.swipeOptions[preference].body}
                </span>
              </div>
              <SelectionIndicator selected={selected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderFinishStep({ copy }: RenderStepContentProps): JSX.Element {
  return (
    <div className="space-y-5">
      <StepHeading
        body={copy.plannerOnboarding.finishBody}
        title={copy.plannerOnboarding.finishTitle}
      />
      <div className="soft-panel">
        <p className="font-semibold text-foreground">{copy.plannerOnboarding.finishHighlight}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{copy.plannerOnboarding.finishSupport}</p>
      </div>
    </div>
  );
}

function StepHeading({ body, title }: { body: string; title: string }): JSX.Element {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="text-sm leading-5.5 text-muted sm:leading-6">{body}</p>
    </div>
  );
}

function getJointProgramStepState(
  academicLevel: AcademicLevel | null,
  jointProgramOptionCount: number,
  selectedCareerCount: number,
): "empty" | "missingCareerSelection" | "ready" {
  if (academicLevel === "undergraduate" && selectedCareerCount === 0) {
    return "missingCareerSelection";
  }

  return jointProgramOptionCount === 0 ? "empty" : "ready";
}

function SelectedWizardSubjects({
  productCopy,
  selectedSubjectEntries,
  toggleSubjectCode,
}: {
  productCopy: ReturnType<typeof getProductCopy>;
  selectedSubjectEntries: ReturnType<typeof buildSelectedSubjectSummary>;
  toggleSubjectCode: (subjectCode: string) => void;
}): JSX.Element {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{productCopy.plannerWizard.subjectsSelected}</p>
      {selectedSubjectEntries.length === 0 ? (
        <div className="soft-panel text-sm leading-5.5 text-muted sm:leading-6">
          {productCopy.plannerWizard.subjectsDefaultEmpty}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {selectedSubjectEntries.map((entry) => (
            <button
              key={entry.courseCode}
              aria-pressed
              className={getSelectableChoiceCardClassName(true)}
              onClick={() => toggleSubjectCode(entry.courseCode)}
              type="button"
            >
              <div className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{entry.courseCode}</span>
                <span className="mt-2 block text-sm leading-6 text-muted">{entry.title}</span>
              </div>
              <SelectionIndicator selected />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AvailableWizardSubjects({
  productCopy,
  selectedSubjectEntries,
  selectedSubjectCodes,
  subjectResults,
  subjectSearch,
  toggleSubjectCode,
}: {
  productCopy: ReturnType<typeof getProductCopy>;
  selectedSubjectEntries: ReturnType<typeof buildSelectedSubjectSummary>;
  selectedSubjectCodes: string[];
  subjectResults: ReturnType<typeof buildSubjectDirectory>;
  subjectSearch: string;
  toggleSubjectCode: (subjectCode: string) => void;
}): JSX.Element {
  const sectionTitle = subjectSearch.trim()
    ? productCopy.common.search
    : productCopy.plannerWizard.subjectsRecommended;
  const emptyMessage =
    selectedSubjectEntries.length > 0 && !subjectSearch.trim()
      ? productCopy.plannerWizard.subjectsRecommendedApplied
      : productCopy.plannerWizard.subjectsDefaultEmpty;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{sectionTitle}</p>
      {subjectResults.length === 0 ? (
        <div className="soft-panel text-sm leading-5.5 text-muted sm:leading-6">{emptyMessage}</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {subjectResults.map((entry) => {
            const selected = selectedSubjectCodes.includes(entry.courseCode);
            return (
              <button
                key={entry.courseCode}
                aria-pressed={selected}
                className={getSelectableChoiceCardClassName(selected)}
                onClick={() => toggleSubjectCode(entry.courseCode)}
                type="button"
              >
                <div className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">{entry.courseCode}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{entry.title}</span>
                </div>
                <SelectionIndicator selected={selected} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getInitialWizardStep(
  academicLevel: AcademicLevel | null,
  entryTerm: string,
  selectedCareerIds: string[],
  selectedJointProgramIds: string[],
  selectedSubjectCount: number,
  selectedOfferingCount: number,
  navSwipePreference: "natural" | "inverted" | null,
  shouldShowJointPrograms: boolean,
  shouldShowSubjects: boolean,
  isPhoneViewport: boolean,
): PlannerOnboardingStep {
  const state: WizardStepState = {
    academicLevel,
    entryTerm,
    isPhoneViewport,
    navSwipePreference,
    selectedCareerIds,
    selectedJointProgramIds,
    selectedOfferingCount,
    selectedSubjectCount,
    shouldShowJointPrograms,
    shouldShowSubjects,
  };

  return INITIAL_STEP_MATCHERS.find(({ matches }) => matches(state))?.step ?? "finish";
}

function getStepLabel(
  step: PlannerOnboardingStep,
  copy: ReturnType<typeof getUiCopy>,
  productCopy: ReturnType<typeof getProductCopy>,
): string {
  switch (step) {
    case "academicLevel":
      return productCopy.plannerWizard.stepLabels.academicLevel;
    case "careers":
      return productCopy.plannerWizard.stepLabels.careers;
    case "jointPrograms":
      return productCopy.plannerWizard.stepLabels.jointPrograms;
    case "classes":
      return productCopy.plannerWizard.stepLabels.classes;
    case "locale":
      return productCopy.plannerWizard.stepLabels.locale;
    case "subjects":
      return productCopy.plannerWizard.stepLabels.subjects;
    default:
      return copy.plannerOnboarding.stepLabels[step];
  }
}

function getValidationBody({
  academicLevel,
  activeStep,
  copy,
  productCopy,
  selectedCareerIds,
  selectedJointProgramIds,
}: {
  academicLevel: AcademicLevel | null;
  activeStep: PlannerOnboardingStep;
  copy: ReturnType<typeof getUiCopy>;
  productCopy: ReturnType<typeof getProductCopy>;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
}): string {
  const resolver = STEP_VALIDATION_BODY_RESOLVERS[activeStep];

  return resolver
    ? resolver({
        academicLevel,
        copy,
        productCopy,
        selectedCareerIds,
        selectedJointProgramIds,
      })
    : getFallbackValidationBody(copy, activeStep);
}

const FALLBACK_VALIDATION_BODY_KEYS: Record<
  PlannerOnboardingStep,
  keyof ReturnType<typeof getUiCopy>["plannerOnboarding"]["validationBody"]
> = {
  academicLevel: "academicLevel",
  careers: "program",
  classes: "subjects",
  entryTerm: "entryTerm",
  finish: "finish",
  intro: "intro",
  jointPrograms: "program",
  locale: "intro",
  subjects: "subjects",
  swipe: "swipe",
};

function getFallbackValidationBody(
  copy: ReturnType<typeof getUiCopy>,
  activeStep: PlannerOnboardingStep,
): string {
  return copy.plannerOnboarding.validationBody[FALLBACK_VALIDATION_BODY_KEYS[activeStep]];
}

function isStepValid({
  academicLevel,
  activeStep,
  careerSelectionCount,
  draftEntryTerm,
  isClassSelectionLoading,
  navSwipePreference,
  selectedOfferingCount,
  selectedJointProgramCount,
  selectedSubjectCount,
  visibleOfferingCount,
  validYears,
}: {
  academicLevel: AcademicLevel | null;
  activeStep: PlannerOnboardingStep;
  careerSelectionCount: number;
  draftEntryTerm: string;
  isClassSelectionLoading: boolean;
  navSwipePreference: "natural" | "inverted" | null;
  selectedOfferingCount: number;
  selectedJointProgramCount: number;
  selectedSubjectCount: number;
  visibleOfferingCount: number;
  validYears: string[];
}): boolean {
  return STEP_VALIDATORS[activeStep]({
    academicLevel,
    activeStep,
    careerSelectionCount,
    draftEntryTerm,
    isClassSelectionLoading,
    navSwipePreference,
    selectedJointProgramCount,
    selectedOfferingCount,
    selectedSubjectCount,
    validYears,
    visibleOfferingCount,
  });
}

function shouldCollectJointPrograms(academicLevel: AcademicLevel | null): boolean {
  return academicLevel === "undergraduate" || academicLevel === "jointPrograms";
}

const INITIAL_STEP_MATCHERS: readonly {
  matches: (state: WizardStepState) => boolean;
  step: PlannerOnboardingStep;
}[] = [
  { matches: isWizardBlankState, step: "intro" },
  { matches: (state) => state.academicLevel === null, step: "academicLevel" },
  { matches: hasIncompleteWizardEntryTerm, step: "entryTerm" },
  { matches: needsCareerSelectionStep, step: "careers" },
  { matches: needsJointProgramSelectionStep, step: "jointPrograms" },
  { matches: needsSubjectSelectionStep, step: "subjects" },
  { matches: needsClassSelectionStep, step: "classes" },
  { matches: needsSwipePreferenceStep, step: "swipe" },
] as const;

type StepValidationBodyArgs = {
  academicLevel: AcademicLevel | null;
  copy: ReturnType<typeof getUiCopy>;
  productCopy: ReturnType<typeof getProductCopy>;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
};

const STEP_VALIDATION_BODY_RESOLVERS: Partial<
  Record<PlannerOnboardingStep, (args: StepValidationBodyArgs) => string>
> = {
  academicLevel: ({ productCopy }) => productCopy.plannerWizard.validation.academicLevel,
  careers: ({ productCopy, selectedCareerIds }) =>
    selectedCareerIds.length >= MAX_SELECTED_CAREERS
      ? productCopy.plannerWizard.careerLimit
      : productCopy.plannerWizard.validation.careers,
  classes: ({ productCopy }) => productCopy.plannerWizard.validation.classes,
  jointPrograms: ({ academicLevel, productCopy, selectedJointProgramIds }) =>
    academicLevel === "jointPrograms" && selectedJointProgramIds.length === 0
      ? productCopy.plannerWizard.validation.jointProgramsRequired
      : productCopy.plannerWizard.validation.jointPrograms,
  locale: ({ productCopy }) => productCopy.plannerWizard.validation.locale,
  subjects: ({ academicLevel, copy, productCopy }) =>
    academicLevel === "graduate"
      ? copy.plannerOnboarding.validationBody.finish
      : productCopy.plannerWizard.validation.subjects,
};

const STEP_VALIDATORS: Record<
  PlannerOnboardingStep,
  (state: StepValidationState) => boolean
> = {
  intro: () => true,
  finish: () => true,
  academicLevel: ({ academicLevel }) => academicLevel !== null,
  entryTerm: ({ draftEntryTerm, validYears }) => isValidWizardEntryTerm(draftEntryTerm, validYears),
  locale: () => true,
  jointPrograms: ({ academicLevel, selectedJointProgramCount }) =>
    academicLevel === "jointPrograms" ? selectedJointProgramCount > 0 : true,
  careers: ({ academicLevel, careerSelectionCount }) =>
    academicLevel === "graduate"
      ? true
      : careerSelectionCount > 0 && careerSelectionCount <= MAX_SELECTED_CAREERS,
  subjects: ({ academicLevel, selectedSubjectCount }) =>
    academicLevel === "graduate" ? true : selectedSubjectCount > 0,
  classes: ({ academicLevel, isClassSelectionLoading, selectedOfferingCount, visibleOfferingCount }) =>
    academicLevel === "graduate"
      ? true
      : !isClassSelectionLoading && (selectedOfferingCount > 0 || visibleOfferingCount === 0),
  swipe: ({ navSwipePreference }) => navSwipePreference !== null,
};

function isWizardBlankState(state: WizardStepState): boolean {
  const parsedEntryTerm = parseEntryTerm(state.entryTerm);

  return (
    state.academicLevel === null &&
    !parsedEntryTerm.seasonKey &&
    !parsedEntryTerm.year &&
    state.selectedCareerIds.length === 0 &&
    state.selectedJointProgramIds.length === 0 &&
    state.selectedSubjectCount === 0 &&
    state.selectedOfferingCount === 0 &&
    state.navSwipePreference === null
  );
}

function hasIncompleteWizardEntryTerm(state: WizardStepState): boolean {
  const parsedEntryTerm = parseEntryTerm(state.entryTerm);
  return !parsedEntryTerm.seasonKey || !parsedEntryTerm.year;
}

function needsCareerSelectionStep(state: WizardStepState): boolean {
  return state.academicLevel === "undergraduate" && state.selectedCareerIds.length === 0;
}

function needsJointProgramSelectionStep(state: WizardStepState): boolean {
  return (
    state.shouldShowJointPrograms &&
    shouldCollectJointPrograms(state.academicLevel) &&
    state.selectedJointProgramIds.length === 0 &&
    state.selectedSubjectCount === 0
  );
}

function needsSubjectSelectionStep(state: WizardStepState): boolean {
  return (
    state.academicLevel !== "graduate" &&
    state.shouldShowSubjects &&
    state.selectedSubjectCount === 0
  );
}

function needsClassSelectionStep(state: WizardStepState): boolean {
  return (
    state.academicLevel !== "graduate" &&
    state.shouldShowSubjects &&
    state.selectedOfferingCount === 0
  );
}

function needsSwipePreferenceStep(state: WizardStepState): boolean {
  return state.isPhoneViewport && state.navSwipePreference === null;
}

function isValidWizardEntryTerm(draftEntryTerm: string, validYears: string[]): boolean {
  const parsedEntryTerm = parseEntryTerm(draftEntryTerm);
  return parsedEntryTerm.seasonKey.length > 0 && validYears.includes(parsedEntryTerm.year);
}

function getSelectableChoiceCardClassName(selected: boolean): string {
  return [
    "choice-card items-start justify-between text-left",
    selected
      ? "border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]"
      : "",
  ].join(" ");
}

function SelectionIndicator({ selected }: { selected: boolean }): JSX.Element {
  return (
    <span
      aria-hidden
      className={[
        "mt-1 h-4 w-4 shrink-0 rounded-full border transition",
        selected
          ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(31,77,63,0.12)]"
          : "border-border bg-transparent",
      ].join(" ")}
    />
  );
}

function arraysMatch(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export function getPlannerSetupDelayMs(randomValue: number = Math.random()): number {
  const clampedRandom = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 0.999999)
    : 0.5;

  return (
    SETUP_DELAY_MIN_MS +
    Math.floor(clampedRandom * (SETUP_DELAY_MAX_MS - SETUP_DELAY_MIN_MS + 1))
  );
}
