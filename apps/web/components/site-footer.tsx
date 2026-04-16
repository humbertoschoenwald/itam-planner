"use client";

import Link from "next/link";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function SiteFooter() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <footer className="mt-auto border-t border-border/70 bg-surface/72 backdrop-blur-xl">
      <div
        className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-muted sm:px-8"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
      >
        <p>{copy.footer.caption}</p>
        <nav className="flex flex-wrap items-center gap-3">
          <Link href="/terms" prefetch={false}>
            {copy.footer.terms}
          </Link>
          <span aria-hidden>·</span>
          <Link href="/privacy" prefetch={false}>
            {copy.footer.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
