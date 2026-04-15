from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="ITAM_PLANNER_", extra="ignore")

    api_title: str = "itam-planner public catalog api"
    public_data_root: Path = Path(__file__).resolve().parents[4] / "public-data"
