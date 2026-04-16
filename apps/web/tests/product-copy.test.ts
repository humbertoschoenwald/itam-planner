import { describe, expect, it } from "vitest";

import { getProductCopy } from "@/lib/product-copy";

describe("getProductCopy", () => {
  it("keeps registration source labels in the locale layer", () => {
    const spanishCopy = getProductCopy("es-MX");
    const englishCopy = getProductCopy("en");

    expect(spanishCopy.common.registration).toBe("Inscripciones");
    expect(englishCopy.common.registration).toBe("Registration");
    expect(spanishCopy.registrationPage.sourceLabels.destination).toBe(
      "Destino oficial de inscripciones",
    );
    expect(englishCopy.registrationPage.sourceLabels.destination).toBe(
      "Official registration destination",
    );
  });
});
