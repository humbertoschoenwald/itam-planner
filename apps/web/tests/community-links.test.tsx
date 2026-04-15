import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommunityLinks } from "@/components/community-links";

describe("CommunityLinks", () => {
  it("renders the GitHub issues link and Instagram contact", () => {
    render(<CommunityLinks />);

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
