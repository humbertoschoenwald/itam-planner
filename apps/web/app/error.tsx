"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { clearPlannerBrowserState } from "@/lib/browser-state";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  useEffect(() => {
    clearPlannerBrowserState();
    const timeout = window.setTimeout(() => {
      router.replace("/onboarding?from=planner");
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [router]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <section className="section-shell space-y-4">
        <p className="eyebrow">{copy.common.planner}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {copy.common.genericErrorTitle}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
          {copy.common.genericErrorBody}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/onboarding?from=planner" prefetch={false}>
              Volver a onboarding
            </Link>
          </Button>
          <Button onClick={reset} variant="secondary">
            Reintentar
          </Button>
        </div>
      </section>
    </main>
  );
}
