import type { Metadata } from "next";

import { RegistrationPageShell } from "@/components/registration-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "registration");

export default function RegistrationPage(): React.JSX.Element {
  return <RegistrationPageShell />;
}
