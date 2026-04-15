import test from "node:test";
import assert from "node:assert/strict";

import {
  addCommitsToSections,
  createEmptySections,
  parseConventionalCommit,
  parseExistingChangelog,
  renderChangelog,
} from "./generate-changelog.mjs";

test("parseConventionalCommit extracts type, scope, and description", () => {
  assert.deepEqual(parseConventionalCommit("feat(web): ship planner shell"), {
    description: "ship planner shell",
    rawMessage: "feat(web): ship planner shell",
    scope: "web",
    type: "feat",
  });
});

test("renderChangelog merges new commits into an existing date section", () => {
  const existing = parseExistingChangelog(`# Changelog

This file is generated automatically from Conventional Commits on push to \`main\`.
Do not edit it manually.

## 2026-04-15

### Features

- web: existing feature (\`aaaaaaa\`)
`);

  addCommitsToSections(existing, [
    {
      date: "2026-04-15",
      description: "new fix",
      hash: "bbbbbbb111111111111111111111111111111111",
      rawMessage: "fix(api): new fix",
      scope: "api",
      shortHash: "bbbbbbb",
      type: "fix",
    },
    {
      date: "2026-04-15",
      description: "existing feature",
      hash: "aaaaaaa111111111111111111111111111111111",
      rawMessage: "feat(web): existing feature",
      scope: "web",
      shortHash: "aaaaaaa",
      type: "feat",
    },
  ]);

  const rendered = renderChangelog(existing);

  assert.match(rendered, /## 2026-04-15/u);
  assert.match(rendered, /### Features[\s\S]*web: existing feature/u);
  assert.match(rendered, /### Fixes[\s\S]*api: new fix/u);
  assert.equal((rendered.match(/existing feature/g) ?? []).length, 1);
});

test("createEmptySections starts with no generated sections", () => {
  assert.equal(createEmptySections().size, 0);
});
