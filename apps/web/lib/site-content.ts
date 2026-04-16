import type { SiteNewsItem } from "@/lib/types";

export const OFFICIAL_EXECUTIVE_EDUCATION_URL =
  "https://desarrolloejecutivo.itam.mx/Home/ProgramasO#sectionCorporate&0&menu";
export const OFFICIAL_ITAM_NEWS_URL = "https://news.itam.mx/";

export const OFFICIAL_NEWS_ITEMS: readonly SiteNewsItem[] = [
  {
    category: "Academic calendar",
    href: "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php",
    published_at: null,
    source_label: "ITAM Escolar",
    source_url: "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php",
    summary:
      "Track calendar updates, regulation changes, and payment milestones from the official school-services surface.",
    title: "Official calendar and regulations",
  },
  {
    category: "Careers",
    href: "https://carreras.itam.mx/carreras/",
    published_at: "2026-03-06",
    source_label: "Carreras ITAM",
    source_url: "https://carreras.itam.mx/carreras/",
    summary:
      "Review the official undergraduate careers, engineering programs, and study-plan PDFs that shape planner defaults.",
    title: "Official careers and study plans",
  },
  {
    category: "Joint programs",
    href: "https://www.itam.mx/es/programas-conjuntos",
    published_at: "2025-01-31",
    source_label: "ITAM",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
    summary:
      "See the official combined-program combinations that can feed joint-plan defaults in the planner.",
    title: "Official joint programs",
  },
  {
    category: "Graduate programs",
    href: "https://posgrados.itam.mx/",
    published_at: null,
    source_label: "Posgrados ITAM",
    source_url: "https://posgrados.itam.mx/",
    summary:
      "Review the official graduate-program catalog, brochure PDFs, calendar PDFs, and admission routes that shape future graduate support.",
    title: "Official graduate programs",
  },
  {
    category: "Double degrees",
    href: "https://intercambio.itam.mx/es/dobles-grados",
    published_at: "2024-08-29",
    source_label: "Intercambio ITAM",
    source_url: "https://intercambio.itam.mx/es/dobles-grados",
    summary:
      "Verify the official double-degree options, partner universities, brochure PDFs, and language requirements published by ITAM.",
    title: "Official double degrees",
  },
  {
    category: "Executive education",
    href: OFFICIAL_EXECUTIVE_EDUCATION_URL,
    published_at: null,
    source_label: "Desarrollo Ejecutivo ITAM",
    source_url: OFFICIAL_EXECUTIVE_EDUCATION_URL,
    summary:
      "Check the official executive-education and continuing-education surface when you need non-degree study options.",
    title: "Executive education and extension",
  },
  {
    category: "News",
    href: OFFICIAL_ITAM_NEWS_URL,
    published_at: null,
    source_label: "ITAM News",
    source_url: OFFICIAL_ITAM_NEWS_URL,
    summary:
      "Use the official ITAM news surface for institutional announcements, events, and editorial updates.",
    title: "ITAM News",
  },
] as const;
