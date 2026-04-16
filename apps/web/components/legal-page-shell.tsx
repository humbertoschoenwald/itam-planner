"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

interface LegalPageShellProps {
  sections: Array<{ body: string; title: string }>;
  title: string;
  eyebrow: string;
  description: string;
}

export function LegalPageShell({
  sections,
  title,
  eyebrow,
  description,
}: LegalPageShellProps) {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <section className="section-shell space-y-4 rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_30px_90px_rgba(40,43,24,0.08)] sm:p-8">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">{description}</p>
      </section>

      <div className="grid gap-4">
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
