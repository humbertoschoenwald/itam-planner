import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
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
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        destination: "/planner/onboarding",
        permanent: true,
        source: "/onboarding",
      },
      {
        destination: "/project",
        permanent: true,
        source: "/community",
      },
      {
        destination: "/connect-ai",
        permanent: true,
        source: "/connect-chatgpt",
      },
      {
        destination: "/registration",
        permanent: true,
        source: "/inscripciones",
      },
      {
        destination: "/map",
        permanent: true,
        source: "/mapa",
      },
      {
        destination: "/settings",
        permanent: true,
        source: "/planner/settings",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/catalog/latest/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
