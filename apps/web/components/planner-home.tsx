"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CommunityLinks } from "@/components/community-links";
import { StudentCodeCard } from "@/components/student-code-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchBulletinIndex,
  fetchSchedulePeriodDetail,
  fetchSchedulePeriods,
} from "@/lib/api";
import type { BulletinSummary, SchedulePeriodDetail, SchedulePeriodSummary } from "@/lib/types";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { usePlannerStore } from "@/stores/planner-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const LOCALE_OPTIONS = [
  { value: "es-MX", label: "Español (MX)" },
  { value: "en", label: "English" },
] as const;

const INPUT_CLASS_NAME = "field-shell text-sm";

const STEP_NOTES = [
  {
    body: "Choose the plans that apply to you and keep that context in this browser only.",
    title: "Onboard once",
  },
  {
    body: "Pick a public period, keep the groups you want, and shape the first planner state.",
    title: "Shape the timetable",
  },
  {
    body: "Carry that state as a browser-owned code that later powers the external AI bridge.",
    title: "Carry the code",
  },
] as const;

export function PlannerHome() {
  useSyncStudentCode();

  const profile = useStudentProfileStore((state) => state.profile);
  const setEntryTerm = useStudentProfileStore((state) => state.setEntryTerm);
  const setLocale = useStudentProfileStore((state) => state.setLocale);
  const togglePlan = useStudentProfileStore((state) => state.toggleActivePlanId);
  const resetProfile = useStudentProfileStore((state) => state.resetProfile);

  const plannerState = usePlannerStore((state) => state.state);
  const setSelectedPeriodId = usePlannerStore((state) => state.setSelectedPeriodId);
  const toggleOfferingId = usePlannerStore((state) => state.toggleOfferingId);
  const resetPlanner = usePlannerStore((state) => state.resetPlanner);

  const [plans, setPlans] = useState<BulletinSummary[]>([]);
  const [periods, setPeriods] = useState<SchedulePeriodSummary[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<SchedulePeriodDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        setLoading(true);
        setErrorMessage(null);
        const [bulletinIndex, periodIndex] = await Promise.all([
          fetchBulletinIndex(),
          fetchSchedulePeriods(),
        ]);
        if (cancelled) {
          return;
        }
        setPlans(bulletinIndex);
        setPeriods(periodIndex);
        if (!plannerState.selectedPeriodId && periodIndex.length > 0) {
          setSelectedPeriodId(periodIndex[0].period_id);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load planner data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [plannerState.selectedPeriodId, setSelectedPeriodId]);

  useEffect(() => {
    const selectedPeriodId = plannerState.selectedPeriodId;

    if (selectedPeriodId === null) {
      setSelectedPeriod(null);
      return;
    }

    const currentPeriodId = selectedPeriodId;
    let cancelled = false;

    async function loadPeriod() {
      try {
        setDetailLoading(true);
        const period = await fetchSchedulePeriodDetail(currentPeriodId);
        if (!cancelled) {
          setSelectedPeriod(period);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load the period.");
        }
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
        }
      }
    }

    void loadPeriod();

    return () => {
      cancelled = true;
    };
  }, [plannerState.selectedPeriodId]);

  const selectedOfferings =
    selectedPeriod?.offerings.filter((offering) =>
      plannerState.selectedOfferingIds.includes(offering.offering_id),
    ) ?? [];
  const hasProfileData = profile.entryTerm.trim().length > 0 || profile.activePlanIds.length > 0;
  const hasPlannerData =
    plannerState.selectedPeriodId !== null || plannerState.selectedOfferingIds.length > 0;
  const currentLocaleLabel =
    LOCALE_OPTIONS.find((option) => option.value === profile.locale)?.label ?? profile.locale;
  const activePeriodLabel =
    periods.find((period) => period.period_id === plannerState.selectedPeriodId)?.label ??
    "No period selected";

  const heroMetrics = [
    { label: "Published plans", value: loading ? "..." : String(plans.length) },
    { label: "Public periods", value: loading ? "..." : String(periods.length) },
    { label: "Selected groups", value: String(selectedOfferings.length) },
    { label: "Current locale", value: currentLocaleLabel },
  ] as const;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="overflow-hidden rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_30px_90px_rgba(40,43,24,0.08)] sm:p-8">
        <div className="hero-grid">
          <div className="space-y-5">
            <p className="eyebrow text-accent">ITAM Planner</p>
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">
                A browser-local planner with a normalized public catalog underneath.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Start with onboarding, choose the plans that apply to you, and shape a timetable
                from published ITAM schedule data. Your profile, selections, and future AI bridge
                stay in this browser only.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/connect-chatgpt">Connect to ChatGPT</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/community">Community</Link>
              </Button>
              <Button asChild variant="secondary">
                <a
                  href="https://github.com/humbertoschoenwald/itam-planner/issues"
                  rel="noreferrer"
                  target="_blank"
                >
                  Open GitHub Issues
                </a>
              </Button>
            </div>

            <div className="metric-grid">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="metric-chip">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-accent rounded-[1.9rem] border border-white/10 px-5 py-5 shadow-[0_24px_50px_rgba(18,40,33,0.26)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/72">
              Independent project
            </p>
            <p className="mt-3 text-sm leading-6 text-white/82">
              Independent open-source project, built by the community. Not affiliated with,
              endorsed by, or maintained by Instituto Tecnológico Autónomo de México (ITAM).
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/86">
                <p className="font-semibold text-white">No account required</p>
                <p className="mt-2">
                  Start with onboarding, choose your plan and sections, and keep the resulting
                  planner state in localStorage.
                </p>
              </div>
              <div className="rounded-2xl bg-white/8 p-4 text-sm leading-6 text-white/84">
                <p className="font-semibold text-white">Catalog delivery model</p>
                <p className="mt-2">
                  Public data is normalized outside request time, then shipped back to the app as a
                  stable catalog artifact.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {STEP_NOTES.map((step, index) => (
                <div key={step.title} className="rounded-2xl bg-white/8 p-4 text-sm leading-6 text-white/84">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/62">
                    0{index + 1}
                  </p>
                  <p className="mt-2 font-semibold text-white">{step.title}</p>
                  <p className="mt-2">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="pt-6 text-sm leading-6 text-amber-900">
            {errorMessage}
          </CardContent>
        </Card>
      ) : null}

      <section className="page-grid">
        <Card>
          <CardHeader>
            <p className="eyebrow">Step 1</p>
            <CardTitle>Onboarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="soft-panel">
              <p className="font-semibold text-foreground">
                {hasProfileData ? "Profile in progress" : "Start with the academic basics"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                This state is private to the current browser. It decides which bulletins and
                regulations apply to you later.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="entry-term">
                Entry term
              </label>
              <input
                id="entry-term"
                className={INPUT_CLASS_NAME}
                onChange={(event) => setEntryTerm(event.target.value)}
                placeholder="Example: OTOÑO 2025"
                value={profile.entryTerm}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="locale">
                Preferred locale
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
                <p className="text-sm font-medium text-foreground">Active plans</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Select the plans that currently apply to you. No account is required and nothing
                  is stored in the backend.
                </p>
              </div>

              {loading ? (
                <p className="text-sm text-muted">Loading public plan list...</p>
              ) : (
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
                          <span className="mt-1 block text-xs leading-5 text-muted">
                            {plan.title}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => resetProfile()} variant="secondary">
                Reset profile
              </Button>
              <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-medium text-accent">
                {profile.entryTerm || DEFAULT_STUDENT_PROFILE.entryTerm || "No term yet"}
              </span>
              <span className="rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-muted">
                {profile.activePlanIds.length} active plan
                {profile.activePlanIds.length === 1 ? "" : "s"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="eyebrow">Step 2</p>
            <CardTitle>Planner shell</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="soft-panel">
              <p className="font-semibold text-foreground">{activePeriodLabel}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Choose one public period, then keep the groups you want in the browser-local
                planner state.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="period">
                Public schedule period
              </label>
              <select
                id="period"
                className={INPUT_CLASS_NAME}
                onChange={(event) => setSelectedPeriodId(event.target.value)}
                value={plannerState.selectedPeriodId ?? ""}
              >
                <option value="">Select a period</option>
                {periods.map((period) => (
                  <option key={period.period_id} value={period.period_id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {detailLoading ? (
              <p className="text-sm text-muted">Loading offerings...</p>
            ) : selectedPeriod ? (
              <>
                <div className="rounded-[1.35rem] bg-surface-strong px-4 py-3 text-sm text-foreground">
                  <p className="font-semibold">{selectedPeriod.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Select the groups you want to keep in your current planner state.
                  </p>
                </div>

                <div className="grid gap-3">
                  {selectedPeriod.offerings.map((offering) => {
                    const checked = plannerState.selectedOfferingIds.includes(offering.offering_id);
                    return (
                      <label
                        key={offering.offering_id}
                        className="choice-card cursor-pointer items-start text-sm"
                      >
                        <input
                          checked={checked}
                          className="mt-1 h-4 w-4 accent-accent"
                          onChange={() => toggleOfferingId(offering.offering_id)}
                          type="checkbox"
                        />
                        <span>
                          <span className="block font-semibold text-foreground">
                            {offering.course_code} · Group {offering.group_code}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted">
                            {offering.display_title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted">
                            {offering.instructor_name ?? "Instructor pending"} ·{" "}
                            {offering.room_code ?? "Room pending"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="rounded-[1.35rem] border border-border bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">
                    Selected groups: {selectedOfferings.length}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {selectedOfferings.length > 0 ? (
                      selectedOfferings.map((offering) => (
                        <div
                          key={offering.offering_id}
                          className="rounded-[1.15rem] bg-background px-3 py-3 text-xs leading-5 text-muted"
                        >
                          <span className="font-semibold text-foreground">
                            {offering.course_code} · {offering.group_code}
                          </span>
                          <span className="mt-1 block">
                            {offering.meetings
                              .map(
                                (meeting) =>
                                  `${meeting.weekday_code} ${meeting.start_time.slice(0, 5)}-${meeting.end_time.slice(0, 5)}`,
                              )
                              .join(" · ")}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted">
                        Select at least one public offering to start building the browser-local
                        planner state.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted">
                Select a public period to start capturing planner state.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => resetPlanner()} variant="secondary">
                Reset planner
              </Button>
              <span className="rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-muted">
                {hasPlannerData ? "Planner state exists" : "Planner state is empty"}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="page-grid">
        <StudentCodeCard />

        <Card>
          <CardHeader>
            <p className="eyebrow">Step 3</p>
            <CardTitle>Community and support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CommunityLinks />
            <div className="rounded-[1.35rem] bg-accent-soft px-4 py-4 text-sm leading-6 text-accent">
              <p className="font-semibold">Support lives on GitHub</p>
              <p className="mt-2">
                Bugs, data corrections, and source drift belong in GitHub issues. The Instagram
                link is only for following the creator and the project journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
