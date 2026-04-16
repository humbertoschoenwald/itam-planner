import type { Metadata } from "next";

import { DEFAULT_LOCALE } from "@/lib/locale";
import type { LocaleCode } from "@/lib/types";

type PageSeoKey =
  | "calendar"
  | "connectAi"
  | "home"
  | "map"
  | "planner"
  | "plannerOnboarding"
  | "privacy"
  | "project"
  | "registration"
  | "search"
  | "settings"
  | "terms";

interface PageSeoEntry {
  canonicalPath: string;
  description: string;
  title: string;
}

interface SiteSeoCopy {
  applicationName: string;
  homeStructuredDataDescription: string;
  keywords: string[];
  pages: Record<PageSeoKey, PageSeoEntry>;
  siteDescription: string;
  siteTitle: string;
}

const seoCopy = {
  en: {
    applicationName: "ITAM Planner",
    homeStructuredDataDescription:
      "Independent project for ITAM academic planning with local onboarding, a dedicated schedule surface, and a precomputed public catalog.",
    keywords: [
      "ITAM",
      "ITAM Planner",
      "ITAM schedule",
      "ITAM bulletins",
      "ITAM academic calendar",
      "ITAM study plans",
      "ITAM academic planning",
    ],
    pages: {
      calendar: {
        canonicalPath: "/calendar",
        description:
          "Public ITAM Planner calendar with general academic events and class-aware daily context once the local schedule already exists.",
        title: "Calendar",
      },
      connectAi: {
        canonicalPath: "/connect-ai",
        description:
          "Read-only ITAM Planner bridge to external AI with browser-owned schedule state.",
        title: "Connect to AI",
      },
      home: {
        canonicalPath: "/",
        description:
          "Public ITAM Planner home for the mobile schedule shell, the academic calendar, and secondary project tools.",
        title: "Home",
      },
      map: {
        canonicalPath: "/map",
        description:
          "Public placeholder for the future ITAM Planner campus and classroom map slice.",
        title: "Map",
      },
      planner: {
        canonicalPath: "/planner",
        description:
          "Local ITAM Planner schedule for building a private browser-owned timetable from the precomputed public catalog.",
        title: "Schedule",
      },
      plannerOnboarding: {
        canonicalPath: "/planner/onboarding",
        description:
          "Embedded ITAM Planner schedule onboarding for choosing academic level, entry term, careers, and default subjects.",
        title: "Schedule onboarding",
      },
      privacy: {
        canonicalPath: "/privacy",
        description:
          "ITAM Planner privacy notice covering what the site stores locally and what never leaves the browser.",
        title: "Privacy notice",
      },
      project: {
        canonicalPath: "/project",
        description:
          "ITAM Planner project surface with GitHub support, credits, and official sources.",
        title: "Project",
      },
      registration: {
        canonicalPath: "/registration",
        description:
          "Traceable ITAM Planner guide to the official registration flow without intercepting it.",
        title: "Registration",
      },
      search: {
        canonicalPath: "/search",
        description:
          "ITAM Planner local search over site routes, the published catalog, and traceable official sources.",
        title: "Search",
      },
      settings: {
        canonicalPath: "/settings",
        description:
          "Local ITAM Planner configuration for subjects, swipe behavior, and browser-owned schedule state.",
        title: "Configuration",
      },
      terms: {
        canonicalPath: "/terms",
        description:
          "ITAM Planner terms and conditions, including the legal non-affiliation disclaimer.",
        title: "Terms and conditions",
      },
    },
    siteDescription:
      "Academic schedule for ITAM students with a precomputed public catalog, browser-local state, and no accounts.",
    siteTitle: "ITAM Planner",
  },
  "es-MX": {
    applicationName: "ITAM Planner",
    homeStructuredDataDescription:
      "Proyecto independiente para planeación académica del ITAM con onboarding local, horario dedicado y catálogo público precalculado.",
    keywords: [
      "ITAM",
      "ITAM Planner",
      "horarios ITAM",
      "boletines ITAM",
      "calendario ITAM",
      "planes ITAM",
      "planeación académica ITAM",
    ],
    pages: {
      calendar: {
        canonicalPath: "/calendar",
        description:
          "Calendario público de ITAM Planner con eventos académicos generales y contexto del día cuando el horario local ya existe.",
        title: "Calendario",
      },
      connectAi: {
        canonicalPath: "/connect-ai",
        description:
          "Puente read-only de ITAM Planner hacia IA externa con estado del horario controlado por el navegador.",
        title: "Conectar con IA",
      },
      home: {
        canonicalPath: "/",
        description:
          "Inicio público de ITAM Planner: horario móvil, calendario académico y superficies secundarias como proyecto y conexión con IA.",
        title: "Inicio",
      },
      map: {
        canonicalPath: "/map",
        description:
          "Placeholder público del mapa de ITAM Planner para el futuro slice de campus y salones.",
        title: "Mapa",
      },
      planner: {
        canonicalPath: "/planner",
        description:
          "Horario local de ITAM Planner para construir un horario privado en el navegador con el catálogo público ya precalculado.",
        title: "Horario",
      },
      plannerOnboarding: {
        canonicalPath: "/planner/onboarding",
        description:
          "Onboarding embebido en el horario de ITAM Planner para elegir nivel académico, periodo de ingreso, carreras y materias por defecto.",
        title: "Onboarding del horario",
      },
      privacy: {
        canonicalPath: "/privacy",
        description:
          "Aviso de privacidad de ITAM Planner con detalle de los datos locales que sí se guardan y los que nunca salen al backend.",
        title: "Aviso de privacidad",
      },
      project: {
        canonicalPath: "/project",
        description:
          "Superficie del proyecto de ITAM Planner con soporte en GitHub, créditos y fuentes oficiales.",
        title: "Proyecto",
      },
      registration: {
        canonicalPath: "/registration",
        description:
          "Guía trazable de ITAM Planner para entrar al flujo oficial de inscripciones sin interceptarlo.",
        title: "Inscripciones",
      },
      search: {
        canonicalPath: "/search",
        description:
          "Búsqueda local de ITAM Planner sobre rutas del sitio, catálogo publicado y fuentes oficiales trazables.",
        title: "Búsqueda",
      },
      settings: {
        canonicalPath: "/settings",
        description:
          "Configuración local de ITAM Planner para materias, deslizamiento y estado privado del navegador.",
        title: "Configuración",
      },
      terms: {
        canonicalPath: "/terms",
        description:
          "Términos y condiciones de ITAM Planner, incluyendo el disclaimer legal y de no afiliación institucional.",
        title: "Términos y condiciones",
      },
    },
    siteDescription:
      "Horario académico para alumnos del ITAM con catálogo público precalculado, estado local en el navegador y sin cuentas.",
    siteTitle: "ITAM Planner",
  },
} satisfies Record<LocaleCode, SiteSeoCopy>;

