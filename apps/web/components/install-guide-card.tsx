"use client";

import { getUiCopy } from "@/lib/copy";
import type { LocaleCode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InstallGuideCardProps {
  locale: LocaleCode;
}

export function InstallGuideCard({ locale }: InstallGuideCardProps) {
  const copy = getUiCopy(locale);

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.installGuide.eyebrow}</p>
        <CardTitle>{copy.installGuide.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm leading-6 text-muted">
        <p>{copy.installGuide.description}</p>

        <div className="page-grid">
          <div className="soft-panel">
            <p className="font-semibold text-foreground">{copy.installGuide.iosTitle}</p>
            <ol className="mt-3 space-y-2 pl-5 text-sm leading-6 text-muted">
              {copy.installGuide.iosSteps.map((step) => (
                <li key={step} className="list-decimal">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="soft-panel">
            <p className="font-semibold text-foreground">{copy.installGuide.browserTitle}</p>
            <p className="mt-3">{copy.installGuide.browserBody}</p>
          </div>
        </div>

        <div className="rounded-[1.35rem] bg-accent-soft px-4 py-4 text-accent">
          <p className="font-semibold">{copy.installGuide.cacheTitle}</p>
          <p className="mt-2">{copy.installGuide.cacheBody}</p>
        </div>

        <Button asChild variant="secondary">
          <a href="https://itam.humbertoschoenwald.com/" rel="noreferrer" target="_blank">
            {copy.installGuide.openCanonicalSite}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
