import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page-shell";
import { getUiCopy } from "@/lib/copy";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

const copy = getUiCopy(DEFAULT_LOCALE);

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "privacy");

export default function PrivacyPage(): React.JSX.Element {
  return (
    <LegalPageShell
      description={copy.legalPages.privacy.description}
      eyebrow={copy.legalPages.privacy.eyebrow}
      sections={copy.legalPages.privacy.sections}
      title={copy.legalPages.privacy.title}
    />
  );
}
