import { test, expect } from "@playwright/test";

/**
 * Invitation Acceptance and Error Recovery E2E Flow (Passo C09):
 * 1. Access invalid token: display user-friendly error without white screen or unhandled exceptions.
 * 2. Access revoked token: display status revoked message.
 * 3. Access valid pending invitation: set password, activate account, navigate to /paciente with active portal.
 *
 * Runs against the local Firebase Auth & Firestore emulators (demo-storm).
 */
test.describe("Invitation Flow (E2E)", () => {
  test("displays friendly error message and recovery links for invalid invitation token", async ({
    page,
  }) => {
    // 1. Access route with nonexistent token
    await page.goto("/#/convite/token-invalido-123");
    await page.waitForLoadState("domcontentloaded");

    // 2. Alert must be rendered gracefully (no white screen)
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible({ timeout: 10000 });
    await expect(alert).toContainText(/não encontrado|inválido|not found/i);

    // 3. User can navigate away using friendly recovery links
    const loginLink = page.getByRole("link", {
      name: /Fazer login|Log in|Login/i,
    });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", "#/paciente");

    const homeLink = page.getByRole("link", {
      name: /Ir para página inicial|Home/i,
    });
    await expect(homeLink).toBeVisible();
  });

  test("displays friendly error message for revoked invitation token", async ({
    page,
  }) => {
    // 1. Access route with seeded revoked token
    await page.goto("/#/convite/inv-token-revoked");
    await page.waitForLoadState("domcontentloaded");

    // 2. Alert indicates revocation
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible({ timeout: 10000 });
    await expect(alert).toContainText(/cancelado|revogado|revoked/i);

    // 3. Recovery link to login is available
    const loginLink = page.getByRole("link", {
      name: /Fazer login|Log in|Login/i,
    });
    await expect(loginLink).toBeVisible();
  });

  test("accepts valid pending invitation, creates account, and reaches patient portal", async ({
    page,
  }) => {
    // 1. Access route with seeded valid pending invitation
    await page.goto("/#/convite/inv-token-demo-carlos");
    await page.waitForLoadState("domcontentloaded");

    // 2. Verify invitation details are loaded
    await expect(page.locator("#invite-email")).toHaveValue(
      "carlos.souza@demo.stormnutrition.com",
    );
    await expect(page.getByText(/Carlos Souza/i).first()).toBeVisible({
      timeout: 10000,
    });

    // 3. Enter password and confirmation
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(2);

    await passwordInputs.nth(0).fill("Password123!");
    await passwordInputs.nth(1).fill("Password123!");

    // 4. Click activation button
    const activateBtn = page.getByRole("button", {
      name: /Ativar meu acesso|Ativar conta|Activate/i,
    });
    await expect(activateBtn).toBeVisible();
    await activateBtn.click();

    // 5. Coordinated auth transition redirects to /paciente
    await expect(page).toHaveURL(/.*paciente/, { timeout: 15000 });

    // 6. Patient portal displays Carlos Souza's profile
    const patientHeading = page.getByRole("heading", {
      name: /Carlos Souza/i,
    });
    await expect(patientHeading).toBeVisible({ timeout: 15000 });
  });
});
