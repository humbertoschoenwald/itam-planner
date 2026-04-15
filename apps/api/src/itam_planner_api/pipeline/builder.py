from __future__ import annotations

import json
import shutil
import sqlite3
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal
from urllib.parse import urlparse

import httpx

from ..common import ensure_directory, stable_hash_bytes
from ..config import Settings
from ..exports.json_exporter import export_public_dataset
from ..models import ScheduleOffering, ScheduleSubject, SourceSnapshot
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


@dataclass(frozen=True)
class LiveSourceMaterial:
    snapshot: SourceSnapshot
    payload: bytes


@dataclass(frozen=True)
class BulletinSourceAsset:
    code: str
    document: LiveSourceMaterial


@dataclass(frozen=True)
class LiveSourceBundle:
    services_page: LiveSourceMaterial
    manual_document: LiveSourceMaterial | None
    calendars_page: LiveSourceMaterial
    school_calendar_document: LiveSourceMaterial
    payment_calendar_document: LiveSourceMaterial
    regulation_documents: dict[str, LiveSourceMaterial]
    boletines_index: LiveSourceMaterial
    bulletin_documents: list[BulletinSourceAsset]
    schedule_menu: LiveSourceMaterial
    schedule_period_pages: dict[str, LiveSourceMaterial]
    schedule_offering_pages: dict[str, dict[str, LiveSourceMaterial]]


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
        repository.complete_scrape_run(run_id, status="succeeded")
        repository.mark_promoted_release(run_id, notes="fixture promotion")
        export_public_dataset(repository, working_root)
        promote_public_snapshot(working_root, root / "latest")
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
    bundle_collected = False
    bundle: LiveSourceBundle | None = None
    compared_release_id: str | None = None
    changed_source_ids: list[str] = []
    try:
        with httpx.Client(follow_redirects=True, timeout=30.0, headers=headers) as client:
            bundle = _collect_live_source_bundle(client, raw_root)
        bundle_collected = True

        compared_release_id, previous_fingerprints = _latest_promoted_release_fingerprints(
            root / "latest" / "catalog.sqlite"
        )
        current_fingerprints = _source_fingerprints_from_bundle(bundle)
        changed_source_ids = _changed_source_ids(previous_fingerprints, current_fingerprints)

        if previous_fingerprints is not None and not changed_source_ids:
            _record_live_bundle_snapshots(
                repository,
                run_id,
                bundle,
                parse_status_override="unchanged",
            )
            repository.complete_scrape_run(
                run_id,
                status="no_changes",
                notes="No upstream changes detected",
            )
            _write_run_report(
                root,
                run_id=run_id,
                status="no_changes",
                message="No upstream changes detected.",
                changed_source_ids=[],
                compared_release_id=compared_release_id,
                latest_root=root / "latest",
            )
            return root / "latest"

        _record_live_bundle_snapshots(repository, run_id, bundle)
        _ingest_live_source_bundle(repository, bundle)
        _validate_catalog(repository)
        repository.complete_scrape_run(run_id, status="succeeded")
        repository.mark_promoted_release(run_id, notes="live promotion")
        export_public_dataset(repository, working_root)
        promote_public_snapshot(working_root, root / "latest")
        _write_run_report(
            root,
            run_id=run_id,
            status="succeeded",
            message="Promoted a new public dataset.",
            changed_source_ids=changed_source_ids,
            compared_release_id=compared_release_id,
            latest_root=root / "latest",
        )
        return root / "latest"
    except Exception as exc:
        failure_status = "drift_detected" if bundle_collected else "failed"
        repository.complete_scrape_run(run_id, status=failure_status, notes=str(exc))
        _write_run_report(
            root,
            run_id=run_id,
            status=failure_status,
            message=str(exc),
            changed_source_ids=changed_source_ids,
            compared_release_id=compared_release_id,
            latest_root=root / "latest",
        )
        if bundle_collected and bundle is not None:
            _write_drift_report(
                root,
                run_id=run_id,
                error_message=str(exc),
                changed_source_ids=changed_source_ids,
                compared_release_id=compared_release_id,
                current_fingerprints=_source_fingerprints_from_bundle(bundle),
            )
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
    bundle = _build_fixture_live_bundle(fixtures_root)
    _record_live_bundle_snapshots(repository, run_id, bundle)
    _ingest_live_source_bundle(repository, bundle)


