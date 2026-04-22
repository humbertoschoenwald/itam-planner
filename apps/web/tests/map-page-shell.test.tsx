import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { MapPageShell } from "@/components/map-page-shell";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("MapPageShell", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({ profile: DEFAULT_STUDENT_PROFILE });
  });

  it("keeps the map route visible while the detailed map is still deferred", () => {
    render(<MapPageShell />);

    expect(screen.getByRole("heading", { name: /Mapa/u })).toBeInTheDocument();
    expect(screen.getAllByText(/En construcción/u).length).toBeGreaterThan(0);
  });
});
