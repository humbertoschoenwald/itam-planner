import type { Metadata } from "next";

import { SearchPageShell } from "@/components/search-page-shell";
import { readSearchBootstrap } from "@/lib/catalog-static";
import { buildLocalSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  alternates: {
    canonical: "/search",
  },
  description:
    "Búsqueda local de ITAM Planner sobre rutas del sitio, catálogo publicado y fuentes oficiales trazables.",
  openGraph: {
    description:
      "Búsqueda local de ITAM Planner sobre rutas del sitio, catálogo publicado y fuentes oficiales trazables.",
    title: "Búsqueda",
    type: "website",
    url: "/search",
  },
  title: "Búsqueda",
  twitter: {
    description:
      "Búsqueda local de ITAM Planner sobre rutas del sitio, catálogo publicado y fuentes oficiales trazables.",
    title: "Búsqueda",
  },
};

export default async function SearchPage() {
  const bootstrap = await readSearchBootstrap();
  const index = buildLocalSearchIndex(bootstrap);

  return <SearchPageShell index={index} />;
}
