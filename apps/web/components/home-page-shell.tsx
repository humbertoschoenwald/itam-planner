"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function HomePageShell() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="overflow-hidden rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_30px_90px_rgba(40,43,24,0.08)] sm:p-8">
        <div className="hero-grid">
          <div className="space-y-5">
            <p className="eyebrow text-accent">{copy.homePage.eyebrow}</p>
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">
                {copy.homePage.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                {copy.homePage.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/planner" prefetch={false}>
                  {copy.homePage.primaryAction}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/calendar" prefetch={false}>
                  {copy.homePage.secondaryAction}
                </Link>
              </Button>
            </div>
          </div>

          <div className="glass-accent rounded-[1.9rem] border border-white/10 px-5 py-5 shadow-[0_24px_50px_rgba(18,40,33,0.26)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-inverse-muted">
              {copy.homePage.surfaceEyebrow}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {copy.homePage.panels.map((panel) => (
                <div key={panel.title} className="rounded-2xl bg-white/8 p-4 text-sm leading-6 text-inverse-muted">
                  <p className="font-semibold text-accent-contrast">{panel.title}</p>
                  <p className="mt-2">{panel.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-grid">
        {copy.homePage.featureCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <p className="eyebrow">{card.eyebrow}</p>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted">
              <p>{card.body}</p>
              <Button asChild variant="secondary">
                <Link href={card.href} prefetch={false}>
                  {card.action}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
