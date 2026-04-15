# Vercel and Cloudflare Delivery Plan

## Scope

This document describes the intended production delivery path for the public web app.

- Web runtime: Vercel
- Hostname: `itam.humbertoschoenwald.com`
- DNS and hostname management: Cloudflare

The application runtime remains host-agnostic even though Vercel is the primary deployment path.

## GitHub Actions Secrets

The deploy workflow expects these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Optional repository variable:

- `NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL`

## Domain Setup Order

1. Create or link the Vercel project for the repository root.
2. Keep the root build command responsible for syncing `public-data/latest` into the web artifact before the Next.js build runs.
3. Add `itam.humbertoschoenwald.com` in the Vercel project domain settings.
4. Use the exact DNS record values requested by Vercel during verification.
5. Create or update the matching DNS record in Cloudflare for the `itam` subdomain.
6. Wait for Vercel domain verification to complete.
7. Keep the personal root site on `humbertoschoenwald.com` separate from the planner app.

Do not hardcode a generic CNAME target here. Vercel may request verification or target values that should be copied exactly from the domain setup UI at configuration time.

## API Origin

The public API origin is intentionally optional from the web runtime contract.

- During local development, `apps/web` may use `http://127.0.0.1:8000`.
- In deployed environments, the default path is to serve the published JSON catalog from the same web deployment.
- Set `NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL` only when you want the client to target a separate read-only API origin.

## Connect to ChatGPT and Future AI Context

The future read-only AI context endpoint will live under the same public hostname family, but the exact route shape is intentionally deferred until that slice is accepted by doctrine.
