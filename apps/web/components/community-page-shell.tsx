"use client";

import Link from "next/link";

import { CommunityLinks } from "@/components/community-links";
import { IssueTemplateLinks } from "@/components/issue-template-links";
import { ProjectCreditsCard } from "@/components/project-credits-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function CommunityPageShell() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-col gap-3">
        <Link
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          href="/planner"
          prefetch={false}
        >
          {copy.common.backToPlanner}
        </Link>
        <p className="eyebrow">{copy.communityPage.eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {copy.communityPage.title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
          {copy.communityPage.description}
        </p>
      </div>

      <div className="hero-grid">
        <Card>
          <CardHeader>
            <p className="eyebrow">{copy.communityPage.supportPath}</p>
            <CardTitle>{copy.communityPage.issueTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted">
            <p>{copy.communityPage.issueLead}</p>
            <IssueTemplateLinks />
            <ul className="space-y-2">
              {copy.communityPage.issueBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p>
              {copy.communityPage.signUpLead}{" "}
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

        <Card>
          <CardHeader>
            <p className="eyebrow">{copy.communityPage.creatorSurfaces}</p>
            <CardTitle>{copy.communityPage.creatorSurfaces}</CardTitle>
          </CardHeader>
          <CardContent>
            <CommunityLinks />
            <p className="mt-4 rounded-[1.15rem] bg-accent-soft px-4 py-4 text-xs leading-5 text-accent">
              {copy.communityPage.creatorNote}
            </p>
          </CardContent>
        </Card>
      </div>

      <ProjectCreditsCard />
    </main>
  );
}
