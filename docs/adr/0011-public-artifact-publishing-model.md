# ADR-0011: Public Artifact Publishing Model

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs a stable public read model for the web application and external read-only consumers. The user wants a real database foundation, but the public-facing consumption path must stay simple and deployment-friendly.

## Decision

The canonical public read model is:

- a promoted normalized SQLite snapshot
- generated JSON exports derived from that SQLite snapshot

Publication rules:

- SQLite is the canonical normalized source of truth for public academic data.
- JSON exports are stable read-only public projections for the web and external consumers.
- Raw downloaded source files are not the canonical public artifact.
- The promoted public dataset must live in a dedicated public data directory inside the repository.

Export families:

- boletines index and detail
- school calendar
- payment calendar
- regulations index and section tree
- schedules by period
- source metadata

Consumer rules:

- the web application should read stable JSON or read-only API projections derived from the promoted SQLite snapshot
- external AI consumers should read JSON or read-only endpoints, not scrape upstream public sources themselves

## Consequences

- SQLite gives the project a normalized internal backbone.
- JSON exports keep the eventual frontend lightweight and decoupled.
- Publication remains simple enough for repository-hosted artifacts and low-cost deployment paths.

## Alternatives Considered

### SQLite only

Rejected. That makes static and external consumers less convenient than they need to be.

### JSON only

Rejected. That weakens normalization, validation, and cross-source joins.

## Open Questions

- Whether later slices should expose the JSON exports directly from static hosting, read them through the API, or support both paths.
