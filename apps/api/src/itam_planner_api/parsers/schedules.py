from __future__ import annotations

import re
from datetime import time
from urllib.parse import parse_qs, urljoin, urlparse

from bs4 import BeautifulSoup

from ..common import normalize_whitespace, parse_term_label, term_end_date, term_start_date
from ..models import Course, ScheduleMeeting, ScheduleOffering, SchedulePeriod, ScheduleSubject

_PERIOD_PATTERN = re.compile(r"Horarios para el período\s+(.+)", re.IGNORECASE)
_SUBJECT_PATTERN = re.compile(r"^([A-Z]{2,4})-(\d{5})-(.+)$")
_DAY_PATTERN = re.compile(r"\b(LU|MA|MI|JU|VI|SA|DO)\b")
_TIME_RANGE_PATTERN = re.compile(r"^(\d{2}:\d{2})-(\d{2}:\d{2})$")


def parse_schedule_periods_menu(html: str, base_url: str) -> list[SchedulePeriod]:
    soup = BeautifulSoup(html, "lxml")
    periods: list[SchedulePeriod] = []
    for anchor in soup.find_all("a", href=True):
        text = normalize_whitespace(anchor.get_text(" ", strip=True))
        match = _PERIOD_PATTERN.search(text)
        if match is None:
            continue
        href = urljoin(base_url, str(anchor.get("href", "")))
        query = parse_qs(urlparse(href).query)
        period_id = query["s"][0]
        label = match.group(1).strip()
        level = (
            "LICENCIATURA"
            if "LICENCIATURA" in label.upper()
            else "HIBRIDO"
            if "HIBRIDO" in label.upper()
            else "MAESTRIA"
        )
        parsed_term = parse_term_label(label)
        periods.append(
            SchedulePeriod(
                period_id=period_id,
                label=label,
                level=level,
                year=parsed_term[1] if parsed_term else None,
                term=parsed_term[0] if parsed_term else None,
                active_from=term_start_date(label),
                active_to=term_end_date(label),
            )
        )
    return periods


def parse_schedule_subjects(html: str, period_id: str) -> list[ScheduleSubject]:
    soup = BeautifulSoup(html, "lxml")
    select = soup.find("select", attrs={"name": "txt_materia"})
    if select is None:
        return []
    subjects: list[ScheduleSubject] = []
    for option in select.find_all("option"):
        option_value = option.get("value")
        raw_value = normalize_whitespace(
            str(option_value) if option_value is not None else option.get_text(" ", strip=True)
        )
        if not raw_value:
            continue
        match = _SUBJECT_PATTERN.match(raw_value)
        if match is None:
            continue
        department_code, course_number, title = match.groups()
        course_code = f"{department_code}-{course_number}"
        subjects.append(
            ScheduleSubject(
                subject_id=f"{period_id}:{course_code}",
                raw_value=raw_value,
                course=Course(
                    department_code=department_code,
                    course_number=course_number,
                    course_code=course_code,
                    canonical_title=normalize_whitespace(title),
                ),
            )
        )
    return subjects


def parse_schedule_offerings(html: str, period_id: str) -> list[ScheduleOffering]:
    soup = BeautifulSoup(html, "lxml")
    target_table = None
    for table in soup.find_all("table"):
        rows = table.find_all("tr")
        if not rows:
            continue
        headings = [
            normalize_whitespace(cell.get_text(" ", strip=True))
            for cell in rows[0].find_all(["th", "td"])
        ]
        if headings and headings[0] == "DEPTO.":
            target_table = table
            break
    if target_table is None:
        return []

    offerings: list[ScheduleOffering] = []
    for row in target_table.find_all("tr")[1:]:
        cells = [
            normalize_whitespace(cell.get_text(" ", strip=True)) for cell in row.find_all("td")
        ]
        if len(cells) != 13:
            continue
        (
            department_code,
            course_number,
            group_code,
            crn,
            section_type,
            title,
            instructor,
            credits,
            horario,
            days,
            room_code,
            campus_name,
            comments,
        ) = cells
        course_code = f"{department_code}-{course_number}"
        start_time, end_time = _parse_time_range(horario)
        meetings = [
            ScheduleMeeting(
                meeting_id=f"{period_id}:{course_code}:{group_code}:{crn}:{day_code}",
                weekday_code=day_code,
                start_time=start_time,
                end_time=end_time,
                room_code=room_code or None,
                campus_name=campus_name or None,
            )
            for day_code in _DAY_PATTERN.findall(days)
        ]
        offerings.append(
            ScheduleOffering(
                offering_id=f"{period_id}:{course_code}:{group_code}:{crn}",
                course=Course(
                    department_code=department_code,
                    course_number=course_number,
                    course_code=course_code,
                    canonical_title=title,
                ),
                group_code=group_code,
                crn=crn,
                section_type=section_type,
                display_title=title,
                instructor_name=instructor or None,
                credits=int(credits) if credits.isdigit() else None,
                room_code=room_code or None,
                campus_name=campus_name or None,
                raw_comments=comments or None,
                meetings=meetings,
            )
        )
    return offerings


def _parse_time_range(value: str) -> tuple[time, time]:
    match = _TIME_RANGE_PATTERN.match(value)
    if match is None:
        raise ValueError(f"Invalid schedule time range: {value!r}")
    start_hours, start_minutes = (int(part) for part in match.group(1).split(":"))
    end_hours, end_minutes = (int(part) for part in match.group(2).split(":"))
    return time(start_hours, start_minutes), time(end_hours, end_minutes)
