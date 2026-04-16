import type {
  AcademicCareerReference,
  BulletinSummary,
  JointProgramReference,
} from "@/lib/types";

const OFFICIAL_CAREERS_SOURCE_URL = "https://carreras.itam.mx/carreras/";
const OFFICIAL_JOINT_PROGRAMS_SOURCE_URL = "https://www.itam.mx/es/programas-conjuntos";

interface OfficialCareerDefinition {
  careerId: string;
  category: AcademicCareerReference["category"];
  displayName: string;
  studyPlanUrl: string | null;
}

interface OfficialJointProgramDefinition {
  componentCareerIds: [string, string];
  contactEmails: string[];
  coordinators: string[];
  phoneExtensions: string[];
}

export interface ExtractedOfficialJointProgramRow {
  contact_emails: string[];
  coordinators: string[];
  component_titles: [string, string];
  phone_extensions: string[];
}

const OFFICIAL_CAREER_DEFINITIONS = [
  {
    careerId: "actuaria",
    category: "licenciatura",
    displayName: "Actuaría",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-actuaria.pdf",
  },
  {
    careerId: "administracion-negocios",
    category: "licenciatura",
    displayName: "Administración de Negocios",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-administracion.pdf",
  },
  {
    careerId: "ciencia-datos",
    category: "licenciatura",
    displayName: "Ciencia de Datos",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-de-datos.pdf",
  },
  {
    careerId: "ciencia-politica",
    category: "licenciatura",
    displayName: "Ciencia Política",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-politica.pdf",
  },
  {
    careerId: "contaduria-analitica-finanzas-corporativas",
    category: "licenciatura",
    displayName: "Contaduría Analítica y Finanzas Corporativas",
    studyPlanUrl: null,
  },
  {
    careerId: "derecho",
    category: "licenciatura",
    displayName: "Derecho",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-derecho.pdf",
  },
  {
    careerId: "direccion-mercadotecnia",
    category: "licenciatura",
    displayName: "Dirección de Mercadotecnia",
    studyPlanUrl: null,
  },
  {
    careerId: "direccion-financiera",
    category: "licenciatura",
    displayName: "Dirección Financiera",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-direccion-financiera.pdf",
  },
  {
    careerId: "economia",
    category: "licenciatura",
    displayName: "Economía",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-economia.pdf",
  },
  {
    careerId: "matematicas-aplicadas",
    category: "licenciatura",
    displayName: "Matemáticas Aplicadas",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-matematicas-aplicadas.pdf",
  },
  {
    careerId: "relaciones-internacionales",
    category: "licenciatura",
    displayName: "Relaciones Internacionales",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-relaciones-internacionales.pdf",
  },
  {
    careerId: "inteligencia-artificial",
    category: "ingenieria",
    displayName: "Inteligencia Artificial",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-inteligencia-artificial.pdf",
  },
  {
    careerId: "computacion",
    category: "ingenieria",
    displayName: "Ciencias de la Computación",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-computacion.pdf",
  },
  {
    careerId: "mecatronica-robotica-inteligente",
    category: "ingenieria",
    displayName: "Ingeniería en Mecatrónica y Robótica Inteligente",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-mecatronica.pdf",
  },
  {
    careerId: "ingenieria-negocios",
    category: "ingenieria",
    displayName: "Ingeniería en Negocios",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-negocios.pdf",
  },
  {
    careerId: "industrial-sistemas-inteligentes",
    category: "ingenieria",
    displayName: "Ingeniería Industrial y en Sistemas Inteligentes",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-industrial.pdf",
  },
] as const satisfies readonly OfficialCareerDefinition[];

export const OFFICIAL_CAREERS: readonly AcademicCareerReference[] = OFFICIAL_CAREER_DEFINITIONS.map(
  (definition) => ({
    career_id: definition.careerId,
    category: definition.category,
    display_name: definition.displayName,
    source_url: OFFICIAL_CAREERS_SOURCE_URL,
    study_plan_url: definition.studyPlanUrl,
  }),
);

