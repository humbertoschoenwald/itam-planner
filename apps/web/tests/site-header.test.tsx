import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/site-header";
import { DEFAULT_PLANNER_UI_STATE, usePlannerUiStore } from "@/stores/planner-ui-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const pushSpy = vi.fn();
let mockedPathname = "/planner";

vi.mock("next/navigation", () => ({
  usePathname: () => mockedPathname,
  useRouter: () => ({
    push: pushSpy,
  }),
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    pushSpy.mockReset();
    mockedPathname = "/planner";
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
    setViewportWidth(390);
    render(<SiteHeader />);

    const nav = screen.getByRole("link", { name: "Horario" }).closest("nav");
    expect(nav).not.toBeNull();

    await waitFor(() => {
      fireEvent.pointerDown(nav!, { clientX: 10 });
      fireEvent.pointerUp(nav!, { clientX: 90 });

      expect(pushSpy).toHaveBeenCalledWith("/");
    });

    expect(usePlannerUiStore.getState().state.navSwipePreference).toBe("natural");
  });

  it("collapses secondary routes into a menu when horizontal space is tight", async () => {
    mockedPathname = "/settings";
    setViewportWidth(900);

    render(<SiteHeader />);

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "Proyecto" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Abrir menú del producto" })).toBeInTheDocument();
    });
  });

  it("keeps executive education in the overflow-only links menu", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú de enlaces oficiales" }));

    expect(screen.getByRole("link", { name: "Inscripciones" })).toHaveAttribute(
      "href",
      "/registration",
    );
    expect(screen.getByRole("link", { name: "Noticias" })).toHaveAttribute(
      "href",
      "https://news.itam.mx/",
    );
    expect(
      screen.getByRole("link", { name: "Educación ejecutiva" }),
    ).toHaveAttribute(
      "href",
      "https://desarrolloejecutivo.itam.mx/Home/ProgramasO#sectionCorporate&0&menu",
    );
  });
});

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });
  window.dispatchEvent(new Event("resize"));
}
