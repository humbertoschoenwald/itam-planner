"use client";

import Link from "next/link";

import { getUiCopy } from "@/lib/copy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ConnectChatGptPanel() {
  const code = useStudentCodeStore((state) => state.code);
  const profile = useStudentProfileStore((state) => state.profile);
  const plannerState = usePlannerStore((state) => state.state);
  const copy = getUiCopy(profile.locale);

  const planCount = profile.activePlanIds.length;
  const offeringCount = plannerState.selectedOfferingIds.length;

  return (
    <div className="page-grid">
      <Card>
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
          <p className="rounded-2xl bg-surface-strong px-4 py-4 text-foreground">
            {copy.connectPanel.worksWithOtherAis}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="eyebrow">{copy.connectPanel.currentSnapshot}</p>
          <CardTitle>{copy.connectPanel.currentPlannerContext}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted">
          <div className="metric-grid">
            <div className="metric-chip">
              <span className="font-semibold text-foreground">{copy.connectPanel.entryTerm}</span>
              <div>{profile.entryTerm || copy.connectPanel.notSetYet}</div>
            </div>
            <div className="metric-chip">
              <span className="font-semibold text-foreground">{copy.connectPanel.plans}</span>
              <div>{planCount}</div>
            </div>
            <div className="metric-chip">
              <span className="font-semibold text-foreground">{copy.connectPanel.offerings}</span>
              <div>{offeringCount}</div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-border bg-surface-code px-4 py-4 font-mono text-xs leading-6 text-foreground">
            {code || copy.connectPanel.finishOnboarding}
          </div>

          <p>{copy.connectPanel.footer}</p>

          <Link
            className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition hover:bg-accent/92"
            href="/"
            prefetch={false}
          >
            {copy.common.backToPlanner}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
