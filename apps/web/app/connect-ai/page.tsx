import type { Metadata } from "next";

import { ConnectChatGptPageShell } from "@/components/connect-chatgpt-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "connectAi");

export default function ConnectAiPage() {
  return <ConnectChatGptPageShell />;
}