const OFFICIAL_CAREER_MATCH_ALIASES: Record<string, string[]> = {
  "administracion-negocios": [
    "administracion",
    "administracion de negocios",
    "administracion en negocios",
  ],
  computacion: [
    "computacion",
    "ciencias de la computacion",
    "ingenieria en computacion",
    "ingenieria y ciencias de la computacion",
  ],
  "contaduria-analitica-finanzas-corporativas": [
    "contaduria analitica y finanzas corporativas",
    "contaduria publica",
    "contaduria publica y estrategia financiera",
    "contaduria publica estrategia financiera",
  ],
  "direccion-mercadotecnia": ["mercadotecnia", "direccion de mercadotecnia"],
  "industrial-sistemas-inteligentes": [
    "ingenieria industrial",
    "ingenieria industrial y sistemas inteligentes",
    "ingenieria industrial y en sistemas inteligentes",
    "industrial y sistemas inteligentes",
    "industrial y en sistemas inteligentes",
  ],
  "inteligencia-artificial": ["inteligencia artificial", "ingenieria en inteligencia artificial"],
  "mecatronica-robotica-inteligente": [
    "ingenieria en mecatronica",
    "ingenieria en mecatronica y robotica inteligente",
    "mecatronica y robotica inteligente",
  ],
};

const PROGRAM_NORMALIZATION_OVERRIDES: Record<string, string> = {
  "administracion en negocios": "administracion de negocios",
  "ingenieria industrial y sistemas inteligentes":
    "ingenieria industrial y en sistemas inteligentes",
  "licenciaturas en ": "",
};

