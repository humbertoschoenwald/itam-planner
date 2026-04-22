import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEV_SERVER_POLL_INTERVAL_MS = 500;
const DEV_SERVER_READY_TIMEOUT_MS = 40_000;
const DEV_SERVER_REQUEST_TIMEOUT_MS = 5_000;
const DEFAULT_HOSTNAME = "127.0.0.1";
const DEFAULT_PORT = 3000;
const HTTP_OK_MIN_STATUS = 200;
const HTTP_REDIRECT_MAX_STATUS = 399;
const NPM_EXECUTABLE_BASENAME = process.platform === "win32" ? "npx.cmd" : "npx";
const PNPM_EXECUTABLE_PACKAGE = "pnpm@10.33.0";
const PNPM_EXECUTABLE_ARGS = [PNPM_EXECUTABLE_PACKAGE, "dev"];
const WINDOWS_COMMAND_EXECUTABLE = "cmd.exe";
const WINDOWS_COMMAND_SWITCHES = ["/d", "/s", "/c"];
const IGNORED_PROCESS_OUTPUT_PATTERNS = [/^npm warn Unknown env config.*$/gmu];
const RESPONSIVE_ROUTE_FILE_NAME = "responsive-shell-routes.json";
const ROUTE_WARMUP_LABEL = "[responsive-warmup]";
const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"];

const currentFilePath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(currentFilePath);
const webRootDirectoryPath = path.resolve(scriptsDirectoryPath, "..");
const responsiveRouteFilePath = path.join(
  webRootDirectoryPath,
  "tests",
  "e2e",
  RESPONSIVE_ROUTE_FILE_NAME,
);

const port = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10);
const hostname = process.env.HOST ?? DEFAULT_HOSTNAME;
const baseUrl = `http://${hostname}:${port}`;

const responsiveRoutes = await loadResponsiveRoutes();
const devServerCommand = resolveDevServerCommand(port);
const devServer = spawn(
  devServerCommand.command,
  devServerCommand.args,
  {
    cwd: webRootDirectoryPath,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  },
);

pipeChildOutput(devServer.stdout, process.stdout);
pipeChildOutput(devServer.stderr, process.stderr);

registerShutdown(devServer);

let hasPrewarmedRoutes = false;

devServer.once("error", (error) => {
  throw error;
});

devServer.once("exit", (code, signal) => {
  if (hasPrewarmedRoutes) {
    process.exit(code ?? 0);
  }

  if (signal !== null) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

await waitForServerReady(baseUrl);
await prewarmRoutes(baseUrl, responsiveRoutes);
hasPrewarmedRoutes = true;

process.stdout.write(
  `${ROUTE_WARMUP_LABEL} ready after prewarming ${responsiveRoutes.length} public routes\n`,
);

function pipeChildOutput(source, target) {
  if (source === null) {
    return;
  }

  source.on("data", (chunk) => {
    const text = filterIgnoredProcessOutput(String(chunk));

    if (text.length > 0) {
      target.write(text);
    }
  });
}

async function loadResponsiveRoutes() {
  const raw = await readFile(responsiveRouteFilePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string")) {
    throw new TypeError(`${ROUTE_WARMUP_LABEL} route list must be a JSON string array`);
  }

  return parsed;
}

function resolveDevServerCommand(targetPort) {
  const pnpmArguments = [...PNPM_EXECUTABLE_ARGS, "--port", String(targetPort)];

  if (process.platform !== "win32") {
    return {
      args: pnpmArguments,
      command: NPM_EXECUTABLE_BASENAME,
    };
  }

  const windowsCommand = `${NPM_EXECUTABLE_BASENAME} ${pnpmArguments.join(" ")}`;

  return {
    args: [...WINDOWS_COMMAND_SWITCHES, windowsCommand],
    command: WINDOWS_COMMAND_EXECUTABLE,
  };
}

function registerShutdown(childProcess) {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, () => {
      if (!childProcess.killed) {
        childProcess.kill(signal);
      }
    });
  }
}

function filterIgnoredProcessOutput(text) {
  return IGNORED_PROCESS_OUTPUT_PATTERNS.reduce((result, pattern) => {
    return result.replace(pattern, "");
  }, text);
}

async function waitForServerReady(targetBaseUrl) {
  const deadline = Date.now() + DEV_SERVER_READY_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const response = await fetchWithTimeout(targetBaseUrl);
    if (response?.ok ?? false) {
      return;
    }

    await sleep(DEV_SERVER_POLL_INTERVAL_MS);
  }

  throw new Error(`${ROUTE_WARMUP_LABEL} timed out waiting for ${targetBaseUrl}`);
}

async function prewarmRoutes(targetBaseUrl, routes) {
  for (const routePath of routes) {
    const targetUrl = new URL(routePath, targetBaseUrl).toString();
    const response = await fetchWithTimeout(targetUrl);

    if (response === null) {
      throw new Error(`${ROUTE_WARMUP_LABEL} did not receive a response for ${targetUrl}`);
    }

    if (!isAcceptableWarmupStatus(response.status)) {
      throw new Error(
        `${ROUTE_WARMUP_LABEL} received ${response.status} while warming ${targetUrl}`,
      );
    }
  }
}

async function fetchWithTimeout(targetUrl) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => {
    controller.abort();
  }, DEV_SERVER_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        "user-agent": ROUTE_WARMUP_LABEL,
      },
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

function isAcceptableWarmupStatus(status) {
  return status >= HTTP_OK_MIN_STATUS && status <= HTTP_REDIRECT_MAX_STATUS;
}

function sleep(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
