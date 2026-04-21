import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const mergeCoverageScriptPath = path.resolve("scripts/merge-coverage.mjs");

test("merge-coverage writes a merged root coverage.xml file", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "itam-planner-coverage-"));
  const apiCoveragePath = path.join(tempRoot, "coverage", "api");
  const webCoveragePath = path.join(tempRoot, "coverage", "web");

  fs.mkdirSync(apiCoveragePath, { recursive: true });
  fs.mkdirSync(webCoveragePath, { recursive: true });

  fs.writeFileSync(
    path.join(apiCoveragePath, "coverage.xml"),
    buildCoverageXml({
      branchesCovered: 0,
      branchesValid: 0,
      className: "api-module",
      filename: "apps/api/src/example.py",
      linesCovered: 2,
      linesValid: 3,
      packageName: "api",
    }),
    "utf8",
  );
  fs.writeFileSync(
    path.join(webCoveragePath, "cobertura-coverage.xml"),
    buildCoverageXml({
      branchesCovered: 0,
      branchesValid: 0,
      className: "web-module",
      filename: "apps/web/lib/example.ts",
      linesCovered: 3,
      linesValid: 4,
      packageName: "web",
    }),
    "utf8",
  );

  const result = spawnSync(process.execPath, [mergeCoverageScriptPath], {
    cwd: tempRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);

  const mergedReport = fs.readFileSync(path.join(tempRoot, "coverage.xml"), "utf8");

  assert.match(mergedReport, /lines-covered="5"/u);
  assert.match(mergedReport, /lines-valid="7"/u);
  assert.match(mergedReport, /apps\/api\/src\/example\.py/u);
  assert.match(mergedReport, /apps\/web\/lib\/example\.ts/u);
});

function buildCoverageXml({
  branchesCovered,
  branchesValid,
  className,
  filename,
  linesCovered,
  linesValid,
  packageName,
}) {
  const lineRate = linesValid === 0 ? "0" : String(linesCovered / linesValid);

  return [
    '<?xml version="1.0" ?>',
    "<coverage line-rate=\"" +
      lineRate +
      "\" branch-rate=\"0\" lines-covered=\"" +
      linesCovered +
      "\" lines-valid=\"" +
      linesValid +
      "\" branches-covered=\"" +
      branchesCovered +
      "\" branches-valid=\"" +
      branchesValid +
      "\" complexity=\"0\" version=\"test\" timestamp=\"0\">",
    "<sources>",
    "<source>.</source>",
    "</sources>",
    "<packages>",
    "<package name=\"" + packageName + "\" line-rate=\"" + lineRate + "\" branch-rate=\"0\" complexity=\"0\">",
    "<classes>",
    "<class name=\"" + className + "\" filename=\"" + filename + "\" line-rate=\"" + lineRate + "\" branch-rate=\"0\" complexity=\"0\">",
    "<methods />",
    "<lines>",
    "<line number=\"1\" hits=\"1\" />",
    "</lines>",
    "</class>",
    "</classes>",
    "</package>",
    "</packages>",
    "</coverage>",
  ].join("\n");
}
