from __future__ import annotations

import itam_planner_api.app as api_app_module
from fastapi.testclient import TestClient
from itam_planner_api.pipeline.builder import build_from_fixtures


def test_read_only_api_serves_boletines_and_schedule_details(fixtures_root, tmp_path) -> None:
    public_data_root = tmp_path / "public-data"
    build_from_fixtures(fixtures_root, public_data_root)
    api_app_module.settings.public_data_root = public_data_root

    client = TestClient(api_app_module.app)

    boletines_response = client.get("/boletines")
    assert boletines_response.status_code == 200
    assert any(item["plan_id"].endswith(":e") for item in boletines_response.json())

    period_response = client.get("/schedules/periods/2938")
    assert period_response.status_code == 200
    assert period_response.json()["period_id"] == "2938"
    assert period_response.json()["offerings"]
