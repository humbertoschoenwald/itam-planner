# ADR-0013: Portable Student Code and External AI Context

- Status: Accepted
- Date: 2026-04-15

## Context

The product needs a portable way to carry a student's planner context without accounts or backend personal storage. The user also wants a future `Connect to ChatGPT` flow that works with other AI systems, but the exact public route shape for that connection should remain flexible until the AI slice starts.

## Decision

Student context portability rules:

- The repository adopts a browser-owned portable student code.
- The student code is self-contained and must not act as a backend lookup key.
- The student code may carry onboarding profile data and planner state.
- The student code must never carry identity data such as name, email, student ID, or phone number.

Future AI-context rules:

- The repository will expose one stable read-only machine-readable academic context endpoint under the public application hostname.
- The endpoint exists to help external AI systems read student-specific context derived from the student code plus the promoted public dataset.
- The endpoint must remain read-only.
- The endpoint must not require authentication.
- The endpoint must not persist the student code or the derived AI response.
- The endpoint route shape remains intentionally open until the Connect to ChatGPT slice begins.

Prompt-behavior rules:

- Future system prompts should instruct the external AI to verify the current date and time in `America/Mexico_City`.
- Future system prompts should direct the AI to fetch the student-specific academic context endpoint when the request is about ITAM schedule, classes, calendars, or related academic timing questions.
- Future system prompts must not imply that the project is an official ITAM service.

## Consequences

- The planner can stay privacy-first while still supporting external AI workflows later.
- The repository avoids premature lock-in on the final AI route shape.
- Future AI work will still need a short ADR addendum or follow-up ADR to freeze the endpoint contract.

## Alternatives Considered

### Store student context on the backend and use a short lookup key

Rejected. That violates the repository's privacy model.

### Freeze the final AI endpoint route before the planner state exists

Rejected. The repository needs flexibility until the Connect to ChatGPT slice begins.

## Open Questions

- Whether the first frozen AI endpoint contract should use a path parameter, a query parameter, or another read-only route shape.
