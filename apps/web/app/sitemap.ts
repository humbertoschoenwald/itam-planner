import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
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
  ];

  return routes.map((route) => ({
    changeFrequency: "weekly",
    lastModified: new Date("2026-04-15T00:00:00.000Z"),
    priority: route === "" ? 1 : 0.7,
    url: `https://itam.humbertoschoenwald.com${route}`,
  }));
}
