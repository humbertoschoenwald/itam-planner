import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:3000";
const REPOSITORY_ROOT = path.resolve(__dirname, "../..");
const PLAYWRIGHT_TIMEOUT_MS = 30_000;
const PLAYWRIGHT_EXPECT_TIMEOUT_MS = 5_000;
const PLAYWRIGHT_WEBSERVER_TIMEOUT_MS = 40_000;
const PLAYWRIGHT_WEBSERVER_COMMAND = "node ./scripts/start-responsive-dev-server.mjs";
const PLAYWRIGHT_WORKER_COUNT = 1;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: PLAYWRIGHT_WORKER_COUNT,
  timeout: PLAYWRIGHT_TIMEOUT_MS,
  expect: {
    timeout: PLAYWRIGHT_EXPECT_TIMEOUT_MS,
  },
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: PLAYWRIGHT_WEBSERVER_COMMAND,
    cwd: path.join(REPOSITORY_ROOT, "apps", "web"),
    reuseExistingServer: !process.env.CI,
    timeout: PLAYWRIGHT_WEBSERVER_TIMEOUT_MS,
    url: BASE_URL,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"],
      },
    },
    {
      name: "mobile-webkit",
      use: {
        ...devices["iPhone 14"],
      },
    },
    {
      name: "tablet-webkit",
      use: {
        browserName: "webkit",
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: true,
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        viewport: {
          width: 834,
          height: 1194,
        },
      },
    },
  ],
});
