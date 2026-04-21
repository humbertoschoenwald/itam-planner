import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  PlannerOnboardingWizard,
  getPlannerSetupDelayMs,
} from "@/components/planner-onboarding-wizard";
import type { BulletinDocument, BulletinSummary, SchedulePeriodSummary } from "@/lib/types";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import {
  DEFAULT_PLANNER_UI_STATE,
  PLANNER_WIDGET_IDS,
  usePlannerUiStore,
} from "@/stores/planner-ui-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const pushSpy = vi.fn();
const fetchSchedulePeriodDetailMock = vi.fn();
let mockedPhoneViewport = true;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushSpy,
    replace: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  fetchSchedulePeriodDetail: (...args: unknown[]) => fetchSchedulePeriodDetailMock(...args),
}));

vi.mock("@/lib/use-phone-viewport", () => ({
  usePhoneViewport: () => mockedPhoneViewport,
}));

const samplePlans: BulletinSummary[] = [
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:act-g",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "G",
    plan_id: "plan:act-g",
    program_title: "LICENCIATURA EN ACTUARÍA",
    source_code: "ACT-G",
    title: "LICENCIATURA EN ACTUARÍA Plan G",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:econ-f",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "F",
    plan_id: "plan:econ-f",
    program_title: "LICENCIATURA EN ECONOMÍA",
    source_code: "ECO-F",
    title: "LICENCIATURA EN ECONOMÍA Plan F",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:comp-a",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "A",
    plan_id: "plan:comp-a",
    program_title: "INGENIERÍA Y CIENCIAS DE LA COMPUTACIÓN",
    source_code: "ICC-A",
    title: "INGENIERÍA Y CIENCIAS DE LA COMPUTACIÓN Plan A",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    application_term: "PRIMAVERA 2026",
    application_year: 2026,
    bulletin_id: "bulletin:cd-ia",
    entry_from_term: "PRIMAVERA 2021",
    entry_to_term: "OTOÑO 2026",
    plan_code: "JP",
    plan_id: "plan:cd-ia",
    program_title: "PLAN CONJUNTO DE CIENCIA DE DATOS E INTELIGENCIA ARTIFICIAL",
    source_code: "CD-IA",
    title: "PLAN CONJUNTO DE CIENCIA DE DATOS E INTELIGENCIA ARTIFICIAL",
  },
];

const sampleBulletinDocuments: BulletinDocument[] = [
  {
    ...samplePlans[0],
    requirements: [
      {
        course_code: "ACT-12002",
        credits: 6,
        display_title: "Cálculo de Probabilidades I",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:act-12002",
        semester_label: "2",
        semester_order: 2,
        sort_order: 1,
      },
    ],
  },
  {
    ...samplePlans[1],
    requirements: [
      {
        course_code: "ECO-12002",
        credits: 6,
        display_title: "Principios de Microeconomía",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:eco-12002",
        semester_label: "2",
        semester_order: 2,
        sort_order: 1,
      },
    ],
  },
  {
    ...samplePlans[3],
    requirements: [
      {
        course_code: "DAT-12010",
        credits: 6,
        display_title: "Modelado de Datos",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:dat-12010",
        semester_label: "2",
        semester_order: 2,
        sort_order: 1,
      },
    ],
  },
  {
    ...samplePlans[0],
    bulletin_id: "bulletin:ai-reference",
    plan_id: "plan:ai-reference",
    program_title: "LICENCIATURA EN ACTUARÍA",
    requirements: [
      {
        course_code: "COM-16306",
        credits: 6,
        display_title: "Razonamiento Algorítmico",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:ai-1",
        semester_label: "1",
        semester_order: 1,
        sort_order: 1,
      },
      {
        course_code: "MAT-14280",
        credits: 6,
        display_title: "Pensamiento Matemático",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:ai-2",
        semester_label: "1",
        semester_order: 1,
        sort_order: 2,
      },
      {
        course_code: "MAT-12200",
        credits: 6,
        display_title: "Cálculo Univariado",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:ai-3",
        semester_label: "1",
        semester_order: 1,
        sort_order: 3,
      },
      {
        course_code: "MAT-14250",
        credits: 6,
        display_title: "Geometría Vectorial",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:ai-4",
        semester_label: "1",
        semester_order: 1,
        sort_order: 4,
      },
      {
        course_code: "EGN-17141",
        credits: 6,
        display_title: "Problemas de la Civilización Contemporánea I",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:ai-5",
        semester_label: "1",
        semester_order: 1,
        sort_order: 5,
      },
      {
        course_code: "LEN-12701",
        credits: 6,
        display_title: "Estrategias de Comunicación Escrita",
        prerequisite_references: [],
        raw_prerequisite_text: null,
        requirement_id: "req:ai-6",
        semester_label: "1",
        semester_order: 1,
        sort_order: 6,
      },
    ],
    source_code: "AI-REF",
    title: "Referencia académica IA",
  },
];

