import { LOCALE_LABELS } from "@/lib/locale";
import type { LocaleCode } from "@/lib/types";

const uiCopy = {
  en: {
    common: {
      calendar: "Calendar",
      backToPlanner: "Back to schedule",
      community: "Community",
      connectToAi: "Connect to AI",
      genericErrorBody:
        "This view could not be loaded. Retry or open planner onboarding.",
      genericErrorTitle: "This view could not be loaded.",
      goToOnboarding: "Open onboarding",
      home: "Home",
      localeLabels: LOCALE_LABELS.en,
      open: "Open",
      planner: "Schedule",
      retry: "Retry",
      timeColumnLabel: "Time",
      weekdayLabels: {
        DO: "Sun",
        JU: "Thu",
        LU: "Mon",
        MA: "Tue",
        MI: "Wed",
        SA: "Sat",
        VI: "Fri",
      },
    },
    projectLinks: {
      githubIssuesLabel: "GitHub Issues",
      githubDescription:
        "Report bugs, source drift, data corrections, and feature ideas through the canonical support path.",
      instagramLabel: "Instagram",
      instagramDescription:
        "Follow the creator's work, quality experiments, and project updates. Not a support channel.",
    },
    projectPage: {
      creditsBody:
        "The repository credits Horarios-ITAM as inspiration in the same problem space, keeps this implementation fully original, and relies on public ITAM academic materials as source inputs for the normalized catalog.",
      creditsEyebrow: "Credits and sources",
      creditsLinks: {
        bibliography: "Tooling and standards bibliography",
        inspiration: "Horarios-ITAM inspiration",
        publicSources: "ITAM public academic sources",
      },
      creditsTitle: "Why this exists",
      creatorNote:
        "Instagram is for creator visibility and project updates. It is not support and it is not official ITAM contact.",
      creatorSurfaces: "Creator surfaces",
      eyebrow: "Project",
      issueBullets: [
        "Bug report for broken app or pipeline behavior.",
        "Data correction for incorrect normalized academic data.",
        "Source drift when an upstream ITAM page or PDF changed shape.",
        "Feature request for new schedule or UX ideas.",
      ],
      issueLead: "Choose the issue template that matches your report:",
      issueShortcuts: {
        bug: "Bug report",
        dataCorrection: "Data correction",
        featureRequest: "Feature request",
        sourceDrift: "Source drift",
      },
      issueTitle: "Open an issue",
      signUpLead: "If you still need a GitHub account, create one at",
      supportPath: "Canonical support path",
      title: "Project, issues, and creator links",
      description:
        "Use GitHub issues for bugs, data corrections, source drift, and feature requests. Creator social links live here too, but support stays on GitHub.",
    },
    homePage: {
      eyebrow: "Home",
      title: "The mobile shell for schedule, calendar, and secondary tools.",
      description:
        "Use Home as the discovery surface, keep Schedule focused on your browser-local timetable, and open Calendar for the general academic timeline.",
      primaryAction: "Open schedule",
      secondaryAction: "Open calendar",
      surfaceEyebrow: "Mobile-first shell",
      panels: [
        {
          title: "Browser-local schedule",
          body: "Your academic profile, selected groups, and UI preferences stay in this browser.",
        },
        {
          title: "Precomputed public data",
          body: "The app reads normalized public academic artifacts instead of recalculating catalog relationships at request time.",
        },
        {
          title: "Safari-first navigation",
          body: "The top bar is the main mobile navigation surface, including the schedule-to-home swipe shortcut.",
        },
      ],
      featureCards: [
        {
          action: "Open schedule",
          body: "Schedule now owns onboarding, schedule selection, and widget preferences inside a single route family.",
          eyebrow: "Primary flow",
          href: "/planner",
          title: "Schedule",
        },
        {
          action: "Open calendar",
          body: "See the general academic calendar first, then enrich it with today’s class context once planner onboarding exists.",
          eyebrow: "Top-level destination",
          href: "/calendar",
          title: "Calendar",
        },
        {
          action: "Open project",
          body: "GitHub issues remain the support path for bugs, drift, and data corrections.",
          eyebrow: "Secondary surface",
          href: "/project",
          title: "Project",
        },
        {
          action: "Open AI setup",
          body: "The AI bridge stays secondary and lives here instead of competing for primary navigation space.",
          eyebrow: "Secondary surface",
          href: "/connect-ai",
          title: "Connect to AI",
        },
      ],
    },
    onboardingPage: {
      eyebrow: "Onboarding",
      title: "Capture the academic basics once in this browser.",
      description:
        "Choose your entry term, active plans, and preferred locale. The schedule route depends on this local state to know which documents apply to you.",
      entrySeason: "Season",
      entryTermHelp: "Pick the academic season and year. Free-text entry is intentionally disabled.",
      entryYear: "Year",
      seasonOptions: {
        fall: "Fall",
        spring: "Spring",
      },
      plannerGateBody:
        "The schedule route opened first, but this browser still needs the minimum onboarding state before the dedicated schedule shell can load.",
      plannerGateTitle: "Finish onboarding to enter the schedule",
      noPlansForTermBody:
        "No active bulletin plans matched the selected entry term in the published catalog. Try another year or wait for the next public catalog refresh.",
      noPlansForTermTitle: "No plans matched this entry term",
      readyBody:
        "This browser already has the minimum onboarding state. You can refine it here or jump straight into the schedule.",
      readyTitle: "Onboarding already exists",
      openPlanner: "Continue",
      backHome: "Back to home",
      plansLockedBody:
        "Select the academic cycle and year first. Only then can the schedule show the plans that actually apply to that entry term.",
      plansLockedTitle: "Select the entry term first",
      selectSeason: "Select a season",
      selectYear: "Select a year",
      validationBody:
        "Choose both entry-term selectors and keep at least one active plan before moving to the schedule.",
      validationTitle: "Complete the required onboarding fields",
    },
    plannerOnboarding: {
      back: "Back",
      eyebrow: "Schedule onboarding",
      entryTermBody:
        "Choose the academic cycle and year that match your ITAM entry term. Only real years from the published catalog appear here.",
      entryTermTitle: "What is your entry term?",
      entryYearLabel: "Entry year",
      finish: "Finish and open schedule",
      finishBody:
        "You already gave the minimum data the schedule needs to shape your local context.",
      finishHighlight: "Perfect, you configured your schedule.",
      finishSummary: {
        entryTerm: "Entry term",
        locale: "Language",
        pending: "Pending",
        program: "Career",
        swipe: "Swipe preference",
      },
      finishSupport:
        "On the next screen the browser will assemble your local schedule shell and take you straight into Schedule.",
      finishTitle: "Ready to create your schedule",
      introBody:
        "We will ask for a few basics so this browser can decide which public plans apply to you and how the schedule should feel from the first swipe.",
      introCards: [
        {
          body: "Your academic basics stay in this browser only. No account, no backend profile, no cloud sync.",
          title: "Private by default",
        },
        {
          body: "The schedule reads precomputed public data so it can adapt the visible documents and routes to your context.",
          title: "Real public catalog",
        },
        {
          body: "The first setup is short. After that you can go straight into Schedule and adjust details later.",
          title: "Quick setup",
        },
      ],
      introTitle: "Let’s configure the schedule once",
      loadingBody:
        "The browser is assembling your local schedule shell, matching the public catalog, and preparing the first route state.",
      loadingCards: [
        {
          body: "Matching your entry term to the published plans that actually apply.",
          title: "Catalog context",
        },
        {
          body: "Preparing the schedule widgets and the navigation preferences for this browser.",
          title: "Local shell",
        },
        {
          body: "Generating the first browser-owned code from the profile you just configured.",
          title: "Portable context",
        },
      ],
      loadingEyebrow: "Configuring this browser",
      loadingTitle: "Preparing your schedule",
      next: "Next",
      openPlanner: "Continue onboarding",
      programBody:
        "Search and pick the career that applies to you for that entry term. Repeated plan titles are collapsed on purpose.",
      programLockedBody:
        "Choose the academic cycle and year first. Only then can the schedule show the careers that really match your entry term.",
      programSearchEmpty:
        "No careers matched that search in the current published catalog.",
      programSearchLabel: "Search your career",
      programSearchPlaceholder: {
        career: "Search your career",
        engineering: "Search your engineering",
        degree: "Search your degree",
        mixed: "Search your degree or engineering",
      },
      programTitles: {
        career: "Select your career:",
        engineering: "Select your engineering:",
        degree: "Select your degree:",
        mixed: "Select your degree / engineering:",
      },
      redirectBody: "Schedule needs the embedded onboarding flow before this browser can render your timetable shell.",
      redirectTitle: "Schedule is preparing your onboarding flow",
      stepLabels: {
        academicLevel: "Academic level",
        entryTerm: "Entry term",
        finish: "Finish",
        intro: "Overview",
        locale: "Language",
        program: "Career",
        subjects: "Subjects",
        swipe: "Swipe",
      },
      swipeOptions: {
        inverted: {
          body: "Swipe right and animate toward the opposite side. The destination still stays deterministic.",
          title: "Inverted motion",
        },
        natural: {
          body: "Swipe right and animate in the same visual direction as the movement.",
          title: "Natural motion",
        },
      },
      swipePreferenceBody:
        "Schedule always moves you to the adjacent destination, but you can choose whether the animation should feel natural or inverted on this device.",
      swipePreferenceTitle: "How should swipe motion feel?",
      title: "Answer the schedule questions one step at a time",
      validationBody: {
        academicLevel: "Choose the academic level before continuing.",
        entryTerm: "Choose both the academic cycle and a real year from the published catalog before continuing.",
        finish: "Review the summary and then finish the setup.",
        intro: "Continue to capture the minimum schedule data.",
        program: "Choose one career from the filtered list before continuing.",
        subjects: "Choose at least one subject before continuing.",
        swipe: "Choose how swipe motion should feel on this device before continuing.",
      },
      validationTitle: "A required step is still missing",
    },
    calendarPage: {
      calendarGridEventDays: "days with events",
      datePending: "Date pending",
      description:
        "Calendar stays useful before onboarding, then adds class-aware context once your schedule exists in this browser.",
      eyebrow: "Calendar",
      generalCalendarBody:
        "You can browse the public academic calendar right away. Schedule-specific class context appears here after completing schedule onboarding.",
      generalCalendarEyebrow: "General calendar",
      generalCalendarTitle: "Public calendar first",
      noAcademicPeriod: "General",
      paymentsEyebrow: "Payments",
      paymentsTitle: "Payment highlights",
      schoolEyebrow: "Academic events",
      title: "Academic calendar",
    },
    legalPages: {
      privacy: {
        description: "What the site stores locally, what it never stores on the backend, and how browser-owned state behaves.",
        eyebrow: "Privacy",
        sections: [
          {
            body: "This product stores only browser-local schedule context such as your entry term, active plans, selected groups, widget preferences, and navigation preferences. That data stays on your device.",
            title: "What stays in the browser",
          },
          {
            body: "The backend does not store your name, email, student ID, selected schedule, or account-backed profile. There are no sign-ins, no analytics, and no personal telemetry.",
            title: "What never leaves the browser",
          },
        ],
        title: "Privacy notice",
      },
      terms: {
        description: "Independent-project legal context, non-affiliation notice, and scope expectations for public users.",
        eyebrow: "Terms",
        sections: [
          {
            body: "ITAM Planner is an independent open-source community project. It is not affiliated with, endorsed by, or maintained by Instituto Tecnológico Autónomo de México (ITAM).",
            title: "Non-affiliation",
          },
          {
            body: "Public academic materials from official ITAM-owned sources are normalized for planning convenience, but this website is not an official institutional service and must not be treated as one.",
            title: "Public-source use",
          },
        ],
        title: "Terms and conditions",
      },
    },
    footer: {
      caption: "Independent project. Legal details and privacy behavior live in the footer links.",
      privacy: "Privacy notice",
      terms: "Terms and conditions",
    },
    connectPage: {
      description:
        "The student code already reflects your browser-local schedule state. The exact AI-context endpoint shape is still deferred by doctrine, so this page stays focused on the current contract and what comes next.",
      eyebrow: "Connect to AI",
      title: "Prepare your browser-local schedule for external AI use",
    },
    connectPanel: {
      currentSnapshot: "Current snapshot",
      currentPlannerContext: "Current schedule context",
      deferredContract: "Deferred contract",
      entryTerm: "Entry term",
      finishOnboarding:
        "Finish onboarding and pick at least one plan or offering to generate a code.",
      footer:
        "The final ChatGPT setup instructions, iPhone screenshots, and the public AI-context endpoint land in the next slice after the endpoint contract is frozen in doctrine.",
      notSetYet: "Not set yet",
      plans: "Selected plans",
      offerings: "Selected offerings",
      supportLead: "Use GitHub issues for bugs or support.",
      timeline: [
        {
          body: "No account is required and your schedule data stays browser-owned.",
          title: "1. Keep the schedule local",
        },
        {
          body: "The later AI endpoint will remain read-only, JSON-only, and non-persistent.",
          title: "2. Freeze the AI endpoint contract",
        },
        {
          body: "Browser and iPhone setup assets land after the endpoint contract is accepted.",
          title: "3. Publish setup guides",
        },
      ],
      title: "What this will do",
      worksWithOtherAis: "This also works with other AIs. ChatGPT is just the first named setup target.",
      intro:
        "This page is the bridge to the future external AI flow. The final endpoint contract is intentionally still open, but the browser-local student code is already real.",
    },
    plannerHome: {
      activePlans: "Active plans",
      activePlansHelp:
        "Select the plans that currently apply to you. No account is required and nothing is stored in the backend.",
      activePlansShort: "active plans",
      activePeriodFallback: "No period selected",
      activePeriodTitle:
        "Choose one public period, then keep the groups you want in the browser-local schedule state.",
      browserOnlyLabel: "Current build direction",
      browserOnlyText:
        "Public data is normalized outside request time, then shipped back to the app as a stable catalog artifact.",
      currentLocale: "Current locale",
      currentProfileFallback: "Start with the academic basics",
      currentProfileHelp:
        "This state is private to the current browser. It decides which bulletins and regulations apply to you later.",
      currentProfileReady: "Profile in progress",
      entryTerm: "Entry term",
      groupsSelected: "Selected groups",
      intro:
        "Start with onboarding, choose the plans that apply to you, and shape a timetable from published ITAM schedule data. Your profile, selections, and future AI bridge stay in this browser only.",
      loadOfferings: "Loading offerings...",
      loadPlans: "Loading public plan list...",
      locale: "Preferred locale",
      noAccountRequired: "No account required",
      noAccountRequiredText:
        "Start with onboarding, choose your plan and sections, and keep the resulting schedule state in localStorage.",
      noPlannerData: "Schedule state is empty",
      noTermYet: "No term yet",
      noErrorFallback: "Unable to load schedule data.",
      noPeriodData: "Select a public period to start capturing schedule state.",
      offeredBy: "Instructor pending",
      period: "Public schedule period",
      plansMetric: "Published plans",
      plannerExists: "Schedule state exists",
      plannerShell: "Schedule shell",
      plannerShellHelp:
        "Select the groups you want to keep in your current schedule state.",
      groupLabel: "Group",
      selectedPeriodLoadError:
        "The selected public period could not be loaded from the published catalog.",
      selectedPeriodLoading: "Loading the selected public period...",
      redirectingHelp:
        "The schedule route requires an entry term and at least one active plan in this browser.",
      redirectingToOnboarding: "Redirecting to onboarding...",
      periodsMetric: "Public periods",
      plannerTitle: "A browser-local schedule with a normalized public catalog underneath.",
      profileReset: "Reset profile",
      resetPlanner: "Reset schedule",
      roomPending: "Room pending",
      updateOnboarding: "Update onboarding",
      selectAtLeastOne:
        "Select at least one public offering to start building the browser-local schedule state.",
      selectPeriod: "Select a period",
      step1: "Step 1",
      step2: "Step 2",
      step3: "Step 3",
      catalogFreshness: {
        description:
          "This build ships the latest promoted JSON catalog snapshot directly with the web app. These numbers show how fresh that published snapshot is.",
        eyebrow: "Published catalog",
        latestObservedSource: "Latest observed source",
        latestPromotion: "Last promotion",
        noData: "No published snapshot metadata yet.",
        notAvailableYet: "Not available yet",
        releaseLabel: "Release",
        snapshots: "Snapshots",
        statusLabels: {
          drift_detected: "Drift detected",
          failed: "Failed",
          no_changes: "No changes",
          running: "Running",
          succeeded: "Succeeded",
          unknown: "Unknown",
        },
        title: "Catalog freshness",
        trackedSources: "Tracked sources",
      },
      title: "ITAM Planner",
      timeline: [
        {
          body: "Choose the plans that apply to you and keep that context in this browser only.",
          title: "Onboard once",
        },
        {
          body: "Pick a public period, keep the groups you want, and shape the first schedule state.",
          title: "Shape the timetable",
        },
        {
          body: "Carry that state as a browser-owned code that later powers the external AI bridge.",
          title: "Carry the code",
        },
      ],
      surfaceBody:
        "Schedule focuses on browser-local onboarding, schedule capture, and the widgets you chose for launch.",
      surfaceEyebrow: "Schedule shell",
      subjectsBoard: {
        activePlansLabel: "Active plans",
        description:
          "Keep the applicable plans and the classes already selected in this browser visible without leaving Schedule.",
        eyebrow: "Subjects / plans",
        noPlans: "No active plans selected yet.",
        noSubjects: "No selected classes yet.",
        selectedSubjectsLabel: "Selected classes",
        title: "Academic context",
      },
      todayBoard: {
        description: "The schedule prioritizes today first whenever the daily widget is enabled.",
        empty: "No classes selected for today yet.",
        eyebrow: "Today",
        roomPending: "Room pending",
        title: "Today’s classes",
      },
      weekBoard: {
        description:
          "The weekly class table spans Monday through Sunday and only the time range covered by your selected classes.",
        empty:
          "Select public classes to see the weekly class table here.",
        eyebrow: "Weekly schedule",
        roomPending: "Room pending",
        title: "Class table",
      },
    },
    underConstruction: {
      body: "The schedule, the catalog bridge, and the visual system are still being hardened. Expect fast changes while the public beta is under active construction.",
      title: "Under construction",
    },
    studentCode: {
      browserOwned: "Browser-owned",
      copied: "Copied",
      copyCode: "Copy code",
      description:
        "This browser-owned code is generated from your current onboarding profile and schedule state. No account is required and no personal data is stored in the backend. Use GitHub issues for support; this code is the foundation for the later AI connection flow.",
      lengthSuffix: "characters",
      eyebrow: "Portable context",
      openConnectToAi: "Open the Connect to AI page",
      title: "Student code",
      waitingForPlannerData: "Waiting for schedule data",
      waitingForStudentCode:
        "Your student code appears here once profile and schedule state exist.",
    },
  },
  "es-MX": {
    common: {
      calendar: "Calendario",
      backToPlanner: "Volver al horario",
      community: "Comunidad",
      connectToAi: "Conectar con IA",
      genericErrorBody:
        "No se pudo cargar esta vista. Intenta de nuevo o abre la configuración del horario.",
      genericErrorTitle: "No se pudo cargar esta vista.",
      goToOnboarding: "Abrir configuración inicial",
      home: "Inicio",
      localeLabels: LOCALE_LABELS["es-MX"],
      open: "Abrir",
      planner: "Horario",
      retry: "Reintentar",
      timeColumnLabel: "Hora",
      weekdayLabels: {
        DO: "Dom",
        JU: "Jue",
        LU: "Lun",
        MA: "Mar",
        MI: "Mié",
        SA: "Sáb",
        VI: "Vie",
      },
    },
    projectLinks: {
      githubIssuesLabel: "GitHub Issues",
      githubDescription:
        "Reporta errores, cambios en fuentes oficiales, correcciones de datos e ideas de producto por la vía oficial del proyecto.",
      instagramLabel: "Instagram",
      instagramDescription:
        "Sigue el trabajo del creador, sus experimentos de calidad y las actualizaciones del proyecto. No es un canal de soporte.",
    },
    projectPage: {
      creditsBody:
        "El repositorio reconoce a Horarios-ITAM como inspiración en el mismo problema, mantiene esta implementación completamente original y usa materiales académicos públicos del ITAM como insumo para el catálogo normalizado.",
      creditsEyebrow: "Créditos y fuentes",
      creditsLinks: {
        bibliography: "Bibliografía de herramientas y estándares",
        inspiration: "Inspiración de Horarios-ITAM",
        publicSources: "Fuentes académicas públicas del ITAM",
      },
      creditsTitle: "Por qué existe esto",
      creatorNote:
        "Instagram existe para visibilidad del creador y actualizaciones del proyecto. No es soporte ni contacto oficial del ITAM.",
      creatorSurfaces: "Canales del creador",
      eyebrow: "Proyecto",
      issueBullets: [
        "Reporte de errores para comportamiento roto de la aplicación o del pipeline.",
        "Corrección de datos para información académica normalizada incorrecta.",
        "Cambio en fuente oficial cuando varía la forma de una página o PDF del ITAM.",
        "Solicitud de mejora para nuevas ideas de horario o experiencia de uso.",
      ],
      issueLead: "Elige la plantilla que mejor describa tu reporte:",
      issueShortcuts: {
        bug: "Reporte de errores",
        dataCorrection: "Corrección de datos",
        featureRequest: "Solicitud de mejora",
        sourceDrift: "Cambio en fuente oficial",
      },
      issueTitle: "Abrir una incidencia",
      signUpLead: "Si todavía no tienes cuenta de GitHub, créala en",
      supportPath: "Ruta oficial de soporte",
      title: "Proyecto, incidencias y enlaces del creador",
      description:
        "Usa GitHub Issues para errores, correcciones de datos, cambios en fuentes oficiales y solicitudes de mejora. Las redes del creador también viven aquí, pero el soporte se queda en GitHub.",
    },
    homePage: {
      eyebrow: "Inicio",
      title: "La superficie móvil para horario, calendario y herramientas secundarias.",
      description:
        "Usa Inicio como superficie de descubrimiento, deja que Horario se enfoque en tu horario local y abre Calendario para la línea académica general.",
      primaryAction: "Abrir horario",
      secondaryAction: "Abrir calendario",
      surfaceEyebrow: "Prioridad móvil",
      panels: [
        {
          title: "Horario solo en navegador",
          body: "Tu perfil académico, tus grupos y tus preferencias visuales se quedan en este navegador.",
        },
        {
          title: "Datos públicos precalculados",
          body: "La aplicación lee artefactos académicos públicos ya normalizados, en lugar de recalcular relaciones del catálogo en cada carga.",
        },
        {
          title: "Navegación pensada para Safari",
          body: "La barra superior es la superficie principal de navegación móvil, incluido el deslizamiento entre Horario e Inicio.",
        },
      ],
      featureCards: [
        {
          action: "Abrir horario",
          body: "Horario ahora absorbe la configuración inicial, la selección de grupos y las preferencias visuales dentro de una sola familia de rutas.",
          eyebrow: "Flujo principal",
          href: "/planner",
          title: "Horario",
        },
        {
          action: "Abrir calendario",
          body: "Consulta primero el calendario académico general y, después, enriquece esa vista con el contexto del día cuando tu horario ya exista.",
          eyebrow: "Destino principal",
          href: "/calendar",
          title: "Calendario",
        },
        {
          action: "Abrir proyecto",
          body: "GitHub Issues sigue siendo la ruta de soporte para errores, cambios en fuentes oficiales y correcciones de datos.",
          eyebrow: "Superficie secundaria",
          href: "/project",
          title: "Proyecto",
        },
        {
          action: "Abrir conexión con IA",
          body: "El puente hacia IA sigue siendo secundario y vive aquí en lugar de competir por la navegación principal.",
          eyebrow: "Superficie secundaria",
          href: "/connect-ai",
          title: "Conectar con IA",
        },
      ],
    },
    onboardingPage: {
      eyebrow: "Configuración inicial",
      title: "Captura lo académico básico una vez en este navegador.",
      description:
        "Elige tu periodo de ingreso, tus planes activos y tu idioma preferido. La ruta del horario depende de este estado local para saber qué documentos te aplican.",
      entrySeason: "Ciclo",
      entryTermHelp:
        "Elige el ciclo académico y el año. La captura manual de texto queda deshabilitada a propósito.",
      entryYear: "Año",
      seasonOptions: {
        fall: "Otoño",
        spring: "Primavera",
      },
      plannerGateBody:
        "Entraste primero a la ruta del horario, pero este navegador todavía necesita la configuración inicial mínima antes de abrir la superficie dedicada del horario.",
      plannerGateTitle: "Termina la configuración inicial para entrar al horario",
      noPlansForTermBody:
        "Ningún plan activo del catálogo publicado coincide con el periodo de ingreso seleccionado. Prueba otro año o espera la siguiente actualización pública del catálogo.",
      noPlansForTermTitle: "No hay planes para ese periodo de ingreso",
      readyBody:
        "Este navegador ya tiene la configuración inicial mínima. Puedes ajustarla aquí o saltar directo al horario.",
      readyTitle: "La configuración inicial ya existe",
      openPlanner: "Siguiente",
      backHome: "Volver al inicio",
      plansLockedBody:
        "Primero elige ciclo y año. Solo entonces te mostramos los planes que realmente aplican para ese periodo de ingreso.",
      plansLockedTitle: "Primero selecciona tu periodo de ingreso",
      selectSeason: "Selecciona un ciclo",
      selectYear: "Selecciona un año",
      validationBody:
        "Completa ambos selectores del periodo de ingreso y deja al menos un plan activo antes de pasar al horario.",
      validationTitle: "Falta completar la configuración inicial",
    },
    plannerOnboarding: {
      back: "Atrás",
      eyebrow: "Configuración inicial del horario",
      entryTermBody:
        "Elige el ciclo académico y el año que corresponden a tu ingreso al ITAM. Aquí solo aparecen años reales del catálogo publicado.",
      entryTermTitle: "¿Cuál es tu periodo de ingreso?",
      entryYearLabel: "Año de ingreso",
      finish: "Finalizar e ir al horario",
      finishBody:
        "Ya capturaste lo mínimo que necesita el horario para adaptar el catálogo público a este navegador.",
      finishHighlight: "Perfecto, configuraste tu horario.",
      finishSummary: {
        entryTerm: "Periodo de ingreso",
        locale: "Idioma",
        pending: "Pendiente",
        program: "Carrera",
        swipe: "Deslizamiento",
      },
      finishSupport:
        "En la siguiente pantalla el navegador terminará de preparar tu superficie local y te llevará directo al horario.",
      finishTitle: "Ya puedes crear tu horario",
      introBody:
        "Te vamos a pedir unos pocos datos para que este navegador sepa qué planes públicos te aplican y cómo quieres sentir la navegación desde el primer deslizamiento.",
      introCards: [
        {
          body: "Lo básico de tu contexto académico se queda solo en este navegador. No necesitas cuenta y no hay perfil en el servidor.",
          title: "Privado por defecto",
        },
        {
          body: "El horario lee datos públicos ya precalculados para adaptar documentos y rutas según tu contexto real.",
          title: "Catálogo público real",
        },
        {
          body: "La configuración inicial es corta. Después podrás entrar al horario y ajustar detalles cuando quieras.",
          title: "Configuración rápida",
        },
      ],
      introTitle: "Vamos a configurar el horario una sola vez",
      loadingBody:
        "El navegador está armando tu superficie local, cruzando el catálogo público y preparando el primer estado del horario.",
      loadingCards: [
        {
          body: "Empatando tu periodo de ingreso con los planes publicados que sí te aplican.",
          title: "Contexto académico",
        },
        {
          body: "Preparando los paneles iniciales y la navegación de este navegador.",
          title: "Superficie local",
        },
        {
          body: "Generando el primer código portátil a partir del perfil que acabas de configurar.",
          title: "Contexto portátil",
        },
      ],
      loadingEyebrow: "Configurando este navegador",
      loadingTitle: "Preparando tu horario",
      next: "Siguiente",
      openPlanner: "Continuar configuración inicial",
      programBody:
        "Busca y elige la carrera que te aplica para ese periodo de ingreso. Los títulos repetidos se colapsan a propósito.",
      programLockedBody:
        "Primero elige ciclo y año. Solo entonces el horario puede mostrarte las carreras que sí coinciden con tu ingreso.",
      programSearchEmpty:
        "Ninguna carrera coincide con esa búsqueda dentro del catálogo publicado actual.",
      programSearchLabel: "Buscar carrera",
      programSearchPlaceholder: {
        career: "Busca tu carrera",
        engineering: "Busca tu ingeniería",
        degree: "Busca tu licenciatura",
        mixed: "Busca tu licenciatura o ingeniería",
      },
      programTitles: {
        career: "Selecciona tu carrera:",
        engineering: "Selecciona tu ingeniería:",
        degree: "Selecciona tu licenciatura:",
        mixed: "Selecciona tu licenciatura / ingeniería:",
      },
      redirectBody:
        "Horario necesita terminar su configuración inicial embebida antes de renderizar la superficie de horario en este navegador.",
      redirectTitle: "Horario está preparando tu configuración inicial",
      stepLabels: {
        academicLevel: "Nivel",
        entryTerm: "Ingreso",
        finish: "Finalizar",
        intro: "Inicio",
        locale: "Idioma",
        program: "Carrera",
        subjects: "Materias",
        swipe: "Deslizamiento",
      },
      swipeOptions: {
        inverted: {
          body: "Deslizas a la derecha y la animación responde hacia el lado contrario. El destino sigue siendo determinista.",
          title: "Movimiento invertido",
        },
        natural: {
          body: "Deslizas a la derecha y la animación acompaña la misma dirección visual del gesto.",
          title: "Movimiento natural",
        },
      },
      swipePreferenceBody:
        "Horario siempre te mueve al destino adyacente, pero aquí puedes decidir si la animación debe sentirse natural o invertida en este dispositivo.",
      swipePreferenceTitle: "¿Cómo quieres que se sienta el deslizamiento?",
      title: "Responde la configuración inicial del horario paso a paso",
      validationBody: {
        academicLevel:
          "Elige el nivel académico antes de continuar.",
        entryTerm:
          "Elige tanto el ciclo académico como un año real del catálogo publicado antes de continuar.",
        finish: "Revisa el resumen y luego finaliza la configuración.",
        intro: "Continúa para capturar lo mínimo que necesita el horario.",
        program: "Elige una carrera de la lista filtrada antes de continuar.",
        subjects:
          "Elige al menos una materia antes de continuar.",
        swipe:
          "Elige cómo quieres que se sienta el deslizamiento en este dispositivo antes de continuar.",
      },
      validationTitle: "Todavía falta un paso obligatorio",
    },
    calendarPage: {
      calendarGridEventDays: "días con eventos",
      datePending: "Fecha pendiente",
      description:
        "Calendario sigue siendo útil antes de la configuración inicial y luego añade contexto de clases del día cuando el horario ya existe en este navegador.",
      eyebrow: "Calendario",
      generalCalendarBody:
        "Puedes revisar el calendario académico público desde ahora. El contexto de clases del horario aparece aquí después de completar la configuración inicial del horario.",
      generalCalendarEyebrow: "Calendario general",
      generalCalendarTitle: "Primero el calendario público",
      noAcademicPeriod: "General",
      paymentsEyebrow: "Pagos",
      paymentsTitle: "Pagos destacados",
      schoolEyebrow: "Eventos académicos",
      title: "Calendario académico",
    },
    legalPages: {
      privacy: {
        description:
          "Qué guarda la web localmente, qué nunca se guarda en el servidor y cómo se comporta el estado local del navegador.",
        eyebrow: "Privacidad",
        sections: [
          {
            body:
              "Este producto guarda solo contexto local del horario, como tu periodo de ingreso, tus planes activos, tus grupos seleccionados, tus paneles y tus preferencias de navegación. Todo eso se queda en tu dispositivo.",
            title: "Qué sí se queda en el navegador",
          },
          {
            body:
              "El servidor no guarda tu nombre, correo, matrícula, horario seleccionado ni un perfil personal persistente. No hay inicio de sesión, analítica ni telemetría personal.",
            title: "Qué nunca sale del navegador",
          },
        ],
        title: "Aviso de privacidad",
      },
      terms: {
        description: "Contexto legal del proyecto independiente, aviso de no afiliación y expectativas públicas de uso.",
        eyebrow: "Términos",
        sections: [
          {
            body:
              "ITAM Planner es un proyecto independiente de código abierto. No está afiliado, respaldado ni mantenido por el Instituto Tecnológico Autónomo de México (ITAM).",
            title: "No afiliación",
          },
          {
            body: "Los materiales académicos públicos provenientes de fuentes oficiales del ITAM se normalizan para facilitar la planeación, pero esta web no es un servicio institucional oficial y no debe tratarse como tal.",
            title: "Uso de fuentes públicas",
          },
        ],
        title: "Términos y condiciones",
      },
    },
    footer: {
      caption: "Proyecto independiente. El detalle legal y de privacidad vive en los enlaces del pie.",
      privacy: "Aviso de privacidad",
      terms: "Términos y condiciones",
    },
    connectPage: {
      description:
        "Tu código del estudiante ya refleja el estado local de tu horario en el navegador. La forma exacta del punto de acceso para IA sigue diferida por doctrina, así que esta página se concentra en el contrato actual y en lo que sigue.",
      eyebrow: "Conectar con IA",
      title: "Prepara tu horario local para usarlo con IA externa",
    },
    connectPanel: {
      currentSnapshot: "Estado actual",
      currentPlannerContext: "Contexto actual del horario",
      deferredContract: "Contrato diferido",
      entryTerm: "Periodo de ingreso",
      finishOnboarding:
        "Termina la configuración inicial y elige al menos un plan o grupo para generar tu código.",
      footer:
        "Las instrucciones finales para ChatGPT, las capturas para iPhone y el punto de acceso público de contexto para IA llegan en la siguiente etapa cuando el contrato quede congelado en doctrina.",
      notSetYet: "Todavía no definido",
      plans: "Planes seleccionados",
      offerings: "Grupos seleccionados",
      supportLead: "Usa GitHub Issues para bugs o soporte.",
      timeline: [
        {
          body: "No necesitas cuenta y tus datos del horario se quedan en tu navegador.",
          title: "1. Mantén el horario local",
        },
        {
          body: "El punto de acceso futuro para IA seguirá siendo de solo lectura, solo JSON y no persistente.",
          title: "2. Congela el contrato del punto de acceso",
        },
        {
          body: "Las guías para navegador e iPhone llegan cuando ese contrato quede aceptado.",
          title: "3. Publica las guías de conexión",
        },
      ],
      title: "Qué hará esto",
      worksWithOtherAis:
        "Esto también funciona con otras IAs. ChatGPT es solo el primer objetivo nombrado.",
      intro:
        "Esta página es el puente hacia el flujo futuro con IA externa. El contrato final del punto de acceso sigue abierto a propósito, pero el código local del estudiante ya es real.",
    },
    plannerHome: {
      activePlans: "Planes activos",
      activePlansHelp:
        "Selecciona los planes que te aplican actualmente. No necesitas cuenta y nada se guarda en el servidor.",
      activePlansShort: "planes activos",
      activePeriodFallback: "Todavía no hay periodo seleccionado",
      activePeriodTitle:
        "Elige un periodo público y guarda los grupos que quieres dentro del estado local del horario.",
      browserOnlyLabel: "Dirección actual de la publicación",
      browserOnlyText:
        "Los datos públicos se normalizan fuera del tiempo de solicitud y luego regresan a la aplicación como un artefacto estable del catálogo.",
      currentLocale: "Idioma actual",
      currentProfileFallback: "Empieza con lo básico",
      currentProfileHelp:
        "Este estado es privado del navegador actual. Después decide qué boletines y reglamentos te aplican.",
      currentProfileReady: "Perfil en progreso",
      entryTerm: "Periodo de ingreso",
      groupsSelected: "Grupos seleccionados",
      intro:
        "Empieza con la configuración inicial, elige los planes que te aplican y arma un horario a partir de los horarios públicos del ITAM. Tu perfil, tus selecciones y el puente futuro con IA se quedan en este navegador.",
      loadOfferings: "Cargando grupos...",
      loadPlans: "Cargando lista pública de planes...",
      locale: "Idioma preferido",
      noAccountRequired: "No necesitas cuenta",
      noAccountRequiredText:
        "Haz la configuración inicial, elige tu plan y tus grupos, y conserva el estado resultante en el almacenamiento local del navegador.",
      noPlannerData: "El horario todavía está vacío",
      noTermYet: "Todavía sin periodo",
      noErrorFallback: "No fue posible cargar el horario.",
      noPeriodData: "Selecciona un periodo público para empezar a capturar el estado del horario.",
      offeredBy: "Profesor pendiente",
      period: "Periodo público de horarios",
      plansMetric: "Planes publicados",
      plannerExists: "Ya existe estado del horario",
      plannerShell: "Superficie del horario",
      plannerShellHelp:
        "Selecciona los grupos que quieres conservar dentro del estado actual del horario.",
      groupLabel: "Grupo",
      selectedPeriodLoadError:
        "No fue posible cargar el periodo público seleccionado desde el catálogo publicado.",
      selectedPeriodLoading: "Cargando el periodo público seleccionado...",
      redirectingHelp:
        "La ruta del horario requiere un periodo de ingreso y al menos un plan activo en este navegador.",
      redirectingToOnboarding: "Redirigiendo a configuración inicial...",
      periodsMetric: "Periodos públicos",
      plannerTitle: "Un horario local con un catálogo público normalizado por debajo.",
      profileReset: "Reiniciar perfil",
      resetPlanner: "Reiniciar horario",
      roomPending: "Salón pendiente",
      updateOnboarding: "Ajustar configuración inicial",
      selectAtLeastOne:
        "Selecciona al menos un grupo público para empezar a construir el estado local del horario.",
      selectPeriod: "Selecciona un periodo",
      step1: "Paso 1",
      step2: "Paso 2",
      step3: "Paso 3",
      catalogFreshness: {
        description:
          "Esta publicación lleva la última instantánea promovida del catálogo JSON directamente dentro de la web. Estos datos muestran qué tan fresca está esa instantánea publicada.",
        eyebrow: "Catálogo publicado",
        latestObservedSource: "Última fuente observada",
        latestPromotion: "Última promoción",
        noData: "Todavía no hay metadatos publicados de la instantánea.",
        notAvailableYet: "Todavía no disponible",
        releaseLabel: "Versión",
        snapshots: "Instantáneas",
        statusLabels: {
          drift_detected: "Cambio detectado",
          failed: "Falló",
          no_changes: "Sin cambios",
          running: "Corriendo",
          succeeded: "Correcto",
          unknown: "Desconocido",
        },
        title: "Frescura del catálogo",
        trackedSources: "Fuentes seguidas",
      },
      title: "ITAM Planner",
      timeline: [
        {
          body: "Elige los planes que te aplican y guarda ese contexto solo en este navegador.",
          title: "Empieza con la configuración inicial",
        },
        {
          body: "Toma un periodo público, conserva los grupos que te interesan y forma tu primer estado de horario.",
          title: "Arma el horario",
        },
        {
          body: "Lleva ese estado en un código local que después alimentará el puente con IA.",
          title: "Guarda el código",
        },
      ],
      surfaceBody:
        "Horario se enfoca en la configuración inicial local, la captura del horario y los paneles elegidos para el lanzamiento.",
      surfaceEyebrow: "Superficie del horario",
      subjectsBoard: {
        activePlansLabel: "Planes activos",
        description:
          "Mantén visibles los planes que te aplican y las clases ya seleccionadas en este navegador sin salir del horario.",
        eyebrow: "Materias / planes",
        noPlans: "Todavía no hay planes activos seleccionados.",
        noSubjects: "Todavía no hay clases seleccionadas.",
        selectedSubjectsLabel: "Clases seleccionadas",
        title: "Contexto académico",
      },
      todayBoard: {
        description: "El horario prioriza hoy siempre que el panel diario esté activado.",
        empty: "Todavía no hay clases seleccionadas para hoy.",
        eyebrow: "Hoy",
        roomPending: "Salón pendiente",
        title: "Clases de hoy",
      },
      weekBoard: {
        description:
          "La tabla semanal cubre de lunes a domingo y solo el rango horario donde realmente caen tus clases seleccionadas.",
        empty:
          "Selecciona clases públicas para ver aquí la tabla semanal de tu horario.",
        eyebrow: "Horario semanal",
        roomPending: "Salón pendiente",
        title: "Tabla semanal",
      },
    },
    underConstruction: {
      body: "El horario, el puente al catálogo y el sistema visual siguen endureciéndose. Espera cambios rápidos mientras esta beta pública sigue en construcción.",
      title: "En construcción",
    },
    studentCode: {
      browserOwned: "Solo de este navegador",
      copied: "Copiado",
      copyCode: "Copiar código",
      description:
        "Este código, propiedad del navegador, se genera a partir de tu perfil actual y del estado del horario. No necesitas cuenta y ningún dato personal se guarda en el servidor. Usa GitHub Issues para soporte; este código es la base del flujo futuro con IA.",
      lengthSuffix: "caracteres",
      eyebrow: "Contexto portátil",
      openConnectToAi: "Abrir la página Conectar con IA",
      title: "Código del alumno",
      waitingForPlannerData: "Esperando datos del horario",
      waitingForStudentCode:
        "Tu código aparece aquí en cuanto exista perfil o estado del horario.",
    },
  },
} satisfies Record<LocaleCode, unknown>;