export function getSeoCopy(locale: LocaleCode) {
  return seoCopy[locale] ?? seoCopy[DEFAULT_LOCALE];
}

export function buildPageMetadata(locale: LocaleCode, pageKey: PageSeoKey): Metadata {
  const page = getSeoCopy(locale).pages[pageKey];

  return {
    alternates: {
      canonical: page.canonicalPath,
    },
    description: page.description,
    openGraph: {
      description: page.description,
      title: page.title,
      type: "website",
      url: page.canonicalPath,
    },
    title: page.title,
    twitter: {
      description: page.description,
      title: page.title,
    },
  };
}

export function buildSiteMetadata(locale: LocaleCode): Metadata {
  const copy = getSeoCopy(locale);

  return {
    metadataBase: new URL("https://itam.humbertoschoenwald.com"),
    alternates: {
      canonical: "https://itam.humbertoschoenwald.com",
    },
    manifest: "/manifest.webmanifest",
    title: {
      default: copy.siteTitle,
      template: `%s | ${copy.siteTitle}`,
    },
    applicationName: copy.applicationName,
    description: copy.siteDescription,
    category: "education",
    creator: "Humberto Schoenwald",
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    keywords: copy.keywords,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: copy.applicationName,
    },
    openGraph: {
      title: copy.siteTitle,
      description: copy.siteDescription,
      siteName: copy.siteTitle,
      locale: locale === "es-MX" ? "es_MX" : "en_US",
      type: "website",
      url: "https://itam.humbertoschoenwald.com",
    },
    robots: {
      follow: true,
      index: true,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@humbertoschoenwald",
      title: copy.siteTitle,
      description: copy.siteDescription,
    },
  };
}

export function buildHomeStructuredData(locale: LocaleCode) {
  const copy = getSeoCopy(locale);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: copy.homeStructuredDataDescription,
    inLanguage: locale,
    name: copy.siteTitle,
    publisher: {
      "@type": "Person",
      name: "Humberto Schoenwald",
    },
    url: "https://itam.humbertoschoenwald.com/",
  };
}
