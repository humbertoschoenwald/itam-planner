import type { Metadata } from "next";

import { MapPageShell } from "@/components/map-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/mapa",
  },
  description:
    "Placeholder público del mapa de ITAM Planner para el futuro slice de campus y salones.",
  openGraph: {
    description:
      "Placeholder público del mapa de ITAM Planner para el futuro slice de campus y salones.",
    title: "Mapa",
    type: "website",
    url: "/mapa",
  },
  title: "Mapa",
  twitter: {
    description:
      "Placeholder público del mapa de ITAM Planner para el futuro slice de campus y salones.",
    title: "Mapa",
  },
};

export default function MapPage() {
  return <MapPageShell />;
}
