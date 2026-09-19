import { describe, it, expect, beforeAll } from "vitest";
import i18n from "../../i18n";
import {
  generateAlgorithmicDietPlan,
  type GenerationResult,
} from "../dietAlgorithmService";
import { brazilianFoods } from "../../data/foods";
import {
  formatAlternativeGroup,
  formatIssue,
  formatIssueSummary,
  groupValidationIssues,
} from "../../utils/validationPresentation";

/**
 * A7 — permanent audit of generated plans (o-que-precisa-ser-feito.md §0.4).
 * Every profile uses the restriction keys the patient form really stores.
 * Thresholds start at the measured baseline and are only ever tightened.
 */
const MEALS = [
  { name: "Café da Manhã", time: "07:00", caloriePercentage: 20 },
  { name: "Lanche da Manhã", time: "10:00", caloriePercentage: 10 },
  { name: "Almoço", time: "12:30", caloriePercentage: 30 },
  { name: "Lanche da Tarde", time: "16:00", caloriePercentage: 10 },
  { name: "Jantar", time: "19:30", caloriePercentage: 25 },
  { name: "Ceia", time: "22:00", caloriePercentage: 5 },
];
const TARGETS = { calories: 2000, protein: 120, carbs: 225, fat: 67 };
export const AUDIT_PROFILES: Record<string, Record<string, unknown>> = {
  geral: {},
  hiper_diab: {
    clinicalTags: ["hypertension", "diabetes_t2"],
    restrictions: ["hypertension", "diabetes"],
  },
  sem_lactose: { restrictions: ["lactose_free"] },
  aplv: { restrictions: ["dairy_free"] },
  vegano: { restrictions: ["vegan"] },
  vegetariano: { restrictions: ["vegetarian"] },
  sem_gluten: { restrictions: ["gluten_free"] },
  alergias: { foodAllergies: "amendoim, castanhas, camarão" },
  renal: { clinicalTags: ["renal_ckd"] },
};
const SEEDS = Array.from({ length: 20 }, (_, i) => i + 1);

interface AuditedPlan {
  profile: string;
  seed: number;
  result: GenerationResult;
}
let plans: AuditedPlan[] = [];

const category = (foodId?: string, name?: string) =>
  brazilianFoods.find((f) => f.id === foodId || f.name === name)?.category ??
  "";

beforeAll(async () => {
  await i18n.changeLanguage("pt");
  plans = [];
  for (const [profile, extra] of Object.entries(AUDIT_PROFILES)) {
    for (const seed of SEEDS) {
      plans.push({
        profile,
        seed,
        result: generateAlgorithmicDietPlan({
          nutritionalTargets: TARGETS,
          mealPlanConfig: { dietType: "traditional", meals: MEALS },
          seed,
          ...(extra as object),
        } as never),
      });
    }
  }
}, 120000);

const renderedLines = (r: GenerationResult, lng: string) => {
  const t = i18n.getFixedT(lng);
  const grouped = groupValidationIssues(r.validation.issues);
  return {
    grouped,
    lines: [
      formatIssueSummary(grouped, t),
      ...[
        ...grouped.blockers,
        ...grouped.daily,
        ...grouped.sodium,
        ...grouped.worstCase,
        ...grouped.other,
      ].map((i) => formatIssue(i, t, lng)),
      ...grouped.alternativesByMeal.flatMap((m) =>
        m.groups.map((g) => formatAlternativeGroup(g, t, lng)),
      ),
    ],
  };
};

