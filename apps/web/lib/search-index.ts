import { OFFICIAL_EXECUTIVE_EDUCATION_URL } from "@/lib/site-content";
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

export interface SearchIndexBootstrap {
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

export function buildLocalSearchIndex(bootstrap: SearchIndexBootstrap): LocalSearchIndexItem[] {
  return [
    ...STATIC_PAGES,
    ...bootstrap.careers.map((career) => ({
      body: `Official ITAM career source. ${career.display_name}.`,
      category: "Career",
      href: "/planner/onboarding",
      keywords: [career.career_id, career.display_name],
      title: career.display_name,
    })),
    ...bootstrap.jointPrograms.map((program) => ({
      body: `Official ITAM joint program reference. ${program.display_name}. ${program.coordinators.join(" ")} ${program.contact_emails.join(" ")} ${program.phone_extensions.join(" ")}`.trim(),
      category: "Joint program",
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
        "Official ITAM graduate program reference.",
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
      category: "Graduate program",
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
        "Official ITAM double degree reference.",
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
      category: "Double degree",
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
      category: "Plan",
      href: "/planner/onboarding",
      keywords: [plan.plan_id, plan.source_code, plan.program_title],
      title: `${plan.program_title} · Plan ${plan.plan_code}`,
    })),
    ...bootstrap.periods.map((period) => ({
      body: `${period.label} ${period.level} ${period.term ?? ""}`.trim(),
      category: "Schedule period",
      href: "/planner",
      keywords: [period.period_id, period.label],
      title: period.label,
    })),
    ...(bootstrap.schoolCalendar
      ? bootstrap.schoolCalendar.events.map((event) => ({
          body: `${event.label} ${event.notes ?? ""}`.trim(),
          category: "Calendar event",
          href: "/calendar",
          keywords: [event.symbol, event.event_date],
          title: event.label,
        }))
      : []),
    ...(bootstrap.paymentCalendar
      ? bootstrap.paymentCalendar.payment_events.map((event) => ({
          body: `${event.label} ${event.notes ?? ""}`.trim(),
          category: "Payment event",
          href: "/calendar",
          keywords: [event.code, event.academic_period ?? ""],
          title: event.label,
        }))
      : []),
    ...bootstrap.newsItems.map((item) => ({
      body: `${item.summary} ${item.source_label}`.trim(),
      category: "Official update",
      href: item.href,
      keywords: [item.category, item.source_label],
      title: item.title,
    })),
  ];
}

export function searchLocalIndex(index: LocalSearchIndexItem[], query: string) {
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

const STATIC_PAGES: LocalSearchIndexItem[] = [
  {
    body: "Introducción del proyecto y tarjetas con fuentes oficiales actualizadas.",
    category: "Page",
    href: "/",
    keywords: ["home", "inicio", "proyecto", "planner"],
    title: "Inicio",
  },
  {
    body: "Horario local del navegador con materias, grupos y widgets seleccionados.",
    category: "Page",
    href: "/planner",
    keywords: ["planner", "horario", "materias"],
    title: "Horario",
  },
  {
    body: "Wizard embebido para configurar el horario.",
    category: "Page",
    href: "/planner/onboarding",
    keywords: ["onboarding", "ingreso", "carrera"],
    title: "Onboarding del horario",
  },
  {
    body: "Academic calendar and payment milestones.",
    category: "Page",
    href: "/calendar",
    keywords: ["calendar", "calendario", "pagos"],
    title: "Calendario",
  },
  {
    body: "Links del proyecto, ruta de soporte, créditos y superficies del repositorio.",
    category: "Page",
    href: "/project",
    keywords: ["project", "proyecto", "support", "github"],
    title: "Proyecto",
  },
  {
    body: "Puente read-only hacia IA y flujo futuro del código del estudiante.",
    category: "Page",
    href: "/connect-ai",
    keywords: ["ai", "chatgpt", "student code"],
    title: "Conectar con IA",
  },
  {
    body: "Local search across routes, published catalog data, and official sources.",
    category: "Page",
    href: "/search",
    keywords: ["search", "buscar", "local"],
    title: "Buscar",
  },
  {
    body: "Configuración de materias, modo de deslizamiento y estado local del navegador.",
    category: "Page",
    href: "/settings",
    keywords: ["settings", "configuration", "materias", "deslizamiento"],
    title: "Configuración",
  },
  {
    body: "Traceable inscriptions guidance linked to the official ITAM services flow.",
    category: "Page",
    href: "/registration",
    keywords: ["inscripciones", "registration", "servicios"],
    title: "Inscripciones",
  },
  {
    body: "Map placeholder for future campus and classroom guidance.",
    category: "Page",
    href: "/map",
    keywords: ["mapa", "map", "campus", "salones"],
    title: "Mapa",
  },
  {
    body: "Official executive education and continuing-education surface hosted by ITAM.",
    category: "Official source",
    href: OFFICIAL_EXECUTIVE_EDUCATION_URL,
    keywords: ["educacion ejecutiva", "extension universitaria", "executive education"],
    title: "Educación ejecutiva",
  },
  {
    body: "Independent-project legal context and non-affiliation notice.",
    category: "Page",
    href: "/terms",
    keywords: ["terms", "terminos", "legal"],
    title: "Términos y condiciones",
  },
  {
    body: "Browser-local privacy notice and data-storage rules.",
    category: "Page",
    href: "/privacy",
    keywords: ["privacy", "privacidad", "local storage"],
    title: "Aviso de privacidad",
  },
];

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}
