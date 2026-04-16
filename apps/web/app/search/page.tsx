import type { Metadata } from "next";

import { SearchPageShell } from "@/components/search-page-shell";
import { readSearchBootstrap } from "@/lib/catalog-static";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";
import { buildLocalSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "search");

export default async function SearchPage() {
  const bootstrap = await readSearchBootstrap();
  const index = buildLocalSearchIndex(bootstrap);

  return <SearchPageShell index={index} />;
}
