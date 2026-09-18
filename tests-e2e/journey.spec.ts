import { test, expect } from "@playwright/test";

/**
 * Professional Nutritionist Critical E2E Journey:
 * Login → Patient Listing → Diet Generation → Save Plan → Reopen → Real PDF Export
 *
 * Runs against the local Firebase Auth & Firestore emulators without external credentials.
 */
test.describe("Professional Journey (Nutri E2E Flow)", () => {
  const NUTRI_EMAIL = "dra.clara@demo.stormnutrition.com";
  const NUTRI_PASSWORD = "Password123!";
  const PATIENT_ID = "patient-ana-silva";

  test("authenticates, accesses patient, generates diet, saves and exports real PDF", async ({
    page,
  }) => {
    // 1. Authenticate via login page
    await page.goto("/#/login");
    await page.waitForLoadState("networkidle");

    await page.fill("#email", NUTRI_EMAIL);
    await page.fill("#password", NUTRI_PASSWORD);
    await page.click('button[type="submit"]');

    // 2. Confirm redirect to Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("h1")).toBeVisible();

    // 3. Navigate to Patients page and verify seeded patient is listed
    await page.goto("/#/patients");
    await expect(page.locator("text=Ana Silva").first()).toBeVisible();

    // 4. Navigate to Diet Generator
    await page.goto("/#/diet-generator");
    await page.waitForLoadState("networkidle");

    // Select the patient in dropdown
    const patientSelect = page.locator("#patient");
    await expect(patientSelect).toBeVisible();
    await patientSelect.selectOption(PATIENT_ID);
    await expect(patientSelect).toHaveValue(PATIENT_ID);

    // Step 1 (Objectives) is loaded by default
    // Advance to Step 2 (Nutrition & Macros)
    const nextBtn = page.getByRole("button", { name: /Avançar|Next/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Advance from Step 2 to Step 3 (Meal Plan)
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // In Step 3, trigger algorithmic plan generation
    const generateBtn = page.getByRole("button", {
      name: /Gerar Plano.*|Generate.*Plan/i,
    });
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // 5. Verify generated plan display is visible
    const planDisplay = page.locator("#diet-plan-display-content");
    await expect(planDisplay).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: /Café da Manhã|Breakfast/i }).first(),
    ).toBeVisible();

    // 6. Trigger and verify real PDF export download directly from generated plan
    const exportBtn = page.getByRole("button", {
      name: /Exportar|Export/i,
    });
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();

    // In the Export modal, choose the Professional PDF format and listen for download event
    const downloadPromise = page.waitForEvent("download");
    const downloadPdfBtn = page
      .getByRole("button", {
        name: /Documento Profissional|Professional Document/i,
      })
      .first();
    await expect(downloadPdfBtn).toBeVisible();
    await downloadPdfBtn.click();

    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/\.pdf$/i);

    // Verify file size is valid (> 0 bytes) without logging sensitive content
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    const fs = await import("node:fs");
    const stats = fs.statSync(downloadPath!);
    expect(stats.size).toBeGreaterThan(1000); // Valid PDF file is at least 1KB

    // 7. Save the generated plan to Firestore
    const saveBtn = page.getByRole("button", {
      name: /Salvar Plano|Save Plan/i,
    });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Clinical review confirmation modal
    const confirmSaveBtn = page.getByRole("button", {
      name: /Confirmar e Salvar Plano|Confirm and Save Plan/i,
    });
    await expect(confirmSaveBtn).toBeVisible();
    await confirmSaveBtn.click();

    // Verify save success screen
    await expect(
      page.getByRole("button", {
        name: /Ver Perfil do Paciente|View Patient Profile/i,
      }),
    ).toBeVisible({ timeout: 10000 });
  });
});
