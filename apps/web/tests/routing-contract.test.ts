import { describe, expect, it } from "vitest";

import nextConfig from "../next.config";

describe("routing contract", () => {
  it("keeps the legacy public routes as compatibility redirects to the English canonicals", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          destination: "/planner/onboarding",
          permanent: true,
          source: "/onboarding",
        }),
        expect.objectContaining({
          destination: "/project",
          permanent: true,
          source: "/community",
        }),
        expect.objectContaining({
          destination: "/connect-ai",
          permanent: true,
          source: "/connect-chatgpt",
        }),
        expect.objectContaining({
          destination: "/registration",
          permanent: true,
          source: "/inscripciones",
        }),
        expect.objectContaining({
          destination: "/map",
          permanent: true,
          source: "/mapa",
        }),
        expect.objectContaining({
          destination: "/settings",
          permanent: true,
          source: "/planner/settings",
        }),
      ]),
    );

    expect(redirects).toHaveLength(6);
  });
});
