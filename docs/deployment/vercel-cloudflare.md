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

## Current Vercel Record

The current Vercel domain inspection for `itam.humbertoschoenwald.com` expects this DNS record:

- `A itam.humbertoschoenwald.com 76.76.21.21`

If Vercel changes that requirement later, prefer the current Vercel domain-inspection output over this note.

## HTTPS and Browser Installability

- The public site should only be treated as canonical over `https://`.
- The web app now publishes a manifest, Apple web-app metadata, generated app icons, transport-security headers, and cache headers for the promoted JSON catalog.
- The custom-domain TLS handshake will not complete until the `itam` DNS record exists and Vercel finishes domain verification.
- Keep Cloudflare SSL/TLS encryption mode on `Full` when proxying the subdomain through Cloudflare.
- If Cloudflare serves a temporary `525` during first-time propagation, wait for Vercel domain validation to settle or temporarily switch the `itam` record to `DNS only` while confirming direct Vercel HTTPS.
- Do not paste, commit, or upload Cloudflare Origin Server certificates or private keys into this repository or the Vercel project for this hostname. This deployment relies on Vercel-managed TLS for the custom domain.

## API Origin

The public API origin is intentionally optional from the web runtime contract.

- During local development, `apps/web` may use `http://127.0.0.1:8000`.
- In deployed environments, the default path is to serve the published JSON catalog from the same web deployment.
- The web bundle should ship JSON projections only; the canonical SQLite snapshot remains outside the deployed frontend artifact.
- Set `NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL` only when you want the client to target a separate read-only API origin.

## Connect to ChatGPT and Future AI Context

The future read-only AI context endpoint will live under the same public hostname family, but the exact route shape is intentionally deferred until that slice is accepted by doctrine.
