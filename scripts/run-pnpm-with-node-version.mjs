import { spawnSync } from "node:child_process";

const [nodeMajor, ...pnpmArgs] = process.argv.slice(2);

if (!nodeMajor || pnpmArgs.length === 0) {
  process.stderr.write(
    "Usage: node scripts/run-pnpm-with-node-version.mjs <node-major> <pnpm args...>\n",
  );
  process.exit(1);
}

const result =
  process.platform === "win32"
    ? spawnSync(
        "cmd.exe",
        [
          "/d",
          "/s",
          "/c",
          "npx",
          "-y",
          "-p",
          `node@${nodeMajor}`,
          "-p",
          "pnpm@10.33.0",
          "pnpm",
          ...pnpmArgs,
        ],
        {
          cwd: process.cwd(),
          shell: false,
          stdio: "inherit",
        },
      )
    : spawnSync(
        "npx",
        ["-y", "-p", `node@${nodeMajor}`, "-p", "pnpm@10.33.0", "pnpm", ...pnpmArgs],
        {
          cwd: process.cwd(),
          shell: false,
          stdio: "inherit",
        },
      );

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