const OFFICIAL_JOINT_PROGRAM_DEFINITIONS = [
  {
    componentCareerIds: ["actuaria", "matematicas-aplicadas"],
    contactEmails: ["mercedes@itam.mx", "ezequiel.soto@itam.mx"],
    coordinators: ["Dra. María Mercedes Gregorio Domínguez", "Dr. José Ezequiel Soto Sánchez"],
    phoneExtensions: ["3839", "3812"],
  },
  {
    componentCareerIds: ["actuaria", "direccion-financiera"],
    contactEmails: ["mercedes@itam.mx", "fernandoperez@itam.mx"],
    coordinators: ["Dra. María Mercedes Gregorio Domínguez", "Dr. Fernando Pérez Cervantes"],
    phoneExtensions: ["3839", "6520"],
  },
  {
    componentCareerIds: ["administracion-negocios", "contaduria-analitica-finanzas-corporativas"],
    contactEmails: ["jguiza@itam.mx"],
    coordinators: ["Mtra. Julieta Irma Guiza Pérez"],
    phoneExtensions: ["3436"],
  },
  {
    componentCareerIds: ["administracion-negocios", "economia"],
    contactEmails: ["javier.medrano@itam.mx", "arturo.aguilar@itam.mx"],
    coordinators: ["Dr. José Javier Medrano Pérez", "Dr. Arturo Aguilar Esteva"],
    phoneExtensions: ["4049", "4179"],
  },
  {
    componentCareerIds: ["administracion-negocios", "direccion-financiera"],
    contactEmails: ["javier.medrano@itam.mx", "fernandoperez@itam.mx"],
    coordinators: ["Dr. José Javier Medrano Pérez", "Dr. Fernando Pérez Cervantes"],
    phoneExtensions: ["4049", "6520"],
  },
  {
    componentCareerIds: ["ciencia-politica", "derecho"],
    contactEmails: ["auribe@itam.mx", "ana.zorrilla@itam.mx"],
    coordinators: ["Mtra. Alexandra Uribe Coughlan", "Dra. Ana María Zorrilla Noriega"],
    phoneExtensions: ["3762", "4677"],
  },
  {
    componentCareerIds: ["contaduria-analitica-finanzas-corporativas", "actuaria"],
    contactEmails: ["marcela.gonzalez.martinez@itam.mx", "mercedes@itam.mx"],
    coordinators: ["Mtra. Marcela González Martínez", "Dra. María Mercedes Gregorio Domínguez"],
    phoneExtensions: ["4048", "3839"],
  },
  {
    componentCareerIds: ["contaduria-analitica-finanzas-corporativas", "derecho"],
    contactEmails: ["marcela.gonzalez.martinez@itam.mx", "ana.zorrilla@itam.mx"],
    coordinators: ["Mtra. Marcela González Martínez", "Dra. Ana María Zorrilla Noriega"],
    phoneExtensions: ["4048", "4677"],
  },
  {
    componentCareerIds: ["contaduria-analitica-finanzas-corporativas", "direccion-financiera"],
    contactEmails: ["marcela.gonzalez.martinez@itam.mx", "fernandoperez@itam.mx"],
    coordinators: ["Mtra. Marcela González Martínez", "Dr. Fernando Pérez Cervantes"],
    phoneExtensions: ["4048", "6520"],
  },
  {
    componentCareerIds: ["economia", "ciencia-politica"],
    contactEmails: ["arturo.aguilar@itam.mx", "auribe@itam.mx"],
    coordinators: ["Dr. Arturo Aguilar Esteva", "Mtra. Alexandra Uribe Coughlan"],
    phoneExtensions: ["4179", "3762"],
  },
  {
    componentCareerIds: ["economia", "derecho"],
    contactEmails: ["arturo.aguilar@itam.mx", "ana.zorrilla@itam.mx"],
    coordinators: ["Dr. Arturo Aguilar Esteva", "Dra. Ana María Zorrilla Noriega"],
    phoneExtensions: ["4179", "4677"],
  },
  {
    componentCareerIds: ["economia", "ingenieria-negocios"],
    contactEmails: ["arturo.aguilar@itam.mx", "abarrera@itam.mx"],
    coordinators: ["Dr. Arturo Aguilar Esteva", "Dra. María Alejandra Barrera Ramirez"],
    phoneExtensions: ["4179", "3616"],
  },
  {
    componentCareerIds: ["economia", "matematicas-aplicadas"],
    contactEmails: ["arturo.aguilar@itam.mx", "ezequiel.soto@itam.mx"],
    coordinators: ["Dr. Arturo Aguilar Esteva", "Dr. José Ezequiel Soto Sánchez"],
    phoneExtensions: ["4179", "3812"],
  },
  {
    componentCareerIds: ["economia", "direccion-financiera"],
    contactEmails: ["arturo.aguilar@itam.mx", "fernandoperez@itam.mx"],
    coordinators: ["Dr. Arturo Aguilar Esteva", "Dr. Fernando Pérez Cervantes"],
    phoneExtensions: ["4179", "6520"],
  },
  {
    componentCareerIds: ["economia", "relaciones-internacionales"],
    contactEmails: ["arturo.aguilar@itam.mx", "isabel.flores@itam.mx"],
    coordinators: ["Dr. Arturo Aguilar Esteva", "Dra. Isabel Flores Alcázar"],
    phoneExtensions: ["4179", "3926"],
  },
  {
    componentCareerIds: ["derecho", "relaciones-internacionales"],
    contactEmails: ["ana.zorrilla@itam.mx", "isabel.flores@itam.mx"],
    coordinators: ["Dra. Ana María Zorrilla Noriega", "Dra. Isabel Flores Alcázar"],
    phoneExtensions: ["4677", "3926"],
  },
  {
    componentCareerIds: ["relaciones-internacionales", "ciencia-politica"],
    contactEmails: ["isabel.flores@itam.mx", "auribe@itam.mx"],
    coordinators: ["Dra. Isabel Flores Alcázar", "Mtra. Alexandra Uribe Coughlan"],
    phoneExtensions: ["3926", "3762"],
  },
  {
    componentCareerIds: ["relaciones-internacionales", "administracion-negocios"],
    contactEmails: ["isabel.flores@itam.mx", "javier.medrano@itam.mx"],
    coordinators: ["Dra. Isabel Flores Alcázar", "Dr. José Javier Medrano Pérez"],
    phoneExtensions: ["3920", "4049"],
  },
  {
    componentCareerIds: ["computacion", "matematicas-aplicadas"],
    contactEmails: ["marco.morales@itam.mx", "ezequiel.soto@itam.mx"],
    coordinators: ["Dr. Marco Antonio Morales Aguirre", "Dr. José Ezequiel Soto Sánchez"],
    phoneExtensions: ["3626", "3812"],
  },
  {
    componentCareerIds: ["computacion", "industrial-sistemas-inteligentes"],
    contactEmails: ["marco.morales@itam.mx", "thomas.rudolf@itam.mx"],
    coordinators: ["Dr. Marco Antonio Morales Aguirre", "Dr. Thomas Martin Rudolf"],
    phoneExtensions: ["3626", "3601"],
  },
  {
    componentCareerIds: ["mecatronica-robotica-inteligente", "computacion"],
    contactEmails: ["jose.romerovelazquez@itam.mx", "marco.morales@itam.mx"],
    coordinators: ["Dr. José Guadalupe Romero", "Dr. Marco Antonio Morales Aguirre"],
    phoneExtensions: ["3601", "3626"],
  },
  {
    componentCareerIds: ["ingenieria-negocios", "industrial-sistemas-inteligentes"],
    contactEmails: ["abarrera@itam.mx", "thomas.rudolf@itam.mx"],
    coordinators: ["Dra. María Alejandra Barrera Ramirez", "Dr. Thomas Martin Rudolf"],
    phoneExtensions: ["3616", "3601"],
  },
  {
    componentCareerIds: ["ingenieria-negocios", "administracion-negocios"],
    contactEmails: ["abarrera@itam.mx", "javier.medrano@itam.mx"],
    coordinators: ["Dra. María Alejandra Barrera Ramirez", "Dr. José Javier Medrano Pérez"],
    phoneExtensions: ["3616", "4049"],
  },
  {
    componentCareerIds: ["ingenieria-negocios", "computacion"],
    contactEmails: ["abarrera@itam.mx", "marco.morales@itam.mx"],
    coordinators: ["Dra. María Alejandra Barrera Ramirez", "Dr. Marco Antonio Morales Aguirre"],
    phoneExtensions: ["3616", "3626"],
  },
  {
    componentCareerIds: ["ingenieria-negocios", "direccion-financiera"],
    contactEmails: ["abarrera@itam.mx", "fernandoperez@itam.mx"],
    coordinators: ["Dra. María Alejandra Barrera Ramirez", "Dr. Fernando Pérez Cervantes"],
    phoneExtensions: ["3616", "6520"],
  },
  {
    componentCareerIds: ["mecatronica-robotica-inteligente", "industrial-sistemas-inteligentes"],
    contactEmails: ["jose.romerovelazquez@itam.mx", "thomas.rudolf@itam.mx"],
    coordinators: [
      "Dr. José Guadalupe Romero Velázquez",
      "Dr. Thomas Martin Rudolf",
    ],
    phoneExtensions: ["3601", "3601"],
  },
  {
    componentCareerIds: ["ciencia-datos", "economia"],
    contactEmails: ["fernando.esponda@itam.mx", "arturo.aguilar@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dr. Arturo Aguilar Esteva"],
    phoneExtensions: ["4699", "4179"],
  },
  {
    componentCareerIds: ["ciencia-datos", "direccion-financiera"],
    contactEmails: ["fernando.esponda@itam.mx", "fernandoperez@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dr. Fernando Pérez Cervantes"],
    phoneExtensions: ["4699", "6520"],
  },
  {
    componentCareerIds: ["ciencia-datos", "computacion"],
    contactEmails: ["fernando.esponda@itam.mx", "marco.morales@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dr. Marco Antonio Morales Aguirrei"],
    phoneExtensions: ["4699", "3626"],
  },
  {
    componentCareerIds: ["ciencia-datos", "ingenieria-negocios"],
    contactEmails: ["fernando.esponda@itam.mx", "abarrera@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dra. María Alejandra Barrera Ramirez"],
    phoneExtensions: ["4699", "3616"],
  },
  {
    componentCareerIds: ["ciencia-datos", "actuaria"],
    contactEmails: ["fernando.esponda@itam.mx", "mercedes@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dra. Mercedes Gregorio"],
    phoneExtensions: ["4699", "3839"],
  },
  {
    componentCareerIds: ["ciencia-datos", "matematicas-aplicadas"],
    contactEmails: ["fernando.esponda@itam.mx", "ezequiel.soto@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dr. José Ezequiel Soto Sánchez"],
    phoneExtensions: ["4699", "3812"],
  },
  {
    componentCareerIds: ["ciencia-datos", "mecatronica-robotica-inteligente"],
    contactEmails: ["fernando.esponda@itam.mx", "jose.romerovelazquez@itam.mx"],
    coordinators: [
      "Dr. Fernando Esponda Darlington",
      "Dr. José Guadalupe Romero Velázquez",
    ],
    phoneExtensions: ["4699", "3601"],
  },
  {
    componentCareerIds: ["ciencia-datos", "industrial-sistemas-inteligentes"],
    contactEmails: ["fernando.esponda@itam.mx", "thomas.rudolf@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dr. Thomas Martin Rudolf"],
    phoneExtensions: ["4699", "3601"],
  },
  {
    componentCareerIds: ["administracion-negocios", "industrial-sistemas-inteligentes"],
    contactEmails: ["javier.medrano@itam.mx", "thomas.rudolf@itam.mx"],
    coordinators: ["Dr. José Javier Medrano Pérez", "Dr. Thomas Martin Rudolf"],
    phoneExtensions: ["4049", "3601"],
  },
  {
    componentCareerIds: ["ciencia-datos", "inteligencia-artificial"],
    contactEmails: ["fernando.esponda@itam.mx", "marco.morales@itam.mx"],
    coordinators: ["Dr. Fernando Esponda Darlington", "Dr. Marco Antonio Morales Aguirre"],
    phoneExtensions: ["4699", "3626"],
  },
  {
    componentCareerIds: ["contaduria-analitica-finanzas-corporativas", "industrial-sistemas-inteligentes"],
    contactEmails: ["marcela.gonzalez.martinez@itam.mx", "thomas.rudolf@itam.mx"],
    coordinators: ["Mtra. Marcela González Martínez", "Dr. Thomas Martin Rudolf"],
    phoneExtensions: ["4048", "3601"],
  },
  {
    componentCareerIds: ["computacion", "inteligencia-artificial"],
    contactEmails: ["marco.morales@itam.mx"],
    coordinators: ["Dr. Marco Antonio Morales Aguirre"],
    phoneExtensions: ["3626"],
  },
  {
    componentCareerIds: ["inteligencia-artificial", "matematicas-aplicadas"],
    contactEmails: ["marco.morales@itam.mx", "ezequiel.soto@itam.mx"],
    coordinators: ["Dr. Marco Antonio Morales Aguirre", "Dr. José Ezequiel Soto Sánchez"],
    phoneExtensions: ["3626", "3812"],
  },
] as const satisfies readonly OfficialJointProgramDefinition[];

