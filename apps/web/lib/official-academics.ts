import type {
  AcademicCareerReference,
  BulletinSummary,
  DoubleDegreeReference,
  GraduateProgramReference,
  JointProgramReference,
} from "@/lib/types";

const OFFICIAL_CAREERS_SOURCE_URL = "https://carreras.itam.mx/carreras/";
const OFFICIAL_JOINT_PROGRAMS_SOURCE_URL = "https://www.itam.mx/es/programas-conjuntos";
const OFFICIAL_GRADUATE_PROGRAMS_SOURCE_URL = "https://posgrados.itam.mx/";
const OFFICIAL_DOUBLE_DEGREES_SOURCE_URL = "https://intercambio.itam.mx/es/dobles-grados";

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

interface OfficialGraduateProgramDefinition {
  admissionProcessUrl: string | null;
  brochureUrl: string | null;
  calendarUrl: string | null;
  contactEmails: string[];
  displayName: string;
  graduateProgramId: string;
  micrositeUrl: string | null;
  programKind: GraduateProgramReference["program_kind"];
  status: GraduateProgramReference["status"];
  studyPlanUrl: string | null;
}

interface OfficialDoubleDegreeDefinition {
  baseProgramLabel: string;
  brochureUrls: string[];
  contactEmails: string[];
  degreeLabels: string[];
  displayName: string;
  doubleDegreeId: string;
  eligibilityLabel: string | null;
  languageRequirement: string | null;
  location: string | null;
  notes: string[];
  partnerInstitution: string | null;
}

export interface ExtractedOfficialJointProgramRow {
  contact_emails: string[];
  coordinators: string[];
  component_titles: [string, string];
  phone_extensions: string[];
}

export interface ExtractedOfficialGraduateProgramRow {
  admission_process_url: string | null;
  brochure_url: string | null;
  calendar_url: string | null;
  contact_emails: string[];
  display_name: string;
  graduate_program_id: string;
  microsite_url: string | null;
  program_kind: GraduateProgramReference["program_kind"];
  status: GraduateProgramReference["status"];
  study_plan_url: string | null;
}

export interface ExtractedOfficialDoubleDegreeRow {
  base_program_label: string;
  brochure_urls: string[];
  contact_emails: string[];
  degree_labels: string[];
  display_name: string;
  double_degree_id: string;
  eligibility_label: string | null;
  language_requirement: string | null;
  location: string | null;
  notes: string[];
  partner_institution: string | null;
}

