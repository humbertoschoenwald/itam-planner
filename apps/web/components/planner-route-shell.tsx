"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PlannerHome } from "@/components/planner-home";
import { Button } from "@/components/ui/button";
import { getUiCopy } from "@/lib/copy";
import { hasCompletedPlannerBootstrap } from "@/lib/planner-bootstrap";
import type {
  BulletinDocument,
  BulletinSummary,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useSyncStudentCode } from "@/lib/use-sync-student-code";
import { useStudentProfileStore } from "@/stores/student-profile-store";

interface PlannerRouteShellProps {
  bulletinDocuments: BulletinDocument[];
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export function PlannerRouteShell(props: PlannerRouteShellProps) {
  useSyncStudentCode();

  const profile = useStudentProfileStore((state) => state.profile);
  const router = useRouter();
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const [profileHydrated, setProfileHydrated] = useState(useStudentProfileStore.persist.hasHydrated());
  const [plannerUiHydrated, setPlannerUiHydrated] = useState(usePlannerUiStore.persist.hasHydrated());
  const onboardingComplete = hasCompletedPlannerBootstrap(profile, plannerWidgetIds, props.plans);
  const copy = getUiCopy(profile.locale);
  const fullyHydrated = profileHydrated && plannerUiHydrated;

  useEffect(() => {
    if (profileHydrated) {
      return undefined;
    }

    const unsubscribe = useStudentProfileStore.persist.onFinishHydration(() => {
      setProfileHydrated(true);
    });

    return unsubscribe;
  }, [profileHydrated]);

  useEffect(() => {
    if (plannerUiHydrated) {
      return undefined;
    }

    const unsubscribe = usePlannerUiStore.persist.onFinishHydration(() => {
      setPlannerUiHydrated(true);
    });

    return unsubscribe;
  }, [plannerUiHydrated]);

  useEffect(() => {
    if (!fullyHydrated || onboardingComplete) {
      return;
    }

    router.replace("/planner/onboarding");
  }, [fullyHydrated, onboardingComplete, router]);

  if (!fullyHydrated || !onboardingComplete) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
        <section className="section-shell space-y-4">
          <p className="eyebrow">{copy.common.planner}</p>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {copy.plannerOnboarding.redirectTitle}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {copy.plannerOnboarding.redirectBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/planner/onboarding" prefetch={false}>
                {copy.plannerOnboarding.openPlanner}
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
