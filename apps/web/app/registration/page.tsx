import type { Metadata } from "next";

import { InscriptionsPageShell } from "@/components/inscriptions-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "registration");

export default function RegistrationPage() {
  return <InscriptionsPageShell />;
}
