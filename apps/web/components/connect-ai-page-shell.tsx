"use client";

import { ConnectAiPanel } from "@/components/connect-ai-panel";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ConnectAiPageShell(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell overflow-hidden rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className="page-hero-grid">
          <div className="section-intro">
            <p className="eyebrow text-accent">{copy.connectPage.eyebrow}</p>
            <h1 className="max-w-[10.5ch] text-balance font-display text-[clamp(1.7rem,6vw,4rem)] leading-[0.95] text-foreground">
              {copy.connectPage.title}
            </h1>
            <p className="max-w-3xl text-[0.94rem] leading-6 text-muted sm:text-lg sm:leading-7">
              {copy.connectPage.description}
            </p>
          </div>

          <div className="page-aside-grid">
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.connectPanel.deferredContract}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{copy.connectPanel.intro}</p>
            </div>
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.connectPanel.currentSnapshot}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{copy.connectPanel.footer}</p>
            </div>
          </div>
        </div>
      </section>

      <ConnectAiPanel />
    </main>
  );
}
