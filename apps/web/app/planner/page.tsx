import type { Metadata } from "next";

import { PlannerRouteShell } from "@/components/planner-route-shell";
import { readPlannerShellBootstrap } from "@/lib/catalog-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/planner",
  },
  description:
    "Horario local de ITAM Planner para construir un horario privado en el navegador con el catálogo público ya precalculado.",
  openGraph: {
    description:
      "Horario local de ITAM Planner para construir un horario privado en el navegador con el catálogo público ya precalculado.",
    title: "Horario",
    type: "website",
    url: "/planner",
  },
  title: "Horario",
  twitter: {
    description:
      "Horario local de ITAM Planner para construir un horario privado en el navegador con el catálogo público ya precalculado.",
    title: "Horario",
  },
};

export default async function PlannerPage() {
  const bootstrap = await readPlannerShellBootstrap();

  return (
    <PlannerRouteShell
      bulletinDocuments={bootstrap.bulletinDocuments}
      plans={bootstrap.plans}
      periods={bootstrap.periods}
      sourcesMetadata={bootstrap.sourcesMetadata}
    />
  );
}
