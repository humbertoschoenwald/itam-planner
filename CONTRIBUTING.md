# Contributing to `itam-planner`

Thank you for helping improve `itam-planner`.

## Before You Start

This repository is documentation-driven and ADR-first.

Before making structural changes:

1. read `AGENTS.md`
2. read the relevant `.cursor/rules/*.mdc`
3. read the cited ADRs in `docs/adr/`

## If You Need a GitHub Account

If you do not already have a GitHub account:

1. go to [GitHub Sign Up](https://github.com/signup)
2. create your account
3. verify your email address
4. return to this repository and open an issue or fork the project

## How to Report Something

Use the GitHub issue templates in this repository:

- `Bug Report`: broken behavior in the app or pipeline
- `Data Correction`: incorrect normalized academic data
- `Source Drift`: upstream public source changed and parsing or validation broke
- `Feature Request`: new capability or UX proposal

When possible, include:

- the URL of the upstream source
- the academic period or document involved
- screenshots or copied text from the public source
- expected behavior
- actual behavior

## Contribution Expectations

- Keep repository-facing content in English.
- Use Conventional Commits.
- Keep changes atomic.
- Update or add tests whenever behavior changes.
- Do not add copied code or copied documentation from third-party repositories.
- Do not introduce auth, telemetry, or backend user-state storage.

## Local Quality Bar

For Python changes:

```sh
uv run --project apps/api --group dev pytest
uv run --project apps/api --group dev ruff check apps/api
uv run --project apps/api --group dev basedpyright apps/api/src
```

For web changes:

```sh
pnpm install
pnpm lint:web
pnpm test:web
pnpm typecheck:web
```

## Community Contact

If you want to report something informally before opening an issue, creator contact is available on [Instagram](https://www.instagram.com/humbertoschoenwald/).

That contact path is community-facing only and is not official ITAM support.