export function getUiCopy(locale: LocaleCode): { common: { calendar: string; backToPlanner: string; community: string; connectToAi: string; genericErrorBody: string; genericErrorTitle: string; goToOnboarding: string; home: string; localeLabels: { readonly "es-MX": "Spanish (MX)"; readonly en: "English"; }; open: string; planner: string; retry: string; timeColumnLabel: string; weekdayLabels: { DO: string; JU: string; LU: string; MA: string; MI: string; SA: string; VI: string; }; }; projectLinks: { githubIssuesLabel: string; githubDescription: string; instagramLabel: string; instagramDescription: string; }; projectPage: { creditsBody: string; creditsEyebrow: string; creditsLinks: { bibliography: string; inspiration: string; publicSources: string; }; creditsTitle: string; creatorNote: string; creatorSurfaces: string; eyebrow: string; issueBullets: string[]; issueLead: string; issueShortcuts: { bug: string; dataCorrection: string; featureRequest: string; sourceDrift: string; }; issueTitle: string; signUpLead: string; supportPath: string; title: string; description: string; }; homePage: { eyebrow: string; title: string; description: string; primaryAction: string; secondaryAction: string; surfaceEyebrow: string; panels: { title: string; body: string; }[]; featureCards: { action: string; body: string; eyebrow: string; href: string; title: string; }[]; }; onboardingPage: { eyebrow: string; title: string; description: string; entrySeason: string; entryTermHelp: string; entryYear: string; seasonOptions: { fall: string; spring: string; }; plannerGateBody: string; plannerGateTitle: string; noPlansForTermBody: string; noPlansForTermTitle: string; readyBody: string; readyTitle: string; openPlanner: string; backHome: string; plansLockedBody: string; plansLockedTitle: string; selectSeason: string; selectYear: string; validationBody: string; validationTitle: string; }; plannerOnboarding: { back: string; eyebrow: string; entryTermBody: string; entryTermTitle: string; entryYearLabel: string; finish: string; finishBody: string; finishHighlight: string; finishSummary: { entryTerm: string; locale: string; pending: string; program: string; swipe: string; }; finishSupport: string; finishTitle: string; introBody: string; introCards: { body: string; title: string; }[]; introTitle: string; loadingBody: string; loadingCards: { body: string; title: string; }[]; loadingEyebrow: string; loadingTitle: string; next: string; openPlanner: string; programBody: string; programLockedBody: string; programSearchEmpty: string; programSearchLabel: string; programSearchPlaceholder: { career: string; engineering: string; degree: string; mixed: string; }; programTitles: { career: string; engineering: string; degree: string; mixed: string; }; redirectBody: string; redirectTitle: string; stepLabels: { academicLevel: string; entryTerm: string; finish: string; intro: string; locale: string; program: string; subjects: string; swipe: string; }; swipeOptions: { inverted: { body: string; title: string; }; natural: { body: string; title: string; }; }; swipePreferenceBody: string; swipePreferenceTitle: string; title: string; validationBody: { academicLevel: string; entryTerm: string; finish: string; intro: string; program: string; subjects: string; swipe: string; }; validationTitle: string; }; calendarPage: { calendarGridEventDays: string; datePending: string; description: string; eyebrow: string; generalCalendarBody: string; generalCalendarEyebrow: string; generalCalendarTitle: string; noAcademicPeriod: string; paymentsEyebrow: string; paymentsTitle: string; schoolEyebrow: string; title: string; }; legalPages: { privacy: { description: string; eyebrow: string; sections: { body: string; title: string; }[]; title: string; }; terms: { description: string; eyebrow: string; sections: { body: string; title: string; }[]; title: string; }; }; footer: { caption: string; privacy: string; terms: string; }; connectPage: { description: string; eyebrow: string; title: string; }; connectPanel: { currentSnapshot: string; currentPlannerContext: string; deferredContract: string; entryTerm: string; finishOnboarding: string; footer: string; notSetYet: string; plans: string; offerings: string; supportLead: string; timeline: { body: string; title: string; }[]; title: string; worksWithOtherAis: string; intro: string; }; plannerHome: { activePlans: string; activePlansHelp: string; activePlansShort: string; activePeriodFallback: string; activePeriodTitle: string; browserOnlyLabel: string; browserOnlyText: string; currentLocale: string; currentProfileFallback: string; currentProfileHelp: string; currentProfileReady: string; entryTerm: string; groupsSelected: string; intro: string; loadOfferings: string; loadPlans: string; locale: string; noAccountRequired: string; noAccountRequiredText: string; noPlannerData: string; noTermYet: string; noErrorFallback: string; noPeriodData: string; offeredBy: string; period: string; plansMetric: string; plannerExists: string; plannerShell: string; plannerShellHelp: string; groupLabel: string; selectedPeriodLoadError: string; selectedPeriodLoading: string; redirectingHelp: string; redirectingToOnboarding: string; periodsMetric: string; plannerTitle: string; profileReset: string; resetPlanner: string; roomPending: string; updateOnboarding: string; selectAtLeastOne: string; selectPeriod: string; step1: string; step2: string; step3: string; catalogFreshness: { description: string; eyebrow: string; latestObservedSource: string; latestPromotion: string; noData: string; notAvailableYet: string; releaseLabel: string; snapshots: string; statusLabels: { drift_detected: string; failed: string; no_changes: string; running: string; succeeded: string; unknown: string; }; title: string; trackedSources: string; }; title: string; timeline: { body: string; title: string; }[]; surfaceBody: string; surfaceEyebrow: string; subjectsBoard: { activePlansLabel: string; description: string; eyebrow: string; noPlans: string; noSubjects: string; selectedSubjectsLabel: string; title: string; }; todayBoard: { description: string; empty: string; eyebrow: string; roomPending: string; title: string; }; weekBoard: { description: string; empty: string; eyebrow: string; roomPending: string; title: string; }; }; underConstruction: { body: string; title: string; }; studentCode: { browserOwned: string; copied: string; copyCode: string; description: string; lengthSuffix: string; eyebrow: string; openConnectToAi: string; title: string; waitingForPlannerData: string; waitingForStudentCode: string; }; } | { common: { calendar: string; backToPlanner: string; community: string; connectToAi: string; genericErrorBody: string; genericErrorTitle: string; goToOnboarding: string; home: string; localeLabels: { readonly "es-MX": "Español (MX)"; readonly en: "Inglés"; }; open: string; planner: string; retry: string; timeColumnLabel: string; weekdayLabels: { DO: string; JU: string; LU: string; MA: string; MI: string; SA: string; VI: string; }; }; projectLinks: { githubIssuesLabel: string; githubDescription: string; instagramLabel: string; instagramDescription: string; }; projectPage: { creditsBody: string; creditsEyebrow: string; creditsLinks: { bibliography: string; inspiration: string; publicSources: string; }; creditsTitle: string; creatorNote: string; creatorSurfaces: string; eyebrow: string; issueBullets: string[]; issueLead: string; issueShortcuts: { bug: string; dataCorrection: string; featureRequest: string; sourceDrift: string; }; issueTitle: string; signUpLead: string; supportPath: string; title: string; description: string; }; homePage: { eyebrow: string; title: string; description: string; primaryAction: string; secondaryAction: string; surfaceEyebrow: string; panels: { title: string; body: string; }[]; featureCards: { action: string; body: string; eyebrow: string; href: string; title: string; }[]; }; onboardingPage: { eyebrow: string; title: string; description: string; entrySeason: string; entryTermHelp: string; entryYear: string; seasonOptions: { fall: string; spring: string; }; plannerGateBody: string; plannerGateTitle: string; noPlansForTermBody: string; noPlansForTermTitle: string; readyBody: string; readyTitle: string; openPlanner: string; backHome: string; plansLockedBody: string; plansLockedTitle: string; selectSeason: string; selectYear: string; validationBody: string; validationTitle: string; }; plannerOnboarding: { back: string; eyebrow: string; entryTermBody: string; entryTermTitle: string; entryYearLabel: string; finish: string; finishBody: string; finishHighlight: string; finishSummary: { entryTerm: string; locale: string; pending: string; program: string; swipe: string; }; finishSupport: string; finishTitle: string; introBody: string; introCards: { body: string; title: string; }[]; introTitle: string; loadingBody: string; loadingCards: { body: string; title: string; }[]; loadingEyebrow: string; loadingTitle: string; next: string; openPlanner: string; programBody: string; programLockedBody: string; programSearchEmpty: string; programSearchLabel: string; programSearchPlaceholder: { career: string; engineering: string; degree: string; mixed: string; }; programTitles: { career: string; engineering: string; degree: string; mixed: string; }; redirectBody: string; redirectTitle: string; stepLabels: { academicLevel: string; entryTerm: string; finish: string; intro: string; locale: string; program: string; subjects: string; swipe: string; }; swipeOptions: { inverted: { body: string; title: string; }; natural: { body: string; title: string; }; }; swipePreferenceBody: string; swipePreferenceTitle: string; title: string; validationBody: { academicLevel: string; entryTerm: string; finish: string; intro: string; program: string; subjects: string; swipe: string; }; validationTitle: string; }; calendarPage: { calendarGridEventDays: string; datePending: string; description: string; eyebrow: string; generalCalendarBody: string; generalCalendarEyebrow: string; generalCalendarTitle: string; noAcademicPeriod: string; paymentsEyebrow: string; paymentsTitle: string; schoolEyebrow: string; title: string; }; legalPages: { privacy: { description: string; eyebrow: string; sections: { body: string; title: string; }[]; title: string; }; terms: { description: string; eyebrow: string; sections: { body: string; title: string; }[]; title: string; }; }; footer: { caption: string; privacy: string; terms: string; }; connectPage: { description: string; eyebrow: string; title: string; }; connectPanel: { currentSnapshot: string; currentPlannerContext: string; deferredContract: string; entryTerm: string; finishOnboarding: string; footer: string; notSetYet: string; plans: string; offerings: string; supportLead: string; timeline: { body: string; title: string; }[]; title: string; worksWithOtherAis: string; intro: string; }; plannerHome: { activePlans: string; activePlansHelp: string; activePlansShort: string; activePeriodFallback: string; activePeriodTitle: string; browserOnlyLabel: string; browserOnlyText: string; currentLocale: string; currentProfileFallback: string; currentProfileHelp: string; currentProfileReady: string; entryTerm: string; groupsSelected: string; intro: string; loadOfferings: string; loadPlans: string; locale: string; noAccountRequired: string; noAccountRequiredText: string; noPlannerData: string; noTermYet: string; noErrorFallback: string; noPeriodData: string; offeredBy: string; period: string; plansMetric: string; plannerExists: string; plannerShell: string; plannerShellHelp: string; groupLabel: string; selectedPeriodLoadError: string; selectedPeriodLoading: string; redirectingHelp: string; redirectingToOnboarding: string; periodsMetric: string; plannerTitle: string; profileReset: string; resetPlanner: string; roomPending: string; updateOnboarding: string; selectAtLeastOne: string; selectPeriod: string; step1: string; step2: string; step3: string; catalogFreshness: { description: string; eyebrow: string; latestObservedSource: string; latestPromotion: string; noData: string; notAvailableYet: string; releaseLabel: string; snapshots: string; statusLabels: { drift_detected: string; failed: string; no_changes: string; running: string; succeeded: string; unknown: string; }; title: string; trackedSources: string; }; title: string; timeline: { body: string; title: string; }[]; surfaceBody: string; surfaceEyebrow: string; subjectsBoard: { activePlansLabel: string; description: string; eyebrow: string; noPlans: string; noSubjects: string; selectedSubjectsLabel: string; title: string; }; todayBoard: { description: string; empty: string; eyebrow: string; roomPending: string; title: string; }; weekBoard: { description: string; empty: string; eyebrow: string; roomPending: string; title: string; }; }; underConstruction: { body: string; title: string; }; studentCode: { browserOwned: string; copied: string; copyCode: string; description: string; lengthSuffix: string; eyebrow: string; openConnectToAi: string; title: string; waitingForPlannerData: string; waitingForStudentCode: string; }; } {
  return uiCopy[locale];
}
