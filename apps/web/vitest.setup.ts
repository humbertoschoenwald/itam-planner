import "@testing-library/jest-dom/vitest";

class MemoryStorage {
  private readonly data = new Map<string, string>();

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  get length(): number {
    return this.data.size;
  }
}

const storage = new MemoryStorage();

if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: storage,
  });

  type LegacyMediaQueryListener = ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null;

  function notifyMediaListener(
    listener: EventListenerOrEventListenerObject,
    event: MediaQueryListEvent,
  ): void {
    if (typeof listener === "function") {
      listener.call(window, event);
      return;
    }

    listener.handleEvent(event);
  }

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => {
      const listeners = new Set<EventListenerOrEventListenerObject>();
      const legacyListeners = new Set<Exclude<LegacyMediaQueryListener, null>>();
      const maxWidthMatch = /\(max-width:\s*(\d+)px\)/u.exec(query);
      const minWidthMatch = /\(min-width:\s*(\d+)px\)/u.exec(query);
      const maxWidth = maxWidthMatch ? Number(maxWidthMatch[1]) : null;
      const minWidth = minWidthMatch ? Number(minWidthMatch[1]) : null;
      const matches =
        (maxWidth === null || window.innerWidth <= maxWidth) &&
        (minWidth === null || window.innerWidth >= minWidth);

      return {
        addEventListener: (
          _eventName: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          listeners.add(listener);
        },
        addListener: (listener: LegacyMediaQueryListener) => {
          if (listener !== null) {
            legacyListeners.add(listener);
          }
        },
        dispatchEvent: (event: MediaQueryListEvent) => {
          listeners.forEach((listener) => notifyMediaListener(listener, event));
          legacyListeners.forEach((listener) => listener.call(window.matchMedia(query), event));
          return true;
        },
        matches,
        media: query,
        onchange: null,
        removeEventListener: (
          _eventName: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          listeners.delete(listener);
        },
        removeListener: (listener: LegacyMediaQueryListener) => {
          if (listener !== null) {
            legacyListeners.delete(listener);
          }
        },
      } satisfies MediaQueryList;
    },
  });
}

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: storage,
});
