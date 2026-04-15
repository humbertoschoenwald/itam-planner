import { describe, expect, it } from "vitest";

import { createSafeStateStorage } from "@/lib/browser-storage";

describe("browser storage", () => {
  it("falls back safely when localStorage access throws", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });

    try {
      const storage = createSafeStateStorage();

      expect(storage.getItem("itam")).toBeNull();
      expect(() => storage.setItem("itam", "value")).not.toThrow();
      expect(() => storage.removeItem("itam")).not.toThrow();
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(window, "localStorage", originalDescriptor);
      }
    }
  });

  it("swallows storage method errors to keep the UI alive", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem() {
          throw new Error("read blocked");
        },
        removeItem() {
          throw new Error("remove blocked");
        },
        setItem() {
          throw new Error("write blocked");
        },
      },
    });

    try {
      const storage = createSafeStateStorage();

      expect(storage.getItem("itam")).toBeNull();
      expect(() => storage.setItem("itam", "value")).not.toThrow();
      expect(() => storage.removeItem("itam")).not.toThrow();
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(window, "localStorage", originalDescriptor);
      }
    }
  });
});
