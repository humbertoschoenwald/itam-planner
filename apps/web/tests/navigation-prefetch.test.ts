import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const webRoot = path.resolve(__dirname, "..");

const filesWithDisabledPrefetch = [
  "app/page.tsx",
  "app/community/page.tsx",
  "components/connect-chatgpt-panel.tsx",
  "components/onboarding-panel.tsx",
  "components/planner-home.tsx",
  "components/planner-route-shell.tsx",
  "components/site-header.tsx",
  "components/student-code-card.tsx",
];

describe("navigation prefetch contract", () => {
  it("disables automatic App Router prefetch on public navigation surfaces", () => {
    filesWithDisabledPrefetch.forEach((relativePath) => {
      const contents = fs.readFileSync(path.join(webRoot, relativePath), "utf8");
      expect(contents).toContain("prefetch={false}");
    });
  });
});
