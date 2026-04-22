import type { Metadata } from "next";

import { ProjectPageShell } from "@/components/project-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "project");

export default function ProjectPage(): React.JSX.Element {
  return <ProjectPageShell />;
}
