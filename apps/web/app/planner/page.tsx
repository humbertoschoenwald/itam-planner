import { PlannerRouteShell } from "@/components/planner-route-shell";
import { readPlannerHomeBootstrap } from "@/lib/catalog-static";

export default async function PlannerPage() {
  const bootstrap = await readPlannerHomeBootstrap();

  return (
    <PlannerRouteShell
      periodDetailsById={bootstrap.periodDetailsById}
      plans={bootstrap.plans}
      periods={bootstrap.periods}
      sourcesMetadata={bootstrap.sourcesMetadata}
    />
  );
}
