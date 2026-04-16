import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page-shell";
import { getUiCopy } from "@/lib/copy";

const copy = getUiCopy("es-MX");

export const metadata: Metadata = {
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com/privacy",
  },
  description:
    "Aviso de privacidad de ITAM Planner con detalle de los datos locales que sí se guardan y los que nunca salen al backend.",
  title: "Aviso de privacidad",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      description={copy.legalPages.privacy.description}
      eyebrow={copy.legalPages.privacy.eyebrow}
      sections={copy.legalPages.privacy.sections}
      title={copy.legalPages.privacy.title}
    />
  );
}
