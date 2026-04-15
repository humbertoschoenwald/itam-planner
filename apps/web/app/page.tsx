import { PlannerHome } from "@/components/planner-home";
import { readPlannerHomeBootstrap } from "@/lib/catalog-static";

export default async function Home() {
  const bootstrap = await readPlannerHomeBootstrap();

  return (
    <PlannerHome
      periodDetailsById={bootstrap.periodDetailsById}
      plans={bootstrap.plans}
      periods={bootstrap.periods}
      sourcesMetadata={bootstrap.sourcesMetadata}
    />
  );
}
