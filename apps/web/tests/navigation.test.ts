// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  resolvePrimaryNavId,
  resolveSecondaryNavPresentation,
  resolveSecondaryNavId,
  resolveSwipeNavigation,
} from "@/lib/navigation";

describe("navigation helpers", () => {
  it("maps public routes to the Home / Planner / Calendario primary nav ids", () => {
    expect(resolvePrimaryNavId("/")).toBe("home");
    expect(resolvePrimaryNavId("/planner")).toBe("planner");
    expect(resolvePrimaryNavId("/planner/onboarding")).toBe("planner");
    expect(resolvePrimaryNavId("/calendar")).toBe("calendar");
    expect(resolvePrimaryNavId("/connect-ai")).toBeNull();
    expect(resolvePrimaryNavId("/project")).toBeNull();
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

  it("adapts the secondary nav to the measured space instead of the viewport width", () => {
    const candidateWidths = {
      connectAi: 120,
      project: 92,
      registration: 118,
      search: 40,
      settings: 112,
    } as const;

    expect(
      resolveSecondaryNavPresentation({
        availableWidth: 420,
        candidateWidths,
        isPhoneViewport: false,
        overflowMenuWidth: 40,
      }),
    ).toEqual({
      layout: "compact",
      visibleCandidateIds: ["project", "connectAi", "search"],
    });

    expect(
      resolveSecondaryNavPresentation({
        availableWidth: 0,
        candidateWidths,
        isPhoneViewport: false,
        overflowMenuWidth: 40,
      }),
    ).toEqual({
      layout: "overflow",
      visibleCandidateIds: [],
    });

    expect(
      resolveSecondaryNavPresentation({
        availableWidth: 640,
        candidateWidths,
        isPhoneViewport: false,
        overflowMenuWidth: 40,
      }),
    ).toEqual({
      layout: "full",
      visibleCandidateIds: ["project", "connectAi", "search", "registration", "settings"],
    });
  });
});
