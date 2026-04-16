import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IssueTemplateLinks } from "@/components/issue-template-links";

describe("IssueTemplateLinks", () => {
  it("renders the canonical GitHub issue-template shortcuts", () => {
    render(<IssueTemplateLinks />);

    expect(screen.getByRole("link", { name: /Reporte de errores/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=bug_report.yml",
    );
    expect(screen.getByRole("link", { name: /Corrección de datos/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=data_correction.yml",
    );
    expect(screen.getByRole("link", { name: /Cambio en fuente oficial/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=source_drift.yml",
    );
    expect(screen.getByRole("link", { name: /Solicitud de mejora/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=feature_request.yml",
    );
  });
});
