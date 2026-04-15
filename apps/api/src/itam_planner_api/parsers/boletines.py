from __future__ import annotations

import re
from datetime import UTC, datetime
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from ..common import normalize_whitespace, parse_term_label, slugify, term_end_date, term_start_date
from ..models import (
    BulletinDocument,
    BulletinLink,
    BulletinRequirement,
    Course,
    Plan,
    PrerequisiteReference,
    Program,
)
from .pdf import extract_pdf_text

_CACHE_PATTERN = re.compile(r"var\s+cacheado\s*=\s*([\d.]+)")
_COURSE_PATTERN = re.compile(r"\b([A-Z]{2,4}-\d{5})\b")
_CREDITS_PATTERN = re.compile(r"(\d+)\s*$")
_SEMESTER_PATTERN = re.compile(
    r"^(PRIMER|SEGUNDO|TERCER|CUARTO|QUINTO|SEXTO|SEPTIMO|SÉPTIMO|OCTAVO)\s+SEMESTRE$"
)
_COHORT_PATTERN = re.compile(
    r"PARA ALUMNOS QUE INGRESAN DE\s+([A-ZÁÉÍÓÚ\-]+\s+\d{4})\s+A\s+([A-ZÁÉÍÓÚ\-]+\s+\d{4})"
)
_CONTINUATION_PATTERN = re.compile(r"^(?:Y\s+)?[A-Z]{2,4}-\d{5}(?:\s*(?:,|Y)\s*[A-Z]{2,4}-\d{5})*$")

_SEMESTER_ORDER = {
    "PRIMER SEMESTRE": 1,
    "SEGUNDO SEMESTRE": 2,
    "TERCER SEMESTRE": 3,
    "CUARTO SEMESTRE": 4,
    "QUINTO SEMESTRE": 5,
    "SEXTO SEMESTRE": 6,
    "SEPTIMO SEMESTRE": 7,
    "SÉPTIMO SEMESTRE": 7,
    "OCTAVO SEMESTRE": 8,
}

_SKIP_LINES = (
    "PRERREQUISITOS",
    "PRERREQUISITO",
    "CLAVE",
    "TRONCO COMÚN",
    "MATERIA ÁREA DE CONCENTRACIÓN",
    "MATERIA AREA DE CONCENTRACION",
)


def parse_boletines_index(html: str, base_url: str) -> tuple[datetime | None, list[BulletinLink]]:
    soup = BeautifulSoup(html, "lxml")
    cache_match = _CACHE_PATTERN.search(html)
    observed_at: datetime | None = None
    if cache_match is not None:
        observed_at = datetime.fromtimestamp(float(cache_match.group(1)) / 1000, tz=UTC)

    links: list[BulletinLink] = []
    for anchor in soup.find_all("a", href=True):
        href = str(anchor.get("href", ""))
        if not href.lower().endswith(".pdf"):
            continue
        links.append(BulletinLink(code=anchor.get_text(strip=True), url=urljoin(base_url, href)))
    return observed_at, links


def parse_bulletin_pdf(pdf_bytes: bytes, source_code: str) -> BulletinDocument:
    text = extract_pdf_text(pdf_bytes)
    lines = [normalize_whitespace(line) for line in text.splitlines() if normalize_whitespace(line)]

    program_title = next(line for line in lines if line.upper().startswith("LICENCIATURA EN"))
    plan_line = next(line for line in lines if line.upper().startswith("PLAN "))
    cohort_line = next(line for line in lines if "PARA ALUMNOS QUE INGRESAN" in line.upper())
    application_term = next(
        line
        for line in lines
        if parse_term_label(line) is not None and "ALUMNOS QUE INGRESAN" not in line
    )

    entry_match = _COHORT_PATTERN.search(cohort_line.upper())
    entry_from_term = entry_match.group(1) if entry_match is not None else None
    entry_to_term = entry_match.group(2) if entry_match is not None else None
    plan_code = plan_line.split()[-1].strip()
    parsed_application_term = parse_term_label(application_term)
    application_year = parsed_application_term[1] if parsed_application_term is not None else None

    program_id = slugify(program_title)
    plan_id = f"{program_id}:{plan_code.lower()}"
    bulletin_id = f"bulletin:{source_code.lower()}"
    program = Program(program_id=program_id, title=program_title)
    plan = Plan(
        plan_id=plan_id,
        program_id=program_id,
        plan_code=plan_code,
        title=f"{program_title} Plan {plan_code}",
        application_year=application_year,
        active_from=term_start_date(application_term),
        active_to=term_end_date(application_term),
        entry_from_term=entry_from_term,
        entry_to_term=entry_to_term,
    )

    return BulletinDocument(
        bulletin_id=bulletin_id,
        source_code=source_code,
        title=f"{program_title} Plan {plan_code}",
        program=program,
        plan=plan,
        application_term=application_term,
        application_year=application_year,
        active_from=term_start_date(application_term),
        active_to=term_end_date(application_term),
        entry_from_term=entry_from_term,
        entry_to_term=entry_to_term,
        requirements=_parse_requirements(lines, bulletin_id),
    )


