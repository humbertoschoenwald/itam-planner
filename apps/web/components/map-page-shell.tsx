"use client";

import { getProductCopy } from "@/lib/product-copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function MapPageShell() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getProductCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="space-y-3">
        <p className="eyebrow">{copy.common.map}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {copy.mapPage.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">
          {copy.mapPage.body}
        </p>
      </div>
    </main>
  );
}