describe("A7 — generator audit", () => {
  it("A1: rendered warnings have no placeholders, wrong language or dot decimals (PT)", () => {
    const problems: string[] = [];
    for (const p of plans) {
      for (const lng of ["pt", "en"]) {
        for (const line of renderedLines(p.result, lng).lines) {
          if (/\{\{|undefined|NaN/.test(line))
            problems.push(`${lng} placeholder: ${line}`);
          if (lng === "pt" && /\b(protein|carbs|fat|calories)\b/.test(line))
            problems.push(`pt english: ${line}`);
          if (lng === "pt" && /\d\.\d{1,2}(?!\d)/.test(line))
            problems.push(`pt decimal: ${line}`);
          if (
            lng === "en" &&
            /\b(proteína|carboidratos|gorduras|calorias)\b/.test(line)
          )
            problems.push(`en portuguese: ${line}`);
        }
      }
    }
    expect(problems.slice(0, 5)).toEqual([]);
  });

  it("A1: one line per alternative (deviations of the same alternative are merged)", () => {
    for (const p of plans) {
      const { grouped } = renderedLines(p.result, "pt");
      for (const meal of grouped.alternativesByMeal) {
        const keys = meal.groups.map((g) => g.index ?? g.items.join("+"));
        expect(new Set(keys).size).toBe(keys.length);
      }
    }
  });

  it("restrictions and allergies never leak into any option", () => {
    const leaks: string[] = [];
    const forbidden: Record<string, RegExp> = {
      aplv: /leite|queijo|iogurte|requeij|manteiga|creme de leite/i,
      vegano:
        /carne|frango|peixe|ovo|leite|queijo|iogurte|\bmel\b|manteiga|banha|atum|sardinha|lombo|peru|tilápia|salmão|patinho/i,
      vegetariano:
        /carne|frango|peixe|atum|sardinha|lombo|peru|tilápia|salmão|banha|patinho|linguiça/i,
      sem_gluten: /trigo|pão|macarr|biscoito|cevada|centeio/i,
      alergias: /amendoim|castanha|caju|nozes|amêndoa|camarão/i,
    };
    for (const p of plans) {
      const re = forbidden[p.profile];
      if (!re) continue;
      for (const m of p.result.meals)
        for (const o of [m.mainOption, ...(m.alternatives || [])])
          for (const it of o.items || [])
            if (re.test(it.name))
              leaks.push(`${p.profile}#${p.seed} ${m.mealName}: ${it.name}`);
    }
    expect(leaks.slice(0, 5)).toEqual([]);
  });

  it("A2: light meals and main meals only use foods typical for them", () => {
    const light = /Café|Lanche|Ceia/i;
    const main = /Almoço|Jantar/i;
    const bad: string[] = [];
    for (const p of plans) {
      for (const m of p.result.meals) {
        for (const o of [m.mainOption, ...(m.alternatives || [])]) {
          for (const it of o.items || []) {
            const cat = category(it.foodId, it.name);
            const n = it.name.toLowerCase();
            if (light.test(m.mealName)) {
              const meatNotAllowed =
                cat === "Carnes e Derivados" &&
                !/ovo|clara|gema|omelete|frango desfiado/.test(n);
              if (
                meatNotAllowed ||
                cat === "Leguminosas" ||
                /arroz|macarr|quinoa/.test(n)
              )
                bad.push(`${p.profile}#${p.seed} ${m.mealName}: ${it.name}`);
            }
            if (
              main.test(m.mealName) &&
              /\bpão|biscoito|bolacha|torrada|granola|cereal matinal/.test(n)
            )
              bad.push(`${p.profile}#${p.seed} ${m.mealName}: ${it.name}`);
          }
        }
      }
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it("A2: no food more than twice in the day's main options", () => {
    const over: string[] = [];
    for (const p of plans) {
      const count = new Map<string, number>();
      for (const m of p.result.meals)
        for (const it of m.mainOption.items || [])
          count.set(it.name, (count.get(it.name) ?? 0) + 1);
      for (const [name, n] of count)
        if (n > 2) over.push(`${p.profile}#${p.seed} ${name} ×${n}`);
    }
    expect(over.slice(0, 5)).toEqual([]);
  });

  it("A3: at least 95% of plans meet daily kcal (±10%) and macro (±20%) targets", () => {
    const off: string[] = [];
    // Vegan is excluded: the catalog has too few vegan protein sources for
    // light meals (catalog expansion is out of scope; see next test).
    const scored = plans.filter((p) => p.profile !== "vegano");
    for (const p of scored) {
      const tot = p.result.meals.reduce(
        (a, m) => ({
          kcal: a.kcal + m.mainOption.calories,
          p: a.p + m.mainOption.protein,
          c: a.c + m.mainOption.carbs,
          f: a.f + m.mainOption.fat,
        }),
        { kcal: 0, p: 0, c: 0, f: 0 },
      );
      const dev = {
        kcal: (tot.kcal - TARGETS.calories) / TARGETS.calories,
        p: (tot.p - TARGETS.protein) / TARGETS.protein,
        c: (tot.c - TARGETS.carbs) / TARGETS.carbs,
        f: (tot.f - TARGETS.fat) / TARGETS.fat,
      };
      if (
        Math.abs(dev.kcal) > 0.1 ||
        Math.abs(dev.p) > 0.2 ||
        Math.abs(dev.c) > 0.2 ||
        Math.abs(dev.f) > 0.2
      )
        off.push(
          `${p.profile}#${p.seed} kcal ${Math.round(dev.kcal * 100)}% p ${Math.round(dev.p * 100)}% c ${Math.round(dev.c * 100)}% f ${Math.round(dev.f * 100)}%`,
        );
    }
    expect(1 - off.length / scored.length).toBeGreaterThanOrEqual(0.95);
  });

  it("A3: when the catalog cannot reach the protein target (vegan), the plan says so", () => {
    for (const p of plans.filter((x) => x.profile === "vegano")) {
      const protein = p.result.meals.reduce(
        (a, m) => a + m.mainOption.protein,
        0,
      );
      if (protein < TARGETS.protein * 0.8) {
        expect(
          p.result.validation.issues.some(
            (i) => i.code === "PROTEIN_DEVIATION",
          ),
        ).toBe(true);
      }
    }
  });

  it("A4: every alternative stays within 20% of the main option's calories", () => {
    const off: string[] = [];
    for (const p of plans)
      for (const m of p.result.meals)
        for (const alt of m.alternatives || []) {
          const div =
            Math.abs(alt.calories - m.mainOption.calories) /
            Math.max(1, m.mainOption.calories);
          if (div > 0.2)
            off.push(
              `${p.profile}#${p.seed} ${m.mealName}: ${alt.calories} × ${m.mainOption.calories}`,
            );
        }
    expect(off.slice(0, 5)).toEqual([]);
  });

  it("A5: solids are never in ml and household measures agree with the grams", () => {
    const bad: string[] = [];
    const liquid =
      /leite(?! em pó)|suco|água|café|refrigerante|cerveja|vinho|azeite|óleo/i;
    for (const p of plans)
      for (const m of p.result.meals)
        for (const o of [m.mainOption, ...(m.alternatives || [])])
          for (const it of o.items || []) {
            if (/\dml/.test(it.portion) && !liquid.test(it.name))
              bad.push(`solid in ml: ${it.name} ${it.portion}`);
            if (
              /\b1 (colheres|unidades|fatias|copos|conchas)\b/.test(it.portion)
            )
              bad.push(`plural: ${it.portion}`);
            const food = brazilianFoods.find(
              (f) => f.id === it.foodId || f.name === it.name,
            );
            const ref = food && /\(([\d.]+)\s+([^)]+)\)/.exec(food.unit || "");
            const shown = /\((\d+)(?: e 1\/2)?\s+colher(?:es)? de sopa\)/.exec(
              it.portion,
            );
            if (food && ref && /colher de sopa/.test(ref[2]) && shown) {
              const expected =
                (Number(ref[1]) * (it.portionGrams ?? 0)) /
                Number(food.portion);
              const value =
                Number(shown[1]) + (/e 1\/2/.test(it.portion) ? 0.5 : 0);
              if (expected >= 1 && Math.abs(value - expected) / expected > 0.25)
                bad.push(`measure: ${it.name} ${it.portion}`);
            }
          }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it("warning volume stays under the ceiling set after A4", async () => {
    let warningLines = 0;
    let maxLines = 0;
    for (const p of plans) {
      const n = renderedLines(p.result, "pt").grouped.warningLines;
      warningLines += n;
      maxLines = Math.max(maxLines, n);
    }
    // Ceiling set after A4 (measured 19/09/2026: avg 5.3, max 13 lines;
    // before A1–A4: ~40 bullets per plan). Only ever lowered.
    expect(warningLines / plans.length).toBeLessThanOrEqual(8);
    expect(maxLines).toBeLessThanOrEqual(15);
    expect(category("1")).toBeTypeOf("string");
    let altCount = 0;
    for (const p of plans)
      for (const m of p.result.meals) altCount += (m.alternatives || []).length;
    (globalThis as { __auditMetrics?: unknown }).__auditMetrics = {
      avgWarningLines: warningLines / plans.length,
      maxLines,
      avgAlternativesPerMeal: altCount / (plans.length * MEALS.length),
    };
    const fs = (globalThis as { process?: { env?: Record<string, string> } })
      .process?.env?.AUDIT_METRICS_FILE;
    if (fs)
      (await import("node:fs")).writeFileSync(
        fs,
        JSON.stringify(
          (globalThis as { __auditMetrics?: unknown }).__auditMetrics,
        ),
      );
  });
});
