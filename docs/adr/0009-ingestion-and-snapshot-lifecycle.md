# ADR-0009: Ingestion and Snapshot Lifecycle

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs a deterministic ingestion lifecycle for public academic sources. Source fetching, parsing, validation, and publication must be separable so a broken scrape never overwrites the last good public dataset.

## Decision

The ingestion lifecycle is:

1. fetch public source content into a working area
2. record a scrape run and source snapshots with content hashes
3. parse into a staging SQLite database
4. validate required counts, required fields, and schema invariants
5. generate JSON exports from the staging SQLite database
6. atomically promote the SQLite snapshot and JSON exports only if validation passes

Source lifecycle rules:

- Every upstream fetch must create a source snapshot record.
- Every snapshot must keep upstream URL, observed time, content hash, and parse status.
- Source artifacts may be cached temporarily for parsing, but cached raw files are not the canonical public artifact.
- Failed parsing or failed validation must leave the last promoted public dataset untouched.

Scheduling rules:

- Heavy public scraping runs on the default schedule of `03:33` in `America/Mexico_City`.
- Manual runs are allowed for development and recovery.

## Consequences

- Publication becomes safer and auditable.
- The pipeline can evolve source by source without risking a broken public dataset.
- Scrape drift is visible through snapshot metadata and validation failures.

## Alternatives Considered

### Parse directly into the live public database

Rejected. That makes failed or partial runs too dangerous.

### Publish raw artifacts as the main dataset

Rejected. Raw artifacts are useful inputs, not the final public data contract.

## Open Questions

- Whether future runs should retain a limited history of promoted snapshots in-repo or only keep the latest promoted version there.
