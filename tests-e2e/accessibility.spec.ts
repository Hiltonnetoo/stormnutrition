import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility checks for the critical journey (Etapa 15), against the
 * Auth/Firestore emulators with the synthetic seed:
 *
 * - axe-core scan (WCAG 2.0/2.1 A + AA rules) of every screen of the journey,
 *   including open dialogs, mobile viewport and the patient portal;
 * - reflow at 320 CSS px (WCAG 1.4.10) without horizontal scrolling;
 * - keyboard journey: skip link, dialog focus management, menu button and
 *   mobile navigation drawer.
 *
 * Automated checks catch a subset of issues; see docs/accessibility.md for
 * the manual review and the known limitations.
 */
const NUTRI = "dra.clara@demo.stormnutrition.com";
const PATIENT = "ana.silva@demo.stormnutrition.com";
const PASSWORD = "Password123!";

// Scan the settled UI: with reduced motion, entrance animations finish at once.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

const login = async (page: Page, email: string) => {
  await page.goto("/#/login");
  await page.fill("#email", email);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');
};

const expectNoViolations = async (page: Page, screen: string) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = results.violations.flatMap((v) =>
    v.nodes.map(
      (n) =>
        `${v.id} (${v.impact}) ${n.target.join(" ")} :: ${n.failureSummary}`,
    ),
  );
  expect(summary, `axe violations on "${screen}"`).toEqual([]);
};

const expectNoHorizontalScroll = async (page: Page, screen: string) => {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const main = document.querySelector("main");
    return {
      page: doc.scrollWidth - doc.clientWidth,
      main: main ? main.scrollWidth - main.clientWidth : 0,
    };
  });
  expect(overflow, `horizontal overflow on "${screen}" at 320px`).toEqual({
    page: 0,
    main: 0,
  });
};

