import { test, expect, type Page } from "@playwright/test";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

/**
 * UI11 — captures the real screens used in the docs, with the synthetic seed
 * (emulators only), light theme, PT, reduced motion. Each capture is recorded
 * in docs/screenshots/manifest.json with route, viewport, language, theme,
 * date and version, so an outdated or doctored image is easy to spot.
 *
 *   npm run screenshots
 */
const OUT = path.resolve("docs/screenshots");
const NUTRI = "dra.clara@demo.stormnutrition.com";
const PATIENT = "ana.silva@demo.stormnutrition.com";
const PASSWORD = "Password123!";
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 812 };

const version = (() => {
  try {
    const sha = execSync("git rev-parse --short HEAD").toString().trim();
    const dirty = execSync("git status --porcelain").toString().trim() !== "";
    return dirty ? `${sha}+working-tree` : sha;
  } catch {
    return "unknown";
  }
})();

interface Entry {
  file: string;
  screen: string;
  route: string;
  viewport: string;
  language: string;
  theme: string;
  date: string;
  version: string;
  data: string;
}
const manifest: Entry[] = [];

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("language", "pt"));
});

const login = async (page: Page, email: string, landing: RegExp) => {
  await page.goto("/#/login");
  await page.fill("#email", email);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(landing);
};

const settle = async (page: Page) => {
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, {
    timeout: 15000,
  });
  // No error overlay, DevTools or failed-login banner in a doc screenshot.
  await expect(
    page.getByText(/INVALID_LOGIN_CREDENTIALS|auth\/invalid/),
  ).toHaveCount(0);
};

const shot = async (
  page: Page,
  file: string,
  screen: string,
  viewport: { width: number; height: number },
) => {
  await settle(page);
  await page.screenshot({ path: path.join(OUT, file), fullPage: false });
  manifest.push({
    file,
    screen,
    route: new URL(page.url()).hash || "/",
    viewport: `${viewport.width}x${viewport.height}`,
    language: "pt-BR",
    theme: "light",
    // Local calendar date (sv-SE formats as YYYY-MM-DD).
    date: new Date().toLocaleDateString("sv-SE"),
    version,
    data: "seed sintético (scripts/seed-emulator.mjs), projeto demo-storm",
  });
};

test("professional screens — desktop", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize(DESKTOP);
  await login(page, NUTRI, /dashboard/);
  await shot(page, "dashboard.png", "Dashboard", DESKTOP);

  await page.goto("/#/patients");
  await expect(
    page.getByText("Ana Silva").filter({ visible: true }).first(),
  ).toBeVisible();
  await shot(page, "patients.png", "Lista de pacientes", DESKTOP);

  await page.goto("/#/patients/patient-ana-silva");
  await shot(page, "patient_profile.png", "Perfil do paciente", DESKTOP);

  await page.goto("/#/calendar");
  await shot(page, "calendar.png", "Agenda", DESKTOP);

  await page.goto("/#/patients");
  await page.getByPlaceholder(/Buscar por nome/).fill("paciente inexistente");
  await expect(
    page.getByRole("heading", { name: /Nenhum resultado/ }),
  ).toBeVisible();
  await shot(page, "patients_no_results.png", "Estado sem resultados", DESKTOP);

  await page.goto("/#/diet-generator");
  await page.locator("#patient").selectOption("patient-ana-silva");
  await shot(page, "diet_generator_step1.png", "Gerador — etapa 1", DESKTOP);
  const next = page.getByRole("button", { name: /^Próximo/ });
  await next.click();
  await next.click();
  await page.getByRole("button", { name: /Gerar Plano/i }).click();
  await expect(page.locator("#diet-plan-display-content")).toBeVisible({
    timeout: 15000,
  });
  await shot(page, "diet_generator.png", "Gerador — plano gerado", DESKTOP);
  // A1/UI12: grouped warnings panel of the generated plan
  const panel = page.locator('[data-testid="validation-issues"]');
  if (await panel.count()) {
    await panel.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "diet_generator_warnings.png") });
    manifest.push({
      ...manifest[manifest.length - 1],
      file: "diet_generator_warnings.png",
      screen: "Gerador — avisos agrupados",
    });
  }
});

test("professional screens — mobile", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await login(page, NUTRI, /dashboard/);
  await shot(page, "dashboard_mobile.png", "Dashboard (celular)", MOBILE);
  await page.goto("/#/calendar");
  await shot(page, "calendar_mobile.png", "Agenda (celular)", MOBILE);
});

test("public error state — invalid invitation", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/#/convite/token-inexistente-sintetico");
  await expect(page.getByRole("heading").first()).toBeVisible();
  await shot(page, "invitation_error.png", "Erro: convite inválido", DESKTOP);
});

test("patient portal — desktop and mobile", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await login(page, PATIENT, /paciente/);
  await shot(page, "portal.png", "Portal do paciente", DESKTOP);
  await page.setViewportSize(MOBILE);
  await shot(page, "portal_mobile.png", "Portal do paciente (celular)", MOBILE);
});

test.afterAll(() => {
  writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
});
