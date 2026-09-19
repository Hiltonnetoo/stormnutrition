import baseConfig from "./playwright.config";
import { defineConfig } from "@playwright/test";

// UI11 — real screenshots of the app with the synthetic seed. Same emulated
// server and guard as the E2E suite; only the test files differ. Run with
// `npm run screenshots` (starts the emulators and seeds them first).
export default defineConfig({
  ...baseConfig,
  testMatch: /.*\.capture\.ts$/,
  use: { ...baseConfig.use, screenshot: "off" },
});
