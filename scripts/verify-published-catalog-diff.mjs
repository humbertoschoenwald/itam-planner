import { spawnSync } from "node:child_process";

const diff = spawnSync("git", ["diff", "--name-only", "--", "public-data/latest"], {
  encoding: "utf-8",
});

if (diff.status !== 0) {
  process.stderr.write(diff.stderr || "Unable to inspect the published catalog diff.\n");
  process.exit(diff.status ?? 1);
}

const changedPaths = diff.stdout
  .split(/\r?\n/u)
  .map((entry) => entry.trim())
  .filter(Boolean);

const blockingPaths = changedPaths.filter((path) => path !== "public-data/latest/catalog.sqlite");

if (blockingPaths.length === 0) {
  process.exit(0);
}

process.stderr.write(
  [
    "Published catalog drift detected outside the SQLite binary artifact:",
    ...blockingPaths.map((path) => `- ${path}`),
  ].join("\n") + "\n",
);
process.exit(1);
