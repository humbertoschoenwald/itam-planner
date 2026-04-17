import { DEFAULT_LOCALE } from "@/lib/locale";
import type { LocaleCode, SiteNewsItem } from "@/lib/types";

export const OFFICIAL_EXECUTIVE_EDUCATION_URL =
  "https://desarrolloejecutivo.itam.mx/Home/ProgramasO#sectionCorporate&0&menu";
export const OFFICIAL_ITAM_NEWS_URL = "https://news.itam.mx/";

const OFFICIAL_NEWS_ITEM_SEEDS = [
  {
    category: {
      en: "Academic calendar",
      "es-MX": "Calendario académico",
    },
    href: "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php",
    published_at: null,
    source_label: "ITAM Escolar",
    source_url: "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php",
    summary: {
      en: "Track calendar updates, regulation changes, and payment milestones from the official school-services surface.",
      "es-MX":
        "Sigue actualizaciones de calendario, cambios reglamentarios e hitos de pagos desde la superficie oficial de servicios escolares.",
    },
    title: {
      en: "Official calendar and regulations",
      "es-MX": "Calendario y reglamentos oficiales",
    },
  },
  {
    category: {
      en: "Careers",
      "es-MX": "Carreras",
    },
    href: "https://carreras.itam.mx/carreras/",
    published_at: "2026-03-06",
    source_label: "Carreras ITAM",
    source_url: "https://carreras.itam.mx/carreras/",
    summary: {
      en: "Review the official undergraduate careers, engineering programs, and study-plan PDFs that shape planner defaults.",
      "es-MX":
        "Revisa las carreras, las ingenierías y los PDF oficiales de planes de estudio que alimentan los valores por defecto del horario.",
    },
    title: {
      en: "Official careers and study plans",
      "es-MX": "Carreras y planes de estudio oficiales",
    },
  },
  {
    category: {
      en: "Joint programs",
      "es-MX": "Planes conjuntos",
    },
    href: "https://www.itam.mx/es/programas-conjuntos",
    published_at: "2025-01-31",
    source_label: "ITAM",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
    summary: {
      en: "See the official combined-program combinations that can feed joint-plan defaults in the planner.",
      "es-MX":
        "Consulta las combinaciones oficiales de programas conjuntos que pueden alimentar los valores por defecto de planes conjuntos en el horario.",
    },
    title: {
      en: "Official joint programs",
      "es-MX": "Planes conjuntos oficiales",
    },
  },
  {
    category: {
      en: "Graduate programs",
      "es-MX": "Posgrados",
    },
    href: "https://posgrados.itam.mx/",
    published_at: null,
    source_label: "Posgrados ITAM",
    source_url: "https://posgrados.itam.mx/",
    summary: {
      en: "Review the official graduate-program catalog, brochure PDFs, calendar PDFs, and admission routes that shape future graduate support.",
      "es-MX":
        "Revisa el catálogo oficial de posgrados, sus folletos, sus calendarios y sus rutas de admisión para el soporte futuro de maestría y especialidad.",
    },
    title: {
      en: "Official graduate programs",
      "es-MX": "Posgrados oficiales",
    },
  },
  {
    category: {
      en: "Double degrees",
      "es-MX": "Dobles grados",
    },
    href: "https://intercambio.itam.mx/es/dobles-grados",
    published_at: "2024-08-29",
    source_label: "Intercambio ITAM",
    source_url: "https://intercambio.itam.mx/es/dobles-grados",
    summary: {
      en: "Verify the official double-degree options, partner universities, brochure PDFs, and language requirements published by ITAM.",
      "es-MX":
        "Verifica las opciones oficiales de dobles grados, las universidades socias, los folletos y los requisitos de idioma publicados por el ITAM.",
    },
    title: {
      en: "Official double degrees",
      "es-MX": "Dobles grados oficiales",
    },
  },
  {
    category: {
      en: "Executive education",
      "es-MX": "Educación ejecutiva",
    },
    href: OFFICIAL_EXECUTIVE_EDUCATION_URL,
    published_at: null,
    source_label: "Desarrollo Ejecutivo ITAM",
    source_url: OFFICIAL_EXECUTIVE_EDUCATION_URL,
    summary: {
      en: "Check the official executive-education and continuing-education surface when you need non-degree study options.",
      "es-MX":
        "Consulta la superficie oficial de educación ejecutiva y extensión cuando necesites opciones de estudio que no forman parte de una licenciatura o posgrado.",
    },
    title: {
      en: "Executive education and extension",
      "es-MX": "Educación ejecutiva y extensión",
    },
  },
  {
    category: {
      en: "News",
      "es-MX": "Noticias",
    },
    href: OFFICIAL_ITAM_NEWS_URL,
    published_at: null,
    source_label: "ITAM News",
    source_url: OFFICIAL_ITAM_NEWS_URL,
    summary: {
      en: "Use the official ITAM news surface for institutional announcements, events, and editorial updates.",
      "es-MX":
        "Usa la superficie oficial de noticias del ITAM para comunicados institucionales, eventos y actualizaciones editoriales.",
    },
    title: {
      en: "ITAM News",
      "es-MX": "Noticias ITAM",
    },
  },
] as const;

export function getOfficialNewsItems(locale: LocaleCode): readonly SiteNewsItem[] {
  return OFFICIAL_NEWS_ITEM_SEEDS.map((item) => ({
    category: item.category[locale] ?? item.category[DEFAULT_LOCALE],
    href: item.href,
    published_at: item.published_at,
    source_label: item.source_label,
    source_url: item.source_url,
    summary: item.summary[locale] ?? item.summary[DEFAULT_LOCALE],
    title: item.title[locale] ?? item.title[DEFAULT_LOCALE],
  }));
}

export const OFFICIAL_NEWS_ITEMS: readonly SiteNewsItem[] = getOfficialNewsItems(DEFAULT_LOCALE);
