import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { syncWebPublicData } from "./sync-web-public-data-lib.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");

const { sourceRoot, targetRoot } = await syncWebPublicData({ repositoryRoot });

console.log(`Synced published catalog from ${sourceRoot} to ${targetRoot}.`);