def _build_fixture_live_bundle(fixtures_root: Path) -> LiveSourceBundle:
    html_root = fixtures_root / "html"
    pdf_root = fixtures_root / "pdfs"
    observed_at = datetime.now(tz=UTC)

    services_payload = (html_root / "servicios_itam.html").read_bytes()
    services_html = services_payload.decode("utf-8")
    _, manual_url = parse_services_page(services_html, SERVICES_URL)

    calendars_payload = (html_root / "servicios_calendarios.html").read_bytes()
    calendar_links = parse_calendars_page(calendars_payload.decode("utf-8"), CALENDARS_URL)

    boletines_payload = (html_root / "boletines_index.html").read_bytes()
    boletines_observed_at, bulletin_links = parse_boletines_index(
        boletines_payload.decode("utf-8"), BOLETINES_URL
    )
    bulletin_url_by_code = {bulletin.code: bulletin.url for bulletin in bulletin_links}

    schedule_menu_payload = (html_root / "menu_servicios_no_personalizados.html").read_bytes()
    schedule_period_payload = (html_root / "horarios_period_2938.html").read_bytes()
    schedule_offering_payload = (html_root / "horarios_act_11300.html").read_bytes()

    return LiveSourceBundle(
        services_page=_material(
            "services-home",
            "discovery",
            SERVICES_URL,
            services_payload,
            observed_at,
            "text/html",
        ),
        manual_document=
        None
        if manual_url is None
        else _material(
            "services-manual",
            "manual",
            manual_url,
            b"",
            observed_at,
            "application/pdf",
            parse_status="skipped",
        ),
        calendars_page=_material(
            "calendar-links",
            "discovery",
            CALENDARS_URL,
            calendars_payload,
            observed_at,
            "text/html",
        ),
        school_calendar_document=_material(
            "school-calendar-2026",
            "calendar",
            calendar_links["school_calendar"],
            (pdf_root / "school_calendar_2026.pdf").read_bytes(),
            observed_at,
            "application/pdf",
        ),
        payment_calendar_document=_material(
            "payment-calendar-2026",
            "calendar",
            calendar_links["payment_calendar"],
            (pdf_root / "payment_calendar_2026.pdf").read_bytes(),
            observed_at,
            "application/pdf",
        ),
        regulation_documents={
            "pre-2025": _material(
                "regulation-pre-2025",
                "regulation",
                calendar_links["regulation_pre_2025"],
                (pdf_root / "regulation_pre_2025.pdf").read_bytes(),
                observed_at,
                "application/pdf",
            ),
            "post-2025": _material(
                "regulation-post-2025",
                "regulation",
                calendar_links["regulation_post_2025"],
                (pdf_root / "regulation_post_2025.pdf").read_bytes(),
                observed_at,
                "application/pdf",
            ),
        },
        boletines_index=_material(
            "boletines-index",
            "boletines",
            BOLETINES_URL,
            boletines_payload,
            boletines_observed_at or observed_at,
            "text/html",
        ),
        bulletin_documents=[
            BulletinSourceAsset(
                code="MA-E",
                document=_material(
                    "bulletin-ma-e",
                    "boletin",
                    bulletin_url_by_code["MA-E"],
                    (pdf_root / "bulletin_sample_ma_e.pdf").read_bytes(),
                    observed_at,
                    "application/pdf",
                ),
            ),
            BulletinSourceAsset(
                code="ACT-G",
                document=_material(
                    "bulletin-act-g",
                    "boletin",
                    bulletin_url_by_code["ACT-G"],
                    (pdf_root / "bulletin_sample_act_g.pdf").read_bytes(),
                    observed_at,
                    "application/pdf",
                ),
            ),
        ],
        schedule_menu=_material(
            "schedule-menu",
            "schedule",
            MENU_URL,
            schedule_menu_payload,
            observed_at,
            "text/html",
        ),
        schedule_period_pages={
            "2938": _material(
                "schedule-period-2938",
                "schedule",
                "https://itaca2.itam.mx:8443/b9prod/edsup/BWZKSENP.P_Horarios1?s=2938",
                schedule_period_payload,
                observed_at,
                "text/html",
            )
        },
        schedule_offering_pages={
            "2938": {
                "ACT-11300": _material(
                    "schedule-offering-2938-act-11300",
                    "schedule",
                    HORARIOS_FORM_URL,
                    schedule_offering_payload,
                    observed_at,
                    "text/html",
                )
            }
        },
    )