export const OFFICIAL_JOINT_PROGRAMS: readonly JointProgramReference[] =
  OFFICIAL_JOINT_PROGRAM_DEFINITIONS.map((definition) =>
    createJointProgramReference(definition),
  );

export function normalizeAcademicTitle(value: string) {
  const normalized = value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\blicenciatura(s)? en\b/gu, "")
    .replace(/\bingenieria(s)? en\b/gu, "")
    .replace(/\bplan conjunto de la\b/gu, "")
    .replace(/\bplan conjunto\b/gu, "")
    .replace(/\bplan [a-z]\b/gu, "")
    .replace(/\bse puede seleccionar cualquiera de las siguientes cuatro\b/gu, "")
    .replace(/[():.,]/gu, " ")
    .replace(/\be\b/gu, " y ")
    .replace(/\s+/gu, " ")
    .trim();

  return PROGRAM_NORMALIZATION_OVERRIDES[normalized] ?? normalized;
}

export function buildJointProgramId(componentCareerIds: readonly string[]) {
  return componentCareerIds.join("-");
}

export function findOfficialCareer(careerId: string) {
  return OFFICIAL_CAREERS.find((career) => career.career_id === careerId) ?? null;
}

export function getOfficialCareerMatchTokens(careerId: string) {
  const career = findOfficialCareer(careerId);
  const aliases = OFFICIAL_CAREER_MATCH_ALIASES[careerId] ?? [];
  const tokens = career ? [career.display_name, ...aliases] : aliases;

  return [...new Set(tokens.map(normalizeOfficialMatchText).filter(Boolean))];
}

