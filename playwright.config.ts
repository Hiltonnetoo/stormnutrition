import { defineConfig, devices } from "@playwright/test";

const PORT = 5005;

export default defineConfig({
  testDir: "./tests-e2e",
  // Refuses to run unless the served app is on the emulated demo project.
  globalSetup: "./tests-e2e/global-setup.ts",
  fullyParallel: false, // Run sequentially for predictable DB state
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Use single worker for DB state consistency
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // "emulator" mode reads ONLY config/emulator/.env (synthetic demo-storm
    // project), never the personal .env.local. --strictPort fails instead of
    // silently moving to another port.
    command: `npx vite --mode emulator --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    // Reusing an already running server is opt-in; even then global-setup
    // verifies it is the emulated demo project before any test runs.
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "true",
    timeout: 60000,
  },
});
