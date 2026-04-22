// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getManifestMessages } from "@/lib/i18n/manifest";

describe("manifest i18n", () => {
  it("keeps manifest copy in the locale layer for both supported locales", () => {
    expect(getManifestMessages("es-MX")).toEqual({
      description:
        "Planeacion academica para alumnos del ITAM con estado local en el navegador y un catalogo publico publicado.",
      name: "ITAM Planner",
      shortName: "ITAM Planner",
    });

    expect(getManifestMessages("en")).toEqual({
      description:
        "Academic planning for ITAM students with browser-local state and a published public catalog.",
      name: "ITAM Planner",
      shortName: "ITAM Planner",
    });
  });
});
