import type {
  AcademicCareerReference,
  BulletinSummary,
  JointProgramReference,
} from "@/lib/types";

export const OFFICIAL_CAREERS: readonly AcademicCareerReference[] = [
  {
    career_id: "actuaria",
    category: "licenciatura",
    display_name: "Actuaría",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-actuaria.pdf",
  },
  {
    career_id: "administracion-negocios",
    category: "licenciatura",
    display_name: "Administración de Negocios",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-administracion.pdf",
  },
  {
    career_id: "ciencia-datos",
    category: "licenciatura",
    display_name: "Ciencia de Datos",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-de-datos.pdf",
  },
  {
    career_id: "ciencia-politica",
    category: "licenciatura",
    display_name: "Ciencia Política",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-politica.pdf",
  },
  {
    career_id: "derecho",
    category: "licenciatura",
    display_name: "Derecho",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-derecho.pdf",
  },
  {
    career_id: "direccion-financiera",
    category: "licenciatura",
    display_name: "Dirección Financiera",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-direccion-financiera.pdf",
  },
  {
    career_id: "economia",
    category: "licenciatura",
    display_name: "Economía",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-economia.pdf",
  },
  {
    career_id: "matematicas-aplicadas",
    category: "licenciatura",
    display_name: "Matemáticas Aplicadas",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-matematicas-aplicadas.pdf",
  },
  {
    career_id: "relaciones-internacionales",
    category: "licenciatura",
    display_name: "Relaciones Internacionales",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-relaciones-internacionales.pdf",
  },
  {
    career_id: "inteligencia-artificial",
    category: "ingenieria",
    display_name: "Inteligencia Artificial",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-inteligencia-artificial.pdf",
  },
  {
    career_id: "computacion",
    category: "ingenieria",
    display_name: "Ingeniería y Ciencias de la Computación",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-computacion.pdf",
  },
  {
    career_id: "industrial-sistemas-inteligentes",
    category: "ingenieria",
    display_name: "Ingeniería Industrial y en Sistemas Inteligentes",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-industrial.pdf",
  },
  {
    career_id: "mecatronica-robotica-inteligente",
    category: "ingenieria",
    display_name: "Ingeniería en Mecatrónica y Robótica Inteligente",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-mecatronica.pdf",
  },
  {
    career_id: "ingenieria-negocios",
    category: "ingenieria",
    display_name: "Ingeniería en Negocios",
    source_url: "https://carreras.itam.mx/carreras/",
    study_plan_url:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-negocios.pdf",
  },
] as const;

