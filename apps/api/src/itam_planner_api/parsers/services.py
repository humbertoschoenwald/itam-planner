from __future__ import annotations

from urllib.parse import urljoin

from bs4 import BeautifulSoup

from ..common import normalize_whitespace
from ..models import ServiceRedirect


def parse_services_page(html: str, base_url: str) -> tuple[list[ServiceRedirect], str | None]:
    soup = BeautifulSoup(html, "lxml")
    redirects: list[ServiceRedirect] = []
    manual_url: str | None = None

    for anchor in soup.find_all("a", href=True):
        title_node = anchor.find(class_="card-title")
        title = normalize_whitespace(
            title_node.get_text(" ", strip=True)
            if title_node is not None
            else anchor.get_text(" ", strip=True)
        )
        if not title:
            continue
        card_content = anchor.find(class_="card-content")
        description = normalize_whitespace(
            card_content.get_text(" ", strip=True)
            if card_content is not None
            else anchor.get_text(" ", strip=True)
        )
        if description.startswith(title):
            description = normalize_whitespace(description[len(title) :])
        redirect = ServiceRedirect(
            label=title,
            url=urljoin(base_url, str(anchor.get("href", ""))),
            description=description,
            category="servicios-itam",
        )
        redirects.append(redirect)
        if title.lower() == "manual":
            manual_url = redirect.url

    return redirects, manual_url
