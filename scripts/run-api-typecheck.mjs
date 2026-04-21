import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const result = spawnSync(
  "uv",
  ["run", "--project", "apps/api", "--group", "dev", "basedpyright", "apps/api/src"],
  {
    cwd: repositoryRoot,
    shell: false,
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
