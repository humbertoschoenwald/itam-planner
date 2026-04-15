# ADR-0004: State, Privacy, and Public Data

- Status: Accepted
- Date: 2026-04-15

## Context

The product is privacy-first. The user explicitly wants all personal state to remain in the browser and rejects authentication, telemetry, and backend persistence of personal schedules.

At the same time, the public academic catalog is institution-derived public information and may be stored for performance, normalization, or reliability.

## Decision

User-specific state rules:

- Personal schedule state lives only in browser `localStorage`.
- The backend must not store identity, preferences, or selected schedules.
- No user accounts.
- No server-side sessions.
- No analytics.
- No tracking cookies.
- No personal telemetry.

Public data rules:

- Persistence is allowed only for public catalog data and derived public metadata.
- The default public persistence model is a public SQLite snapshot or equivalent public artifact generated outside the Vercel runtime.
- Public persistence must remain replaceable by a future ADR if hosting constraints require managed storage.
- Public data storage must never become a side channel for personal schedule state.

Token portability:

- Import and export mechanisms for personal schedules may exist later.
- Any such mechanism must remain client-driven and privacy-preserving.

## Consequences

- The privacy model stays simple and defensible.
- Public data can be cached and normalized without compromising users.
- The repository avoids legal and operational complexity tied to personal data storage.

## Alternatives Considered

### Store schedule state on the backend for convenience

Rejected. That violates the core product principle.

### Forbid all persistence, including public catalog storage

Rejected. Public data persistence is operationally useful and does not violate the privacy model when correctly separated.

### Use cookies or IndexedDB as canonical personal state

Rejected. The canonical v1 personal state store is `localStorage`.

## Open Questions

- Whether future offline features justify a secondary local cache beyond `localStorage`, while still keeping `localStorage` canonical for user-owned schedule state.
