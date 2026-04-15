# ADR-0007: Frontend Experience

- Status: Accepted
- Date: 2026-04-15

## Context

The user wants the product to feel modern, lightweight, beautiful, and especially strong on Apple devices. Safari on iPhone is the primary target, followed by Chrome and other evergreen browsers across phones, iPad, macOS, and Windows.

The repository language policy also differs from the product language policy.

## Decision

Frontend experience rules:

- Design mobile-first.
- Treat Safari on iPhone as the primary browser target.
- Support iPad, macOS, Windows, Chrome, and other evergreen browsers as secondary targets.
- Prefer stable browser APIs with good WebKit behavior.
- Keep the frontend lightweight and visually polished.
- Optimize for touch ergonomics, responsive behavior, and accessibility from the beginning of runtime scaffold work.

Language rules:

- Repository-facing content is English only.
- Product UI defaults to Spanish (`es-MX`).
- English is the secondary product locale.

Framework discipline:

- Use `Next.js` App Router as the canonical frontend framework.
- Do not couple the runtime to a host-specific routing scheme.
- Keep server-side dependencies disciplined so the frontend remains portable and independently deployable.

## Consequences

- The user experience target is explicit before UI work begins.
- The repository avoids mixing documentation language with product language.
- Frontend architecture remains compatible with a refined Vercel deployment path without depending on it.

## Alternatives Considered

### Treat desktop Chrome as the primary target

Rejected. The product priorities are mobile-first and Safari-first.

### Make the repository bilingual

Rejected. Repository-facing English-only policy reduces ambiguity and review noise.

### Leave the framework choice open

Rejected. The repository needs a mainstream, concrete frontend baseline now.

## Open Questions

- Whether the first runtime scaffold should include a PWA shell and iOS install guidance or leave that for a later slice.
