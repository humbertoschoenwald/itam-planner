import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page-shell";
import { getUiCopy } from "@/lib/copy";

const copy = getUiCopy("es-MX");

export const metadata: Metadata = {
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com/terms",
  },
  description:
    "Términos y condiciones de ITAM Planner, incluyendo el disclaimer legal y de no afiliación institucional.",
  title: "Términos y condiciones",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      description={copy.legalPages.terms.description}
      eyebrow={copy.legalPages.terms.eyebrow}
      sections={copy.legalPages.terms.sections}
      title={copy.legalPages.terms.title}
    />
  );
}
