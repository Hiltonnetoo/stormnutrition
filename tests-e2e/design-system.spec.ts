import { test, expect, type Page } from "@playwright/test";

/**
 * Design-system checks (seção 3, UI01–UI10), against the emulators with the
 * synthetic seed. Computed styles are read from the real bundle, so they
 * prove the cascade (component layer vs utilities) and the tokens, not just
 * the class names in the markup.
 */
const NUTRI = "dra.clara@demo.stormnutrition.com";
const PATIENT = "ana.silva@demo.stormnutrition.com";
const PASSWORD = "Password123!";

const login = async (page: Page, email: string) => {
  await page.goto("/#/login");
  await page.fill("#email", email);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("language", "pt"));
});

test("UI01/UI02 — variant gallery: sizes, utilities, states and contrast", async ({
  page,
}) => {
  await page.goto("/#/login");
  await expect(page.locator("h1").first()).toBeVisible();

  const result = await page.evaluate(() => {
    const host = document.createElement("div");
    host.style.width = "220px";
    host.innerHTML = `
      <button id="p-sm" class="btn btn-primary btn-sm">A</button>
      <button id="p-md" class="btn btn-primary">A</button>
      <button id="p-lg" class="btn btn-primary btn-lg">A</button>
      <button id="lg-p" class="btn btn-lg btn-primary">A</button>
      <button id="s-lg" class="btn btn-secondary btn-lg">A</button>
      <button id="g-sm" class="btn btn-ghost btn-sm">A</button>
      <button id="d-md" class="btn btn-danger">A</button>
      <button id="util" class="btn btn-primary px-6">A</button>
      <button id="icon" class="btn btn-ghost btn-icon"><svg width="20" height="20"></svg></button>
      <button id="load" class="btn btn-primary" aria-busy="true" disabled>A</button>
      <button id="dis" class="btn btn-primary" disabled>A</button>
      <span id="disabled-token" class="bg-slate-100 text-slate-400 border border-slate-200"></span>
      <button id="long" class="btn btn-secondary">Texto de ação muito longo que precisa quebrar dentro do contêiner</button>
      <input id="in" class="input-field pl-11" />
      <input id="in-err" class="input-field" aria-invalid="true" />
      ${["success", "warning", "danger", "info", "neutral", "brand"]
        .map((t) => `<span id="b-${t}" class="badge badge-${t}">Estado</span>`)
        .join("")}`;
    document.body.appendChild(host);

    // Palette tones are oklch(); let the browser convert any color to sRGB.
    const ctx = document.createElement("canvas").getContext("2d")!;
    const parse = (c: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
    };
    const lum = (rgb: number[]) => {
      const [r, g, b] = rgb.map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (fg: string, bg: string) => {
      const [a, b] = [lum(parse(fg)), lum(parse(bg))].sort((x, y) => y - x);
      return Math.round(((a + 0.05) / (b + 0.05)) * 100) / 100;
    };
    const cs = (id: string) => getComputedStyle(document.getElementById(id)!);
    const geo = (id: string) => {
      const s = cs(id);
      return {
        padding: `${s.paddingTop} ${s.paddingLeft}`,
        font: s.fontSize,
        radius: s.borderTopLeftRadius,
      };
    };
    const long = document.getElementById("long")!;
    const out = {
      sm: geo("p-sm"),
      md: geo("p-md"),
      lg: geo("p-lg"),
      lgReversedOrder: geo("lg-p"),
      secondaryLg: geo("s-lg"),
      ghostSm: geo("g-sm"),
      dangerMd: geo("d-md"),
      utilityPaddingLeft: cs("util").paddingLeft,
      icon: { w: cs("icon").width, h: cs("icon").height },
      loading: geo("load"),
      disabledGeometry: geo("dis"),
      disabledStyles: ["load", "dis"].map((id) => ({
        opacity: cs(id).opacity,
        cursor: cs(id).cursor,
        background: cs(id).backgroundColor,
        color: cs(id).color,
        border: cs(id).borderTopColor,
      })),
      disabledTokens: {
        background: cs("disabled-token").backgroundColor,
        color: cs("disabled-token").color,
        border: cs("disabled-token").borderTopColor,
      },
      longOverflows: long.scrollWidth > long.clientWidth + 1,
      inputPaddingLeft: cs("in").paddingLeft,
      inputErrorBorder: cs("in-err").borderTopColor,
      inputBorder: cs("in").borderTopColor,
      contrast: {
        primary: contrast(cs("p-md").color, cs("p-md").backgroundColor),
        danger: contrast(cs("d-md").color, cs("d-md").backgroundColor),
        ...Object.fromEntries(
          ["success", "warning", "danger", "info", "neutral", "brand"].map(
            (t) => [
              `badge-${t}`,
              contrast(cs(`b-${t}`).color, cs(`b-${t}`).backgroundColor),
            ],
          ),
        ),
      },
    };
    host.remove();
    return out;
  });

  // Size is never undone by the variant, whatever the class order.
  expect(result.sm).toEqual({
    padding: "8px 14px",
    font: "14px",
    radius: "8px",
  });
  expect(result.md).toEqual({
    padding: "10px 20px",
    font: "14px",
    radius: "12px",
  });
  expect(result.lg).toEqual({
    padding: "14px 28px",
    font: "16px",
    radius: "16px",
  });
  expect(result.lgReversedOrder).toEqual(result.lg);
  expect(result.secondaryLg).toEqual(result.lg);
  expect(result.ghostSm).toEqual(result.sm);
  expect(result.dangerMd).toEqual(result.md);
  // Utilities override components without "!".
  expect(result.utilityPaddingLeft).toBe("24px");
  expect(result.inputPaddingLeft).toBe("44px");
  // States.
  expect(result.icon).toEqual({ w: "40px", h: "40px" });
  expect(result.disabledGeometry).toEqual(result.md);
  for (const style of result.disabledStyles) {
    expect(style).toEqual({
      ...result.disabledTokens,
      opacity: "1",
      cursor: "not-allowed",
    });
  }
  // Loading keeps the geometry (no layout shift) and reads as unavailable.
  expect(result.loading).toEqual(result.md);
  expect(result.longOverflows).toBe(false);
  expect(result.inputErrorBorder).not.toBe(result.inputBorder);
  // Rendered contrast (WCAG AA, normal text ≥ 4.5:1).
  for (const [name, ratio] of Object.entries(result.contrast)) {
    expect(ratio, `contrast of ${name}`).toBeGreaterThanOrEqual(4.5);
  }
});

test("UI05/UI09 — template name dialog and plan status badges", async ({
  page,
}) => {
  test.setTimeout(60000);
  await login(page, NUTRI);
  await expect(page).toHaveURL(/dashboard/);
  await page.goto("/#/diet-generator");
  await page.locator("#patient").selectOption("patient-ana-silva");
  // Phones and desktop share the "Etapa X de Y" vocabulary (UI09).
  await expect(
    page.getByRole("navigation", { name: /progresso/i }),
  ).toBeVisible();
  const next = page.getByRole("button", { name: /^Próximo/ });
  await next.click();
  await next.click();
  await page.getByRole("button", { name: /Gerar Plano/i }).click();
  await expect(page.locator("#diet-plan-display-content")).toBeVisible({
    timeout: 15000,
  });
  await expect(
    page
      .locator("#diet-plan-display-content .badge")
      .filter({ hasText: /Dentro das metas|Requer revisão clínica|Inviável/ })
      .first(),
  ).toBeVisible();

  // window.prompt is gone: a labelled dialog with validation replaces it.
  let nativeDialog = false;
  page.on("dialog", () => (nativeDialog = true));
  await page.getByRole("button", { name: "Salvar como modelo" }).click();
  const dialog = page.getByRole("dialog", { name: "Salvar como modelo" });
  await expect(dialog).toBeVisible();
  const name = dialog.getByLabel("Nome do modelo");
  await expect(name).toBeFocused();
  await expect(name).toHaveValue(/Modelo /);
  await name.fill("   ");
  await dialog.getByRole("button", { name: "Salvar como modelo" }).click();
  await expect(
    dialog.getByText("Informe um nome para o modelo."),
  ).toBeVisible();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("Modelo sintético E2E");
  await dialog.getByRole("button", { name: "Salvar como modelo" }).click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Modelo salvo" }),
  ).toBeVisible();
  expect(nativeDialog).toBe(false);
});

