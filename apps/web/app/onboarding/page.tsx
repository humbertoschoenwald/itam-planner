import { OnboardingPanel } from "@/components/onboarding-panel";
import { readPlannerHomeBootstrap } from "@/lib/catalog-static";

interface OnboardingPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const bootstrap = await readPlannerHomeBootstrap();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const redirectedFromPlanner = resolvedSearchParams.from === "planner";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <OnboardingPanel
        plans={bootstrap.plans}
        redirectedFromPlanner={redirectedFromPlanner}
      />
    </main>
  );
}
