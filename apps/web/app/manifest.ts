import type { MetadataRoute } from "next";

import { getManifestMessages } from "@/lib/i18n/manifest";
import { DEFAULT_LOCALE } from "@/lib/locale";

export default function manifest(): MetadataRoute.Manifest {
  const messages = getManifestMessages(DEFAULT_LOCALE);

  return {
    name: messages.name,
    short_name: messages.shortName,
    description: messages.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4ede0",
    theme_color: "#1f4d3f",
    lang: DEFAULT_LOCALE,
    icons: [
      {
        src: "/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