test("UI06/UI08 — no-results state, calendar and food table on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await login(page, NUTRI);
  await expect(page).toHaveURL(/dashboard/);

  // UI06: "no results" is its own state, with a way out.
  await page.goto("/#/patients");
  await page.getByPlaceholder(/Buscar por nome/).fill("zzzz-sem-resultado");
  await expect(
    page.getByRole("heading", {
      name: /Nenhum resultado para “zzzz-sem-resultado”/,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar busca e filtros" }).click();
  await expect(
    page.getByText("Ana Silva").filter({ visible: true }).first(),
  ).toBeVisible();

  // UI08: macros visible on phones although their columns are hidden.
  await page.goto("/#/food-database");
  await expect(page.locator("tbody tr").first()).toBeVisible();
  await expect(
    page
      .locator("tbody tr")
      .first()
      .getByText(/Proteína/),
  ).toBeVisible();

  // UI08: month cells show a count, the day list carries the details.
  await page.goto("/#/calendar");
  const today = page.locator('button[aria-current="date"]');
  await expect(today).toBeVisible();
  const chipsVisible = await page
    .locator(
      'button[aria-label^="Editar consulta"], button[aria-label^="Edit appointment"]',
    )
    .evaluateAll(
      (els) => els.filter((e) => (e as HTMLElement).offsetParent).length,
    );
  expect(chipsVisible).toBe(0);
  await today.click();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("UI07/UI10 — portal uses the shell's brand and no looping motion", async ({
  page,
}) => {
  await login(page, PATIENT);
  await expect(page).toHaveURL(/paciente/);
  const header = page.locator("header").first();
  await expect(header).toBeVisible();
  const headerInfo = await header.evaluate((el) => ({
    text: el.textContent ?? "",
    gradient: getComputedStyle(el).backgroundImage,
    logo: !!el.querySelector("svg"),
  }));
  expect(headerInfo.text).not.toMatch(
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
  );
  expect(headerInfo.gradient).toBe("none");
  expect(headerInfo.logo).toBe(true);
});

test("UI10 — dashboard settles without infinite animations", async ({
  page,
}) => {
  await login(page, NUTRI);
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, {
    timeout: 15000,
  });
  const infinite = await page.evaluate(() =>
    document
      .getAnimations()
      .filter(
        (a) =>
          a.playState === "running" &&
          a.effect?.getTiming().iterations === Infinity,
      )
      .map((a) => {
        const t = (a.effect as KeyframeEffect | null)?.target as Element | null;
        return `${(a as CSSAnimation).animationName ?? "?"} on ${t?.className ?? "?"}`;
      }),
  );
  expect(infinite).toEqual([]);
});
