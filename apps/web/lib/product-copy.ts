import type { LocaleCode } from "@/lib/types";

const productCopy = {
  en: {
    common: {
      close: "Close",
      configuration: "Configuration",
      connectToAi: "Connect to AI",
      inscriptions: "Inscriptions",
      map: "Map",
      menu: "Menu",
      project: "Project",
      search: "Search",
    },
    home: {
      introEyebrow: "Why this exists",
      introTitle: "A private academic planner built around official ITAM public data.",
      introBody:
        "This project exists to make public ITAM academic information easier to navigate without accounts, hidden sync, or unofficial mirrors.",
      newsEyebrow: "Official updates",
      newsTitle: "Traceable sources worth checking often",
      newsBody:
        "Every card below points back to an official ITAM-owned source so you can verify the original context yourself.",
      cards: [
        {
          action: "Open planner",
          body: "Set up your entry term, careers, joint programs, and subject defaults in the browser only.",
          href: "/planner",
          title: "Planner",
        },
        {
          action: "Open calendar",
          body: "Review the public academic calendar and payment milestones in one place.",
          href: "/calendar",
          title: "Calendar",
        },
        {
          action: "Open project",
          body: "Find repository links, support paths, and contribution surfaces.",
          href: "/project",
          title: "Project",
        },
        {
          action: "Open inscriptions",
          body: "Use a traceable guide for the official registration flow without proxying it.",
          href: "/inscripciones",
          title: "Inscriptions",
        },
      ],
    },
    siteHeader: {
      mobileMenuLabel: "Open product menu",
      searchLabel: "Open local search",
      secondaryNav: {
        configuration: "Configuration",
        connectToAi: "Connect to AI",
        inscriptions: "Inscriptions",
        project: "Project",
      },
    },
    plannerWizard: {
      careerBody:
        "Choose one or two base careers. The planner will use them to derive applicable plans and default subjects.",
      careerLimit: "You can choose up to two careers.",
      careerNone: "Pick at least one career before continuing.",
      careerSearch: "Search your career",
      careerTitle: "Which career do you study?",
      jointProgramsBody:
        "Optional. If an official joint program matches your selected careers and entry term, you can add it here.",
      jointProgramsEmpty:
        "No official joint programs matched the selected careers for this entry term.",
      jointProgramsTitle: "Do any joint programs apply to you?",
      selectedCount: "Selected",
      stepLabels: {
        careers: "Careers",
        entryTerm: "Entry term",
        finish: "Finish",
        intro: "Intro",
        jointPrograms: "Joint programs",
        swipe: "Swipe",
      },
      validation: {
        careers: "Choose at least one career before continuing.",
        jointPrograms: "Continue with or without a joint program.",
      },
    },
    plannerSettings: {
      eyebrow: "Configuration",
      resetBody:
        "Clear the browser-local profile, selected subjects, groups, and UI preferences in this browser only.",
      resetButton: "Reset local planner",
      resetConfirm:
        "This clears the browser-local planner context for this browser only. Continue?",
      subjectsBody:
        "Recommended subjects come from your selected careers and the estimated current semester. Search to add anything else from the published public catalog.",
      subjectsEmpty: "No subjects are selected yet.",
      subjectsSearch: "Search subjects",
      subjectsTitle: "Subjects",
      swipeBody:
        "Phone-only gesture preference. Desktop and tablet keep pointer and keyboard navigation.",
      swipeTitle: "Swipe mode",
      title: "Planner configuration",
    },
    plannerPage: {
      filteredSubjectsBody:
        "The planner starts from the estimated current semester and the academic programs you selected. You can adjust the subject set later from configuration.",
      filteredSubjectsEmpty:
        "No published groups matched the current subject selection for that period yet.",
      filteredSubjectsTitle: "Visible subjects",
      quickActionsTitle: "Quick actions",
    },
    searchPage: {
      empty: "No local results matched that query.",
      eyebrow: "Search",
      inputLabel: "Search the site and the published data",
      inputPlaceholder: "Search plans, periods, calendar events, routes, or official sources",
      title: "Local site search",
    },
    inscriptionsPage: {
      body:
        "This route does not proxy or automate registration. It only points you to the official ITAM flow and records the source links used for the guidance.",
      steps: [
        "Open the official Servicios ITAM page.",
        "Choose the Inscripciones option inside that official site.",
        "Continue with your institutional credentials in the official registration system.",
      ],
      title: "Official inscriptions guide",
      traceability: "Traceable official sources",
    },
    mapPage: {
      body:
        "A detailed classroom and campus map is still deferred. This placeholder keeps the route and scope visible without pretending the map is finished.",
      title: "Map",
    },
  },
  "es-MX": {
    common: {
      close: "Cerrar",
      configuration: "Configuración",
      connectToAi: "Connect to AI",
      inscriptions: "Inscripciones",
      map: "Mapa",
      menu: "Menú",
      project: "Proyecto",
      search: "Buscar",
    },
    home: {
      introEyebrow: "Por qué existe",
      introTitle: "Un planner académico privado construido sobre datos públicos oficiales del ITAM.",
      introBody:
        "Este proyecto existe para hacer navegable la información académica pública del ITAM sin cuentas, sin sync oculto y sin espejos no oficiales.",
      newsEyebrow: "Actualizaciones oficiales",
      newsTitle: "Fuentes trazables que conviene revisar seguido",
      newsBody:
        "Cada tarjeta de abajo apunta a una fuente oficial del ITAM para que puedas verificar el contexto original por tu cuenta.",
      cards: [
        {
          action: "Abrir planner",
          body: "Configura tu ingreso, tus carreras, tus planes conjuntos y tus materias por defecto solo en el navegador.",
          href: "/planner",
          title: "Planner",
        },
        {
          action: "Abrir calendario",
          body: "Consulta el calendario académico y los hitos de pagos en un solo lugar.",
          href: "/calendar",
          title: "Calendario",
        },
        {
          action: "Abrir proyecto",
          body: "Encuentra links del repositorio, rutas de soporte y superficies de contribución.",
          href: "/project",
          title: "Proyecto",
        },
        {
          action: "Abrir inscripciones",
          body: "Usa una guía trazable para el flujo oficial de inscripciones sin interceptarlo.",
          href: "/inscripciones",
          title: "Inscripciones",
        },
      ],
    },
    siteHeader: {
      mobileMenuLabel: "Abrir menú del producto",
      searchLabel: "Abrir búsqueda local",
      secondaryNav: {
        configuration: "Configuración",
        connectToAi: "Connect to AI",
        inscriptions: "Inscripciones",
        project: "Proyecto",
      },
    },
    plannerWizard: {
      careerBody:
        "Elige una o dos carreras base. Con eso el planner puede derivar planes aplicables y materias por defecto.",
      careerLimit: "Puedes elegir hasta dos carreras.",
      careerNone: "Elige al menos una carrera antes de continuar.",
      careerSearch: "Busca tu carrera",
      careerTitle: "¿Qué carrera estudias?",
      jointProgramsBody:
        "Opcional. Si un programa conjunto oficial coincide con tus carreras y tu ingreso, puedes agregarlo aquí.",
      jointProgramsEmpty:
        "Ningún programa conjunto oficial coincide con las carreras elegidas para ese ingreso.",
      jointProgramsTitle: "¿Te aplica algún programa conjunto?",
      selectedCount: "Seleccionadas",
      stepLabels: {
        careers: "Carreras",
        entryTerm: "Ingreso",
        finish: "Finalizar",
        intro: "Inicio",
        jointPrograms: "Conjuntos",
        swipe: "Deslizamiento",
      },
      validation: {
        careers: "Elige al menos una carrera antes de continuar.",
        jointPrograms: "Continúa con o sin programa conjunto.",
      },
    },
    plannerSettings: {
      eyebrow: "Configuración",
      resetBody:
        "Borra el perfil local, las materias seleccionadas, los grupos y las preferencias visuales solo en este navegador.",
      resetButton: "Borrar planner local",
      resetConfirm:
        "Esto borra el contexto local del planner solo en este navegador. ¿Continuar?",
      subjectsBody:
        "Las materias recomendadas salen de las carreras que elegiste y del semestre estimado. Usa la búsqueda para agregar cualquier otra materia del catálogo público publicado.",
      subjectsEmpty: "Todavía no hay materias seleccionadas.",
      subjectsSearch: "Buscar materias",
      subjectsTitle: "Materias",
      swipeBody:
        "Preferencia del gesto solo para teléfono. En tablet y computadora la navegación sigue por mouse, trackpad y teclado.",
      swipeTitle: "Modo de deslizamiento",
      title: "Configuración del planner",
    },
    plannerPage: {
      filteredSubjectsBody:
        "El planner arranca desde el semestre estimado y los programas académicos que elegiste. Luego puedes ajustar las materias desde configuración.",
      filteredSubjectsEmpty:
        "Todavía no hay grupos publicados que coincidan con la selección actual de materias para ese periodo.",
      filteredSubjectsTitle: "Materias visibles",
      quickActionsTitle: "Acciones rápidas",
    },
    searchPage: {
      empty: "Ningún resultado local coincide con esa búsqueda.",
      eyebrow: "Buscar",
      inputLabel: "Busca en el sitio y en los datos publicados",
      inputPlaceholder:
        "Busca planes, periodos, eventos del calendario, rutas o fuentes oficiales",
      title: "Búsqueda local del sitio",
    },
    inscriptionsPage: {
      body:
        "Esta ruta no intercepta ni automatiza inscripciones. Solo te dirige al flujo oficial del ITAM y deja trazables las fuentes usadas para la guía.",
      steps: [
        "Abre la página oficial de Servicios ITAM.",
        "Elige la opción Inscripciones dentro de ese sitio oficial.",
        "Continúa con tus credenciales institucionales dentro del sistema oficial de registro.",
      ],
      title: "Guía oficial de inscripciones",
      traceability: "Fuentes oficiales trazables",
    },
    mapPage: {
      body:
        "El mapa detallado de campus y salones sigue diferido. Este placeholder deja visible la ruta sin fingir que el mapa ya está terminado.",
      title: "Mapa",
    },
  },
} satisfies Record<LocaleCode, unknown>;

export function getProductCopy(locale: LocaleCode) {
  return productCopy[locale] ?? productCopy["es-MX"];
}
