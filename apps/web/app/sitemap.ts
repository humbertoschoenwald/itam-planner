import type { MetadataRoute } from "next";

const SITE_URL = "https://itam.humbertoschoenwald.com";
const LAST_MODIFIED = new Date("2026-04-15T00:00:00.000Z");

const ROUTES = [
  "/",
  "/planner",
  "/planner/onboarding",
  "/settings",
  "/calendar",
  "/search",
  "/project",
  "/connect-ai",
  "/registration",
  "/map",
  "/terms",
  "/privacy",
] as const;

function buildUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

function getPriority(path: (typeof ROUTES)[number]): number {
  switch (path) {
    case "/":
      return 1;
    case "/planner":
    case "/search":
    case "/registration":
      return 0.9;
    default:
      return 0.7;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: buildUrl(path),
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: getPriority(path),
  }));
}
