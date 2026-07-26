import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx next start -p 4321",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
