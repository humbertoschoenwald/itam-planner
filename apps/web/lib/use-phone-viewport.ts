"use client";

import { useLayoutEffect, useState } from "react";

const PHONE_BREAKPOINT_PX = 768;
const HYDRATION_VIEWPORT_SYNC_DELAYS_MS = [250, 1000, 2000] as const;

export function getViewportWidth(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const documentViewportWidth =
    typeof document !== "undefined" ? document.documentElement.clientWidth : 0;

  return Math.max(window.innerWidth, window.visualViewport?.width ?? 0, documentViewportWidth);
}

function subscribeToViewportActivity(onStoreChange: () => void): () => void {
  const animationFrameId = window.requestAnimationFrame(onStoreChange);
  const timeoutIds = HYDRATION_VIEWPORT_SYNC_DELAYS_MS.map((delayMs) =>
    window.setTimeout(onStoreChange, delayMs),
  );

  window.addEventListener("resize", onStoreChange);
  window.visualViewport?.addEventListener("resize", onStoreChange);
  window.visualViewport?.addEventListener("scroll", onStoreChange);

  return () => {
    window.cancelAnimationFrame(animationFrameId);
    timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    window.removeEventListener("resize", onStoreChange);
    window.visualViewport?.removeEventListener("resize", onStoreChange);
    window.visualViewport?.removeEventListener("scroll", onStoreChange);
  };
}

export function useViewportBelow(maxWidthPx: number): boolean {
  const viewportWidth = useViewportWidth();

  return viewportWidth > 0 && viewportWidth < maxWidthPx;
}

export function useViewportWidth(): number {
  const [viewportWidth, setViewportWidth] = useState(0);

  useLayoutEffect(() => {
    function syncViewport(): void {
      setViewportWidth(getViewportWidth());
    }

    syncViewport();

    return subscribeToViewportActivity(syncViewport);
  }, []);

  return viewportWidth;
}

export function usePhoneViewport(): boolean {
  return useViewportBelow(PHONE_BREAKPOINT_PX);
}
