import type { Metadata } from "next";

import { PlannerOnboardingWizard } from "@/components/planner-onboarding-wizard";
import { readOnboardingBootstrap } from "@/lib/catalog-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com/planner/onboarding",
  },
  description:
    "Onboarding embebido en el planner de ITAM Planner para elegir periodo de ingreso, planes, idioma y widgets locales.",
  title: "Planner Onboarding",
};

export default async function PlannerOnboardingPage() {
  const bootstrap = await readOnboardingBootstrap();

  return <PlannerOnboardingWizard plans={bootstrap.plans} />;
}
