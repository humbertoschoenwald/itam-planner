"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type LegalPageShellProps = {
  sections: Array<{ body: string; title: string }>;
  title: string;
  eyebrow: string;
  description: string;
};

export function LegalPageShell({
  sections,
  title,
  eyebrow,
  description,
}: LegalPageShellProps): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell space-y-4 rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 className="max-w-[10.5ch] text-balance font-display text-[clamp(1.7rem,6vw,4rem)] leading-[0.95] text-foreground">
          {title}
        </h1>
        <p className="max-w-3xl text-[0.94rem] leading-6 text-muted sm:text-lg sm:leading-7">
          {description}
        </p>
      </section>

      <div className="list-stack">
        {sections.map((section) => (
          <Card key={section.title} className="section-shell">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted">{section.body}</CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs leading-6 text-muted">{copy.footer.caption}</p>
    </main>
  );
}
