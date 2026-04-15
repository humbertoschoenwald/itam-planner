"use client";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

const ISSUE_BASE_URL = "https://github.com/humbertoschoenwald/itam-planner/issues/new";

export function IssueTemplateLinks() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);
  const templates = [
    {
      href: `${ISSUE_BASE_URL}?template=bug_report.yml`,
      label: copy.communityPage.issueShortcuts.bug,
    },
    {
      href: `${ISSUE_BASE_URL}?template=data_correction.yml`,
      label: copy.communityPage.issueShortcuts.dataCorrection,
    },
    {
      href: `${ISSUE_BASE_URL}?template=source_drift.yml`,
      label: copy.communityPage.issueShortcuts.sourceDrift,
    },
    {
      href: `${ISSUE_BASE_URL}?template=feature_request.yml`,
      label: copy.communityPage.issueShortcuts.featureRequest,
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {templates.map((template) => (
        <a
          key={template.href}
          className="rounded-[1.25rem] border border-border bg-surface-elevated px-4 py-4 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-hover"
          href={template.href}
          rel="noreferrer"
          target="_blank"
        >
          <span className="block">{template.label}</span>
          <span className="mt-2 block text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {copy.common.open}
          </span>
        </a>
      ))}
    </div>
  );
}
