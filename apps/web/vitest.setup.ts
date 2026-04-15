import "@testing-library/jest-dom/vitest";

class MemoryStorage {
  private readonly data = new Map<string, string>();

  clear() {
    this.data.clear();
  }

  getItem(key: string) {
    return this.data.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.data.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.data.delete(key);
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
  }

  get length() {
    return this.data.size;
  }
}

const storage = new MemoryStorage();

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: storage,
});

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: storage,
});
