# ADR-0001: Scope and Phase

- Status: Accepted
- Date: 2026-04-15

## Context

The repository already established its doctrine-first baseline. The next step is to build the first real implementation slice without collapsing the architecture into a premature full-product build.

This slice needs to create the public academic data foundation that later UI and integration work will consume.

## Decision

The current phase is the core academic data ingestion and publication slice.

The current implementation slice includes:

- doctrine updates required by the new slice
- `apps/api` as the first real runtime package
- source fetchers for public academic data
- deterministic HTML and PDF parsers
- normalized SQLite persistence
- JSON export generation from SQLite
- unit tests and local fixtures for every parser family and repository/exporter surface
- promotion logic for publishing a validated public snapshot

The current implementation slice does not include:

- `apps/web`
- onboarding UI
- student-local profile UX
- ITAM map UX
- authenticated scraping
- AI integration
- extra service modules beyond source discovery
- semantic interpretation of free-text comments beyond raw preservation

The artifact pipeline for the current phase is:

1. update ADR
2. derive rules
3. derive configs if doctrine changes require them
4. implement `apps/api`
5. add fixtures and unit tests
6. run ingestion and promote only validated public artifacts

## Consequences

- The repository moves from doctrine-only into a real backend/data implementation slice.
- Later UI work can consume a stable public data foundation instead of scraping directly.
- Scope remains bounded enough to avoid overbuilding the full product.

## Alternatives Considered

### Jump directly to the full product

Rejected. The repository still needs a staged rollout from data foundation to UX.

### Keep the repository doctrine-only for longer

Rejected. The project now has enough architectural clarity to build the backend/public-data core.

## Open Questions

- Whether the next slice after the public-data backend should start with the web onboarding flow or the read-only catalog browsing UI.
