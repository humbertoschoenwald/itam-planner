# ADR-0002: Stack and Version Policy

- Status: Accepted
- Date: 2026-04-15

## Context

The repository must stay modern, mainstream, professional, and easy to adopt. The project should feel current to experienced industry engineers while remaining conservative in its choice of ecosystems.

The user explicitly rejected a production path that depends on Rust, C, C++, or .NET in the initial repository doctrine. The user also explicitly required `uv` as the only Python workflow.

## Decision

The canonical stack for the initial production path is:

- JavaScript runtime baseline: `Node.js 24`
- JavaScript and TypeScript workspace management: `pnpm workspaces`
- Web framework: `Next.js` App Router
- UI framework: `React`
- Frontend language: `TypeScript` in strict mode
- Frontend styling: `Tailwind CSS`
- Frontend components: `shadcn/ui`
- Frontend state: `Zustand`
- Python workflow: `uv` only
- Backend framework: `FastAPI`
- Backend validation: `Pydantic v2`
- HTML parsing: `BeautifulSoup4` plus `lxml`
- browser automation for edge cases: `Playwright`
- contract generation: `openapi-typescript`

Python workflow requirements:

- Do not use `pip`, `pip-tools`, `poetry`, `pipenv`, or alternative Python workflow managers.
- Python environments, dependency synchronization, command execution, and lock management must flow through `uv`.

Version policy requirements:

- Prefer the latest stable release line available at the time of implementation.
- Treat `Node.js 24` as the required stable baseline for repository automation and local setup documentation.
- Use the current `Node.js` line, including `Node.js 25` while it remains current, only as a non-blocking compatibility canary unless doctrine explicitly upgrades the baseline.
- Do not use prerelease, beta, canary, or release-candidate versions unless an ADR explicitly documents the exception.
- Do not pin tool versions in doctrine unless a compatibility constraint requires it.
- Repository versioning uses CalVer `YY.MM.PATCH` as defined in ADR-0006.

The repository does not reserve or advertise a polyglot production path in its initial doctrine.

## Consequences

- The technical path stays modern and familiar.
- Python tooling becomes simpler and more consistent.
- The repository avoids optional-runtime complexity at the doctrine stage.
- Future adoption of a non-canonical stack requires explicit ADR review.

## Alternatives Considered

### Keep the web framework open

Rejected. The repository needs a concrete mainstream baseline now.

### Allow multiple Python workflow managers

Rejected. That creates ambiguity and weakens reproducibility.

### Reserve systems-language modules from day one

Rejected. The initial repository path must stay lean and mainstream.

## Open Questions

- Whether `openapi-typescript` remains sufficient once runtime client generation becomes necessary.
