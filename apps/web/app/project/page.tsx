import type { Metadata } from "next";

import { CommunityPageShell } from "@/components/community-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/project",
  },
  description:
    "Superficie del proyecto de ITAM Planner con soporte en GitHub, créditos y fuentes oficiales.",
  openGraph: {
    description:
      "Superficie del proyecto de ITAM Planner con soporte en GitHub, créditos y fuentes oficiales.",
    title: "Proyecto",
    type: "website",
    url: "/project",
  },
  title: "Proyecto",
  twitter: {
    description:
      "Superficie del proyecto de ITAM Planner con soporte en GitHub, créditos y fuentes oficiales.",
    title: "Proyecto",
  },
};

export default function ProjectPage() {
  return <CommunityPageShell />;
}
