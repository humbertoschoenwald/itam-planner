from __future__ import annotations

import re
from datetime import date

from ..common import normalize_search_text, normalize_whitespace, slugify
from ..models import RegulationDocument, RegulationSection
from .pdf import extract_pdf_text

_ARTICLE_PATTERN = re.compile(r"^Artículo\s+(\d+)", re.IGNORECASE)
_CHAPTER_PATTERN = re.compile(r"^CAPÍTULO\s+([IVXLC]+)", re.IGNORECASE)


def parse_regulation_pdf(
    pdf_bytes: bytes,
    *,
    regulation_type: str,
    title_hint: str,
    entry_from_term: str | None,
    entry_to_term: str | None,
    active_from: date | None,
    active_to: date | None,
) -> RegulationDocument:
    text = extract_pdf_text(pdf_bytes)
    lines = [normalize_whitespace(line) for line in text.splitlines() if normalize_whitespace(line)]
    title = next(
        (line for line in lines if "Reglamento" in line or "Reglamentos" in line), title_hint
    )
    regulation_id = f"regulation:{slugify(regulation_type)}"
    return RegulationDocument(
        regulation_id=regulation_id,
        regulation_type=regulation_type,
        title=title,
        active_from=active_from,
        active_to=active_to,
        entry_from_term=entry_from_term,
        entry_to_term=entry_to_term,
        sections=_build_sections(lines, regulation_id),
    )


def _build_sections(lines: list[str], regulation_id: str) -> list[RegulationSection]:
    sections: list[RegulationSection] = []
    chapter_label: str | None = None
    current_heading: str | None = None
    current_section_label: str | None = None
    current_body: list[str] = []

    def flush() -> None:
        nonlocal current_heading, current_section_label, current_body
        if current_heading is None:
            return
        body_text = normalize_whitespace(" ".join(current_body))
        section_key = current_section_label or slugify(current_heading)
        sections.append(
            RegulationSection(
                section_id=f"{regulation_id}:{section_key}:{len(sections) + 1:04d}",
                chapter_label=chapter_label,
                section_label=current_section_label,
                heading=current_heading,
                body_text=body_text,
                search_text=normalize_search_text(
                    f"{chapter_label or ''} {current_heading} {body_text}"
                ),
            )
        )
        current_heading = None
        current_section_label = None
        current_body = []

    for line in lines:
        chapter_match = _CHAPTER_PATTERN.match(line)
        article_match = _ARTICLE_PATTERN.match(line)
        if chapter_match:
            flush()
            chapter_label = f"CAPÍTULO {chapter_match.group(1)}"
            current_heading = chapter_label
            current_section_label = chapter_label
            current_body = []
            continue
        if article_match:
            flush()
            current_heading = line
            current_section_label = f"Artículo {article_match.group(1)}"
            current_body = []
            continue
        if current_heading is None:
            current_heading = line
            current_section_label = slugify(line)
            current_body = []
            continue
        current_body.append(line)
    flush()
    return sections
