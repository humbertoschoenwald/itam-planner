import type { StorageValue } from "zustand/middleware";
import { describe, expect, it, vi } from "vitest";

import { clearSafeBrowserState, createSafeJsonStorage } from "@/lib/browser-storage";

describe("browser storage", () => {
  it("falls back to in-memory persistence when localStorage access throws", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get(): never {
        throw new Error("blocked");
      },
    });

    try {
      const storage = createSafeJsonStorage<{ value: string }>();
      const storedValue: StorageValue<{ value: string }> = {
        state: { value: "itam" },
        version: 1,
      };

      storage.setItem("itam", storedValue);
      expect(storage.getItem("itam")).toEqual(storedValue);

      storage.removeItem("itam");
      expect(storage.getItem("itam")).toBeNull();
    } catch (error) {
      throw error;
    } finally {
      clearSafeBrowserState(["itam"]);

      if (originalDescriptor) {
        Object.defineProperty(window, "localStorage", originalDescriptor);
      }
    }
  });

  it("falls back safely when localStorage access throws", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get(): never {
        throw new Error("blocked");
      },
    });

    try {
      const storage = createSafeJsonStorage<{ value: string }>();
      const storedValue: StorageValue<{ value: string }> = {
        state: { value: "itam" },
        version: 1,
      };

      expect(storage.getItem("itam")).toBeNull();
      expect(() => storage.setItem("itam", storedValue)).not.toThrow();
      expect(() => storage.removeItem("itam")).not.toThrow();
    } catch (error) {
      throw error;
    } finally {
      clearSafeBrowserState(["itam"]);

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
        getItem(): never {
          throw new Error("read blocked");
        },
        removeItem(): never {
          throw new Error("remove blocked");
        },
        setItem(): never {
          throw new Error("write blocked");
        },
      },
    });

    try {
      const storage = createSafeJsonStorage<{ value: string }>();
      const storedValue: StorageValue<{ value: string }> = {
        state: { value: "itam" },
        version: 1,
      };

      expect(storage.getItem("itam")).toBeNull();
      expect(() => storage.setItem("itam", storedValue)).not.toThrow();
      expect(storage.getItem("itam")).toEqual(storedValue);
      expect(() => storage.removeItem("itam")).not.toThrow();
    } catch (error) {
      throw error;
    } finally {
      clearSafeBrowserState(["itam"]);

      if (originalDescriptor) {
        Object.defineProperty(window, "localStorage", originalDescriptor);
      }
    }
  });

  it("drops malformed persisted JSON instead of crashing hydration", () => {
    const removeItem = vi.fn();
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem(): string {
          return "{broken";
        },
        removeItem,
        setItem(): undefined {
          return undefined;
        },
      },
    });

    try {
      const storage = createSafeJsonStorage<{ value: string }>();

      expect(storage.getItem("itam")).toBeNull();
      expect(removeItem).toHaveBeenCalledWith("itam");
    } catch (error) {
      throw error;
    } finally {
      clearSafeBrowserState(["itam"]);

      if (originalDescriptor) {
        Object.defineProperty(window, "localStorage", originalDescriptor);
      }
    }
  });
});
