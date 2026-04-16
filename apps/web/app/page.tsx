import type { Metadata } from "next";
import { HomePageShell } from "@/components/home-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com/",
  },
  description:
    "Home público de ITAM Planner: planner móvil, calendario académico y superficies secundarias como comunidad y conexión con ChatGPT.",
  title: "Home",
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description:
      "Proyecto independiente para planeación académica del ITAM con onboarding local, planner dedicado y catálogo público precalculado.",
    inLanguage: "es-MX",
    name: "ITAM Planner",
    publisher: {
      "@type": "Person",
      name: "Humberto Schoenwald",
    },
    url: "https://itam.humbertoschoenwald.com/",
  };

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
