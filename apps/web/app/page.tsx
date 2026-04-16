import type { Metadata } from "next";
import { HomePageShell } from "@/components/home-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildHomeStructuredData, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "home");

export default function HomePage() {
  const structuredData = buildHomeStructuredData(DEFAULT_LOCALE);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <HomePageShell />
    </>
  );
}
