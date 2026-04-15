"use client";

const COMMUNITY_LINKS = [
  {
    href: "https://github.com/humbertoschoenwald/itam-planner/issues",
    label: "GitHub Issues",
    description: "Report bugs, source drift, data corrections, and feature ideas through the canonical support path.",
  },
  {
    href: "https://www.instagram.com/humbertoschoenwald/",
    label: "Instagram",
    description: "Follow the creator's work, quality experiments, and project updates. Not a support channel.",
  },
] as const;

export function CommunityLinks() {
  return (
    <div className="grid gap-3">
      {COMMUNITY_LINKS.map((link) => (
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
              Open
            </div>
          </div>
          <div className="mt-1 text-sm leading-6 text-muted">{link.description}</div>
        </a>
      ))}
    </div>
  );
}
