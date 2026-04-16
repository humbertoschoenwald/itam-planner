import type { LocaleCode } from "@/lib/types";

const uiCopy = {
  en: {
    common: {
      backToPlanner: "Back to planner",
      community: "Community",
      connectToChatGpt: "Connect to ChatGPT",
      genericErrorBody:
        "This view could not be loaded. Retry or return to onboarding.",
      genericErrorTitle: "This view could not be loaded.",
      goToOnboarding: "Go to onboarding",
      localeLabels: {
        "es-MX": "Spanish (MX)",
        en: "English",
      },
      open: "Open",
      planner: "Planner",
      retry: "Retry",
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
    communityLinks: {
      githubDescription:
        "Report bugs, source drift, data corrections, and feature ideas through the canonical support path.",
      instagramDescription:
        "Follow the creator's work, quality experiments, and project updates. Not a support channel.",
    },
    communityPage: {
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
      eyebrow: "Community",
      issueBullets: [
        "Bug report for broken app or pipeline behavior.",
        "Data correction for incorrect normalized academic data.",
        "Source drift when an upstream ITAM page or PDF changed shape.",
        "Feature request for new planner or UX ideas.",
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
      title: "Feedback, issues, and project contact",
      description:
        "Use GitHub issues for bugs, data corrections, source drift, and feature requests. Creator social links live here too, but support stays on GitHub.",
    },
    homePage: {
      eyebrow: "Home",
      title: "A light home for the planner, not the planner itself.",
      description:
        "Start with onboarding, keep your student context in this browser, and open the planner only when you are ready to shape a timetable from the published catalog.",
      independentProject: "Independent project",
      primaryAction: "Start onboarding",
      routeCards: [
        {
          body: "Set your entry term, active plans, and preferred locale. None of that leaves this browser.",
          eyebrow: "Suggested route",
          title: "1. /onboarding",
        },
        {
          body: "The planner no longer shares the home payload. If onboarding is still incomplete, this route returns you to /onboarding.",
          eyebrow: "Next step",
          title: "2. /planner",
        },
      ],
      secondaryAction: "Open planner",
      tertiaryAction: "Community",
      panels: [
        {
          title: "No account wall",
          body: "The flow starts in the browser. No sign-in, no server-side student profile, and no cloud-backed schedule identity.",
        },
        {
          title: "Precomputed catalog",
          body: "Course relationships, periods, and supporting academic data are shipped from promoted JSON artifacts instead of being recalculated at request time.",
        },
        {
          title: "Designed for WebKit",
          body: "The public home stays deliberately light while the dedicated planner shell lives under its own route.",
        },
      ],
    },
    onboardingPage: {
      eyebrow: "Onboarding",
      title: "Capture the academic basics once in this browser.",
      description:
        "Choose your entry term, active plans, and preferred locale. The planner route depends on this local state to know which documents apply to you.",
      entrySeason: "Season",
      entryTermHelp: "Pick the academic season and year. Free-text entry is intentionally disabled.",
      entryYear: "Year",
      seasonOptions: {
        fall: "Fall",
        spring: "Spring",
      },
      plannerGateBody:
        "The planner route opened first, but this browser still needs the minimum onboarding state before the dedicated planner shell can load.",
      plannerGateTitle: "Finish onboarding to enter the planner",
      noPlansForTermBody:
        "No active bulletin plans matched the selected entry term in the published catalog. Try another year or wait for the next public catalog refresh.",
      noPlansForTermTitle: "No plans matched this entry term",
      readyBody:
        "This browser already has the minimum onboarding state. You can refine it here or jump straight into the planner.",
      readyTitle: "Onboarding already exists",
      openPlanner: "Continue",
      backHome: "Back to home",
      plansLockedBody:
        "Select the academic cycle and year first. Only then can the planner show the plans that actually apply to that entry term.",
      plansLockedTitle: "Select the entry term first",
      selectSeason: "Select a season",
      selectYear: "Select a year",
      validationBody:
        "Choose both entry-term selectors and keep at least one active plan before moving to the planner.",
      validationTitle: "Complete the required onboarding fields",
    },
    connectPage: {
      description:
        "The student code already reflects your browser-local planner state. The exact AI context endpoint shape is still deferred by doctrine, so this page stays focused on the current contract and what comes next.",
      eyebrow: "Connect to ChatGPT",
      title: "Prepare your browser-local planner for external AI use",
    },
    connectPanel: {
      currentSnapshot: "Current snapshot",
      currentPlannerContext: "Current planner context",
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
          body: "No account is required and your planner data stays browser-owned.",
          title: "1. Keep the planner local",
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
        "Choose one public period, then keep the groups you want in the browser-local planner state.",
      browserOnlyLabel: "Current build direction",
      browserOnlyText:
        "Public data is normalized outside request time, then shipped back to the app as a stable catalog artifact.",
      communitySupport:
        "Bugs, data corrections, and source drift belong in GitHub issues. The Instagram link is only for following the creator and the project journey.",
      communitySupportTitle: "Support lives on GitHub",
      currentLocale: "Current locale",
      currentProfileFallback: "Start with the academic basics",
      currentProfileHelp:
        "This state is private to the current browser. It decides which bulletins and regulations apply to you later.",
      currentProfileReady: "Profile in progress",
      entryTerm: "Entry term",
      groupsSelected: "Selected groups",
      independentProject: "Independent project",
      intro:
        "Start with onboarding, choose the plans that apply to you, and shape a timetable from published ITAM schedule data. Your profile, selections, and future AI bridge stay in this browser only.",
      legal:
        "Independent open-source project, built by the community. Not affiliated with, endorsed by, or maintained by Instituto Tecnológico Autónomo de México (ITAM).",
      loadOfferings: "Loading offerings...",
      loadPlans: "Loading public plan list...",
      locale: "Preferred locale",
      noAccountRequired: "No account required",
      noAccountRequiredText:
        "Start with onboarding, choose your plan and sections, and keep the resulting planner state in localStorage.",
      noPlannerData: "Planner state is empty",
      noTermYet: "No term yet",
      noErrorFallback: "Unable to load planner data.",
      noPeriodData: "Select a public period to start capturing planner state.",
      offeredBy: "Instructor pending",
      openGitHubIssues: "Open GitHub Issues",
      period: "Public schedule period",
      plansMetric: "Published plans",
      plannerExists: "Planner state exists",
      plannerShell: "Planner shell",
      plannerShellHelp:
        "Select the groups you want to keep in your current planner state.",
      groupLabel: "Group",
      selectedPeriodLoadError:
        "The selected public period could not be loaded from the published catalog.",
      selectedPeriodLoading: "Loading the selected public period...",
      redirectingHelp:
        "The planner route requires an entry term and at least one active plan in this browser.",
      redirectingToOnboarding: "Redirecting to onboarding...",
      periodsMetric: "Public periods",
      plannerTitle: "A browser-local planner with a normalized public catalog underneath.",
      profileReset: "Reset profile",
      resetPlanner: "Reset planner",
      roomPending: "Room pending",
      updateOnboarding: "Update onboarding",
      selectAtLeastOne:
        "Select at least one public offering to start building the browser-local planner state.",
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
          body: "Pick a public period, keep the groups you want, and shape the first planner state.",
          title: "Shape the timetable",
        },
        {
          body: "Carry that state as a browser-owned code that later powers the external AI bridge.",
          title: "Carry the code",
        },
      ],
      weekBoard: {
        description:
          "Every selected public group is mapped into a simple weekly board so you can see the browser-local planner state at a glance.",
        empty:
          "Select public groups to see the first weekly version of your local planner here.",
        eyebrow: "Selected week",
        roomPending: "Room pending",
        title: "Weekly board",
      },
    },
    siteHeader: {
      badge: "Browser-local beta",
    },
    underConstruction: {
      body: "The planner, the catalog bridge, and the visual system are still being hardened. Expect fast changes while the public beta is under active construction.",
      title: "Under Construction",
    },
    installGuide: {
      eyebrow: "Installable web app",
      title: "Save the planner to your home screen",
      description:
        "The canonical secure URL is https://itam.humbertoschoenwald.com/. Once you open the site there, the planner can behave like a lightweight installed web app.",
      iosTitle: "On iPhone and iPad",
      iosSteps: [
        "Open the site in Safari.",
        "Tap Share.",
        "Choose Add to Home Screen.",
        "Launch it from the new icon to keep a cleaner, app-like planner experience.",
      ],
      browserTitle: "In desktop and other browsers",
      browserBody:
        "Use the secure canonical URL and install it from the browser menu when the browser offers that option. If there is no install entry yet, keep it as a bookmark until the broader app-install slice lands.",
      cacheTitle: "Precomputed catalog cache",
      cacheBody:
        "Course relationships, schedules, and supporting catalog data are served from precomputed JSON artifacts with HTTP caching. They are not recalculated on every visit.",
      openCanonicalSite: "Open the secure canonical URL",
    },
    studentCode: {
      browserOwned: "Browser-owned",
      copied: "Copied",
      copyCode: "Copy code",
      description:
        "This browser-owned code is generated from your current onboarding profile and planner state. No account is required and no personal data is stored in the backend. Use GitHub issues for support; this code is the foundation for the later AI connection flow.",
      lengthSuffix: "characters",
      eyebrow: "Portable context",
      openChatGpt: "Open the ChatGPT connection page",
      title: "Student code",
      waitingForPlannerData: "Waiting for planner data",
      waitingForStudentCode:
        "Your student code appears here once profile and planner state exist.",
    },
  },
  "es-MX": {
    common: {
      backToPlanner: "Volver al planner",
      community: "Comunidad",
      connectToChatGpt: "Conectar con ChatGPT",
      genericErrorBody:
        "No se pudo cargar esta vista. Intenta de nuevo o vuelve al onboarding.",
      genericErrorTitle: "No se pudo cargar esta vista.",
      goToOnboarding: "Ir a onboarding",
      localeLabels: {
        "es-MX": "Español (MX)",
        en: "English",
      },
      open: "Abrir",
      planner: "Planner",
      retry: "Reintentar",
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
    communityLinks: {
      githubDescription:
        "Reporta bugs, source drift, correcciones de datos e ideas de producto por la vía oficial del proyecto.",
      instagramDescription:
        "Sigue el trabajo del creador, sus experimentos de calidad y las actualizaciones del proyecto. No es un canal de soporte.",
    },
    communityPage: {
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
      eyebrow: "Comunidad",
      issueBullets: [
        "Bug report para comportamiento roto de la app o del pipeline.",
        "Data correction para datos académicos normalizados incorrectos.",
        "Source drift cuando cambió la forma de una página o PDF upstream del ITAM.",
        "Feature request para nuevas ideas de planner o UX.",
      ],
      issueLead: "Elige el template que mejor describa tu reporte:",
      issueShortcuts: {
        bug: "Bug report",
        dataCorrection: "Data correction",
        featureRequest: "Feature request",
        sourceDrift: "Source drift",
      },
      issueTitle: "Abrir un issue",
      signUpLead: "Si todavía no tienes cuenta de GitHub, créala en",
      supportPath: "Ruta oficial de soporte",
      title: "Feedback, issues y contacto del proyecto",
      description:
        "Usa GitHub Issues para bugs, correcciones de datos, source drift y feature requests. Las redes del creador también viven aquí, pero el soporte se queda en GitHub.",
    },
    homePage: {
      eyebrow: "Inicio",
      title: "Un home ligero para el planner, no el planner mismo.",
      description:
        "Empieza con onboarding, conserva tu contexto académico en este navegador y abre el planner solo cuando ya estés listo para armar un horario con el catálogo publicado.",
      independentProject: "Proyecto independiente",
      primaryAction: "Empezar onboarding",
      routeCards: [
        {
          body: "Define tu periodo de ingreso, tus planes activos y el idioma preferido. Nada de eso sale de este navegador.",
          eyebrow: "Ruta sugerida",
          title: "1. /onboarding",
        },
        {
          body: "El planner ya no comparte la misma carga del home. Si todavía no hiciste onboarding, esa ruta te regresa a /onboarding.",
          eyebrow: "Siguiente paso",
          title: "2. /planner",
        },
      ],
      secondaryAction: "Abrir planner",
      tertiaryAction: "Comunidad",
      panels: [
        {
          title: "Sin muro de cuentas",
          body: "El flujo empieza en tu navegador. Sin sign-in, sin perfil del alumno en el servidor y sin identidad de horario guardada en la nube.",
        },
        {
          title: "Catálogo precalculado",
          body: "Las relaciones entre materias, los periodos y los datos académicos de soporte se sirven desde artefactos JSON promovidos, no se recalculan por request.",
        },
        {
          title: "Pensado para WebKit",
          body: "El home público se mantiene deliberadamente ligero mientras el shell real del planner vive en su propia ruta.",
        },
      ],
    },
    onboardingPage: {
      eyebrow: "Onboarding",
      title: "Captura lo académico básico una vez en este navegador.",
      description:
        "Elige tu periodo de ingreso, tus planes activos y tu idioma preferido. La ruta del planner depende de este estado local para saber qué documentos te aplican.",
      entrySeason: "Ciclo",
      entryTermHelp:
        "Elige el ciclo académico y el año. La captura manual de texto queda deshabilitada a propósito.",
      entryYear: "Año",
      seasonOptions: {
        fall: "Otoño",
        spring: "Primavera",
      },
      plannerGateBody:
        "Entraste primero a la ruta del planner, pero este navegador todavía necesita el onboarding mínimo antes de abrir el shell dedicado del planner.",
      plannerGateTitle: "Termina el onboarding para entrar al planner",
      noPlansForTermBody:
        "Ningún plan activo del catálogo publicado coincide con el periodo de ingreso seleccionado. Prueba otro año o espera la siguiente actualización pública del catálogo.",
      noPlansForTermTitle: "No hay planes para ese periodo de ingreso",
      readyBody:
        "Este navegador ya tiene el onboarding mínimo. Puedes ajustarlo aquí o saltar directo al planner.",
      readyTitle: "Ya existe onboarding",
      openPlanner: "Siguiente",
      backHome: "Volver al inicio",
      plansLockedBody:
        "Primero elige ciclo y año. Solo entonces te mostramos los planes que realmente aplican para ese periodo de ingreso.",
      plansLockedTitle: "Primero selecciona tu periodo de ingreso",
      selectSeason: "Selecciona un ciclo",
      selectYear: "Selecciona un año",
      validationBody:
        "Completa ambos selectores del periodo de ingreso y deja al menos un plan activo antes de pasar al planner.",
      validationTitle: "Falta completar onboarding",
    },
    connectPage: {
      description:
        "Tu student code ya refleja el estado local de tu planner en el navegador. La forma exacta del endpoint para IA sigue diferida por doctrina, así que esta página se concentra en el contrato actual y en lo que sigue.",
      eyebrow: "Conectar con ChatGPT",
      title: "Prepara tu planner local para usarlo con IA externa",
    },
    connectPanel: {
      currentSnapshot: "Estado actual",
      currentPlannerContext: "Contexto actual del planner",
      deferredContract: "Contrato diferido",
      entryTerm: "Periodo de ingreso",
      finishOnboarding:
        "Termina el onboarding y elige al menos un plan o grupo para generar tu código.",
      footer:
        "Las instrucciones finales para ChatGPT, las capturas para iPhone y el endpoint público de contexto para IA llegan en el siguiente slice cuando el contrato quede congelado en doctrina.",
      notSetYet: "Todavía no definido",
      plans: "Planes seleccionados",
      offerings: "Grupos seleccionados",
      supportLead: "Usa GitHub Issues para bugs o soporte.",
      timeline: [
        {
          body: "No necesitas cuenta y tus datos del planner se quedan en tu navegador.",
          title: "1. Mantén el planner local",
        },
        {
          body: "El endpoint futuro para IA seguirá siendo read-only, JSON-only y no persistente.",
          title: "2. Congela el contrato del endpoint",
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
        "Esta página es el puente hacia el flujo futuro con IA externa. El contrato final del endpoint sigue abierto a propósito, pero el student code local ya es real.",
    },
    plannerHome: {
      activePlans: "Planes activos",
      activePlansHelp:
        "Selecciona los planes que te aplican actualmente. No necesitas cuenta y nada se guarda en el backend.",
      activePlansShort: "planes activos",
      activePeriodFallback: "Todavía no hay periodo seleccionado",
      activePeriodTitle:
        "Elige un periodo público y guarda los grupos que quieres dentro del estado local del planner.",
      browserOnlyLabel: "Dirección actual del build",
      browserOnlyText:
        "Los datos públicos se normalizan fuera del request-time y luego regresan a la app como un artefacto estable del catálogo.",
      communitySupport:
        "Los bugs, las correcciones de datos y el source drift van en GitHub Issues. El enlace de Instagram existe solo para seguir al creador y el proceso del proyecto.",
      communitySupportTitle: "El soporte vive en GitHub",
      currentLocale: "Idioma actual",
      currentProfileFallback: "Empieza con lo básico",
      currentProfileHelp:
        "Este estado es privado del navegador actual. Después decide qué boletines y reglamentos te aplican.",
      currentProfileReady: "Perfil en progreso",
      entryTerm: "Periodo de ingreso",
      groupsSelected: "Grupos seleccionados",
      independentProject: "Proyecto independiente",
      intro:
        "Empieza con onboarding, elige los planes que te aplican y arma un horario a partir de los horarios públicos del ITAM. Tu perfil, tus selecciones y el puente futuro con IA se quedan en este navegador.",
      legal:
        "Proyecto open-source independiente, construido por la comunidad. No afiliado, respaldado ni mantenido por el Instituto Tecnológico Autónomo de México (ITAM).",
      loadOfferings: "Cargando grupos...",
      loadPlans: "Cargando lista pública de planes...",
      locale: "Idioma preferido",
      noAccountRequired: "No necesitas cuenta",
      noAccountRequiredText:
        "Haz onboarding, elige tu plan y tus grupos, y conserva el estado resultante en localStorage.",
      noPlannerData: "El planner todavía está vacío",
      noTermYet: "Todavía sin periodo",
      noErrorFallback: "No fue posible cargar el planner.",
      noPeriodData: "Selecciona un periodo público para empezar a capturar el estado del planner.",
      offeredBy: "Profesor pendiente",
      openGitHubIssues: "Abrir GitHub Issues",
      period: "Periodo público de horarios",
      plansMetric: "Planes publicados",
      plannerExists: "Ya existe estado del planner",
      plannerShell: "Shell del planner",
      plannerShellHelp:
        "Selecciona los grupos que quieres conservar dentro del estado actual del planner.",
      groupLabel: "Grupo",
      selectedPeriodLoadError:
        "No fue posible cargar el periodo público seleccionado desde el catálogo publicado.",
      selectedPeriodLoading: "Cargando el periodo público seleccionado...",
      redirectingHelp:
        "La ruta del planner requiere un periodo de ingreso y al menos un plan activo en este navegador.",
      redirectingToOnboarding: "Redirigiendo a onboarding...",
      periodsMetric: "Periodos públicos",
      plannerTitle: "Un planner local con un catálogo público normalizado por debajo.",
      profileReset: "Reiniciar perfil",
      resetPlanner: "Reiniciar planner",
      roomPending: "Salón pendiente",
      updateOnboarding: "Ajustar onboarding",
      selectAtLeastOne:
        "Selecciona al menos un grupo público para empezar a construir el estado local del planner.",
      selectPeriod: "Selecciona un periodo",
      step1: "Paso 1",
      step2: "Paso 2",
      step3: "Paso 3",
      catalogFreshness: {
        description:
          "Este build lleva el último snapshot promovido del catálogo JSON directamente dentro de la web. Estos datos muestran qué tan fresco está ese snapshot publicado.",
        eyebrow: "Catálogo publicado",
        latestObservedSource: "Última fuente observada",
        latestPromotion: "Última promoción",
        noData: "Todavía no hay metadata publicada del snapshot.",
        notAvailableYet: "Todavía no disponible",
        releaseLabel: "Release",
        snapshots: "Snapshots",
        statusLabels: {
          drift_detected: "Drift detectado",
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
          title: "Empieza con onboarding",
        },
        {
          body: "Toma un periodo público, conserva los grupos que te interesan y forma tu primer estado de planner.",
          title: "Arma el horario",
        },
        {
          body: "Lleva ese estado en un código local que después alimentará el puente con IA.",
          title: "Guarda el código",
        },
      ],
      weekBoard: {
        description:
          "Cada grupo público que seleccionas se proyecta en un tablero semanal simple para que veas el estado local de tu planner de un vistazo.",
        empty:
          "Selecciona grupos públicos para ver aquí la primera versión semanal de tu planner local.",
        eyebrow: "Semana seleccionada",
        roomPending: "Salón pendiente",
        title: "Tablero semanal",
      },
    },
    siteHeader: {
      badge: "Beta local en navegador",
    },
    underConstruction: {
      body: "El planner, el puente al catálogo y el sistema visual siguen endureciéndose. Espera cambios rápidos mientras esta beta pública sigue en construcción.",
      title: "Under Construction",
    },
    installGuide: {
      eyebrow: "Web app instalable",
      title: "Guarda el planner en tu pantalla de inicio",
      description:
        "La URL canónica y segura es https://itam.humbertoschoenwald.com/. Cuando abras la web ahí, el planner podrá comportarse como una app web ligera instalada.",
      iosTitle: "En iPhone y iPad",
      iosSteps: [
        "Abre la web en Safari.",
        "Toca Compartir.",
        "Elige Agregar a pantalla de inicio.",
        "Ábrela desde el nuevo ícono para tener una experiencia más limpia y tipo app.",
      ],
      browserTitle: "En desktop y otros navegadores",
      browserBody:
        "Usa la URL segura canónica e instálala desde el menú del navegador cuando esa opción aparezca. Si todavía no ves la opción, guárdala como bookmark mientras aterriza el slice más amplio de instalación.",
      cacheTitle: "Cache precalculado del catálogo",
      cacheBody:
        "Las relaciones entre materias, horarios y datos de soporte se sirven desde archivos JSON precalculados y cacheados por HTTP. No se recalculan en cada visita.",
      openCanonicalSite: "Abrir la URL canónica segura",
    },
    studentCode: {
      browserOwned: "Solo de este navegador",
      copied: "Copiado",
      copyCode: "Copiar código",
      description:
        "Este código, propiedad del navegador, se genera a partir de tu perfil actual y del estado del planner. No necesitas cuenta y ningún dato personal se guarda en el backend. Usa GitHub Issues para soporte; este código es la base del flujo futuro con IA.",
      lengthSuffix: "caracteres",
      eyebrow: "Contexto portable",
      openChatGpt: "Abrir la página de ChatGPT",
      title: "Código del alumno",
      waitingForPlannerData: "Esperando datos del planner",
      waitingForStudentCode:
        "Tu código aparece aquí en cuanto exista perfil o estado del planner.",
    },
  },
} satisfies Record<LocaleCode, unknown>;

export function getUiCopy(locale: LocaleCode) {
  return uiCopy[locale] ?? uiCopy["es-MX"];
}
