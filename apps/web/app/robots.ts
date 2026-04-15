import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    host: "https://itam.humbertoschoenwald.com",
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: "https://itam.humbertoschoenwald.com/sitemap.xml",
  };
}
