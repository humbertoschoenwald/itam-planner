import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { RegistrationPageShell } from "@/components/registration-page-shell";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("RegistrationPageShell", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("renders the official registration guide and traceable sources", () => {
    render(<RegistrationPageShell />);

    expect(
      screen.getByRole("heading", { name: /Guía oficial de inscripciones/u }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Servicios ITAM/u })).toHaveAttribute(
      "href",
      "https://servicios.itam.mx/",
    );
    expect(
      screen.getByRole("link", { name: /Destino oficial de inscripciones/u }),
    ).toHaveAttribute(
      "href",
      "https://alter.itam.mx:8443/StudentRegistrationSsb/ssb/registration?mepCode=EDSUP",
    );
  });
});
