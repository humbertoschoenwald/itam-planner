"use client";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function CommunityLinks() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);
  const communityLinks = [
    {
      href: "https://github.com/humbertoschoenwald/itam-planner/issues",
      label: "GitHub Issues",
      description: copy.communityLinks.githubDescription,
    },
    {
      href: "https://www.instagram.com/humbertoschoenwald/",
      label: "Instagram",
      description: copy.communityLinks.instagramDescription,
    },
  ] as const;

  return (
    <div className="grid gap-3">
      {communityLinks.map((link) => (
        <a
          key={link.href}
          className="rounded-[1.35rem] border border-border bg-white/88 px-4 py-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white"
          href={link.href}
          rel="noreferrer"
          target="_blank"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground">{link.label}</div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {copy.common.open}
            </div>
          </div>
          <div className="mt-1 text-sm leading-6 text-muted">{link.description}</div>
        </a>
      ))}
    </div>
  );
}
