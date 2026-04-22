"use client";

import Link from "next/link";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { getProductCopy } from "@/lib/product-copy";
import { getOfficialNewsItems } from "@/lib/presenters/official-content";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function HomePageShell(): JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const isPhoneViewport = usePhoneViewport();
  const copy = getUiCopy(locale);
  const productCopy = getProductCopy(locale);
  const officialNewsItems = getOfficialNewsItems(locale);
  const featuredNewsItem = officialNewsItems[0] ?? null;
  const remainingNewsItems = officialNewsItems.slice(1);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell overflow-hidden rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.3rem] sm:px-8 sm:py-8">
        <div className="hero-grid min-[960px]:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] min-[960px]:items-stretch">
          <div className="space-y-5 sm:space-y-6">
            <div className="section-intro">
              <p className="eyebrow text-accent">{copy.homePage.eyebrow}</p>
              <h1
                className={[
                  "text-balance font-display text-foreground",
                  isPhoneViewport
                    ? "max-w-[10.5ch] text-[clamp(1.36rem,5.3vw,2.72rem)] leading-[0.98]"
                    : "max-w-[11ch] text-[clamp(2rem,6.4vw,4.45rem)] leading-[0.93]",
                ].join(" ")}
              >
                {productCopy.home.introTitle}
              </h1>
              <p className="max-w-2xl text-[0.93rem] leading-6 text-muted sm:text-lg sm:leading-7">
                {productCopy.home.introBody}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/planner" prefetch={false}>
                  {copy.homePage.primaryAction}
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto" variant="secondary">
                <Link href="/calendar" prefetch={false}>
                  {copy.homePage.secondaryAction}
                </Link>
              </Button>
            </div>

            <div className="metric-grid">
              <MetricChip
                body={copy.plannerHome.noAccountRequiredText}
                title={copy.plannerHome.noAccountRequired}
              />
              {copy.homePage.panels.map((panel) => (
                <MetricChip key={panel.title} body={panel.body} title={panel.title} />
              ))}
            </div>
          </div>

          <aside className="glass-accent rounded-[1.75rem] border border-white/12 px-4 py-4 shadow-[0_28px_56px_rgba(17,39,32,0.28)] sm:rounded-[2rem] sm:px-5 sm:py-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-inverse-muted">
                  {productCopy.home.introEyebrow}
                </p>
                <p className="max-w-md text-sm leading-6 text-inverse-muted/92">
                  {copy.homePage.description}
                </p>
              </div>

              <div className="grid gap-3">
                {copy.homePage.featureCards.map((card, index) => (
                  <article
                    key={card.href}
                    className={[
                      "rounded-[1.25rem] border border-white/10 bg-white/8 p-4",
                      index === 0 ? "bg-white/10" : "",
                    ].join(" ")}
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-inverse-muted/82">
                      {card.eyebrow}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-accent-contrast">{card.title}</p>
                    <p className="mt-2 text-sm leading-6 text-inverse-muted/92">{card.body}</p>
                    <Link
                      className="mt-4 inline-flex items-center rounded-full border border-white/16 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-contrast transition hover:bg-white/8"
                      href={card.href}
                      prefetch={false}
                    >
                      {card.action}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="feature-grid min-[960px]:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card>
          <CardHeader className="space-y-3">
            <p className="eyebrow">{copy.homePage.surfaceEyebrow}</p>
            <CardTitle className="section-title text-balance">{copy.homePage.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-6 text-muted">
            <p>{copy.homePage.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {productCopy.home.cards.map((card) => (
                <HomeNavigationCard
                  key={card.href}
                  action={card.action}
                  body={card.body}
                  href={card.href}
                  title={card.title}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-3">
            <p className="eyebrow">{productCopy.home.newsEyebrow}</p>
            <CardTitle className="section-title text-balance">{productCopy.home.newsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted">
            <p>{productCopy.home.newsBody}</p>
            <div className="list-stack">
              {copy.homePage.panels.map((panel) => (
                <div key={panel.title} className="soft-panel">
                  <p className="font-semibold text-foreground">{panel.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{panel.body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="section-intro">
          <p className="eyebrow">{productCopy.home.newsEyebrow}</p>
          <h2 className="section-title text-balance text-foreground">{productCopy.home.newsTitle}</h2>
          <p className="max-w-3xl text-[0.95rem] leading-6 text-muted sm:text-base sm:leading-7">
            {productCopy.home.newsBody}
          </p>
        </div>

        <div className="news-grid min-[960px]:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          {featuredNewsItem ? (
            <Card className="min-h-full">
              <CardHeader className="space-y-3">
                <p className="eyebrow">{featuredNewsItem.category}</p>
                <CardTitle className="text-balance">{featuredNewsItem.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4 text-sm leading-6 text-muted">
                <p className="max-w-2xl">{featuredNewsItem.summary}</p>
                <div className="mt-auto flex flex-wrap gap-3">
                  <a
                    className="inline-flex rounded-full border border-border bg-surface-elevated px-4 py-2 font-medium text-foreground transition hover:border-accent/30 hover:bg-surface-hover"
                    href={featuredNewsItem.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {featuredNewsItem.source_label}
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="list-stack">
            {remainingNewsItems.map((item) => (
              <Card key={item.href}>
                <CardHeader className="space-y-2.5">
                  <p className="eyebrow">{item.category}</p>
                  <CardTitle className="text-balance text-[1.35rem] sm:text-[1.65rem]">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-muted">
                  <p>{item.summary}</p>
                  <a
                    className="inline-flex rounded-full border border-border bg-surface-elevated px-4 py-2 font-medium text-foreground transition hover:border-accent/30 hover:bg-surface-hover"
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.source_label}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeNavigationCard({
  action,
  body,
  href,
  title,
}: {
  action: string;
  body: string;
  href: string;
  title: string;
}): JSX.Element {
  return (
    <Link
      className="choice-card text-left transition hover:no-underline"
      href={href}
      prefetch={false}
    >
      <div className="space-y-2">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted">{body}</p>
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {action}
      </span>
    </Link>
  );
}

function MetricChip({ body, title }: { body: string; title: string }): JSX.Element {
  return (
    <article className="metric-chip">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
        {title}
      </p>
      <p className="mt-2 text-sm leading-5.5 text-muted">{body}</p>
    </article>
  );
}
