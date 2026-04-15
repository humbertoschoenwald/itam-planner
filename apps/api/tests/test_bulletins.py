from __future__ import annotations

from itam_planner_api.parsers.boletines import parse_bulletin_pdf


def test_parse_bulletin_pdf_extracts_metadata_and_rows(fixtures_root) -> None:
    bulletin = parse_bulletin_pdf(
        (fixtures_root / "pdfs" / "bulletin_sample_ma_e.pdf").read_bytes(), "MA-E"
    )

    assert bulletin.program.title == "LICENCIATURA EN MATEMATICAS APLICADAS"
    assert bulletin.plan.plan_code == "E"
    assert bulletin.entry_from_term == "PRIMAVERA 2021"
    assert bulletin.entry_to_term == "PRIMAVERA 2024"
    assert bulletin.application_year == 2026
    assert len(bulletin.requirements) >= 40


def test_parse_bulletin_pdf_preserves_split_prerequisites(fixtures_root) -> None:
    bulletin = parse_bulletin_pdf(
        (fixtures_root / "pdfs" / "bulletin_sample_ma_e.pdf").read_bytes(), "MA-E"
    )
    requirements = {
        requirement.course.course_code: requirement
        for requirement in bulletin.requirements
        if requirement.course is not None
    }

    ideas_three = requirements["EGN-17123"]
    assert ideas_three.raw_prerequisite_text == "EGN-17122, EGN-17141 y LEN-12701"
    assert [
        reference.referenced_course_code for reference in ideas_three.prerequisite_references
    ] == [
        "EGN-17122",
        "EGN-17141",
        "LEN-12701",
    ]

    math_comp = requirements["MAT-14390"]
    assert math_comp.raw_prerequisite_text == "MAT-14201, COM-11302 y MAT-14101"


def test_parse_second_bulletin_exposes_schedule_course_overlap(fixtures_root) -> None:
    bulletin = parse_bulletin_pdf(
        (fixtures_root / "pdfs" / "bulletin_sample_act_g.pdf").read_bytes(), "ACT-G"
    )
    requirement_codes = {
        requirement.course.course_code
        for requirement in bulletin.requirements
        if requirement.course is not None
    }

    assert "ACT-11300" in requirement_codes
