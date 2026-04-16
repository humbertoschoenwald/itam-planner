import type { Metadata } from "next";
import { HomePageShell } from "@/components/home-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Inicio público de ITAM Planner: horario móvil, calendario académico y superficies secundarias como proyecto y conexión con IA.",
  openGraph: {
    description:
      "Inicio público de ITAM Planner: horario móvil, calendario académico y superficies secundarias como proyecto y conexión con IA.",
    title: "Inicio",
    type: "website",
    url: "/",
  },
  title: "Inicio",
  twitter: {
    description:
      "Inicio público de ITAM Planner: horario móvil, calendario académico y superficies secundarias como proyecto y conexión con IA.",
    title: "Inicio",
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description:
      "Proyecto independiente para planeación académica del ITAM con onboarding local, horario dedicado y catálogo público precalculado.",
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
