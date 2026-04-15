# ADR-0006: Quality Gates and Automation

- Status: Accepted
- Date: 2026-04-15

## Context

The repository is meant to feel rigorous and professionally maintained from the start. Local and CI quality gates need to be explicit before technical scaffold work begins.

## Decision

Commit and versioning rules:

- Use Conventional Commits.
- Use short-lived branches with clear prefixes such as `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `ci/`, `chore/`, and `build/`.
- Use CalVer with the format `YY.MM.PATCH`.
- Generate `CHANGELOG.md` from conventional commit history rather than maintaining it manually.

Repository quality tools:

- JavaScript and TypeScript: `ESLint`, `Prettier`, `tsc --noEmit`
- Python: `Ruff`, `basedpyright`
- Repository-wide text quality: `cspell`
- Markdown: `markdownlint-cli2`
- YAML: `yamllint`
- Shell: `ShellCheck`
- Dockerfiles: `Hadolint`
- GitHub Actions: `actionlint`
- Conventional Commit enforcement: `Commitlint`

Execution rules:

- Local hooks must be version-controlled under `.githooks/`.
- `pre-commit` runs the fast local gate.
- `pre-push` runs the stronger local gate.
- CI must enforce the same policy classes as local tooling.
- Repository settings and tool configs must not silently relax these rules.

Text normalization rules:

- Use UTF-8.
- Use LF line endings for repository text files unless platform-specific scripts require CRLF.
- Insert final newlines.
- Keep trailing whitespace trimmed except where the file type explicitly requires otherwise.

## Consequences

- The repository becomes stricter from day one.
- Contributors get earlier feedback locally.
- Tooling drift is easier to detect because the policy is centralized.

## Alternatives Considered

### Defer quality tooling until code exists

Rejected. The doctrine layer itself is repository content that benefits from enforcement.

### Use only CI and skip local hooks

Rejected. Shift-left validation is part of the repository philosophy.

### Use SemVer instead of CalVer

Rejected. The repository explicitly chose time-oriented versioning for governance and releases.

## Open Questions

- Whether release automation should tag every merge to the default branch or only explicit release commits.
