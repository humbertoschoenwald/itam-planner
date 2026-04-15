Read `/AGENTS.md` first.

Then read every applicable rule under `/.cursor/rules/**/*.mdc`.

Those rules cite the canonical doctrine under `/docs/adr/**/*.md`. Repository policy, stack decisions, quality gates, scope, deployment, privacy rules, and workflow rules must trace back to ADR.

Do not bypass the doctrine pipeline:

1. ADR
2. `.cursor/rules`
3. repository configs
4. code and scaffolding

If a requested change needs new policy, update ADR first.
