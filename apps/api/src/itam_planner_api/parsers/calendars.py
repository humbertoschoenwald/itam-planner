from __future__ import annotations

from datetime import date
from operator import itemgetter
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from ..common import SPANISH_MONTH_NAMES, normalize_whitespace, parse_month_day_expression
from ..models import CalendarDocument, CalendarEvent, CalendarLegendSymbol, PaymentEvent
from .pdf import extract_pdf_words

CALENDAR_YEAR_DIGITS = 4
TITLE_TOP_MAX = 90
LEGEND_TOP_MIN = 1035
LEGEND_SEGMENT_GAP = 18
LEGEND_MIN_SEGMENT_LENGTH = 2
WEEKDAY_COLUMN_COUNT = 7
NEXT_MONTH_MIN_TOP_OFFSET = 80
NEXT_MONTH_MAX_X_OFFSET = 40
BLOCK_HEADER_TOP_OFFSET = 30
BLOCK_X_START_OFFSET = 110
BLOCK_X_END_OFFSET = 130
BLOCK_LEFT_PADDING = 24
BLOCK_RIGHT_PADDING = 12
BLOCK_TOP_PADDING = 4
LEGEND_BOTTOM_PADDING = 10
NEXT_MONTH_BOTTOM_PADDING = 14
FIRST_DAY_X_TOLERANCE = 5
PAYMENT_ROW_TOP_MIN = 632
PAYMENT_ROW_TOP_MAX = 740
PAYMENT_LEFT_MAX_X = 430
PAYMENT_SPRING_MIN_X = 430
PAYMENT_SPRING_MAX_X = 478
PAYMENT_SUMMER_MIN_X = 478
PAYMENT_SUMMER_MAX_X = 511
PAYMENT_FALL_MIN_X = 511


def parse_calendars_page(html: str, base_url: str) -> dict[str, str]:
    soup = BeautifulSoup(html, "lxml")
    links: dict[str, str] = {}
    for anchor in soup.find_all("a", href=True):
        text = normalize_whitespace(anchor.get_text(" ", strip=True))
        href = urljoin(base_url, str(anchor.get("href", "")))
        if text == "2026":
            links["school_calendar"] = href
        elif text == "Calendario de Pagos 2026":
            links["payment_calendar"] = href
        elif text == "Reglamento para alumnos que ingresaron antes de Otoño 2025":
            links["regulation_pre_2025"] = href
        elif text == "Reglamento para alumnos que ingresaron a partir de Otoño 2025":
            links["regulation_post_2025"] = href
    return links


def parse_school_calendar_pdf(pdf_bytes: bytes) -> CalendarDocument:
    words = extract_pdf_words(pdf_bytes)
    title = _extract_title(words)
    year = int(
        next(
            word["text"]
            for word in words
            if str(word["text"]).isdigit()
            and len(str(word["text"])) == CALENDAR_YEAR_DIGITS
        )
    )
    legend = _parse_school_legend(words)
    legend_by_symbol = {item.symbol: item.label for item in legend}
    events = _parse_school_calendar_events(words, year, legend_by_symbol)
    return CalendarDocument(
        calendar_id=f"school-calendar-{year}",
        calendar_kind="school",
        title=title,
        period_label=str(year),
        active_from=date(year, 1, 1),
        active_to=date(year, 12, 31),
        legend=legend,
        events=events,
    )


def parse_payment_calendar_pdf(pdf_bytes: bytes) -> CalendarDocument:
    words = extract_pdf_words(pdf_bytes)
    title = _extract_title(words)
    year = int(
        next(
            word["text"]
            for word in words
            if str(word["text"]).isdigit()
            and len(str(word["text"])) == CALENDAR_YEAR_DIGITS
        )
    )
    return CalendarDocument(
        calendar_id=f"payment-calendar-{year}",
        calendar_kind="payment",
        title=title,
        period_label=str(year),
        active_from=date(year, 1, 1),
        active_to=date(year, 12, 31),
        payment_events=_parse_payment_rows(words, year),
    )


def _extract_title(words: list[dict[str, float | str]]) -> str:
    title_words = [str(word["text"]) for word in words if float(word["top"]) < TITLE_TOP_MAX]
    return normalize_whitespace(" ".join(title_words))


def _group_words_by_top(
    words: list[dict[str, float | str]], *, tolerance: float = 3.0
) -> list[list[dict[str, float | str]]]:
    grouped: list[list[dict[str, float | str]]] = []
    for word in sorted(words, key=itemgetter("top", "x0")):
        if not grouped or abs(float(grouped[-1][0]["top"]) - float(word["top"])) > tolerance:
            grouped.append([word])
        else:
            grouped[-1].append(word)
    for group in grouped:
        group.sort(key=itemgetter("x0"))
    return grouped


def _parse_school_legend(words: list[dict[str, float | str]]) -> list[CalendarLegendSymbol]:
    legend_rows = [
        row for row in _group_words_by_top(words) if float(row[0]["top"]) > LEGEND_TOP_MIN
    ]
    legend: list[CalendarLegendSymbol] = []
    for row in legend_rows:
        segments: list[list[dict[str, float | str]]] = []
        current_segment: list[dict[str, float | str]] = [row[0]]
        for word in row[1:]:
            if float(word["x0"]) - float(current_segment[-1]["x1"]) > LEGEND_SEGMENT_GAP:
                segments.append(current_segment)
                current_segment = [word]
            else:
                current_segment.append(word)
        segments.append(current_segment)
        for segment in segments:
            if len(segment) < LEGEND_MIN_SEGMENT_LENGTH:
                continue
            legend.append(
                CalendarLegendSymbol(
                    symbol=str(segment[0]["text"]),
                    label=normalize_whitespace(" ".join(str(item["text"]) for item in segment[1:])),
                )
            )
    return legend


