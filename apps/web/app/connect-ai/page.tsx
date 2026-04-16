import type { Metadata } from "next";

import { ConnectAiPageShell } from "@/components/connect-ai-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "connectAi");

export default function ConnectAiPage() {
  return <ConnectAiPageShell />;
}
