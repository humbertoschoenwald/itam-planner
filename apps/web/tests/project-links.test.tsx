import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectLinks } from "@/components/project-links";

describe("ProjectLinks", () => {
  it("renders the GitHub issues link and Instagram contact", () => {
    render(<ProjectLinks />);

    expect(screen.getByRole("link", { name: /GitHub Issues/i })).toHaveAttribute(
      "href",
      "https://github.com/humbertoschoenwald/itam-planner/issues",
    );
    expect(screen.getByRole("link", { name: /Instagram/i })).toHaveAttribute(
      "href",
      "https://www.instagram.com/humbertoschoenwald/",
    );
  });
});