const samplePeriods: SchedulePeriodSummary[] = [
  {
    active_from: "2026-01-01",
    active_to: "2026-05-31",
    label: "(PRIMAVERA 2026 LICENCIATURA)",
    level: "LICENCIATURA",
    period_id: "2938",
    term: "PRIMAVERA",
    year: 2026,
  },
  {
    active_from: "2026-04-01",
    active_to: "2026-06-30",
    label: "(ABRIL-JUNIO 2026 MAESTRIA)",
    level: "MAESTRIA",
    period_id: "2975",
    term: "PRIMAVERA",
    year: 2026,
  },
];

describe("PlannerOnboardingWizard", () => {
  beforeEach(() => {
    pushSpy.mockReset();
    fetchSchedulePeriodDetailMock.mockReset();
    vi.useRealTimers();
    vi.restoreAllMocks();
    mockedPhoneViewport = true;
    window.localStorage.clear();
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerStore.setState({ state: DEFAULT_PLANNER_STATE });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
    fetchSchedulePeriodDetailMock.mockResolvedValue({
      active_from: "2026-01-01",
      active_to: "2026-05-31",
      label: "PRIMAVERA 2026 LICENCIATURA",
      level: "LICENCIATURA",
      offerings: [
        {
          campus_name: "RIO HONDO",
          course_code: "ACT-12002",
          credits: 6,
          crn: "12002",
          display_title: "CALCULO DE PROBABILIDADES I",
          group_code: "001",
          instructor_name: "DOCENTE ACT",
          meetings: [
            {
              campus_name: "RIO HONDO",
              end_time: "09:00:00",
              room_code: "RH101",
              start_time: "07:30:00",
              weekday_code: "LU",
            },
          ],
          offering_id: "2938:ACT-12002:001",
          period_id: "2938",
          raw_comments: null,
          room_code: "RH101",
          section_type: "T",
        },
        {
          campus_name: "RIO HONDO",
          course_code: "ECO-12002",
          credits: 6,
          crn: "22002",
          display_title: "PRINCIPIOS DE MICROECONOMIA",
          group_code: "001",
          instructor_name: "DOCENTE ECO",
          meetings: [
            {
              campus_name: "RIO HONDO",
              end_time: "11:30:00",
              room_code: "RH102",
              start_time: "10:00:00",
              weekday_code: "MA",
            },
          ],
          offering_id: "2938:ECO-12002:001",
          period_id: "2938",
          raw_comments: null,
          room_code: "RH102",
          section_type: "T",
        },
        {
          campus_name: "RIO HONDO",
          course_code: "DAT-12010",
          credits: 6,
          crn: "32010",
          display_title: "MODELADO DE DATOS",
          group_code: "001",
          instructor_name: "DOCENTE DAT",
          meetings: [
            {
              campus_name: "RIO HONDO",
              end_time: "13:00:00",
              room_code: "RH103",
              start_time: "11:30:00",
              weekday_code: "MI",
            },
          ],
          offering_id: "2938:DAT-12010:001",
          period_id: "2938",
          raw_comments: null,
          room_code: "RH103",
          section_type: "T",
        },
      ],
      period_id: "2938",
      subjects: [],
      term: "PRIMAVERA",
      year: 2026,
    });
  });

  it("starts at the intro step and blocks progress until the academic level is chosen", async () => {
    renderWizard();
    await flushAsyncState();

    expect(screen.getByText(/Vamos a configurar el horario una sola vez/u)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Busca tu carrera/u)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    await flushAsyncState();

    expect(screen.getByText(/¿En qué nivel académico estás\?/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    await flushAsyncState();

    expect(screen.getByText(/Todavía falta un paso obligatorio/u)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Busca tu carrera/u)).not.toBeInTheDocument();
  });

  it("skips the swipe step outside phone layouts and lands on finish after classes", async () => {
    mockedPhoneViewport = false;
    renderWizard();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Licenciatura \/ ingeniería/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Otoño/u }));
    fireEvent.change(screen.getByRole("combobox", { name: /Año de ingreso/u }), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    expect(screen.getByText(/¿En qué idioma quieres usar el producto\?/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: "Economía" }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(usePlannerStore.getState().state.selectedSubjectCodes).toEqual(["ECO-12002"]);

    expect(screen.getByText(/¿Con qué materias debe arrancar el horario\?/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(fetchSchedulePeriodDetailMock).toHaveBeenCalledWith("2938");

    expect(screen.getByText(/¿Qué clases públicas deben quedarse en tu horario\?/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ECO-12002 · Grupo 001/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/Ya puedes crear tu horario/u)).toBeInTheDocument();
    expect(
      screen.queryByText(/¿Cómo quieres que se sienta el deslizamiento\?/u),
    ).not.toBeInTheDocument();
  });

  it("infers default subjects for Inteligencia Artificial from the official study-plan fallback", async () => {
    renderWizard();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Licenciatura \/ ingeniería/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Primavera/u }));
    fireEvent.change(screen.getByRole("combobox", { name: /Año de ingreso/u }), {
      target: { value: "2026" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.change(screen.getByRole("searchbox", { name: /Busca tu carrera/u }), {
      target: { value: "inteligencia" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Inteligencia Artificial" }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(usePlannerStore.getState().state.selectedSubjectCodes).toEqual([
      "COM-16306",
      "EGN-17141",
      "LEN-12701",
      "MAT-12200",
      "MAT-14250",
      "MAT-14280",
    ]);

    expect(screen.getByText(/Selección actual de materias/u)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /COM-16306/u })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /MAT-14280/u })).toHaveLength(1);
  });

  it("shows all official careers, filters them, marks selections visually, and finishes with a bounded delay", async () => {
    renderWizard();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Licenciatura \/ ingeniería/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByRole("button", { name: /Primavera/u })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    fireEvent.click(screen.getByRole("button", { name: /Otoño/u }));

    expect(screen.getByRole("button", { name: /Otoño/u })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.change(screen.getByRole("combobox", { name: /Año de ingreso/u }), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    expect(screen.getByText(/¿En qué idioma quieres usar el producto\?/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Español \(MX\)/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/¿Qué carrera estudias\?/u)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Actuaría" })).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Ciencias de la Computación" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inteligencia Artificial" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: /Busca tu carrera/u }), {
      target: { value: "inge" },
    });

    expect(
      screen.getByRole("button", { name: "Ciencias de la Computación" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Economía" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: /Busca tu carrera/u }), {
      target: { value: "eco" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Economía" }));

    expect(screen.getByRole("button", { name: "Economía" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(usePlannerStore.getState().state.selectedSubjectCodes).toEqual(["ECO-12002"]);

    expect(screen.getByText(/Selección actual de materias/u)).toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /ECO-12002/u })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(fetchSchedulePeriodDetailMock).toHaveBeenCalledWith("2938");

    expect(screen.getByText(/¿Qué clases públicas deben quedarse en tu horario\?/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ECO-12002 · Grupo 001/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(
      screen.getByText(/¿Cómo quieres que se sienta el deslizamiento\?/u),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Movimiento natural/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.getByText(/Perfecto, configuraste tu horario\./u)).toBeInTheDocument();
    expect(screen.getByText("Licenciatura / ingeniería")).toBeInTheDocument();
    expect(screen.getByText("Otoño 2025")).toBeInTheDocument();
    expect(screen.getByText("Español (MX)")).toBeInTheDocument();
    expect(screen.getByText("Economía")).toBeInTheDocument();

    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    fireEvent.click(screen.getByRole("button", { name: /Finalizar e ir al horario/u }));

    expect(usePlannerUiStore.getState().state.plannerWidgetIds).toEqual([...PLANNER_WIDGET_IDS]);
    expect(usePlannerUiStore.getState().state.hasCompletedSetupAnimation).toBe(true);
    expect(usePlannerStore.getState().state.selectedPeriodId).toBe("2938");
    expect(useStudentProfileStore.getState().profile.activePlanIds).toEqual(["plan:econ-f"]);
    expect(screen.getByText(/Preparando tu horario/u)).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(getPlannerSetupDelayMs(0));
    });

    expect(pushSpy).toHaveBeenCalledWith("/planner");
  });

  it("supports the dedicated joint-program mode without requiring a base career", async () => {
    renderWizard();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Planes conjuntos/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Otoño/u }));
    fireEvent.change(screen.getByRole("combobox", { name: /Año de ingreso/u }), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    expect(screen.getByText(/¿En qué idioma quieres usar el producto\?/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Español \(MX\)/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(screen.queryByText(/¿Qué carrera estudias\?/u)).not.toBeInTheDocument();
    expect(screen.getByText(/¿Qué planes conjuntos te aplican\?/u)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Ciencia de Datos + Inteligencia Artificial",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(useStudentProfileStore.getState().profile.activePlanIds).toEqual(["plan:cd-ia"]);
    expect(usePlannerStore.getState().state.selectedSubjectCodes).toEqual(["DAT-12010"]);

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(fetchSchedulePeriodDetailMock).toHaveBeenCalledWith("2938");

    expect(screen.getByText(/¿Qué clases públicas deben quedarse en tu horario\?/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /DAT-12010 · Grupo 001/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
  });

  it("blocks progress on the classes step until a public class is selected", async () => {
    renderWizard();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Licenciatura \/ ingeniería/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Otoño/u }));
    fireEvent.change(screen.getByRole("combobox", { name: /Año de ingreso/u }), {
      target: { value: "2025" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: /Español \(MX\)/u }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));
    fireEvent.click(screen.getByRole("button", { name: "Actuaría" }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(usePlannerStore.getState().state.selectedSubjectCodes).toEqual(["ACT-12002"]);

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    await flushAsyncState();
    expect(fetchSchedulePeriodDetailMock).toHaveBeenCalledWith("2938");

    expect(screen.getByText(/¿Qué clases públicas deben quedarse en tu horario\?/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/u }));

    expect(
      screen.getByText(/Elige al menos una clase pública antes de continuar/u),
    ).toBeInTheDocument();
  });
});

function renderWizard() {
  return render(
    <PlannerOnboardingWizard
      bulletinDocuments={sampleBulletinDocuments}
      periods={samplePeriods}
      plans={samplePlans}
    />,
  );
}

async function flushAsyncState(iterations: number = 3) {
  await act(async () => {
    for (let index = 0; index < iterations; index += 1) {
      await Promise.resolve();
    }
  });
}