def _parse_school_calendar_events(
    words: list[dict[str, float | str]], year: int, legend_by_symbol: dict[str, str]
) -> list[CalendarEvent]:
    legend_top = min(float(word["top"]) for word in words if float(word["top"]) > LEGEND_TOP_MIN)
    month_headers = [
        word
        for word in words
        if str(word["text"]).upper() in SPANISH_MONTH_NAMES and float(word["top"]) < legend_top
    ]
    month_headers.sort(key=itemgetter("top", "x0"))
    events: list[CalendarEvent] = []

    for header in month_headers:
        month_number = SPANISH_MONTH_NAMES[str(header["text"]).upper()]
        columns = [
            word
            for word in words
            if float(word["top"]) > float(header["bottom"])
            and float(word["top"]) < float(header["bottom"]) + BLOCK_HEADER_TOP_OFFSET
            and str(word["text"]) in {"D", "L", "M", "J", "V", "S"}
            and float(word["x0"]) > float(header["x0"]) - BLOCK_X_START_OFFSET
            and float(word["x0"]) < float(header["x0"]) + BLOCK_X_END_OFFSET
        ]
        columns.sort(key=itemgetter("x0"))
        if len(columns) != WEEKDAY_COLUMN_COUNT:
            continue

        next_month_same_column = next(
            (
                candidate
                for candidate in month_headers
                if float(candidate["top"]) > float(header["top"]) + NEXT_MONTH_MIN_TOP_OFFSET
                and abs(float(candidate["x0"]) - float(header["x0"])) < NEXT_MONTH_MAX_X_OFFSET
            ),
            None,
        )
        y_end = (
            float(next_month_same_column["top"]) - NEXT_MONTH_BOTTOM_PADDING
            if next_month_same_column
            else legend_top - LEGEND_BOTTOM_PADDING
        )
        block_words = [
            word
            for word in words
            if float(word["x0"]) >= float(columns[0]["x0"]) - BLOCK_LEFT_PADDING
            and float(word["x0"]) <= float(columns[-1]["x1"]) + BLOCK_RIGHT_PADDING
            and float(word["top"]) >= float(columns[0]["bottom"]) + BLOCK_TOP_PADDING
            and float(word["top"]) <= y_end
        ]
        rows = _group_words_by_top(block_words)
        column_positions = [float(word["x0"]) for word in columns]
        first_day_x = column_positions[0]
        last_dates_by_column: dict[int, date] = {}

        for row in rows:
            digits = [word for word in row if str(word["text"]).isdigit()]
            if digits:
                current_dates_by_column: dict[int, date] = {}
                for digit in digits:
                    if float(digit["x0"]) < first_day_x - FIRST_DAY_X_TOLERANCE:
                        continue
                    column_index = min(
                        range(len(column_positions)),
                        key=lambda index: abs(column_positions[index] - float(digit["x0"])),
                    )
                    current_dates_by_column[column_index] = date(
                        year, month_number, int(str(digit["text"]))
                    )
                if current_dates_by_column:
                    last_dates_by_column = current_dates_by_column
                continue

            for word in row:
                symbol = str(word["text"])
                if symbol not in legend_by_symbol or not last_dates_by_column:
                    continue
                column_index = min(
                    range(len(column_positions)),
                    key=lambda index: abs(column_positions[index] - float(word["x0"])),
                )
                event_date = last_dates_by_column.get(column_index)
                if event_date is None:
                    continue
                events.append(
                    CalendarEvent(
                        event_date=event_date,
                        legend_symbol=symbol,
                        label=legend_by_symbol[symbol],
                        active_from=event_date,
                        active_to=event_date,
                    )
                )

    unique_events: dict[tuple[date, str], CalendarEvent] = {}
    for event in events:
        unique_events[(event.event_date, event.legend_symbol)] = event
    return sorted(unique_events.values(), key=lambda item: (item.event_date, item.legend_symbol))


def _parse_payment_rows(words: list[dict[str, float | str]], year: int) -> list[PaymentEvent]:
    grouped_rows = [
        row
        for row in _group_words_by_top(words)
        if PAYMENT_ROW_TOP_MIN <= float(row[0]["top"]) <= PAYMENT_ROW_TOP_MAX
    ]
    events: list[PaymentEvent] = []
    for row in grouped_rows:
        left = [str(word["text"]) for word in row if float(word["x0"]) < PAYMENT_LEFT_MAX_X]
        if not left:
            continue
        primavera = normalize_whitespace(
            " ".join(
                str(word["text"])
                for word in row
                if PAYMENT_SPRING_MIN_X <= float(word["x0"]) < PAYMENT_SPRING_MAX_X
            )
        )
        verano = normalize_whitespace(
            " ".join(
                str(word["text"])
                for word in row
                if PAYMENT_SUMMER_MIN_X <= float(word["x0"]) < PAYMENT_SUMMER_MAX_X
            )
        )
        otono = normalize_whitespace(
            " ".join(str(word["text"]) for word in row if float(word["x0"]) >= PAYMENT_FALL_MIN_X)
        )
        code = left[0]
        label = normalize_whitespace(" ".join(left[1:]))
        for academic_period, expression in (
            ("PRIMAVERA", primavera),
            ("VERANO", verano),
            ("OTOÑO", otono),
        ):
            if not expression:
                continue
            start_date, end_date = parse_month_day_expression(expression, year)
            event_date = start_date if start_date == end_date else None
            events.append(
                PaymentEvent(
                    code=code,
                    label=label,
                    academic_period=academic_period,
                    event_date=event_date,
                    date_range_start=None if event_date else start_date,
                    date_range_end=None if event_date else end_date,
                    active_from=start_date,
                    active_to=end_date,
                )
            )
    return events
