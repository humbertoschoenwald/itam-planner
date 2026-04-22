"use client";

import Link from "next/link";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function SiteFooter(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <footer className="mt-auto border-t border-border/70 bg-surface/72 backdrop-blur-xl">
      <div
        className="footer-grid mx-auto w-full max-w-7xl px-5 py-5 text-xs text-muted sm:px-8"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
      >
        <div className="min-w-0 space-y-1.5">
          <p className="font-semibold uppercase tracking-[0.18em] text-foreground/88">
            {copy.plannerHome.title}
          </p>
          <p className="max-w-3xl text-[0.82rem] leading-5 text-muted">{copy.footer.caption}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2.5">
          <Link
            className="rounded-full border border-border/70 bg-surface-elevated px-3 py-1.5 transition hover:border-accent/30 hover:text-foreground"
            href="/terms"
            prefetch={false}
          >
            {copy.footer.terms}
          </Link>
          <Link
            className="rounded-full border border-border/70 bg-surface-elevated px-3 py-1.5 transition hover:border-accent/30 hover:text-foreground"
            href="/privacy"
            prefetch={false}
          >
            {copy.footer.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
