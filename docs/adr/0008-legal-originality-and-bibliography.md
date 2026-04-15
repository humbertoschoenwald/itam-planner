# ADR-0008: Legal, Originality, and Bibliography

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs explicit rules for originality, licensing, public positioning, and documentation hygiene. The project is inspired by the scheduling problem space around ITAM, but it must remain a fully original implementation.

The user also requires a maintained bibliography of tools and standards used by the repository.

## Decision

Licensing and legal notice rules:

- The repository license is MIT.
- The repository and product must display a visible disclaimer stating that the project is an independent open-source community effort and is not affiliated with, endorsed by, or maintained by ITAM.
- The repository must not present itself as an official institutional service.

Originality rules:

- This codebase is a fully original implementation written from scratch.
- No source code may be copied, translated, ported, lightly modified, or reused from prior repositories.
- Third-party repositories may be used for inspiration, requirements analysis, and behavioral research only.
- Do not copy proprietary assets, unique strings, or documentation text line by line.

Bibliography rules:

- A maintained bibliography document must exist under `docs/bibliography/`.
- Major tools, standards, and external references used by repository doctrine must be listed there with official links.
- ADRs may reference those materials rather than duplicating link lists in every file.

## Consequences

- The repository gets a clear legal posture.
- Future contributors have a documented standard for originality.
- Tooling and standards remain auditable over time.

## Alternatives Considered

### Omit a bibliography and rely on scattered links

Rejected. That would make doctrine harder to review and update.

### Use a softer originality statement

Rejected. The repository wants an explicit from-scratch position.

### Delay license selection

Rejected. Licensing should be clear before broader collaboration starts.

## Open Questions

- Whether a separate trademark or naming ADR becomes necessary if public visibility materially increases.
