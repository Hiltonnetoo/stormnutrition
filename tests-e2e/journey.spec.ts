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
    test.setTimeout(120000);
    // 1. Authenticate via login page
    await page.goto("/#/login");
    await page.waitForLoadState("domcontentloaded");

    await page.fill("#email", NUTRI_EMAIL);
    await page.fill("#password", NUTRI_PASSWORD);
    await page.click('button[type="submit"]');

    // 2. Confirm redirect to Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("h1")).toBeVisible();

    // 3. Navigate to Patients page and verify seeded patient is listed
    await page.goto("/#/patients");
    await expect(page.locator("text=Ana Silva").first()).toBeVisible();

    // R08: record the patient's existing diet IDs, so the plan saved below is
    // identified by its own ID (never "the first card in the list").
    const dietIds = async () => {
      await page.goto(`/#/patients/${PATIENT_ID}`);
      await page
        .getByRole("tab", {
          name: /Diet History|Histórico de Dietas|Diets|Dietas/i,
        })
        .click();
      await page.waitForTimeout(500);
      return page
        .locator("[data-diet-id]")
        .evaluateAll((els) =>
          els.map((e) => e.getAttribute("data-diet-id") as string),
        );
    };
    const existingIds = new Set(await dietIds());

    // 4. Navigate to Diet Generator
    await page.goto("/#/diet-generator");
    await page.waitForLoadState("domcontentloaded");

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

    // 6. Save the generated plan to Firestore first (Passo C09.2)
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

    // 7. Navigate to Patient Profile from success screen
    const viewProfileBtn = page.getByRole("button", {
      name: /Ver Perfil do Paciente|View Patient Profile/i,
    });
    await expect(viewProfileBtn).toBeVisible({ timeout: 10000 });
    await viewProfileBtn.click();

    await expect(page).toHaveURL(new RegExp(`.*patients/${PATIENT_ID}`));

    // 8. Identify the saved plan by ID (R08-A)
    const idsAfterSave = await dietIds();
    const newIds = idsAfterSave.filter((id) => !existingIds.has(id));
    expect(newIds).toHaveLength(1);
    const dietId = newIds[0];
    const card = page.locator(`[data-diet-id="${dietId}"]`);

    // 9. Reopen that plan in the generator through the real Edit action
    await card.getByRole("button", { name: /Editar|Edit/i }).click();
    await expect(page).toHaveURL(/.*diet-generator/);
    const display = page.locator("#diet-plan-display-content");
    await expect(display).toBeVisible({ timeout: 15000 });
    // Identity is proven after saving: no new document appears and the same
    // ID reopens with the edited values (steps 12–13).

    // 10. Real manual edit: double the first portion of the first meal with
    // the portion field. Expected values come from what the screen showed
    // before the edit (independent of the app's recalculation code).
    const firstMeal = display.locator('[data-meal-index="0"]');
    const mealKcalText = async () =>
      Number(
        ((await firstMeal.locator("p").first().textContent()) || "").match(
          /(\d+)\s*kcal/,
        )![1],
      );
    const portionInput = firstMeal.getByRole("spinbutton").first();
    const row = portionInput.locator("xpath=ancestor::tr");
    const originalGrams = Number(await portionInput.inputValue());
    const originalItemKcal = Number(
      (await row.locator("td").nth(5).textContent())!.trim(),
    );
    const originalMealKcal = await mealKcalText();
    const newGrams = originalGrams * 2;
    await portionInput.fill(String(newGrams));
    await portionInput.press("Enter");

    const expectedItemKcal = originalItemKcal * 2;
    const expectedMealKcal = originalMealKcal + originalItemKcal;
    await expect(row.locator("td").nth(5)).toHaveText(String(expectedItemKcal));
    await expect.poll(mealKcalText).toBe(expectedMealKcal);
    await expect(
      page.getByText(/Edição manual|Manual edit/i).first(),
    ).toBeVisible();

    // 11. Save the edited plan (same ID) through the review dialog
    await page.getByRole("button", { name: /Salvar Plano|Save Plan/i }).click();
    await page
      .getByRole("button", {
        name: /Confirmar e Salvar Plano|Confirm and Save Plan/i,
      })
      .click();
    await expect(
      page.getByRole("button", {
        name: /Ver Perfil do Paciente|View Patient Profile/i,
      }),
    ).toBeVisible({ timeout: 10000 });

    // 12. Reload and reopen the SAME plan: edited values persisted
    const idsAfterEdit = await dietIds();
    expect(idsAfterEdit.filter((id) => !existingIds.has(id))).toEqual([dietId]);
    await page.reload();
    await page
      .getByRole("tab", {
        name: /Diet History|Histórico de Dietas|Diets|Dietas/i,
      })
      .click();
    await page
      .locator(`[data-diet-id="${dietId}"]`)
      .getByRole("button", { name: /Visualizar|View/i })
      .click();
    const viewerContent = page.locator("#diet-plan-viewer-content");
    await expect(viewerContent).toBeVisible({ timeout: 10000 });
    await expect(
      viewerContent.getByText(`${expectedMealKcal} kcal`).first(),
    ).toBeVisible();
    await expect(
      viewerContent.getByText(`${newGrams}g`, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      viewerContent
        .getByText(String(expectedItemKcal), { exact: true })
        .first(),
    ).toBeVisible();

    // 13. Export THIS plan (viewer header) and read the PDF content (R08-B)
    const downloadPromise = page.waitForEvent("download");
    await page
      .getByRole("button", { name: /Exportar|Export/i })
      .first()
      .click();
    await page
      .getByRole("button", {
        name: /Documento Profissional|Professional Document/i,
      })
      .first()
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^diet-.*\.pdf$/i);

    // 13. Verify file integrity and relevant content (Passo C09.3)
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    const fs = await import("node:fs");
    const stats = fs.statSync(downloadPath!);
    expect(stats.size).toBeGreaterThan(2000); // Valid generated PDF is > 2KB

    const pdfBuffer = fs.readFileSync(downloadPath!);
    // Valid PDF starts with %PDF- header
    expect(pdfBuffer.toString("ascii", 0, 5)).toBe("%PDF-");

    // Content verification: patient and the EDITED values (R08-B)
    const pdfContent = pdfBuffer.toString("binary");
    expect(pdfContent).toMatch(/Ana|Silva|Storm|Clara/i);
    expect(pdfContent).toContain(`${expectedMealKcal} kcal`);
  });
});
