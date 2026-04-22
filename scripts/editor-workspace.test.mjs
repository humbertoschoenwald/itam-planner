import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED_WORKSPACE_EXTENSIONS = [
  "bradlc.vscode-tailwindcss",
  "dbaeumer.vscode-eslint",
  "editorconfig.editorconfig",
  "esbenp.prettier-vscode",
  "ms-edgedevtools.vscode-edge-devtools",
  "ms-playwright.playwright",
];

test("workspace recommends browser-preview and responsive-testing extensions", async () => {
  const extensions = await readJson(".vscode/extensions.json");

  assert.ok(Array.isArray(extensions.recommendations));

  for (const extensionId of REQUIRED_WORKSPACE_EXTENSIONS) {
    assert.ok(
      extensions.recommendations.includes(extensionId),
      `Missing recommended extension ${extensionId}.`,
    );
  }
});

test("workspace launch configuration exposes Chrome and Edge browser previews", async () => {
  const launch = await readJson(".vscode/launch.json");
  const configurationNames = launch.configurations.map((configuration) => configuration.name);

  assert.ok(configurationNames.includes("Web: Chrome"));
  assert.ok(configurationNames.includes("Web: Edge DevTools"));
});

test("workspace tasks expose live preview, responsive smoke, and local CI entrypoints", async () => {
  const tasks = await readJson(".vscode/tasks.json");
  const taskLabels = tasks.tasks.map((task) => task.label);

  assert.ok(taskLabels.includes("Web: Dev Server"));
  assert.ok(taskLabels.includes("Web: Responsive Smoke"));
  assert.ok(taskLabels.includes("Web: Responsive Smoke (Headed)"));
  assert.ok(taskLabels.includes("Web: Responsive Smoke UI"));
  assert.ok(taskLabels.includes("Repository: Local CI"));
});

async function readJson(relativePath) {
  const raw = await fs.readFile(path.join(repositoryRoot, relativePath), "utf8");
  return JSON.parse(raw);
}
