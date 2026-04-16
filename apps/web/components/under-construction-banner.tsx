"use client";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function UnderConstructionBanner() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <div className="border-b border-border/70 bg-surface/72 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-3 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {copy.underConstruction.title}
        </p>
        <p className="max-w-4xl text-sm leading-6 text-muted">
          {copy.underConstruction.body}
        </p>
      </div>
    </div>
  );
}
