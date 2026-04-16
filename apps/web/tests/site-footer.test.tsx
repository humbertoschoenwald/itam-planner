import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/site-footer";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("SiteFooter", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("renders the persistent legal footer links", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: /Términos y condiciones/u })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(screen.getByRole("link", { name: /Aviso de privacidad/u })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });
});
