import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const sourceRoot = resolve(repositoryRoot, "public-data", "latest");
const targetRoot = resolve(repositoryRoot, "apps", "web", "public", "catalog", "latest");

if (!existsSync(sourceRoot)) {
  throw new Error(`Public dataset not found at ${sourceRoot}. Run the catalog pipeline first.`);
}

rmSync(targetRoot, { force: true, recursive: true });
mkdirSync(resolve(repositoryRoot, "apps", "web", "public", "catalog"), { recursive: true });
cpSync(sourceRoot, targetRoot, { recursive: true });

console.log(`Synced published catalog from ${sourceRoot} to ${targetRoot}.`);
