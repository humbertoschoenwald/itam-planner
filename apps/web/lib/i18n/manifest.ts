import type { LocaleCode } from "@/lib/types";

type ManifestMessages = {
  description: string;
  name: string;
  shortName: string;
};

const manifestMessages = {
  en: {
    description:
      "Academic planning for ITAM students with browser-local state and a published public catalog.",
    name: "ITAM Planner",
    shortName: "ITAM Planner",
  },
  "es-MX": {
    description:
      "Planeacion academica para alumnos del ITAM con estado local en el navegador y un catalogo publico publicado.",
    name: "ITAM Planner",
    shortName: "ITAM Planner",
  },
} as const satisfies Record<LocaleCode, ManifestMessages>;

export function getManifestMessages(locale: LocaleCode): ManifestMessages {
  return manifestMessages[locale];
}
