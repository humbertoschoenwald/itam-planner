import type { Metadata } from "next";

import { PlannerSettingsShell } from "@/components/planner-settings-shell";
import { readPlannerSettingsBootstrap } from "@/lib/catalog-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/planner/settings",
  },
  description:
    "Configuración local de ITAM Planner para materias, deslizamiento y estado privado del navegador.",
  openGraph: {
    description:
      "Configuración local de ITAM Planner para materias, deslizamiento y estado privado del navegador.",
    title: "Configuración",
    type: "website",
    url: "/planner/settings",
  },
  title: "Configuración",
  twitter: {
    description:
      "Configuración local de ITAM Planner para materias, deslizamiento y estado privado del navegador.",
    title: "Configuración",
  },
};

export default async function PlannerSettingsPage() {
  const bootstrap = await readPlannerSettingsBootstrap();

  return (
    <PlannerSettingsShell
      bulletinDocuments={bootstrap.bulletinDocuments}
      periods={bootstrap.periods}
    />
  );
}
