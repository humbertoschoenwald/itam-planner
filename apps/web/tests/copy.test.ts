// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getUiCopy } from "@/lib/copy";
import { DEFAULT_LOCALE, getLocaleLabels, SUPPORTED_LOCALES } from "@/lib/locale";

describe("getUiCopy", () => {
  it("supports only the current Spanish and English locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["es-MX", "en"]);
    expect(DEFAULT_LOCALE).toBe("es-MX");
  });

  it("returns Spanish-first copy by default locale selection", () => {
    expect(getUiCopy("es-MX").plannerHome.noAccountRequired).toMatch(/No necesitas cuenta/u);
  });

  it("returns English copy when requested", () => {
    const copy = getUiCopy("en");

    expect(copy.common.calendar).toBe("Calendar");
    expect(copy.common.timeColumnLabel).toBe("Time");
  });

  it("reuses the canonical locale labels from the locale registry", () => {
    expect(getUiCopy("es-MX").common.localeLabels).toEqual(getLocaleLabels("es-MX"));
    expect(getUiCopy("en").common.localeLabels).toEqual(getLocaleLabels("en"));
  });

  it("includes the under construction banner copy in Spanish-first mode", () => {
    expect(getUiCopy("es-MX").underConstruction.title).toBe("En construcción");
  });

  it("exposes localized entry-season labels instead of raw academic keys", () => {
    expect(getUiCopy("es-MX").onboardingPage.seasonOptions.spring).toBe("Primavera");
    expect(getUiCopy("es-MX").onboardingPage.seasonOptions.fall).toBe("Otoño");
    expect(getUiCopy("en").onboardingPage.seasonOptions.spring).toBe("Spring");
    expect(getUiCopy("en").onboardingPage.seasonOptions.fall).toBe("Fall");
  });

  it("exposes the new primary navigation, footer, and planner-onboarding copy", () => {
    const copy = getUiCopy("es-MX");

    expect(copy.common.home).toBe("Inicio");
    expect(copy.common.planner).toBe("Horario");
    expect(copy.common.calendar).toBe("Calendario");
    expect(copy.footer.terms).toBe("Términos y condiciones");
    expect(copy.plannerOnboarding.introTitle).toMatch(/configurar/u);
    expect(copy.plannerOnboarding.programTitles.degree).toMatch(/licenciatura/u);
    expect(copy.plannerOnboarding.swipePreferenceTitle).toMatch(/deslizamiento/u);
    expect(copy.plannerOnboarding.finishHighlight).toMatch(/configuraste tu horario/u);
  });

  it("keeps Spanish public UI copy free of the mixed terms cleaned in this slice", () => {
    const copy = getUiCopy("es-MX");

    expect(copy.onboardingPage.eyebrow).toBe("Configuración inicial");
    expect(copy.plannerOnboarding.eyebrow).toBe("Configuración inicial del horario");
    expect(copy.connectPage.description).toMatch(/punto de acceso/u);
    expect(copy.footer.caption).toMatch(/enlaces del pie/u);
    expect(copy.legalPages.privacy.sections[1]?.body).toMatch(/servidor/u);
    expect(copy.legalPages.privacy.sections[1]?.body).not.toMatch(
      /backend|analytics|telemetry|sign-in/u,
    );
  });

  it("keeps home feature cards on the canonical English routes in both locales", () => {
    const englishCopy = getUiCopy("en");
    const spanishCopy = getUiCopy("es-MX");

    expect(englishCopy.homePage.featureCards.map((card) => card.href)).toEqual([
      "/planner",
      "/calendar",
      "/project",
      "/connect-ai",
    ]);
    expect(spanishCopy.homePage.featureCards.map((card) => card.href)).toEqual([
      "/planner",
      "/calendar",
      "/project",
      "/connect-ai",
    ]);
    expect(englishCopy.homePage.featureCards[1]?.title).toBe("Calendar");
    expect(englishCopy.homePage.featureCards[2]?.title).toBe("Project");
    expect(englishCopy.homePage.featureCards[3]?.title).toBe("Connect to AI");
  });
});
