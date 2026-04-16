import type { Metadata } from "next";

import { PlannerOnboardingWizard } from "@/components/planner-onboarding-wizard";
import { readOnboardingBootstrap } from "@/lib/catalog-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/planner/onboarding",
  },
  description:
    "Onboarding embebido en el planner de ITAM Planner para elegir periodo de ingreso, carrera y preferencia de deslizamiento local.",
  openGraph: {
    description:
      "Onboarding embebido en el planner de ITAM Planner para elegir periodo de ingreso, carrera y preferencia de deslizamiento local.",
    title: "Planner Onboarding",
    type: "website",
    url: "/planner/onboarding",
  },
  title: "Planner Onboarding",
  twitter: {
    description:
      "Onboarding embebido en el planner de ITAM Planner para elegir periodo de ingreso, carrera y preferencia de deslizamiento local.",
    title: "Planner Onboarding",
  },
};

export default async function PlannerOnboardingPage() {
  const bootstrap = await readOnboardingBootstrap();

  return <PlannerOnboardingWizard plans={bootstrap.plans} />;
}
