"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PlannerHome } from "@/components/planner-home";
import { Button } from "@/components/ui/button";
import { getUiCopy } from "@/lib/copy";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import type {
  BulletinSummary,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { useStudentProfileStore } from "@/stores/student-profile-store";

interface PlannerRouteShellProps {
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export function PlannerRouteShell(props: PlannerRouteShellProps) {
  useSyncStudentCode();

  const profile = useStudentProfileStore((state) => state.profile);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(useStudentProfileStore.persist.hasHydrated());
  const onboardingComplete = hasCompletedOnboarding(profile);
  const copy = getUiCopy(profile.locale);
  const standaloneFallback =
    hydrated &&
    typeof window !== "undefined" &&
    (((window.navigator as Navigator & { standalone?: boolean }).standalone ?? false) ||
      window.matchMedia?.("(display-mode: standalone)").matches);

  useEffect(() => {
    if (hydrated) {
      return undefined;
    }

    const unsubscribe = useStudentProfileStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return unsubscribe;
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || onboardingComplete) {
      return;
    }

    if (!standaloneFallback) {
      router.replace("/onboarding?from=planner");
    }
  }, [hydrated, onboardingComplete, router, standaloneFallback]);

  if (!hydrated || !onboardingComplete) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
        <section className="section-shell space-y-4">
          <p className="eyebrow">{copy.common.planner}</p>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {standaloneFallback
              ? copy.onboardingPage.plannerGateTitle
              : copy.plannerHome.redirectingToOnboarding}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {standaloneFallback
              ? copy.onboardingPage.plannerGateBody
              : copy.plannerHome.redirectingHelp}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/onboarding?from=planner" prefetch={false}>
                {copy.common.goToOnboarding}
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/" prefetch={false}>
                {copy.onboardingPage.backHome}
              </Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return <PlannerHome {...props} />;
}
