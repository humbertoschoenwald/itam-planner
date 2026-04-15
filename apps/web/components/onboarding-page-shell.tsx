"use client";

import { useSearchParams } from "next/navigation";

import { OnboardingPanel } from "@/components/onboarding-panel";
import type { BulletinSummary } from "@/lib/types";

interface OnboardingPageShellProps {
  plans: BulletinSummary[];
}

export function OnboardingPageShell({ plans }: OnboardingPageShellProps) {
  const searchParams = useSearchParams();
  const redirectedFromPlanner = searchParams.get("from") === "planner";
  const recoveredFromError = searchParams.get("recovered") === "1";

  return (
    <OnboardingPanel
      plans={plans}
      redirectedFromPlanner={redirectedFromPlanner}
      recoveredFromError={recoveredFromError}
    />
  );
}
