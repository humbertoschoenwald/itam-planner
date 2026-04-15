"use client";

import Link from "next/link";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentCodeStore } from "@/stores/student-code-store";

export function StudentCodeCard() {
  const code = useStudentCodeStore((state) => state.code);
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
        <p className="eyebrow">Portable context</p>
        <CardTitle>Student code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">
          This browser-owned code is generated from your current onboarding profile and planner
          state. No account is required and no personal data is stored in the backend. Use GitHub
          issues for support; this code is the foundation for the later AI connection flow.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent">
            Browser-owned
          </span>
          <span className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-muted">
            {code ? `${codeLength} characters` : "Waiting for planner data"}
          </span>
        </div>

        <div className="overflow-x-auto rounded-[1.4rem] border border-border bg-white px-4 py-4 font-mono text-xs leading-6 text-foreground">
          {code || "Your student code appears here once profile and planner state exist."}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/92 disabled:cursor-not-allowed disabled:bg-accent/35"
            disabled={!code}
            onClick={() => void copyCode()}
            type="button"
          >
            {copied ? "Copied" : "Copy code"}
          </button>

          <Link
            className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-accent/35"
            href="/connect-chatgpt"
          >
            Open the ChatGPT connection page
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
