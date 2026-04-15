"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ConnectChatGptPanel() {
  const code = useStudentCodeStore((state) => state.code);
  const profile = useStudentProfileStore((state) => state.profile);
  const plannerState = usePlannerStore((state) => state.state);

  const planCount = profile.activePlanIds.length;
  const offeringCount = plannerState.selectedOfferingIds.length;

  return (
    <div className="page-grid">
      <Card>
        <CardHeader>
          <p className="eyebrow">Deferred contract</p>
          <CardTitle>What this will do</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted">
          <p>
            This page is the bridge to the future external AI flow. The final endpoint contract is
            intentionally still open, but the browser-local student code is already real.
          </p>
          <p>Use GitHub issues for bugs or support.</p>
          <div className="timeline-grid">
            <div className="soft-panel">
              <p className="font-semibold text-foreground">1. Keep the planner local</p>
              <p className="mt-1">No account is required and your planner data stays browser-owned.</p>
            </div>
            <div className="soft-panel">
              <p className="font-semibold text-foreground">2. Freeze the AI endpoint contract</p>
              <p className="mt-1">
                The later AI endpoint will remain read-only, JSON-only, and non-persistent.
              </p>
            </div>
            <div className="soft-panel">
              <p className="font-semibold text-foreground">3. Publish setup guides</p>
              <p className="mt-1">
                Browser and iPhone setup assets land after the endpoint contract is accepted.
              </p>
            </div>
          </div>
          <p className="rounded-2xl bg-surface-strong px-4 py-4 text-foreground">
            This also works with other AIs. ChatGPT is just the first named setup target.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="eyebrow">Current snapshot</p>
          <CardTitle>Current planner context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted">
          <div className="metric-grid">
            <div className="metric-chip">
              <span className="font-semibold text-foreground">Entry term</span>
              <div>{profile.entryTerm || "Not set yet"}</div>
            </div>
            <div className="metric-chip">
              <span className="font-semibold text-foreground">Selected plans</span>
              <div>{planCount}</div>
            </div>
            <div className="metric-chip">
              <span className="font-semibold text-foreground">Selected offerings</span>
              <div>{offeringCount}</div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-border bg-white px-4 py-4 font-mono text-xs leading-6 text-foreground">
            {code || "Finish onboarding and pick at least one plan or offering to generate a code."}
          </div>

          <p>
            The final ChatGPT setup instructions, iPhone screenshots, and the public AI-context
            endpoint land in the next slice after the endpoint contract is frozen in doctrine.
          </p>

          <Link
            className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/92"
            href="/"
          >
            Back to planner
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
