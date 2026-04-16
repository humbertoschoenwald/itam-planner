import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { StudentCodeCard } from "@/components/student-code-card";
import { useStudentCodeStore } from "@/stores/student-code-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("StudentCodeCard", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
    useStudentCodeStore.setState({ code: "itp1.mocked-code" });
  });

  it("links to the canonical Connect to AI route", () => {
    render(<StudentCodeCard />);

    expect(
      screen.getByRole("link", { name: "Abrir la página Conectar con IA" }),
    ).toHaveAttribute("href", "/connect-ai");
  });
});
