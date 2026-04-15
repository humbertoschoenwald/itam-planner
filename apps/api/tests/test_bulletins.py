from __future__ import annotations

import itam_planner_api.parsers.boletines as boletines_parser
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


def test_parse_joint_bulletin_metadata_and_extended_semesters(monkeypatch) -> None:
    sample_text = """
    Prerrequisito Clave Materia Créditos
    PRIMER SEMESTRE
    ADM-12107 Estrategia de Negocios I 6
    QUINTO SEMESTRE
    EST-14101 y MAT-14102 EST-14102 Cálculo de Probabilidades II 6
    PLAN CONJUNTO PARA LAS
    LICENCIATURAS EN ADMINISTRACIÓN Y ACTUARÍA
    PLAN D
    PARA ALUMNOS QUE INGRESARON DE VERANO 2015 A PRIMAVERA 2019
    PRIMAVERA 2026
    Prerrequisito Clave Materia Créditos
    SEXTO SEMESTRE
    MAT-22600, ACT-15357 y EST-14101 ACT-11300 Cálculo Actuarial I 6
    NOVENO SEMESTRE
    ACT-11301 ACT-11303 Modelos Actuariales 6
    DÉCIMO SEMESTRE
    ECO-11103 y ACT-22306 ADM-15582 Finanzas Corporativas Avanzadas 6
    (A) Estas materias tendrán adicionalmente un seminario de escritura.
    """.strip()

    monkeypatch.setattr(boletines_parser, "extract_pdf_text", lambda _: sample_text)

    bulletin = parse_bulletin_pdf(b"%PDF-joint-plan-sample", "AAC-D")
    requirements = {
        requirement.course.course_code: requirement
        for requirement in bulletin.requirements
        if requirement.course is not None
    }

    assert bulletin.program.title == "LICENCIATURAS EN ADMINISTRACIÓN Y ACTUARÍA"
    assert bulletin.plan.plan_code == "D"
    assert bulletin.entry_from_term == "VERANO 2015"
    assert bulletin.entry_to_term == "PRIMAVERA 2019"
    assert bulletin.application_year == 2026
    assert requirements["ACT-11300"].semester_order == 6
    assert requirements["ACT-11303"].semester_order == 9
    assert requirements["ADM-15582"].semester_order == 10


def test_parse_joint_bulletin_with_split_title_lines(monkeypatch) -> None:
    sample_text = """
    PRIMER SEMESTRE
    MAT-11100 Matemáticas I 9
    PLAN CONJUNTO DE LAS LICENCIATURAS EN
    MATEMÁTICAS APLICADAS Y ACTUARÍA
    PLAN B
    PARA ALUMNOS QUE INGRESARON DE VERANO 2015 A PRIMAVERA 2019
    PRIMAVERA 2026
    SEGUNDO SEMESTRE
    MAT-11100 MAT-11101 Matemáticas II 9
    (A) Nota al plan.
    """.strip()

    monkeypatch.setattr(boletines_parser, "extract_pdf_text", lambda _: sample_text)

    bulletin = parse_bulletin_pdf(b"%PDF-split-joint-plan", "ACM-B")

    assert bulletin.program.title == "LICENCIATURAS EN MATEMÁTICAS APLICADAS Y ACTUARÍA"
    assert bulletin.plan.plan_code == "B"
    assert bulletin.entry_from_term == "VERANO 2015"
    assert bulletin.entry_to_term == "PRIMAVERA 2019"
    assert len(bulletin.requirements) == 2
