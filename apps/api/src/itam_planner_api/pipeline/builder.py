from __future__ import annotations

import shutil
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal
from urllib.parse import urlparse

import httpx

from ..common import ensure_directory, stable_hash_bytes
from ..config import Settings
from ..exports.json_exporter import export_public_dataset
from ..models import SourceSnapshot
from ..parsers.boletines import parse_boletines_index, parse_bulletin_pdf
from ..parsers.calendars import (
    parse_calendars_page,
    parse_payment_calendar_pdf,
    parse_school_calendar_pdf,
)
from ..parsers.regulations import parse_regulation_pdf
from ..parsers.schedules import (
    parse_schedule_offerings,
    parse_schedule_periods_menu,
    parse_schedule_subjects,
)
from ..parsers.services import parse_services_page
from ..storage.repository import CatalogRepository

SERVICES_URL = "https://servicios.itam.mx/"
CALENDARS_URL = "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php"
BOLETINES_URL = "https://horariositam.com/boletines.html"
MENU_URL = "https://itaca2.itam.mx:8443/b9prod/edsup/BWZKSENP.P_MenuServNoPers"
HORARIOS_FORM_URL = "https://itaca2.itam.mx:8443/b9prod/edsup/BWZKSENP.P_Horarios2"


class ValidationError(RuntimeError):
    pass


def build_from_fixtures(fixtures_root: Path, public_data_root: Path | None = None) -> Path:
    settings = Settings()
    root = public_data_root or settings.public_data_root
    working_root = _prepare_working_root(root)
    repository = CatalogRepository(working_root / "catalog.sqlite")
    repository.initialize()
    run_id = "fixtures"
    repository.create_scrape_run(run_id, status="running", notes="fixture ingestion")
    try:
        _ingest_fixture_sources(repository, run_id, fixtures_root)
        _validate_catalog(repository)
        export_public_dataset(repository, working_root)
        promote_public_snapshot(working_root, root / "latest")
        repository.complete_scrape_run(run_id, status="succeeded")
        return root / "latest"
    except Exception as exc:
        repository.complete_scrape_run(run_id, status="failed", notes=str(exc))
        raise
    finally:
        repository.close()


def build_from_live(public_data_root: Path | None = None) -> Path:
    settings = Settings()
    root = public_data_root or settings.public_data_root
    working_root = _prepare_working_root(root)
    raw_root = ensure_directory(root / "working" / "raw")
    repository = CatalogRepository(working_root / "catalog.sqlite")
    repository.initialize()
    run_id = datetime.now(tz=UTC).strftime("live-%Y%m%d-%H%M%S")
    repository.create_scrape_run(run_id, status="running", notes="live ingestion")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9,es-MX;q=0.8",
    }
    try:
        with httpx.Client(follow_redirects=True, timeout=30.0, headers=headers) as client:
            _ingest_live_sources(repository, run_id, client, raw_root)
        _validate_catalog(repository)
        export_public_dataset(repository, working_root)
        promote_public_snapshot(working_root, root / "latest")
        repository.complete_scrape_run(run_id, status="succeeded")
        return root / "latest"
    except Exception as exc:
        repository.complete_scrape_run(run_id, status="failed", notes=str(exc))
        raise
    finally:
        repository.close()


def promote_public_snapshot(working_root: Path, latest_root: Path) -> None:
    temp_root = latest_root.with_name("_latest_next")
    if temp_root.exists():
        shutil.rmtree(temp_root)
    shutil.copytree(working_root, temp_root)
    if latest_root.exists():
        shutil.rmtree(latest_root)
    temp_root.replace(latest_root)


def _prepare_working_root(public_data_root: Path) -> Path:
    working_root = ensure_directory(public_data_root / "working" / "current")
    if working_root.exists():
        shutil.rmtree(working_root)
    ensure_directory(working_root)
    return working_root


