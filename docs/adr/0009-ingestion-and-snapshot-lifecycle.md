# ADR-0009: Ingestion and Snapshot Lifecycle

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs a deterministic ingestion lifecycle for public academic sources. Source fetching, parsing, validation, and publication must be separable so a broken scrape never overwrites the last good public dataset.

## Decision

The ingestion lifecycle is:

1. fetch public source content into a working area
2. compare hashes and discovered source sets against the last promoted release
3. if nothing changed, record `no_changes` and stop
4. if anything changed, record a scrape run and source snapshots with content hashes
5. parse into a staging SQLite database
6. validate required counts, required fields, and schema invariants
7. generate JSON exports from the staging SQLite database
8. atomically promote the SQLite snapshot and JSON exports only if validation passes

Source lifecycle rules:

- Every upstream fetch must create a source snapshot record.
- Every snapshot must keep upstream URL, observed time, content hash, and parse status.
- Source artifacts may be cached temporarily for parsing, but cached raw files are not the canonical public artifact.
- Failed parsing or failed validation must leave the last promoted public dataset untouched.
- When an upstream discovery family mixes canonical and non-canonical artifacts, source snapshots for incompatible artifacts may be marked `failed` without blocking promotion, but only if the canonical staging dataset still validates.
- Source snapshot status values may include `unchanged` when a live comparison determines that the upstream content did not change.

Change-handling rules:

- Comparison must always target the last promoted release, not merely the last attempted run.
- A live run with identical content hashes and identical discovered source sets must not rebuild or promote a new dataset.
- A changed run that fails validation must emit drift diagnostics to a machine-readable file under `public-data/working/`.
- The boletines discovery source may contain PDFs that do not fit the current v1 academic-plan schema. Those artifacts remain tracked through source snapshots, but only compatible plan-structured bulletins populate the canonical bulletin tables and exports.
- The repository does not auto-rewrite or auto-learn new parser logic in v1. Parser updates remain manual and test-backed.

Scheduling rules:

- Heavy public scraping runs on the default schedule of `03:33` in `America/Mexico_City`.
- Manual runs are allowed for development and recovery.

## Consequences

- Publication becomes safer and auditable.
- The pipeline can evolve source by source without risking a broken public dataset.
- Scrape drift is visible through snapshot metadata and validation failures.
- Upstream polling becomes cheaper because unchanged runs can stop before the expensive parsing and promotion phases.

## Alternatives Considered

### Parse directly into the live public database

Rejected. That makes failed or partial runs too dangerous.

### Publish raw artifacts as the main dataset

Rejected. Raw artifacts are useful inputs, not the final public data contract.

### Rebuild on every live run even when nothing changed

Rejected. That adds unnecessary work and noise while making drift harder to distinguish from ordinary refreshes.

## Open Questions

- Whether future runs should retain a limited history of promoted snapshots in-repo or only keep the latest promoted version there.
