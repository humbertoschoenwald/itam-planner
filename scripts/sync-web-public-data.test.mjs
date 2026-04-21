import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";

import {
  SQLITE_FILENAME,
  syncWebPublicData,
} from "./sync-web-public-data-lib.mjs";

const LOCK_RETRY_DELAY_MS = 5;
const LOCK_TIMEOUT_MS = 1_000;
const COPY_DELAY_MS = 30;

test("syncWebPublicData copies the published catalog and skips sqlite", async () => {
  const repositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "itam-planner-sync-"));
  const sourceRoot = path.join(repositoryRoot, "public-data", "latest");
  const targetRoot = path.join(repositoryRoot, "apps", "web", "public", "catalog", "latest");

  fs.mkdirSync(sourceRoot, { recursive: true });
  fs.writeFileSync(path.join(sourceRoot, "index.json"), "{\"ok\":true}\n", "utf8");
  fs.writeFileSync(path.join(sourceRoot, SQLITE_FILENAME), "sqlite", "utf8");

  await syncWebPublicData({
    lockRetryDelayMs: LOCK_RETRY_DELAY_MS,
    lockTimeoutMs: LOCK_TIMEOUT_MS,
    repositoryRoot,
  });

  assert.equal(fs.readFileSync(path.join(targetRoot, "index.json"), "utf8"), "{\"ok\":true}\n");
  assert.equal(fs.existsSync(path.join(targetRoot, SQLITE_FILENAME)), false);
});

test("syncWebPublicData serializes concurrent syncs through a directory lock", async () => {
  const repositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "itam-planner-sync-lock-"));
  const sourceRoot = path.join(repositoryRoot, "public-data", "latest");

  let concurrentCopies = 0;
  let maxConcurrentCopies = 0;

  fs.mkdirSync(sourceRoot, { recursive: true });
  fs.writeFileSync(path.join(sourceRoot, "index.json"), "{\"ok\":true}\n", "utf8");

  const copyOperation = async (catalogSourceRoot, catalogTargetRoot) => {
    concurrentCopies += 1;
    maxConcurrentCopies = Math.max(maxConcurrentCopies, concurrentCopies);

    try {
      await delay(COPY_DELAY_MS);
      fs.mkdirSync(catalogTargetRoot, { recursive: true });
      fs.copyFileSync(
        path.join(catalogSourceRoot, "index.json"),
        path.join(catalogTargetRoot, "index.json"),
      );
    } finally {
      concurrentCopies -= 1;
    }
  };

  await Promise.all([
    syncWebPublicData({
      copyOperation,
      lockRetryDelayMs: LOCK_RETRY_DELAY_MS,
      lockTimeoutMs: LOCK_TIMEOUT_MS,
      repositoryRoot,
    }),
    syncWebPublicData({
      copyOperation,
      lockRetryDelayMs: LOCK_RETRY_DELAY_MS,
      lockTimeoutMs: LOCK_TIMEOUT_MS,
      repositoryRoot,
    }),
  ]);

  assert.equal(maxConcurrentCopies, 1);
});
