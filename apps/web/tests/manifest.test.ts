// @vitest-environment node

import { describe, expect, it } from "vitest";

import manifest from "@/app/manifest";
import { getManifestMessages } from "@/lib/i18n/manifest";
import { DEFAULT_LOCALE } from "@/lib/locale";

describe("web manifest", () => {
  it("exposes a standalone install contract driven by the locale layer", () => {
    const result = manifest();
    const messages = getManifestMessages(DEFAULT_LOCALE);

    expect(result.name).toBe(messages.name);
    expect(result.short_name).toBe(messages.shortName);
    expect(result.description).toBe(messages.description);
    expect(result.lang).toBe(DEFAULT_LOCALE);
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
