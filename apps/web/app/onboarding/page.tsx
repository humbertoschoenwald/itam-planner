import { OnboardingPanel } from "@/components/onboarding-panel";
import { readPlannerHomeBootstrap } from "@/lib/catalog-static";

export default async function OnboardingPage() {
  const bootstrap = await readPlannerHomeBootstrap();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <OnboardingPanel plans={bootstrap.plans} />
    </main>
  );
}
