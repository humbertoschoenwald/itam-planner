"use client";

import { useSearchParams } from "next/navigation";

import { OnboardingPanel } from "@/components/onboarding-panel";
import type { BulletinSummary } from "@/lib/types";

type OnboardingPageShellProps = {
  plans: BulletinSummary[];
}

export function OnboardingPageShell({ plans }: OnboardingPageShellProps): React.JSX.Element {
  const searchParams = useSearchParams();
  const redirectedFromPlanner = searchParams.get("from") === "planner";

  return <OnboardingPanel plans={plans} redirectedFromPlanner={redirectedFromPlanner} />;
}
