"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PlannerHome } from "@/components/planner-home";
import { getUiCopy } from "@/lib/copy";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import type {
  BulletinSummary,
  SchedulePeriodDetail,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { useStudentProfileStore } from "@/stores/student-profile-store";

interface PlannerRouteShellProps {
  periodDetailsById: Record<string, SchedulePeriodDetail>;
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

    router.replace("/onboarding");
  }, [hydrated, onboardingComplete, router]);

  if (!hydrated || !onboardingComplete) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
        <section className="section-shell space-y-4">
          <p className="eyebrow">{copy.common.planner}</p>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {copy.plannerHome.redirectingToOnboarding}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {copy.plannerHome.redirectingHelp}
          </p>
        </section>
      </main>
    );
  }

  return <PlannerHome {...props} />;
}
