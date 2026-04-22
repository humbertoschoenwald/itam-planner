import { getProductCopy } from "@/lib/product-copy";
import type { LocaleCode } from "@/lib/types";
import { OFFICIAL_EXECUTIVE_EDUCATION_URL } from "@/lib/site-content";
import { getUiCopy } from "@/lib/copy";
import type {
  AcademicCareerReference,
  BulletinSummary,
  DoubleDegreeReference,
  GraduateProgramReference,
  JointProgramReference,
  LocalSearchIndexItem,
  PaymentCalendarDocument,
  SchedulePeriodSummary,
  SchoolCalendarDocument,
  SiteNewsItem,
} from "@/lib/types";

export type SearchIndexBootstrap = {
  careers: AcademicCareerReference[];
  doubleDegrees: DoubleDegreeReference[];
  graduatePrograms: GraduateProgramReference[];
  jointPrograms: JointProgramReference[];
  newsItems: SiteNewsItem[];
  paymentCalendar: PaymentCalendarDocument | null;
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  schoolCalendar: SchoolCalendarDocument | null;
}

export function buildLocalSearchIndex(
  bootstrap: SearchIndexBootstrap,
  locale: LocaleCode,
): LocalSearchIndexItem[] {
  const uiCopy = getUiCopy(locale);
  const productCopy = getProductCopy(locale);
  const searchCopy = getSearchIndexCopy(locale);

  return [
    ...buildStaticPages(locale, uiCopy, productCopy, searchCopy),
    ...bootstrap.careers.map((career) => ({
      body: `${searchCopy.careerBodyPrefix} ${career.display_name}.`.trim(),
      category: searchCopy.categories.career,
      href: "/planner/onboarding",
      keywords: [career.career_id, career.display_name],
      title: career.display_name,
    })),
    ...bootstrap.jointPrograms.map((program) => ({
      body: `${searchCopy.jointProgramBodyPrefix} ${program.display_name}. ${program.coordinators.join(" ")} ${program.contact_emails.join(" ")} ${program.phone_extensions.join(" ")}`.trim(),
      category: searchCopy.categories.jointProgram,
      href: "/planner/onboarding",
      keywords: [
        program.joint_program_id,
        ...program.component_career_ids,
        ...program.contact_emails,
        ...program.phone_extensions,
      ],
      title: program.display_name,
    })),
    ...bootstrap.graduatePrograms.map((program) => ({
      body: [
        searchCopy.graduateProgramBodyPrefix,
        program.display_name,
        program.program_kind,
        program.status,
        program.contact_emails.join(" "),
        program.calendar_url ?? "",
        program.admission_process_url ?? "",
        program.study_plan_url ?? "",
      ]
        .join(" ")
        .trim(),
      category: searchCopy.categories.graduateProgram,
      href:
        program.microsite_url ??
        program.brochure_url ??
        program.calendar_url ??
        program.source_url,
      keywords: [
        program.graduate_program_id,
        program.program_kind,
        program.status,
        ...program.contact_emails,
      ],
      title: program.display_name,
    })),
    ...bootstrap.doubleDegrees.map((program) => ({
      body: [
        searchCopy.doubleDegreeBodyPrefix,
        program.base_program_label,
        program.partner_institution ?? "",
        program.eligibility_label ?? "",
        program.degree_labels.join(" "),
        program.language_requirement ?? "",
        program.location ?? "",
        program.notes.join(" "),
      ]
        .join(" ")
        .trim(),
      category: searchCopy.categories.doubleDegree,
      href: program.brochure_urls[0] ?? program.source_url,
      keywords: [
        program.double_degree_id,
        program.base_program_label,
        program.partner_institution ?? "",
        ...program.contact_emails,
        ...program.degree_labels,
      ],
      title: program.display_name,
    })),
    ...bootstrap.plans.map((plan) => ({
      body: `${plan.program_title} ${plan.source_code} ${plan.plan_code}`.trim(),
      category: searchCopy.categories.plan,
      href: "/planner/onboarding",
      keywords: [plan.plan_id, plan.source_code, plan.program_title],
      title: `${plan.program_title} · Plan ${plan.plan_code}`,
    })),
    ...bootstrap.periods.map((period) => ({
      body: `${period.label} ${period.level} ${period.term ?? ""}`.trim(),
      category: searchCopy.categories.schedulePeriod,
      href: "/planner",
      keywords: [period.period_id, period.label],
      title: period.label,
    })),
    ...(bootstrap.schoolCalendar
      ? bootstrap.schoolCalendar.events.map((event) => ({
          body: `${event.label} ${event.notes ?? ""}`.trim(),
          category: searchCopy.categories.calendarEvent,
          href: "/calendar",
          keywords: [event.symbol, event.event_date],
          title: event.label,
        }))
      : []),
    ...(bootstrap.paymentCalendar
      ? bootstrap.paymentCalendar.payment_events.map((event) => ({
          body: `${event.label} ${event.notes ?? ""}`.trim(),
          category: searchCopy.categories.paymentEvent,
          href: "/calendar",
          keywords: [event.code, event.academic_period ?? ""],
          title: event.label,
        }))
      : []),
    ...bootstrap.newsItems.map((item) => ({
      body: `${item.summary} ${item.source_label}`.trim(),
      category: searchCopy.categories.officialUpdate,
      href: item.href,
      keywords: [item.category, item.source_label],
      title: item.title,
    })),
  ];
}

