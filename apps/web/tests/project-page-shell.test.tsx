import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ProjectPageShell } from "@/components/project-page-shell";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("ProjectPageShell", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("renders the project hero and the canonical support surfaces", () => {
    render(<ProjectPageShell />);

    expect(
      screen.getByRole("heading", {
        name: /Proyecto, incidencias y enlaces del creador/u,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Abrir una incidencia/u })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Canales del creador/u })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Por qué existe esto/u })).toBeInTheDocument();
  });
});
