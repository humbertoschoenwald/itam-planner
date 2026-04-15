from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from ..common import ensure_directory, slugify
from ..storage.repository import CatalogRepository


def export_public_dataset(repository: CatalogRepository, target_root: Path) -> None:
    ensure_directory(target_root)
    _write_json(target_root / "sources.json", _build_sources_projection(repository))
    _export_boletines(repository, target_root / "boletines")
    _export_calendars(repository, target_root / "calendars")
    _export_regulations(repository, target_root / "regulations")
    _export_schedules(repository, target_root / "schedules")


def _export_boletines(repository: CatalogRepository, boletines_root: Path) -> None:
    documents_root = ensure_directory(boletines_root / "documents")
    documents = list(
        repository.connection.execute(
            """
            SELECT
                bulletin_documents.bulletin_id,
                bulletin_documents.source_code,
                bulletin_documents.title,
                bulletin_documents.application_term,
                bulletin_documents.application_year,
                bulletin_documents.active_from,
                bulletin_documents.active_to,
                bulletin_documents.entry_from_term,
                bulletin_documents.entry_to_term,
                programs.title AS program_title,
                plans.plan_code,
                plans.plan_id
            FROM bulletin_documents
            JOIN programs ON programs.program_id = bulletin_documents.program_id
            JOIN plans ON plans.plan_id = bulletin_documents.plan_id
            ORDER BY bulletin_id
            """
        )
    )
    index: list[dict[str, object]] = []
    for document in documents:
        requirements = list(
            repository.connection.execute(
                """
                SELECT requirement_id, semester_label, semester_order, sort_order,
                       course_code, display_title, credits, raw_prerequisite_text
                FROM bulletin_requirements
                WHERE bulletin_id = ?
                ORDER BY semester_order, sort_order
                """,
                (document["bulletin_id"],),
            )
        )
        serialized_requirements: list[dict[str, object]] = []
        for requirement in requirements:
            prerequisites = list(
                repository.connection.execute(
                    """
                    SELECT referenced_course_code, ordinal_position
                    FROM prerequisite_references
                    WHERE requirement_id = ?
                    ORDER BY ordinal_position
                    """,
                    (requirement["requirement_id"],),
                )
            )
            serialized_requirements.append(
                {
                    "requirement_id": requirement["requirement_id"],
                    "semester_label": requirement["semester_label"],
                    "semester_order": requirement["semester_order"],
                    "sort_order": requirement["sort_order"],
                    "course_code": requirement["course_code"],
                    "display_title": requirement["display_title"],
                    "credits": requirement["credits"],
                    "raw_prerequisite_text": requirement["raw_prerequisite_text"],
                    "prerequisite_references": [_row_to_dict(row) for row in prerequisites],
                }
            )
        payload: dict[str, object] = {
            "bulletin_id": document["bulletin_id"],
            "source_code": document["source_code"],
            "title": document["title"],
            "program_title": document["program_title"],
            "plan_code": document["plan_code"],
            "plan_id": document["plan_id"],
            "application_term": document["application_term"],
            "application_year": document["application_year"],
            "active_from": document["active_from"],
            "active_to": document["active_to"],
            "entry_from_term": document["entry_from_term"],
            "entry_to_term": document["entry_to_term"],
            "requirements": serialized_requirements,
        }
        index.append({key: payload[key] for key in payload if key != "requirements"})
        _write_json(
            documents_root / f"{_safe_artifact_name(str(document['bulletin_id']))}.json",
            payload,
        )
    _write_json(boletines_root / "index.json", index)


def _export_calendars(repository: CatalogRepository, calendars_root: Path) -> None:
    ensure_directory(calendars_root)
    for calendar_kind, output_name in (("school", "school.json"), ("payment", "payment.json")):
        document = repository.connection.execute(
            "SELECT * FROM calendar_documents WHERE calendar_kind = ?",
            (calendar_kind,),
        ).fetchone()
        if document is None:
            continue
        payload = _row_to_dict(document)
        payload["legend"] = [
            _row_to_dict(row)
            for row in repository.connection.execute(
                """
                SELECT symbol, label, notes
                FROM calendar_legend_symbols
                WHERE calendar_id = ?
                ORDER BY symbol
                """,
                (document["calendar_id"],),
            )
        ]
        payload["events"] = [
            _row_to_dict(row)
            for row in repository.connection.execute(
                """
                SELECT event_date, legend_symbol, label, notes, active_from, active_to
                FROM calendar_events
                WHERE calendar_id = ?
                ORDER BY event_date, legend_symbol
                """,
                (document["calendar_id"],),
            )
        ]
        payload["payment_events"] = [
            _row_to_dict(row)
            for row in repository.connection.execute(
                """
                SELECT code, label, academic_period, event_date, date_range_start, date_range_end,
                       notes, active_from, active_to
                FROM payment_events
                WHERE calendar_id = ?
                ORDER BY academic_period, code
                """,
                (document["calendar_id"],),
            )
        ]
        _write_json(calendars_root / output_name, payload)


