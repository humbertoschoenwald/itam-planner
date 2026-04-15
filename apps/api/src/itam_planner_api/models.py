from __future__ import annotations

from datetime import date, datetime, time
from typing import Literal

from pydantic import BaseModel, Field


class SourceSnapshot(BaseModel):
    source_id: str
    source_kind: str
    upstream_url: str
    observed_at: datetime
    content_hash: str
    parse_status: Literal["parsed", "skipped", "failed"]
    media_type: str
    artifact_path: str | None = None


class ServiceRedirect(BaseModel):
    label: str
    url: str
    description: str
    category: str


class BulletinLink(BaseModel):
    code: str
    url: str


class Course(BaseModel):
    department_code: str
    course_number: str
    course_code: str
    canonical_title: str


class Program(BaseModel):
    program_id: str
    title: str
    degree_level: str = "licenciatura"


class Plan(BaseModel):
    plan_id: str
    program_id: str
    plan_code: str
    title: str
    application_year: int | None = None
    active_from: date | None = None
    active_to: date | None = None
    entry_from_term: str | None = None
    entry_to_term: str | None = None


class PrerequisiteReference(BaseModel):
    referenced_course_code: str
    ordinal_position: int


class BulletinRequirement(BaseModel):
    requirement_id: str
    semester_label: str
    semester_order: int
    sort_order: int
    course: Course | None = None
    display_title: str
    credits: int
    raw_prerequisite_text: str | None = None
    prerequisite_references: list[PrerequisiteReference] = Field(default_factory=list)


class BulletinDocument(BaseModel):
    bulletin_id: str
    source_code: str
    title: str
    program: Program
    plan: Plan
    application_term: str | None = None
    application_year: int | None = None
    active_from: date | None = None
    active_to: date | None = None
    entry_from_term: str | None = None
    entry_to_term: str | None = None
    requirements: list[BulletinRequirement] = Field(default_factory=list)


class CalendarLegendSymbol(BaseModel):
    symbol: str
    label: str
    notes: str | None = None


class CalendarEvent(BaseModel):
    event_date: date
    legend_symbol: str
    label: str
    notes: str | None = None
    active_from: date | None = None
    active_to: date | None = None


class PaymentEvent(BaseModel):
    code: str
    label: str
    academic_period: str
    event_date: date | None = None
    date_range_start: date | None = None
    date_range_end: date | None = None
    notes: str | None = None
    active_from: date | None = None
    active_to: date | None = None


class CalendarDocument(BaseModel):
    calendar_id: str
    calendar_kind: Literal["school", "payment"]
    title: str
    period_label: str | None = None
    active_from: date | None = None
    active_to: date | None = None
    legend: list[CalendarLegendSymbol] = Field(default_factory=list)
    events: list[CalendarEvent] = Field(default_factory=list)
    payment_events: list[PaymentEvent] = Field(default_factory=list)


class RegulationSection(BaseModel):
    section_id: str
    chapter_label: str | None = None
    section_label: str | None = None
    heading: str
    body_text: str
    search_text: str


class RegulationDocument(BaseModel):
    regulation_id: str
    regulation_type: str
    title: str
    active_from: date | None = None
    active_to: date | None = None
    entry_from_term: str | None = None
    entry_to_term: str | None = None
    sections: list[RegulationSection] = Field(default_factory=list)


class ScheduleSubject(BaseModel):
    subject_id: str
    raw_value: str
    course: Course


class ScheduleMeeting(BaseModel):
    meeting_id: str
    weekday_code: str
    start_time: time
    end_time: time
    room_code: str | None = None
    campus_name: str | None = None


class ScheduleOffering(BaseModel):
    offering_id: str
    course: Course
    group_code: str
    crn: str
    section_type: str
    display_title: str
    instructor_name: str | None = None
    credits: int | None = None
    room_code: str | None = None
    campus_name: str | None = None
    raw_comments: str | None = None
    meetings: list[ScheduleMeeting] = Field(default_factory=list)


class SchedulePeriod(BaseModel):
    period_id: str
    label: str
    level: str
    year: int | None = None
    term: str | None = None
    active_from: date | None = None
    active_to: date | None = None
    subjects: list[ScheduleSubject] = Field(default_factory=list)
    offerings: list[ScheduleOffering] = Field(default_factory=list)
