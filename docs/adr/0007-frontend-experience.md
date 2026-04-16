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
- The public navigation must center on `Home`, `Planner`, and `Calendario` as the primary destinations.
- Secondary surfaces such as community/help and external-AI setup must live inside those primary destinations rather than competing for primary-nav space.
- The onboarding flow must explicitly state that no account is required.
- The onboarding flow must collect entry term through structured selectors for academic season and year rather than a free-text input.
- The onboarding year selector must derive its options from the published catalog applicability window instead of exposing arbitrary years that the catalog cannot satisfy.
- The onboarding flow must keep plan selection hidden until the entry-term selectors are complete enough to filter candidate plans.
- The first stable user-facing routes are `/`, `/planner`, `/planner/onboarding`, `/calendar`, and a community/help surface.
- `/` is the public home and discovery surface.
- `/planner` is the dedicated planner shell route.
- `/planner/onboarding` is the dedicated embedded onboarding route that prepares browser-local planner context.
- `/planner` must degrade safely when onboarding state is incomplete and redirect toward `/planner/onboarding`.
- `/planner` must treat stale browser-local profile state as incomplete whenever the stored entry term no longer yields an applicable active plan in the current published catalog.
- Standard browser tabs may redirect browser-side from `/planner` to `/planner/onboarding`, but the route must remain usable even if that redirect is blocked or unstable in a constrained client such as an installed web app.
- Compatibility redirects may exist temporarily for older public routes such as `/onboarding`, but they must not remain part of the primary user-facing flow.
- The dedicated planner route must keep the initial document lean. Heavy schedule detail payloads belong in precomputed JSON artifacts fetched on demand, not embedded wholesale into the initial HTML shell.
- Planner onboarding should use a guided stepper with explicit `Back` and `Next` progression, one primary decision per screen, and a lightweight introductory step that explains what the planner will configure.
- Planner onboarding must collect the entry term, a searchable deduplicated program choice, and the preferred swipe-direction mode for the planner shell before finalizing setup.
- Planner onboarding should deduplicate visible plan rows into alphabetized searchable program choices whenever multiple visible plans belong to the same program title for the selected entry term.
- Planner onboarding should create the default launch planner widget set browser-locally during final setup instead of forcing widget selection as primary onboarding friction.
- The launch planner surface must support `Today`, `Week`, and `Subjects / Plans` widgets, and `Today` must keep the highest visual priority whenever it is enabled.
- The public runtime should recover silently from browser-owned state failures whenever possible and should never announce storage-reset internals in normal UI copy.
- If runtime recovery still needs a visible user-facing state, it must stay generic, must not leak implementation details such as `localStorage`, and must not crash the surrounding route shell.
- Visible route-level error states must not wipe browser-local planner state automatically. If a recovery action really needs to reset browser-local state, it must be explicit and user-triggered.
- The public product should keep an explicit `Under Construction` notice visible while core planner, data, and AI slices are still incomplete.
- SEO is a first-class public requirement: canonical metadata, crawlable route metadata, sitemap coverage, and machine-readable structured data must be treated as product work, not marketing afterthought.
- Visible UI strings, selector labels, locale labels, and other locale-dependent text must come from locale configuration rather than hardcoded component strings.
- Keep interaction logic, browser persistence, and presentation styling loosely coupled so the visual system can be replaced without rewriting planner behavior.
- The website must never instruct users to install the app manually through browser-native entries such as “Add to Home Screen”.
- The primary navigation bar should remain sticky for a substantial portion of the scroll experience, respect browser safe areas, and use light blur without fighting Safari chrome.
- Swipe navigation belongs only to the top navigation surface, not to the whole page.
- Swipe interaction and swipe-teaching copy are mobile-phone-only behavior. Tablet and desktop navigation should rely on pointer and keyboard interactions instead of swipe gestures.
- Swipe preference may be chosen during onboarding and updated later through interaction, but swipe behavior must remain deterministic and must never change the semantic destination set.
- The embedded planner-onboarding experience should teach the planner-to-home swipe shortcut only on mobile-phone layouts.
- The embedded planner-onboarding experience may finish with a short client-side setup transition, but that transition must stay browser-local, bounded, and non-blocking.
- The public product must expose a small persistent footer with links to Terms and Privacy.
- The visual language should favor layered gradients, monochrome noise, motion-driven atmosphere, and floating accent objects instead of large flat surfaces.
- Treat Apple atmosphere, Proton Authenticator web, and Perplexity Comet as inspiration references for layout density, atmospheric surfaces, and motion cues only. Do not copy their assets, code, or distinctive strings.
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
