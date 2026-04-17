import { DEFAULT_LOCALE } from "@/lib/locale";
import type { LocaleCode } from "@/lib/types";

const productCopy = {
  en: {
    common: {
      close: "Close",
      configuration: "Configuration",
      connectToAi: "Connect to AI",
      executiveEducation: "Executive education",
      registration: "Registration",
      map: "Map",
      menu: "Menu",
      news: "News",
      no: "No",
      project: "Project",
      search: "Search",
      yes: "Yes",
    },
    home: {
      introEyebrow: "Why this exists",
      introTitle: "A private academic schedule built around official ITAM public data.",
      introBody:
        "This project exists to make public ITAM academic information easier to navigate without accounts, hidden sync, or unofficial mirrors.",
      newsEyebrow: "Official updates",
      newsTitle: "Traceable sources worth checking often",
      newsBody:
        "Every card below points back to an official ITAM-owned source so you can verify the original context yourself.",
      cards: [
        {
          action: "Open schedule",
          body: "Set up your entry term, careers, joint programs, and subject defaults in the browser only.",
          href: "/planner",
          title: "Schedule",
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
          action: "Open registration",
          body: "Use a traceable guide for the official registration flow without proxying it.",
          href: "/registration",
          title: "Registration",
        },
      ],
    },
    siteHeader: {
      mobileMenuLabel: "Open product menu",
      officialLinksLabel: "Open official links menu",
      searchLabel: "Open local search",
      secondaryNav: {
        configuration: "Configuration",
        connectToAi: "Connect to AI",
        executiveEducation: "Executive education",
        registration: "Registration",
        project: "Project",
      },
    },
    plannerWizard: {
      academicLevelBody:
        "Choose whether you want the schedule to start from undergraduate public data or graduate public periods.",
      academicLevelOptions: {
        graduate: {
          body: "Use public master's and hybrid periods without forcing undergraduate career defaults.",
          title: "Graduate",
        },
        jointPrograms: {
          body: "Use official joint-program choices only for the selected entry term, then seed planner subjects from those matching public plans.",
          title: "Joint programs",
        },
        undergraduate: {
          body: "Use undergraduate careers, official joint programs, and default subjects from the public catalog.",
          title: "Undergraduate",
        },
      },
      academicLevelTitle: "What academic level are you in?",
      careerBody:
        "Choose one or two base careers. The schedule will use them to derive applicable plans and default subjects.",
      careerLimit: "You can choose up to two careers.",
      careerNone: "Pick at least one career before continuing.",
      careerSearch: "Search your career",
      careerTitle: "Which career do you study?",
      classesBody:
        "Choose the public classes you actually want to keep from the published period that matches your current level.",
      classesCount: "Selected classes",
      classesTitle: "Which public classes should stay in your schedule?",
      localeBody:
        "Choose the language this browser should use across the visible product UI. You can change it later from configuration.",
      localeTitle: "Which language should the product use?",
      jointProgramsBody:
        "Choose the official joint programs that apply to you for the selected entry term.",
      jointProgramsEmpty:
        "No official joint programs matched the selected careers for this entry term.",
      jointProgramsTitle: "Which joint programs apply to you?",
      subjectsBody:
        "The schedule already selected default subjects from your current academic context. Keep them, remove them, or search the full published catalog.",
      subjectsCount: "Selected subjects",
      subjectsDefaultEmpty:
        "No default subjects were inferred from the current public catalog. Search the published catalog and choose the ones you want to keep.",
      subjectsRecommendedApplied:
        "The default subjects are already selected above. Search the published catalog if you want to add more.",
      subjectsRecommended: "Default subjects",
      subjectsSearchPlaceholder: "Search any public subject",
      subjectsSelected: "Current subject selection",
      subjectsTitle: "Which subjects should the schedule start with?",
      selectedCount: "Selected",
      stepLabels: {
        academicLevel: "Level",
        careers: "Careers",
        classes: "Classes",
        entryTerm: "Entry term",
        finish: "Finish",
        intro: "Intro",
        jointPrograms: "Joint programs",
        locale: "Language",
        subjects: "Subjects",
        swipe: "Swipe",
      },
      validation: {
        academicLevel: "Choose the academic level before continuing.",
        careers: "Choose at least one career before continuing.",
        classes:
          "Choose at least one public class before continuing, unless nothing has been published yet for the current subject set.",
        jointPrograms: "Continue with or without a joint program.",
        jointProgramsRequired: "Choose at least one joint program before continuing.",
        locale: "Choose the interface language before continuing.",
        subjects: "Choose at least one subject before continuing.",
      },
    },
    plannerSettings: {
      eyebrow: "Configuration",
      classSpacingBody:
        "Choose whether to prioritize tighter class blocks or more separation between classes.",
      classSpacingOptions: {
        clustered: "Classes together",
        separated: "Classes separated",
      },
      classSpacingTitle: "Class spacing",
      importanceLabel: "Importance",
      lighterDayBody:
        "Pick the weekday you would prefer to keep lighter than the rest when the future generator ranks schedule variants.",
      lighterDayTitle: "Day with fewer classes",
      noPreference: "No preference",
      preferencesBody:
        "These browser-local preferences stay separate from the public catalog and shape how the future schedule generator should rank schedule variants.",
      preferencesTitle: "Schedule preferences",
      resetBody:
        "Clear the browser-local profile, selected subjects, groups, and UI preferences in this browser only.",
      resetButton: "Reset local schedule",
      resetConfirm:
        "This clears the browser-local schedule context for this browser only. Continue?",
      availableSubjectBadge: "Available",
      scheduleBody:
        "Choose the public period and the public groups you want to keep in this browser-local schedule state.",
      scheduleEmpty:
        "No published groups matched the current subject selection for that period yet.",
      scheduleLoadError:
        "The selected public period could not be loaded from the published catalog.",
      scheduleLoading: "Loading the selected public period...",
      scheduleTitle: "Public schedule",
      selectedClassesEmpty: "No public classes selected yet.",
      selectedClassesTitle: "Selected classes",
      selectedSubjectBadge: "Selected",
      sameTheoryLabGroupBody:
        "Keep theory and lab on the same group when a subject exposes both sections and that pairing exists publicly.",
      sameTheoryLabGroupTitle: "Same theory and lab group",
      subjectsBody:
        "Recommended subjects come from your selected careers and the estimated current semester. Search to add anything else from the published public catalog.",
      subjectsDefaultTitle: "Default subjects",
      subjectsEmpty: "No subjects are selected yet.",
      subjectsSelectedTitle: "Selected subjects",
      subjectsSearch: "Search subjects",
      subjectsTitle: "Subjects",
      swipeBody:
        "Phone-only gesture preference. Desktop and tablet keep pointer and keyboard navigation.",
      swipeTitle: "Swipe mode",
      teacherRankingBody:
        "Decide whether future schedule ranking should prioritize teachers that have higher general evaluations and visible profiles on MisProfes.com.",
      teacherRankingTitle: "Rank with MisProfes.com",
      timeRangeBody:
        "Choose the time window where you would prefer all selected classes to land.",
      timeRangeEndLabel: "Latest class end",
      timeRangeStartLabel: "Earliest class start",
      timeRangeTitle: "Time range",
      title: "Schedule configuration",
    },
    plannerPage: {
      filteredSubjectsBody:
        "The schedule keeps only the current subject set that shapes the visible public groups for the selected period.",
      filteredSubjectsEmpty:
        "No published groups matched the current subject selection for that period yet.",
      filteredSubjectsTitle: "Active subjects",
      quickActionsTitle: "Quick actions",
    },
    searchPage: {
      empty: "No local results matched that query.",
      eyebrow: "Search",
      inputLabel: "Search the site and the published data",
      inputPlaceholder: "Search plans, periods, calendar events, routes, or official sources",
      title: "Local site search",
    },
    registrationPage: {
      body:
        "This route does not proxy or automate registration. It only points you to the official ITAM flow and records the source links used for the guidance.",
      sourceLabels: {
        destination: "Official registration destination",
        services: "Servicios ITAM",
      },
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
      connectToAi: "Conectar con IA",
      executiveEducation: "Educación ejecutiva",
      registration: "Inscripciones",
      map: "Mapa",
      menu: "Menú",
      news: "Noticias",
      no: "No",
      project: "Proyecto",
      search: "Buscar",
      yes: "Sí",
    },
    home: {
      introEyebrow: "Por qué existe",
      introTitle: "Un horario académico privado construido sobre datos públicos oficiales del ITAM.",
      introBody:
        "Este proyecto existe para hacer navegable la información académica pública del ITAM sin cuentas, sin sincronización oculta y sin espejos no oficiales.",
      newsEyebrow: "Actualizaciones oficiales",
      newsTitle: "Fuentes trazables que conviene revisar seguido",
      newsBody:
        "Cada tarjeta de abajo apunta a una fuente oficial del ITAM para que puedas verificar el contexto original por tu cuenta.",
      cards: [
        {
          action: "Abrir horario",
          body: "Configura tu ingreso, tus carreras, tus planes conjuntos y tus materias por defecto solo en el navegador.",
          href: "/planner",
          title: "Horario",
        },
        {
          action: "Abrir calendario",
          body: "Consulta el calendario académico y los hitos de pagos en un solo lugar.",
          href: "/calendar",
          title: "Calendario",
        },
        {
          action: "Abrir proyecto",
          body: "Encuentra enlaces del repositorio, rutas de soporte y superficies de contribución.",
          href: "/project",
          title: "Proyecto",
        },
        {
          action: "Abrir inscripciones",
          body: "Usa una guía trazable para el flujo oficial de inscripciones sin interceptarlo.",
          href: "/registration",
          title: "Inscripciones",
        },
      ],
    },
    siteHeader: {
      mobileMenuLabel: "Abrir menú del producto",
      officialLinksLabel: "Abrir menú de enlaces oficiales",
      searchLabel: "Abrir búsqueda local",
      secondaryNav: {
        configuration: "Configuración",
        connectToAi: "Conectar con IA",
        executiveEducation: "Educación ejecutiva",
        registration: "Inscripciones",
        project: "Proyecto",
      },
    },
    plannerWizard: {
      academicLevelBody:
        "Elige si quieres que el horario arranque desde datos públicos de licenciatura o desde periodos públicos de maestría.",
      academicLevelOptions: {
        graduate: {
          body: "Usa periodos públicos de maestría e híbrido sin forzar carreras ni materias de licenciatura.",
          title: "Maestría",
        },
        jointPrograms: {
          body: "Usa solo planes conjuntos oficiales para el ingreso seleccionado y deriva desde ahí las materias iniciales.",
          title: "Planes conjuntos",
        },
        undergraduate: {
          body: "Usa carreras de licenciatura/ingeniería, programas conjuntos oficiales y materias por defecto del catálogo público.",
          title: "Licenciatura / ingeniería",
        },
      },
      academicLevelTitle: "¿En qué nivel académico estás?",
      careerBody:
        "Elige una o dos carreras base. Con eso el horario puede derivar planes aplicables y materias por defecto.",
      careerLimit: "Puedes elegir hasta dos carreras.",
      careerNone: "Elige al menos una carrera antes de continuar.",
      careerSearch: "Busca tu carrera",
      careerTitle: "¿Qué carrera estudias?",
      classesBody:
        "Elige las clases públicas que sí quieres conservar dentro del periodo publicado que corresponde a tu nivel actual.",
      classesCount: "Clases seleccionadas",
      classesTitle: "¿Qué clases públicas deben quedarse en tu horario?",
      localeBody:
        "Elige el idioma que debe usar este navegador en toda la interfaz visible del producto. Después puedes cambiarlo desde configuración.",
      localeTitle: "¿En qué idioma quieres usar el producto?",
      jointProgramsBody:
        "Elige los planes conjuntos oficiales que sí te aplican para el ingreso seleccionado.",
      jointProgramsEmpty:
        "Ningún programa conjunto oficial coincide con las carreras elegidas para ese ingreso.",
      jointProgramsTitle: "¿Qué planes conjuntos te aplican?",
      subjectsBody:
        "El horario ya marcó las materias por defecto según tu contexto académico actual. Puedes dejarlas, quitarlas o buscar cualquier otra materia publicada.",
      subjectsCount: "Materias seleccionadas",
      subjectsDefaultEmpty:
        "El catálogo público actual no permitió inferir materias por defecto. Busca en el catálogo publicado y marca las que quieras conservar.",
      subjectsRecommendedApplied:
        "Las materias por defecto ya quedaron marcadas arriba. Usa la búsqueda si quieres agregar más.",
      subjectsRecommended: "Materias por defecto",
      subjectsSearchPlaceholder: "Busca cualquier materia pública",
      subjectsSelected: "Selección actual de materias",
      subjectsTitle: "¿Con qué materias debe arrancar el horario?",
      selectedCount: "Seleccionadas",
      stepLabels: {
        academicLevel: "Nivel",
        careers: "Carreras",
        classes: "Clases",
        entryTerm: "Ingreso",
        finish: "Finalizar",
        intro: "Inicio",
        jointPrograms: "Conjuntos",
        locale: "Idioma",
        subjects: "Materias",
        swipe: "Deslizamiento",
      },
      validation: {
        academicLevel: "Elige el nivel académico antes de continuar.",
        careers: "Elige al menos una carrera antes de continuar.",
        classes:
          "Elige al menos una clase pública antes de continuar, salvo que todavía no exista una publicada para las materias actuales.",
        jointPrograms: "Continúa con o sin programa conjunto.",
        jointProgramsRequired: "Elige al menos un plan conjunto antes de continuar.",
        locale: "Elige el idioma de la interfaz antes de continuar.",
        subjects: "Elige al menos una materia antes de continuar.",
      },
    },
    plannerSettings: {
      eyebrow: "Configuración",
      classSpacingBody:
        "Indica si prefieres clases más juntas o más separadas entre sí.",
      classSpacingOptions: {
        clustered: "Clases juntas",
        separated: "Clases separadas",
      },
      classSpacingTitle: "Clases juntas o separadas",
      importanceLabel: "Importancia",
      lighterDayBody:
        "Elige el día de la semana que te gustaría dejar con menos clases cuando el generador futuro ordene variantes del horario.",
      lighterDayTitle: "Día con menos clases",
      noPreference: "Sin preferencia",
      preferencesBody:
        "Estas preferencias se guardan solo en el navegador y quedan separadas del catálogo público. Después le dirán al generador de horarios cómo priorizar variantes.",
      preferencesTitle: "Preferencias del horario",
      resetBody:
        "Borra el perfil local, las materias seleccionadas, los grupos y las preferencias visuales solo en este navegador.",
      resetButton: "Borrar horario local",
      resetConfirm:
        "Esto borra el contexto local del horario solo en este navegador. ¿Continuar?",
      availableSubjectBadge: "Disponible",
      scheduleBody:
        "Elige el periodo público y los grupos públicos que quieres conservar dentro del estado local del horario.",
      scheduleEmpty:
        "Todavía no hay grupos publicados que coincidan con la selección actual de materias para ese periodo.",
      scheduleLoadError:
        "No fue posible cargar el periodo público seleccionado desde el catálogo publicado.",
      scheduleLoading: "Cargando el periodo público seleccionado...",
      scheduleTitle: "Horario público",
      selectedClassesEmpty: "Todavía no hay clases públicas seleccionadas.",
      selectedClassesTitle: "Clases seleccionadas",
      selectedSubjectBadge: "Seleccionada",
      sameTheoryLabGroupBody:
        "Si una materia tiene teoría y laboratorio, prioriza combinaciones donde ambos queden en el mismo grupo cuando eso exista públicamente.",
      sameTheoryLabGroupTitle: "Mismo grupo teoría y lab",
      subjectsBody:
        "Las materias recomendadas salen de las carreras que elegiste y del semestre estimado. Usa la búsqueda para agregar cualquier otra materia del catálogo público publicado.",
      subjectsDefaultTitle: "Materias por defecto",
      subjectsEmpty: "Todavía no hay materias seleccionadas.",
      subjectsSelectedTitle: "Materias seleccionadas",
      subjectsSearch: "Buscar materias",
      subjectsTitle: "Materias",
      swipeBody:
        "Preferencia del gesto solo para teléfono. En tablet y computadora la navegación sigue por mouse, trackpad y teclado.",
      swipeTitle: "Modo de deslizamiento",
      teacherRankingBody:
        "Indica si se deben tomar en cuenta las evaluaciones generales de MisProfes.com para priorizar profesores con mejor calificación y perfil visible.",
      teacherRankingTitle: "Rankear con MisProfes.com",
      timeRangeBody:
        "Indica el rango del día donde te gustaría que cayeran todas tus clases.",
      timeRangeEndLabel: "Última clase",
      timeRangeStartLabel: "Primera clase",
      timeRangeTitle: "Rango de horario",
      title: "Configuración del horario",
    },
    plannerPage: {
      filteredSubjectsBody:
        "El horario conserva solo el conjunto actual de materias que define los grupos públicos visibles para el periodo seleccionado.",
      filteredSubjectsEmpty:
        "Todavía no hay grupos publicados que coincidan con la selección actual de materias para ese periodo.",
      filteredSubjectsTitle: "Materias activas",
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
    registrationPage: {
      body:
        "Esta ruta no intercepta ni automatiza inscripciones. Solo te dirige al flujo oficial del ITAM y deja trazables las fuentes usadas para la guía.",
      sourceLabels: {
        destination: "Destino oficial de inscripciones",
        services: "Servicios ITAM",
      },
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
        "El mapa detallado de campus y salones sigue diferido. Este marcador deja visible la ruta sin fingir que el mapa ya está terminado.",
      title: "Mapa",
    },
  },
} satisfies Record<LocaleCode, unknown>;

export function getProductCopy(locale: LocaleCode) {
  return productCopy[locale] ?? productCopy[DEFAULT_LOCALE];
}
