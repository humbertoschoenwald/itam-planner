from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException

from .config import Settings

settings = Settings()
app = FastAPI(title=settings.api_title)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/sources")
def sources() -> object:
    return _read_public_json("sources.json")


@app.get("/schedules/periods")
def schedule_periods() -> object:
    return _read_public_json("schedules/periods.json")


def _read_public_json(relative_path: str) -> object:
    target = settings.public_data_root / "latest" / Path(relative_path)
    if not target.exists():
        raise HTTPException(status_code=404, detail=f"Public artifact not found: {relative_path}")
    return json.loads(target.read_text(encoding="utf-8"))
