import type { Metadata } from "next";

import { SearchPageShell } from "@/components/search-page-shell";
import { readSearchBootstrap } from "@/lib/catalog-static";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "search");

export default async function SearchPage() {
  const bootstrap = await readSearchBootstrap();

  return <SearchPageShell bootstrap={bootstrap} />;
}
