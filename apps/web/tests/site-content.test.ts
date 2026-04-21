// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getOfficialNewsItems } from "@/lib/site-content";

describe("getOfficialNewsItems", () => {
  it("keeps Spanish official news surfaces localized for the UI", () => {
    const items = getOfficialNewsItems("es-MX");

    expect(items.some((item) => item.title === "Educación ejecutiva y extensión")).toBe(true);
    expect(items.some((item) => item.category === "Noticias" && item.title === "Noticias ITAM")).toBe(
      true,
    );
    expect(items.every((item) => item.title !== "Executive education and extension")).toBe(true);
  });

  it("keeps English official news surfaces available separately", () => {
    const items = getOfficialNewsItems("en");

    expect(items.some((item) => item.title === "Executive education and extension")).toBe(true);
    expect(items.some((item) => item.category === "News" && item.title === "ITAM News")).toBe(true);
  });
});
