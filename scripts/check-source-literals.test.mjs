import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("check-source-literals ignores literal-host modules and tests", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "literal-host-check-"));

  try {
    writeFile(
      tempRoot,
      "apps/web/lib/copy.ts",
      'export const copy = { greeting: "Hola", timeout: 3000 };\n',
    );
    writeFile(tempRoot, "apps/web/tests/example.test.ts", 'const route = "/planner";\n');
    writeFile(tempRoot, "apps/web/lib/presenters/example.ts", "export const greeting = COPY;\n");
    writeWorkspacePackageJson(tempRoot);

    const result = runChecker(tempRoot);

    assert.equal(result.status, 0, result.stderr);
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("check-source-literals fails for imperative magic literals", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "literal-violation-check-"));

  try {
    writeFile(
      tempRoot,
      "apps/web/lib/presenters/example.ts",
      [
        'export function Example() {',
        '  return navigate("/planner");',
        "}",
        "",
      ].join("\n"),
    );
    writeWorkspacePackageJson(tempRoot);

    const result = runChecker(tempRoot);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /String literal "\/planner"/u);
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true });
  }
});

function runChecker(rootDirectory) {
  return spawnSync(
    process.execPath,
    [path.join(repositoryRoot, "scripts", "check-source-literals.mjs")],
    {
      cwd: rootDirectory,
      encoding: "utf8",
      env: {
        ...process.env,
        REPOSITORY_ROOT_OVERRIDE: rootDirectory,
      },
    },
  );
}

function writeWorkspacePackageJson(rootDirectory) {
  writeFile(
    rootDirectory,
    "apps/web/package.json",
    JSON.stringify({ name: "@itam-planner/web", private: true }, null, 2),
  );
}

function writeFile(rootDirectory, relativePath, contents) {
  const absolutePath = path.join(rootDirectory, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, contents, "utf8");
}
