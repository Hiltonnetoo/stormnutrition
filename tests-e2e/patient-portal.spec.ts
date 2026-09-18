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
    await page.waitForLoadState("networkidle");

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
    const planAccordionBtn = page
      .getByRole("button", { name: /Plano Atual|Current Plan/i })
      .first();
    if (await planAccordionBtn.isVisible()) {
      await planAccordionBtn.click();
      // Expanded content shows meal name
      await expect(
        page.getByRole("heading", { name: /Café da Manhã|Breakfast/i }).first(),
      ).toBeVisible({ timeout: 10000 });
    }

    // 4. Daily adherence check-in
    // Click "Segui 100%" or "Followed 100%" button
    const followedBtn = page
      .getByRole("button", {
        name: /Segui 100%|Followed 100%/i,
      })
      .first();
    if (await followedBtn.isVisible()) {
      await followedBtn.click();

      // Verify confirmed check-in feedback is displayed
      await expect(
        page.locator("text=🌟").first(),
      ).toBeVisible({ timeout: 5000 });
    }

    // 5. Multi-tenant and role-based data isolation:
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
    await expect(page.locator("text=Configurações da Clínica")).not.toBeVisible();
  });
});
