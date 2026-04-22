# Docker Runtime

## Scope

This document describes the optional local container runtime for `itam-planner`.

- `web` remains a separate runtime unit.
- `api` remains a separate runtime unit.
- `public-data` remains the shared published artifact contract.
- Vercel remains the canonical production web deployment target.

The Docker path is for easier onboarding, reproducible local install, and self-hosted verification. It does not replace the native `pnpm` and `uv` workflows documented in the root README.

## Prerequisites

- Docker Engine
- Docker Compose

## Quick Start

From the repository root:

```sh
docker compose up --build
```

The default local runtime exposes:

- web: `http://localhost:3000`
- api: `http://localhost:8000`

Stop the stack with:

```sh
docker compose down --remove-orphans
```

Equivalent `pnpm` wrappers are also available:

```sh
pnpm docker:build
pnpm docker:up
pnpm docker:up:detached
pnpm docker:logs
pnpm docker:down
```

## Environment Overrides

The compose stack accepts these optional environment overrides:

- `ITAM_PLANNER_WEB_PORT`
- `ITAM_PLANNER_API_PORT`
- `NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL`

`NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL` defaults to `http://localhost:8000` in the compose build so the browser-facing client can reach the containerized API through the published host port. Leave it unset if you want the compose default.

## Runtime Notes

- The web image uses a Next.js standalone output for a smaller, cleaner runtime image.
- The API image keeps the repository `uv` workflow inside the container and serves the read-only FastAPI app on port `8000`.
- The container runtime uses the committed `public-data/latest` snapshot already present in the repository.
- If you refresh public data or change application code, rebuild the images with `docker compose up --build`.
