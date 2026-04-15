from __future__ import annotations

import calendar as calendar_module
import hashlib
import re
import unicodedata
from datetime import date
from pathlib import Path

SPANISH_MONTH_NAMES = {
    "ENERO": 1,
    "FEBRERO": 2,
    "MARZO": 3,
    "ABRIL": 4,
    "MAYO": 5,
    "JUNIO": 6,
    "JULIO": 7,
    "AGOSTO": 8,
    "SEPTIEMBRE": 9,
    "OCTUBRE": 10,
    "NOVIEMBRE": 11,
    "DICIEMBRE": 12,
}

SPANISH_MONTH_ABBREVIATIONS = {
    "ENE": 1,
    "FEB": 2,
    "MAR": 3,
    "ABR": 4,
    "MAY": 5,
    "JUN": 6,
    "JUL": 7,
    "AGO": 8,
    "SEP": 9,
    "OCT": 10,
    "NOV": 11,
    "DIC": 12,
}

TERM_START_MONTHS = {
    "PRIMAVERA": 1,
    "VERANO": 6,
    "OTOÑO": 8,
    "OTONO": 8,
    "ABRIL-JUNIO": 4,
}

TERM_END_MONTHS = {
    "PRIMAVERA": 5,
    "VERANO": 7,
    "OTOÑO": 12,
    "OTONO": 12,
    "ABRIL-JUNIO": 6,
}

_NON_WORD_PATTERN = re.compile(r"[^a-z0-9]+")
_TERM_PATTERN = re.compile(r"(PRIMAVERA|VERANO|OTOÑO|OTONO|ABRIL-JUNIO)\s+(\d{4})")
_WHITESPACE_PATTERN = re.compile(r"\s+")


def ensure_directory(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def normalize_whitespace(value: str) -> str:
    return _WHITESPACE_PATTERN.sub(" ", value).strip()


def ascii_normalize(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    return normalized.encode("ascii", "ignore").decode("ascii")


def slugify(value: str) -> str:
    ascii_value = ascii_normalize(value).lower()
    return _NON_WORD_PATTERN.sub("-", ascii_value).strip("-")


def stable_hash_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def normalize_search_text(value: str) -> str:
    return normalize_whitespace(ascii_normalize(value)).lower()


def parse_term_label(value: str) -> tuple[str, int] | None:
    match = _TERM_PATTERN.search(value.upper())
    if match is None:
        return None
    return match.group(1), int(match.group(2))


def term_start_date(value: str) -> date | None:
    parsed = parse_term_label(value)
    if parsed is None:
        return None
    season, year = parsed
    return date(year, TERM_START_MONTHS[season], 1)


def term_end_date(value: str) -> date | None:
    parsed = parse_term_label(value)
    if parsed is None:
        return None
    season, year = parsed
    month = TERM_END_MONTHS[season]
    return date(year, month, calendar_module.monthrange(year, month)[1])


def parse_month_day_expression(
    expression: str, default_year: int
) -> tuple[date | None, date | None]:
    cleaned = normalize_whitespace(expression.replace(" ,", ","))
    month_match = re.match(r"([A-Za-zÁÉÍÓÚáéíóú]{3})\s+(.+)", cleaned)
    if month_match is None:
        return None, None
    month_text = ascii_normalize(month_match.group(1)).upper()
    month = SPANISH_MONTH_ABBREVIATIONS[month_text]
    remainder = month_match.group(2)
    year_match = re.search(r"(\d{4})", remainder)
    year = int(year_match.group(1)) if year_match is not None else default_year
    day_numbers = [int(value) for value in re.findall(r"\d{2}", remainder)]
    if not day_numbers:
        return None, None
    return date(year, month, day_numbers[0]), date(year, month, day_numbers[-1])
