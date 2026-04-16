"use client";

import { useEffect, useState } from "react";

const PHONE_BREAKPOINT_PX = 768;

function getIsPhoneViewport() {
  return typeof window !== "undefined" && window.innerWidth < PHONE_BREAKPOINT_PX;
}

export function usePhoneViewport() {
  const [isPhoneViewport, setIsPhoneViewport] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsPhoneViewport(getIsPhoneViewport());
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isPhoneViewport;
}
