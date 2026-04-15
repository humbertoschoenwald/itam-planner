import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IssueTemplateLinks } from "@/components/issue-template-links";

describe("IssueTemplateLinks", () => {
  it("renders the canonical GitHub issue-template shortcuts", () => {
    render(<IssueTemplateLinks />);

    expect(screen.getByRole("link", { name: /Bug report/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=bug_report.yml",
    );
    expect(screen.getByRole("link", { name: /Data correction/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=data_correction.yml",
    );
    expect(screen.getByRole("link", { name: /Source drift/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=source_drift.yml",
    );
    expect(screen.getByRole("link", { name: /Feature request/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues/new?template=feature_request.yml",
    );
  });
});
