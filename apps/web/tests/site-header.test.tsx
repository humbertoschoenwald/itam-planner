import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/site-header";
import { DEFAULT_PLANNER_UI_STATE, usePlannerUiStore } from "@/stores/planner-ui-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const pushSpy = vi.fn();
let mockedPathname = "/planner";
let mockedPhoneViewport = false;
let mockedNavigationWidth = 1280;
const DEFAULT_MEASURED_WIDTHS = {
  connectAi: 120,
  overflowMenu: 40,
  project: 92,
  registration: 118,
  search: 40,
  settings: 112,
} as const;
let getBoundingClientRectSpy: ReturnType<typeof vi.spyOn> | null = null;

vi.mock("next/navigation", () => ({
  usePathname: () => mockedPathname,
  useRouter: () => ({
    push: pushSpy,
  }),
}));

vi.mock("@/lib/use-phone-viewport", () => ({
  usePhoneViewport: () => mockedPhoneViewport,
  useViewportBelow: (width: number) => mockedPhoneViewport || window.innerWidth < width,
  useViewportWidth: () => window.innerWidth,
}));

vi.mock("@/lib/use-element-width", () => ({
  useElementWidth: () => ({
    ref: vi.fn(),
    width: mockedNavigationWidth,
  }),
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    pushSpy.mockReset();
    mockedPathname = "/planner";
    mockedPhoneViewport = false;
    mockedNavigationWidth = 1280;
    getBoundingClientRectSpy?.mockRestore();
    getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function getBoundingClientRect(this: HTMLElement): DOMRect {
        const measureId = this.getAttribute("data-measure-id");
        const width =
          measureId === null
            ? 160
            : DEFAULT_MEASURED_WIDTHS[measureId as keyof typeof DEFAULT_MEASURED_WIDTHS];

        return {
          bottom: 40,
          height: 40,
          left: 0,
          right: width,
          toJSON: () => "",
          top: 0,
          width,
          x: 0,
          y: 0,
        } as DOMRect;
      });
    setViewportWidth(1280);
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
  });

  it("renders the primary nav and keeps the secondary actions in the same desktop cluster", () => {
    const { container } = render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Horario" })).toHaveAttribute("href", "/planner");
    expect(screen.getByRole("link", { name: "Calendario" })).toHaveAttribute("href", "/calendar");
    expect(screen.getByRole("link", { name: "Proyecto" })).toHaveAttribute("href", "/project");
    expect(screen.getByRole("link", { name: "Conectar con IA" })).toHaveAttribute("href", "/connect-ai");
    expect(screen.getByRole("link", { name: "Inscripciones" })).toHaveAttribute(
      "href",
      "/registration",
    );
    expect(screen.getByRole("link", { name: "Configuración" })).toHaveAttribute("href", "/settings");
    expect(screen.getByRole("link", { name: "Abrir búsqueda local" })).toHaveAttribute(
      "href",
      "/search",
    );
    expect(
      screen.getByRole("button", { name: "Abrir menú de enlaces oficiales" }),
    ).toBeInTheDocument();
    expect(container.querySelector("header")).toHaveClass("sticky");
  });

  it("does not keep Home marked when a secondary route is active", () => {
    mockedPathname = "/connect-ai";
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveClass("bg-accent");
    expect(screen.getByRole("link", { name: "Conectar con IA" })).toHaveClass("bg-accent");
  });

  it("ignores swipe-like pointer gestures outside phone layouts", () => {
    render(<SiteHeader />);

    const nav = screen.getByRole("link", { name: "Horario" }).closest("nav");
    expect(nav).not.toBeNull();

    fireEvent.pointerDown(nav!, { clientX: 10 });
    fireEvent.pointerUp(nav!, { clientX: 90 });

    expect(pushSpy).not.toHaveBeenCalled();
    expect(usePlannerUiStore.getState().state.navSwipePreference).toBeNull();
  });

  it("stores the first learned swipe preference while moving from planner to home on phone layouts", async () => {
    mockedPhoneViewport = true;
    render(<SiteHeader />);

    const nav = screen.getByRole("link", { name: "Horario" }).closest("nav");
    expect(nav).not.toBeNull();

    fireEvent.pointerDown(nav!, { clientX: 10 });
    fireEvent.pointerUp(nav!, { clientX: 90 });
    await flushAsyncState();
    expect(pushSpy).toHaveBeenCalledWith("/");

    expect(usePlannerUiStore.getState().state.navSwipePreference).toBe("natural");
  });

  it("keeps secondary actions behind the product menu on phone layouts", () => {
    mockedPhoneViewport = true;
    setViewportWidth(390);
    render(<SiteHeader />);

    const nav = screen.getByRole("link", { name: "Horario" }).closest("nav");

    expect(nav).not.toBeNull();
    expect(nav).toHaveAttribute("data-secondary-nav-layout", "overflow");
    expect(screen.getByRole("button", { name: "Abrir menú del producto" })).toBeInTheDocument();
  });

  it("closes the product menu after selecting a primary route on the current page", async () => {
    mockedPathname = "/";
    mockedPhoneViewport = true;
    setViewportWidth(390);
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú del producto" }));
    expect(screen.getByRole("link", { name: "Noticias" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Inicio" }));
    await flushAsyncState();

    expect(screen.queryByRole("link", { name: "Noticias" })).not.toBeInTheDocument();
  });

  it("closes the product menu when the active route changes inside the shared layout", async () => {
    mockedPhoneViewport = true;
    setViewportWidth(390);
    const { rerender } = render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú del producto" }));
    expect(screen.getByRole("link", { name: "Noticias" })).toBeInTheDocument();

    mockedPathname = "/project";
    rerender(<SiteHeader />);
    await flushAsyncState();

    expect(screen.queryByRole("link", { name: "Noticias" })).not.toBeInTheDocument();
  });

  it("uses a compact secondary tier on medium widths", async () => {
    setViewportWidth(900);
    mockedNavigationWidth = 420;

    render(<SiteHeader />);

    await flushAsyncState();
    expect(screen.getByRole("link", { name: "Proyecto" })).toHaveAttribute("href", "/project");
    expect(screen.getByRole("link", { name: "Conectar con IA" })).toHaveAttribute("href", "/connect-ai");
    expect(screen.getByRole("link", { name: "Abrir búsqueda local" })).toHaveAttribute(
      "href",
      "/search",
    );
    expect(screen.getByRole("button", { name: "Abrir menú del producto" })).toBeInTheDocument();
  });

  it("collapses secondary routes into a menu when horizontal space is tight", async () => {
    mockedPathname = "/settings";
    setViewportWidth(680);
    mockedNavigationWidth = 40;

    render(<SiteHeader />);

    await flushAsyncState();
    const nav = screen.getByRole("link", { name: "Horario" }).closest("nav");

    expect(nav).not.toBeNull();
    expect(nav).toHaveAttribute("data-secondary-nav-layout", "overflow");
    expect(screen.getByRole("button", { name: "Abrir menú del producto" })).toBeInTheDocument();
  });

  it("keeps executive education in the overflow-only links menu", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú de enlaces oficiales" }));

    expect(screen.getAllByRole("link", { name: "Inscripciones" }).at(-1)).toHaveAttribute(
      "href",
      "/registration",
    );
    expect(screen.getAllByRole("link", { name: "Noticias" }).at(-1)).toHaveAttribute(
      "href",
      "https://news.itam.mx/",
    );
    expect(
      screen.getAllByRole("link", { name: "Educación ejecutiva" }).at(-1),
    ).toHaveAttribute(
      "href",
      "https://desarrolloejecutivo.itam.mx/Home/ProgramasO#sectionCorporate&0&menu",
    );
  });
});

function setViewportWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });
  window.dispatchEvent(new Event("resize"));
}

async function flushAsyncState(iterations: number = 3): Promise<void> {
  await act(async () => {
    for (let index = 0; index < iterations; index += 1) {
      await Promise.resolve();
    }
  });
}
