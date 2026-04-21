# ADR-0003: Architecture and Boundaries

- Status: Accepted
- Date: 2026-04-15

## Context

The product must remain modular enough that the frontend can consume any compliant data source, and the backend can ingest data from any compliant extraction adapter. The user also wants the system decoupled enough that institutional adopters could take a slice of the codebase and integrate it into their own infrastructure without rewriting everything.

## Decision

The canonical architecture is layered and contract-driven.

Primary boundaries:

- `web` is a standalone frontend application.
- `api` is a standalone backend application.
- data extraction adapters are separate from backend framework glue.
- public catalog persistence is separate from both web rendering and user state.

Hard rules:

- `web` must never depend on scraper internals.
- `web` must consume stable contracts, not database schema details.
- `web` presentation must remain separable from browser-storage concerns, service calls, and catalog-shaping logic.
- `web` presentation modules must follow the pipeline `data -> presenter functions -> locale dictionaries -> UI`.
- page and component modules must not import raw academic-data catalogs, search index builders, catalog shapers, or other domain-data modules directly; they must consume presenter-layer functions instead.
- locale-facing UI text must not be embedded in page or component modules. UI may reference locale dictionaries only.
- canonical academic data for one career, joint-program component set, or study-plan fallback must have a single repository owner. Duplicate copies of the same academic fact in multiple modules are prohibited.
- browser-owned persistence adapters must remain optional capabilities around the UI rather than prerequisites for rendering the public shell.
- failures in browser-owned persistence must not take down the full route; they must degrade to in-memory behavior or a generic error surface.
- `api` must depend on interfaces or internal service boundaries, not on one specific source site.
- scraper logic must be replaceable without rewriting the core API surface.
- deployment adapters must not leak into core runtime logic.

Embeddability requirement:

The backend must be shaped so that a future adopter can mount, reuse, or port the service layer into an existing server environment with minimal coupling to repository-specific deployment assumptions.

Contract requirement:

Frontend and backend must converge through OpenAPI-derived contracts rather than duplicated handwritten DTOs.

## Consequences

- The repository stays modular and easier to adapt.
- Source-site migration becomes cheaper.
- The web application remains portable across deployment environments.
- More interfaces and adapters may be needed later, but that complexity is intentional.

## Alternatives Considered

### Let the frontend read scraper outputs directly

Rejected. That creates brittle coupling and makes future backend evolution harder.

### Bind the backend tightly to one source site

Rejected. The data source is an adapter concern, not a core platform concern.

### Use a single monolithic app boundary

Rejected. The repository needs clear separation between user experience, public API, and extraction logic.

## Open Questions

- Whether the public catalog pipeline should expose both JSON artifacts and live API reads in the first runnable scaffold.
