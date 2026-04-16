import { describe, expect, it } from "vitest";

import {
  buildHomeStructuredData,
  buildPageMetadata,
  buildSiteMetadata,
  getSeoCopy,
} from "@/lib/seo";

describe("seo copy", () => {
  it("keeps public metadata text in the locale layer", () => {
    expect(getSeoCopy("es-MX").pages.planner.title).toBe("Horario");
    expect(getSeoCopy("en").pages.planner.title).toBe("Schedule");
    expect(getSeoCopy("es-MX").pages.registration.canonicalPath).toBe("/registration");
  });

  it("builds localized page metadata from the canonical route map", () => {
    const metadata = buildPageMetadata("es-MX", "calendar");

    expect(metadata.title).toBe("Calendario");
    expect(metadata.description).toMatch(/Calendario público/u);
    expect(metadata.alternates?.canonical).toBe("/calendar");
    expect(metadata.openGraph?.url).toBe("/calendar");
    expect(metadata.twitter?.title).toBe("Calendario");
  });

  it("builds localized site-level metadata and structured data", () => {
    const siteMetadata = buildSiteMetadata("es-MX");
    const structuredData = buildHomeStructuredData("es-MX");

    expect(siteMetadata.applicationName).toBe("ITAM Planner");
    expect(siteMetadata.description).toMatch(/Horario académico/u);
    expect(siteMetadata.openGraph?.locale).toBe("es_MX");
    expect(structuredData.inLanguage).toBe("es-MX");
    expect(structuredData.description).toMatch(/Proyecto independiente/u);
  });
});
