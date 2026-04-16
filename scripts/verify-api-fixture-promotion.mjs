import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const tempRoot = await mkdtemp(path.join(os.tmpdir(), "itam-planner-fixtures-"));
const publicDataRoot = path.join(tempRoot, "public-data");

try {
  const cliResult = spawnSync(
    "uv",
    [
      "run",
      "--project",
      "apps/api",
      "python",
      "-m",
      "itam_planner_api.cli",
      "ingest-fixtures",
      "--fixtures-root",
      "apps/api/tests/fixtures",
      "--public-data-root",
      publicDataRoot,
    ],
    {
      cwd: process.cwd(),
      shell: false,
      stdio: "inherit",
    },
  );

  if (cliResult.error) {
    throw cliResult.error;
  }

  if (cliResult.status !== 0) {
    process.exit(cliResult.status ?? 1);
  }

  const latestRoot = path.join(publicDataRoot, "latest");
  const [sourcesRaw, plansRaw, periodsRaw, schoolRaw, paymentRaw] = await Promise.all([
    readFile(path.join(latestRoot, "sources.json"), "utf8"),
    readFile(path.join(latestRoot, "boletines", "index.json"), "utf8"),
    readFile(path.join(latestRoot, "schedules", "periods.json"), "utf8"),
    readFile(path.join(latestRoot, "calendars", "school.json"), "utf8"),
    readFile(path.join(latestRoot, "calendars", "payment.json"), "utf8"),
  ]);

  const sources = JSON.parse(sourcesRaw);
  const plans = JSON.parse(plansRaw);
  const periods = JSON.parse(periodsRaw);
  const schoolCalendar = JSON.parse(schoolRaw);
  const paymentCalendar = JSON.parse(paymentRaw);

  if (!Array.isArray(plans) || plans.length === 0) {
    throw new Error("Fixture promotion produced no published bulletin index.");
  }

  if (!Array.isArray(periods) || periods.length === 0) {
    throw new Error("Fixture promotion produced no published schedule periods.");
  }

  if (
    !sources ||
    typeof sources !== "object" ||
    !Array.isArray(sources.source_snapshots) ||
    !Array.isArray(sources.promoted_releases)
  ) {
    throw new Error("Fixture promotion produced invalid source metadata.");
  }

  if (
    !schoolCalendar ||
    typeof schoolCalendar !== "object" ||
    !Array.isArray(schoolCalendar.events)
  ) {
    throw new Error("Fixture promotion produced invalid school calendar output.");
  }

  if (
    !paymentCalendar ||
    typeof paymentCalendar !== "object" ||
    !Array.isArray(paymentCalendar.payment_events)
  ) {
    throw new Error("Fixture promotion produced invalid payment calendar output.");
  }
} finally {
  await rm(tempRoot, { force: true, recursive: true });
}
