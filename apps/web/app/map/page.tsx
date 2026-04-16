import type { Metadata } from "next";

import { MapPageShell } from "@/components/map-page-shell";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "map");

export default function MapPage() {
  return <MapPageShell />;
}
