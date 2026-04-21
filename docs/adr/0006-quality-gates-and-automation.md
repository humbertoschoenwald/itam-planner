# ADR-0006: Quality Gates and Automation

- Status: Accepted
- Date: 2026-04-15

## Context

The repository is meant to feel rigorous and professionally maintained from the start. Local and CI quality gates need to be explicit before technical scaffold work begins.

## Decision

Commit and versioning rules:

- Use Conventional Commits.
- The repository currently operates in single-maintainer mode.
- `main` is the default working branch and the default integration branch for day-to-day development.
- Direct commits and pushes to `main` are the normal workflow while the repository remains in single-maintainer mode.
- Short-lived branches with prefixes such as `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `ci/`, `chore/`, and `build/` are optional tools for risky, disruptive, or experimental work, not the default path.
- Pull requests are optional in single-maintainer mode. They may be used for review history, large changes, or safer merge boundaries, but they are not required for routine development.
- Use CalVer with the format `YY.MM.PATCH`.
- Generate `CHANGELOG.md` from conventional commit history rather than maintaining it manually.
- Regenerate `CHANGELOG.md` automatically on every push to `main`.
- Group automated changelog entries by the push date in `America/Mexico_City`.
- Allow repeated generated subsection headings such as `Features` and `Documentation` across different changelog date sections. Markdown linting must treat those headings as valid when they are separated by parent date headings.
- Use GitHub Actions plus the repository `GITHUB_TOKEN` to commit the generated `CHANGELOG.md` update back to `main` when the file changed.
- Use SSH for Git remotes and push operations. Do not normalize HTTPS push URLs as a routine workflow.

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
- JavaScript/TypeScript coverage: `Vitest` with Cobertura XML output
- Python coverage: `pytest-cov` with Cobertura XML output
- Per-test runtime budget enforcement: `Vitest`, `node --test`, and `pytest-timeout`

Mandatory test policy:

- Every parser, normalizer, repository, exporter, and applicability resolver must have unit tests.
- Every user-facing control, locale-dependent label mapping, and browser-owned state boundary must have regression coverage when its behavior changes.
- Every behavior change must add or update tests in the same change when needed.
- No parser or schema change ships without matching fixture coverage.
- Unit tests must be network-free and deterministic.
- Browser-storage adapters, onboarding guards, runtime fallbacks, and other resilience layers must include edge-case tests for malformed state, blocked persistence, and degraded browser behavior when those behaviors change.
- Architecture-boundary tests must fail if UI modules bypass the presenter layer or if locale-facing text escapes the locale-dictionary path.
- Live source checks may exist later as smoke coverage, but they must not replace unit coverage.
- Unless a test has a documented exception, any individual test that exceeds 40 seconds is a critical failure.

Execution rules:

- Local hooks must be version-controlled under `.githooks/`.
- `pre-commit` runs the fast local gate.
- `pre-push` runs the stronger local gate.
- `pre-push` must mirror the blocking CI jobs closely enough to catch stable web, current-line web, coverage generation, and API fixture-promotion failures before network push.
- `pre-push` is the extreme local gate. It may run a fuller local mirror than hosted CI, but it must stay intentionally optimized rather than wasting local time on redundant work.
- Local blocking gates must run the stable `Node.js 24` web path and the current-line `Node.js 25` web path before allowing a push.
- CI must enforce the same policy classes as local tooling.
- Repository settings and tool configs must not silently relax these rules.
- Local workflow must not introduce artificial PR or branch overhead for a single maintainer.
- GitHub Actions may use the repository `GITHUB_TOKEN` for repository automation such as scheduled public-data refresh commits when SSH is not available in the hosted runner context.
- Required checks should stay green on the stable Node baseline, while current-line Node compatibility may run as a non-blocking canary.
- API fixture-ingest validation must run against an isolated temporary public-data root during quality gates. Quality checks must not require overwriting the committed promoted public snapshot just to validate fixture ingest.
- Hosted GitHub CI should prefer lightweight blocking checks that still validate the supported codepaths without spending minutes on redundant heavy work already enforced locally by `pre-push`.
- Coverage generation must emit a root `coverage.xml` artifact that merges the current web and API Cobertura reports.
- Hosted CI may skip heavyweight non-essential work such as duplicate canary builds when local `pre-push` already covers those concerns.

Text normalization rules:

- Use UTF-8.
- Use LF line endings for repository text files unless platform-specific scripts require CRLF.
- Insert final newlines.
- Keep trailing whitespace trimmed except where the file type explicitly requires otherwise.

Code-literal discipline:

- Magic numbers are prohibited in repository source code. Promote them to named constants or configuration.
- Magic strings are prohibited in repository source code. Promote them to named constants, enumerations, adapters, or locale dictionaries.
- Tests are the only standing exception: use DAMP (Descriptive And Meaningful Phrases) over DRY inside tests when repeated literals improve failure readability.
- Any deliberate exception outside tests must be documented in doctrine and in the relevant config or source comment.

## Consequences

- The repository becomes stricter from day one.
- Contributors get earlier feedback locally.
- Tooling drift is easier to detect because the policy is centralized.

## Alternatives Considered

### Defer quality tooling until code exists

Rejected. The doctrine layer itself is repository content that benefits from enforcement.

### Use only CI and skip local hooks

Rejected. Shift-left validation is part of the repository philosophy.

### Require pull requests for every change

Rejected. For a single maintainer, mandatory PR approval adds friction without adding meaningful safety on routine atomic changes.

### Require short-lived branches for every change

Rejected. While branches remain useful for risky or experimental work, forcing them for every routine change creates unnecessary operational overhead in the current repository stage.

### Use SemVer instead of CalVer

Rejected. The repository explicitly chose time-oriented versioning for governance and releases.

## Open Questions

- Whether future release automation should also create Git tags or GitHub Releases alongside the push-driven changelog update.
