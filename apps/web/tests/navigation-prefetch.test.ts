import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const webRoot = path.resolve(__dirname, "..");

const filesWithDisabledPrefetch = [
  "components/home-page-shell.tsx",
  "components/community-page-shell.tsx",
  "components/connect-chatgpt-panel.tsx",
  "components/onboarding-panel.tsx",
  "components/planner-route-shell.tsx",
  "components/site-header.tsx",
  "components/site-footer.tsx",
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
