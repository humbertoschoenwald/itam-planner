# Contributing to `itam-planner`

`itam-planner` is ADR-first, test-driven, and intentionally strict.

This file is for contribution quality only. User support, bug reports, and issue-template guidance belong in the web app and the GitHub issue UI, not here.

## Read Before Changing Anything

Before a structural or behavioral change:

1. read `AGENTS.md`
2. read the relevant `.cursor/rules/*.mdc`
3. read the cited ADRs in `docs/adr/`

If your change conflicts with doctrine, update doctrine first or stop.

## Quality Bar

Every accepted contribution must satisfy all of the following:

- Repository-facing content stays in English.
- Changes remain atomic and traceable.
- Conventional Commits are required.
- Behavior changes add or update tests in the same change when needed.
- Parser, schema, repository, exporter, and applicability logic changes require deterministic unit coverage.
- No copied code, copied documentation, or lightly modified third-party code is allowed.
- No auth, telemetry, analytics, tracking cookies, or backend user-state storage may be introduced.
- `uv` is the only supported Python workflow.
- The web and API paths must stay mainstream and maintainable.

## Required Local Checks

Run the full repository gate before pushing:

```sh
pnpm install
pnpm verify
```

The gate currently includes repository linting, web lint/typecheck/test/build, API lint/typecheck/test, and deterministic fixture regeneration for the public catalog snapshot.

## Focus Areas

Good contributions usually fall into one of these categories:

- parser fixes for public ITAM sources
- normalization improvements for the public catalog
- browser-local planner UX improvements
- accessibility and Safari-first usability fixes
- documentation and doctrine improvements
- tests that prevent regressions in parsing, exports, and planner state

## Rejection Conditions

The maintainers should reject or request changes for contributions that:

- skip doctrine updates when the architecture changed
- weaken privacy guarantees
- lower the test bar
- mix unrelated concerns in one change
- add stale, niche, or unnecessary tooling
- hardcode deployment-specific assumptions into the core runtime
- blur the boundary between public academic data and student-local state

## Commit Shape

Prefer one concern per commit.

Examples:

- `fix(api): handle unchanged source snapshots in live refresh`
- `test(web): cover student-code regeneration on planner changes`
- `docs(adr): clarify deployment invariants for ai context`
- `ci(repo): add Node 24 baseline and Node 25 canary checks`