export function findOfficialCareerIdFromSourceLabel(label: string) {
  const normalized = normalizeOfficialMatchText(label);
  const directMatch =
    OFFICIAL_CAREERS.find((career) =>
      getOfficialCareerMatchTokens(career.career_id).some((token) => normalized.includes(token)),
    ) ?? null;

  return directMatch?.career_id ?? null;
}

export function findOfficialJointProgram(jointProgramId: string) {
  return OFFICIAL_JOINT_PROGRAMS.find((program) => program.joint_program_id === jointProgramId) ?? null;
}

export function extractOfficialJointProgramRowsFromHtml(
  html: string,
): ExtractedOfficialJointProgramRow[] {
  const tbody = /<tbody>([\s\S]*?)<\/tbody>/iu.exec(html)?.[1] ?? "";
  const rows = [...tbody.matchAll(/<tr>([\s\S]*?)<\/tr>/giu)];

  return rows
    .map((rowMatch) => {
      const cells = [...rowMatch[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/giu)].map(
        (cellMatch) => cellMatch[1],
      );

      if (cells.length < 4) {
        return null;
      }

      const componentTitles = extractTextLinesFromHtmlFragment(cells[0]);
      if (componentTitles.length < 2) {
        return null;
      }

      return {
        contact_emails: extractEmailAddressesFromHtmlFragment(cells[2]),
        coordinators: extractTextLinesFromHtmlFragment(cells[1]),
        component_titles: [
          trimTrailingAcademicConnector(componentTitles[0] ?? ""),
          trimTrailingAcademicConnector(componentTitles[1] ?? ""),
        ],
        phone_extensions: extractPhoneExtensionsFromHtmlFragment(cells[3]),
      } satisfies ExtractedOfficialJointProgramRow;
    })
    .filter((row): row is ExtractedOfficialJointProgramRow => row !== null);
}

