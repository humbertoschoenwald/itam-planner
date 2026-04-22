"use client";

import { getUiCopy } from "@/lib/copy";
import { getProductCopy } from "@/lib/product-copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function MapPageShell(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getProductCopy(locale);
  const uiCopy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell overflow-hidden rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className="page-hero-grid">
          <div className="section-intro">
            <p className="eyebrow text-accent">{copy.common.map}</p>
            <h1 className="max-w-[10ch] text-balance font-display text-[clamp(1.7rem,6vw,4rem)] leading-[0.95] text-foreground">
              {copy.mapPage.title}
            </h1>
            <p className="max-w-3xl text-[0.94rem] leading-6 text-muted sm:text-lg sm:leading-7">
              {copy.mapPage.body}
            </p>
          </div>

          <div className="page-aside-grid">
            <div className="detail-card">
              <p className="eyebrow text-accent">{uiCopy.underConstruction.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{uiCopy.underConstruction.body}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
