import type {
  AcademicCareerReference,
  BulletinSummary,
  JointProgramReference,
  LocalSearchIndexItem,
  PaymentCalendarDocument,
  SchedulePeriodSummary,
  SchoolCalendarDocument,
  SiteNewsItem,
} from "@/lib/types";

export interface SearchIndexBootstrap {
  careers: AcademicCareerReference[];
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
      body: `Official ITAM joint program reference. ${program.display_name}.`,
      category: "Joint program",
      href: "/planner/onboarding",
      keywords: [program.joint_program_id, ...program.component_career_ids],
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
    body: "Project introduction and official-source update cards.",
    category: "Page",
    href: "/",
    keywords: ["home", "inicio", "proyecto", "planner"],
    title: "Home",
  },
  {
    body: "Browser-local planner shell with selected subjects, groups, and widgets.",
    category: "Page",
    href: "/planner",
    keywords: ["planner", "horario", "materias"],
    title: "Planner",
  },
  {
    body: "Embedded planner onboarding wizard.",
    category: "Page",
    href: "/planner/onboarding",
    keywords: ["onboarding", "ingreso", "carrera"],
    title: "Planner onboarding",
  },
  {
    body: "Academic calendar and payment milestones.",
    category: "Page",
    href: "/calendar",
    keywords: ["calendar", "calendario", "pagos"],
    title: "Calendario",
  },
  {
    body: "Project links, support path, credits, and repository surfaces.",
    category: "Page",
    href: "/project",
    keywords: ["project", "proyecto", "support", "github"],
    title: "Project",
  },
  {
    body: "Read-only AI bridge and future student-code flow.",
    category: "Page",
    href: "/connect-ai",
    keywords: ["ai", "chatgpt", "student code"],
    title: "Connect to AI",
  },
  {
    body: "Local search across routes, published catalog data, and official sources.",
    category: "Page",
    href: "/search",
    keywords: ["search", "buscar", "local"],
    title: "Buscar",
  },
  {
    body: "Configuration for subjects, swipe mode, and browser-local state.",
    category: "Page",
    href: "/planner/settings",
    keywords: ["settings", "configuration", "materias", "deslizamiento"],
    title: "Configuration",
  },
  {
    body: "Traceable inscriptions guidance linked to the official ITAM services flow.",
    category: "Page",
    href: "/inscripciones",
    keywords: ["inscripciones", "registration", "servicios"],
    title: "Inscripciones",
  },
  {
    body: "Map placeholder for future campus and classroom guidance.",
    category: "Page",
    href: "/mapa",
    keywords: ["mapa", "map", "campus", "salones"],
    title: "Mapa",
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
