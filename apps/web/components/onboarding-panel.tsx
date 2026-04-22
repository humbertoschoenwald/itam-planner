"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import {
  buildEntryTerm,
  type EntryTermSeasonKey,
  ENTRY_TERM_SEASON_KEYS,
  filterPlansForEntryTerm,
  formatEntryTermLabel,
  getEntryTermYearOptions,
  isValidEntryTerm,
  parseEntryTerm,
} from "@/lib/presenters/schedule";
import type { BulletinSummary } from "@/lib/types";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const INPUT_CLASS_NAME = "field-shell text-sm";

type OnboardingPanelProps = {
  redirectedFromPlanner?: boolean;
  plans: BulletinSummary[];
}

export function OnboardingPanel({
  plans,
  redirectedFromPlanner = false,
}: OnboardingPanelProps): JSX.Element {
  useSyncStudentCode();

  const router = useRouter();
  const profile = useStudentProfileStore((state) => state.profile);
  const setActivePlanIds = useStudentProfileStore((state) => state.setActivePlanIds);
  const setEntryTerm = useStudentProfileStore((state) => state.setEntryTerm);
  const setLocale = useStudentProfileStore((state) => state.setLocale);
  const togglePlan = useStudentProfileStore((state) => state.toggleActivePlanId);
  const resetProfile = useStudentProfileStore((state) => state.resetProfile);
  const copy = getUiCopy(profile.locale);
  const parsedEntryTerm = parseEntryTerm(profile.entryTerm);
  const [entryTermDraft, setEntryTermDraft] = useState(parsedEntryTerm);
  const [showValidation, setShowValidation] = useState(false);
  const yearOptions = getEntryTermYearOptions(plans, null);
  const localeOptions = Object.entries(copy.common.localeLabels).map(([value, label]) => ({
    label,
    value,
  }));
  const entrySeasonKey = entryTermDraft.seasonKey;
  const entryYear = entryTermDraft.year;
  const draftEntryTerm = buildEntryTerm(entrySeasonKey, entryYear);
  const visiblePlans = filterPlansForEntryTerm(plans, draftEntryTerm);
  const canShowPlans = draftEntryTerm.length > 0;
  const activeVisiblePlanCount = profile.activePlanIds.filter((planId) =>
    visiblePlans.some((plan) => plan.plan_id === planId),
  ).length;
  const onboardingComplete =
    isValidEntryTerm(profile.entryTerm) && activeVisiblePlanCount > 0;
  const onboardingBanner = getOnboardingBannerContent(onboardingComplete, copy);
  const planSelectionState = getPlanSelectionState(canShowPlans, visiblePlans.length);
  const entryTermBadgeLabel = getEntryTermBadgeLabel(profile.entryTerm, copy);
  const shouldShowValidation = showValidation && !onboardingComplete;

  useSyncVisiblePlanSelection(profile.activePlanIds, setActivePlanIds, visiblePlans);

  function handleEntrySeasonChange(nextSeasonKey: EntryTermSeasonKey | ""): void {
    const nextDraft = {
      ...entryTermDraft,
      seasonKey: nextSeasonKey,
    };

    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setShowValidation(false);
  }

  function handleEntryYearChange(nextYear: string): void {
    const nextDraft = {
      ...entryTermDraft,
      year: nextYear,
    };

    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setShowValidation(false);
  }

  function handleContinue(): void {
    if (!onboardingComplete) {
      setShowValidation(true);
      return;
    }

    router.push("/planner");
  }

  function handleResetProfile(): void {
    setEntryTermDraft({
      seasonKey: "",
      year: "",
    });
    setShowValidation(false);
    resetProfile();
  }

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.onboardingPage.eyebrow}</p>
        <CardTitle>{copy.onboardingPage.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted">{copy.onboardingPage.description}</p>

        <RedirectedNotice copy={copy} redirectedFromPlanner={redirectedFromPlanner} />

        <OnboardingStatusPanel
          body={onboardingBanner.body}
          emphasized={onboardingBanner.emphasized}
          title={onboardingBanner.title}
        />

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">{copy.plannerHome.entryTerm}</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              {copy.onboardingPage.entryTermHelp}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="entry-season">
                {copy.onboardingPage.entrySeason}
              </label>
              <select
                aria-invalid={showValidation && entrySeasonKey.length === 0}
                id="entry-season"
                className={INPUT_CLASS_NAME}
                onChange={(event) =>
                  handleEntrySeasonChange(event.target.value as EntryTermSeasonKey | "")
                }
                value={entrySeasonKey}
              >
                <option value="">{copy.onboardingPage.selectSeason}</option>
                {ENTRY_TERM_SEASON_KEYS.map((seasonKey) => (
                  <option key={seasonKey} value={seasonKey}>
                    {copy.onboardingPage.seasonOptions[seasonKey]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="entry-year">
                {copy.onboardingPage.entryYear}
              </label>
              <select
                aria-invalid={showValidation && entryYear.length === 0}
                id="entry-year"
                className={INPUT_CLASS_NAME}
                onChange={(event) => handleEntryYearChange(event.target.value)}
                value={entryYear}
              >
                <option value="">{copy.onboardingPage.selectYear}</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ValidationNotice copy={copy} shouldShow={shouldShowValidation} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="locale">
            {copy.plannerHome.locale}
          </label>
          <select
            id="locale"
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

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">{copy.plannerHome.activePlans}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{copy.plannerHome.activePlansHelp}</p>
          </div>

          <PlanSelectionContent
            copy={copy}
            planSelectionState={planSelectionState}
            profile={profile}
            togglePlan={togglePlan}
            visiblePlans={visiblePlans}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleResetProfile} variant="secondary">
            {copy.plannerHome.profileReset}
          </Button>
          <Button onClick={handleContinue}>{copy.onboardingPage.openPlanner}</Button>
          <Button asChild variant="secondary">
            <Link href="/" prefetch={false}>
              {copy.onboardingPage.backHome}
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-medium text-accent">
            {entryTermBadgeLabel}
          </span>
          <span className="rounded-full border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-muted">
            {activeVisiblePlanCount} {copy.plannerHome.activePlansShort}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function sanitizeVisiblePlanIds(activePlanIds: string[], visiblePlans: BulletinSummary[]): string[] {
  const visiblePlanIds = new Set(visiblePlans.map((plan) => plan.plan_id));
  return activePlanIds.filter((planId) => visiblePlanIds.has(planId));
}

function getEntryTermBadgeLabel(
  entryTerm: string,
  copy: ReturnType<typeof getUiCopy>,
): string {
  return entryTerm
    ? formatEntryTermLabel(entryTerm, copy.onboardingPage.seasonOptions)
    : DEFAULT_STUDENT_PROFILE.entryTerm || copy.plannerHome.noTermYet;
}

function useSyncVisiblePlanSelection(
  activePlanIds: string[],
  setActivePlanIds: (planIds: string[]) => void,
  visiblePlans: BulletinSummary[],
): void {
  useEffect(() => {
    const sanitizedPlanIds = sanitizeVisiblePlanIds(activePlanIds, visiblePlans);

    if (sanitizedPlanIds.length === activePlanIds.length) {
      return;
    }

    setActivePlanIds(sanitizedPlanIds);
  }, [activePlanIds, setActivePlanIds, visiblePlans]);
}

function getOnboardingBannerContent(
  onboardingComplete: boolean,
  copy: ReturnType<typeof getUiCopy>,
): { body: string; emphasized: boolean; title: string } {
  return onboardingComplete
    ? {
        body: copy.onboardingPage.readyBody,
        emphasized: true,
        title: copy.onboardingPage.readyTitle,
      }
    : {
        body: copy.plannerHome.currentProfileHelp,
        emphasized: false,
        title: copy.plannerHome.currentProfileFallback,
      };
}

function getPlanSelectionState(
  canShowPlans: boolean,
  visiblePlanCount: number,
): "empty" | "locked" | "ready" {
  if (!canShowPlans) {
    return "locked";
  }

  return visiblePlanCount === 0 ? "empty" : "ready";
}

function BannerNotice({ body, title }: { body: string; title: string }): JSX.Element {
  return (
    <div className="rounded-[1.35rem] bg-accent-soft px-4 py-4 text-sm leading-6 text-accent">
      <p className="font-semibold">{title}</p>
      <p className="mt-2">{body}</p>
    </div>
  );
}

function RedirectedNotice({
  copy,
  redirectedFromPlanner,
}: {
  copy: ReturnType<typeof getUiCopy>;
  redirectedFromPlanner: boolean;
}): JSX.Element | null {
  if (!redirectedFromPlanner) {
    return null;
  }

  return (
    <BannerNotice
      body={copy.onboardingPage.plannerGateBody}
      title={copy.onboardingPage.plannerGateTitle}
    />
  );
}

function OnboardingStatusPanel({
  body,
  emphasized,
  title,
}: {
  body: string;
  emphasized: boolean;
  title: string;
}): JSX.Element {
  if (emphasized) {
    return <BannerNotice body={body} title={title} />;
  }

  return (
    <div className="soft-panel">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

function PlanSelectionContent({
  copy,
  planSelectionState,
  profile,
  togglePlan,
  visiblePlans,
}: {
  copy: ReturnType<typeof getUiCopy>;
  planSelectionState: "empty" | "locked" | "ready";
  profile: ReturnType<typeof useStudentProfileStore.getState>["profile"];
  togglePlan: (planId: string) => void;
  visiblePlans: BulletinSummary[];
}): JSX.Element {
  if (planSelectionState === "locked") {
    return (
      <div className="soft-panel">
        <p className="font-semibold text-foreground">{copy.onboardingPage.plansLockedTitle}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{copy.onboardingPage.plansLockedBody}</p>
      </div>
    );
  }

  if (planSelectionState === "empty") {
    return (
      <div className="soft-panel">
        <p className="font-semibold text-foreground">{copy.onboardingPage.noPlansForTermTitle}</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {copy.onboardingPage.noPlansForTermBody}
        </p>
      </div>
    );
  }

  return (
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
  );
}

function ValidationNotice({
  copy,
  shouldShow,
}: {
  copy: ReturnType<typeof getUiCopy>;
  shouldShow: boolean;
}): JSX.Element | null {
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4 text-sm leading-6 text-muted">
      <p className="font-semibold text-foreground">{copy.onboardingPage.validationTitle}</p>
      <p className="mt-2">{copy.onboardingPage.validationBody}</p>
    </div>
  );
}
