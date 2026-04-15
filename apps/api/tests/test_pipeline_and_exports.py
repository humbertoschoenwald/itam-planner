from __future__ import annotations

import json
from dataclasses import replace

import pytest
from itam_planner_api.common import stable_hash_bytes
from itam_planner_api.pipeline import builder
from itam_planner_api.pipeline.builder import ValidationError, build_from_fixtures
from itam_planner_api.storage.repository import CatalogRepository


def test_build_from_fixtures_creates_sqlite_and_json_exports(fixtures_root, tmp_path) -> None:
    latest_root = build_from_fixtures(fixtures_root, tmp_path / "public-data")

    assert (latest_root / "catalog.sqlite").exists()
    assert (latest_root / "sources.json").exists()
    assert (latest_root / "boletines" / "index.json").exists()
    assert (latest_root / "boletines" / "documents" / "bulletin__ma-e.json").exists()
    assert (latest_root / "boletines" / "documents" / "bulletin__act-g.json").exists()
    assert (latest_root / "calendars" / "school.json").exists()
    assert (latest_root / "regulations" / "index.json").exists()
    assert (latest_root / "regulations" / "documents" / "regulation__post-2025.json").exists()
    assert (latest_root / "schedules" / "periods.json").exists()

    repository = CatalogRepository(latest_root / "catalog.sqlite")
    try:
        assert repository.table_count("promoted_releases") == 1
        assert repository.table_count("bulletin_documents") == 2
        assert repository.table_count("regulation_documents") == 2
        assert repository.table_count("schedule_offerings") == 3
        assert repository.table_count("courses") > 0
        assert (
            repository.connection.execute(
                "SELECT COUNT(*) AS count FROM courses WHERE course_code = 'ACT-11300'"
            ).fetchone()["count"]
            == 1
        )
        assert repository.search_regulation_sections("rectoria")
    finally:
        repository.close()

    school_calendar = json.loads(
        (latest_root / "calendars" / "school.json").read_text(encoding="utf-8")
    )
    assert any(event["event_date"] == "2026-01-01" for event in school_calendar["events"])

    sources_payload = json.loads((latest_root / "sources.json").read_text(encoding="utf-8"))
    assert sources_payload["promoted_releases"][0]["release_id"] == "fixtures"
    assert sources_payload["scrape_runs"][0]["started_at"] == "2026-04-15T11:36:00+00:00"


def test_fixture_build_is_deterministic(fixtures_root, tmp_path) -> None:
    public_data_root = tmp_path / "public-data"

    latest_root = build_from_fixtures(fixtures_root, public_data_root)
    first_sources = (latest_root / "sources.json").read_text(encoding="utf-8")
    first_database = (latest_root / "catalog.sqlite").read_bytes()

    latest_root = build_from_fixtures(fixtures_root, public_data_root)

    assert (latest_root / "sources.json").read_text(encoding="utf-8") == first_sources
    assert (latest_root / "catalog.sqlite").read_bytes() == first_database


def test_failed_fixture_build_does_not_overwrite_latest_snapshot(tmp_path) -> None:
    public_data_root = tmp_path / "public-data"
    latest_root = public_data_root / "latest"
    latest_root.mkdir(parents=True)
    sentinel = latest_root / "sentinel.txt"
    sentinel.write_text("keep-me", encoding="utf-8")

    broken_fixtures_root = tmp_path / "broken-fixtures"
    broken_fixtures_root.mkdir()

    with pytest.raises((FileNotFoundError, ValidationError)):
        build_from_fixtures(broken_fixtures_root, public_data_root)

    assert sentinel.read_text(encoding="utf-8") == "keep-me"


def test_live_build_stops_when_nothing_changed(fixtures_root, tmp_path, monkeypatch) -> None:
    public_data_root = tmp_path / "public-data"
    latest_root = build_from_fixtures(fixtures_root, public_data_root)
    original_sources = (latest_root / "sources.json").read_text(encoding="utf-8")

    monkeypatch.setattr(
        builder,
        "_collect_live_source_bundle",
        lambda client, raw_root: builder._build_fixture_live_bundle(fixtures_root),
    )

    result = builder.build_from_live(public_data_root)

    assert result == latest_root
    assert (latest_root / "sources.json").read_text(encoding="utf-8") == original_sources
    run_report = json.loads(
        (public_data_root / "working" / "last-run-report.json").read_text(encoding="utf-8")
    )
    assert run_report["status"] == "no_changes"
    assert run_report["changed_source_ids"] == []


def test_live_build_records_drift_and_preserves_latest(
    fixtures_root,
    tmp_path,
    monkeypatch,
) -> None:
    public_data_root = tmp_path / "public-data"
    latest_root = build_from_fixtures(fixtures_root, public_data_root)
    original_sources = (latest_root / "sources.json").read_text(encoding="utf-8")

    fixture_bundle = builder._build_fixture_live_bundle(fixtures_root)
    changed_payload = fixture_bundle.services_page.payload + b"\n<!-- changed -->\n"
    changed_services = builder.LiveSourceMaterial(
        snapshot=fixture_bundle.services_page.snapshot.model_copy(
            update={"content_hash": stable_hash_bytes(changed_payload)}
        ),
        payload=changed_payload,
    )
    changed_bundle = replace(fixture_bundle, services_page=changed_services)

    monkeypatch.setattr(
        builder,
        "_collect_live_source_bundle",
        lambda client, raw_root: changed_bundle,
    )
    monkeypatch.setattr(
        builder,
        "_validate_catalog",
        lambda repository: (_ for _ in ()).throw(ValidationError("Simulated drift")),
    )

    with pytest.raises(ValidationError, match="Simulated drift"):
        builder.build_from_live(public_data_root)

    assert (latest_root / "sources.json").read_text(encoding="utf-8") == original_sources
    drift_report = json.loads(
        (public_data_root / "working" / "last-drift-report.json").read_text(encoding="utf-8")
    )
    assert drift_report["status"] == "drift_detected"
    assert "services-home" in drift_report["changed_source_ids"]
