import type { Metadata } from "next";

import { CommunityPageShell } from "@/components/community-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "project");

export default function ProjectPage() {
  return <CommunityPageShell />;
}
