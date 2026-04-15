import { createJSONStorage, type StateStorage } from "zustand/middleware";

function createNoopStorage(): StateStorage {
  return {
    getItem: () => null,
    removeItem: () => undefined,
    setItem: () => undefined,
  };
}

export function createSafeStateStorage(): StateStorage {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  try {
    const storage = window.localStorage;

    return {
      getItem: (name) => {
        try {
          return storage.getItem(name);
        } catch {
          return null;
        }
      },
      removeItem: (name) => {
        try {
          storage.removeItem(name);
        } catch {
          // Ignore browser storage failures and keep the UI alive.
        }
      },
      setItem: (name, value) => {
        try {
          storage.setItem(name, value);
        } catch {
          // Ignore browser storage failures and keep the UI alive.
        }
      },
    };
  } catch {
    return createNoopStorage();
  }
}

export function createSafeJsonStorage<T>() {
  return createJSONStorage<T>(createSafeStateStorage);
}
