# ADR-0001: Scope and Phase

- Status: Accepted
- Date: 2026-04-15

## Context

The repository already established its doctrine-first baseline. The next step is to build the first real implementation slice without collapsing the architecture into a premature full-product build.

This slice needs to create the public academic data foundation that later UI and integration work will consume.

## Decision

The repository now moves in ordered implementation slices rather than one monolithic build.

The current ordered phases are:

1. repository and community entry surfaces
2. `apps/web` planner shell
3. browser-local planner state and portable student code
4. Connect to ChatGPT and external AI connection flow
5. public deployment and domain setup

The current active implementation slice includes:

- doctrine updates required by the new slice
- repository entry and community files
- `apps/api` public-data foundation
- `apps/web` onboarding and planner shell
- browser-local planner state
- portable student code generation
- tests for new planner, state, and ingestion behavior

The current active implementation slice does not yet include:

- the final ChatGPT connection route
- the final AI endpoint route shape
- Cloudflare domain setup
- authenticated scraping
- the ITAM map UX
- semantic interpretation of free-text comments beyond raw preservation
- automated parser self-repair

The artifact pipeline for the current phase is:

1. update ADR
2. derive rules
3. derive configs if doctrine changes require them
4. implement repository and community entry files
5. implement runtime packages and local-state scaffolding
6. add fixtures and unit tests
7. run ingestion and promote only validated public artifacts

## Consequences

- The repository keeps a strict sequence from doctrine to community surfaces to runtime code.
- The planner and future AI surfaces stay grounded in the public-data backbone.
- Scope remains bounded while still allowing real user-facing progress.

## Alternatives Considered

### Jump directly to the final AI-connected product

Rejected. The repository still needs a staged rollout from data foundation to UX.

### Keep the repository backend-only for longer

Rejected. The project now has enough architectural clarity to add community surfaces and the first planner shell.

## Open Questions

- Whether the first public Connect to ChatGPT slice should use a path parameter, query parameter, or nested route for the AI context endpoint.