export const OFFICIAL_JOINT_PROGRAMS: readonly JointProgramReference[] = [
  {
    component_career_ids: ["actuaria", "matematicas-aplicadas"],
    display_name: "Actuaría + Matemáticas Aplicadas",
    joint_program_id: "actuaria-matematicas-aplicadas",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["actuaria", "direccion-financiera"],
    display_name: "Actuaría + Dirección Financiera",
    joint_program_id: "actuaria-direccion-financiera",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["administracion-negocios", "economia"],
    display_name: "Administración de Negocios + Economía",
    joint_program_id: "administracion-negocios-economia",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["ciencia-datos", "economia"],
    display_name: "Ciencia de Datos + Economía",
    joint_program_id: "ciencia-datos-economia",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["ciencia-datos", "matematicas-aplicadas"],
    display_name: "Ciencia de Datos + Matemáticas Aplicadas",
    joint_program_id: "ciencia-datos-matematicas-aplicadas",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["ciencia-datos", "inteligencia-artificial"],
    display_name: "Ciencia de Datos + Inteligencia Artificial",
    joint_program_id: "ciencia-datos-inteligencia-artificial",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["ciencia-datos", "ingenieria-negocios"],
    display_name: "Ciencia de Datos + Ingeniería en Negocios",
    joint_program_id: "ciencia-datos-ingenieria-negocios",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["computacion", "inteligencia-artificial"],
    display_name: "Ingeniería y Ciencias de la Computación + Inteligencia Artificial",
    joint_program_id: "computacion-inteligencia-artificial",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["computacion", "industrial-sistemas-inteligentes"],
    display_name: "Ingeniería y Ciencias de la Computación + Ingeniería Industrial y en Sistemas Inteligentes",
    joint_program_id: "computacion-industrial-sistemas-inteligentes",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["computacion", "matematicas-aplicadas"],
    display_name: "Ingeniería y Ciencias de la Computación + Matemáticas Aplicadas",
    joint_program_id: "computacion-matematicas-aplicadas",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["economia", "derecho"],
    display_name: "Economía + Derecho",
    joint_program_id: "economia-derecho",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["economia", "ingenieria-negocios"],
    display_name: "Economía + Ingeniería en Negocios",
    joint_program_id: "economia-ingenieria-negocios",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["economia", "relaciones-internacionales"],
    display_name: "Economía + Relaciones Internacionales",
    joint_program_id: "economia-relaciones-internacionales",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["derecho", "relaciones-internacionales"],
    display_name: "Derecho + Relaciones Internacionales",
    joint_program_id: "derecho-relaciones-internacionales",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
  {
    component_career_ids: ["ingenieria-negocios", "direccion-financiera"],
    display_name: "Ingeniería en Negocios + Dirección Financiera",
    joint_program_id: "ingenieria-negocios-direccion-financiera",
    source_url: "https://www.itam.mx/es/programas-conjuntos",
  },
] as const;

const PROGRAM_NORMALIZATION_OVERRIDES: Record<string, string> = {
  "administracion en negocios": "administracion de negocios",
  "administracion y contaduria publica y estrategia financiera":
    "administracion de negocios contaduria publica estrategia financiera",
  "contaduria analitica y finanzas corporativas":
    "contaduria publica estrategia financiera",
  "direccion de mercadotecnia": "mercadotecnia",
  "direccion financiera": "direccion financiera",
  "ingenieria industrial y sistemas inteligentes":
    "ingenieria industrial y en sistemas inteligentes",
  "ingenieria industrial y en sistemas inteligentes":
    "ingenieria industrial y en sistemas inteligentes",
  "ingenieria y ciencias de la computacion":
    "ingenieria y ciencias de la computacion",
  "ingenieria en mecatronica": "ingenieria en mecatronica y robotica inteligente",
  "ingenieria en negocios": "ingenieria en negocios",
  "licenciaturas en ": "",
};

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

export function findOfficialCareer(careerId: string) {
  return OFFICIAL_CAREERS.find((career) => career.career_id === careerId) ?? null;
}

export function findOfficialJointProgram(jointProgramId: string) {
  return OFFICIAL_JOINT_PROGRAMS.find((program) => program.joint_program_id === jointProgramId) ?? null;
}

export function classifyProgramTitle(programTitle: string) {
  const normalized = normalizeAcademicTitle(programTitle);

  const career = OFFICIAL_CAREERS.find((entry) =>
    normalized.includes(normalizeAcademicTitle(entry.display_name)),
  );

  return {
    isJointProgram:
      /\b y \b/iu.test(normalized) ||
      normalizeAcademicTitle(programTitle).includes("plan conjunto"),
    officialCareer: career,
    normalized,
  };
}

export function isIndividualCareerProgram(programTitle: string) {
  const classification = classifyProgramTitle(programTitle);
  return classification.officialCareer !== null && !classification.isJointProgram;
}

export function findApplicableJointPlansForEntryTerm(
  plans: BulletinSummary[],
  jointProgramId: string,
) {
  const jointProgram = findOfficialJointProgram(jointProgramId);

  if (!jointProgram) {
    return [];
  }

  const componentTokens = jointProgram.component_career_ids
    .map((careerId) => findOfficialCareer(careerId))
    .filter((career): career is AcademicCareerReference => career !== null)
    .map((career) => normalizeAcademicTitle(career.display_name));

  return plans.filter((plan) => {
    const normalized = normalizeAcademicTitle(plan.program_title);
    return componentTokens.every((token) => normalized.includes(token));
  });
}
