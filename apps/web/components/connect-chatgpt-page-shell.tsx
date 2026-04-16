"use client";

import { ConnectChatGptPanel } from "@/components/connect-chatgpt-panel";
import { getUiCopy } from "@/lib/copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function ConnectChatGptPageShell() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getUiCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-col gap-3">
        <p className="eyebrow">{copy.connectPage.eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {copy.connectPage.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">
          {copy.connectPage.description}
        </p>
      </div>

      <ConnectChatGptPanel />
    </main>
  );
}
