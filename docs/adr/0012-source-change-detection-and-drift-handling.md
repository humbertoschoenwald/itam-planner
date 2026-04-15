# ADR-0012: Source Change Detection and Drift Handling

- Status: Accepted
- Date: 2026-04-15

## Context

The repository now has a working public-data ingestion pipeline, but live runs still need a stricter operational contract. The user explicitly wants the scraper to check whether upstream pages or documents changed, skip expensive rebuilds when nothing changed, and fail closed when upstream drift breaks parsing or validation.

## Decision

Live ingestion must be change-aware.

The live comparison algorithm is:

1. fetch the current upstream discovery pages and dependent source payloads needed for comparison
2. compute content hashes for the fetched source set
3. compare the fetched source set against the last promoted release
4. if both hashes and discovered source sets match, stop with `no_changes`
5. if anything changed, rebuild the full staging dataset
6. validate the rebuilt dataset
7. if validation passes, promote the new release
8. if validation fails, keep the last promoted release and record `drift_detected`

Status rules:

- scrape run statuses: `running`, `succeeded`, `failed`, `no_changes`, `drift_detected`
- source snapshot parse statuses: `parsed`, `skipped`, `failed`, `unchanged`

Drift handling rules:

- Drift reports must be machine-readable and written under `public-data/working/`.
- Raw changed artifacts may remain in the ignored working area for manual repair work.
- Parser repair is manual in v1 and must arrive with updated tests and fixtures.

## Consequences

- Unchanged runs stop early.
- Broken upstream changes do not overwrite the last good public dataset.
- Source drift becomes visible and reviewable instead of silently corrupting outputs.

## Alternatives Considered

### Rebuild on every run

Rejected. That wastes work and obscures the distinction between ordinary polling and source drift.

### Auto-adapt parser logic at runtime

Rejected. That is too opaque and risky for the repository's current quality bar.

## Open Questions

- Whether future versions should keep a longer retained history of drift reports and raw changed artifacts.
