import type {
  AcademicCareerReference,
  BulletinSummary,
  DoubleDegreeReference,
  GraduateProgramReference,
  JointProgramReference,
} from "@/lib/types";
import {
  ACADEMIC_CAREER_DEFINITIONS,
  getAcademicCareerMatchAliases,
} from "@/lib/academic-catalog";

const OFFICIAL_CAREERS_SOURCE_URL = "https://carreras.itam.mx/carreras/";
const OFFICIAL_JOINT_PROGRAMS_SOURCE_URL = "https://www.itam.mx/es/programas-conjuntos";
const OFFICIAL_GRADUATE_PROGRAMS_SOURCE_URL = "https://posgrados.itam.mx/";
const OFFICIAL_DOUBLE_DEGREES_SOURCE_URL = "https://intercambio.itam.mx/es/dobles-grados";

type OfficialJointProgramDefinition = {
  componentCareerIds: [string, string];
  contactEmails: string[];
  coordinators: string[];
  phoneExtensions: string[];
}

type OfficialGraduateProgramDefinition = {
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

type OfficialDoubleDegreeDefinition = {
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

export type ExtractedOfficialJointProgramRow = {
  contact_emails: string[];
  coordinators: string[];
  component_titles: [string, string];
  phone_extensions: string[];
}

export type ExtractedOfficialGraduateProgramRow = {
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

export type ExtractedOfficialDoubleDegreeRow = {
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

export const OFFICIAL_CAREERS: readonly AcademicCareerReference[] = ACADEMIC_CAREER_DEFINITIONS.map(
  (definition) => ({
    career_id: definition.careerId,
    category: definition.category,
    display_name: definition.displayName,
    source_url: OFFICIAL_CAREERS_SOURCE_URL,
    study_plan_url: definition.studyPlanUrl,
  }),
);

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

export function normalizeAcademicTitle(value: string): string {
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

export function buildJointProgramId(componentCareerIds: readonly string[]): string {
  return componentCareerIds.join("-");
}

export function findOfficialCareer(careerId: string): AcademicCareerReference | null {
  return OFFICIAL_CAREERS.find((career) => career.career_id === careerId) ?? null;
}

export function getOfficialCareerMatchTokens(careerId: string): string[] {
  const career = findOfficialCareer(careerId);
  const aliases = getAcademicCareerMatchAliases(careerId);
  const tokens = career ? [career.display_name, ...aliases] : aliases;

  return [...new Set(tokens.map(normalizeOfficialMatchText).filter(Boolean))];
}

export function findOfficialCareerIdFromSourceLabel(label: string): string | null {
  const normalized = normalizeOfficialMatchText(label);
  const directMatch =
    OFFICIAL_CAREERS.find((career) =>
      getOfficialCareerMatchTokens(career.career_id).some((token) => normalized.includes(token)),
    ) ?? null;

  return directMatch?.career_id ?? null;
}

export function findOfficialJointProgram(jointProgramId: string): JointProgramReference | null {
  return OFFICIAL_JOINT_PROGRAMS.find((program) => program.joint_program_id === jointProgramId) ?? null;
}

export function extractOfficialJointProgramRowsFromHtml(
  html: string,
): ExtractedOfficialJointProgramRow[] {
  const tbody = /<tbody>([\s\S]*?)<\/tbody>/iu.exec(html)?.[1] ?? "";
  const rows = [...tbody.matchAll(/<tr>([\s\S]*?)<\/tr>/giu)];

  return rows
    .map((rowMatch) => extractOfficialJointProgramRowFromHtml(rowMatch[1] ?? ""))
    .filter((row): row is ExtractedOfficialJointProgramRow => row !== null);
}

export function extractOfficialJointProgramsFromHtml(html: string): JointProgramReference[] {
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

export function findOfficialGraduateProgram(graduateProgramId: string): GraduateProgramReference | null {
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
    const program = extractOfficialGraduateProgramFromMatch(match);

    if (program === null || programs.has(program.graduate_program_id)) {
      continue;
    }

    programs.set(program.graduate_program_id, program);
  }

  return [...programs.values()];
}

export function findOfficialDoubleDegree(doubleDegreeId: string): DoubleDegreeReference | null {
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
      const tableHtml = tableMatch[0];
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

export function matchesOfficialCareerProgramTitle(programTitle: string, careerId: string): boolean {
  const normalized = normalizeOfficialMatchText(programTitle);

  return getOfficialCareerMatchTokens(careerId).some((token) => normalized.includes(token));
}

export function classifyProgramTitle(programTitle: string): { isJointProgram: boolean; matchedCareers: AcademicCareerReference[]; normalized: string; officialCareer: AcademicCareerReference | null; } {
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

export function getCanonicalProgramDisplayName(programTitle: string): string {
  const classification = classifyProgramTitle(programTitle);

  if (classification.matchedCareers.length > 1) {
    return classification.matchedCareers.map((career) => career.display_name).join(" + ");
  }

  if (classification.officialCareer) {
    return classification.officialCareer.display_name;
  }

  return formatCanonicalProgramFallback(programTitle);
}

export function isIndividualCareerProgram(programTitle: string): boolean {
  const classification = classifyProgramTitle(programTitle);
  return classification.officialCareer !== null && classification.matchedCareers.length === 1;
}

export function findApplicableJointPlansForEntryTerm(
  plans: BulletinSummary[],
  jointProgramId: string,
): BulletinSummary[] {
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

function extractTextLinesFromHtmlFragment(fragment: string): string[] {
  return dedupeStrings(
    decodeHtmlText(fragment)
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function extractEmailAddressesFromHtmlFragment(fragment: string): string[] {
  return dedupeStrings(
    decodeHtmlText(fragment)
      .match(/[a-z0-9._%+-]+\s*@\s*[a-z0-9.-]+\.[a-z]{2,}/giu)
      ?.map((value) => value.replace(/\s*@\s*/gu, "@").toLocaleLowerCase("en-US")) ?? [],
  );
}

function extractPhoneExtensionsFromHtmlFragment(fragment: string): string[] {
  return dedupeStrings(
    decodeHtmlText(fragment)
      .match(/\b\d{3,5}\b/gu)
      ?.map((value) => value.trim()) ?? [],
  );
}

function extractAnchorsFromHtmlFragment(fragment: string): { href: string; label: string; }[] {
  return [...fragment.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/giu)].map(
    (match) => ({
      href: match[1] ?? "",
      label: decodeHtmlText(match[2] ?? ""),
    }),
  );
}

function extractDoubleDegreeTableDetails(lines: string[]): { degreeLabels: string[]; eligibilityLabel: string | null; languageRequirement: string | null; location: string | null; notes: string[]; partnerInstitution: string | null; } {
  const state = {
    captureDegrees: false,
    degreeLabels: [] as string[],
    eligibilityLabel: null as string | null,
    languageRequirement: null as string | null,
    location: null as string | null,
    notes: [] as string[],
    partnerInstitution: null as string | null,
  };

  for (const line of lines) {
    const extractedField = extractDoubleDegreeField(line);

    if (applyExtractedDoubleDegreeField(extractedField, state)) {
      continue;
    }

    if (isIgnorableDoubleDegreeLine(line)) {
      state.captureDegrees = false;
      continue;
    }

    if (state.captureDegrees) {
      state.degreeLabels.push(line);
      continue;
    }

    if (!line.startsWith("»") && state.eligibilityLabel === null) {
      state.eligibilityLabel = line;
      continue;
    }

    state.notes.push(line);
  }

  return {
    degreeLabels: dedupeStrings(state.degreeLabels),
    eligibilityLabel: state.eligibilityLabel,
    languageRequirement: state.languageRequirement,
    location: state.location,
    notes: dedupeStrings(state.notes),
    partnerInstitution: state.partnerInstitution,
  };
}

function buildGraduateProgramId(displayName: string): string {
  return slugifyAcademicReference(displayName.replace(/\(.*?\)/gu, "").trim());
}

function extractOfficialJointProgramRowFromHtml(
  rowHtml: string,
): ExtractedOfficialJointProgramRow | null {
  const cells = [...rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/giu)].map(
    (cellMatch) => cellMatch[1],
  );

  if (cells.length < 4) {
    return null;
  }

  const componentTitlesCell = cells[0] ?? "";
  const coordinatorsCell = cells[1] ?? "";
  const emailsCell = cells[2] ?? "";
  const extensionsCell = cells[3] ?? "";

  const componentTitles = extractTextLinesFromHtmlFragment(componentTitlesCell);

  if (componentTitles.length < 2) {
    return null;
  }

  return {
    contact_emails: extractEmailAddressesFromHtmlFragment(emailsCell),
    coordinators: extractTextLinesFromHtmlFragment(coordinatorsCell),
    component_titles: buildJointProgramComponentTitles(componentTitles),
    phone_extensions: extractPhoneExtensionsFromHtmlFragment(extensionsCell),
  };
}

function buildJointProgramComponentTitles(componentTitles: string[]): [string, string] {
  return [
    trimTrailingAcademicConnector(componentTitles[0] ?? ""),
    trimTrailingAcademicConnector(componentTitles[1] ?? ""),
  ];
}

function extractOfficialGraduateProgramFromMatch(
  match: RegExpMatchArray,
): GraduateProgramReference | null {
  const titleHref = match[1] ?? "";
  const displayName = decodeHtmlText(match[2] ?? "");
  const content = match[3] ?? "";

  if (!displayName) {
    return null;
  }

  const graduateProgramId = buildGraduateProgramId(displayName);
  const extractedLinks = extractAnchorsFromHtmlFragment(content);

  return {
    admission_process_url: findGraduateProgramAdmissionProcessUrl(extractedLinks),
    brochure_url: findGraduateProgramPdfUrl(extractedLinks, "folleto", "/folleto/"),
    calendar_url: findGraduateProgramPdfUrl(extractedLinks, "calendario", "/calendario/"),
    contact_emails: extractGraduateProgramContactEmails(extractedLinks),
    display_name: displayName,
    graduate_program_id: graduateProgramId,
    microsite_url: resolveGraduateProgramMicrositeUrl(titleHref, extractedLinks),
    program_kind: classifyGraduateProgramKind(displayName),
    source_url: OFFICIAL_GRADUATE_PROGRAMS_SOURCE_URL,
    status: /en revisión/iu.test(displayName) ? "under-review" : "active",
    study_plan_url: findGraduateProgramStudyPlanUrl(extractedLinks),
  };
}

function extractGraduateProgramContactEmails(
  links: { href: string; label: string }[],
): string[] {
  return dedupeStrings(
    links
      .filter((link) => link.href.startsWith("mailto:"))
      .map((link) => link.href.replace(/^mailto:/iu, "").toLocaleLowerCase("en-US")),
  );
}

function findGraduateProgramPdfUrl(
  links: { href: string; label: string }[],
  labelToken: string,
  hrefToken: string,
): string | null {
  return (
    links.find(
      (link) =>
        isPdfLikeUrl(link.href) &&
        (link.label.toLocaleLowerCase("es-MX").includes(labelToken) ||
          link.href.includes(hrefToken)),
    )?.href ?? null
  );
}

function findGraduateProgramStudyPlanUrl(
  links: { href: string; label: string }[],
): string | null {
  return links.find((link) => link.href.includes("/plan-de-estudios/"))?.href ?? null;
}

function findGraduateProgramAdmissionProcessUrl(
  links: { href: string; label: string }[],
): string | null {
  return (
    links.find(
      (link) =>
        link.href.includes("/proceso-de-admision/") ||
        normalizeAcademicTitle(link.label).includes("proceso de admision"),
    )?.href ?? null
  );
}

function resolveGraduateProgramMicrositeUrl(
  titleHref: string,
  links: { href: string; label: string }[],
): string | null {
  if (!isPdfLikeUrl(titleHref)) {
    return titleHref;
  }

  return (
    links.find(
      (link) =>
        !link.href.startsWith("mailto:") &&
        !isPdfLikeUrl(link.href) &&
        normalizeAcademicTitle(link.label).includes("micrositio"),
    )?.href ?? null
  );
}

function extractDoubleDegreeField(line: string): {
  kind:
    | "degreeLabel"
    | "partnerInstitution"
    | "location"
    | "languageRequirement"
    | "note"
    | "other";
  value: string | null;
} {
  const prefixedField = DOUBLE_DEGREE_PREFIX_FIELDS.find(({ matches }) => matches(line));

  if (prefixedField) {
    return {
      kind: prefixedField.kind,
      value: line.replace(prefixedField.pattern, "").trim() || null,
    };
  }

  if (line.startsWith("Nota:") || /^[^:]+:\s*[^@\s]+@[^@\s]+/u.test(line)) {
    return {
      kind: "note",
      value: line.replace(/^Nota:/u, "").trim() || line,
    };
  }

  return {
    kind: "other",
    value: null,
  };
}

function applyExtractedDoubleDegreeField(
  extractedField: ReturnType<typeof extractDoubleDegreeField>,
  state: {
    captureDegrees: boolean;
    degreeLabels: string[];
    languageRequirement: string | null;
    location: string | null;
    notes: string[];
    partnerInstitution: string | null;
  },
): boolean {
  const applyField = DOUBLE_DEGREE_FIELD_APPLIERS[extractedField.kind];

  if (!applyField) {
    return false;
  }

  applyField(extractedField.value, state);
  return true;
}

const DOUBLE_DEGREE_FIELD_APPLIERS: Partial<
  Record<
    ReturnType<typeof extractDoubleDegreeField>["kind"],
    (
      value: string | null,
      state: {
        captureDegrees: boolean;
        degreeLabels: string[];
        languageRequirement: string | null;
        location: string | null;
        notes: string[];
        partnerInstitution: string | null;
      },
    ) => void
  >
> = {
  degreeLabel: (value, state) => {
    state.captureDegrees = true;
    if (value) {
      state.degreeLabels.push(value);
    }
  },
  languageRequirement: (value, state) => {
    state.captureDegrees = false;
    state.languageRequirement = value;
  },
  location: (value, state) => {
    state.captureDegrees = false;
    state.location = value;
  },
  note: (value, state) => {
    state.captureDegrees = false;
    if (value) {
      state.notes.push(value);
    }
  },
  partnerInstitution: (value, state) => {
    state.captureDegrees = false;
    state.partnerInstitution = value;
  },
};

const DOUBLE_DEGREE_PREFIX_FIELDS = [
  {
    kind: "degreeLabel",
    matches: (line: string) => line.startsWith("» Grado:") || line.startsWith("» Grados elegibles:"),
    pattern: /^» Grado(s elegibles)?:/u,
  },
  {
    kind: "partnerInstitution",
    matches: (line: string) => line.startsWith("» Universidad:"),
    pattern: /^» Universidad:/u,
  },
  {
    kind: "location",
    matches: (line: string) => line.startsWith("» Ubicación:"),
    pattern: /^» Ubicación:/u,
  },
  {
    kind: "languageRequirement",
    matches: (line: string) => line.startsWith("» Idioma requerido:"),
    pattern: /^» Idioma requerido:/u,
  },
] as const;

function isIgnorableDoubleDegreeLine(line: string): boolean {
  return (
    line === "Ver el folleto" ||
    line === "Ver Folleto" ||
    line.toLocaleLowerCase("es-MX").startsWith("folleto ")
  );
}

function buildDoubleDegreeId(baseProgramLabel: string, partnerInstitution: string | null): string {
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

function isPdfLikeUrl(value: string): boolean {
  return /\.pdf(?:$|\?)/iu.test(value);
}

function decodeHtmlText(value: string): string {
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

function dedupeStrings(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function normalizeOfficialMatchText(value: string): string {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[():.,]/gu, " ")
    .replace(/\be\b/gu, " y ")
    .replace(/\s+/gu, " ")
    .trim();
}

function trimTrailingAcademicConnector(value: string): string {
  return value.replace(/\s+[ye]$/u, "").trim();
}

function slugifyAcademicReference(value: string): string {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function formatCanonicalProgramFallback(programTitle: string): string {
  const normalized = programTitle
    .trim()
    .replace(/^LICENCIATURA EN /iu, "")
    .replace(/^INGENIER[IÍ]A (Y CIENCIAS DE LA COMPUTACI[OÓ]N|EN )/iu, (_, matched) =>
      matched?.toLocaleUpperCase("es-MX").includes("CIENCIAS") ? "" : "",
    )
    .replace(/^PLAN CONJUNTO (DE(LA)? )?/iu, "")
    .replace(/\s+PLAN [A-Z]+$/u, "")
    .toLocaleLowerCase("es-MX");

  return normalized
    .split(/\s+/u)
    .filter(Boolean)
    .map((word) => {
      if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/u.test(word)) {
        return word.toUpperCase();
      }

      const [firstLetter = "", ...rest] = [...word];
      return `${firstLetter.toLocaleUpperCase("es-MX")}${rest.join("")}`;
    })
    .join(" ");
}
