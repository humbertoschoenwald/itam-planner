import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ITAM Planner",
    short_name: "ITAM Planner",
    description:
      "Planeación académica para alumnos del ITAM con estado local en el navegador y un catálogo público publicado.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4ede0",
    theme_color: "#1f4d3f",
    lang: "es-MX",
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