def _ingest_fixture_sources(
    repository: CatalogRepository, run_id: str, fixtures_root: Path
) -> None:
    html_root = fixtures_root / "html"
    pdf_root = fixtures_root / "pdfs"
    observed_at = datetime.now(tz=UTC)

    services_html = (html_root / "servicios_itam.html").read_text(encoding="utf-8")
    _, manual_url = parse_services_page(services_html, SERVICES_URL)
    repository.record_source_snapshot(
        _snapshot(
            "services-home",
            "discovery",
            SERVICES_URL,
            services_html.encode("utf-8"),
            observed_at,
            "text/html",
        ),
        run_id,
        len(services_html.encode("utf-8")),
    )

    calendars_html = (html_root / "servicios_calendarios.html").read_text(encoding="utf-8")
    calendar_links = parse_calendars_page(calendars_html, CALENDARS_URL)
    repository.record_source_snapshot(
        _snapshot(
            "calendar-links",
            "discovery",
            CALENDARS_URL,
            calendars_html.encode("utf-8"),
            observed_at,
            "text/html",
        ),
        run_id,
        len(calendars_html.encode("utf-8")),
    )

    school_calendar_bytes = (pdf_root / "school_calendar_2026.pdf").read_bytes()
    school_snapshot = repository.record_source_snapshot(
        _snapshot(
            "school-calendar-2026",
            "calendar",
            calendar_links["school_calendar"],
            school_calendar_bytes,
            observed_at,
            "application/pdf",
        ),
        run_id,
        len(school_calendar_bytes),
    )
    repository.store_calendar_document(
        parse_school_calendar_pdf(school_calendar_bytes), school_snapshot
    )

    payment_calendar_bytes = (pdf_root / "payment_calendar_2026.pdf").read_bytes()
    payment_snapshot = repository.record_source_snapshot(
        _snapshot(
            "payment-calendar-2026",
            "calendar",
            calendar_links["payment_calendar"],
            payment_calendar_bytes,
            observed_at,
            "application/pdf",
        ),
        run_id,
        len(payment_calendar_bytes),
    )
    repository.store_calendar_document(
        parse_payment_calendar_pdf(payment_calendar_bytes), payment_snapshot
    )

    regulation_pre_bytes = (pdf_root / "regulation_pre_2025.pdf").read_bytes()
    regulation_pre_snapshot = repository.record_source_snapshot(
        _snapshot(
            "regulation-pre-2025",
            "regulation",
            calendar_links["regulation_pre_2025"],
            regulation_pre_bytes,
            observed_at,
            "application/pdf",
        ),
        run_id,
        len(regulation_pre_bytes),
    )
    repository.store_regulation_document(
        parse_regulation_pdf(
            regulation_pre_bytes,
            regulation_type="pre-2025",
            title_hint="Reglamento para alumnos que ingresaron antes de Otoño 2025",
            entry_from_term=None,
            entry_to_term="OTOÑO 2025",
            active_from=None,
            active_to=datetime(2025, 7, 31, tzinfo=UTC).date(),
        ),
        regulation_pre_snapshot,
    )

    regulation_post_bytes = (pdf_root / "regulation_post_2025.pdf").read_bytes()
    regulation_post_snapshot = repository.record_source_snapshot(
        _snapshot(
            "regulation-post-2025",
            "regulation",
            calendar_links["regulation_post_2025"],
            regulation_post_bytes,
            observed_at,
            "application/pdf",
        ),
        run_id,
        len(regulation_post_bytes),
    )
    repository.store_regulation_document(
        parse_regulation_pdf(
            regulation_post_bytes,
            regulation_type="post-2025",
            title_hint="Reglamento para alumnos que ingresaron a partir de Otoño 2025",
            entry_from_term="OTOÑO 2025",
            entry_to_term=None,
            active_from=datetime(2025, 8, 1, tzinfo=UTC).date(),
            active_to=None,
        ),
        regulation_post_snapshot,
    )

    boletines_html = (html_root / "boletines_index.html").read_text(encoding="utf-8")
    boletines_observed_at, _ = parse_boletines_index(boletines_html, BOLETINES_URL)
    repository.record_source_snapshot(
        _snapshot(
            "boletines-index",
            "boletines",
            BOLETINES_URL,
            boletines_html.encode("utf-8"),
            boletines_observed_at or observed_at,
            "text/html",
        ),
        run_id,
        len(boletines_html.encode("utf-8")),
    )
    for fixture_name in ("bulletin_sample_ma_e.pdf", "bulletin_sample_act_g.pdf"):
        bulletin_bytes = (pdf_root / fixture_name).read_bytes()
        source_code = (
            fixture_name.removeprefix("bulletin_sample_")
            .removesuffix(".pdf")
            .replace("_", "-")
            .upper()
        )
        bulletin_snapshot = repository.record_source_snapshot(
            _snapshot(
                f"bulletin-{source_code.lower()}",
                "boletin",
                f"{BOLETINES_URL}/{fixture_name}",
                bulletin_bytes,
                observed_at,
                "application/pdf",
            ),
            run_id,
            len(bulletin_bytes),
        )
        repository.store_bulletin(
            parse_bulletin_pdf(bulletin_bytes, source_code), bulletin_snapshot
        )

    menu_html = (html_root / "menu_servicios_no_personalizados.html").read_text(encoding="utf-8")
    periods = parse_schedule_periods_menu(menu_html, MENU_URL)
    menu_snapshot = repository.record_source_snapshot(
        _snapshot(
            "schedule-menu",
            "schedule",
            MENU_URL,
            menu_html.encode("utf-8"),
            observed_at,
            "text/html",
        ),
        run_id,
        len(menu_html.encode("utf-8")),
    )
    period_2938_html = (html_root / "horarios_period_2938.html").read_text(encoding="utf-8")
    period_2938_subjects = parse_schedule_subjects(period_2938_html, "2938")
    period_2938_offerings_html = (html_root / "horarios_act_11300.html").read_text(encoding="utf-8")
    period_2938_offerings = parse_schedule_offerings(period_2938_offerings_html, "2938")
    for period in periods:
        if period.period_id == "2938":
            period.subjects = period_2938_subjects
            period.offerings = period_2938_offerings
        repository.store_schedule_period(period, menu_snapshot)

    if manual_url is not None:
        repository.record_source_snapshot(
            _snapshot(
                "services-manual",
                "manual",
                manual_url,
                b"",
                observed_at,
                "application/pdf",
                "skipped",
            ),
            run_id,
            0,
        )


