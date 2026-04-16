import type { Metadata } from "next";
import { HomePageShell } from "@/components/home-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Home público de ITAM Planner: planner móvil, calendario académico y superficies secundarias como comunidad y conexión con ChatGPT.",
  openGraph: {
    description:
      "Home público de ITAM Planner: planner móvil, calendario académico y superficies secundarias como proyecto y conexión con IA.",
    title: "Home",
    type: "website",
    url: "/",
  },
  title: "Home",
  twitter: {
    description:
      "Home público de ITAM Planner: planner móvil, calendario académico y superficies secundarias como proyecto y conexión con IA.",
    title: "Home",
  },
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
