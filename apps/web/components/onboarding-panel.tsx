"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import type { BulletinSummary } from "@/lib/types";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const LOCALE_OPTIONS = [
  { value: "es-MX", label: "Español (MX)" },
  { value: "en", label: "English" },
] as const;

const INPUT_CLASS_NAME = "field-shell text-sm";

interface OnboardingPanelProps {
  plans: BulletinSummary[];
}

export function OnboardingPanel({ plans }: OnboardingPanelProps) {
  useSyncStudentCode();

  const profile = useStudentProfileStore((state) => state.profile);
  const setEntryTerm = useStudentProfileStore((state) => state.setEntryTerm);
  const setLocale = useStudentProfileStore((state) => state.setLocale);
  const togglePlan = useStudentProfileStore((state) => state.toggleActivePlanId);
  const resetProfile = useStudentProfileStore((state) => state.resetProfile);
  const copy = getUiCopy(profile.locale);
  const onboardingComplete = hasCompletedOnboarding(profile);

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.onboardingPage.eyebrow}</p>
        <CardTitle>{copy.onboardingPage.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted">{copy.onboardingPage.description}</p>

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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="entry-term">
            {copy.plannerHome.entryTerm}
          </label>
          <input
            id="entry-term"
            className={INPUT_CLASS_NAME}
            onChange={(event) => setEntryTerm(event.target.value)}
            placeholder={copy.plannerHome.entryTermPlaceholder}
            value={profile.entryTerm}
          />
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
            {LOCALE_OPTIONS.map((option) => (
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

          <div className="grid gap-3">
            {plans.map((plan) => {
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
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => resetProfile()} variant="secondary">
            {copy.plannerHome.profileReset}
          </Button>
          <Button asChild>
            <Link href="/planner" prefetch={false}>
              {copy.onboardingPage.openPlanner}
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/" prefetch={false}>
              {copy.onboardingPage.backHome}
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-medium text-accent">
            {profile.entryTerm || DEFAULT_STUDENT_PROFILE.entryTerm || copy.plannerHome.noTermYet}
          </span>
          <span className="rounded-full border border-border bg-surface-elevated px-3 py-2 text-xs font-medium text-muted">
            {profile.activePlanIds.length} {copy.plannerHome.activePlansShort}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
