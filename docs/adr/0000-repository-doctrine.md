# ADR-0000: Repository Doctrine

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs a single doctrine model that works across Codex, Cursor, Claude, and future agents without allowing policy to fragment across prompt files, editor settings, and ad hoc configs.

The previous state of the repository had placeholders but no canonical doctrine chain. That creates drift, hidden assumptions, and untraceable rules.

## Decision

This repository is documentation-driven and ADR-first.

The authority chain is:

1. `docs/adr/**/*.md`
2. `.cursor/rules/**/*.mdc`
3. repository configs and editor settings
4. code, scaffolding, and automation

`AGENTS.md` is intentionally lightweight. It exists only to force every agent to enter the doctrine chain by reading `.cursor/rules`, which then point back to ADR.

All material decisions must begin in ADR, including:

- scope changes
- stack changes
- version policy
- quality gates
- deployment rules
- privacy rules
- legal notices
- naming rules
- workflow automation
- editor and tool policy

All repository-facing content must be written in English.

Each derived rule file must cite its source ADR. Each high-impact config should cite its source ADR whenever the file format supports comments.

## Consequences

- Repository behavior becomes auditable and reproducible.
- Agents cannot introduce policy by stealth in config files.
- Reviewers can trace operational rules back to doctrine.
- The repository accepts extra documentation overhead in exchange for long-term clarity.

## Alternatives Considered

### Use `AGENTS.md` as the canonical doctrine

Rejected. That model is too agent-specific and too easy to overgrow into an unstructured prompt document.

### Split doctrine evenly across `AGENTS.md`, README files, and editor configs

Rejected. Equal authority across multiple surfaces causes conflict and weak traceability.

### Keep doctrine informal until code exists

Rejected. The repository is intentionally scaffolded from doctrine forward.

## Open Questions

- Whether future non-Cursor rule systems should be generated automatically from ADR rather than maintained by hand.
