import type { Metadata } from "next";

import { PlannerRouteShell } from "@/components/planner-route-shell";
import { readPlannerShellBootstrap } from "@/lib/catalog-static";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "planner");

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
