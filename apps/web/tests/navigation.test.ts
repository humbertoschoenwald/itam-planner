import { describe, expect, it } from "vitest";

import {
  resolvePrimaryNavId,
  resolveSecondaryNavId,
  resolveSwipeNavigation,
} from "@/lib/navigation";

describe("navigation helpers", () => {
  it("maps public routes to the Home / Planner / Calendario primary nav ids", () => {
    expect(resolvePrimaryNavId("/")).toBe("home");
    expect(resolvePrimaryNavId("/planner")).toBe("planner");
    expect(resolvePrimaryNavId("/planner/onboarding")).toBe("planner");
    expect(resolvePrimaryNavId("/calendar")).toBe("calendar");
  });

  it("maps secondary routes to the canonical English utility tabs", () => {
    expect(resolveSecondaryNavId("/project")).toBe("project");
    expect(resolveSecondaryNavId("/connect-ai")).toBe("connectAi");
    expect(resolveSecondaryNavId("/registration")).toBe("registration");
    expect(resolveSecondaryNavId("/settings")).toBe("settings");
    expect(resolveSecondaryNavId("/search")).toBe("search");
    expect(resolveSecondaryNavId("/map")).toBe("map");
    expect(resolveSecondaryNavId("/inscripciones")).toBeNull();
  });

  it("learns the first planner swipe preference without changing the destination set", () => {
    expect(resolveSwipeNavigation("/planner", 60, null)).toEqual({
      href: "/",
      preferenceToPersist: "natural",
    });
    expect(resolveSwipeNavigation("/planner", -60, null)).toEqual({
      href: "/",
      preferenceToPersist: "inverted",
    });
  });

  it("uses the stored swipe preference for later adjacent navigation", () => {
    expect(resolveSwipeNavigation("/planner", 60, "natural")).toEqual({
      href: "/",
      preferenceToPersist: null,
    });
    expect(resolveSwipeNavigation("/planner", -60, "natural")).toEqual({
      href: "/calendar",
      preferenceToPersist: null,
    });
    expect(resolveSwipeNavigation("/planner", 60, "inverted")).toEqual({
      href: "/calendar",
      preferenceToPersist: null,
    });
  });

  it("ignores tiny movements and out-of-range navigation", () => {
    expect(resolveSwipeNavigation("/planner", 12, null)).toBeNull();
    expect(resolveSwipeNavigation("/", 60, "natural")).toBeNull();
    expect(resolveSwipeNavigation("/calendar", -60, "natural")).toBeNull();
  });
});
