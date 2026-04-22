import type { NextConfig } from "next";

const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = 60 * 60 * 24 * 7;
const ONE_YEAR = 60 * 60 * 24 * 365;
const ALLOWED_DEV_ORIGINS = ["127.0.0.1"];

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: `max-age=${ONE_YEAR}; includeSubDomains; preload`,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
] satisfies Awaited<ReturnType<NonNullable<NextConfig["headers"]>>>[number]["headers"];

const REDIRECTS = [
  {
    source: "/onboarding",
    destination: "/planner/onboarding",
    permanent: true,
  },
  {
    source: "/community",
    destination: "/project",
    permanent: true,
  },
  {
    source: "/connect-chatgpt",
    destination: "/connect-ai",
    permanent: true,
  },
  {
    source: "/inscripciones",
    destination: "/registration",
    permanent: true,
  },
  {
    source: "/mapa",
    destination: "/map",
    permanent: true,
  },
  {
    source: "/planner/settings",
    destination: "/settings",
    permanent: true,
  },
] satisfies Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

const nextConfig = {
  allowedDevOrigins: ALLOWED_DEV_ORIGINS,
  devIndicators: false,
  output: "standalone",
  reactStrictMode: true,

  async redirects(): Promise<{ source: string; destination: string; permanent: true; }[]> {
    return REDIRECTS;
  },

  async headers(): Promise<{ source: string; headers: { key: string; value: string; }[]; }[]> {
    return [
      {
        source: "/catalog/latest/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_HOUR}, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_WEEK}`,
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_HOUR}, stale-while-revalidate=${ONE_DAY}`,
          },
        ],
      },
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
