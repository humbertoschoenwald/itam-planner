"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface OnboardingPanelProps {
  redirectedFromPlanner?: boolean;
  plans: BulletinSummary[];
}

export function OnboardingPanel({
  plans,
  redirectedFromPlanner = false,
}: OnboardingPanelProps) {
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

  useEffect(() => {
    const visiblePlanIds = new Set(visiblePlans.map((plan) => plan.plan_id));

    if (profile.activePlanIds.every((planId) => visiblePlanIds.has(planId))) {
      return;
    }

    setActivePlanIds(profile.activePlanIds.filter((planId) => visiblePlanIds.has(planId)));
  }, [profile.activePlanIds, setActivePlanIds, visiblePlans]);

  function handleEntrySeasonChange(nextSeasonKey: EntryTermSeasonKey | "") {
    const nextDraft = {
      ...entryTermDraft,
      seasonKey: nextSeasonKey,
    };

    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setShowValidation(false);
  }

  function handleEntryYearChange(nextYear: string) {
    const nextDraft = {
      ...entryTermDraft,
      year: nextYear,
    };

    setEntryTermDraft(nextDraft);
    setEntryTerm(buildEntryTerm(nextDraft.seasonKey, nextDraft.year));
    setShowValidation(false);
  }

  function handleContinue() {
    if (!onboardingComplete) {
      setShowValidation(true);
      return;
    }

    router.push("/planner");
  }

  function handleResetProfile() {
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

        {redirectedFromPlanner ? (
          <div className="rounded-[1.35rem] bg-accent-soft px-4 py-4 text-sm leading-6 text-accent">
            <p className="font-semibold">{copy.onboardingPage.plannerGateTitle}</p>
            <p className="mt-2">{copy.onboardingPage.plannerGateBody}</p>
          </div>
        ) : null}

        {onboardingComplete ? (
          <div className="rounded-[1.35rem] bg-accent-soft px-4 py-4 text-sm leading-6 text-accent">
            <p className="font-semibold">{copy.onboardingPage.readyTitle}</p>
            <p className="mt-2">{copy.onboardingPage.readyBody}</p>
          </div>
        ) : (
          <div className="soft-panel">
            <p className="font-semibold text-foreground">
              {copy.plannerHome.currentProfileFallback}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {copy.plannerHome.currentProfileHelp}
            </p>
          </div>
        )}

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

          {showValidation && !onboardingComplete ? (
            <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4 text-sm leading-6 text-muted">
              <p className="font-semibold text-foreground">{copy.onboardingPage.validationTitle}</p>
              <p className="mt-2">{copy.onboardingPage.validationBody}</p>
            </div>
          ) : null}
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

          {!canShowPlans ? (
            <div className="soft-panel">
              <p className="font-semibold text-foreground">
                {copy.onboardingPage.plansLockedTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {copy.onboardingPage.plansLockedBody}
              </p>
            </div>
          ) : visiblePlans.length === 0 ? (
            <div className="soft-panel">
              <p className="font-semibold text-foreground">
                {copy.onboardingPage.noPlansForTermTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {copy.onboardingPage.noPlansForTermBody}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {visiblePlans.map((plan) => {
                const checked = profile.activePlanIds.includes(plan.plan_id);
                return (
                  <label
                    key={plan.bulletin_id}
                    className="choice-card cursor-pointer items-start text-sm"
                  >
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
            {profile.entryTerm
              ? formatEntryTermLabel(profile.entryTerm, copy.onboardingPage.seasonOptions)
              : DEFAULT_STUDENT_PROFILE.entryTerm || copy.plannerHome.noTermYet}
          </span>
          <span className="rounded-full border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-muted">
            {activeVisiblePlanCount} {copy.plannerHome.activePlansShort}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
