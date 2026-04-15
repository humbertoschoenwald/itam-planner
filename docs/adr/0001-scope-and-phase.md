# ADR-0001: Scope and Phase

- Status: Accepted
- Date: 2026-04-15

## Context

The repository has to establish a high-rigor foundation before technical scaffolding expands. Without a hard scope boundary, agents will overbuild product logic, mix runtime decisions with governance, and create irreversible structure too early.

## Decision

The current phase is the doctrine and governance baseline.

The current implementation slice includes:

- `AGENTS.md`
- ADR doctrine
- derived `.cursor/rules`
- derived repository configs
- legal and bibliography documentation

The current implementation slice does not include:

- full `apps/web` scaffolding
- full `apps/api` scaffolding
- scraping logic
- schedule-building logic
- data model implementation beyond policy level
- CI pipelines
- Git hooks
- package manager bootstrapping
- deployment manifests

The artifact pipeline for the current phase is:

1. write ADR
2. derive rules
3. derive configs
4. only then start technical scaffold work in a later slice

## Consequences

- The repository gets a clean doctrine baseline before structural code lands.
- Future scaffold work has a smaller decision surface.
- The current repository remains intentionally incomplete at runtime level.

## Alternatives Considered

### Start by generating the full monorepo scaffold immediately

Rejected. That would mix architecture decisions with implementation details before doctrine is locked.

### Delay doctrine until after the first runnable prototype

Rejected. The repository is specifically meant to be future-proof and agent-friendly from the start.

## Open Questions

- Whether the next implementation slice should include the monorepo root first or the documentation-to-config automation layer first.