def _collect_live_source_bundle(client: httpx.Client, raw_root: Path) -> LiveSourceBundle:
    observed_at = datetime.now(tz=UTC)

    services_payload = _fetch(client, SERVICES_URL)
    services_html = services_payload.decode("utf-8", errors="ignore")
    _, manual_url = parse_services_page(services_html, SERVICES_URL)

    calendars_payload = _fetch(client, CALENDARS_URL)
    calendar_links = parse_calendars_page(
        calendars_payload.decode("utf-8", errors="ignore"),
        CALENDARS_URL,
    )

    boletines_payload = _fetch(client, BOLETINES_URL)
    boletines_observed_at, bulletin_links = parse_boletines_index(
        boletines_payload.decode("utf-8", errors="ignore"), BOLETINES_URL
    )

    menu_payload = _fetch(client, MENU_URL)
    periods = parse_schedule_periods_menu(menu_payload.decode("utf-8", errors="ignore"), MENU_URL)

    manual_payload = _fetch(client, manual_url) if manual_url is not None else None
    school_calendar_payload = _fetch(client, calendar_links["school_calendar"])
    payment_calendar_payload = _fetch(client, calendar_links["payment_calendar"])
    regulation_pre_payload = _fetch(client, calendar_links["regulation_pre_2025"])
    regulation_post_payload = _fetch(client, calendar_links["regulation_post_2025"])
    bulletin_payloads = {
        bulletin_link.code: _fetch(client, bulletin_link.url) for bulletin_link in bulletin_links
    }

    schedule_period_pages: dict[str, LiveSourceMaterial] = {}
    schedule_offering_pages: dict[str, dict[str, LiveSourceMaterial]] = {}
    for period in periods:
        subjects_url = f"https://itaca2.itam.mx:8443/b9prod/edsup/BWZKSENP.P_Horarios1?s={period.period_id}"
        subjects_payload = _fetch(client, subjects_url)
        schedule_period_pages[period.period_id] = _material(
            f"schedule-period-{period.period_id}",
            "schedule",
            subjects_url,
            subjects_payload,
            observed_at,
            "text/html",
            artifact_path=_cache(
                raw_root,
                f"schedule-period-{period.period_id}",
                subjects_url,
                subjects_payload,
            ),
        )
        subjects = parse_schedule_subjects(
            subjects_payload.decode("utf-8", errors="ignore"),
            period.period_id,
        )
        offering_materials: dict[str, LiveSourceMaterial] = {}
        for subject in subjects:
            offering_response = client.post(
                HORARIOS_FORM_URL,
                data={"s": period.period_id, "txt_materia": subject.raw_value},
            )
            offering_response.raise_for_status()
            offering_payload = offering_response.content
            source_id = f"schedule-offering-{period.period_id}-{subject.course.course_code.lower()}"
            offering_materials[subject.course.course_code] = _material(
                source_id,
                "schedule",
                HORARIOS_FORM_URL,
                offering_payload,
                observed_at,
                "text/html",
                artifact_path=_cache(
                    raw_root,
                    source_id,
                    subject.course.course_code,
                    offering_payload,
                    suffix=".html",
                ),
            )
        schedule_offering_pages[period.period_id] = offering_materials

    return LiveSourceBundle(
        services_page=_material(
            "services-home",
            "discovery",
            SERVICES_URL,
            services_payload,
            observed_at,
            "text/html",
            artifact_path=_cache(raw_root, "services-home", SERVICES_URL, services_payload),
        ),
        manual_document=
        None
        if manual_url is None
        else _material(
            "services-manual",
            "manual",
            manual_url,
            manual_payload or b"",
            observed_at,
            "application/pdf",
            artifact_path=None
            if manual_payload is None
            else _cache(raw_root, "services-manual", manual_url, manual_payload),
            parse_status="skipped",
        ),
        calendars_page=_material(
            "calendar-links",
            "discovery",
            CALENDARS_URL,
            calendars_payload,
            observed_at,
            "text/html",
            artifact_path=_cache(raw_root, "calendar-links", CALENDARS_URL, calendars_payload),
        ),
        school_calendar_document=_material(
            "school-calendar-2026",
            "calendar",
            calendar_links["school_calendar"],
            school_calendar_payload,
            observed_at,
            "application/pdf",
            artifact_path=_cache(
                raw_root,
                "school-calendar-2026",
                calendar_links["school_calendar"],
                school_calendar_payload,
            ),
        ),
        payment_calendar_document=_material(
            "payment-calendar-2026",
            "calendar",
            calendar_links["payment_calendar"],
            payment_calendar_payload,
            observed_at,
            "application/pdf",
            artifact_path=_cache(
                raw_root,
                "payment-calendar-2026",
                calendar_links["payment_calendar"],
                payment_calendar_payload,
            ),
        ),
        regulation_documents={
            "pre-2025": _material(
                "regulation-pre-2025",
                "regulation",
                calendar_links["regulation_pre_2025"],
                regulation_pre_payload,
                observed_at,
                "application/pdf",
                artifact_path=_cache(
                    raw_root,
                    "regulation-pre-2025",
                    calendar_links["regulation_pre_2025"],
                    regulation_pre_payload,
                ),
            ),
            "post-2025": _material(
                "regulation-post-2025",
                "regulation",
                calendar_links["regulation_post_2025"],
                regulation_post_payload,
                observed_at,
                "application/pdf",
                artifact_path=_cache(
                    raw_root,
                    "regulation-post-2025",
                    calendar_links["regulation_post_2025"],
                    regulation_post_payload,
                ),
            ),
        },
        boletines_index=_material(
            "boletines-index",
            "boletines",
            BOLETINES_URL,
            boletines_payload,
            boletines_observed_at or observed_at,
            "text/html",
            artifact_path=_cache(raw_root, "boletines-index", BOLETINES_URL, boletines_payload),
        ),
        bulletin_documents=[
            BulletinSourceAsset(
                code=bulletin_link.code,
                document=_material(
                    f"bulletin-{bulletin_link.code.lower()}",
                    "boletin",
                    bulletin_link.url,
                    bulletin_payloads[bulletin_link.code],
                    observed_at,
                    "application/pdf",
                    artifact_path=_cache(
                        raw_root,
                        f"bulletin-{bulletin_link.code.lower()}",
                        bulletin_link.url,
                        bulletin_payloads[bulletin_link.code],
                    ),
                ),
            )
            for bulletin_link in bulletin_links
        ],
        schedule_menu=_material(
            "schedule-menu",
            "schedule",
            MENU_URL,
            menu_payload,
            observed_at,
            "text/html",
            artifact_path=_cache(raw_root, "schedule-menu", MENU_URL, menu_payload),
        ),
        schedule_period_pages=schedule_period_pages,
        schedule_offering_pages=schedule_offering_pages,
    )


