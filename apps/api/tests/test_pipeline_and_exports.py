from __future__ import annotations

import json

import pytest
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
