"use client";

import { useCallback, useLayoutEffect, useState, type RefCallback } from "react";

type UseElementWidthResult<TElement extends Element> = {
  ref: RefCallback<TElement>;
  width: number;
};

export function useElementWidth<TElement extends Element>(): UseElementWidthResult<TElement> {
  const [element, setElement] = useState<TElement | null>(null);
  const [width, setWidth] = useState(0);

  const ref = useCallback<RefCallback<TElement>>((node) => {
    setElement(node);
    if (node === null) {
      setWidth(0);
    }
  }, []);

  useLayoutEffect(() => {
    if (element === null) {
      return undefined;
    }

    const currentElement = element;

    function syncWidth(): void {
      setWidth(Math.round(currentElement.getBoundingClientRect().width));
    }

    syncWidth();

    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      syncWidth();
    });
    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return {
    ref,
    width,
  };
}
