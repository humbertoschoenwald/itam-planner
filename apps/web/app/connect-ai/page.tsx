import type { Metadata } from "next";

import { ConnectChatGptPageShell } from "@/components/connect-chatgpt-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/connect-ai",
  },
  description:
    "Puente read-only de ITAM Planner hacia IA externa con estado del horario controlado por el navegador.",
  openGraph: {
    description:
      "Puente read-only de ITAM Planner hacia IA externa con estado del horario controlado por el navegador.",
    title: "Conectar con IA",
    type: "website",
    url: "/connect-ai",
  },
  title: "Conectar con IA",
  twitter: {
    description:
      "Puente read-only de ITAM Planner hacia IA externa con estado del horario controlado por el navegador.",
    title: "Conectar con IA",
  },
};

export default function ConnectAiPage() {
  return <ConnectChatGptPageShell />;
}
