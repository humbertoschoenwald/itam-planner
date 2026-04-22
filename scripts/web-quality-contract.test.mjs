import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("web typecheck primes Next route types before invoking tsc", async () => {
  const webPackage = await readJson("apps/web/package.json");

  assert.equal(
    webPackage.scripts.pretypecheck,
    "node ../../scripts/sync-web-public-data.mjs && next typegen",
  );
  assert.equal(webPackage.scripts.typecheck, "tsc --project tsconfig.json --noEmit");
});

test("web CI runs build after the lighter validation tasks", async () => {
  const rootPackage = await readJson("package.json");

  assert.equal(
    rootPackage.scripts["ci:web"],
    "turbo run lint test:coverage typecheck --filter=@itam-planner/web",
  );
  assert.equal(
    rootPackage.scripts["ci:web:full"],
    "turbo run lint test:coverage typecheck --filter=@itam-planner/web && turbo run build --filter=@itam-planner/web",
  );
});

async function readJson(relativePath) {
  const raw = await fs.readFile(path.join(repositoryRoot, relativePath), "utf8");
  return JSON.parse(raw);
}
