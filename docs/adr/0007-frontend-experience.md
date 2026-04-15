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
- Support both light and dark presentation from the beginning of runtime work.
- Detect the preferred color scheme from the operating system by default rather than requiring account-backed preferences.
- Optimize for touch ergonomics, responsive behavior, and accessibility from the beginning of runtime scaffold work.
- Target WCAG 2.2 Level AA for the public product experience.
- Do not claim WCAG conformance publicly until the relevant UI slice has been audited against the applicable success criteria.
- Treat contrast, keyboard access, focus visibility, semantics, and touch-target sizing as explicit product requirements rather than optional polish.

Language rules:

- Repository-facing content is English only.
- Product UI defaults to Spanish (`es-MX`).
- English is the secondary product locale.

Framework discipline:

- Use `Next.js` App Router as the canonical frontend framework.
- Do not couple the runtime to a host-specific routing scheme.
- Keep server-side dependencies disciplined so the frontend remains portable and independently deployable.

Initial product-surface rules:

- The home experience starts with onboarding rather than account creation.
- The onboarding flow must explicitly state that no account is required.
- The first stable user-facing routes are `/`, `/onboarding`, `/planner`, and a community/help surface.
- `/` is a lightweight public home and must not be the primary planner shell.
- `/onboarding` is the dedicated profile bootstrap route for browser-local student context.
- `/planner` is the dedicated planner shell route.
- `/planner` must degrade safely when onboarding state is incomplete.
- Standard browser tabs may redirect browser-side from `/planner` to `/onboarding`, but the route must remain usable even if that redirect is blocked or unstable in a constrained client such as an installed web app.
- The dedicated planner route must keep the initial document lean. Heavy schedule detail payloads belong in precomputed JSON artifacts fetched on demand, not embedded wholesale into the initial HTML shell.
- The Connect to ChatGPT flow comes after the planner state exists and may be teased earlier, but its final route contract is deferred until that slice begins.

## Consequences

- The user experience target is explicit before UI work begins.
- The repository avoids mixing documentation language with product language.
- Frontend architecture remains compatible with a refined Vercel deployment path without depending on it.
- The first runtime shell is forced toward a practical onboarding and planner flow instead of an empty marketing landing page.

## Alternatives Considered

### Treat desktop Chrome as the primary target

Rejected. The product priorities are mobile-first and Safari-first.

### Make the repository bilingual

Rejected. Repository-facing English-only policy reduces ambiguity and review noise.

### Leave the framework choice open

Rejected. The repository needs a mainstream, concrete frontend baseline now.

## Open Questions

- Whether the first Connect to ChatGPT slice should initially prioritize browser instructions, iPhone instructions, or both at once.
- When the first dedicated branding pass should replace the provisional scaffold icons and visual marks.
