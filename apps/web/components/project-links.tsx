"use client";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ProjectLinks(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);
  const projectLinks = [
    {
      href: "https://github.com/humbertoschoenwald/itam-planner/issues",
      label: copy.projectLinks.githubIssuesLabel,
      description: copy.projectLinks.githubDescription,
    },
    {
      href: "https://www.instagram.com/humbertoschoenwald/",
      label: copy.projectLinks.instagramLabel,
      description: copy.projectLinks.instagramDescription,
    },
  ] as const;

  return (
    <div className="grid gap-3">
      {projectLinks.map((link) => (
        <a
          key={link.href}
          className="support-link"
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
