from __future__ import annotations

from io import BytesIO

import pdfplumber
from pypdf import PdfReader


def extract_pdf_text(pdf_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(pdf_bytes))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def extract_pdf_words(pdf_bytes: bytes) -> list[dict[str, float | str]]:
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        words: list[dict[str, float | str]] = []
        for page in pdf.pages:
            words.extend(page.extract_words(x_tolerance=1, y_tolerance=1))
    return words
