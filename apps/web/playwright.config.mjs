import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm run start -w @opsflow/api",
      cwd: monorepoRoot,
      url: "http://127.0.0.1:3001/jobs?_limit=1",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command:
        "npm run dev -w @opsflow/web -- --hostname 127.0.0.1 --port 3000",
      cwd: monorepoRoot,
      url: "http://127.0.0.1:3000/jobs",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: {
        ...process.env,
        NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:3001",
      },
    },
  ],
});
