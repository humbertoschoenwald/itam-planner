"use client";

import Link from "next/link";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentCodeStore } from "@/stores/student-code-store";

export function StudentCodeCard() {
  const code = useStudentCodeStore((state) => state.code);
  const [copied, setCopied] = useState(false);

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
        <CardTitle>Student code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">
          This browser-owned code is generated from your current onboarding profile and planner
          state. No account is required and no personal data is stored in the backend. Use GitHub
          issues for support; this code is the foundation for the later AI connection flow.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-border bg-white px-4 py-4 font-mono text-xs leading-6 text-foreground">
          {code || "Your student code appears here once profile and planner state exist."}
        </div>

        <button
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/92 disabled:cursor-not-allowed disabled:bg-accent/35"
          disabled={!code}
          onClick={() => void copyCode()}
          type="button"
        >
          {copied ? "Copied" : "Copy code"}
        </button>

        <Link
          className="inline-flex text-sm font-semibold text-accent underline-offset-4 hover:underline"
          href="/connect-chatgpt"
        >
          Open the ChatGPT connection page
        </Link>
      </CardContent>
    </Card>
  );
}
