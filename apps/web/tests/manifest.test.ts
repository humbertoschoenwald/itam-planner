// @vitest-environment node

import { describe, expect, it } from "vitest";

import manifest from "@/app/manifest";

describe("web manifest", () => {
  it("exposes a standalone install contract for the secure canonical host", () => {
    const result = manifest();

    expect(result.start_url).toBe("/");
    expect(result.scope).toBe("/");
    expect(result.display).toBe("standalone");
    expect(result.theme_color).toBe("#1f4d3f");
    expect(result.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          purpose: "any",
          src: "/app-icon.svg",
          type: "image/svg+xml",
        }),
        expect.objectContaining({ src: "/apple-icon", type: "image/png" }),
      ]),
    );
  });
});
