import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/planner",
    "/planner/onboarding",
    "/calendar",
    "/community",
    "/connect-chatgpt",
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
