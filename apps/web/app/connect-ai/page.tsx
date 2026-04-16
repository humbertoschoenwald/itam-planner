import type { Metadata } from "next";

import { ConnectChatGptPageShell } from "@/components/connect-chatgpt-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/connect-ai",
  },
  description:
    "Puente read-only de ITAM Planner hacia IA externa con estado del planner controlado por el navegador.",
  openGraph: {
    description:
      "Puente read-only de ITAM Planner hacia IA externa con estado del planner controlado por el navegador.",
    title: "Connect to AI",
    type: "website",
    url: "/connect-ai",
  },
  title: "Connect to AI",
  twitter: {
    description:
      "Puente read-only de ITAM Planner hacia IA externa con estado del planner controlado por el navegador.",
    title: "Connect to AI",
  },
};

export default function ConnectAiPage() {
  return <ConnectChatGptPageShell />;
}
