# ITAM Planner

`itam-planner` is a modern, privacy-first academic planning project for ITAM students. It ingests public academic documents, normalizes them into a stable public catalog, and is evolving toward a browser-local planner that students can use without accounts or cloud-stored personal data.

## Status

The repository currently includes:

- an accepted ADR-first doctrine layer
- a Python public-data ingestion pipeline under `apps/api`
- a promoted fixture-backed public catalog snapshot under `public-data/latest`
- the first `apps/web` planner shell foundation
- provisional visual branding; a dedicated logo and icon design pass still remains future work

The repository does not yet claim full product completeness.

## Legal Disclaimer

Independent open-source project, built by the community. Not affiliated with, endorsed by, or maintained by Instituto Tecnológico Autónomo de México (ITAM).

## Attribution and Originality

This repository credits [Horarios-ITAM](https://github.com/Horarios-ITAM/horariosITAM) as an important inspiration in the same problem space.

This codebase is a fully original implementation written from scratch. No source code has been copied, translated, ported, lightly modified, or reused from prior repositories.

The repository also relies on public academic source material published by ITAM, including public schedules, bulletins, calendars, and regulations. Those upstream materials remain the source content for ingestion, not copied repository code.

## Architecture Summary

- `apps/api`: public academic data ingestion, normalization, SQLite persistence, JSON export generation, and read-only API endpoints
- `apps/web`: the Next.js planner shell, onboarding flow, community/help surfaces, browser-local student code flow, and published-catalog delivery surface
- `docs/adr`: canonical doctrine
- `.cursor/rules`: operational rules derived from ADR
- `public-data/latest`: the promoted normalized public catalog and generated JSON projections

## Privacy Model

- No user accounts
- No server-side sessions
- No analytics or tracking cookies
- No backend storage for personal schedule state
- Student-specific state lives only in browser `localStorage`

## Data Sources

Current public-source ingestion work is centered around:

- `https://escolar.itam.mx/licenciaturas/boletines/`
- `https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php`
- public schedule surfaces discovered from ITAM services pages

See `docs/bibliography/tooling-and-standards.md` for maintained references and source acknowledgments.

## Development

### Python API

- Toolchain: `uv`
- Entry package: `apps/api`
- Read-only local API shell: FastAPI

Useful commands:

```sh
uv run --project apps/api --group dev pytest
uv run --project apps/api --group dev ruff check apps/api
uv run --project apps/api --group dev basedpyright apps/api/src
uv run --project apps/api python -m itam_planner_api.cli ingest-fixtures --fixtures-root apps/api/tests/fixtures --public-data-root public-data
uv run --project apps/api python -m itam_planner_api.cli serve
```

### Web Workspace

- Workspace manager: `pnpm`
- Task graph and cache orchestration: `Turborepo`
- Frontend package: `apps/web`
- Framework: `Next.js` App Router

Useful commands:

```sh
pnpm install
pnpm dev:web
pnpm lint:web
pnpm test:web
pnpm typecheck:web
```

The web app can read the published catalog directly from its own static build artifact. The deployed site ships the generated JSON projections needed by the client; the canonical SQLite snapshot remains in `public-data/latest` and is not required inside the web bundle. Set `NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL` only when you intentionally want the web client to talk to a separate API origin. See `apps/web/.env.example`.

Root delivery secrets for Vercel and Cloudflare should live in a local `.env` file that follows `.env.example`. Never commit those secrets.

### Repository-Wide Commands

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
```

## CI/CD and Delivery

- GitHub Actions is the canonical automation surface for validation, deployment, and scheduled refresh.
- Node 25 is the required stable baseline for the workspace and hosted CI.
- Vercel is the default web deployment target.
- Cloudflare is reserved for DNS and hostname management around `itam.humbertoschoenwald.com`.
- The default production web build should stay self-sufficient by shipping the published JSON catalog with the deployed site unless an explicit external API origin is configured.

See `docs/deployment/vercel-cloudflare.md` for the current delivery plan and required secrets.

## Community and Contact

- GitHub Issues are the only support and bug-reporting path.
- The web app exposes the issue flows directly in its community section.
- Creator profile: [Instagram](https://www.instagram.com/humbertoschoenwald/)

The Instagram link exists for creator visibility and project updates. It is not a support channel and is not affiliated with ITAM.

## Contributing Code

See `CONTRIBUTING.md` for contribution quality rules, required checks, and rejection conditions.
