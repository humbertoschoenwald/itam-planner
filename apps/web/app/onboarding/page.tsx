import { Suspense } from "react";

import { OnboardingPanel } from "@/components/onboarding-panel";
import { OnboardingPageShell } from "@/components/onboarding-page-shell";
import { readOnboardingBootstrap } from "@/lib/catalog-static";
export default async function OnboardingPage() {
  const bootstrap = await readOnboardingBootstrap();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <Suspense fallback={<OnboardingPanel plans={bootstrap.plans} />}>
        <OnboardingPageShell plans={bootstrap.plans} />
      </Suspense>
    </main>
  );
}
