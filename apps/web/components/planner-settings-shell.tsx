"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { PublicClassSelectionPanel } from "@/components/public-class-selection-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearPlannerBrowserState } from "@/lib/browser-state";
import { getUiCopy } from "@/lib/copy";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import {
  buildSelectedSubjectSummary,
  buildSubjectDirectory,
  buildSubjectTitleLookup,
  filterPeriodsForAcademicLevel,
  formatSchedulePeriodLabel,
  searchSubjectDirectory,
} from "@/lib/presenters/schedule";
import { getProductCopy } from "@/lib/product-copy";
import { useSchedulePeriodDetail } from "@/lib/use-schedule-period-detail";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import type { BulletinDocument, ScheduleOffering, SchedulePeriodSummary } from "@/lib/types";
import {
  SCHEDULE_PREFERENCE_DAY_CODES,
  usePlannerPreferencesStore,
} from "@/stores/planner-preferences-store";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type PlannerSettingsShellProps = {
  bulletinDocuments: BulletinDocument[];
  periods: SchedulePeriodSummary[];
};

const INPUT_CLASS_NAME = "field-shell text-sm";

export function PlannerSettingsShell({
  bulletinDocuments,
  periods,
}: PlannerSettingsShellProps): JSX.Element {
  const profile = useStudentProfileStore((state) => state.profile);
  const locale = profile.locale;
  const copy = getUiCopy(locale);
  const productCopy = getProductCopy(locale);
  const plannerState = usePlannerStore((state) => state.state);
  const plannerUi = usePlannerUiStore((state) => state.state);
  const preferences = usePlannerPreferencesStore((state) => state.preferences);
  const resetProfile = useStudentProfileStore((state) => state.resetProfile);
  const setLocale = useStudentProfileStore((state) => state.setLocale);
  const resetPlanner = usePlannerStore((state) => state.resetPlanner);
  const resetPreferences = usePlannerPreferencesStore((state) => state.resetPreferences);
  const setClassSpacing = usePlannerPreferencesStore((state) => state.setClassSpacing);
  const setLighterDayPreference = usePlannerPreferencesStore(
    (state) => state.setLighterDayPreference,
  );
  const resetPlannerUi = usePlannerUiStore((state) => state.resetPlannerUi);
  const setNavSwipePreference = usePlannerUiStore((state) => state.setNavSwipePreference);
  const setSameTheoryLabGroup = usePlannerPreferencesStore(
    (state) => state.setSameTheoryLabGroup,
  );
  const setSelectedPeriodId = usePlannerStore((state) => state.setSelectedPeriodId);
  const setTimeRange = usePlannerPreferencesStore((state) => state.setTimeRange);
  const setUseTeacherRanking = usePlannerPreferencesStore(
    (state) => state.setUseTeacherRanking,
  );
  const setWeight = usePlannerPreferencesStore((state) => state.setWeight);
  const setSelectedOfferingIds = usePlannerStore((state) => state.setSelectedOfferingIds);
  const toggleOfferingId = usePlannerStore((state) => state.toggleOfferingId);
  const toggleSubjectCode = usePlannerStore((state) => state.toggleSubjectCode);
  const isPhoneViewport = usePhoneViewport();
  const [query, setQuery] = useState("");
  const [resetArmed, setResetArmed] = useState(false);

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
  const subjectTitleLookup = useMemo(
    () => buildSubjectTitleLookup(bulletinDocuments),
    [bulletinDocuments],
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
  const {
    detail: resolvedSelectedPeriod,
    error: resolvedSelectedPeriodError,
    isLoading: selectedPeriodLoading,
  } = useSchedulePeriodDetail(activePeriodId, productCopy.plannerSettings.scheduleLoadError);
  const visibleOfferings = useMemo(
    () =>
      resolvedSelectedPeriod?.offerings.filter(
        (offering) =>
          plannerState.selectedSubjectCodes.length === 0 ||
          plannerState.selectedSubjectCodes.includes(offering.course_code),
      ) ?? [],
    [plannerState.selectedSubjectCodes, resolvedSelectedPeriod],
  );
  const activePeriodLabel =
    filteredPeriods.find((period) => period.period_id === activePeriodId)?.label ??
    copy.plannerHome.activePeriodFallback;

  useSyncPlannerSettingsPeriod(
    defaultPeriodId,
    filteredPeriods,
    plannerState.selectedPeriodId,
    setSelectedPeriodId,
  );
  useSanitizePlannerSettingsOfferings(
    plannerState.selectedOfferingIds,
    plannerState.selectedSubjectCodes,
    resolvedSelectedPeriod,
    setSelectedOfferingIds,
  );

  function handleReset(): void {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }

    clearPlannerBrowserState();
    resetPlanner();
    resetPlannerUi();
    resetPreferences();
    resetProfile();
    setResetArmed(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell overflow-hidden rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className="page-hero-grid">
          <div className="section-intro">
            <Link
              className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              href="/planner"
              prefetch={false}
            >
              {copy.common.backToPlanner}
            </Link>
            <p className="eyebrow text-accent">{productCopy.plannerSettings.eyebrow}</p>
            <h1 className="max-w-[10.5ch] text-balance font-display text-[clamp(1.7rem,6vw,4rem)] leading-[0.95] text-foreground">
              {productCopy.plannerSettings.title}
            </h1>
            <p className="max-w-3xl text-[0.94rem] leading-6 text-muted sm:text-lg sm:leading-7">
              {productCopy.plannerSettings.preferencesBody}
            </p>
          </div>

          <div className="page-aside-grid">
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.plannerHome.locale}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {copy.common.localeLabels[profile.locale]}
              </p>
            </div>
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.plannerHome.entryTerm}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {profile.entryTerm || copy.plannerOnboarding.finishSummary.pending}
              </p>
            </div>
          </div>
        </div>
      </section>

      <PlannerSettingsProfileCards
        activePeriodLabel={activePeriodLabel}
        copy={copy}
        handleReset={handleReset}
        isPhoneViewport={isPhoneViewport}
        plannerUi={plannerUi}
        productCopy={productCopy}
        profile={profile}
        resetArmed={resetArmed}
        setLocale={setLocale}
        setNavSwipePreference={setNavSwipePreference}
      />

      <PlannerSettingsScheduleCard
        activePeriodId={activePeriodId}
        activePeriodLabel={activePeriodLabel}
        copy={copy}
        filteredPeriods={filteredPeriods}
        locale={locale}
        productCopy={productCopy}
        resolvedSelectedPeriodError={resolvedSelectedPeriodError}
        selectedOfferingIds={plannerState.selectedOfferingIds}
        selectedPeriodLoading={selectedPeriodLoading}
        setSelectedPeriodId={setSelectedPeriodId}
        subjectTitleLookup={subjectTitleLookup}
        toggleOfferingId={toggleOfferingId}
        visibleOfferings={visibleOfferings}
      />

      <PlannerSettingsSubjectsCard
        productCopy={productCopy}
        query={query}
        selectedSubjects={selectedSubjects}
        setQuery={setQuery}
        toggleSubjectCode={toggleSubjectCode}
        visibleDirectory={visibleDirectory}
      />

      <Card className="section-shell">
        <CardHeader>
          <CardTitle>{productCopy.plannerSettings.preferencesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-6 text-muted">{productCopy.plannerSettings.preferencesBody}</p>

          <PreferenceControl
            body={productCopy.plannerSettings.teacherRankingBody}
            enabled={preferences.useTeacherRanking}
            importance={preferences.weights.teacherRanking}
            importanceLabel={productCopy.plannerSettings.importanceLabel}
            label={productCopy.plannerSettings.teacherRankingTitle}
            noLabel={productCopy.common.no}
            onEnabledChange={setUseTeacherRanking}
            onImportanceChange={(value) => setWeight("teacherRanking", value)}
            yesLabel={productCopy.common.yes}
          />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                {productCopy.plannerSettings.classSpacingTitle}
              </p>
              <p className="text-sm leading-6 text-muted">
                {productCopy.plannerSettings.classSpacingBody}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["clustered", "separated"] as const).map((value) => {
                  const selected = preferences.classSpacing === value;
                  return (
                    <button
                      key={value}
                      aria-pressed={selected}
                      className={[
                        "choice-card text-left",
                        selected
                          ? "border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]"
                          : "",
                      ].join(" ")}
                      onClick={() => setClassSpacing(value)}
                      type="button"
                    >
                      <span className="block font-semibold text-foreground">
                        {productCopy.plannerSettings.classSpacingOptions[value]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <ImportanceSlider
              ariaLabel={productCopy.plannerSettings.classSpacingTitle}
              label={productCopy.plannerSettings.importanceLabel}
              onChange={(value) => setWeight("classSpacing", value)}
              value={preferences.weights.classSpacing}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                {productCopy.plannerSettings.timeRangeTitle}
              </p>
              <p className="text-sm leading-6 text-muted">
                {productCopy.plannerSettings.timeRangeBody}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  aria-label={productCopy.plannerSettings.timeRangeStartLabel}
                  className={INPUT_CLASS_NAME}
                  onChange={(event) => setTimeRange(event.target.value, preferences.timeRangeEnd)}
                  value={preferences.timeRangeStart}
                >
                  {TIME_RANGE_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <select
                  aria-label={productCopy.plannerSettings.timeRangeEndLabel}
                  className={INPUT_CLASS_NAME}
                  onChange={(event) => setTimeRange(preferences.timeRangeStart, event.target.value)}
                  value={preferences.timeRangeEnd}
                >
                  {TIME_RANGE_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ImportanceSlider
              ariaLabel={productCopy.plannerSettings.timeRangeTitle}
              label={productCopy.plannerSettings.importanceLabel}
              onChange={(value) => setWeight("timeRange", value)}
              value={preferences.weights.timeRange}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                {productCopy.plannerSettings.lighterDayTitle}
              </p>
              <p className="text-sm leading-6 text-muted">
                {productCopy.plannerSettings.lighterDayBody}
              </p>
              <select
                aria-label={productCopy.plannerSettings.lighterDayTitle}
                className={INPUT_CLASS_NAME}
                onChange={(event) =>
                  setLighterDayPreference(
                    event.target.value === ""
                      ? null
                      : (event.target.value as (typeof SCHEDULE_PREFERENCE_DAY_CODES)[number]),
                  )
                }
                value={preferences.lighterDayPreference ?? ""}
              >
                <option value="">{productCopy.plannerSettings.noPreference}</option>
                {SCHEDULE_PREFERENCE_DAY_CODES.map((dayCode) => (
                  <option key={dayCode} value={dayCode}>
                    {copy.common.weekdayLabels[dayCode as keyof typeof copy.common.weekdayLabels]}
                  </option>
                ))}
              </select>
            </div>
            <ImportanceSlider
              ariaLabel={productCopy.plannerSettings.lighterDayTitle}
              label={productCopy.plannerSettings.importanceLabel}
              onChange={(value) => setWeight("lighterDay", value)}
              value={preferences.weights.lighterDay}
            />
          </div>

          <PreferenceControl
            body={productCopy.plannerSettings.sameTheoryLabGroupBody}
            enabled={preferences.sameTheoryLabGroup}
            importance={preferences.weights.sameTheoryLabGroup}
            importanceLabel={productCopy.plannerSettings.importanceLabel}
            label={productCopy.plannerSettings.sameTheoryLabGroupTitle}
            noLabel={productCopy.common.no}
            onEnabledChange={setSameTheoryLabGroup}
            onImportanceChange={(value) => setWeight("sameTheoryLabGroup", value)}
            yesLabel={productCopy.common.yes}
          />
        </CardContent>
      </Card>
    </main>
  );
}

function PlannerSettingsProfileCards({
  activePeriodLabel,
  copy,
  handleReset,
  isPhoneViewport,
  plannerUi,
  productCopy,
  profile,
  resetArmed,
  setLocale,
  setNavSwipePreference,
}: {
  activePeriodLabel: string;
  copy: ReturnType<typeof getUiCopy>;
  handleReset: () => void;
  isPhoneViewport: boolean;
  plannerUi: ReturnType<typeof usePlannerUiStore.getState>["state"];
  productCopy: ReturnType<typeof getProductCopy>;
  profile: ReturnType<typeof useStudentProfileStore.getState>["profile"];
  resetArmed: boolean;
  setLocale: (locale: (typeof SUPPORTED_LOCALES)[number]) => void;
  setNavSwipePreference: (preference: "inverted" | "natural") => void;
}): JSX.Element {
  return (
    <div className="hero-grid min-[820px]:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] min-[820px]:items-stretch">
      <LocaleSettingsCard copy={copy} productCopy={productCopy} profile={profile} setLocale={setLocale} />
      <SwipeSettingsCard
        copy={copy}
        isPhoneViewport={isPhoneViewport}
        plannerUi={plannerUi}
        productCopy={productCopy}
        setNavSwipePreference={setNavSwipePreference}
      />
      <ResetPlannerCard
        activePeriodLabel={activePeriodLabel}
        copy={copy}
        handleReset={handleReset}
        productCopy={productCopy}
        profile={profile}
        resetArmed={resetArmed}
      />
    </div>
  );
}

function LocaleSettingsCard({
  copy,
  productCopy,
  profile,
  setLocale,
}: {
  copy: ReturnType<typeof getUiCopy>;
  productCopy: ReturnType<typeof getProductCopy>;
  profile: ReturnType<typeof useStudentProfileStore.getState>["profile"];
  setLocale: (locale: (typeof SUPPORTED_LOCALES)[number]) => void;
}): JSX.Element {
  return (
    <Card className="section-shell">
      <CardHeader>
        <CardTitle>{copy.plannerHome.locale}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted">
        <p>{productCopy.plannerWizard.localeBody}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SUPPORTED_LOCALES.map((localeCode) => {
            const selected = profile.locale === localeCode;
            return (
              <button
                key={localeCode}
                aria-pressed={selected}
                className={getChoiceCardClassName(selected)}
                onClick={() => setLocale(localeCode)}
                type="button"
              >
                <span className="block font-semibold text-foreground">
                  {copy.common.localeLabels[localeCode]}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function SwipeSettingsCard({
  copy,
  isPhoneViewport,
  plannerUi,
  productCopy,
  setNavSwipePreference,
}: {
  copy: ReturnType<typeof getUiCopy>;
  isPhoneViewport: boolean;
  plannerUi: ReturnType<typeof usePlannerUiStore.getState>["state"];
  productCopy: ReturnType<typeof getProductCopy>;
  setNavSwipePreference: (preference: "inverted" | "natural") => void;
}): JSX.Element | null {
  if (!isPhoneViewport) {
    return null;
  }

  return (
    <Card className="section-shell">
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
              className={getChoiceCardClassName(plannerUi.navSwipePreference === preference)}
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
  );
}

function ResetPlannerCard({
  activePeriodLabel,
  copy,
  handleReset,
  productCopy,
  profile,
  resetArmed,
}: {
  activePeriodLabel: string;
  copy: ReturnType<typeof getUiCopy>;
  handleReset: () => void;
  productCopy: ReturnType<typeof getProductCopy>;
  profile: ReturnType<typeof useStudentProfileStore.getState>["profile"];
  resetArmed: boolean;
}): JSX.Element {
  return (
    <Card className="section-shell">
      <CardHeader>
        <CardTitle>{productCopy.plannerSettings.resetButton}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted">
        <p>{productCopy.plannerSettings.resetBody}</p>
        <div className="soft-panel">
          <p className="font-semibold text-foreground">{formatSchedulePeriodLabel(activePeriodLabel)}</p>
          <p className="mt-2 text-sm text-muted">
            {copy.plannerHome.entryTerm}:{" "}
            {profile.entryTerm || copy.plannerOnboarding.finishSummary.pending}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleReset} variant="secondary">
            {resetArmed
              ? productCopy.plannerSettings.resetConfirm
              : productCopy.plannerSettings.resetButton}
          </Button>
          <Button asChild>
            <Link href="/planner/onboarding" prefetch={false}>
              {copy.plannerHome.updateOnboarding}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PlannerSettingsScheduleCard({
  activePeriodId,
  activePeriodLabel,
  copy,
  filteredPeriods,
  locale,
  productCopy,
  resolvedSelectedPeriodError,
  selectedOfferingIds,
  selectedPeriodLoading,
  setSelectedPeriodId,
  subjectTitleLookup,
  toggleOfferingId,
  visibleOfferings,
}: {
  activePeriodId: string | null;
  activePeriodLabel: string;
  copy: ReturnType<typeof getUiCopy>;
  filteredPeriods: SchedulePeriodSummary[];
  locale: ReturnType<typeof useStudentProfileStore.getState>["profile"]["locale"];
  productCopy: ReturnType<typeof getProductCopy>;
  resolvedSelectedPeriodError: string | null;
  selectedOfferingIds: string[];
  selectedPeriodLoading: boolean;
  setSelectedPeriodId: (periodId: string) => void;
  subjectTitleLookup: ReadonlyMap<string, string>;
  toggleOfferingId: (offeringId: string) => void;
  visibleOfferings: ScheduleOffering[];
}): JSX.Element {
  return (
    <Card className="section-shell">
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

        <PublicClassSelectionPanel
          activePeriodLabel={formatSchedulePeriodLabel(activePeriodLabel)}
          isLoading={selectedPeriodLoading}
          loadError={resolvedSelectedPeriodError}
          locale={locale}
          offerings={visibleOfferings}
          selectedOfferingIds={selectedOfferingIds}
          subjectTitleLookup={subjectTitleLookup}
          toggleOfferingId={toggleOfferingId}
        />
      </CardContent>
    </Card>
  );
}

function PlannerSettingsSubjectsCard({
  productCopy,
  query,
  selectedSubjects,
  setQuery,
  toggleSubjectCode,
  visibleDirectory,
}: {
  productCopy: ReturnType<typeof getProductCopy>;
  query: string;
  selectedSubjects: ReturnType<typeof buildSelectedSubjectSummary>;
  setQuery: (value: string) => void;
  toggleSubjectCode: (subjectCode: string) => void;
  visibleDirectory: ReturnType<typeof buildSubjectDirectory>;
}): JSX.Element {
  return (
    <Card className="section-shell">
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

        <SelectedSubjectsSection
          productCopy={productCopy}
          selectedSubjects={selectedSubjects}
          toggleSubjectCode={toggleSubjectCode}
        />

        <AvailableSubjectsSection
          productCopy={productCopy}
          query={query}
          toggleSubjectCode={toggleSubjectCode}
          visibleDirectory={visibleDirectory}
        />
      </CardContent>
    </Card>
  );
}

function SelectedSubjectsSection({
  productCopy,
  selectedSubjects,
  toggleSubjectCode,
}: {
  productCopy: ReturnType<typeof getProductCopy>;
  selectedSubjects: ReturnType<typeof buildSelectedSubjectSummary>;
  toggleSubjectCode: (subjectCode: string) => void;
}): JSX.Element {
  return (
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
                  <span className="block font-semibold text-foreground">{entry.courseCode}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{entry.title}</span>
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
  );
}

function AvailableSubjectsSection({
  productCopy,
  query,
  toggleSubjectCode,
  visibleDirectory,
}: {
  productCopy: ReturnType<typeof getProductCopy>;
  query: string;
  toggleSubjectCode: (subjectCode: string) => void;
  visibleDirectory: ReturnType<typeof buildSubjectDirectory>;
}): JSX.Element {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">
        {query.trim() ? productCopy.common.search : productCopy.plannerSettings.subjectsDefaultTitle}
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
                  <span className="block font-semibold text-foreground">{entry.courseCode}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{entry.title}</span>
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
  );
}

function getChoiceCardClassName(selected: boolean): string {
  return [
    "choice-card text-left",
    selected ? "border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]" : "",
  ].join(" ");
}

function useSyncPlannerSettingsPeriod(
  defaultPeriodId: string | null,
  filteredPeriods: SchedulePeriodSummary[],
  selectedPeriodId: string | null,
  setSelectedPeriodId: (periodId: string) => void,
): void {
  useEffect(() => {
    const validPeriodIds = new Set(filteredPeriods.map((period) => period.period_id));

    if ((!selectedPeriodId || !validPeriodIds.has(selectedPeriodId)) && defaultPeriodId) {
      setSelectedPeriodId(defaultPeriodId);
    }
  }, [defaultPeriodId, filteredPeriods, selectedPeriodId, setSelectedPeriodId]);
}

function useSanitizePlannerSettingsOfferings(
  selectedOfferingIds: string[],
  selectedSubjectCodes: string[],
  resolvedSelectedPeriod: ReturnType<typeof useSchedulePeriodDetail>["detail"],
  setSelectedOfferingIds: (offeringIds: string[]) => void,
): void {
  useEffect(() => {
    if (!resolvedSelectedPeriod) {
      return;
    }

    const visibleOfferingIds = new Set(
      resolvedSelectedPeriod.offerings
        .filter(
          (offering) =>
            selectedSubjectCodes.length === 0 || selectedSubjectCodes.includes(offering.course_code),
        )
        .map((offering) => offering.offering_id),
    );
    const sanitizedSelectedOfferingIds = selectedOfferingIds.filter((offeringId) =>
      visibleOfferingIds.has(offeringId),
    );

    if (sanitizedSelectedOfferingIds.length !== selectedOfferingIds.length) {
      setSelectedOfferingIds(sanitizedSelectedOfferingIds);
    }
  }, [resolvedSelectedPeriod, selectedOfferingIds, selectedSubjectCodes, setSelectedOfferingIds]);
}

function PreferenceControl({
  body,
  enabled,
  importance,
  importanceLabel,
  label,
  noLabel,
  onEnabledChange,
  onImportanceChange,
  yesLabel,
}: {
  body: string;
  enabled: boolean;
  importance: number;
  importanceLabel: string;
  label: string;
  noLabel: string;
  onEnabledChange: (value: boolean) => void;
  onImportanceChange: (value: number) => void;
  yesLabel: string;
}): JSX.Element {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm leading-6 text-muted">{body}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[true, false].map((value) => {
            const selected = enabled === value;
            return (
              <button
                key={String(value)}
                aria-pressed={selected}
                className={[
                  "choice-card text-left",
                  selected
                    ? "border-accent bg-accent-soft shadow-[0_18px_34px_rgba(31,77,63,0.12)]"
                    : "",
                ].join(" ")}
                onClick={() => onEnabledChange(value)}
                type="button"
              >
                <span className="block font-semibold text-foreground">
                  {value ? yesLabel : noLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <ImportanceSlider
        ariaLabel={label}
        label={importanceLabel}
        onChange={onImportanceChange}
        value={importance}
      />
    </div>
  );
}

function ImportanceSlider({
  ariaLabel,
  label,
  onChange,
  value,
}: {
  ariaLabel: string;
  label: string;
  onChange: (value: number) => void;
  value: number;
}): JSX.Element {
  return (
    <label className="space-y-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        aria-label={ariaLabel}
        className="w-full accent-accent"
        max="100"
        min="0"
        onChange={(event) => onChange(Number.parseInt(event.target.value, 10))}
        step="1"
        type="range"
        value={value}
      />
      <span className="text-sm text-muted">{value}</span>
    </label>
  );
}

const TIME_RANGE_OPTIONS = Array.from({ length: 31 }, (_, index) => {
  const hours = Math.floor(index / 2) + 7;
  const minutes = index % 2 === 0 ? "00" : "30";

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
});