const OFFICIAL_CAREER_DEFINITIONS = [
  {
    careerId: "actuaria",
    category: "degree",
    displayName: "Actuaría",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-actuaria.pdf",
  },
  {
    careerId: "administracion-negocios",
    category: "degree",
    displayName: "Administración de Negocios",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-administracion.pdf",
  },
  {
    careerId: "ciencia-datos",
    category: "degree",
    displayName: "Ciencia de Datos",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-de-datos.pdf",
  },
  {
    careerId: "ciencia-politica",
    category: "degree",
    displayName: "Ciencia Política",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-politica.pdf",
  },
  {
    careerId: "contaduria-analitica-finanzas-corporativas",
    category: "degree",
    displayName: "Contaduría Analítica y Finanzas Corporativas",
    studyPlanUrl: null,
  },
  {
    careerId: "derecho",
    category: "degree",
    displayName: "Derecho",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-derecho.pdf",
  },
  {
    careerId: "direccion-mercadotecnia",
    category: "degree",
    displayName: "Dirección de Mercadotecnia",
    studyPlanUrl: null,
  },
  {
    careerId: "direccion-financiera",
    category: "degree",
    displayName: "Dirección Financiera",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-direccion-financiera.pdf",
  },
  {
    careerId: "economia",
    category: "degree",
    displayName: "Economía",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-economia.pdf",
  },
  {
    careerId: "matematicas-aplicadas",
    category: "degree",
    displayName: "Matemáticas Aplicadas",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-matematicas-aplicadas.pdf",
  },
  {
    careerId: "relaciones-internacionales",
    category: "degree",
    displayName: "Relaciones Internacionales",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-relaciones-internacionales.pdf",
  },
  {
    careerId: "inteligencia-artificial",
    category: "engineering",
    displayName: "Inteligencia Artificial",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-inteligencia-artificial.pdf",
  },
  {
    careerId: "computacion",
    category: "engineering",
    displayName: "Ciencias de la Computación",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-computacion.pdf",
  },
  {
    careerId: "mecatronica-robotica-inteligente",
    category: "engineering",
    displayName: "Ingeniería en Mecatrónica y Robótica Inteligente",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-mecatronica.pdf",
  },
  {
    careerId: "ingenieria-negocios",
    category: "engineering",
    displayName: "Ingeniería en Negocios",
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-negocios.pdf",
  },
  {
    careerId: "industrial-sistemas-inteligentes",
    category: "engineering",
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

const OFFICIAL_GRADUATE_PROGRAM_DEFINITIONS = [
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-maestria-ciencia-de-datos.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-maestria-ciencia-de-datos.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-maestria-ciencia-de-datos.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Ciencia de Datos",
    graduateProgramId: "ciencia-de-datos",
    micrositeUrl: "https://mcdatos.itam.mx/es",
    programKind: "master",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-maestria-ciencia-de-riesgo.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-maestria-ciencia-de-riesgo.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-maestria-ciencia-de-riesgo.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Ciencia de Riesgo",
    graduateProgramId: "ciencia-de-riesgo",
    micrositeUrl: "https://mcriesgo.itam.mx/es",
    programKind: "master",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-maestria-ciencias-computacionales-aplicadas.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-maestria-ciencias-computacionales-aplicadas.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-maestria-ciencias-computacionales-aplicadas.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Ciencias Computacionales Aplicadas",
    graduateProgramId: "ciencias-computacionales-aplicadas",
    micrositeUrl: "https://maestriaencomputacion.itam.mx/es",
    programKind: "master",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-maestria-derechos-humanos-y-garantias.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-maestria-derechos-humanos-y-garantias.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-maestria-derechos-humanos-y-garantias.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Derechos Humanos y Garantías",
    graduateProgramId: "derechos-humanos-y-garantias",
    micrositeUrl: "https://mderecho.itam.mx/es",
    programKind: "master",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-maestria-economia-aplicada.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-maestria-economia-aplicada.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-maestria-economia-aplicada.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Economía Aplicada",
    graduateProgramId: "economia-aplicada",
    micrositeUrl: "https://maestriaeconomia.itam.mx/",
    programKind: "master",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-maestria-finanzas.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-maestria-finanzas.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-maestria-finanzas.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Finanzas",
    graduateProgramId: "finanzas",
    micrositeUrl: "https://mef.itam.mx/es",
    programKind: "master",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl: null,
    brochureUrl: "https://posgrados.itam.mx/sites/posgrados.itam.mx/files/folleto-mba.pdf",
    calendarUrl: "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-mba.pdf",
    contactEmails: ["mba@itam.mx"],
    displayName: "MBA",
    graduateProgramId: "mba",
    micrositeUrl: "https://mba.itam.mx/",
    programKind: "mba",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl: null,
    brochureUrl:
      "https://posgrados.itam.mx/sites/posgrados.itam.mx/files/folleto-executive-mba.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-executive-mba.pdf",
    contactEmails: ["executivemba@itam.mx"],
    displayName: "Executive MBA – Maestría en Dirección de Empresas",
    graduateProgramId: "executive-mba-maestria-en-direccion-de-empresas",
    micrositeUrl: "http://www.executivemba.itam.mx/",
    programKind: "mba",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-maestria-teoria-economica.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-maestria-teoria-economica.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-maestria-teoria-economica.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Teoría Económica",
    graduateProgramId: "teoria-economica",
    micrositeUrl: "https://mteoriaeconomica.itam.mx/es",
    programKind: "master",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/all/themes/evolve/documentos/Procedimiento-de-admision-Maestria-en-Politicas-Publicas.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/all/themes/evolve/documentos/Maestria-en-Politicas-Publicas.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/all/themes/evolve/documentos/calendario_politicas_publicas.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Políticas Públicas (en revisión)",
    graduateProgramId: "politicas-publicas",
    micrositeUrl: "https://politicaspublicas.itam.mx/es",
    programKind: "master",
    status: "under-review",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/all/themes/evolve/documentos/Procedimiento-de-admision-Doctorado-en-Economia.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/all/themes/evolve/documentos/folleto_doc_economia.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-doctorado-economia.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Doctorado en Economía",
    graduateProgramId: "doctorado-en-economia",
    micrositeUrl: "https://phdeconomia.itam.mx/es",
    programKind: "doctorate",
    status: "active",
    studyPlanUrl: null,
  },
  {
    admissionProcessUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/proceso-de-admision/proceso-de-admision-especialidad-inteligencia-artificial.pdf",
    brochureUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/folleto/folleto-especialidad-inteligencia-artificial.pdf",
    calendarUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/calendario/calendario-especialidad-inteligencia-artificial.pdf",
    contactEmails: ["posgrados@itam.mx"],
    displayName: "Especialidad en Inteligencia Artificial",
    graduateProgramId: "especialidad-en-inteligencia-artificial",
    micrositeUrl: null,
    programKind: "specialization",
    status: "active",
    studyPlanUrl:
      "https://posgrados.itam.mx/sites/default/files/posgrados/plan-de-estudios/plan-de-estudios-especialidad-inteligencia-artificial.pdf",
  },
] as const satisfies readonly OfficialGraduateProgramDefinition[];

export const OFFICIAL_GRADUATE_PROGRAMS: readonly GraduateProgramReference[] =
  OFFICIAL_GRADUATE_PROGRAM_DEFINITIONS.map((definition) =>
    createGraduateProgramReference(definition),
  );

const OFFICIAL_DOUBLE_DEGREE_DEFINITIONS = [
  {
    baseProgramLabel: "Lic. en Administración",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2021/03/hec_admin.pdf",
    ],
    contactEmails: [],
    degreeLabels: ["Masters in Management"],
    displayName: "Lic. en Administración · HEC",
    doubleDegreeId: "lic-en-administracion-hec",
    eligibilityLabel: null,
    languageRequirement: "Inglés",
    location: "París, Francia",
    notes: ["Esta maestría tiene una duración de dos años."],
    partnerInstitution: "HEC",
  },
  {
    baseProgramLabel: "Lic. en Ciencia Política",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2021/09/essex_cpol3_0.pdf",
    ],
    contactEmails: [],
    degreeLabels: ["Mtía. en Ciencia Política", "Mtía. en Economía Política."],
    displayName: "Lic. en Ciencia Política · Essex University",
    doubleDegreeId: "lic-en-ciencia-politica-essex-university",
    eligibilityLabel: null,
    languageRequirement: "Inglés",
    location: "Reino Unido",
    notes: [],
    partnerInstitution: "Essex University",
  },
  {
    baseProgramLabel: "Lic. en Derecho",
    brochureUrls: ["https://intercambio.itam.mx/sites/default/files/ut_dere.pdf"],
    contactEmails: ["ana.zorrilla@itam.mx"],
    degreeLabels: ["J.D."],
    displayName: "Lic. en Derecho · University of Texas at Austin",
    doubleDegreeId: "lic-en-derecho-university-of-texas-at-austin",
    eligibilityLabel: null,
    languageRequirement: "Inglés",
    location: "Texas, EUA",
    notes: [
      "Este doble grado tiene un proceso de selección particular, para más información contacta a la Departamento Académico de Derecho.",
      "Ana María Zorrilla: ana.zorrilla@itam.mx",
    ],
    partnerInstitution: "University of Texas at Austin",
  },
  {
    baseProgramLabel: "Lic. en Derecho",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/intercambioitammx/aadjuntos/fletcher_dere.pdf",
    ],
    contactEmails: [],
    degreeLabels: ["LL.M. in International Law"],
    displayName: "Lic. en Derecho · Fletcher Graduate School of Global Affairs from Tufts University",
    doubleDegreeId:
      "lic-en-derecho-fletcher-graduate-school-of-global-affairs-from-tufts-university",
    eligibilityLabel: null,
    languageRequirement: "Inglés",
    location: "Boston, EUA",
    notes: [],
    partnerInstitution: "Fletcher Graduate School of Global Affairs from Tufts University",
  },
  {
    baseProgramLabel: "Lic. en Derecho",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/intercambioitammx/aadjuntos/syracuse_derecho.pdf",
    ],
    contactEmails: [],
    degreeLabels: ["LL.M."],
    displayName: "Lic. en Derecho · Syracuse University",
    doubleDegreeId: "lic-en-derecho-syracuse-university",
    eligibilityLabel: null,
    languageRequirement: "Inglés",
    location: "Nueva York, EUA",
    notes: [],
    partnerInstitution: "Syracuse University",
  },
  {
    baseProgramLabel: "Lic. en Derecho",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2021/12/folleto_iedg.pdf",
    ],
    contactEmails: [],
    degreeLabels: ["LL.M."],
    displayName: "Lic. en Derecho · ie Law School",
    doubleDegreeId: "lic-en-derecho-ie-law-school",
    eligibilityLabel: null,
    languageRequirement: "Inglés",
    location: "Madrid, España",
    notes: [],
    partnerInstitution: "ie Law School",
  },
  {
    baseProgramLabel: "Ingenierías y Computación",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2021/10/essex_compu_meca_cd.pdf",
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2022/01/essex_neg_ind.pdf",
    ],
    contactEmails: [],
    degreeLabels: ["Cada programa cuenta con varias opciones (Ver folletos)"],
    displayName: "Ingenierías y Computación · ESSEX University",
    doubleDegreeId: "ingenierias-y-computacion-essex-university",
    eligibilityLabel: "Para ingenierías y ciencia de datos",
    languageRequirement: "Inglés",
    location: "Reino Unido",
    notes: [],
    partnerInstitution: "ESSEX University",
  },
  {
    baseProgramLabel: "Ingenierías y Computación",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2021/07/doble_grado-_institut_mines-teileicom.pdf",
    ],
    contactEmails: [],
    degreeLabels: [
      "MsC in International Management (IM)",
      "MsC ICT Business Management (of Innovation in the Digital Economy)",
    ],
    displayName: "Ingenierías y Computación · Institut Mines-Télécom Business School",
    doubleDegreeId: "ingenierias-y-computacion-institut-mines-telecom-business-school",
    eligibilityLabel: "Para cualquier ingeniería en el ITAM",
    languageRequirement: "Inglés",
    location: "Francia",
    notes: [],
    partnerInstitution: "Institut Mines-Télécom Business School",
  },
  {
    baseProgramLabel: "Lic. en Matemáticas Aplicadas",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2020/11/essex_mat.pdf",
    ],
    contactEmails: [],
    degreeLabels: [
      "MSc Mathematics and Finance",
      "MSc Statistics and Operational Research",
      "Msc Mathematics",
      "Msc Statisctics",
      "Msc Actuarial Science",
    ],
    displayName: "Lic. en Matemáticas Aplicadas · Essex University",
    doubleDegreeId: "lic-en-matematicas-aplicadas-essex-university",
    eligibilityLabel: null,
    languageRequirement: "Inglés",
    location: "Reino Unido",
    notes: [],
    partnerInstitution: "Essex University",
  },
  {
    baseProgramLabel: "Lic. en Relaciones Internacionales",
    brochureUrls: [
      "https://intercambio.itam.mx/sites/default/files/sites/default/files/aadjuntos/2020/11/240419_doble-grado_sciencepo_brochure_final_a_imprimir.pdf",
    ],
    contactEmails: [],
    degreeLabels: ["Diploma d´Etudes Politiques, equivalente a una maestría en Europa."],
    displayName: "Lic. en Relaciones Internacionales · SciencesPo",
    doubleDegreeId: "lic-en-relaciones-internacionales-sciencespo",
    eligibilityLabel: null,
    languageRequirement: "Francés y/o inglés (depende de los cursos que elijas).",
    location: "París, Francia",
    notes: [],
    partnerInstitution: "SciencesPo",
  },
] as const satisfies readonly OfficialDoubleDegreeDefinition[];