def _record_live_bundle_snapshots(
    repository: CatalogRepository,
    run_id: str,
    bundle: LiveSourceBundle,
    *,
    parse_status_override: Literal["parsed", "skipped", "failed", "unchanged"] | None = None,
) -> None:
    for material in _bundle_materials(bundle):
        snapshot = material.snapshot.model_copy(
            update={"parse_status": parse_status_override or material.snapshot.parse_status}
        )
        repository.record_source_snapshot(snapshot, run_id, len(material.payload))


def _ingest_live_source_bundle(repository: CatalogRepository, bundle: LiveSourceBundle) -> None:
    repository.store_calendar_document(
        parse_school_calendar_pdf(bundle.school_calendar_document.payload),
        _snapshot_id(bundle.school_calendar_document.snapshot),
    )
    repository.store_calendar_document(
        parse_payment_calendar_pdf(bundle.payment_calendar_document.payload),
        _snapshot_id(bundle.payment_calendar_document.snapshot),
    )
    repository.store_regulation_document(
        parse_regulation_pdf(
            bundle.regulation_documents["pre-2025"].payload,
            regulation_type="pre-2025",
            title_hint="Reglamento para alumnos que ingresaron antes de Otoño 2025",
            entry_from_term=None,
            entry_to_term="OTOÑO 2025",
            active_from=None,
            active_to=datetime(2025, 7, 31, tzinfo=UTC).date(),
        ),
        _snapshot_id(bundle.regulation_documents["pre-2025"].snapshot),
    )
    repository.store_regulation_document(
        parse_regulation_pdf(
            bundle.regulation_documents["post-2025"].payload,
            regulation_type="post-2025",
            title_hint="Reglamento para alumnos que ingresaron a partir de Otoño 2025",
            entry_from_term="OTOÑO 2025",
            entry_to_term=None,
            active_from=datetime(2025, 8, 1, tzinfo=UTC).date(),
            active_to=None,
        ),
        _snapshot_id(bundle.regulation_documents["post-2025"].snapshot),
    )
    for bulletin_asset in bundle.bulletin_documents:
        repository.store_bulletin(
            parse_bulletin_pdf(bulletin_asset.document.payload, bulletin_asset.code),
            _snapshot_id(bulletin_asset.document.snapshot),
        )

    periods = parse_schedule_periods_menu(
        bundle.schedule_menu.payload.decode("utf-8", errors="ignore"), MENU_URL
    )
    for period in periods:
        period_material = bundle.schedule_period_pages.get(period.period_id)
        if period_material is None:
            repository.store_schedule_period(period, _snapshot_id(bundle.schedule_menu.snapshot))
            continue
        subjects = parse_schedule_subjects(
            period_material.payload.decode("utf-8", errors="ignore"), period.period_id
        )
        period.subjects = subjects
        offering_materials = bundle.schedule_offering_pages.get(period.period_id, {})
        period.offerings = _parse_schedule_offerings_from_materials(
            period.period_id, subjects, offering_materials
        )
        repository.store_schedule_period(period, _snapshot_id(period_material.snapshot))


