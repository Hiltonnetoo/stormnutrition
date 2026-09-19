import { chromium, type FullConfig } from "@playwright/test";

const EXPECTED_ENV = "emulator:demo-storm";

/**
 * Guard against running E2E tests against real services: the app marks
 * <html data-firebase-env="emulator:<project>"> only when it is connected to
 * the Firebase emulators. Anything else (cloud project, stale dev server,
 * wrong mode) aborts the run before a single test signs in.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) throw new Error("E2E global setup: baseURL is not configured.");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(baseURL);
    const env = await page
      .waitForFunction(
        () => document.documentElement.dataset.firebaseEnv,
        null,
        {
          timeout: 30000,
        },
      )
      .then((handle) => handle.jsonValue())
      .catch(() => undefined);
    if (env !== EXPECTED_ENV) {
      throw new Error(
        `E2E refused: the app at ${baseURL} is not connected to the emulated demo project ` +
          `(expected data-firebase-env="${EXPECTED_ENV}", found "${env ?? "none"}"). ` +
          "Run the suite with `npm run test:e2e:emulated`.",
      );
    }
  } finally {
    await browser.close();
  }
}