def _export_regulations(repository: CatalogRepository, regulations_root: Path) -> None:
    documents_root = ensure_directory(regulations_root / "documents")
    documents = list(
        repository.connection.execute("SELECT * FROM regulation_documents ORDER BY regulation_id")
    )
    index: list[dict[str, object]] = []
    for document in documents:
        sections = [
            _row_to_dict(row)
            for row in repository.connection.execute(
                """
                SELECT chapter_label, section_label, heading, body_text
                FROM regulation_sections
                WHERE regulation_id = ?
                ORDER BY section_id
                """,
                (document["regulation_id"],),
            )
        ]
        payload = _row_to_dict(document)
        payload["sections"] = sections
        index.append({key: payload[key] for key in payload if key != "sections"})
        _write_json(
            documents_root / f"{_safe_artifact_name(str(document['regulation_id']))}.json",
            payload,
        )
    _write_json(regulations_root / "index.json", index)


def _export_schedules(repository: CatalogRepository, schedules_root: Path) -> None:
    periods_root = ensure_directory(schedules_root / "periods")
    periods = list(
        repository.connection.execute("SELECT * FROM schedule_periods ORDER BY period_id")
    )
    _write_json(schedules_root / "periods.json", [_row_to_dict(period) for period in periods])
    for period in periods:
        subjects = [
            _row_to_dict(row)
            for row in repository.connection.execute(
                """
                SELECT
                    schedule_subjects.subject_id,
                    schedule_subjects.raw_value,
                    schedule_subjects.course_code,
                    courses.canonical_title
                FROM schedule_subjects
                JOIN courses ON courses.course_code = schedule_subjects.course_code
                WHERE schedule_subjects.period_id = ?
                ORDER BY schedule_subjects.subject_id
                """,
                (period["period_id"],),
            )
        ]
        offerings: list[dict[str, object]] = []
        for offering in repository.connection.execute(
            "SELECT * FROM schedule_offerings WHERE period_id = ? ORDER BY course_code, group_code",
            (period["period_id"],),
        ):
            payload = _row_to_dict(offering)
            payload["meetings"] = [
                _row_to_dict(row)
                for row in repository.connection.execute(
                    """
                    SELECT weekday_code, start_time, end_time, room_code, campus_name
                    FROM schedule_meetings
                    WHERE offering_id = ?
                    ORDER BY meeting_id
                    """,
                    (offering["offering_id"],),
                )
            ]
            offerings.append(payload)
        payload = _row_to_dict(period)
        payload["subjects"] = subjects
        payload["offerings"] = offerings
        _write_json(periods_root / f"{period['period_id']}.json", payload)


def _build_sources_projection(repository: CatalogRepository) -> dict[str, object]:
    runs = [
        _row_to_dict(row)
        for row in repository.connection.execute("SELECT * FROM scrape_runs ORDER BY started_at")
    ]
    promoted_releases = [
        _row_to_dict(row)
        for row in repository.connection.execute(
            "SELECT * FROM promoted_releases ORDER BY promoted_at"
        )
    ]
    snapshots = [
        _row_to_dict(row)
        for row in repository.connection.execute(
            """
            SELECT source_snapshots.*, source_artifacts.relative_path, source_artifacts.size_bytes
            FROM source_snapshots
            LEFT JOIN source_artifacts
                ON source_artifacts.snapshot_id = source_snapshots.snapshot_id
            ORDER BY observed_at, source_id
            """
        )
    ]
    return {
        "scrape_runs": runs,
        "promoted_releases": promoted_releases,
        "source_snapshots": snapshots,
    }


def _write_json(path: Path, payload: object) -> None:
    ensure_directory(path.parent)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _row_to_dict(row: sqlite3.Row) -> dict[str, object]:
    return {key: row[key] for key in row.keys()}


def _safe_artifact_name(value: str) -> str:
    return value.replace(":", "__") if ":" in value else slugify(value)
