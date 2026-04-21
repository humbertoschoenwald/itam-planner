import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

export const DEFAULT_LOCK_RETRY_DELAY_MS = 50;
export const DEFAULT_LOCK_TIMEOUT_MS = 10_000;
export const LOCK_NAME = "sync-web-public-data.lock";
export const SQLITE_FILENAME = "catalog.sqlite";

export async function syncWebPublicData({
  copyOperation = copyPublishedCatalog,
  lockRetryDelayMs = DEFAULT_LOCK_RETRY_DELAY_MS,
  lockTimeoutMs = DEFAULT_LOCK_TIMEOUT_MS,
  repositoryRoot,
  sourceRoot = resolve(repositoryRoot, "public-data", "latest"),
  targetRoot = resolve(repositoryRoot, "apps", "web", "public", "catalog", "latest"),
} = {}) {
  if (!repositoryRoot) {
    throw new Error("repositoryRoot is required.");
  }

  if (!existsSync(sourceRoot)) {
    throw new Error(`Public dataset not found at ${sourceRoot}. Run the catalog pipeline first.`);
  }

  const lockRoot = resolve(repositoryRoot, ".tmp", LOCK_NAME);

  await withDirectoryLock({
    lockRetryDelayMs,
    lockRoot,
    lockTimeoutMs,
    operation: async () => {
      rmSync(targetRoot, { force: true, recursive: true });
      mkdirSync(dirname(targetRoot), { recursive: true });
      await copyOperation(sourceRoot, targetRoot);
    },
  });

  return { sourceRoot, targetRoot };
}

export async function withDirectoryLock({
  lockRetryDelayMs,
  lockRoot,
  lockTimeoutMs,
  operation,
}) {
  const deadline = Date.now() + lockTimeoutMs;

  await mkdir(dirname(lockRoot), { recursive: true });

  while (true) {
    try {
      await mkdir(lockRoot);
      break;
    } catch (error) {
      if (error?.code !== "EEXIST") {
        throw error;
      }

      if (Date.now() >= deadline) {
        throw new Error(`Timed out waiting for sync lock at ${lockRoot}.`);
      }

      await delay(lockRetryDelayMs);
    }
  }

  try {
    await operation();
  } finally {
    await rm(lockRoot, { force: true, recursive: true });
  }
}

export async function copyPublishedCatalog(sourceRoot, targetRoot) {
  cpSync(sourceRoot, targetRoot, {
    filter: (sourcePath) => !sourcePath.endsWith(SQLITE_FILENAME),
    recursive: true,
  });
}
