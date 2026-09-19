import { test, expect, type Page } from "@playwright/test";

/**
 * UI04 / UI08 — every professional screen at phone (375) and tablet (768)
 * widths, and at 1280 px with text-only zoom of 200% (root font-size), must
 * keep content and actions reachable without page-level horizontal scroll.
 * Wide tables may scroll inside their own container.
 */
const NUTRI = "dra.clara@demo.stormnutrition.com";
const PASSWORD = "Password123!";
const ROUTES = [
  "/#/dashboard",
  "/#/patients",
  "/#/patients/patient-ana-silva",
  "/#/calendar",
  "/#/diet-generator",
  "/#/metabolic-calculator",
  "/#/food-database",
  "/#/reports",
  "/#/email-admin",
  "/#/settings",
];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("language", "en"));
});

const login = async (page: Page) => {
  await page.goto("/#/login");
  await page.fill("#email", NUTRI);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
};

const pageOverflow = (page: Page) =>
  page.evaluate(() => {
    const doc = document.documentElement;
    const offenders: string[] = [];
    if (doc.scrollWidth > doc.clientWidth + 1) {
      for (const el of Array.from(document.querySelectorAll("body *"))) {
        const r = el.getBoundingClientRect();
        const parent = el.parentElement;
        const parentFits =
          !parent ||
          parent.getBoundingClientRect().right <= doc.clientWidth + 1;
        // the outermost element that overflows (its parent still fits)
        if (r.right > doc.clientWidth + 1 && r.width > 0 && parentFits) {
          offenders.push(
            `${el.tagName}.${String(el.className).slice(0, 80)} [${(el.textContent || "").trim().slice(0, 30)}]`,
          );
          if (offenders.length >= 3) break;
        }
      }
    }
    return { overflow: doc.scrollWidth - doc.clientWidth, offenders };
  });

const settle = async (page: Page) => {
  await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, {
    timeout: 15000,
  });
};

for (const width of [375, 768]) {
  test(`UI08: no horizontal page scroll at ${width}px (EN, longest labels)`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await login(page);
    const problems: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      await settle(page);
      const r = await pageOverflow(page);
      if (r.overflow > 0)
        problems.push(`${route} +${r.overflow}px ${r.offenders.join(" | ")}`);
    }
    expect(problems).toEqual([]);
  });
}

test("UI04: text-only zoom 200% at 1280px keeps pages without horizontal scroll", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page);
  const problems: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route);
    await settle(page);
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    const r = await pageOverflow(page);
    if (r.overflow > 0)
      problems.push(`${route} +${r.overflow}px ${r.offenders.join(" | ")}`);
  }
  expect(problems).toEqual([]);
});
