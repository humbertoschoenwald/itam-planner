"use client";

import type { PersistStorage, StorageValue } from "zustand/middleware";

const memoryFallback = new Map<string, string>();

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function safeRead(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore write failures. The memory fallback remains authoritative for this session.
  }
}

function safeRemove(storage: Storage, key: string) {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore remove failures to keep the public UI alive.
  }
}

export function clearSafeBrowserState(keys: readonly string[]) {
  const storage = getBrowserStorage();

  for (const key of keys) {
    memoryFallback.delete(key);

    if (storage !== null) {
      safeRemove(storage, key);
    }
  }
}

export function createSafeJsonStorage<T>(): PersistStorage<T> {
  return {
    getItem(name) {
      const storage = getBrowserStorage();
      const rawValue = storage !== null ? safeRead(storage, name) : null;
      const serialized = rawValue ?? memoryFallback.get(name) ?? null;

      if (serialized === null) {
        return null;
      }

      try {
        return JSON.parse(serialized) as StorageValue<T>;
      } catch {
        clearSafeBrowserState([name]);
        return null;
      }
    },
    removeItem(name) {
      clearSafeBrowserState([name]);
    },
    setItem(name, value) {
      const serialized = JSON.stringify(value);
      memoryFallback.set(name, serialized);

      const storage = getBrowserStorage();
      if (storage !== null) {
        safeWrite(storage, name, serialized);
      }
    },
  };
}
