"use client";

import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

const ISSUE_BASE_URL = "https://github.com/humbertoschoenwald/itam-planner/issues/new";

export function IssueTemplateLinks(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);
  const templates = [
    {
      href: `${ISSUE_BASE_URL}?template=bug_report.yml`,
      label: copy.projectPage.issueShortcuts.bug,
    },
    {
      href: `${ISSUE_BASE_URL}?template=data_correction.yml`,
      label: copy.projectPage.issueShortcuts.dataCorrection,
    },
    {
      href: `${ISSUE_BASE_URL}?template=source_drift.yml`,
      label: copy.projectPage.issueShortcuts.sourceDrift,
    },
    {
      href: `${ISSUE_BASE_URL}?template=feature_request.yml`,
      label: copy.projectPage.issueShortcuts.featureRequest,
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {templates.map((template) => (
        <a
          key={template.href}
          className="support-link text-sm font-semibold text-foreground"
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