def _parse_schedule_offerings_from_materials(
    period_id: str,
    subjects: list[ScheduleSubject],
    offering_materials: dict[str, LiveSourceMaterial],
) -> list[ScheduleOffering]:
    offerings: list[ScheduleOffering] = []
    for subject in subjects:
        material = offering_materials.get(subject.course.course_code)
        if material is None:
            continue
        offerings.extend(
            parse_schedule_offerings(material.payload.decode("utf-8", errors="ignore"), period_id)
        )
    return offerings


def _validate_catalog(repository: CatalogRepository) -> None:
    minimums = {
        "source_snapshots": 1,
        "promoted_releases": 1,
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
        if table_name != "promoted_releases" and repository.table_count(table_name) < minimum
    }
    if failed:
        raise ValidationError(f"catalog validation failed: {failed}")


def _material(
    source_id: str,
    source_kind: str,
    upstream_url: str,
    payload: bytes,
    observed_at: datetime,
    media_type: str,
    *,
    artifact_path: str | None = None,
    parse_status: Literal["parsed", "skipped", "failed", "unchanged"] = "parsed",
) -> LiveSourceMaterial:
    return LiveSourceMaterial(
        snapshot=SourceSnapshot(
            source_id=source_id,
            source_kind=source_kind,
            upstream_url=upstream_url,
            observed_at=observed_at,
            content_hash=stable_hash_bytes(payload),
            parse_status=parse_status,
            media_type=media_type,
            artifact_path=artifact_path,
        ),
        payload=payload,
    )


