import type { Metadata } from "next";

import { InscriptionsPageShell } from "@/components/inscriptions-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/inscripciones",
  },
  description:
    "Guía trazable de ITAM Planner para entrar al flujo oficial de inscripciones sin interceptarlo.",
  openGraph: {
    description:
      "Guía trazable de ITAM Planner para entrar al flujo oficial de inscripciones sin interceptarlo.",
    title: "Inscripciones",
    type: "website",
    url: "/inscripciones",
  },
  title: "Inscripciones",
  twitter: {
    description:
      "Guía trazable de ITAM Planner para entrar al flujo oficial de inscripciones sin interceptarlo.",
    title: "Inscripciones",
  },
};

export default function InscriptionsPage() {
  return <InscriptionsPageShell />;
}