def _ingest_live_sources(
    repository: CatalogRepository, run_id: str, client: httpx.Client, raw_root: Path
) -> None:
    observed_at = datetime.now(tz=UTC)
    services_bytes = _fetch(client, SERVICES_URL)
    repository.record_source_snapshot(
        _snapshot(
            "services-home",
            "discovery",
            SERVICES_URL,
            services_bytes,
            observed_at,
            "text/html",
            _cache(raw_root, "services-home", SERVICES_URL, services_bytes),
        ),
        run_id,
        len(services_bytes),
    )
    services_html = services_bytes.decode("utf-8", errors="ignore")
    _, manual_url = parse_services_page(services_html, SERVICES_URL)

    calendars_bytes = _fetch(client, CALENDARS_URL)
    repository.record_source_snapshot(
        _snapshot(
            "calendar-links",
            "discovery",
            CALENDARS_URL,
            calendars_bytes,
            observed_at,
            "text/html",
            _cache(raw_root, "calendar-links", CALENDARS_URL, calendars_bytes),
        ),
        run_id,
        len(calendars_bytes),
    )
    calendar_links = parse_calendars_page(
        calendars_bytes.decode("utf-8", errors="ignore"), CALENDARS_URL
    )

    for source_id, kind, parser in (
        ("school-calendar-2026", "calendar", parse_school_calendar_pdf),
        ("payment-calendar-2026", "calendar", parse_payment_calendar_pdf),
    ):
        url = calendar_links["school_calendar" if "school" in source_id else "payment_calendar"]
        payload = _fetch(client, url)
        snapshot_id = repository.record_source_snapshot(
            _snapshot(
                source_id,
                kind,
                url,
                payload,
                observed_at,
                "application/pdf",
                _cache(raw_root, source_id, url, payload),
            ),
            run_id,
            len(payload),
        )
        repository.store_calendar_document(parser(payload), snapshot_id)

    for key, regulation_type, entry_from_term, entry_to_term, active_from, active_to in (
        (
            "regulation_pre_2025",
            "pre-2025",
            None,
            "OTOÑO 2025",
            None,
            datetime(2025, 7, 31, tzinfo=UTC).date(),
        ),
        (
            "regulation_post_2025",
            "post-2025",
            "OTOÑO 2025",
            None,
            datetime(2025, 8, 1, tzinfo=UTC).date(),
            None,
        ),
    ):
        url = calendar_links[key]
        payload = _fetch(client, url)
        snapshot_id = repository.record_source_snapshot(
            _snapshot(
                regulation_type,
                "regulation",
                url,
                payload,
                observed_at,
                "application/pdf",
                _cache(raw_root, regulation_type, url, payload),
            ),
            run_id,
            len(payload),
        )
        repository.store_regulation_document(
            parse_regulation_pdf(
                payload,
                regulation_type=regulation_type,
                title_hint=key,
                entry_from_term=entry_from_term,
                entry_to_term=entry_to_term,
                active_from=active_from,
                active_to=active_to,
            ),
            snapshot_id,
        )

    boletines_bytes = _fetch(client, BOLETINES_URL)
    boletines_observed_at, bulletin_links = parse_boletines_index(
        boletines_bytes.decode("utf-8", errors="ignore"), BOLETINES_URL
    )
    repository.record_source_snapshot(
        _snapshot(
            "boletines-index",
            "boletines",
            BOLETINES_URL,
            boletines_bytes,
            boletines_observed_at or observed_at,
            "text/html",
            _cache(raw_root, "boletines-index", BOLETINES_URL, boletines_bytes),
        ),
        run_id,
        len(boletines_bytes),
    )
    for bulletin_link in bulletin_links:
        payload = _fetch(client, bulletin_link.url)
        snapshot_id = repository.record_source_snapshot(
            _snapshot(
                f"bulletin-{bulletin_link.code.lower()}",
                "boletin",
                bulletin_link.url,
                payload,
                observed_at,
                "application/pdf",
                _cache(
                    raw_root, f"bulletin-{bulletin_link.code.lower()}", bulletin_link.url, payload
                ),
            ),
            run_id,
            len(payload),
        )
        repository.store_bulletin(parse_bulletin_pdf(payload, bulletin_link.code), snapshot_id)

    menu_bytes = _fetch(client, MENU_URL)
    menu_snapshot = repository.record_source_snapshot(
        _snapshot(
            "schedule-menu",
            "schedule",
            MENU_URL,
            menu_bytes,
            observed_at,
            "text/html",
            _cache(raw_root, "schedule-menu", MENU_URL, menu_bytes),
        ),
        run_id,
        len(menu_bytes),
    )
    periods = parse_schedule_periods_menu(menu_bytes.decode("utf-8", errors="ignore"), MENU_URL)
    for period in periods:
        subjects_url = (
            f"https://itaca2.itam.mx:8443/b9prod/edsup/BWZKSENP.P_Horarios1?s={period.period_id}"
        )
        subjects_bytes = _fetch(client, subjects_url)
        period.subjects = parse_schedule_subjects(
            subjects_bytes.decode("utf-8", errors="ignore"), period.period_id
        )
        for subject in period.subjects:
            offering_response = client.post(
                HORARIOS_FORM_URL, data={"s": period.period_id, "txt_materia": subject.raw_value}
            )
            offering_response.raise_for_status()
            offering_bytes = offering_response.content
            repository.record_source_snapshot(
                _snapshot(
                    f"schedule-offering-{period.period_id}-{subject.course.course_code.lower()}",
                    "schedule",
                    HORARIOS_FORM_URL,
                    offering_bytes,
                    observed_at,
                    "text/html",
                    _cache(
                        raw_root,
                        f"schedule-offering-{period.period_id}",
                        subject.course.course_code,
                        offering_bytes,
                        suffix=".html",
                    ),
                ),
                run_id,
                len(offering_bytes),
            )
            period.offerings.extend(
                parse_schedule_offerings(
                    offering_bytes.decode("utf-8", errors="ignore"), period.period_id
                )
            )
        repository.store_schedule_period(period, menu_snapshot)

    if manual_url is not None:
        manual_bytes = _fetch(client, manual_url)
        repository.record_source_snapshot(
            _snapshot(
                "services-manual",
                "manual",
                manual_url,
                manual_bytes,
                observed_at,
                "application/pdf",
                _cache(raw_root, "services-manual", manual_url, manual_bytes),
                "skipped",
            ),
            run_id,
            len(manual_bytes),
        )