def _parse_requirements(lines: list[str], bulletin_id: str) -> list[BulletinRequirement]:
    current_semester: str | None = None
    current_main: str | None = None
    current_tail: list[str] = []
    rows: list[tuple[str, str, list[str]]] = []

    def flush_current() -> None:
        nonlocal current_main, current_tail
        if current_semester is not None and current_main is not None:
            rows.append((current_semester, current_main, list(current_tail)))
        current_main = None
        current_tail = []

    for line in lines:
        upper_line = line.upper()
        if _SEMESTER_PATTERN.match(upper_line):
            flush_current()
            current_semester = upper_line
            continue
        if current_semester is None:
            continue
        if upper_line.startswith("(A)") or upper_line.startswith("ESTIMADA/O"):
            flush_current()
            break
        if any(token in upper_line for token in _SKIP_LINES):
            continue
        if upper_line.startswith("LICENCIATURA EN") or upper_line.startswith("PLAN "):
            continue
        if "PARA ALUMNOS QUE INGRESAN" in upper_line:
            continue
        if parse_term_label(upper_line) is not None:
            continue

        normalized = normalize_whitespace(line)
        if _CONTINUATION_PATTERN.match(normalized.upper()) and current_main is not None:
            current_tail.append(normalized)
            continue
        if current_main is None:
            current_main = normalized
            continue
        if _CREDITS_PATTERN.search(current_main) is None:
            current_main = f"{current_main} {normalized}"
            continue

        flush_current()
        current_main = normalized

    flush_current()

    requirements: list[BulletinRequirement] = []
    for sort_order, (semester_label, main_line, tail_lines) in enumerate(rows, start=1):
        requirements.append(
            _parse_requirement_line(
                main_line=main_line,
                tail_lines=tail_lines,
                semester_label=semester_label.title(),
                semester_order=_SEMESTER_ORDER[semester_label],
                sort_order=sort_order,
                bulletin_id=bulletin_id,
            )
        )
    return requirements


def _parse_requirement_line(
    *,
    main_line: str,
    tail_lines: list[str],
    semester_label: str,
    semester_order: int,
    sort_order: int,
    bulletin_id: str,
) -> BulletinRequirement:
    if re.match(r"^Optativa\s+\d+$", main_line, re.IGNORECASE):
        return BulletinRequirement(
            requirement_id=f"{bulletin_id}:{semester_order:02d}:{sort_order:03d}",
            semester_label=semester_label,
            semester_order=semester_order,
            sort_order=sort_order,
            display_title="Optativa",
            credits=int(main_line.split()[-1]),
        )

    credits_match = _CREDITS_PATTERN.search(main_line)
    if credits_match is None:
        raise ValueError(f"Unable to parse credits from bulletin requirement: {main_line!r}")
    credits = int(credits_match.group(1))
    line_without_credits = main_line[: credits_match.start()].strip()

    course_matches = list(_COURSE_PATTERN.finditer(line_without_credits))
    if not course_matches:
        raise ValueError(f"Unable to parse course code from bulletin requirement: {main_line!r}")

    course_match = course_matches[-1]
    course_code = course_match.group(1)
    department_code, course_number = course_code.split("-", maxsplit=1)
    title = normalize_whitespace(line_without_credits[course_match.end() :])
    main_prerequisites = normalize_whitespace(line_without_credits[: course_match.start()])
    extra_prerequisites = normalize_whitespace(" ".join(tail_lines))
    raw_prerequisite_text = normalize_whitespace(
        " ".join(part for part in (main_prerequisites, extra_prerequisites) if part)
    )

    prerequisite_codes = [match.group(1) for match in course_matches[:-1]]
    for tail_line in tail_lines:
        prerequisite_codes.extend(_COURSE_PATTERN.findall(tail_line))

    return BulletinRequirement(
        requirement_id=f"{bulletin_id}:{semester_order:02d}:{sort_order:03d}",
        semester_label=semester_label,
        semester_order=semester_order,
        sort_order=sort_order,
        course=Course(
            department_code=department_code,
            course_number=course_number,
            course_code=course_code,
            canonical_title=title,
        ),
        display_title=title,
        credits=credits,
        raw_prerequisite_text=raw_prerequisite_text or None,
        prerequisite_references=[
            PrerequisiteReference(referenced_course_code=code, ordinal_position=index)
            for index, code in enumerate(prerequisite_codes, start=1)
        ],
    )
