import type { Metadata } from "next";

import { ConnectChatGptPageShell } from "@/components/connect-chatgpt-page-shell";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com/connect-chatgpt",
  },
  description:
    "Puente en construcción para conectar el planner local con ChatGPT y otras IAs desde contexto JSON legible.",
  title: "Connect to ChatGPT",
};

export default function ConnectChatGptPage() {
  return <ConnectChatGptPageShell />;
}
