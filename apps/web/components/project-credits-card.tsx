"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ProjectCreditsCard() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  const links = [
    {
      href: "https://github.com/Horarios-ITAM/horariosITAM",
      label: copy.projectPage.creditsLinks.inspiration,
    },
    {
      href: "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php",
      label: copy.projectPage.creditsLinks.publicSources,
    },
    {
      href: "https://github.com/humbertoschoenwald/itam-planner/blob/main/docs/bibliography/tooling-and-standards.md",
      label: copy.projectPage.creditsLinks.bibliography,
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">{copy.projectPage.creditsEyebrow}</p>
        <CardTitle>{copy.projectPage.creditsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted">
        <p>{copy.projectPage.creditsBody}</p>
        <div className="grid gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              className="rounded-[1.25rem] border border-border bg-surface-elevated px-4 py-4 font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-hover"
              href={link.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="block">{link.label}</span>
              <span className="mt-2 block text-xs font-medium uppercase tracking-[0.18em] text-accent">
                {copy.common.open}
              </span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
