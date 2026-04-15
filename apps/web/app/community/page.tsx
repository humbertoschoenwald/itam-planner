import Link from "next/link";

import { CommunityLinks } from "@/components/community-links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommunityPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-col gap-3">
        <Link className="text-sm font-medium text-accent underline-offset-4 hover:underline" href="/">
          Back to planner
        </Link>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
          Community
        </p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Feedback, issues, and project contact
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Use GitHub issues for bugs, data corrections, source drift, and feature requests.
          Creator social links live here too, but support stays on GitHub.
        </p>
      </div>

      <div className="page-grid">
        <Card>
          <CardHeader>
            <CardTitle>Open an issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted">
            <p>Choose the issue template that matches your report:</p>
            <ul className="space-y-2">
              <li>Bug report for broken app or pipeline behavior.</li>
              <li>Data correction for incorrect normalized academic data.</li>
              <li>Source drift when an upstream ITAM page or PDF changed shape.</li>
              <li>Feature request for new planner or UX ideas.</li>
            </ul>
            <p>
              If you still need a GitHub account, create one at{" "}
              <a
                className="font-semibold text-accent underline-offset-4 hover:underline"
                href="https://github.com/signup"
                target="_blank"
                rel="noreferrer"
              >
                github.com/signup
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact surfaces</CardTitle>
          </CardHeader>
          <CardContent>
            <CommunityLinks />
            <p className="mt-4 text-xs leading-5 text-muted">
              Instagram is for creator visibility and project updates. It is not support and
              it is not official ITAM contact.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
