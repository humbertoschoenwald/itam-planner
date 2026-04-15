# ADR-0010: Academic Catalog Schema and Applicability

- Status: Accepted
- Date: 2026-04-15

## Context

The repository needs one normalized model that can connect boletines, schedules, calendars, and regulations. The data must also support student-specific filtering later, especially by plan and entry period, without storing the student in the backend.

## Decision

The canonical normalized model has four layers:

- source layer
- academic catalog layer
- document and event layer
- schedule layer

Canonical course identity:

- `department_code`
- `course_number`
- `course_code`
- canonical title

Applicability is a first-class concern across normalized entities:

- `active_from`
- `active_to`
- `entry_from_term`
- `entry_to_term`

Applicability rules:

- `active_from` and `active_to` represent document, snapshot, period, or row validity in institutional time.
- `entry_from_term` and `entry_to_term` represent which student entry cohorts a document or rule applies to.
- Entities that do not have a meaningful value for one of those fields may leave it null, but the schema must preserve the field everywhere the concept can apply.

Source-specific schema requirements:

- boletines discovery may include PDFs outside the current v1 curricular-plan shape; only compatible plan-structured PDFs populate the canonical bulletin documents, requirements, and prerequisite references tables
- calendars must normalize document metadata, legend symbols, and event rows
- regulations must normalize document metadata plus searchable sections
- schedules must normalize periods, subjects, offerings, meetings, campuses, rooms, instructors, and raw comments

## Consequences

- Frontend filtering can later personalize views from local browser state without server-side student storage.
- Data from different public sources can converge on shared course and period identity.
- The schema is more explicit now, which raises implementation work but reduces later migration pain.

## Alternatives Considered

### Keep separate schemas per source family

Rejected. That would make cross-source joins and future UI logic too brittle.

### Add applicability only at document level

Rejected. The repository needs entity-level applicability where it can be inferred.

## Open Questions

- Whether later slices should derive canonical term IDs from ITAM period labels or keep both raw and canonical term identity side by side.
