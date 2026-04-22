import { expect, test, type Page } from "@playwright/test";
import routePaths from "./responsive-shell-routes.json";

const OVERFLOW_TOLERANCE_PX = 1;
const OVERFLOW_MENU_LABEL_PATTERN =
  /product menu|menú del producto|official links|enlaces oficiales/u;
const RESPONSIVE_UI_TIMEOUT_MS = 30_000;
const COMPACT_SECONDARY_LABEL_PATTERN = /Project|Proyecto/u;
const OVERFLOW_ONLY_PROJECT_NAMES = ["mobile-chromium", "mobile-webkit"];
const PHONE_PROJECT_NAMES = ["mobile-chromium", "mobile-webkit"];
const TABLET_PROJECT_NAMES = ["tablet-webkit"];
const PHONE_HEADER_MAX_HEIGHT_PX = 112;
const DEV_SERVER_RUNTIME_ERROR_PATTERNS = [
  /_next\/webpack-hmr/u,
  /ERR_INVALID_HTTP_RESPONSE/u,
] as const;
const COLLAPSED_NAV_HIDDEN_LABELS = ["Proyecto", "Conectar con IA", "Configuración"];
const SAME_ORIGIN_ROUTE = "/";
const ALLOWED_REQUEST_PROTOCOL_PREFIXES = ["data:", "blob:", "about:"] as const;
const ALLOWED_FAILED_REQUEST_PATTERNS = [/favicon\.ico$/u] as const;

test.describe("responsive shell", () => {
  for (const routePath of routePaths) {
    test(`${routePath} stays inside the viewport and avoids runtime errors`, async ({
      page,
    }, testInfo) => {
      const runtimeErrors = collectRuntimeErrors(page);
      const failedRequests = collectFailedRequests(page);

      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("header", {
        state: "visible",
        timeout: RESPONSIVE_UI_TIMEOUT_MS,
      });

      await expect(page.locator("main")).toBeVisible({
        timeout: RESPONSIVE_UI_TIMEOUT_MS,
      });
      await expect(page.locator("header")).toBeVisible();
      await assertNoHorizontalOverflow(page);

      if (OVERFLOW_ONLY_PROJECT_NAMES.includes(testInfo.project.name)) {
        await expect(
          page.getByRole("button", {
            name: OVERFLOW_MENU_LABEL_PATTERN,
          }),
        ).toBeVisible();
        await assertCollapsedNavigation(page);
      }

      if (TABLET_PROJECT_NAMES.includes(testInfo.project.name)) {
        await expect(
          page.locator("header nav").getByRole("link", {
            name: COMPACT_SECONDARY_LABEL_PATTERN,
          }),
        ).toBeVisible();

        if (routePath === "/") {
          await assertTabletGridDensity(page);
        }
      }

      if (routePath === "/planner/onboarding" && PHONE_PROJECT_NAMES.includes(testInfo.project.name)) {
        await expect(page.getByText(/\d{2}\s*\/\s*\d{2}/u)).toBeVisible();
      }

      if (PHONE_PROJECT_NAMES.includes(testInfo.project.name)) {
        await assertCompactPhoneHeader(page);
      }

      expect(runtimeErrors).toEqual([]);
      expect(failedRequests).toEqual([]);
    });
  }

  test("keeps the initial route same-origin during boot", async ({ page, baseURL }) => {
    const externalRequests = collectExternalRequests(page, baseURL ?? "");

    await page.goto(SAME_ORIGIN_ROUTE, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("header", {
      state: "visible",
      timeout: RESPONSIVE_UI_TIMEOUT_MS,
    });

    expect(externalRequests).toEqual([]);
  });
});

function collectRuntimeErrors(page: Page): string[] {
  const runtimeErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" && !isIgnoredRuntimeError(message.text())) {
      runtimeErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    if (!isIgnoredRuntimeError(error.message)) {
      runtimeErrors.push(error.message);
    }
  });

  return runtimeErrors;
}

function collectExternalRequests(page: Page, baseUrl: string): string[] {
  const externalRequests: string[] = [];
  const baseOrigin = new URL(baseUrl).origin;

  page.on("request", (request) => {
    const requestUrl = request.url();

    if (ALLOWED_REQUEST_PROTOCOL_PREFIXES.some((prefix) => requestUrl.startsWith(prefix))) {
      return;
    }

    if (new URL(requestUrl).origin !== baseOrigin) {
      externalRequests.push(requestUrl);
    }
  });

  return externalRequests;
}

function collectFailedRequests(page: Page): string[] {
  const failedRequests: string[] = [];

  page.on("requestfailed", (request) => {
    const requestUrl = request.url();

    if (ALLOWED_FAILED_REQUEST_PATTERNS.some((pattern) => pattern.test(requestUrl))) {
      return;
    }

    failedRequests.push(`${requestUrl} :: ${request.failure()?.errorText ?? "unknown"}`);
  });

  return failedRequests;
}

async function assertCollapsedNavigation(page: Page): Promise<void> {
  const normalizedNavLinkTexts = await page.locator("nav a").evaluateAll((links) =>
    links
      .filter((link) => {
        const style = window.getComputedStyle(link);

        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          link.getBoundingClientRect().width > 0
        );
      })
      .map((link) => String(link.textContent).trim())
      .filter(Boolean),
  );

  for (const hiddenLabel of COLLAPSED_NAV_HIDDEN_LABELS) {
    expect(normalizedNavLinkTexts).not.toContain(hiddenLabel);
  }
}

function isIgnoredRuntimeError(message: string): boolean {
  return DEV_SERVER_RUNTIME_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const header = document.querySelector("header");
    const main = document.querySelector("main");

    return {
      bodyScrollWidth: body.scrollWidth,
      headerScrollWidth: header?.scrollWidth ?? 0,
      headerWidth: header?.getBoundingClientRect().width ?? 0,
      mainWidth: main?.getBoundingClientRect().width ?? 0,
      viewportWidth: window.innerWidth,
      windowScrollWidth: html.scrollWidth,
    };
  });

  expect(metrics.windowScrollWidth).toBeLessThanOrEqual(
    metrics.viewportWidth + OVERFLOW_TOLERANCE_PX,
  );
  expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(
    metrics.viewportWidth + OVERFLOW_TOLERANCE_PX,
  );
  expect(metrics.headerWidth).toBeLessThanOrEqual(
    metrics.viewportWidth + OVERFLOW_TOLERANCE_PX,
  );
  expect(metrics.headerScrollWidth).toBeLessThanOrEqual(
    metrics.viewportWidth + OVERFLOW_TOLERANCE_PX,
  );
  expect(metrics.mainWidth).toBeLessThanOrEqual(
    metrics.viewportWidth + OVERFLOW_TOLERANCE_PX,
  );
}

async function assertTabletGridDensity(page: Page): Promise<void> {
  const pageGridColumnCount = await page.evaluate(() => {
    const firstPageGrid = document.querySelector<HTMLElement>(
      "main .page-grid, main .feature-grid, main .news-grid",
    );
    if (firstPageGrid === null) {
      return 0;
    }

    return window
      .getComputedStyle(firstPageGrid)
      .gridTemplateColumns.split(" ")
      .filter(Boolean).length;
  });

  expect(pageGridColumnCount).toBeGreaterThan(1);
}

async function assertCompactPhoneHeader(page: Page): Promise<void> {
  const headerHeight = await page.evaluate(() => {
    return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  });

  expect(headerHeight).toBeLessThanOrEqual(PHONE_HEADER_MAX_HEIGHT_PX);
}