def _bundle_materials(bundle: LiveSourceBundle) -> list[LiveSourceMaterial]:
    materials = [
        bundle.services_page,
        bundle.calendars_page,
        bundle.school_calendar_document,
        bundle.payment_calendar_document,
        bundle.boletines_index,
        bundle.schedule_menu,
        *bundle.regulation_documents.values(),
        *[asset.document for asset in bundle.bulletin_documents],
        *bundle.schedule_period_pages.values(),
    ]
    for period_materials in bundle.schedule_offering_pages.values():
        materials.extend(period_materials.values())
    if bundle.manual_document is not None:
        materials.append(bundle.manual_document)
    return materials


def _source_fingerprints_from_bundle(bundle: LiveSourceBundle) -> dict[str, str]:
    return {
        material.snapshot.source_id: material.snapshot.content_hash
        for material in _bundle_materials(bundle)
    }


def _latest_promoted_release_fingerprints(
    latest_database_path: Path,
) -> tuple[str | None, dict[str, str] | None]:
    if not latest_database_path.exists():
        return None, None

    connection = sqlite3.connect(latest_database_path)
    connection.row_factory = sqlite3.Row
    try:
        release_row = connection.execute(
            """
            SELECT release_id, run_id
            FROM promoted_releases
            ORDER BY promoted_at DESC
            LIMIT 1
            """
        ).fetchone()
        if release_row is not None:
            run_id = release_row["run_id"]
            release_id = str(release_row["release_id"])
        else:
            run_row = connection.execute(
                """
                SELECT run_id
                FROM scrape_runs
                WHERE status = 'succeeded'
                ORDER BY completed_at DESC, started_at DESC
                LIMIT 1
                """
            ).fetchone()
            if run_row is None:
                return None, None
            run_id = run_row["run_id"]
            release_id = None

        rows = connection.execute(
            """
            SELECT source_id, content_hash
            FROM source_snapshots
            WHERE run_id = ?
            """,
            (run_id,),
        ).fetchall()
        return release_id, {str(row["source_id"]): str(row["content_hash"]) for row in rows}
    finally:
        connection.close()


def _changed_source_ids(
    previous_fingerprints: dict[str, str] | None, current_fingerprints: dict[str, str]
) -> list[str]:
    if previous_fingerprints is None:
        return sorted(current_fingerprints)
    source_ids = set(previous_fingerprints) | set(current_fingerprints)
    return sorted(
        source_id
        for source_id in source_ids
        if previous_fingerprints.get(source_id) != current_fingerprints.get(source_id)
    )


def _snapshot_id(snapshot: SourceSnapshot) -> str:
    return f"{snapshot.source_id}:{snapshot.content_hash[:16]}"


def _write_run_report(
    public_data_root: Path,
    *,
    run_id: str,
    status: str,
    message: str,
    changed_source_ids: list[str],
    compared_release_id: str | None,
    latest_root: Path,
) -> None:
    report_path = ensure_directory(public_data_root / "working") / "last-run-report.json"
    payload = {
        "run_id": run_id,
        "status": status,
        "message": message,
        "changed_source_ids": changed_source_ids,
        "compared_release_id": compared_release_id,
        "latest_root": str(latest_root),
        "reported_at": datetime.now(tz=UTC).isoformat(),
    }
    report_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _write_drift_report(
    public_data_root: Path,
    *,
    run_id: str,
    error_message: str,
    changed_source_ids: list[str],
    compared_release_id: str | None,
    current_fingerprints: dict[str, str],
) -> None:
    report_path = ensure_directory(public_data_root / "working") / "last-drift-report.json"
    payload = {
        "run_id": run_id,
        "status": "drift_detected",
        "error": error_message,
        "changed_source_ids": changed_source_ids,
        "compared_release_id": compared_release_id,
        "current_fingerprints": current_fingerprints,
        "reported_at": datetime.now(tz=UTC).isoformat(),
    }
    report_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


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