def _validate_catalog(repository: CatalogRepository) -> None:
    minimums = {
        "source_snapshots": 1,
        "bulletin_documents": 1,
        "bulletin_requirements": 1,
        "calendar_documents": 2,
        "calendar_events": 1,
        "payment_events": 1,
        "regulation_documents": 2,
        "regulation_sections": 1,
        "schedule_periods": 1,
        "schedule_subjects": 1,
        "schedule_offerings": 1,
        "schedule_meetings": 1,
    }
    failed = {
        table_name: repository.table_count(table_name)
        for table_name, minimum in minimums.items()
        if repository.table_count(table_name) < minimum
    }
    if failed:
        raise ValidationError(f"catalog validation failed: {failed}")


def _snapshot(
    source_id: str,
    source_kind: str,
    upstream_url: str,
    payload: bytes,
    observed_at: datetime,
    media_type: str,
    artifact_path: str | None = None,
    parse_status: Literal["parsed", "skipped", "failed"] = "parsed",
) -> SourceSnapshot:
    return SourceSnapshot(
        source_id=source_id,
        source_kind=source_kind,
        upstream_url=upstream_url,
        observed_at=observed_at,
        content_hash=stable_hash_bytes(payload),
        parse_status=parse_status,
        media_type=media_type,
        artifact_path=artifact_path,
    )


def _fetch(client: httpx.Client, url: str) -> bytes:
    response = client.get(url)
    response.raise_for_status()
    return response.content


def _cache(
    raw_root: Path, source_id: str, url_hint: str, payload: bytes, *, suffix: str | None = None
) -> str:
    extension = suffix or Path(urlparse(url_hint).path).suffix or ".bin"
    target = ensure_directory(raw_root / source_id) / f"artifact{extension}"
    target.write_bytes(payload)
    return str(target.relative_to(raw_root.parent.parent))
