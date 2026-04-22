"use client";

import Link from "next/link";

import { getUiCopy } from "@/lib/copy";
import { formatEntryTermLabel } from "@/lib/presenters/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ConnectAiPanel(): React.JSX.Element {
  const code = useStudentCodeStore((state) => state.code);
  const profile = useStudentProfileStore((state) => state.profile);
  const plannerState = usePlannerStore((state) => state.state);
  const copy = getUiCopy(profile.locale);

  const planCount = profile.activePlanIds.length;
  const offeringCount = plannerState.selectedOfferingIds.length;

  return (
    <div className="page-grid min-[820px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] min-[820px]:items-start">
      <Card className="section-shell">
        <CardHeader>
          <p className="eyebrow">{copy.connectPanel.deferredContract}</p>
          <CardTitle>{copy.connectPanel.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted">
          <p>{copy.connectPanel.intro}</p>
          <p>{copy.connectPanel.supportLead}</p>
          <div className="timeline-grid">
            {copy.connectPanel.timeline.map((step) => (
              <div key={step.title} className="soft-panel">
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="mt-1">{step.body}</p>
              </div>
            ))}
          </div>
          <p className="rounded-[1.35rem] border border-border/70 bg-surface-strong/92 px-4 py-4 text-foreground shadow-[0_16px_32px_rgba(41,44,25,0.06)]">
            {copy.connectPanel.worksWithOtherAis}
          </p>
        </CardContent>
      </Card>

      <Card className="section-shell">
        <CardHeader>
          <p className="eyebrow">{copy.connectPanel.currentSnapshot}</p>
          <CardTitle>{copy.connectPanel.currentPlannerContext}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted">
          <div className="resource-grid">
            <div className="micro-metric">
              <span className="font-semibold text-foreground">{copy.connectPanel.entryTerm}</span>
              <div className="mt-2">
                {profile.entryTerm
                  ? formatEntryTermLabel(profile.entryTerm, copy.onboardingPage.seasonOptions)
                  : copy.connectPanel.notSetYet}
              </div>
            </div>
            <div className="micro-metric">
              <span className="font-semibold text-foreground">{copy.connectPanel.plans}</span>
              <div className="mt-2">{planCount}</div>
            </div>
            <div className="micro-metric">
              <span className="font-semibold text-foreground">{copy.connectPanel.offerings}</span>
              <div className="mt-2">{offeringCount}</div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-border/80 bg-surface-code px-4 py-4 font-mono text-xs leading-6 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
            {code || copy.connectPanel.finishOnboarding}
          </div>

          <p className="soft-panel">{copy.connectPanel.footer}</p>

          <Link
            className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition hover:bg-accent/92"
            href="/planner"
            prefetch={false}
          >
            {copy.common.backToPlanner}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
