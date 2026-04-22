import type { Metadata } from "next";
import { HomePageShell } from "@/components/home-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildHomeStructuredData, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "home");

function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function HomePage(): React.JSX.Element {
  const structuredData = buildHomeStructuredData(DEFAULT_LOCALE);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(structuredData),
        }}
      />
      <HomePageShell />
    </>
  );
}