export function searchLocalIndex(index: LocalSearchIndexItem[], query: string): LocalSearchIndexItem[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return index;
  }

  return index.filter((item) =>
    normalizeSearchText([item.title, item.body, item.keywords.join(" ")].join(" ")).includes(
      normalizedQuery,
    ),
  );
}

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function buildStaticPages(
  locale: LocaleCode,
  uiCopy: ReturnType<typeof getUiCopy>,
  productCopy: ReturnType<typeof getProductCopy>,
  searchCopy: ReturnType<typeof getSearchIndexCopy>,
): LocalSearchIndexItem[] {
  return [
    {
      body: searchCopy.staticPages.homeBody,
      category: searchCopy.categories.page,
      href: "/",
      keywords: ["home", "inicio", "proyecto", "planner"],
      title: uiCopy.common.home,
    },
    {
      body: searchCopy.staticPages.scheduleBody,
      category: searchCopy.categories.page,
      href: "/planner",
      keywords: ["planner", "horario", "schedule", "materias"],
      title: uiCopy.common.planner,
    },
    {
      body: searchCopy.staticPages.onboardingBody,
      category: searchCopy.categories.page,
      href: "/planner/onboarding",
      keywords: ["onboarding", "ingreso", "carrera", "wizard"],
      title: uiCopy.plannerOnboarding.eyebrow,
    },
    {
      body: searchCopy.staticPages.calendarBody,
      category: searchCopy.categories.page,
      href: "/calendar",
      keywords: ["calendar", "calendario", "pagos"],
      title: uiCopy.common.calendar,
    },
    {
      body: searchCopy.staticPages.projectBody,
      category: searchCopy.categories.page,
      href: "/project",
      keywords: ["project", "proyecto", "support", "github"],
      title: productCopy.common.project,
    },
    {
      body: searchCopy.staticPages.connectAiBody,
      category: searchCopy.categories.page,
      href: "/connect-ai",
      keywords: ["ai", "chatgpt", "student code", "ia"],
      title: productCopy.common.connectToAi,
    },
    {
      body: searchCopy.staticPages.searchBody,
      category: searchCopy.categories.page,
      href: "/search",
      keywords: ["search", "buscar", "local"],
      title: productCopy.common.search,
    },
    {
      body: searchCopy.staticPages.settingsBody,
      category: searchCopy.categories.page,
      href: "/settings",
      keywords: ["settings", "configuration", "materias", "deslizamiento"],
      title: productCopy.common.configuration,
    },
    {
      body: searchCopy.staticPages.registrationBody,
      category: searchCopy.categories.page,
      href: "/registration",
      keywords: ["inscripciones", "registration", "servicios"],
      title: productCopy.common.registration,
    },
    {
      body: searchCopy.staticPages.mapBody,
      category: searchCopy.categories.page,
      href: "/map",
      keywords: ["mapa", "map", "campus", "salones"],
      title: productCopy.common.map,
    },
    {
      body: searchCopy.staticPages.executiveEducationBody,
      category: searchCopy.categories.officialSource,
      href: OFFICIAL_EXECUTIVE_EDUCATION_URL,
      keywords: ["educacion ejecutiva", "extension universitaria", "executive education"],
      title: productCopy.common.executiveEducation,
    },
    {
      body: searchCopy.staticPages.termsBody,
      category: searchCopy.categories.page,
      href: "/terms",
      keywords: ["terms", "terminos", "legal"],
      title: uiCopy.footer.terms,
    },
    {
      body: searchCopy.staticPages.privacyBody,
      category: searchCopy.categories.page,
      href: "/privacy",
      keywords: ["privacy", "privacidad", "local storage"],
      title: uiCopy.footer.privacy,
    },
  ];
}

