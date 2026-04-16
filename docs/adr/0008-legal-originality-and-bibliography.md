# ADR-0008: Legal, Originality, and Bibliography

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs explicit rules for originality, licensing, public positioning, and documentation hygiene. The project is inspired by the scheduling problem space around ITAM, but it must remain a fully original implementation.

The user also requires a maintained bibliography of tools and standards used by the repository.

## Decision

Licensing and legal notice rules:

- The repository license is MIT.
- The public product must expose Terms and Privacy pages.
- The non-affiliation disclaimer belongs in the legal surfaces, especially Terms, rather than being repeated as noisy primary-screen marketing copy.
- The repository and product must display a visible disclaimer stating that the project is an independent open-source community effort and is not affiliated with, endorsed by, or maintained by ITAM.
- The repository must not present itself as an official institutional service.

Originality rules:

- This codebase is a fully original implementation written from scratch.
- No source code may be copied, translated, ported, lightly modified, or reused from prior repositories.
- Third-party repositories may be used for inspiration, requirements analysis, and behavioral research only.
- Do not copy proprietary assets, unique strings, or documentation text line by line.
- Repository-facing docs must explicitly credit `Horarios-ITAM` as inspiration when describing project lineage or problem-space context.
- Public academic ITAM source pages and documents must be acknowledged as source material for ingestion when repository docs describe data provenance.
- Third-party mirrors, caches, or unofficial ITAM aggregators are prohibited as canonical production scraping sources.
- `horariositam.com` must not be used as a production scraping source or as authoritative data provenance.

Bibliography rules:

- A maintained bibliography document must exist under `docs/bibliography/`.
- Major tools, standards, and external references used by repository doctrine must be listed there with official links.
- ADRs may reference those materials rather than duplicating link lists in every file.
- The bibliography may include inspiration and public-source references in addition to tooling references when they materially shape repository doctrine.
- Design inspiration references may be listed there when they shape the intended public visual language, but they remain inspiration only and may not be copied directly.
- Proton Authenticator web and Perplexity Comet may be cited as visual inspiration references when repository docs describe the intended design direction, but they remain non-authoritative inspiration only.

## Consequences

- The repository gets a clear legal posture.
- Future contributors have a documented standard for originality.
- Tooling and standards remain auditable over time.
- Attribution stays explicit without weakening the from-scratch authorship position.

## Alternatives Considered

### Omit a bibliography and rely on scattered links

Rejected. That would make doctrine harder to review and update.

### Omit explicit inspiration credit

Rejected. The repository wants clear attribution without any ambiguity about code originality.

### Use a softer originality statement

Rejected. The repository wants an explicit from-scratch position.

### Delay license selection

Rejected. Licensing should be clear before broader collaboration starts.

## Open Questions

- Whether a separate trademark or naming ADR becomes necessary if public visibility materially increases.
