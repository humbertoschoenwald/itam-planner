# ADR-0005: Deployment and Runtime

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs a modern default deployment path that feels professional, fast, and easy to operate on low cost. The user wants Vercel for the web experience, GitHub Actions for refresh automation, and a domain setup that avoids coupling the app to a path prefix.

Official documentation also matters here:

- GitHub Actions supports `schedule` with `timezone` using IANA names.
- Scheduled workflows still run from the default branch and may be delayed under high load.
- Vercel does not support durable SQLite persistence inside the serverless runtime filesystem.

## Decision

Primary deployment defaults:

- The primary web deployment target is Vercel.
- The preferred domain shape is `itam.humbertoschoenwald.com`.
- The frontend runtime must remain host-agnostic even though Vercel is the default platform.
- The default application configuration must not assume GitHub Pages-specific `basePath` or `assetPrefix`.
- Optional local container runtime support may exist through Docker Compose as an onboarding and self-hosted verification path, but it does not replace the Vercel-first production default.

Runtime separation:

- `web` and `api` are independently deployable units.
- GitHub Actions is the default automation surface for scheduled catalog refresh and public-data publishing.
- Public catalog snapshots should be generated or refreshed outside the Vercel runtime when SQLite is involved.
- The default production web deployment may serve generated JSON projections directly from the published artifact bundle so that the site stays functional without a mandatory separate API runtime.
- Container assets must preserve the same separation: `web` and `api` remain separate images, and the promoted `public-data` artifact stays the runtime contract between them.

Operational scheduling:

- The canonical refresh schedule is `03:33` in `America/Mexico_City`.
- Workflow files should use GitHub Actions `schedule.timezone` rather than manual UTC conversion when the workflow is implemented.
- Workflow documentation must still mention that scheduled runs can be delayed and only run from the default branch.

## Consequences

- The web path stays modern and low-friction.
- The app remains portable beyond Vercel.
- Public-data refresh stays decoupled from request-time infrastructure.
- The public site can stay deployable even when the Python API is not exposed as a separate public service.
- Deployment assumptions remain visible and explicit.
- Local onboarding can stay reproducible without changing the repository's hosted production posture.

## Alternatives Considered

### Optimize the runtime for GitHub Pages first

Rejected. That would pollute the core app with static-host assumptions.

### Use path-prefix hosting as the canonical domain shape

Rejected. Subpaths create avoidable coupling in routes, assets, and deployment adapters.

### Treat SQLite as durable inside Vercel Functions

Rejected. That conflicts with current platform constraints.

## References

- [Vercel: Is SQLite supported in Vercel?](https://vercel.com/guides/is-sqlite-supported-in-vercel)
- [Vercel Functions](https://vercel.com/docs/functions/)
- [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)

## Open Questions

- Whether the first public-data publishing path should target repository artifacts, object storage, or a separate API deployment.
