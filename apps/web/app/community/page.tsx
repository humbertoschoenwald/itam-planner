import type { Metadata } from "next";

import { CommunityPageShell } from "@/components/community-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com/community",
  },
  description:
    "Comunidad de ITAM Planner para abrir issues, reportar bugs, source drift y seguir el proyecto por los canales públicos correctos.",
  title: "Community",
};

export default function CommunityPage() {
  return <CommunityPageShell />;
}
