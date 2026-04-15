#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TYPE_TITLES = {
  build: "Build",
  chore: "Chores",
  ci: "Continuous Integration",
  docs: "Documentation",
  feat: "Features",
  fix: "Fixes",
  other: "Other",
  perf: "Performance",
  refactor: "Refactors",
  revert: "Reverts",
  style: "Style",
  test: "Tests",
};

const TITLE_TO_TYPE = Object.fromEntries(
  Object.entries(TYPE_TITLES).map(([type, title]) => [title, type]),
);

const TYPE_ORDER = [
  "feat",
  "fix",
  "docs",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
  "style",
  "revert",
  "other",
];

export function parseArguments(argv) {
  const options = {
    date: null,
    mode: "full",
    output: "CHANGELOG.md",
    since: null,
    timezone: "America/Mexico_City",
    until: "HEAD",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--mode" && next) {
      options.mode = next;
      index += 1;
      continue;
    }

    if (current === "--since" && next) {
      options.since = next;
      index += 1;
      continue;
    }

    if (current === "--until" && next) {
      options.until = next;
      index += 1;
      continue;
    }

    if (current === "--date" && next) {
      options.date = next;
      index += 1;
      continue;
    }

    if (current === "--output" && next) {
      options.output = next;
      index += 1;
      continue;
    }

    if (current === "--timezone" && next) {
      options.timezone = next;
      index += 1;
    }
  }

  return options;
}

export function parseConventionalCommit(message) {
  const match =
    /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?: (?<description>.+)$/u.exec(message);

  if (!match?.groups) {
    return {
      description: message,
      rawMessage: message,
      scope: null,
      type: "other",
    };
  }

  return {
    description: match.groups.description,
    rawMessage: message,
    scope: match.groups.scope ?? null,
    type: TYPE_TITLES[match.groups.type] ? match.groups.type : "other",
  };
}

export function parseGitLog(rawLog, timezone, overrideDate = null) {
  if (!rawLog.trim()) {
    return [];
  }

  return rawLog
    .trim()
    .split("\n")
    .map((line) => {
      const [hash, authoredAt, subject] = line.split("\t");
      const parsed = parseConventionalCommit(subject);
      return {
        ...parsed,
        date: overrideDate ?? formatMexicoDate(authoredAt, timezone),
        hash,
        shortHash: hash.slice(0, 7),
      };
    })
    .filter((commit) => !(commit.type === "chore" && commit.scope === "changelog"));
}

export function createEmptySections() {
  return new Map();
}

export function addCommitsToSections(sections, commits) {
  for (const commit of commits) {
    const dateSection = sections.get(commit.date) ?? new Map();
    const entries = dateSection.get(commit.type) ?? [];

    if (
      !entries.some(
        (entry) => entry.hash === commit.hash || entry.shortHash === commit.shortHash,
      )
    ) {
      entries.push({
        hash: commit.hash,
        shortHash: commit.shortHash,
        text: buildEntryText(commit),
      });
    }

    dateSection.set(commit.type, entries);
    sections.set(commit.date, dateSection);
  }

  return sections;
}

export function parseExistingChangelog(content) {
  const sections = createEmptySections();
  let currentDate = null;
  let currentType = null;

  for (const line of content.split(/\r?\n/u)) {
    if (line.startsWith("## ")) {
      currentDate = line.slice(3).trim();
      currentType = null;
      if (!sections.has(currentDate)) {
        sections.set(currentDate, new Map());
      }
      continue;
    }

    if (line.startsWith("### ")) {
      const heading = line.slice(4).trim();
      currentType = TITLE_TO_TYPE[heading] ?? "other";
      continue;
    }

    if (!line.startsWith("- ") || !currentDate || !currentType) {
      continue;
    }

    const shortHashMatch = /`([0-9a-f]{7,40})`/u.exec(line);
    const entries = sections.get(currentDate)?.get(currentType) ?? [];
    entries.push({
      hash: shortHashMatch?.[1] ?? line,
      shortHash: shortHashMatch?.[1] ?? line,
      text: line,
    });
    sections.get(currentDate)?.set(currentType, entries);
  }

  return sections;
}

export function renderChangelog(sections) {
  const lines = [
    "# Changelog",
    "",
    "This file is generated automatically from Conventional Commits on push to `main`.",
    "Do not edit it manually.",
    "",
  ];

  const orderedDates = [...sections.keys()].sort((left, right) => right.localeCompare(left));

  if (orderedDates.length === 0) {
    lines.push("No generated entries yet.", "");
    return `${lines.join("\n")}\n`;
  }

  for (const date of orderedDates) {
    lines.push(`## ${date}`, "");
    const typedEntries = sections.get(date);

    for (const type of TYPE_ORDER) {
      const entries = typedEntries?.get(type) ?? [];
      if (entries.length === 0) {
        continue;
      }

      lines.push(`### ${TYPE_TITLES[type]}`, "");
      for (const entry of entries) {
        lines.push(entry.text);
      }
      lines.push("");
    }
  }

  while (lines.at(-1) === "") {
    lines.pop();
  }

  return `${lines.join("\n")}\n`;
}

export function buildEntryText(commit) {
  const scopePrefix = commit.scope ? `${commit.scope}: ` : "";
  return `- ${scopePrefix}${commit.description} (\`${commit.shortHash}\`)`;
}

export function generateFullChangelog({ output, timezone }) {
  const rawLog = runGitLog(["log", "--reverse", "--pretty=format:%H%x09%aI%x09%s"]);
  const sections = addCommitsToSections(createEmptySections(), parseGitLog(rawLog, timezone));
  writeFileSync(resolve(output), renderChangelog(sections), "utf8");
}

export function generateIncrementalChangelog({ date, output, since, timezone, until }) {
  const outputPath = resolve(output);
  const currentContent = existsSync(outputPath) ? readFileSync(outputPath, "utf8") : "";
  const sections = currentContent ? parseExistingChangelog(currentContent) : createEmptySections();
  const rawLog = runIncrementalLog(since, until);
  const commits = parseGitLog(rawLog, timezone, date);
  addCommitsToSections(sections, commits);
  writeFileSync(outputPath, renderChangelog(sections), "utf8");
}

export function runCli(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);

  if (options.mode === "incremental" && options.since && options.date) {
    generateIncrementalChangelog(options);
    return;
  }

  generateFullChangelog(options);
}

function runGitLog(args) {
  return execFileSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

function runIncrementalLog(since, until) {
  if (!since || /^0+$/u.test(since)) {
    return runGitLog(["log", "--reverse", "--pretty=format:%H%x09%aI%x09%s"]);
  }

  return runGitLog([
    "log",
    "--reverse",
    "--pretty=format:%H%x09%aI%x09%s",
    `${since}..${until}`,
  ]);
}

function formatMexicoDate(isoDate, timezone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date(isoDate));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