function getSearchIndexCopy(locale: LocaleCode): { careerBodyPrefix: string; doubleDegreeBodyPrefix: string; graduateProgramBodyPrefix: string; jointProgramBodyPrefix: string; categories: { calendarEvent: string; career: string; doubleDegree: string; graduateProgram: string; jointProgram: string; officialSource: string; officialUpdate: string; page: string; paymentEvent: string; plan: string; schedulePeriod: string; }; staticPages: { calendarBody: string; connectAiBody: string; executiveEducationBody: string; homeBody: string; mapBody: string; onboardingBody: string; privacyBody: string; projectBody: string; registrationBody: string; scheduleBody: string; searchBody: string; settingsBody: string; termsBody: string; }; } {
  return locale === "en"
    ? {
        careerBodyPrefix: "Official ITAM career source.",
        doubleDegreeBodyPrefix: "Official ITAM double degree reference.",
        graduateProgramBodyPrefix: "Official ITAM graduate program reference.",
        jointProgramBodyPrefix: "Official ITAM joint program reference.",
        categories: {
          calendarEvent: "Calendar event",
          career: "Career",
          doubleDegree: "Double degree",
          graduateProgram: "Graduate program",
          jointProgram: "Joint program",
          officialSource: "Official source",
          officialUpdate: "Official update",
          page: "Page",
          paymentEvent: "Payment event",
          plan: "Plan",
          schedulePeriod: "Schedule period",
        },
        staticPages: {
          calendarBody: "Academic calendar and payment milestones.",
          connectAiBody: "Read-only AI bridge and future student-code flow.",
          executiveEducationBody:
            "Official executive education and continuing-education surface hosted by ITAM.",
          homeBody: "Project intro and cards linked to fresh official sources.",
          mapBody: "Map placeholder for future campus and classroom guidance.",
          onboardingBody: "Embedded wizard for configuring the schedule.",
          privacyBody: "Browser-local privacy notice and data-storage rules.",
          projectBody: "Project links, support path, credits, and repository surfaces.",
          registrationBody:
            "Traceable registration guidance linked to the official ITAM services flow.",
          scheduleBody: "Browser-local schedule with selected subjects, classes, and widgets.",
          searchBody: "Local search across routes, published catalog data, and official sources.",
          settingsBody:
            "Configuration for subjects, swipe mode, and browser-local schedule state.",
          termsBody: "Independent-project legal context and non-affiliation notice.",
        },
      }
    : {
        careerBodyPrefix: "Fuente oficial de carrera del ITAM.",
        doubleDegreeBodyPrefix: "Referencia oficial de doble grado del ITAM.",
        graduateProgramBodyPrefix: "Referencia oficial de posgrado del ITAM.",
        jointProgramBodyPrefix: "Referencia oficial de plan conjunto del ITAM.",
        categories: {
          calendarEvent: "Evento del calendario",
          career: "Carrera",
          doubleDegree: "Doble grado",
          graduateProgram: "Posgrado",
          jointProgram: "Plan conjunto",
          officialSource: "Fuente oficial",
          officialUpdate: "Actualización oficial",
          page: "Página",
          paymentEvent: "Evento de pago",
          plan: "Plan",
          schedulePeriod: "Periodo de horario",
        },
        staticPages: {
          calendarBody: "Calendario académico y hitos de pagos.",
          connectAiBody: "Puente de solo lectura hacia IA y flujo futuro del código del estudiante.",
          executiveEducationBody:
            "Superficie oficial de educación ejecutiva y extensión alojada por el ITAM.",
          homeBody: "Introducción del proyecto y tarjetas con fuentes oficiales actualizadas.",
          mapBody: "Marcador de mapa para una futura guía de campus y salones.",
          onboardingBody: "Wizard embebido para configurar el horario.",
          privacyBody: "Aviso de privacidad local del navegador y reglas de almacenamiento.",
          projectBody: "Enlaces del proyecto, ruta de soporte, créditos y superficies del repositorio.",
          registrationBody:
            "Guía trazable de inscripciones enlazada al flujo oficial de servicios ITAM.",
          scheduleBody: "Horario local del navegador con materias, clases y paneles seleccionados.",
          searchBody: "Búsqueda local entre rutas, catálogo publicado y fuentes oficiales.",
          settingsBody:
            "Configuración de materias, modo de deslizamiento y estado local del navegador.",
          termsBody: "Contexto legal del proyecto independiente y aviso de no afiliación.",
        },
      };
}
