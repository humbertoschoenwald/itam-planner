from __future__ import annotations

import sqlite3
from datetime import UTC, date, datetime, time
from pathlib import Path

from ..common import ensure_directory
from ..models import (
    BulletinDocument,
    CalendarDocument,
    Course,
    RegulationDocument,
    SchedulePeriod,
    SourceSnapshot,
)


class CatalogRepository:
    def __init__(self, database_path: Path) -> None:
        ensure_directory(database_path.parent)
        self.database_path = database_path
        self.connection = sqlite3.connect(database_path)
        self.connection.row_factory = sqlite3.Row
        self.connection.execute("PRAGMA foreign_keys = ON")

    def close(self) -> None:
        self.connection.close()

    def initialize(self) -> None:
        self.connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS source_registry (
                source_id TEXT PRIMARY KEY,
                source_kind TEXT NOT NULL,
                canonical_url TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS scrape_runs (
                run_id TEXT PRIMARY KEY,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                status TEXT NOT NULL,
                notes TEXT
            );
            CREATE TABLE IF NOT EXISTS source_snapshots (
                snapshot_id TEXT PRIMARY KEY,
                run_id TEXT NOT NULL REFERENCES scrape_runs(run_id),
                source_id TEXT NOT NULL REFERENCES source_registry(source_id),
                upstream_url TEXT NOT NULL,
                observed_at TEXT NOT NULL,
                content_hash TEXT NOT NULL,
                parse_status TEXT NOT NULL,
                media_type TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS source_artifacts (
                snapshot_id TEXT PRIMARY KEY REFERENCES source_snapshots(snapshot_id),
                relative_path TEXT,
                size_bytes INTEGER
            );
            CREATE TABLE IF NOT EXISTS programs (
                program_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                degree_level TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS plans (
                plan_id TEXT PRIMARY KEY,
                program_id TEXT NOT NULL REFERENCES programs(program_id),
                plan_code TEXT NOT NULL,
                title TEXT NOT NULL,
                application_year INTEGER,
                active_from TEXT,
                active_to TEXT,
                entry_from_term TEXT,
                entry_to_term TEXT
            );
            CREATE TABLE IF NOT EXISTS courses (
                course_code TEXT PRIMARY KEY,
                department_code TEXT NOT NULL,
                course_number TEXT NOT NULL,
                canonical_title TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS bulletin_documents (
                bulletin_id TEXT PRIMARY KEY,
                source_snapshot_id TEXT NOT NULL REFERENCES source_snapshots(snapshot_id),
                source_code TEXT NOT NULL,
                title TEXT NOT NULL,
                program_id TEXT NOT NULL REFERENCES programs(program_id),
                plan_id TEXT NOT NULL REFERENCES plans(plan_id),
                application_term TEXT,
                application_year INTEGER,
                active_from TEXT,
                active_to TEXT,
                entry_from_term TEXT,
                entry_to_term TEXT
            );
            CREATE TABLE IF NOT EXISTS bulletin_requirements (
                requirement_id TEXT PRIMARY KEY,
                bulletin_id TEXT NOT NULL REFERENCES bulletin_documents(bulletin_id),
                semester_label TEXT NOT NULL,
                semester_order INTEGER NOT NULL,
                sort_order INTEGER NOT NULL,
                course_code TEXT REFERENCES courses(course_code),
                display_title TEXT NOT NULL,
                credits INTEGER NOT NULL,
                raw_prerequisite_text TEXT
            );
            CREATE TABLE IF NOT EXISTS prerequisite_references (
                reference_id TEXT PRIMARY KEY,
                requirement_id TEXT NOT NULL REFERENCES bulletin_requirements(requirement_id),
                referenced_course_code TEXT NOT NULL,
                ordinal_position INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS calendar_documents (
                calendar_id TEXT PRIMARY KEY,
                source_snapshot_id TEXT NOT NULL REFERENCES source_snapshots(snapshot_id),
                calendar_kind TEXT NOT NULL,
                title TEXT NOT NULL,
                period_label TEXT,
                active_from TEXT,
                active_to TEXT
            );
            CREATE TABLE IF NOT EXISTS calendar_legend_symbols (
                legend_id TEXT PRIMARY KEY,
                calendar_id TEXT NOT NULL REFERENCES calendar_documents(calendar_id),
                symbol TEXT NOT NULL,
                label TEXT NOT NULL,
                notes TEXT
            );
            CREATE TABLE IF NOT EXISTS calendar_events (
                event_id TEXT PRIMARY KEY,
                calendar_id TEXT NOT NULL REFERENCES calendar_documents(calendar_id),
                event_date TEXT NOT NULL,
                legend_symbol TEXT NOT NULL,
                label TEXT NOT NULL,
                notes TEXT,
                active_from TEXT,
                active_to TEXT
            );
            CREATE TABLE IF NOT EXISTS payment_events (
                payment_event_id TEXT PRIMARY KEY,
                calendar_id TEXT NOT NULL REFERENCES calendar_documents(calendar_id),
                code TEXT NOT NULL,
                label TEXT NOT NULL,
                academic_period TEXT NOT NULL,
                event_date TEXT,
                date_range_start TEXT,
                date_range_end TEXT,
                notes TEXT,
                active_from TEXT,
                active_to TEXT
            );
            CREATE TABLE IF NOT EXISTS regulation_documents (
                regulation_id TEXT PRIMARY KEY,
                source_snapshot_id TEXT NOT NULL REFERENCES source_snapshots(snapshot_id),
                regulation_type TEXT NOT NULL,
                title TEXT NOT NULL,
                active_from TEXT,
                active_to TEXT,
                entry_from_term TEXT,
                entry_to_term TEXT
            );
            CREATE TABLE IF NOT EXISTS regulation_sections (
                section_id TEXT PRIMARY KEY,
                regulation_id TEXT NOT NULL REFERENCES regulation_documents(regulation_id),
                chapter_label TEXT,
                section_label TEXT,
                heading TEXT NOT NULL,
                body_text TEXT NOT NULL,
                search_text TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS campuses (
                campus_name TEXT PRIMARY KEY
            );
            CREATE TABLE IF NOT EXISTS rooms (
                room_code TEXT PRIMARY KEY,
                campus_name TEXT REFERENCES campuses(campus_name)
            );
            CREATE TABLE IF NOT EXISTS instructors (
                instructor_name TEXT PRIMARY KEY
            );
            CREATE TABLE IF NOT EXISTS schedule_periods (
                period_id TEXT PRIMARY KEY,
                source_snapshot_id TEXT NOT NULL REFERENCES source_snapshots(snapshot_id),
                label TEXT NOT NULL,
                level TEXT NOT NULL,
                year INTEGER,
                term TEXT,
                active_from TEXT,
                active_to TEXT
            );
            CREATE TABLE IF NOT EXISTS schedule_subjects (
                subject_id TEXT PRIMARY KEY,
                period_id TEXT NOT NULL REFERENCES schedule_periods(period_id),
                raw_value TEXT NOT NULL,
                course_code TEXT NOT NULL REFERENCES courses(course_code)
            );
            CREATE TABLE IF NOT EXISTS schedule_offerings (
                offering_id TEXT PRIMARY KEY,
                period_id TEXT NOT NULL REFERENCES schedule_periods(period_id),
                course_code TEXT NOT NULL REFERENCES courses(course_code),
                group_code TEXT NOT NULL,
                crn TEXT NOT NULL,
                section_type TEXT NOT NULL,
                display_title TEXT NOT NULL,
                instructor_name TEXT REFERENCES instructors(instructor_name),
                credits INTEGER,
                room_code TEXT REFERENCES rooms(room_code),
                campus_name TEXT REFERENCES campuses(campus_name),
                raw_comments TEXT
            );
            CREATE TABLE IF NOT EXISTS schedule_meetings (
                meeting_id TEXT PRIMARY KEY,
                offering_id TEXT NOT NULL REFERENCES schedule_offerings(offering_id),
                weekday_code TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                room_code TEXT REFERENCES rooms(room_code),
                campus_name TEXT REFERENCES campuses(campus_name)
            );
            """
        )
        self.connection.commit()

    def create_scrape_run(self, run_id: str, *, status: str, notes: str | None = None) -> None:
        self.connection.execute(
            """
            INSERT OR REPLACE INTO scrape_runs(run_id, started_at, status, notes)
            VALUES(?, ?, ?, ?)
            """,
            (run_id, datetime.now(tz=UTC).isoformat(), status, notes),
        )
        self.connection.commit()

    def complete_scrape_run(self, run_id: str, *, status: str, notes: str | None = None) -> None:
        self.connection.execute(
            """
            UPDATE scrape_runs
            SET completed_at = ?, status = ?, notes = COALESCE(?, notes)
            WHERE run_id = ?
            """,
            (datetime.now(tz=UTC).isoformat(), status, notes, run_id),
        )
        self.connection.commit()

    def record_source_snapshot(self, snapshot: SourceSnapshot, run_id: str, size_bytes: int) -> str:
        snapshot_id = f"{snapshot.source_id}:{snapshot.content_hash[:16]}"
        self.connection.execute(
            """
            INSERT OR REPLACE INTO source_registry(source_id, source_kind, canonical_url)
            VALUES(?, ?, ?)
            """,
            (snapshot.source_id, snapshot.source_kind, snapshot.upstream_url),
        )
        self.connection.execute(
            """
            INSERT OR REPLACE INTO source_snapshots(
                snapshot_id, run_id, source_id, upstream_url,
                observed_at, content_hash, parse_status, media_type
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                snapshot_id,
                run_id,
                snapshot.source_id,
                snapshot.upstream_url,
                snapshot.observed_at.isoformat(),
                snapshot.content_hash,
                snapshot.parse_status,
                snapshot.media_type,
            ),
        )
        self.connection.execute(
            """
            INSERT OR REPLACE INTO source_artifacts(snapshot_id, relative_path, size_bytes)
            VALUES(?, ?, ?)
            """,
            (snapshot_id, snapshot.artifact_path, size_bytes),
        )
        self.connection.commit()
        return snapshot_id

    def store_bulletin(self, bulletin: BulletinDocument, source_snapshot_id: str) -> None:
        self.connection.execute(
            "INSERT OR REPLACE INTO programs(program_id, title, degree_level) VALUES(?, ?, ?)",
            (bulletin.program.program_id, bulletin.program.title, bulletin.program.degree_level),
        )
        self.connection.execute(
            """
            INSERT OR REPLACE INTO plans(
                plan_id, program_id, plan_code, title, application_year,
                active_from, active_to, entry_from_term, entry_to_term
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                bulletin.plan.plan_id,
                bulletin.plan.program_id,
                bulletin.plan.plan_code,
                bulletin.plan.title,
                bulletin.plan.application_year,
                _iso(bulletin.plan.active_from),
                _iso(bulletin.plan.active_to),
                bulletin.plan.entry_from_term,
                bulletin.plan.entry_to_term,
            ),
        )
        self.connection.execute(
            """
            INSERT OR REPLACE INTO bulletin_documents(
                bulletin_id, source_snapshot_id, source_code, title, program_id, plan_id,
                application_term, application_year, active_from, active_to,
                entry_from_term, entry_to_term
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                bulletin.bulletin_id,
                source_snapshot_id,
                bulletin.source_code,
                bulletin.title,
                bulletin.program.program_id,
                bulletin.plan.plan_id,
                bulletin.application_term,
                bulletin.application_year,
                _iso(bulletin.active_from),
                _iso(bulletin.active_to),
                bulletin.entry_from_term,
                bulletin.entry_to_term,
            ),
        )
        for requirement in bulletin.requirements:
            if requirement.course is not None:
                self._store_course(requirement.course)
            self.connection.execute(
                """
                INSERT OR REPLACE INTO bulletin_requirements(
                    requirement_id, bulletin_id, semester_label, semester_order, sort_order,
                    course_code, display_title, credits, raw_prerequisite_text
                )
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    requirement.requirement_id,
                    bulletin.bulletin_id,
                    requirement.semester_label,
                    requirement.semester_order,
                    requirement.sort_order,
                    requirement.course.course_code if requirement.course is not None else None,
                    requirement.display_title,
                    requirement.credits,
                    requirement.raw_prerequisite_text,
                ),
            )
            for reference in requirement.prerequisite_references:
                self.connection.execute(
                    """
                    INSERT OR REPLACE INTO prerequisite_references(
                        reference_id, requirement_id, referenced_course_code, ordinal_position
                    )
                    VALUES(?, ?, ?, ?)
                    """,
                    (
                        f"{requirement.requirement_id}:{reference.ordinal_position:02d}",
                        requirement.requirement_id,
                        reference.referenced_course_code,
                        reference.ordinal_position,
                    ),
                )
        self.connection.commit()

    def store_calendar_document(
        self, calendar_document: CalendarDocument, source_snapshot_id: str
    ) -> None:
        self.connection.execute(
            """
            INSERT OR REPLACE INTO calendar_documents(
                calendar_id, source_snapshot_id, calendar_kind, title,
                period_label, active_from, active_to
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)
            """,
            (
                calendar_document.calendar_id,
                source_snapshot_id,
                calendar_document.calendar_kind,
                calendar_document.title,
                calendar_document.period_label,
                _iso(calendar_document.active_from),
                _iso(calendar_document.active_to),
            ),
        )
        for legend in calendar_document.legend:
            self.connection.execute(
                """
                INSERT OR REPLACE INTO calendar_legend_symbols(
                    legend_id, calendar_id, symbol, label, notes
                )
                VALUES(?, ?, ?, ?, ?)
                """,
                (
                    f"{calendar_document.calendar_id}:{legend.symbol}",
                    calendar_document.calendar_id,
                    legend.symbol,
                    legend.label,
                    legend.notes,
                ),
            )
        for event in calendar_document.events:
            self.connection.execute(
                """
                INSERT OR REPLACE INTO calendar_events(
                    event_id, calendar_id, event_date, legend_symbol,
                    label, notes, active_from, active_to
                )
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    f"{calendar_document.calendar_id}:{event.event_date.isoformat()}:{event.legend_symbol}",
                    calendar_document.calendar_id,
                    event.event_date.isoformat(),
                    event.legend_symbol,
                    event.label,
                    event.notes,
                    _iso(event.active_from),
                    _iso(event.active_to),
                ),
            )
        for event in calendar_document.payment_events:
            self.connection.execute(
                """
                INSERT OR REPLACE INTO payment_events(
                    payment_event_id, calendar_id, code, label, academic_period, event_date,
                    date_range_start, date_range_end, notes, active_from, active_to
                )
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    f"{calendar_document.calendar_id}:{event.code}:{event.academic_period}",
                    calendar_document.calendar_id,
                    event.code,
                    event.label,
                    event.academic_period,
                    _iso(event.event_date),
                    _iso(event.date_range_start),
                    _iso(event.date_range_end),
                    event.notes,
                    _iso(event.active_from),
                    _iso(event.active_to),
                ),
            )
        self.connection.commit()

    def store_regulation_document(
        self, regulation: RegulationDocument, source_snapshot_id: str
    ) -> None:
        self.connection.execute(
            """
            INSERT OR REPLACE INTO regulation_documents(
                regulation_id, source_snapshot_id, regulation_type, title,
                active_from, active_to, entry_from_term, entry_to_term
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                regulation.regulation_id,
                source_snapshot_id,
                regulation.regulation_type,
                regulation.title,
                _iso(regulation.active_from),
                _iso(regulation.active_to),
                regulation.entry_from_term,
                regulation.entry_to_term,
            ),
        )
        for section in regulation.sections:
            self.connection.execute(
                """
                INSERT OR REPLACE INTO regulation_sections(
                    section_id, regulation_id, chapter_label,
                    section_label, heading, body_text, search_text
                )
                VALUES(?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    section.section_id,
                    regulation.regulation_id,
                    section.chapter_label,
                    section.section_label,
                    section.heading,
                    section.body_text,
                    section.search_text,
                ),
            )
        self.connection.commit()

    def store_schedule_period(self, period: SchedulePeriod, source_snapshot_id: str) -> None:
        self.connection.execute(
            """
            INSERT OR REPLACE INTO schedule_periods(
                period_id, source_snapshot_id, label, level, year, term, active_from, active_to
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                period.period_id,
                source_snapshot_id,
                period.label,
                period.level,
                period.year,
                period.term,
                _iso(period.active_from),
                _iso(period.active_to),
            ),
        )
        for subject in period.subjects:
            self._store_course(subject.course)
            self.connection.execute(
                """
                INSERT OR REPLACE INTO schedule_subjects(
                    subject_id, period_id, raw_value, course_code
                )
                VALUES(?, ?, ?, ?)
                """,
                (
                    subject.subject_id,
                    period.period_id,
                    subject.raw_value,
                    subject.course.course_code,
                ),
            )
        for offering in period.offerings:
            self._store_course(offering.course)
            if offering.campus_name is not None:
                self.connection.execute(
                    """
                    INSERT OR REPLACE INTO campuses(campus_name)
                    VALUES(?)
                    """,
                    (offering.campus_name,),
                )
            if offering.room_code is not None:
                self.connection.execute(
                    "INSERT OR REPLACE INTO rooms(room_code, campus_name) VALUES(?, ?)",
                    (offering.room_code, offering.campus_name),
                )
            if offering.instructor_name is not None:
                self.connection.execute(
                    "INSERT OR REPLACE INTO instructors(instructor_name) VALUES(?)",
                    (offering.instructor_name,),
                )
            self.connection.execute(
                """
                INSERT OR REPLACE INTO schedule_offerings(
                    offering_id, period_id, course_code, group_code,
                    crn, section_type, display_title, instructor_name,
                    credits, room_code, campus_name, raw_comments
                )
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    offering.offering_id,
                    period.period_id,
                    offering.course.course_code,
                    offering.group_code,
                    offering.crn,
                    offering.section_type,
                    offering.display_title,
                    offering.instructor_name,
                    offering.credits,
                    offering.room_code,
                    offering.campus_name,
                    offering.raw_comments,
                ),
            )
            for meeting in offering.meetings:
                if meeting.campus_name is not None:
                    self.connection.execute(
                        """
                        INSERT OR REPLACE INTO campuses(campus_name)
                        VALUES(?)
                        """,
                        (meeting.campus_name,),
                    )
                if meeting.room_code is not None:
                    self.connection.execute(
                        "INSERT OR REPLACE INTO rooms(room_code, campus_name) VALUES(?, ?)",
                        (meeting.room_code, meeting.campus_name),
                    )
                self.connection.execute(
                    """
                    INSERT OR REPLACE INTO schedule_meetings(
                        meeting_id, offering_id, weekday_code, start_time,
                        end_time, room_code, campus_name
                    )
                    VALUES(?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        meeting.meeting_id,
                        offering.offering_id,
                        meeting.weekday_code,
                        meeting.start_time.isoformat(),
                        meeting.end_time.isoformat(),
                        meeting.room_code,
                        meeting.campus_name,
                    ),
                )
        self.connection.commit()

    def table_count(self, table_name: str) -> int:
        row = self.connection.execute(f"SELECT COUNT(*) AS count FROM {table_name}").fetchone()
        return int(row["count"])

    def search_regulation_sections(self, keyword: str) -> list[sqlite3.Row]:
        return list(
            self.connection.execute(
                "SELECT * FROM regulation_sections WHERE search_text LIKE ? ORDER BY section_id",
                (f"%{keyword.lower()}%",),
            )
        )

    def _store_course(self, course: Course) -> None:
        self.connection.execute(
            """
            INSERT INTO courses(course_code, department_code, course_number, canonical_title)
            VALUES(?, ?, ?, ?)
            ON CONFLICT(course_code) DO UPDATE SET
                canonical_title = CASE
                    WHEN excluded.canonical_title != '' THEN excluded.canonical_title
                    ELSE courses.canonical_title
                END
            """,
            (
                course.course_code,
                course.department_code,
                course.course_number,
                course.canonical_title,
            ),
        )


def _iso(value: date | datetime | time | None) -> str | None:
    if value is None:
        return None
    return value.isoformat()