export function extractOfficialJointProgramsFromHtml(html: string) {
  return extractOfficialJointProgramRowsFromHtml(html)
    .map((row) => {
      const componentCareerIds = row.component_titles
        .map(findOfficialCareerIdFromSourceLabel)
        .filter((careerId): careerId is string => typeof careerId === "string");

      if (componentCareerIds.length !== row.component_titles.length) {
        return null;
      }

      return {
        component_career_ids: componentCareerIds,
        contact_emails: row.contact_emails,
        coordinators: row.coordinators,
        display_name: componentCareerIds
          .map((careerId) => findOfficialCareer(careerId)?.display_name ?? careerId)
          .join(" + "),
        joint_program_id: buildJointProgramId(componentCareerIds),
        phone_extensions: row.phone_extensions,
        source_url: OFFICIAL_JOINT_PROGRAMS_SOURCE_URL,
      } satisfies JointProgramReference;
    })
    .filter((program): program is JointProgramReference => program !== null);
}

export function matchesOfficialCareerProgramTitle(programTitle: string, careerId: string) {
  const normalized = normalizeOfficialMatchText(programTitle);

  return getOfficialCareerMatchTokens(careerId).some((token) => normalized.includes(token));
}

export function classifyProgramTitle(programTitle: string) {
  const normalized = normalizeAcademicTitle(programTitle);
  const matchedCareers = OFFICIAL_CAREERS.filter((entry) =>
    matchesOfficialCareerProgramTitle(programTitle, entry.career_id),
  );
  const career = matchedCareers[0] ?? null;

  return {
    isJointProgram: normalized.includes("plan conjunto") || matchedCareers.length > 1,
    matchedCareers,
    normalized,
    officialCareer: career,
  };
}

