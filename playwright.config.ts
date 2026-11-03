import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  expect: { timeout: 8000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "artifacts/playwright-report", open: "never" }]],
  outputDir: "artifacts/test-results",
  use: { baseURL: "http://127.0.0.1:31317", channel: "chrome", screenshot: "only-on-failure", trace: "retain-on-failure", reducedMotion: "reduce" },
  webServer: { command: "npm run start -- --port 31317", url: "http://127.0.0.1:31317", reuseExistingServer: false, timeout: 30000 },
});
