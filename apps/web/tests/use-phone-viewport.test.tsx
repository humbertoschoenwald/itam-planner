import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePhoneViewport } from "@/lib/use-phone-viewport";

describe("usePhoneViewport", () => {
  it("treats narrow viewports as phone layouts on first render", () => {
    setViewportWidth(390);

    render(<PhoneViewportHarness />);

    expect(screen.getByText("phone")).toBeInTheDocument();
  });

  it("updates when the viewport crosses the phone breakpoint", async () => {
    setViewportWidth(1024);

    render(<PhoneViewportHarness />);
    expect(screen.getByText("wide")).toBeInTheDocument();

    await act(async () => {
      setViewportWidth(390);
    });

    expect(screen.getByText("phone")).toBeInTheDocument();
  });

  it("keeps tablet-width Safari layouts out of phone mode", () => {
    setViewportWidth(834);

    render(<PhoneViewportHarness />);

    expect(screen.getByText("wide")).toBeInTheDocument();
  });
});

function PhoneViewportHarness(): React.JSX.Element {
  const isPhoneViewport = usePhoneViewport();

  return <p>{isPhoneViewport ? "phone" : "wide"}</p>;
}

function setViewportWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  });
  window.dispatchEvent(new Event("resize"));
}
