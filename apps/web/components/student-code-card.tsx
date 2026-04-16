"use client";

import Link from "next/link";
import { useState } from "react";

import { getUiCopy } from "@/lib/copy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentCodeStore } from "@/stores/student-code-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function StudentCodeCard() {
  const code = useStudentCodeStore((state) => state.code);
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);
  const [copied, setCopied] = useState(false);
  const codeLength = code.length;

  async function copyCode() {
    if (!code || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">{copy.studentCode.eyebrow}</p>
        <CardTitle>{copy.studentCode.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">
          {copy.studentCode.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent">
            {copy.studentCode.browserOwned}
          </span>
          <span className="rounded-full border border-border bg-surface-elevated px-3 py-2 text-xs font-semibold text-muted">
            {code ? `${codeLength} ${copy.studentCode.lengthSuffix}` : copy.studentCode.waitingForPlannerData}
          </span>
        </div>

        <div className="overflow-x-auto rounded-[1.4rem] border border-border bg-surface-code px-4 py-4 font-mono text-xs leading-6 text-foreground">
          {code || copy.studentCode.waitingForStudentCode}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition hover:bg-accent/92 disabled:cursor-not-allowed disabled:bg-accent/35"
            disabled={!code}
            onClick={() => void copyCode()}
            type="button"
          >
            {copied ? copy.studentCode.copied : copy.studentCode.copyCode}
          </button>

          <Link
            className="inline-flex items-center rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface-hover"
            href="/connect-ai"
            prefetch={false}
          >
            {copy.studentCode.openConnectToAi}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