export const OFFICIAL_DOUBLE_DEGREES: readonly DoubleDegreeReference[] =
  OFFICIAL_DOUBLE_DEGREE_DEFINITIONS.map((definition) =>
    createDoubleDegreeReference(definition),
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

export function findOfficialGraduateProgram(graduateProgramId: string) {
  return (
    OFFICIAL_GRADUATE_PROGRAMS.find(
      (program) => program.graduate_program_id === graduateProgramId,
    ) ?? null
  );
}

export function extractOfficialGraduateProgramsFromHtml(
  html: string,
): GraduateProgramReference[] {
  const matches = [
    ...html.matchAll(
      /<h3 class="box-title">\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h3>[\s\S]*?<div class="box-content">([\s\S]*?)<\/div>/giu,
    ),
  ];
  const programs = new Map<string, GraduateProgramReference>();

  for (const match of matches) {
    const titleHref = match[1] ?? "";
    const displayName = decodeHtmlText(match[2] ?? "");
    const content = match[3] ?? "";
    const graduateProgramId = buildGraduateProgramId(displayName);

    if (!displayName || programs.has(graduateProgramId)) {
      continue;
    }

    const extractedLinks = extractAnchorsFromHtmlFragment(content);
    const contactEmails = dedupeStrings(
      extractedLinks
        .filter((link) => link.href.startsWith("mailto:"))
        .map((link) => link.href.replace(/^mailto:/iu, "").toLocaleLowerCase("en-US")),
    );
    const brochureUrl =
      extractedLinks.find(
        (link) =>
          isPdfLikeUrl(link.href) &&
          (link.label.toLocaleLowerCase("es-MX").includes("folleto") ||
            link.href.includes("/folleto/")),
      )?.href ?? null;
    const calendarUrl =
      extractedLinks.find(
        (link) =>
          isPdfLikeUrl(link.href) &&
          (link.label.toLocaleLowerCase("es-MX").includes("calendario") ||
            link.href.includes("/calendario/")),
      )?.href ?? null;
    const studyPlanUrl =
      extractedLinks.find((link) => link.href.includes("/plan-de-estudios/"))?.href ?? null;
    const admissionProcessUrl =
      extractedLinks.find(
        (link) =>
          link.href.includes("/proceso-de-admision/") ||
          normalizeAcademicTitle(link.label).includes("proceso de admision"),
      )?.href ?? null;
    const micrositeUrl = isPdfLikeUrl(titleHref)
      ? extractedLinks.find(
          (link) =>
            !link.href.startsWith("mailto:") &&
            !isPdfLikeUrl(link.href) &&
            normalizeAcademicTitle(link.label).includes("micrositio"),
        )?.href ?? null
      : titleHref;

    programs.set(graduateProgramId, {
      admission_process_url: admissionProcessUrl,
      brochure_url: brochureUrl,
      calendar_url: calendarUrl,
      contact_emails: contactEmails,
      display_name: displayName,
      graduate_program_id: graduateProgramId,
      microsite_url: micrositeUrl,
      program_kind: classifyGraduateProgramKind(displayName),
      source_url: OFFICIAL_GRADUATE_PROGRAMS_SOURCE_URL,
      status: /en revisión/iu.test(displayName) ? "under-review" : "active",
      study_plan_url: studyPlanUrl,
    });
  }

  return [...programs.values()];
}

export function findOfficialDoubleDegree(doubleDegreeId: string) {
  return (
    OFFICIAL_DOUBLE_DEGREES.find((program) => program.double_degree_id === doubleDegreeId) ??
    null
  );
}

export function extractOfficialDoubleDegreesFromHtml(html: string): DoubleDegreeReference[] {
  const uncommentedHtml = html.replace(/<!--[\s\S]*?-->/gu, "");
  const sections = [
    ...uncommentedHtml.matchAll(
      /<dt>[\s\S]*?<span[^>]*>([^<]+)<\/span>[\s\S]*?<\/dt>\s*<dd>([\s\S]*?)(?=<dt>|<\/dl>)/giu,
    ),
  ];
  const references: DoubleDegreeReference[] = [];

  for (const sectionMatch of sections) {
    const baseProgramLabel = decodeHtmlText(sectionMatch[1] ?? "");
    const sectionBody = sectionMatch[2] ?? "";
    const tables = [...sectionBody.matchAll(/<table[\s\S]*?<\/table>/giu)];

    for (const tableMatch of tables) {
      const tableHtml = tableMatch[0] ?? "";
      const lines = decodeHtmlText(tableHtml)
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean);
      const anchors = extractAnchorsFromHtmlFragment(tableHtml);
      const brochureUrls = anchors
        .filter((anchor) => !anchor.href.startsWith("mailto:"))
        .map((anchor) => anchor.href);
      const contactEmails = dedupeStrings(
        anchors
          .filter((anchor) => anchor.href.startsWith("mailto:"))
          .map((anchor) => anchor.href.replace(/^mailto:/iu, "").toLocaleLowerCase("en-US")),
      );
      const {
        degreeLabels,
        eligibilityLabel,
        languageRequirement,
        location,
        notes,
        partnerInstitution,
      } = extractDoubleDegreeTableDetails(lines);

      references.push({
        base_program_label: baseProgramLabel,
        brochure_urls: brochureUrls,
        contact_emails: contactEmails,
        degree_labels: degreeLabels,
        display_name: `${baseProgramLabel} · ${partnerInstitution ?? "Programa internacional"}`,
        double_degree_id: buildDoubleDegreeId(baseProgramLabel, partnerInstitution),
        eligibility_label: eligibilityLabel,
        language_requirement: languageRequirement,
        location,
        notes,
        partner_institution: partnerInstitution,
        source_url: OFFICIAL_DOUBLE_DEGREES_SOURCE_URL,
      });
    }
  }

  return references;
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

function createGraduateProgramReference(
  definition: OfficialGraduateProgramDefinition,
): GraduateProgramReference {
  return {
    admission_process_url: definition.admissionProcessUrl,
    brochure_url: definition.brochureUrl,
    calendar_url: definition.calendarUrl,
    contact_emails: [...dedupeStrings(definition.contactEmails)],
    display_name: definition.displayName,
    graduate_program_id: definition.graduateProgramId,
    microsite_url: definition.micrositeUrl,
    program_kind: definition.programKind,
    source_url: OFFICIAL_GRADUATE_PROGRAMS_SOURCE_URL,
    status: definition.status,
    study_plan_url: definition.studyPlanUrl,
  };
}

function createDoubleDegreeReference(
  definition: OfficialDoubleDegreeDefinition,
): DoubleDegreeReference {
  return {
    base_program_label: definition.baseProgramLabel,
    brochure_urls: [...dedupeStrings(definition.brochureUrls)],
    contact_emails: [...dedupeStrings(definition.contactEmails)],
    degree_labels: [...dedupeStrings(definition.degreeLabels)],
    display_name: definition.displayName,
    double_degree_id: definition.doubleDegreeId,
    eligibility_label: definition.eligibilityLabel,
    language_requirement: definition.languageRequirement,
    location: definition.location,
    notes: [...dedupeStrings(definition.notes)],
    partner_institution: definition.partnerInstitution,
    source_url: OFFICIAL_DOUBLE_DEGREES_SOURCE_URL,
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

function extractAnchorsFromHtmlFragment(fragment: string) {
  return [...fragment.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/giu)].map(
    (match) => ({
      href: match[1] ?? "",
      label: decodeHtmlText(match[2] ?? ""),
    }),
  );
}

function extractDoubleDegreeTableDetails(lines: string[]) {
  let eligibilityLabel: string | null = null;
  let partnerInstitution: string | null = null;
  let location: string | null = null;
  let languageRequirement: string | null = null;
  const degreeLabels: string[] = [];
  const notes: string[] = [];
  let captureDegrees = false;

  for (const line of lines) {
    if (line.startsWith("» Grado:") || line.startsWith("» Grados elegibles:")) {
      captureDegrees = true;
      const inlineValue = line.replace(/^» Grado(s elegibles)?:/u, "").trim();
      if (inlineValue) {
        degreeLabels.push(inlineValue);
      }
      continue;
    }

    if (line.startsWith("» Universidad:")) {
      captureDegrees = false;
      partnerInstitution = line.replace(/^» Universidad:/u, "").trim() || null;
      continue;
    }

    if (line.startsWith("» Ubicación:")) {
      captureDegrees = false;
      location = line.replace(/^» Ubicación:/u, "").trim() || null;
      continue;
    }

    if (line.startsWith("» Idioma requerido:")) {
      captureDegrees = false;
      languageRequirement = line.replace(/^» Idioma requerido:/u, "").trim() || null;
      continue;
    }

    if (line.startsWith("Nota:")) {
      captureDegrees = false;
      notes.push(line.replace(/^Nota:/u, "").trim());
      continue;
    }

    if (
      line === "Ver el folleto" ||
      line === "Ver Folleto" ||
      line.toLocaleLowerCase("es-MX").startsWith("folleto ")
    ) {
      captureDegrees = false;
      continue;
    }

    if (/^[^:]+:\s*[^@\s]+@[^@\s]+/u.test(line)) {
      captureDegrees = false;
      notes.push(line);
      continue;
    }

    if (captureDegrees) {
      degreeLabels.push(line);
      continue;
    }

    if (!line.startsWith("»") && eligibilityLabel === null) {
      eligibilityLabel = line;
      continue;
    }

    notes.push(line);
  }

  return {
    degreeLabels: dedupeStrings(degreeLabels),
    eligibilityLabel,
    languageRequirement,
    location,
    notes: dedupeStrings(notes),
    partnerInstitution,
  };
}

function buildGraduateProgramId(displayName: string) {
  return slugifyAcademicReference(displayName.replace(/\(.*?\)/gu, "").trim());
}

function buildDoubleDegreeId(baseProgramLabel: string, partnerInstitution: string | null) {
  return partnerInstitution
    ? `${slugifyAcademicReference(baseProgramLabel)}-${slugifyAcademicReference(partnerInstitution)}`
    : slugifyAcademicReference(baseProgramLabel);
}

function classifyGraduateProgramKind(displayName: string): GraduateProgramReference["program_kind"] {
  if (displayName.startsWith("Doctorado")) {
    return "doctorate";
  }

  if (displayName.startsWith("Especialidad")) {
    return "specialization";
  }

  if (displayName.includes("MBA")) {
    return "mba";
  }

  return "master";
}

function isPdfLikeUrl(value: string) {
  return /\.pdf(?:$|\?)/iu.test(value);
}

function decodeHtmlText(value: string) {
  return value
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/<\/(div|p|li|td|tr)>/giu, "\n")
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

function slugifyAcademicReference(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}
