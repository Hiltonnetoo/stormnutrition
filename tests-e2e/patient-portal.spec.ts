import { test, expect } from "@playwright/test";

/**
 * Associated Patient Portal Critical E2E Journey:
 * Login → Assigned Diet Verification → Daily Adherence Check-in → Multi-tenant Role Isolation
 *
 * Runs against the local Firebase Auth & Firestore emulators without external credentials.
 */
test.describe("Patient Portal Journey (Patient E2E Flow)", () => {
  const PATIENT_EMAIL = "ana.silva@demo.stormnutrition.com";
  const PATIENT_PASSWORD = "Password123!";

  test("logs in as patient, views assigned diet, performs adherence check-in and isolates professional data", async ({
    page,
  }) => {
    // 1. Authenticate via login page as the linked patient
    await page.goto("/#/login");
    await page.waitForLoadState("domcontentloaded");

    await page.fill("#email", PATIENT_EMAIL);
    await page.fill("#password", PATIENT_PASSWORD);
    await page.click('button[type="submit"]');

    // 2. Patient role is routed to the Patient Portal
    await expect(page).toHaveURL(/.*paciente/);

    // 3. Verify the diet plan section exists
    const dietSectionHeader = page
      .getByRole("heading", { name: /Meu Plano Alimentar|My Meal Plan/i })
      .first();
    await expect(dietSectionHeader).toBeVisible({ timeout: 15000 });

    // The seeded diet is displayed in an accordion ("Plano Atual" / "Current Plan")
    // Passo C09.1: Ações essenciais são obrigatórias com expect (sem if (isVisible()))
    const planAccordionBtn = page
      .getByRole("button", { name: /Plano Atual|Current Plan/i })
      .first();
    await expect(planAccordionBtn).toBeVisible({ timeout: 15000 });
    await planAccordionBtn.click();

    // Expanded content must show the meal name
    await expect(
      page.getByRole("heading", { name: /Café da Manhã|Breakfast/i }).first(),
    ).toBeVisible({ timeout: 10000 });

    // 4. Daily adherence check-in: mandatory action (Passo C09.1 e C09.4)
    const checkInStatus = page
      .getByRole("status")
      .filter({ hasText: /Você seguiu o plano|You followed the plan/i })
      .first();
    const followedBtn = page
      .getByRole("button", {
        name: /Segui 100%|Followed 100%/i,
      })
      .first();

    // R08-C: the seed leaves Ana without a check-in for today, so the click
    // is mandatory — if a record already existed this step fails instead of
    // being skipped. (The "already recorded" case is the next test.)
    await expect(checkInStatus).toHaveCount(0);
    await expect(followedBtn).toBeVisible({ timeout: 10000 });
    await followedBtn.click();
    await expect(checkInStatus).toBeVisible({ timeout: 8000 });

    // 5. Confirm check-in persistence after reload (Passo C09.4)
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(checkInStatus).toBeVisible({
      timeout: 15000,
    });

    // 6. Multi-tenant and role-based data isolation:
    // Attempt to access nutritionist management routes directly
    await page.goto("/#/dashboard");
    // App router must redirect patient back to /paciente
    await expect(page).toHaveURL(/.*paciente/);

    await page.goto("/#/patients");
    await expect(page).toHaveURL(/.*paciente/);

    await page.goto("/#/settings");
    await expect(page).toHaveURL(/.*paciente/);

    // Ensure nutritionist-specific management actions are not rendered
    await expect(page.locator("text=Cadastrar Paciente")).not.toBeVisible();
    await expect(
      page.locator("text=Configurações da Clínica"),
    ).not.toBeVisible();
  });

  test("an existing check-in for today is shown without offering a new one (R08-C)", async ({
    page,
  }) => {
    // Runs after the mandatory check-in above (same seeded data, serial run).
    await page.goto("/#/login");
    await page.fill("#email", "ana.silva@demo.stormnutrition.com");
    await page.fill("#password", "Password123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*paciente/);
    await expect(
      page
        .getByRole("status")
        .filter({ hasText: /Você seguiu o plano|You followed the plan/i }),
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole("button", { name: /Segui 100%|Followed 100%/i }),
    ).toHaveCount(0);
  });
});
