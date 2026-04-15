"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);
  const links = [
    { href: "/planner", label: copy.common.planner },
    { href: "/connect-chatgpt", label: copy.common.connectToChatGpt },
    { href: "/community", label: copy.common.community },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/84 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link className="font-display text-2xl text-foreground" href="/" prefetch={false}>
            ITAM Planner
          </Link>
          <span className="rounded-full border border-accent/12 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {copy.siteHeader.badge}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
          {links.map((link) => (
            <Link
              key={link.href}
              className={[
                "rounded-full px-3 py-2 transition",
                pathname === link.href
                  ? "bg-accent text-accent-contrast shadow-[0_10px_24px_rgba(31,77,63,0.14)]"
                  : "hover:bg-surface-elevated hover:text-foreground",
              ].join(" ")}
              href={link.href}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
