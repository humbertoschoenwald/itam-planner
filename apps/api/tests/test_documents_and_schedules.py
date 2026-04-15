from __future__ import annotations

from itam_planner_api.parsers.calendars import parse_payment_calendar_pdf, parse_school_calendar_pdf
from itam_planner_api.parsers.regulations import parse_regulation_pdf
from itam_planner_api.parsers.schedules import (
    parse_schedule_offerings,
    parse_schedule_periods_menu,
    parse_schedule_subjects,
)


def test_parse_school_calendar_pdf_extracts_legend_and_day_events(fixtures_root) -> None:
    calendar = parse_school_calendar_pdf(
        (fixtures_root / "pdfs" / "school_calendar_2026.pdf").read_bytes()
    )

    assert any(
        item.symbol == "D" and item.label == "Descanso Obligatorio" for item in calendar.legend
    )
    assert any(
        event.event_date.isoformat() == "2026-01-01" and event.legend_symbol == "D"
        for event in calendar.events
    )
    assert any(
        event.event_date.isoformat() == "2026-01-12" and event.legend_symbol == "p"
        for event in calendar.events
    )


def test_parse_payment_calendar_pdf_extracts_single_and_range_milestones(fixtures_root) -> None:
    calendar = parse_payment_calendar_pdf(
        (fixtures_root / "pdfs" / "payment_calendar_2026.pdf").read_bytes()
    )
    by_key = {(event.code, event.academic_period): event for event in calendar.payment_events}

    assert by_key[("PNI", "PRIMAVERA")].event_date.isoformat() == "2026-01-02"
    assert by_key[("B2", "OTOÑO")].event_date.isoformat() == "2026-10-25"
    range_event = by_key[("2", "PRIMAVERA")]
    assert range_event.date_range_start.isoformat() == "2026-02-03"
    assert range_event.date_range_end.isoformat() == "2026-02-05"


def test_parse_regulation_pdf_builds_searchable_sections(fixtures_root) -> None:
    regulation = parse_regulation_pdf(
        (fixtures_root / "pdfs" / "regulation_post_2025.pdf").read_bytes(),
        regulation_type="post-2025",
        title_hint="Reglamento para alumnos que ingresaron a partir de Otoño 2025",
        entry_from_term="OTOÑO 2025",
        entry_to_term=None,
        active_from=None,
        active_to=None,
    )

    assert len(regulation.sections) > 20
    assert any(section.chapter_label == "CAPÍTULO I" for section in regulation.sections)
    assert any("rectoria" in section.search_text for section in regulation.sections)


def test_parse_schedule_pages_extracts_periods_subjects_and_offerings(fixtures_root) -> None:
    periods = parse_schedule_periods_menu(
        (fixtures_root / "html" / "menu_servicios_no_personalizados.html").read_text(
            encoding="utf-8"
        ),
        "https://itaca2.itam.mx:8443/b9prod/edsup/BWZKSENP.P_MenuServNoPers",
    )
    subjects = parse_schedule_subjects(
        (fixtures_root / "html" / "horarios_period_2938.html").read_text(encoding="utf-8"),
        "2938",
    )
    offerings = parse_schedule_offerings(
        (fixtures_root / "html" / "horarios_act_11300.html").read_text(encoding="utf-8"),
        "2938",
    )

    assert {period.period_id for period in periods} == {"2938", "2925", "2975", "2976"}
    assert subjects[0].raw_value == "ACT-11300-CALCULO ACTUARIAL I"
    assert len(subjects) == 508
    assert len(offerings) == 3
    assert [meeting.weekday_code for meeting in offerings[0].meetings] == ["MA", "JU"]
