import type { Metadata } from "next";

import { PlannerOnboardingWizard } from "@/components/planner-onboarding-wizard";
import { readOnboardingBootstrap } from "@/lib/catalog-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/planner/onboarding",
  },
  description:
    "Onboarding embebido en el horario de ITAM Planner para elegir nivel académico, periodo de ingreso, carreras y materias por defecto.",
  openGraph: {
    description:
      "Onboarding embebido en el horario de ITAM Planner para elegir nivel académico, periodo de ingreso, carreras y materias por defecto.",
    title: "Onboarding del horario",
    type: "website",
    url: "/planner/onboarding",
  },
  title: "Onboarding del horario",
  twitter: {
    description:
      "Onboarding embebido en el horario de ITAM Planner para elegir nivel académico, periodo de ingreso, carreras y materias por defecto.",
    title: "Onboarding del horario",
  },
};

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
