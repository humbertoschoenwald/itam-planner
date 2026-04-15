from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings

settings = Settings()
app = FastAPI(title=settings.api_title)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/sources")
def sources() -> object:
    return _read_public_json("sources.json")


@app.get("/boletines")
def boletines() -> object:
    return _read_public_json("boletines/index.json")


@app.get("/boletines/{bulletin_id}")
def bulletin_document(bulletin_id: str) -> object:
    return _read_public_json(f"boletines/documents/{_safe_document_name(bulletin_id)}.json")


@app.get("/schedules/periods")
def schedule_periods() -> object:
    return _read_public_json("schedules/periods.json")


@app.get("/schedules/periods/{period_id}")
def schedule_period(period_id: str) -> object:
    return _read_public_json(f"schedules/periods/{period_id}.json")


def _read_public_json(relative_path: str) -> object:
    target = settings.public_data_root / "latest" / Path(relative_path)
    if not target.exists():
        raise HTTPException(status_code=404, detail=f"Public artifact not found: {relative_path}")
    return json.loads(target.read_text(encoding="utf-8"))


def _safe_document_name(value: str) -> str:
    return value.replace(":", "__")
