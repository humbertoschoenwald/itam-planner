import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page-shell";
import { getUiCopy } from "@/lib/copy";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

const copy = getUiCopy(DEFAULT_LOCALE);

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "terms");

export default function TermsPage(): React.JSX.Element {
  return (
    <LegalPageShell
      description={copy.legalPages.terms.description}
      eyebrow={copy.legalPages.terms.eyebrow}
      sections={copy.legalPages.terms.sections}
      title={copy.legalPages.terms.title}
    />
  );
}
