import { describe, expect, it } from "vitest";

import { getUiCopy } from "@/lib/copy";

describe("getUiCopy", () => {
  it("returns Spanish-first copy by default locale selection", () => {
    expect(getUiCopy("es-MX").plannerHome.noAccountRequired).toMatch(/No necesitas cuenta/u);
  });

  it("returns English copy when requested", () => {
    expect(getUiCopy("en").common.community).toBe("Community");
  });

  it("includes the under construction banner copy in Spanish-first mode", () => {
    expect(getUiCopy("es-MX").underConstruction.title).toBe("Under Construction");
  });

  it("exposes localized entry-season labels instead of raw academic keys", () => {
    expect(getUiCopy("es-MX").onboardingPage.seasonOptions.spring).toBe("Primavera");
    expect(getUiCopy("es-MX").onboardingPage.seasonOptions.fall).toBe("Otoño");
    expect(getUiCopy("en").onboardingPage.seasonOptions.spring).toBe("Spring");
    expect(getUiCopy("en").onboardingPage.seasonOptions.fall).toBe("Fall");
  });

  it("exposes the new primary navigation, footer, and planner-onboarding copy", () => {
    const copy = getUiCopy("es-MX");

    expect(copy.common.home).toBe("Home");
    expect(copy.common.calendar).toBe("Calendario");
    expect(copy.footer.terms).toBe("Términos y condiciones");
    expect(copy.plannerOnboarding.swipeTitle).toMatch(/Desliza/u);
  });
});
