"use client";

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

interface PlannerOnboardingWizardProps {
  bulletinDocuments: BulletinDocument[];
  periods: SchedulePeriodSummary[];
  plans: BulletinSummary[];
}

export function PlannerOnboardingWizard({
  bulletinDocuments,
  periods,
  plans,
}: PlannerOnboardingWizardProps) {
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
  const estimatedSemester =
    profile.academicLevel === "graduate"
      ? null
      : estimateSemesterNumber(draftEntryTerm, defaultPeriod);
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
      (subjectSearch.trim()
        ? searchSubjectDirectory(fullSubjectDirectory, subjectSearch)
        : recommendedDirectory
      ).filter((entry) => !selectedSubjectCodeSet.has(entry.courseCode)),
    [fullSubjectDirectory, recommendedDirectory, selectedSubjectCodeSet, subjectSearch],
  );
  const selectedSubjectEntries = useMemo(
    () => buildSelectedSubjectSummary(plannerState.selectedSubjectCodes, fullSubjectDirectory),
    [fullSubjectDirectory, plannerState.selectedSubjectCodes],
  );
  const shouldShowCareerSteps = profile.academicLevel === "undergraduate";
  const shouldShowJointPrograms =
    profile.academicLevel === "jointPrograms" ||
    (shouldShowCareerSteps && jointProgramOptions.length > 0);
  const shouldShowSubjects = profile.academicLevel !== "graduate";
  const shouldShowClasses = shouldShowSubjects;
  const wizardSteps = (isPhoneViewport
    ? MOBILE_WIZARD_STEPS
    : MOBILE_WIZARD_STEPS.filter((step) => step !== "swipe")
  ).filter((step) => {
    if (
      step === "careers" ||
      step === "jointPrograms" ||
      step === "subjects" ||
      step === "classes"
    ) {
      if (step === "careers" && !shouldShowCareerSteps) {
        return false;
      }
      if (step === "jointPrograms") {
        return shouldShowJointPrograms;
      }
      if (step === "subjects") {
        return shouldShowSubjects;
      }
      if (step === "classes") {
        return shouldShowClasses;
      }
    }

    return true;
  });
  const activePeriodId = filteredPeriods.some((period) => period.period_id === plannerState.selectedPeriodId)
    ? plannerState.selectedPeriodId
    : defaultPeriod?.period_id ?? null;
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
  const activeStep = wizardSteps.includes(currentStep)
    ? currentStep
    : getInitialWizardStep(
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
    if (profile.academicLevel === "graduate") {
      if (
        profile.selectedCareerIds.length > 0 ||
        profile.selectedJointProgramIds.length > 0 ||
        profile.activePlanIds.length > 0
      ) {
        setSelectedCareerIds([]);
        setSelectedJointProgramIds([]);
        setActivePlanIds([]);
      }
      return;
    }

    if (profile.academicLevel === "jointPrograms" && profile.selectedCareerIds.length > 0) {
      setSelectedCareerIds([]);
      return;
    }

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
    profile.academicLevel,
    profile.selectedCareerIds,
    profile.selectedJointProgramIds,
    setActivePlanIds,
    setSelectedCareerIds,
    setSelectedJointProgramIds,
  ]);

  useEffect(() => {
    if (profile.academicLevel === "graduate") {
      return;
    }

    const visibleJointProgramIds = new Set(jointProgramOptions.map((option) => option.jointProgramId));
    const sanitized = profile.selectedJointProgramIds.filter((value) =>
      visibleJointProgramIds.has(value),
    );

    if (arraysMatch(sanitized, profile.selectedJointProgramIds)) {
      return;
    }

    setSelectedJointProgramIds(sanitized);
  }, [
    profile.academicLevel,
    profile.selectedJointProgramIds,
    jointProgramOptions,
    setSelectedJointProgramIds,
  ]);

  useEffect(() => {
    if (
      profile.academicLevel === "graduate" ||
      plannerState.selectedSubjectCodes.length > 0 ||
      recommendedSubjectCodes.length === 0
    ) {
      return;
    }

    setSelectedSubjectCodes(recommendedSubjectCodes);
  }, [
    plannerState.selectedSubjectCodes.length,
    profile.academicLevel,
    recommendedSubjectCodes,
    setSelectedSubjectCodes,
  ]);

  useEffect(() => {
    if (activePeriodId) {
      setSelectedPeriodId(activePeriodId);
    }
  }, [activePeriodId, setSelectedPeriodId]);

  useEffect(() => {
    if (!resolvedSelectedPeriod) {
      return;
    }

    const visibleOfferingIds = new Set(
      resolvedSelectedPeriod.offerings
        .filter((offering) => plannerState.selectedSubjectCodes.includes(offering.course_code))
        .map((offering) => offering.offering_id),
    );
    const sanitizedSelectedOfferingIds = plannerState.selectedOfferingIds.filter((offeringId) =>
      visibleOfferingIds.has(offeringId),
    );

    if (sanitizedSelectedOfferingIds.length !== plannerState.selectedOfferingIds.length) {
      setSelectedOfferingIds(sanitizedSelectedOfferingIds);
    }
  }, [
    plannerState.selectedOfferingIds,
    plannerState.selectedSubjectCodes,
    resolvedSelectedPeriod,
    setSelectedOfferingIds,
  ]);

  const finishSummary = [
    {
      label: productCopy.plannerWizard.stepLabels.academicLevel,
      value:
        profile.academicLevel === "graduate"
          ? productCopy.plannerWizard.academicLevelOptions.graduate.title
          : profile.academicLevel === "jointPrograms"
            ? productCopy.plannerWizard.academicLevelOptions.jointPrograms.title
            : profile.academicLevel === "undergraduate"
              ? productCopy.plannerWizard.academicLevelOptions.undergraduate.title
              : copy.plannerOnboarding.finishSummary.pending,
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
    ...(shouldShowCareerSteps
      ? [
          {
            label: productCopy.plannerWizard.stepLabels.careers,
            value:
              profile.selectedCareerIds.length > 0
                ? profile.selectedCareerIds
                    .map(
                      (careerId) =>
                        careerOptions.find((option) => option.careerId === careerId)?.displayLabel,
                    )
                    .filter((value): value is string => typeof value === "string")
                    .join(" · ")
                : copy.plannerOnboarding.finishSummary.pending,
          },
          {
            label: productCopy.plannerWizard.stepLabels.subjects,
            value: String(plannerState.selectedSubjectCodes.length),
          },
          {
            label: productCopy.plannerWizard.stepLabels.classes,
            value: String(plannerState.selectedOfferingIds.length),
          },
          ...(profile.selectedJointProgramIds.length > 0
            ? [
                {
                  label: productCopy.plannerWizard.stepLabels.jointPrograms,
                  value: jointProgramOptions
                    .filter((option) =>
                      profile.selectedJointProgramIds.includes(option.jointProgramId),
                    )
                    .map((option) => option.displayLabel)
                    .join(" · "),
                },
              ]
            : []),
        ]
      : []),
    ...(profile.academicLevel === "jointPrograms"
      ? [
          {
            label: productCopy.plannerWizard.stepLabels.jointPrograms,
            value:
              profile.selectedJointProgramIds.length > 0
                ? jointProgramOptions
                    .filter((option) =>
                      profile.selectedJointProgramIds.includes(option.jointProgramId),
                    )
                    .map((option) => option.displayLabel)
                    .join(" · ")
                : copy.plannerOnboarding.finishSummary.pending,
          },
          {
            label: productCopy.plannerWizard.stepLabels.subjects,
            value: String(plannerState.selectedSubjectCodes.length),
          },
          {
            label: productCopy.plannerWizard.stepLabels.classes,
            value: String(plannerState.selectedOfferingIds.length),
          },
        ]
      : []),
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
    setSelectedOfferingIds([]);
    setSelectedPeriodId("");
    setSelectedSubjectCodes([]);
  }

  function handleAcademicLevelChange(nextAcademicLevel: AcademicLevel) {
    setAcademicLevel(nextAcademicLevel);
    setEntryTerm("");
    setEntryTermDraft({ seasonKey: "", year: "" });
    setCareerSearch("");
    setSubjectSearch("");
    setSelectedCareerIds([]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleEntrySeasonChange(nextSeasonKey: EntryTermSeasonKey | "") {
    const nextDraft = { ...entryTermDraft, seasonKey: nextSeasonKey };
    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setCareerSearch("");
    setSubjectSearch("");
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
    setSubjectSearch("");
    setSelectedCareerIds([]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleCareerToggle(careerId: string) {
    const exists = profile.selectedCareerIds.includes(careerId);

    if (exists) {
      setSelectedCareerIds(
        profile.selectedCareerIds.filter((selectedCareerId) => selectedCareerId !== careerId),
      );
      setSelectedJointProgramIds([]);
      resetDownstreamPlannerState();
      setShowValidation(false);
      return;
    }

    if (profile.selectedCareerIds.length >= MAX_SELECTED_CAREERS) {
      setShowValidation(true);
      return;
    }

    setSelectedCareerIds([...profile.selectedCareerIds, careerId]);
    setSelectedJointProgramIds([]);
    resetDownstreamPlannerState();
    setShowValidation(false);
  }

  function handleLocaleChange(nextLocale: LocaleCode) {
    setLocale(nextLocale);
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
        academicLevel: profile.academicLevel,
        activeStep,
        careerSelectionCount: profile.selectedCareerIds.length,
        isClassSelectionLoading: selectedPeriodLoading,
        draftEntryTerm,
        locale: profile.locale,
        navSwipePreference,
        selectedOfferingCount: plannerState.selectedOfferingIds.length,
        selectedJointProgramCount: profile.selectedJointProgramIds.length,
        selectedSubjectCount: plannerState.selectedSubjectCodes.length,
        visibleOfferingCount: visibleOfferings.length,
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

    const validPeriodIds = new Set(filteredPeriods.map((period) => period.period_id));
    const defaultPeriodId = defaultPeriod?.period_id ?? "";

    if (
      defaultPeriodId &&
      (!plannerState.selectedPeriodId || !validPeriodIds.has(plannerState.selectedPeriodId))
    ) {
      setSelectedPeriodId(defaultPeriodId);
    }

    if (
      profile.academicLevel !== "graduate" &&
      plannerState.selectedSubjectCodes.length === 0 &&
      recommendedSubjectCodes.length > 0
    ) {
      setSelectedSubjectCodes(recommendedSubjectCodes);
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
            academicLevel: profile.academicLevel,
            careerChoiceMode,
            careerOptions,
            careerSearch,
            copy,
            currentStep: activeStep,
            filteredCareerOptions,
            entryTermDraft,
            handleAcademicLevelChange,
            handleCareerToggle,
            handleEntrySeasonChange,
            handleEntryYearChange,
            handleJointProgramToggle,
            handleLocaleChange,
            handleSwipePreferenceSelection,
            isPhoneViewport,
            jointProgramOptions,
            activePeriodLabel:
              activePeriodId === null
                ? copy.plannerHome.activePeriodFallback
                : formatSchedulePeriodLabel(
                    filteredPeriods.find((period) => period.period_id === activePeriodId)?.label ??
                      copy.plannerHome.activePeriodFallback,
                  ),
            classSelectionError: resolvedSelectedPeriodError,
            classSelectionLoading: selectedPeriodLoading,
            locale: profile.locale,
            navSwipePreference,
            selectedOfferingIds: plannerState.selectedOfferingIds,
            productCopy,
            selectedSubjectCodes: plannerState.selectedSubjectCodes,
            selectedSubjectEntries,
            selectedCareerIds: profile.selectedCareerIds,
            selectedJointProgramIds: profile.selectedJointProgramIds,
            setCareerSearch,
            setSubjectSearch,
            subjectResults,
            subjectSearch,
            subjectTitleLookup,
            toggleOfferingId,
            toggleSubjectCode,
            visibleOfferings,
            yearOptions,
          })}

          {showValidation ? (
            <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4 text-sm leading-6 text-muted">
              <p className="font-semibold text-foreground">
                {copy.plannerOnboarding.validationTitle}
              </p>
              <p className="mt-2">
                {getValidationBody({
                  academicLevel: profile.academicLevel,
                  activeStep,
                  copy,
                  productCopy,
                  selectedCareerIds: profile.selectedCareerIds,
                  selectedJointProgramIds: profile.selectedJointProgramIds,
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
  activePeriodLabel,
  academicLevel,
  careerChoiceMode,
  careerOptions,
  careerSearch,
  classSelectionError,
  classSelectionLoading,
  copy,
  currentStep,
  entryTermDraft,
  filteredCareerOptions,
  handleAcademicLevelChange,
  handleCareerToggle,
  handleEntrySeasonChange,
  handleEntryYearChange,
  handleJointProgramToggle,
  handleLocaleChange,
  handleSwipePreferenceSelection,
  isPhoneViewport,
  jointProgramOptions,
  locale,
  navSwipePreference,
  selectedOfferingIds,
  productCopy,
  selectedSubjectCodes,
  selectedSubjectEntries,
  selectedCareerIds,
  selectedJointProgramIds,
  setCareerSearch,
  setSubjectSearch,
  subjectResults,
  subjectSearch,
  subjectTitleLookup,
  toggleOfferingId,
  toggleSubjectCode,
  visibleOfferings,
  yearOptions,
}: {
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
    case "academicLevel":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerWizard.academicLevelTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {productCopy.plannerWizard.academicLevelBody}
            </p>
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
                    <span className="mt-2 block text-sm leading-6 text-muted">
                      {option.body}
                    </span>
                  </div>
                  <SelectionIndicator selected={selected} />
                </button>
              );
            })}
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
                aria-pressed={entryTermDraft.seasonKey === seasonKey}
                className={getSelectableChoiceCardClassName(
                  entryTermDraft.seasonKey === seasonKey,
                )}
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
    case "locale":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerWizard.localeTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {productCopy.plannerWizard.localeBody}
            </p>
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
          ) : filteredCareerOptions.length === 0 ? (
            <div className="soft-panel text-sm leading-6 text-muted">
              {copy.plannerOnboarding.programSearchEmpty}
            </div>
          ) : (
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
                      <span className="block font-semibold text-foreground">
                        {option.displayLabel}
                      </span>
                    </div>
                    <SelectionIndicator selected={selected} />
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

          {academicLevel === "undergraduate" && selectedCareerIds.length === 0 ? (
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
                  aria-pressed={selectedJointProgramIds.includes(option.jointProgramId)}
                  className={getSelectableChoiceCardClassName(
                    selectedJointProgramIds.includes(option.jointProgramId),
                  )}
                  onClick={() => handleJointProgramToggle(option.jointProgramId)}
                  type="button"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block font-semibold text-foreground">
                      {option.displayLabel}
                    </span>
                  </div>
                  <SelectionIndicator
                    selected={selectedJointProgramIds.includes(option.jointProgramId)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      );
    case "subjects":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerWizard.subjectsTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {productCopy.plannerWizard.subjectsBody}
            </p>
          </div>

          <div className="soft-panel flex flex-wrap items-center justify-between gap-3 text-sm leading-6 text-muted">
            <span>{productCopy.plannerWizard.subjectsCount}</span>
            <span className="font-semibold text-foreground">{selectedSubjectCodes.length}</span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerWizard.subjectsSelected}
            </p>
            {selectedSubjectEntries.length === 0 ? (
              <div className="soft-panel text-sm leading-6 text-muted">
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
                      <span className="block font-semibold text-foreground">
                        {entry.courseCode}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-muted">
                        {entry.title}
                      </span>
                    </div>
                    <SelectionIndicator selected />
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            aria-label={productCopy.plannerSettings.subjectsSearch}
            className={INPUT_CLASS_NAME}
            onChange={(event) => setSubjectSearch(event.target.value)}
            placeholder={productCopy.plannerWizard.subjectsSearchPlaceholder}
            type="search"
            value={subjectSearch}
          />

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {subjectSearch.trim()
                ? productCopy.common.search
                : productCopy.plannerWizard.subjectsRecommended}
            </p>
            {subjectResults.length === 0 ? (
              <div className="soft-panel text-sm leading-6 text-muted">
                {selectedSubjectEntries.length > 0 && !subjectSearch.trim()
                  ? productCopy.plannerWizard.subjectsRecommendedApplied
                  : productCopy.plannerWizard.subjectsDefaultEmpty}
              </div>
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
                        <span className="block font-semibold text-foreground">
                          {entry.courseCode}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-muted">
                          {entry.title}
                        </span>
                      </div>
                      <SelectionIndicator selected={selected} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    case "classes":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {productCopy.plannerWizard.classesTitle}
            </p>
            <p className="text-sm leading-6 text-muted">
              {productCopy.plannerWizard.classesBody}
            </p>
          </div>

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
                aria-pressed={navSwipePreference === preference}
                className={getSelectableChoiceCardClassName(
                  navSwipePreference === preference,
                )}
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
                <SelectionIndicator selected={navSwipePreference === preference} />
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
  const parsedEntryTerm = parseEntryTerm(entryTerm);

  if (
    academicLevel === null &&
    !parsedEntryTerm.seasonKey &&
    !parsedEntryTerm.year &&
    selectedCareerIds.length === 0 &&
    selectedJointProgramIds.length === 0 &&
    selectedSubjectCount === 0 &&
    selectedOfferingCount === 0 &&
    navSwipePreference === null
  ) {
    return "intro";
  }

  if (academicLevel === null) {
    return "academicLevel";
  }

  if (!parsedEntryTerm.seasonKey || !parsedEntryTerm.year) {
    return "entryTerm";
  }

  if (academicLevel === "undergraduate" && selectedCareerIds.length === 0) {
    return "careers";
  }

  if (
    ((academicLevel === "undergraduate" && shouldShowJointPrograms) ||
      academicLevel === "jointPrograms") &&
    selectedJointProgramIds.length === 0 &&
    selectedSubjectCount === 0
  ) {
    return "jointPrograms";
  }

  if (academicLevel !== "graduate" && shouldShowSubjects && selectedSubjectCount === 0) {
    return "subjects";
  }

  if (academicLevel !== "graduate" && shouldShowSubjects && selectedOfferingCount === 0) {
    return "classes";
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
}) {
  switch (activeStep) {
    case "academicLevel":
      return productCopy.plannerWizard.validation.academicLevel;
    case "careers":
      return selectedCareerIds.length >= MAX_SELECTED_CAREERS
        ? productCopy.plannerWizard.careerLimit
        : productCopy.plannerWizard.validation.careers;
    case "jointPrograms":
      return academicLevel === "jointPrograms" && selectedJointProgramIds.length === 0
        ? productCopy.plannerWizard.validation.jointProgramsRequired
        : productCopy.plannerWizard.validation.jointPrograms;
    case "classes":
      return productCopy.plannerWizard.validation.classes;
    case "locale":
      return productCopy.plannerWizard.validation.locale;
    case "subjects":
      return academicLevel === "graduate"
        ? copy.plannerOnboarding.validationBody.finish
        : productCopy.plannerWizard.validation.subjects;
    default:
      return copy.plannerOnboarding.validationBody[activeStep];
  }
}

function isStepValid({
  academicLevel,
  activeStep,
  careerSelectionCount,
  draftEntryTerm,
  locale,
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
  locale: LocaleCode;
  isClassSelectionLoading: boolean;
  navSwipePreference: "natural" | "inverted" | null;
  selectedOfferingCount: number;
  selectedJointProgramCount: number;
  selectedSubjectCount: number;
  visibleOfferingCount: number;
  validYears: string[];
}) {
  switch (activeStep) {
    case "intro":
    case "finish":
      return true;
    case "academicLevel":
      return academicLevel !== null;
    case "entryTerm": {
      const parsedEntryTerm = parseEntryTerm(draftEntryTerm);
      return parsedEntryTerm.seasonKey.length > 0 && validYears.includes(parsedEntryTerm.year);
    }
    case "locale":
      return locale === "es-MX" || locale === "en";
    case "jointPrograms":
      return academicLevel === "jointPrograms" ? selectedJointProgramCount > 0 : true;
    case "careers":
      return academicLevel === "graduate"
        ? true
        : careerSelectionCount > 0 && careerSelectionCount <= MAX_SELECTED_CAREERS;
    case "subjects":
      return academicLevel === "graduate" ? true : selectedSubjectCount > 0;
    case "classes":
      return academicLevel === "graduate"
        ? true
        : !isClassSelectionLoading &&
            (selectedOfferingCount > 0 || visibleOfferingCount === 0);
    case "swipe":
      return navSwipePreference !== null;
  }
}

function getSelectableChoiceCardClassName(selected: boolean) {
  return [
    "choice-card items-start justify-between text-left",
    selected
      ? "border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]"
      : "",
  ].join(" ");
}

function SelectionIndicator({ selected }: { selected: boolean }) {
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
