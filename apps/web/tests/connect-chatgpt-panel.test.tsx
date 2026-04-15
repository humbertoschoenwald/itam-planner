import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ConnectChatGptPanel } from "@/components/connect-chatgpt-panel";
import { DEFAULT_PLANNER_STATE, usePlannerStore } from "@/stores/planner-store";
import { useStudentCodeStore } from "@/stores/student-code-store";
import {
  DEFAULT_STUDENT_PROFILE,
  useStudentProfileStore,
} from "@/stores/student-profile-store";

describe("ConnectChatGptPanel", () => {
  beforeEach(() => {
    useStudentProfileStore.setState({
      profile: {
        ...DEFAULT_STUDENT_PROFILE,
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
      },
    });
    usePlannerStore.setState({
      state: {
        ...DEFAULT_PLANNER_STATE,
        selectedOfferingIds: ["2938:ACT-11300:001"],
      },
    });
    useStudentCodeStore.setState({ code: "itp1.example-token" });
  });

  it("renders the current student code and the support guidance", () => {
    render(<ConnectChatGptPanel />);

    expect(screen.getByText(/itp1\.example-token/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub issues for bugs or support/i)).toBeInTheDocument();
    expect(screen.getByText(/This also works with other AIs/i)).toBeInTheDocument();
  });
});
