import type { Metadata } from "next";

import { PlannerRouteShell } from "@/components/planner-route-shell";
import { readPlannerShellBootstrap } from "@/lib/catalog-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/planner",
  },
  description:
    "Planner local de ITAM Planner para construir un horario privado en el navegador con el catálogo público ya precalculado.",
  openGraph: {
    description:
      "Planner local de ITAM Planner para construir un horario privado en el navegador con el catálogo público ya precalculado.",
    title: "Planner",
    type: "website",
    url: "/planner",
  },
  title: "Planner",
  twitter: {
    description:
      "Planner local de ITAM Planner para construir un horario privado en el navegador con el catálogo público ya precalculado.",
    title: "Planner",
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
