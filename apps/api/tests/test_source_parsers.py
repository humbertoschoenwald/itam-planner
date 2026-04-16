from __future__ import annotations

from itam_planner_api.parsers.boletines import parse_boletines_index
from itam_planner_api.parsers.calendars import parse_calendars_page
from itam_planner_api.parsers.services import parse_services_page


def test_parse_services_page_extracts_manual_and_public_redirects(fixtures_root) -> None:
    html = (fixtures_root / "html" / "servicios_itam.html").read_text(encoding="utf-8")
    redirects, manual_url = parse_services_page(html, "https://servicios.itam.mx/")

    labels = {redirect.label for redirect in redirects}
    assert "Servicios no personalizados" in labels
    assert "Manual" in labels
    assert (
        manual_url
        == "https://servicios.itam.mx/template/image/Manual%20Restablecer%20Contrasenia%20Correo.pdf"
    )


def test_parse_calendars_page_extracts_expected_documents(fixtures_root) -> None:
    html = (fixtures_root / "html" / "servicios_calendarios.html").read_text(encoding="utf-8")
    links = parse_calendars_page(
        html,
        "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php",
    )

    assert links["school_calendar"].endswith("calesc2026.pdf")
    assert links["payment_calendar"].endswith("Lic-2026 Pagos.pdf")
    assert links["regulation_pre_2025"].endswith("reg_lic.pdf")
    assert links["regulation_post_2025"].endswith("reg_licenciatura.pdf")


def test_parse_boletines_index_extracts_cache_time_and_pdf_links(fixtures_root) -> None:
    html = (fixtures_root / "html" / "boletines_index.html").read_text(encoding="utf-8")
    observed_at, links = parse_boletines_index(html, "https://example.com/boletines/")

    assert observed_at is not None
    assert len(links) > 100
    assert links[0].code == "AAC-D"
    assert any(link.code == "MA-E" for link in links)
