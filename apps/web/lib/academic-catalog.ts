import type { AcademicCareerReference } from "@/lib/types";

export interface OfficialCareerStudyPlanFallback {
  semesters: Readonly<Record<number, readonly string[]>>;
  sourceUrl: string;
}

export interface AcademicCareerDefinition {
  careerId: string;
  category: AcademicCareerReference["category"];
  displayName: string;
  matchAliases: readonly string[];
  studyPlanFallback: OfficialCareerStudyPlanFallback | null;
  studyPlanUrl: string | null;
}

const ACADEMIC_CAREER_DEFINITION_LIST = [
  {
    careerId: "actuaria",
    category: "degree",
    displayName: "Actuaría",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-actuaria.pdf",
  },
  {
    careerId: "administracion-negocios",
    category: "degree",
    displayName: "Administración de Negocios",
    matchAliases: ["administracion", "administracion de negocios", "administracion en negocios"],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-administracion.pdf",
  },
  {
    careerId: "ciencia-datos",
    category: "degree",
    displayName: "Ciencia de Datos",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-de-datos.pdf",
  },
  {
    careerId: "ciencia-politica",
    category: "degree",
    displayName: "Ciencia Política",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-ciencia-politica.pdf",
  },
  {
    careerId: "contaduria-analitica-finanzas-corporativas",
    category: "degree",
    displayName: "Contaduría Analítica y Finanzas Corporativas",
    matchAliases: [
      "contaduria analitica y finanzas corporativas",
      "contaduria publica",
      "contaduria publica y estrategia financiera",
      "contaduria publica estrategia financiera",
    ],
    studyPlanFallback: null,
    studyPlanUrl: null,
  },
  {
    careerId: "derecho",
    category: "degree",
    displayName: "Derecho",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-derecho.pdf",
  },
  {
    careerId: "direccion-mercadotecnia",
    category: "degree",
    displayName: "Dirección de Mercadotecnia",
    matchAliases: ["mercadotecnia", "direccion de mercadotecnia"],
    studyPlanFallback: null,
    studyPlanUrl: null,
  },
  {
    careerId: "direccion-financiera",
    category: "degree",
    displayName: "Dirección Financiera",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-direccion-financiera.pdf",
  },
  {
    careerId: "economia",
    category: "degree",
    displayName: "Economía",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-economia.pdf",
  },
  {
    careerId: "matematicas-aplicadas",
    category: "degree",
    displayName: "Matemáticas Aplicadas",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-matematicas-aplicadas.pdf",
  },
  {
    careerId: "relaciones-internacionales",
    category: "degree",
    displayName: "Relaciones Internacionales",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-licenciatura-relaciones-internacionales.pdf",
  },
  {
    careerId: "inteligencia-artificial",
    category: "engineering",
    displayName: "Inteligencia Artificial",
    matchAliases: ["inteligencia artificial", "ingenieria en inteligencia artificial"],
    studyPlanFallback: {
      semesters: {
        1: [
          "Razonamiento Algorítmico",
          "Pensamiento Matemático",
          "Cálculo Univariado",
          "Geometría Vectorial",
          "Problemas de la Civilización Contemporánea I",
          "Estrategias de Comunicación Escrita",
        ],
        2: [
          "Estática, Electricidad y Magnetismo",
          "Matemáticas Discretas",
          "Cálculo Multivariado",
          "Álgebra Lineal I",
          "Gestión de Datos",
          "Problemas de la Civilización Contemporánea II",
        ],
        3: [
          "Fundamentos de Contabilidad Financiera",
          "Algoritmos y Estructuras de Datos",
          "Bases de Datos",
          "Cálculo de Probabilidades I",
          "Principios de Microeconomía",
          "Ideas e Instituciones Políticas y Sociales I",
          "Seminario de Comunicación Escrita",
        ],
        4: [
          "Organización y Arquitectura de Computadoras",
          "Introducción a la Inteligencia Artificial",
          "Análisis de Algoritmos y Complejidad Computacional",
          "Cálculo de Probabilidades II",
          "Principios de Macroeconomía",
          "Ideas e Instituciones Políticas y Sociales II",
          "Comunicación Escrita para Ingeniería en Inteligencia Artificial",
        ],
        5: [
          "Sistemas Operativos y Programación de Sistemas",
          "Modelado de Redes Inteligentes",
          "Modelos Gráficos Probabilísticos",
          "Estadística Matemática",
          "Ideas e Instituciones Políticas y Sociales III",
          "Optativa",
        ],
        6: [
          "Minería y Análisis de Datos",
          "Aprendizaje de Máquina",
          "Algoritmos y Sistemas Bioinspirados",
          "Métodos Lineales",
          "Historia Socio-Política de México",
          "Comunicación Profesional para Ingeniería en Inteligencia Artificial",
          "Optativa",
        ],
        7: [
          "Cómputo Paralelo",
          "Aprendizaje de Máquina Avanzado",
          "Aprendizaje por Refuerzo",
          "Series de Tiempo y Aprendizaje de Máquina",
          "Problemas de la Realidad Mexicana Contemporánea",
          "Optativa",
        ],
        8: [
          "Inteligencia Artificial Segura",
          "Visión por Computadora",
          "Procesamiento de Lenguaje Natural",
          "Robots Autónomos",
          "Emprendimiento",
          "Optativa",
          "Optativa",
        ],
      },
      sourceUrl:
        "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-inteligencia-artificial.pdf",
    },
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-inteligencia-artificial.pdf",
  },
  {
    careerId: "computacion",
    category: "engineering",
    displayName: "Ciencias de la Computación",
    matchAliases: [
      "computacion",
      "ciencias de la computacion",
      "ingenieria en computacion",
      "ingenieria y ciencias de la computacion",
    ],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-computacion.pdf",
  },
  {
    careerId: "mecatronica-robotica-inteligente",
    category: "engineering",
    displayName: "Mecatrónica y Robótica Inteligente",
    matchAliases: [
      "ingenieria en mecatronica",
      "ingenieria en mecatronica y robotica inteligente",
      "mecatronica y robotica inteligente",
    ],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-mecatronica.pdf",
  },
  {
    careerId: "ingenieria-negocios",
    category: "engineering",
    displayName: "Negocios",
    matchAliases: [],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-negocios.pdf",
  },
  {
    careerId: "industrial-sistemas-inteligentes",
    category: "engineering",
    displayName: "Industrial y Sistemas Inteligentes",
    matchAliases: [
      "ingenieria industrial",
      "ingenieria industrial y sistemas inteligentes",
      "ingenieria industrial y en sistemas inteligentes",
      "industrial y sistemas inteligentes",
      "industrial y en sistemas inteligentes",
    ],
    studyPlanFallback: null,
    studyPlanUrl:
      "https://carreras.itam.mx/wp-content/uploads/licenciaturas/plan-de-estudios/plan-de-estudios-ingenieria-industrial.pdf",
  },
] as const satisfies readonly AcademicCareerDefinition[];

export const ACADEMIC_CAREER_DEFINITIONS = ACADEMIC_CAREER_DEFINITION_LIST;

export function findAcademicCareerDefinition(careerId: string) {
  return ACADEMIC_CAREER_DEFINITIONS.find((definition) => definition.careerId === careerId) ?? null;
}

export function getAcademicCareerMatchAliases(careerId: string) {
  return [...(findAcademicCareerDefinition(careerId)?.matchAliases ?? [])];
}

export function getAcademicCareerStudyPlanFallback(careerId: string) {
  return findAcademicCareerDefinition(careerId)?.studyPlanFallback ?? null;
}
