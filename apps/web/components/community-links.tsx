"use client";

const COMMUNITY_LINKS = [
  {
    href: "https://github.com/humbertoschoenwald/itam-planner/issues",
    label: "GitHub Issues",
    description: "Report bugs, source drift, data corrections, or feature requests.",
  },
  {
    href: "https://www.instagram.com/humbertoschoenwald/",
    label: "Instagram",
    description: "Creator contact and community feedback surface.",
  },
] as const;

export function CommunityLinks() {
  return (
    <div className="grid gap-3">
      {COMMUNITY_LINKS.map((link) => (
        <a
          key={link.href}
          className="rounded-2xl border border-border bg-surface px-4 py-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white"
          href={link.href}
          rel="noreferrer"
          target="_blank"
        >
          <div className="text-sm font-semibold text-foreground">{link.label}</div>
          <div className="mt-1 text-sm leading-6 text-muted">{link.description}</div>
        </a>
      ))}
    </div>
  );
}
