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

The web build also expects the repository variable:

- `NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL`

## Domain Setup Order

1. Create or link the Vercel project for `apps/web`.
2. Add `itam.humbertoschoenwald.com` in the Vercel project domain settings.
3. Use the exact DNS record values requested by Vercel during verification.
4. Create or update the matching DNS record in Cloudflare for the `itam` subdomain.
5. Wait for Vercel domain verification to complete.
6. Keep the personal root site on `humbertoschoenwald.com` separate from the planner app.

Do not hardcode a generic CNAME target here. Vercel may request verification or target values that should be copied exactly from the domain setup UI at configuration time.

## API Origin

The public API origin is intentionally separate from the web runtime contract.

- During local development, `apps/web` defaults to `http://127.0.0.1:8000`.
- In deployed environments, set `NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL` explicitly.

## Connect to ChatGPT and Future AI Context

The future read-only AI context endpoint will live under the same public hostname family, but the exact route shape is intentionally deferred until that slice is accepted by doctrine.
