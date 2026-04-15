from __future__ import annotations

from pathlib import Path

import typer
import uvicorn

from .config import Settings
from .pipeline.builder import build_from_fixtures, build_from_live

app = typer.Typer(no_args_is_help=True)


@app.command("ingest-fixtures")
def ingest_fixtures(
    fixtures_root: Path = Path("tests/fixtures"),
    public_data_root: Path | None = None,
) -> None:
    """Build the normalized public dataset from local fixtures."""
    latest_path = build_from_fixtures(fixtures_root, public_data_root)
    typer.echo(f"Promoted fixture dataset to {latest_path}")


@app.command("ingest-live")
def ingest_live(public_data_root: Path | None = None) -> None:
    """Fetch live public sources, validate them, and promote a new snapshot."""
    latest_path = build_from_live(public_data_root)
    typer.echo(f"Promoted live dataset to {latest_path}")


@app.command("serve")
def serve(host: str = "127.0.0.1", port: int = 8000) -> None:
    """Run the read-only inspection API."""
    settings = Settings()
    typer.echo(f"Serving {settings.api_title} on http://{host}:{port}")
    uvicorn.run("itam_planner_api.app:app", host=host, port=port, reload=False)


if __name__ == "__main__":
    app()
