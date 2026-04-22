"use client";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function UnderConstructionBanner(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <div className="under-construction-banner-shell border-b border-border/70 bg-surface/72">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-2 sm:px-8 sm:py-2.5">
        <div className="grid gap-2 rounded-[1.2rem] border border-border/70 bg-surface-veil/92 px-3 py-2 shadow-[0_14px_28px_rgba(31,36,24,0.05)] sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-x-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_0_5px_var(--accent-glow)]"
            />
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent sm:text-[0.72rem]">
              {copy.underConstruction.title}
            </p>
          </div>
          <p className="text-[0.8rem] leading-5 text-muted sm:text-[0.88rem] sm:leading-5.5">
            {copy.underConstruction.body}
          </p>
        </div>
      </div>
    </div>
  );
}
