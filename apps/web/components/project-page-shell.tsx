"use client";

import Link from "next/link";

import { ProjectLinks } from "@/components/project-links";
import { IssueTemplateLinks } from "@/components/issue-template-links";
import { ProjectCreditsCard } from "@/components/project-credits-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ProjectPageShell(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell overflow-hidden rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className="page-hero-grid">
          <div className="section-intro">
            <Link
              className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              href="/planner"
              prefetch={false}
            >
              {copy.common.backToPlanner}
            </Link>
            <p className="eyebrow text-accent">{copy.projectPage.eyebrow}</p>
            <h1 className="max-w-[10.5ch] text-balance font-display text-[clamp(1.7rem,6vw,4rem)] leading-[0.95] text-foreground">
              {copy.projectPage.title}
            </h1>
            <p className="max-w-2xl text-[0.94rem] leading-6 text-muted sm:text-lg sm:leading-7">
              {copy.projectPage.description}
            </p>
          </div>

          <div className="page-aside-grid">
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.projectPage.supportPath}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{copy.projectPage.issueLead}</p>
            </div>
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.projectPage.creatorSurfaces}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{copy.projectPage.creatorNote}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-grid min-[820px]:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] min-[820px]:items-stretch">
        <Card className="section-shell">
          <CardHeader>
            <p className="eyebrow">{copy.projectPage.supportPath}</p>
            <CardTitle>{copy.projectPage.issueTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted">
            <p>{copy.projectPage.issueLead}</p>
            <IssueTemplateLinks />
            <ul className="bullet-list">
              {copy.projectPage.issueBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p>
              {copy.projectPage.signUpLead}{" "}
              <a
                className="font-semibold text-accent underline-offset-4 hover:underline"
                href="https://github.com/signup"
                rel="noreferrer"
                target="_blank"
              >
                github.com/signup
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="section-shell">
          <CardHeader>
            <p className="eyebrow">{copy.projectPage.creatorSurfaces}</p>
            <CardTitle>{copy.projectPage.creatorSurfaces}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectLinks />
            <p className="mt-4 rounded-[1.2rem] border border-border/70 bg-accent-soft/92 px-4 py-4 text-xs leading-5 text-accent shadow-[0_14px_32px_rgba(31,77,63,0.08)]">
              {copy.projectPage.creatorNote}
            </p>
          </CardContent>
        </Card>
      </div>

      <ProjectCreditsCard />
    </main>
  );
}
