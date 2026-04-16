import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/site-header";
import { DEFAULT_PLANNER_UI_STATE, usePlannerUiStore } from "@/stores/planner-ui-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

const pushSpy = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/planner",
  useRouter: () => ({
    push: pushSpy,
  }),
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    pushSpy.mockReset();
    setViewportWidth(1280);
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    usePlannerUiStore.setState({ state: DEFAULT_PLANNER_UI_STATE });
  });

  it("renders only the Home / Planner / Calendario primary navigation", () => {
    const { container } = render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Planner" })).toHaveAttribute("href", "/planner");
    expect(screen.getByRole("link", { name: "Calendario" })).toHaveAttribute("href", "/calendar");
    expect(screen.queryByRole("link", { name: /Comunidad/u })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Conectar con ChatGPT/u })).not.toBeInTheDocument();
    expect(container.querySelector("header")).toHaveClass("sticky");
  });

  it("ignores swipe-like pointer gestures outside phone layouts", () => {
    render(<SiteHeader />);

    const nav = screen.getByRole("link", { name: "Planner" }).closest("nav");
    expect(nav).not.toBeNull();

    fireEvent.pointerDown(nav!, { clientX: 10 });
    fireEvent.pointerUp(nav!, { clientX: 90 });

    expect(pushSpy).not.toHaveBeenCalled();
    expect(usePlannerUiStore.getState().state.navSwipePreference).toBeNull();
  });

  it("stores the first learned swipe preference while moving from planner to home on phone layouts", async () => {
    setViewportWidth(390);
    render(<SiteHeader />);

    const nav = screen.getByRole("link", { name: "Planner" }).closest("nav");
    expect(nav).not.toBeNull();

    await waitFor(() => {
      fireEvent.pointerDown(nav!, { clientX: 10 });
      fireEvent.pointerUp(nav!, { clientX: 90 });

      expect(pushSpy).toHaveBeenCalledWith("/");
    });

    expect(usePlannerUiStore.getState().state.navSwipePreference).toBe("natural");
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
