# ADR Workflow

This repository is documentation-driven and ADR-first.

## Authority Model

The authority model is intentionally split into layers:

1. `docs/adr/**/*.md` is the canonical source of repository doctrine.
2. `.cursor/rules/**/*.mdc` is the operational layer derived from ADR.
3. Repository configs and editor settings are derived from `.cursor/rules` and therefore indirectly from ADR.
4. Code and scaffolding are downstream artifacts.

`AGENTS.md` is only a bootstrap file. It exists to route any agent into the doctrine pipeline. It is not the repository's technical source of truth.

## Required Workflow

Every material repository decision must follow this order:

1. Create or update the relevant ADR.
2. Derive or update the matching `.cursor/rules` file.
3. Update repository configs that operationalize that rule.
4. Only then update scaffolding or code.

If a config file or automation requires a new policy that is not already stated in ADR, stop and add the ADR first.

## Status Definitions

- `Accepted`: active doctrine for the repository.
- `Draft`: under active design and not yet binding.
- `Superseded`: retained for history but replaced by a newer ADR.

## Traceability Requirement

Every `.cursor/rules/*.mdc` file must cite at least one ADR.

Every high-impact config file should reference the ADR that justifies it in a comment when the file format permits comments.

Current high-impact derived files include:

- `AGENTS.md`
- `.editorconfig`
- `.gitattributes`
- `.vscode/settings.jsonc`
- `cspell.jsonc`
- `pyproject.toml`
- `tsconfig.json`

## Current ADR Set

- `0000-repository-doctrine.md`
- `0001-scope-and-phase.md`
- `0002-stack-and-version-policy.md`
- `0003-architecture-and-boundaries.md`
- `0004-state-privacy-and-public-data.md`
- `0005-deployment-and-runtime.md`
- `0006-quality-gates-and-automation.md`
- `0007-frontend-experience.md`
- `0008-legal-originality-and-bibliography.md`
- `0009-ingestion-and-snapshot-lifecycle.md`
- `0010-academic-catalog-schema-and-applicability.md`
- `0011-public-artifact-publishing-model.md`
