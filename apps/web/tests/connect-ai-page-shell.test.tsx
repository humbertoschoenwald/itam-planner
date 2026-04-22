import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ConnectAiPageShell } from "@/components/connect-ai-page-shell";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("ConnectAiPageShell", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("renders the localized hero and the current AI bridge panels", () => {
    render(<ConnectAiPageShell />);

    expect(
      screen.getByRole("heading", {
        name: /Prepara tu horario local para usarlo con IA externa/u,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Contrato diferido/u).length).toBeGreaterThan(0);
    expect(screen.getByText(/Contexto actual del horario/u)).toBeInTheDocument();
  });
});
