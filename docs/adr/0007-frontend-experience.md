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
- Desktop and tablet layouts may expose additional secondary navigation actions such as project/help, external-AI setup, inscriptions guidance, configuration, and search in the same top navigation cluster as the primary destinations, but those surfaces must still remain visually secondary to `Home`, `Planner`, and `Calendario`.
- Secondary navigation may also expose less-common official-reference surfaces such as executive education only through secondary or overflow navigation, not as primary destinations.
- The onboarding flow must explicitly state that no account is required.
- The onboarding flow must ask the student to choose the academic level (`undergraduate` or `graduate`) before deriving planner defaults.
- The onboarding flow must collect entry term through structured selectors for academic season and year rather than a free-text input.
- The onboarding year selector must derive its options from published official catalog signals for the selected academic level, including applicable bulletin windows and currently published public periods, instead of exposing arbitrary years unrelated to the current public dataset.
- The onboarding flow must keep plan selection hidden until the entry-term selectors are complete enough to filter candidate plans.
- The first stable user-facing routes are `/`, `/planner`, `/planner/onboarding`, `/calendar`, `/search`, `/project`, `/connect-ai`, `/registration`, `/settings`, `/terms`, and `/privacy`.
- Public route slugs must stay English-only even when the visible UI is Spanish-first.
- `/` is the public home and discovery surface.
- `/planner` is the dedicated planner shell route.
- `/planner/onboarding` is the dedicated embedded onboarding route that prepares browser-local planner context.
- `/planner` must degrade safely when onboarding state is incomplete and redirect toward `/planner/onboarding`.
- `/planner` must treat stale browser-local profile state as incomplete whenever the stored entry term no longer yields an applicable active plan in the current published catalog.
- Standard browser tabs may redirect browser-side from `/planner` to `/planner/onboarding`, but the route must remain usable even if that redirect is blocked or unstable in a constrained client such as an installed web app.
- Compatibility redirects may exist temporarily for older public routes such as `/onboarding`, but they must not remain part of the primary user-facing flow.
- The dedicated planner route must keep the initial document lean. Heavy schedule detail payloads belong in precomputed JSON artifacts fetched on demand, not embedded wholesale into the initial HTML shell.
- Planner onboarding should use a guided stepper with explicit `Back` and `Next` progression, one primary decision per screen, and a lightweight introductory step that explains what the planner will configure.
- Planner onboarding must collect academic level, entry term, one or two searchable base-career choices when applicable, optional official joint-program selections when applicable, default subject selection, and the preferred swipe-direction mode for the planner shell before finalizing setup.
- Planner onboarding must support a dedicated `jointPrograms` academic mode that skips base-career picking and exposes only official joint-program choices for the selected entry term.
- Planner onboarding must sort visible career choices alphabetically and must keep their labels user-facing and locale-driven instead of leaking internal uppercase catalog values.
- Planner onboarding should deduplicate visible plan rows into searchable official career and joint-program choices whenever multiple visible plans belong to the same academic program grouping for the selected entry term.
- Planner onboarding should derive its base-career vocabulary from official ITAM-owned career sources and derive its joint-program vocabulary from official ITAM-owned joint-program sources, while still matching those choices against the published normalized catalog for the selected entry term.
- The public bootstrap layer should also expose official graduate-program references and official double-degree references from ITAM-owned sources for discovery, search, and future graduate onboarding work.
- Planner onboarding should create the default launch planner widget set browser-locally during final setup instead of forcing widget selection as primary onboarding friction.
- The launch planner surface must support `Today`, `Week`, and `Subjects / Plans` widgets, and `Today` must keep the highest visual priority whenever it is enabled.
- The planner should derive an initial semester estimate from the stored entry term plus the current public period that matches the chosen academic level, then use that estimate to seed a default subject set during onboarding. The user must remain free to add or remove subjects later.
- The planner should treat subject selection as a browser-local configuration surface. Default subjects should come from the selected academic programs, but the user must be able to search and add any public subject later.
- The onboarding subject-selection step should foreground the default subjects derived from the chosen academic programs, while still allowing a local search across all published public subjects.
- Planner configuration must allow the user to change swipe preference, review or reset browser-local planner state, and edit selected subjects without rerunning the entire onboarding flow.
- Planner configuration must also own the selected public period and public-group selection controls; the main planner route should not lead with configuration-heavy schedule-picking UI.
- Planner configuration should surface swipe-preference controls only on phone layouts, where swipe navigation actually exists.
- The main planner route should foreground current schedule controls, selected offerings, and planner widgets. Explanatory onboarding-shell marketing copy belongs to home or onboarding, not to the main planner surface.
- Selected subjects must not remain duplicated inside the lower available-subject directory once they already belong to the current browser-local selection.
- The public runtime should recover silently from browser-owned state failures whenever possible and should never announce storage-reset internals in normal UI copy.
- If runtime recovery still needs a visible user-facing state, it must stay generic, must not leak implementation details such as `localStorage`, and must not crash the surrounding route shell.
- Visible route-level error states must not wipe browser-local planner state automatically. If a recovery action really needs to reset browser-local state, it must be explicit and user-triggered.
- The public product should keep an explicit `Under Construction` notice visible while core planner, data, and AI slices are still incomplete.
- SEO is a first-class public requirement: canonical metadata, crawlable route metadata, sitemap coverage, and machine-readable structured data must be treated as product work, not marketing afterthought.
- Visible UI strings, route chrome labels, selector labels, locale labels, ARIA labels, and other locale-dependent text must come from locale dictionaries rather than hardcoded strings inside components or page modules.
- Public metadata text, structured-data descriptions, and other crawlable locale-facing SEO copy must also come from locale dictionaries rather than hardcoded page-module strings.
- Frontend identifiers, enum values, configuration keys, and non-locale component APIs should stay English-only. Spanish belongs in locale dictionaries, source-derived content, and compatibility aliases only.
- The current product slice supports only two UI locales: Spanish (`es-MX`) and English (`en`).
- Adding or changing locale-facing text requires updating the locale dictionaries and the relevant regression tests in the same change.
- Keep interaction logic, browser persistence, and presentation styling loosely coupled so the visual system can be replaced without rewriting planner behavior.
- The website must never instruct users to install the app manually through browser-native entries such as “Add to Home Screen”.
- The primary navigation bar should remain sticky for a substantial portion of the scroll experience, respect browser safe areas, and use light blur without fighting Safari chrome.
- Swipe navigation belongs only to the top navigation surface, not to the whole page.
- Swipe interaction and swipe-teaching copy are mobile-phone-only behavior. Tablet and desktop navigation should rely on pointer and keyboard interactions instead of swipe gestures.
- Swipe preference may be chosen during onboarding and updated later through interaction, but swipe behavior must remain deterministic and must never change the semantic destination set.
- The embedded planner-onboarding experience should teach the planner-to-home swipe shortcut only on mobile-phone layouts.
- The embedded planner-onboarding experience may finish with a short client-side setup transition, but that transition must stay browser-local, bounded, and non-blocking.
- Mobile layouts may expose secondary product surfaces through a menu trigger instead of the primary nav row when horizontal space is constrained.
- Tablet and desktop layouts must also collapse secondary navigation actions into a menu trigger whenever the available top-bar width cannot fit the full navigation cluster without wrapping.
- The public product must expose a small persistent footer with links to Terms and Privacy.
- The visual language should favor layered gradients, monochrome noise, motion-driven atmosphere, and floating accent objects instead of large flat surfaces.
- Treat Apple atmosphere, Proton Authenticator web, and Perplexity Comet as inspiration references for layout density, atmospheric surfaces, and motion cues only. Do not copy their assets, code, or distinctive strings.
- The public home should explain the project in non-technical language and expose a traceable news section whose links stay attached to official sources.
- The calendar surface should foreground current and near-term academic events and payment milestones, while keeping older published items available as secondary history rather than leading the page with stale dates.
- Public search must remain local to the published site artifact and precomputed public data. It must not require backend personal state or remote search infrastructure for the initial runtime slice.
- Public search should index official graduate-program references, official double-degree references, and other official secondary study options that the current slice exposes.
- An inscriptions surface may guide the user through official ITAM flows with traceable links and source citations, but it must not intercept or automate authenticated registration.
- A map surface may exist as a placeholder during the current slice, but detailed campus mapping remains deferred until a dedicated map phase begins.
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
