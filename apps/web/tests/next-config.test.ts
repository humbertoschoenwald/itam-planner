// @vitest-environment node

import { describe, expect, it } from "vitest";

import nextConfig from "../next.config";

describe("next config", () => {
  it("allows the local responsive runner origin in development", () => {
    expect(nextConfig.allowedDevOrigins).toEqual(["127.0.0.1"]);
  });

  it("disables the Next.js development indicator chrome", () => {
    expect(nextConfig.devIndicators).toBe(false);
  });

  it("adds strong cache headers for the published catalog", async () => {
    const headers = await nextConfig.headers();
    const catalogHeaders = headers.find(
      (entry) => entry.source === "/catalog/latest/:path*",
    )?.headers;

    expect(catalogHeaders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "Cache-Control",
          value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        }),
      ]),
    );
  });

  it("adds transport and framing security headers for all routes", async () => {
    const headers = await nextConfig.headers();
    const globalHeaders = headers.find((entry) => entry.source === "/:path*")?.headers;

    expect(globalHeaders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        }),
        expect.objectContaining({ key: "X-Frame-Options", value: "DENY" }),
        expect.objectContaining({ key: "X-Content-Type-Options", value: "nosniff" }),
      ]),
    );
  });
});
