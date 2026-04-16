import type { SiteNewsItem } from "@/lib/types";

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
    category: "News",
    href: "https://news.itam.mx/",
    published_at: null,
    source_label: "ITAM News",
    source_url: "https://news.itam.mx/",
    summary:
      "Use the official ITAM news surface for institutional announcements, events, and editorial updates.",
    title: "ITAM News",
  },
] as const;
