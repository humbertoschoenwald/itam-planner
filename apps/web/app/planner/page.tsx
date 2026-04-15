import { PlannerRouteShell } from "@/components/planner-route-shell";
import { readPlannerShellBootstrap } from "@/lib/catalog-static";

export default async function PlannerPage() {
  const bootstrap = await readPlannerShellBootstrap();

  return (
    <PlannerRouteShell
      plans={bootstrap.plans}
      periods={bootstrap.periods}
      sourcesMetadata={bootstrap.sourcesMetadata}
    />
  );
}