export function isIndividualCareerProgram(programTitle: string) {
  const classification = classifyProgramTitle(programTitle);
  return classification.officialCareer !== null && classification.matchedCareers.length === 1;
}

export function findApplicableJointPlansForEntryTerm(
  plans: BulletinSummary[],
  jointProgramId: string,
) {
  const jointProgram = findOfficialJointProgram(jointProgramId);

  if (!jointProgram) {
    return [];
  }

  const componentTokenGroups = jointProgram.component_career_ids.map((careerId) =>
    getOfficialCareerMatchTokens(careerId),
  );

  return plans.filter((plan) => {
    const normalized = normalizeOfficialMatchText(plan.program_title);
    return componentTokenGroups.every((tokenGroup) =>
      tokenGroup.some((token) => normalized.includes(token)),
    );
  });
}

function createJointProgramReference(
  definition: OfficialJointProgramDefinition,
): JointProgramReference {
  return {
    component_career_ids: [...definition.componentCareerIds],
    contact_emails: [...dedupeStrings(definition.contactEmails)],
    coordinators: [...dedupeStrings(definition.coordinators)],
    display_name: definition.componentCareerIds
      .map((careerId) => findOfficialCareer(careerId)?.display_name ?? careerId)
      .join(" + "),
    joint_program_id: buildJointProgramId(definition.componentCareerIds),
    phone_extensions: [...dedupeStrings(definition.phoneExtensions)],
    source_url: OFFICIAL_JOINT_PROGRAMS_SOURCE_URL,
  };
}

function extractTextLinesFromHtmlFragment(fragment: string) {
  return dedupeStrings(
    decodeHtmlText(fragment)
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function extractEmailAddressesFromHtmlFragment(fragment: string) {
  return dedupeStrings(
    decodeHtmlText(fragment)
      .match(/[a-z0-9._%+-]+\s*@\s*[a-z0-9.-]+\.[a-z]{2,}/giu)
      ?.map((value) => value.replace(/\s*@\s*/gu, "@").toLocaleLowerCase("en-US")) ?? [],
  );
}

function extractPhoneExtensionsFromHtmlFragment(fragment: string) {
  return dedupeStrings(
    decodeHtmlText(fragment)
      .match(/\b\d{3,5}\b/gu)
      ?.map((value) => value.trim()) ?? [],
  );
}

function decodeHtmlText(value: string) {
  return value
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/<\/(div|p|li)>/giu, "\n")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&nbsp;|&#160;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/&quot;/giu, '"')
    .replace(/&apos;/giu, "'")
    .replace(/&#39;/giu, "'")
    .replace(/\u00a0/gu, " ")
    .replace(/[ \t]+/gu, " ")
    .replace(/\s*\n\s*/gu, "\n")
    .trim();
}

function dedupeStrings(values: readonly string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeOfficialMatchText(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[():.,]/gu, " ")
    .replace(/\be\b/gu, " y ")
    .replace(/\s+/gu, " ")
    .trim();
}

function trimTrailingAcademicConnector(value: string) {
  return value.replace(/\s+[ye]$/u, "").trim();
}
