import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { HomePageShell } from "@/components/home-page-shell";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("HomePageShell", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("renders the editorial home surface with planner entry points and official sources", () => {
    render(<HomePageShell />);

    expect(
      screen.getByRole("heading", {
        name: /Un horario académico privado construido sobre datos públicos oficiales del ITAM\./u,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", {
        name: /Fuentes trazables que conviene revisar seguido/u,
      }),
    ).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: /Abrir horario/u }).at(0)).toHaveAttribute(
      "href",
      "/planner",
    );
    expect(screen.getByRole("link", { name: "ITAM Escolar" })).toHaveAttribute(
      "href",
      "https://escolar.itam.mx/servicios_escolares/servicios_calendarios.php",
    );
  });
});
