interface OfficialCareerStudyPlanFallback {
  semesters: Record<number, string[]>;
  sourceUrl: string;
}

const OFFICIAL_CAREER_STUDY_PLAN_FALLBACKS: Record<string, OfficialCareerStudyPlanFallback> = {
  "inteligencia-artificial": {
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
};

export function hasOfficialCareerStudyPlanFallback(careerId: string) {
  return careerId in OFFICIAL_CAREER_STUDY_PLAN_FALLBACKS;
}

export function getOfficialCareerStudyPlanSemesterTitles(
  careerId: string,
  semesterOrder: number,
) {
  return [...(OFFICIAL_CAREER_STUDY_PLAN_FALLBACKS[careerId]?.semesters[semesterOrder] ?? [])];
}

export function getOfficialCareerStudyPlanFallbackSourceUrl(careerId: string) {
  return OFFICIAL_CAREER_STUDY_PLAN_FALLBACKS[careerId]?.sourceUrl ?? null;
}