test.describe("Accessibility — axe scan of the journey", () => {
  test("public pages", async ({ page }) => {
    for (const [name, url] of [
      ["Home", "/"],
      ["Login", "/#/login"],
      ["Cadastro", "/#/register"],
      ["Login do paciente", "/#/paciente"],
    ] as const) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await expectNoViolations(page, name);
    }
  });

  test("professional screens and their dialogs", async ({ page }) => {
    await login(page, NUTRI);
    await expect(page).toHaveURL(/dashboard/);

    for (const [name, url, ready] of [
      ["Dashboard", "/#/dashboard", "Quick Actions"],
      ["Pacientes", "/#/patients", "Ana Silva"],
      ["Perfil do paciente", "/#/patients/patient-ana-silva", "Ana"],
      ["Agenda", "/#/calendar", "Upcoming"],
      ["Relatórios", "/#/reports", "Reports"],
      ["Configurações", "/#/settings", "Settings"],
      ["Alimentos", "/#/food-database", "Food"],
      ["Calculadora metabólica", "/#/metabolic-calculator", "Metabolic"],
      ["Envio de planos", "/#/email-admin", "Plan"],
    ] as const) {
      await page.goto(url);
      await page.getByText(ready).filter({ visible: true }).first().waitFor();
      await page.waitForLoadState("networkidle");
      await expectNoViolations(page, name);
    }

    // New patient dialog, including the invalid state
    await page.goto("/#/patients");
    await page.getByRole("button", { name: /New Patient/i }).click();
    const newPatient = page.getByRole("dialog", {
      name: "Register New Patient",
    });
    await expect(newPatient).toBeVisible();
    await expectNoViolations(page, "Cadastro de paciente");
    await newPatient.getByRole("button", { name: "Next" }).click();
    await expect(page.getByLabel("First Name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expectNoViolations(page, "Cadastro de paciente (erros)");
    await page.keyboard.press("Escape");

    // Patient actions menu and diet history dialog
    await page
      .getByRole("button", { name: "More actions for Ana Silva" })
      .filter({ visible: true })
      .first()
      .click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expectNoViolations(page, "Menu de ações do paciente");
    await page.getByRole("menuitem", { name: /History/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page
      .getByRole("button", { name: /View diet from/ })
      .first()
      .waitFor();
    await expectNoViolations(page, "Histórico de dietas");
    await page
      .getByRole("button", { name: /View diet from/ })
      .first()
      .click();
    await expect(page.locator("#diet-plan-viewer-content")).toBeVisible();
    await expectNoViolations(page, "Dieta aberta no histórico");
    await page.keyboard.press("Escape"); // back to the list
    await page.keyboard.press("Escape"); // close the dialog

    // Appointment dialog
    await page.goto("/#/calendar");
    await page.getByRole("button", { name: "New Appointment" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoViolations(page, "Nova consulta");
    await page.keyboard.press("Escape");

    // Diet generator: form, generated plan, review and export dialogs
    await page.goto("/#/diet-generator");
    await page.locator("#patient").selectOption("patient-ana-silva");
    await expectNoViolations(page, "Gerador — etapa 1");
    const next = page.getByRole("button", { name: /^Next$/ });
    await next.click();
    await next.click();
    await expectNoViolations(page, "Gerador — etapa 3");
    await page.getByRole("button", { name: /Generate.*Plan/i }).click();
    await expect(page.locator("#diet-plan-display-content")).toBeVisible({
      timeout: 15000,
    });
    await expectNoViolations(page, "Plano gerado");
    await page.getByRole("button", { name: /Save Plan/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoViolations(page, "Revisão clínica");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /^Export/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoViolations(page, "Exportar plano");
    await page.keyboard.press("Escape");
  });

  test("patient portal and its dialogs", async ({ page }) => {
    await login(page, PATIENT);
    await expect(page).toHaveURL(/paciente/);
    await page
      .getByText(/My Meal Plan/)
      .first()
      .waitFor();
    await expectNoViolations(page, "Portal do paciente");

    await page
      .getByRole("button", { name: /Current Plan/i })
      .first()
      .click();
    await expectNoViolations(page, "Portal — plano expandido");

    await page.getByRole("button", { name: /Log Weight/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoViolations(page, "Portal — registrar peso");
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: /Change Password/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoViolations(page, "Portal — trocar senha");
    await page.keyboard.press("Escape");
  });

  test("mobile viewport (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await login(page, NUTRI);
    await expect(page).toHaveURL(/dashboard/);
    await page.getByText("Quick Actions").filter({ visible: true }).waitFor();
    await expectNoViolations(page, "Dashboard (mobile)");

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(
      page.getByRole("dialog", { name: "Navigation menu" }),
    ).toBeVisible();
    await expectNoViolations(page, "Menu de navegação (mobile)");
    await page.keyboard.press("Escape");

    await page.goto("/#/patients");
    await page
      .getByText("Ana Silva")
      .filter({ visible: true })
      .first()
      .waitFor();
    await expectNoViolations(page, "Pacientes (mobile)");
  });
});

test.describe("Accessibility — reflow at 320 CSS px", () => {
  test("journey screens fit without horizontal scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const [name, url] of [
      ["Home", "/"],
      ["Login", "/#/login"],
    ] as const) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await expectNoHorizontalScroll(page, name);
    }
    await login(page, NUTRI);
    await expect(page).toHaveURL(/dashboard/);
    for (const [name, url, ready] of [
      ["Dashboard", "/#/dashboard", "Quick Actions"],
      ["Pacientes", "/#/patients", "Ana Silva"],
      ["Perfil do paciente", "/#/patients/patient-ana-silva", "Ana"],
      ["Gerador de dietas", "/#/diet-generator", "Diet"],
      ["Agenda", "/#/calendar", "Upcoming"],
    ] as const) {
      await page.goto(url);
      await page.getByText(ready).filter({ visible: true }).first().waitFor();
      await expectNoHorizontalScroll(page, name);
    }
  });
});

test.describe("Accessibility — reflow at 320 CSS px (patient)", () => {
  test("portal fits without horizontal scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await login(page, PATIENT);
    await expect(page).toHaveURL(/paciente/);
    await page
      .getByText(/My Meal Plan/)
      .first()
      .waitFor();
    await page
      .getByRole("button", { name: /Current Plan/i })
      .first()
      .click();
    await expectNoHorizontalScroll(page, "Portal do paciente");
  });
});

test.describe("Accessibility — keyboard journey", () => {
  test("skip link, dialog focus management and menu button", async ({
    page,
  }) => {
    await login(page, NUTRI);
    await expect(page).toHaveURL(/dashboard/);
    await page.goto("/#/patients");
    await page
      .getByText("Ana Silva")
      .filter({ visible: true })
      .first()
      .waitFor();

    // Fresh document: the skip link is the first Tab stop and moves focus to
    // the main content.
    await page.reload();
    await page
      .getByText("Ana Silva")
      .filter({ visible: true })
      .first()
      .waitFor();
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();

    // Dialog: opened from the keyboard, focus inside, Escape returns focus
    const newPatientButton = page.getByRole("button", { name: /New Patient/i });
    await newPatientButton.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("First Name")).toBeFocused();
    // Tab stays inside the dialog
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    const focusInsideDialog = await page.evaluate(() =>
      Boolean(document.activeElement?.closest('[role="dialog"]')),
    );
    expect(focusInsideDialog).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(newPatientButton).toBeFocused();

    // Menu button: arrows open and move, Escape returns to the trigger
    const trigger = page
      .getByRole("button", { name: "More actions for Ana Silva" })
      .filter({ visible: true })
      .first();
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    const items = page.getByRole("menuitem");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("mobile navigation drawer is a dialog that returns focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await login(page, NUTRI);
    await expect(page).toHaveURL(/dashboard/);
    const menuButton = page.getByRole("button", {
      name: "Open navigation menu",
    });
    await menuButton.focus();
    await page.keyboard.press("Enter");
    const drawer = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Overview" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);
    await expect(menuButton).toBeFocused();
  });
});
