import type { Metadata } from "next";

import { PlannerOnboardingWizard } from "@/components/planner-onboarding-wizard";
import { readOnboardingBootstrap } from "@/lib/presenters/bootstrap-server";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "plannerOnboarding");

export default async function PlannerOnboardingPage() {
  const bootstrap = await readOnboardingBootstrap();

  return (
    <PlannerOnboardingWizard
      bulletinDocuments={bootstrap.bulletinDocuments}
      periods={bootstrap.periods}
      plans={bootstrap.plans}
    />
  );
}
