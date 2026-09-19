import i18next from "i18next";
import { brazilianFoods } from "../data/foods";
import {
  getNovaGroup,
  getFoodName,
  foodContainsGluten,
  foodContainsLactose,
  foodContainsDairy,
  foodIsVegetarian,
  foodIsVegan,
  evaluateFoodRestriction,
} from "./foodService";
import {
  buildUnifiedClinicalContext,
  evaluateFoodCompatibility,
  matchFoodAllergen,
} from "./clinicalScreeningService";
import {
  classifyMealArchetype,
  isFoodSuitableForArchetype,
  MEAL_ARCHETYPES,
} from "./mealArchetypeService";
import {
  clampPortion,
  formatHouseholdMeasure,
  getPortionBoundaries,
} from "./portionLimitsService";
import type {
  CalculatedDietTotals,
  Food,
  Meal,
  MealOption,
  MealOptionItem,
  DietMode,
  DietPlanStatus,
  ClinicalTag,
  DecisionEntry,
  Micronutrients,
  PlanValidationResult,
  PlanValidationStatus,
  PlanValidationIssue,
  ValidateDietPlanOptions,
  WorstCaseAlternativeTotals,
} from "../types";
import type { DietType } from "./metabolicCalculations";

export class InfeasiblePlanError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    code = "PLAN_INFEASIBLE",
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "InfeasiblePlanError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Hash a string into a 32-bit positive integer seed.
 */
export function hashStringToSeed(str: string): number {
  let hash = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return hash >>> 0;
}

/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32).
 * Produces reproducible floats in [0, 1) given a 32-bit seed.
 */
export function createPrng(seed: number | string): () => number {
  let s = typeof seed === "string" ? hashStringToSeed(seed) : seed >>> 0;
  if (s === 0) s = 1;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Input parameters for the algorithmic diet generator.
 */
export interface GenerationParams {
  nutritionalTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  mealPlanConfig: {
    dietType: DietType;
    meals: Array<{ name: string; time: string; caloriePercentage: number }>;
  };
  restrictions?: string[];
  foodAllergies?: string | string[];
  mode?: DietMode;
  clinicalTags?: ClinicalTag[];
  seed?: number | string;
  datasetVersion?: string;
  availableFoodsCatalog?: Food[];
}

/**
 * Result returned by the algorithmic diet generator.
 */
export interface GenerationResult {
  meals: Meal[];
  decisionLog: DecisionEntry[];
  validation: PlanValidationResult;
  status: DietPlanStatus;
  metadata: {
    algorithmVersion: string;
    datasetVersion: string;
    seed: number;
    generatedAt: string;
  };
  calculatedTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
  };
}

// --- ALGORITHM CONFIGURATIONS ---

const dietTemplates: Record<
  DietType,
  { P: string[]; C: string[]; F: string[]; avoid?: string[] }
> = {
  traditional: {
    P: ["Carnes e Derivados", "Leguminosas", "Leite e Derivados"],
    C: ["Cereais e Derivados", "Verduras e Legumes", "Frutas"],
    F: ["Oleaginosas", "Óleos e Gorduras"],
  },
  low_carb: {
    P: ["Carnes e Derivados", "Leite e Derivados", "Oleaginosas"],
    C: ["Verduras e Legumes"],
    F: ["Óleos e Gorduras", "Oleaginosas"],
    avoid: ["Cereais e Derivados", "Açúcares e Doces"],
  },
  diabetic: {
    P: ["Carnes e Derivados", "Leguminosas"],
    C: ["Cereais e Derivados", "Verduras e Legumes"],
    F: ["Oleaginosas", "Óleos e Gorduras"],
    avoid: ["Açúcares e Doces"],
  },
  vegetarian: {
    P: ["Leguminosas", "Leite e Derivados", "Oleaginosas"],
    C: ["Cereais e Derivados", "Frutas", "Verduras e Legumes"],
    F: ["Oleaginosas", "Óleos e Gorduras"],
    avoid: ["Carnes e Derivados"],
  },
  high_protein: {
    P: ["Carnes e Derivados", "Leite e Derivados", "Leguminosas"],
    C: ["Verduras e Legumes", "Cereais e Derivados"],
    F: ["Oleaginosas", "Óleos e Gorduras"],
  },
};

/**
 * Strict domain validator for generation inputs.
 */
export function validateGenerationParams(params: GenerationParams): void {
  const { nutritionalTargets, mealPlanConfig } = params;
  if (!nutritionalTargets || typeof nutritionalTargets !== "object") {
    throw new InfeasiblePlanError(
      "Metas nutricionais ausentes ou inválidas.",
      "INVALID_INPUT",
    );
  }

  const { calories, protein, carbs, fat } = nutritionalTargets;
  if (!Number.isFinite(calories) || calories <= 0) {
    throw new InfeasiblePlanError(
      "A meta calórica diária deve ser um número finito positivo.",
      "INVALID_CALORIES",
    );
  }
  if (
    !Number.isFinite(protein) ||
    protein < 0 ||
    !Number.isFinite(carbs) ||
    carbs < 0 ||
    !Number.isFinite(fat) ||
    fat < 0
  ) {
    throw new InfeasiblePlanError(
      "Os macronutrientes prescritos devem ser números finitos não-negativos.",
      "INVALID_MACROS",
    );
  }

  if (
    !mealPlanConfig ||
    !Array.isArray(mealPlanConfig.meals) ||
    mealPlanConfig.meals.length === 0
  ) {
    throw new InfeasiblePlanError(
      "A configuração do plano alimentar deve conter ao menos uma refeição.",
      "EMPTY_MEALS",
    );
  }

  const totalPercentage = mealPlanConfig.meals.reduce(
    (sum, m) => sum + (Number(m.caloriePercentage) || 0),
    0,
  );
  if (totalPercentage < 95 || totalPercentage > 105) {
    throw new InfeasiblePlanError(
      `A soma dos percentuais calóricos das refeições deve ser aproximadamente 100% (soma atual: ${totalPercentage}%).`,
      "INVALID_MEAL_PERCENTAGES",
      { totalPercentage },
    );
  }

  for (const m of mealPlanConfig.meals) {
    if (!m.name || typeof m.name !== "string" || !m.name.trim()) {
      throw new InfeasiblePlanError(
        "Toda refeição configurada deve possuir um nome válido.",
        "INVALID_MEAL_NAME",
      );
    }
    if (!Number.isFinite(m.caloriePercentage) || m.caloriePercentage <= 0) {
      throw new InfeasiblePlanError(
        `O percentual calórico da refeição "${m.name}" deve ser maior que zero.`,
        "INVALID_MEAL_PERCENT",
        { mealName: m.name },
      );
    }
  }
}

/**
 * Validates an existing or newly generated diet plan against targets, tolerances,
 * restrictions and clinical constraints across all meals and alternative combinations.
 */
/**
 * Validates an existing or newly generated diet plan against targets, tolerances,
 * restrictions and clinical constraints across all meals and alternative combinations.
 */
/* R06 — review identity. A stable hash of everything a clinical review is
   about: meal content, targets, restrictions, clinical tags, mode, catalog
   version, tolerances and each alert with its level and parameters. Two
   versions that differ in any of these get different signatures, so an
   approval can never be carried over to content it did not see. */
const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
        .map((k) => [k, canonicalize((value as Record<string, unknown>)[k])]),
    );
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value * 100) / 100;
  }
  return value;
};

const fnv1a = (text: string, seed: number): string => {
  let hash = seed >>> 0;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
};

export const computeReviewSignature = (input: {
  meals: Meal[];
  targets: { calories: number; protein: number; carbs: number; fat: number };
  issues: PlanValidationIssue[];
  options?: ValidateDietPlanOptions;
}): string => {
  const payload = JSON.stringify(
    canonicalize({
      meals: input.meals,
      targets: input.targets,
      restrictions: [...(input.options?.restrictions ?? [])].sort(),
      clinicalTags: [...(input.options?.clinicalTags ?? [])].sort(),
      mode: input.options?.mode ?? null,
      catalogVersion: input.options?.catalogVersion ?? null,
      tolerances: input.options?.tolerances ?? null,
      issues: input.issues
        .map((i) => ({
          code: i.code,
          level: i.level,
          details: i.details ?? null,
        }))
        .sort((a, b) =>
          JSON.stringify(canonicalize(a)).localeCompare(
            JSON.stringify(canonicalize(b)),
          ),
        ),
    }),
  );
  return `v2_${input.issues.length}_${fnv1a(payload, 0x811c9dc5)}${fnv1a(payload, 0x01000193)}`;
};

export function validateDietPlan(
  meals: Meal[],
  targets: { calories: number; protein: number; carbs: number; fat: number },
  options?: ValidateDietPlanOptions,
): PlanValidationResult & { calculatedTotals: CalculatedDietTotals } {
  const issues: PlanValidationIssue[] = [];

  // Target validity check (finite, positive)
  if (
    !Number.isFinite(targets.calories) ||
    targets.calories <= 0 ||
    !Number.isFinite(targets.protein) ||
    targets.protein < 0 ||
    !Number.isFinite(targets.carbs) ||
    targets.carbs < 0 ||
    !Number.isFinite(targets.fat) ||
    targets.fat < 0
  ) {
    issues.push({
      level: "error",
      code: "INVALID_TARGET_VALUE",
      message:
        "Metas nutricionais prescritas contêm valores não numéricos, negativos ou inválidos.",
      details: { targets },
    });
  }

  const catalog = options?.availableFoodsCatalog || brazilianFoods;
  const catalogVersion = options?.catalogVersion;

  const findFoodInCatalog = (item: MealOptionItem): Food | undefined => {
    if (item.foodId) {
      const byId = catalog.find((f) => f.id === item.foodId);
      if (byId) return byId;
    }
    if (item.name) {
      const normName = item.name.trim().toLowerCase();
      return catalog.find(
        (f) =>
          f.name.toLowerCase() === normName ||
          (f.nameEn && f.nameEn.toLowerCase() === normName),
      );
    }
    return undefined;
  };

  const calculatedTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
  };

  let worstCaseAlternativeSodium = 0;
  let minCombinatorialCalories = 0;
  let maxCombinatorialCalories = 0;
  let minCombinatorialProtein = 0;
  let maxCombinatorialProtein = 0;
  let minCombinatorialCarbs = 0;
  let maxCombinatorialCarbs = 0;
  let minCombinatorialFat = 0;
  let maxCombinatorialFat = 0;

  for (const meal of meals) {
    calculatedTotals.calories += meal.mainOption.calories || 0;
    calculatedTotals.protein += meal.mainOption.protein || 0;
    calculatedTotals.carbs += meal.mainOption.carbs || 0;
    calculatedTotals.fat += meal.mainOption.fat || 0;
    calculatedTotals.fiber += meal.mainOption.micros?.fiber || 0;
    calculatedTotals.sodium += meal.mainOption.micros?.sodium || 0;

    const allOptions: MealOption[] = [
      meal.mainOption,
      ...(meal.alternatives || []),
    ];

    // Combinatorial tracking per meal
    const optionCalList = allOptions.map((opt) => opt.calories || 0);
    const optionProtList = allOptions.map((opt) => opt.protein || 0);
    const optionCarbsList = allOptions.map((opt) => opt.carbs || 0);
    const optionFatList = allOptions.map((opt) => opt.fat || 0);
    const optionSodList = allOptions.map((opt) => opt.micros?.sodium || 0);

    minCombinatorialCalories += Math.min(...optionCalList);
    maxCombinatorialCalories += Math.max(...optionCalList);
    minCombinatorialProtein += Math.min(...optionProtList);
    maxCombinatorialProtein += Math.max(...optionProtList);
    minCombinatorialCarbs += Math.min(...optionCarbsList);
    maxCombinatorialCarbs += Math.max(...optionCarbsList);
    minCombinatorialFat += Math.min(...optionFatList);
    maxCombinatorialFat += Math.max(...optionFatList);

    worstCaseAlternativeSodium += Math.max(...optionSodList);

    // Alternative options variance against main option (R07: +/- 5% margin for macros and calories)
    if (meal.alternatives && meal.alternatives.length > 0) {
      for (const alt of meal.alternatives) {
        const checkDev = (
          nutrient: "calories" | "protein" | "carbs" | "fat",
          codeStr: string,
          nutrientName: string,
          mainVal: number,
          altVal: number,
        ) => {
          if (mainVal > 0) {
            const diff = altVal - mainVal;
            const pct = Math.round((diff / mainVal) * 100);
            if (Math.abs(pct) > 5) {
              issues.push({
                level: "warning",
                code: codeStr,
                message: `Opção alternativa "${alt.name}" varia ${pct}% em ${nutrientName} em relação à principal na refeição "${meal.mealName}" (${altVal} vs ${mainVal}).`,
                details: {
                  mealName: meal.mealName,
                  alternativeName: alt.name,
                  nutrient,
                  mainValue: mainVal,
                  alternativeValue: altVal,
                  percentDiff: pct,
                  percent: pct,
                },
              });
            }
          } else if (altVal > 0) {
            if (
              (nutrient === "calories" && altVal > 10) ||
              (nutrient !== "calories" && altVal > 1)
            ) {
              issues.push({
                level: "warning",
                code: codeStr,
                message: `Opção alternativa "${alt.name}" possui ${altVal} de ${nutrientName} mas a opção principal possui 0 na refeição "${meal.mealName}".`,
                details: {
                  mealName: meal.mealName,
                  alternativeName: alt.name,
                  nutrient,
                  mainValue: mainVal,
                  alternativeValue: altVal,
                  percentDiff: 100,
                  percent: 100,
                },
              });
            }
          }
        };

        checkDev(
          "calories",
          "ALTERNATIVE_CALORIE_DEVIATION",
          "calorias",
          meal.mainOption.calories || 0,
          alt.calories || 0,
        );
        checkDev(
          "protein",
          "ALTERNATIVE_MACRO_DEVIATION",
          "proteína",
          meal.mainOption.protein || 0,
          alt.protein || 0,
        );
        checkDev(
          "carbs",
          "ALTERNATIVE_MACRO_DEVIATION",
          "carboidratos",
          meal.mainOption.carbs || 0,
          alt.carbs || 0,
        );
        checkDev(
          "fat",
          "ALTERNATIVE_MACRO_DEVIATION",
          "gorduras",
          meal.mainOption.fat || 0,
          alt.fat || 0,
        );
      }
    }

    // Validate all items in main option and all alternatives
    for (const opt of allOptions) {
      for (const item of opt.items || []) {
        // Finitude and non-negative values validation
        const numFields = [
          { name: "portionGrams", val: item.portionGrams },
          { name: "calories", val: item.calories },
          { name: "protein", val: item.protein },
          { name: "carbs", val: item.carbs },
          { name: "fat", val: item.fat },
        ];
        for (const f of numFields) {
          if (f.val !== undefined && (!Number.isFinite(f.val) || f.val < 0)) {
            issues.push({
              level: "error",
              code: "INVALID_NUTRIENT_VALUE",
              message: `Valor inválido para o campo "${f.name}" no alimento "${item.name}" da refeição "${meal.mealName}".`,
              details: {
                field: f.name,
                value: f.val,
                foodName: item.name,
                mealName: meal.mealName,
              },
            });
          }
        }

        const itemFood = findFoodInCatalog(item);
        if (!itemFood) {
          // Unknown food item in the active catalog: requires professional review
          issues.push({
            level: "warning",
            code: "UNKNOWN_FOOD_ITEM",
            message: `Alimento "${item.name}" na refeição "${meal.mealName}" não foi localizado no catálogo ativo de alimentos.`,
            details: {
              ...(item.foodId ? { foodId: item.foodId } : {}),
              foodName: item.name,
              mealName: meal.mealName,
              ...(catalogVersion ? { catalogVersion } : {}),
            },
          });

          // If restrictions are active, an uncataloged food cannot be verified
          if (options?.restrictions && options.restrictions.length > 0) {
            issues.push({
              level: "warning",
              code: "UNVERIFIED_RESTRICTION",
              message: `Não foi possível verificar as restrições (${options.restrictions.join(", ")}) para o alimento desconhecido "${item.name}" na refeição "${meal.mealName}".`,
              details: {
                ...(item.foodId ? { foodId: item.foodId } : {}),
                foodName: item.name,
                mealName: meal.mealName,
                restrictions: options.restrictions.join(", "),
                unverifiedRestrictions: options.restrictions,
              },
            });
          }
          continue;
        }

        // Food found: evaluate unified clinical compatibility (allergies, restrictions, clinical tags)
        const unifiedContext = buildUnifiedClinicalContext({
          restrictions: options?.restrictions,
          clinicalTags: options?.clinicalTags,
          foodAllergies: options?.foodAllergies,
          mode: options?.mode,
        });

        const compat = evaluateFoodCompatibility(itemFood, unifiedContext);
        const resolvedFoodId = item.foodId || itemFood.id;
        if (compat.status === "incompatible") {
          issues.push({
            level: "error",
            code: compat.code || "RESTRICTION_VIOLATION",
            message: `Alimento "${item.name}" na refeição "${meal.mealName}" viola diretriz clínica: ${compat.reason || "incompatível"}.`,
            details: {
              ...(resolvedFoodId ? { foodId: resolvedFoodId } : {}),
              foodName: item.name,
              mealName: meal.mealName,
              restriction: compat.matchedConstraint,
              reason: compat.reason,
              source: compat.source,
            },
          });
        }

        // Check unverified restrictions
        if (options?.restrictions && options.restrictions.length > 0) {
          for (const r of options.restrictions) {
            const evalResult = evaluateFoodRestriction(itemFood, r);
            if (evalResult.status === "unknown") {
              issues.push({
                level: "warning",
                code: "UNVERIFIED_RESTRICTION",
                message: `Restrição "${r}" para o alimento "${item.name}" na refeição "${meal.mealName}" requer verificação manual (${evalResult.reason || "dados insuficientes"}).`,
                details: {
                  ...(resolvedFoodId ? { foodId: resolvedFoodId } : {}),
                  foodName: item.name,
                  mealName: meal.mealName,
                  restrictions: r,
                  unverifiedRestrictions: [r],
                  ...(evalResult.reason ? { reason: evalResult.reason } : {}),
                  source: evalResult.source,
                },
              });
            }
          }
        }
      }
    }
  }

  calculatedTotals.calories = Math.round(calculatedTotals.calories);
  calculatedTotals.protein = parseFloat(calculatedTotals.protein.toFixed(1));
  calculatedTotals.carbs = parseFloat(calculatedTotals.carbs.toFixed(1));
  calculatedTotals.fat = parseFloat(calculatedTotals.fat.toFixed(1));
  calculatedTotals.fiber = parseFloat(calculatedTotals.fiber.toFixed(1));
  calculatedTotals.sodium = Math.round(calculatedTotals.sodium);
  worstCaseAlternativeSodium = Math.round(worstCaseAlternativeSodium);
  minCombinatorialCalories = Math.round(minCombinatorialCalories);
  maxCombinatorialCalories = Math.round(maxCombinatorialCalories);

  const worstCaseAlternativeTotals: WorstCaseAlternativeTotals = {
    minCalories: minCombinatorialCalories,
    maxCalories: maxCombinatorialCalories,
    worstCaseSodium: worstCaseAlternativeSodium,
  };

  const caloriesDiff = calculatedTotals.calories - targets.calories;
  const caloriesPercent =
    targets.calories > 0 ? (caloriesDiff / targets.calories) * 100 : 0;
  const proteinDiff = calculatedTotals.protein - targets.protein;
  const proteinPercent =
    targets.protein > 0 ? (proteinDiff / targets.protein) * 100 : 0;
  const carbsDiff = calculatedTotals.carbs - targets.carbs;
  const carbsPercent =
    targets.carbs > 0 ? (carbsDiff / targets.carbs) * 100 : 0;
  const fatDiff = calculatedTotals.fat - targets.fat;
  const fatPercent = targets.fat > 0 ? (fatDiff / targets.fat) * 100 : 0;

  const deviations = {
    caloriesDiff,
    caloriesPercent: parseFloat(caloriesPercent.toFixed(1)),
    proteinDiff: parseFloat(proteinDiff.toFixed(1)),
    proteinPercent: parseFloat(proteinPercent.toFixed(1)),
    carbsDiff: parseFloat(carbsDiff.toFixed(1)),
    carbsPercent: parseFloat(carbsPercent.toFixed(1)),
    fatDiff: parseFloat(fatDiff.toFixed(1)),
    fatPercent: parseFloat(fatPercent.toFixed(1)),
  };

  const tolerances = {
    caloriePercent: options?.tolerances?.caloriePercent ?? 15,
    proteinPercent: options?.tolerances?.proteinPercent ?? 20,
    carbsPercent: options?.tolerances?.carbsPercent ?? 20,
    fatPercent: options?.tolerances?.fatPercent ?? 20,
  };

  // Warnings for all 4 macronutrient deviations
  if (Math.abs(caloriesPercent) > tolerances.caloriePercent) {
    issues.push({
      level: "warning",
      code: "CALORIE_DEVIATION",
      message: `Variação calórica de ${deviations.caloriesPercent}% em relação à meta prescrita (${targets.calories} kcal vs ${calculatedTotals.calories} kcal).`,
      details: {
        target: targets.calories,
        actual: calculatedTotals.calories,
        percent: deviations.caloriesPercent,
        diff: deviations.caloriesDiff,
      },
    });
  }

  if (Math.abs(proteinPercent) > tolerances.proteinPercent) {
    issues.push({
      level: "warning",
      code: "PROTEIN_DEVIATION",
      message: `Variação de proteína de ${deviations.proteinPercent}% em relação à meta (${targets.protein}g vs ${calculatedTotals.protein}g).`,
      details: {
        target: targets.protein,
        actual: calculatedTotals.protein,
        percent: deviations.proteinPercent,
        diff: deviations.proteinDiff,
      },
    });
  }

  if (Math.abs(carbsPercent) > tolerances.carbsPercent) {
    issues.push({
      level: "warning",
      code: "CARBS_DEVIATION",
      message: `Variação de carboidratos de ${deviations.carbsPercent}% em relação à meta (${targets.carbs}g vs ${calculatedTotals.carbs}g).`,
      details: {
        target: targets.carbs,
        actual: calculatedTotals.carbs,
        percent: deviations.carbsPercent,
        diff: deviations.carbsDiff,
      },
    });
  }

  if (Math.abs(fatPercent) > tolerances.fatPercent) {
    issues.push({
      level: "warning",
      code: "FAT_DEVIATION",
      message: `Variação de gorduras de ${deviations.fatPercent}% em relação à meta (${targets.fat}g vs ${calculatedTotals.fat}g).`,
      details: {
        target: targets.fat,
        actual: calculatedTotals.fat,
        percent: deviations.fatPercent,
        diff: deviations.fatDiff,
      },
    });
  }

  // Combinatorial daily calories deviation check across alternatives
  if (targets.calories > 0) {
    const maxCalVarPct =
      ((maxCombinatorialCalories - targets.calories) / targets.calories) * 100;
    const minCalVarPct =
      ((minCombinatorialCalories - targets.calories) / targets.calories) * 100;
    if (
      maxCalVarPct > tolerances.caloriePercent ||
      minCalVarPct < -tolerances.caloriePercent
    ) {
      issues.push({
        level: "warning",
        code: "WORST_CASE_ALTERNATIVE_DEVIATION",
        message: `A combinação de alternativas varia o consumo diário entre ${minCombinatorialCalories} kcal e ${maxCombinatorialCalories} kcal (meta: ${targets.calories} kcal).`,
        details: {
          minCalories: minCombinatorialCalories,
          maxCalories: maxCombinatorialCalories,
          targetCalories: targets.calories,
        },
      });
    }
  }

  const checkCombMacro = (
    nutrient: string,
    target: number,
    minVal: number,
    maxVal: number,
    code: string,
    tolerance: number,
    zeroTargetCode: string,
  ) => {
    // R07: a zero target has no percentage tolerance. Any amount of the
    // macro in some combination is flagged for professional review; no
    // absolute limit is invented.
    if (target === 0) {
      if (maxVal > 0) {
        issues.push({
          level: "warning",
          code: zeroTargetCode,
          message: `A meta diária de ${nutrient} é 0 g, mas o plano chega a ${Math.round(maxVal * 10) / 10}g em alguma combinação; revise manualmente.`,
          details: { max: Math.round(maxVal * 10) / 10 },
        });
      }
      return;
    }
    if (target > 0) {
      const maxPct = ((maxVal - target) / target) * 100;
      const minPct = ((minVal - target) / target) * 100;
      if (maxPct > tolerance || minPct < -tolerance) {
        issues.push({
          level: "warning",
          code,
          message: `A combinação de alternativas varia o consumo diário de ${nutrient} entre ${Math.round(minVal)}g e ${Math.round(maxVal)}g (meta: ${Math.round(target)}g).`,
          details: {
            min: Math.round(minVal),
            max: Math.round(maxVal),
            target: Math.round(target),
          },
        });
      }
    }
  };

  checkCombMacro(
    "proteína",
    targets.protein,
    minCombinatorialProtein,
    maxCombinatorialProtein,
    "WORST_CASE_PROTEIN_DEVIATION",
    tolerances.proteinPercent,
    "ZERO_TARGET_PROTEIN",
  );
  checkCombMacro(
    "carboidratos",
    targets.carbs,
    minCombinatorialCarbs,
    maxCombinatorialCarbs,
    "WORST_CASE_CARBS_DEVIATION",
    tolerances.carbsPercent,
    "ZERO_TARGET_CARBS",
  );
  checkCombMacro(
    "gorduras",
    targets.fat,
    minCombinatorialFat,
    maxCombinatorialFat,
    "WORST_CASE_FAT_DEVIATION",
    tolerances.fatPercent,
    "ZERO_TARGET_FAT",
  );

  // Clinical sodium ceilings across all alternatives
  if (
    options?.clinicalTags?.includes("hypertension") &&
    worstCaseAlternativeSodium > 2000
  ) {
    issues.push({
      level: "warning",
      code: "HIGH_SODIUM_CEILING_HYPERTENSION",
      message: `Pior cenário de sódio nas combinações de alternativas atinge ${worstCaseAlternativeSodium}mg (limite: 2000mg).`,
      details: { worstCaseAlternativeSodium, limit: 2000 },
    });
  }

  if (
    options?.clinicalTags?.includes("renal_ckd") &&
    worstCaseAlternativeSodium > 1500
  ) {
    issues.push({
      level: "warning",
      code: "HIGH_SODIUM_CEILING_RENAL",
      message: `Pior cenário de sódio nas combinações de alternativas atinge ${worstCaseAlternativeSodium}mg para paciente renal (limite: 1500mg).`,
      details: { worstCaseAlternativeSodium, limit: 1500 },
    });
  }

  let status: PlanValidationStatus = "valid";
  if (issues.some((i) => i.level === "error")) {
    status = "infeasible";
  } else if (issues.some((i) => i.level === "warning")) {
    status = "requires_review";
  }

  // Infeasible plans can NEVER be approved.
  // Requires review can be approved ONLY if allowApprovedReview is explicitly provided.
  let isApproved = false;
  let approvedByUid: string | undefined;
  let approvedAt: string | undefined;

  const issuesSignature = computeReviewSignature({
    meals,
    targets,
    issues,
    options,
  });

  const isStructurallyValid = status === "valid";

  // Passo P0: Eliminar aprovação automática do validador sintético.
  // A aprovação clínica é ato privativo do profissional humano (exige allowApprovedReview + reviewedSignature).
  if (
    options?.allowApprovedReview &&
    (status === "valid" || status === "requires_review")
  ) {
    if (
      options.reviewedSignature &&
      options.reviewedSignature === issuesSignature
    ) {
      isApproved = true;
      approvedByUid = options.approvedByUid;
      approvedAt = new Date().toISOString();
    }
  }

  const result: PlanValidationResult & {
    calculatedTotals: CalculatedDietTotals;
  } = {
    status,
    isApproved,
    isStructurallyValid,
    issues,
    issuesSignature,
    deviations,
    calculatedTotals,
  };

  if (approvedByUid) result.approvedByUid = approvedByUid;
  if (approvedAt) result.approvedAt = approvedAt;
  if (worstCaseAlternativeSodium !== undefined) {
    result.worstCaseAlternativeSodium = worstCaseAlternativeSodium;
  }
  if (worstCaseAlternativeTotals) {
    result.worstCaseAlternativeTotals = worstCaseAlternativeTotals;
  }

  return result;
}

// --- MAIN GENERATION LOGIC ---

/**
 * Generates a complete dietary plan based on the patient's nutritional targets,
 * applying progressive exclusion filters and deterministic reproducibility.
 */
export const generateAlgorithmicDietPlan = (
  params: GenerationParams,
): GenerationResult => {
  validateGenerationParams(params);

  const {
    nutritionalTargets,
    mealPlanConfig,
    restrictions = [],
    foodAllergies,
    mode = "general",
    clinicalTags = [],
    seed,
    datasetVersion = "2026.1",
    availableFoodsCatalog = brazilianFoods,
  } = params;

  const unifiedContext = buildUnifiedClinicalContext({
    restrictions,
    clinicalTags,
    foodAllergies,
    mode,
  });

  const actualSeed =
    typeof seed === "number"
      ? seed >>> 0
      : typeof seed === "string"
        ? hashStringToSeed(seed)
        : Math.floor(Math.random() * 2147483647) >>> 0;

  const rng = createPrng(actualSeed);
  const template =
    dietTemplates[mealPlanConfig.dietType] || dietTemplates.traditional;
  const decisionLog: DecisionEntry[] = [];

  let availableFoods = availableFoodsCatalog.filter(
    (food) => !template.avoid?.includes(food.category),
  );

  const applyExclusion = (
    keep: (f: Food) => boolean,
    code: string,
    reason: string,
    tag: string,
    paramsPayload?: Record<string, unknown>,
  ) => {
    const removed = availableFoods.filter((f) => !keep(f));
    if (removed.length === 0) return;
    availableFoods = availableFoods.filter(keep);
    const entry: DecisionEntry = {
      code,
      type: "filter",
      reason,
      affectedCount: removed.length,
      removedFoods: removed.map(getFoodName),
      tag,
    };
    if (paramsPayload) {
      entry.params = paramsPayload;
    }
    decisionLog.push(entry);
  };

  if (template.avoid && template.avoid.length > 0) {
    const removedByDietType = availableFoodsCatalog.filter((f) =>
      template.avoid?.includes(f.category),
    );
    decisionLog.push({
      code: "RESTRICT_DIET_TYPE",
      type: "filter",
      reason: i18next.t("diet.log_restrict_categories", {
        categories: template.avoid.join(", "),
        defaultValue: `Restringindo categorias por tipo de dieta: ${template.avoid.join(", ")}`,
      }),
      affectedCount: removedByDietType.length,
      removedFoods: removedByDietType.map(getFoodName),
      tag: mealPlanConfig.dietType,
      params: { categories: template.avoid },
    });
  }

  // --- ULTRA-PROCESSED EXCLUSION (NOVA 4) ---
  applyExclusion(
    (f) => getNovaGroup(f) !== 4,
    "EXCLUDE_ULTRAPROCESSED",
    i18next.t(
      "diet.log_exclude_ultraprocessed",
      "Excluindo ultraprocessados (NOVA 4) do plano",
    ),
    "nova",
  );

  // --- FOOD ALLERGIES LOGIC ---
  if (unifiedContext.foodAllergies && unifiedContext.foodAllergies.length > 0) {
    for (const allergy of unifiedContext.foodAllergies) {
      applyExclusion(
        (f) => !matchFoodAllergen(f, allergy).matches,
        "EXCLUDE_ALLERGEN",
        i18next.t("diet.log_remove_allergen", {
          allergen: allergy,
          defaultValue: `Removendo alimentos com potencial alergênico (${allergy})`,
        }),
        "food_allergy",
        { allergen: allergy },
      );
    }
  }

  // --- RESTRICTION LOGIC ---
  if (unifiedContext.restrictions.includes("gluten_free")) {
    applyExclusion(
      (f) => !foodContainsGluten(f),
      "EXCLUDE_GLUTEN",
      i18next.t(
        "diet.log_remove_gluten",
        "Removendo alimentos com glúten (Restrição: Sem Glúten)",
      ),
      "gluten_free",
    );
  }

  if (unifiedContext.restrictions.includes("lactose_free")) {
    applyExclusion(
      (f) => !foodContainsLactose(f),
      "EXCLUDE_LACTOSE",
      i18next.t(
        "diet.log_remove_lactose",
        "Removendo alimentos com lactose (Restrição: Sem Lactose)",
      ),
      "lactose_free",
    );
  }

  if (unifiedContext.restrictions.includes("dairy_free")) {
    applyExclusion(
      (f) => !foodContainsDairy(f),
      "EXCLUDE_DAIRY",
      i18next.t(
        "diet.log_remove_dairy",
        "Removendo leite e derivados (Restrição: Sem Laticínios / APLV)",
      ),
      "dairy_free",
    );
  }

  if (unifiedContext.restrictions.includes("vegetarian")) {
    applyExclusion(
      (f) => foodIsVegetarian(f),
      "EXCLUDE_MEAT",
      i18next.t(
        "diet.log_remove_meat",
        "Removendo carnes e pescados (Dieta Vegetariana)",
      ),
      "vegetarian",
    );
  }

  if (unifiedContext.restrictions.includes("vegan")) {
    applyExclusion(
      (f) => foodIsVegan(f),
      "EXCLUDE_ANIMAL_PRODUCTS",
      i18next.t(
        "diet.log_remove_animal_products",
        "Removendo derivados de origem animal (Dieta Vegana)",
      ),
      "vegan",
    );
  }

  // --- MODE LOGIC ---
  if (unifiedContext.mode === "clinical") {
    applyExclusion(
      (f) => f.sodium < 600,
      "LIMIT_SODIUM_CLINICAL",
      i18next.t(
        "diet.log_clinical_mode",
        "Limpando banco para Modo Clínico (Sódio < 600mg)",
      ),
      "clinical",
    );
  }

  if (unifiedContext.mode === "pediatric") {
    applyExclusion(
      (f) =>
        f.category !== "Bebidas" ||
        f.name.toLowerCase().includes("suco") ||
        f.name.toLowerCase().includes("água"),
      "RESTRICT_BEVERAGES_PEDIATRIC",
      i18next.t(
        "diet.log_pediatric_mode",
        "Modo Pediátrico: Restringindo bebidas estimulantes/alcoólicas",
      ),
      "pediatric",
    );
  }

  // --- CLINICAL TAGS LOGIC ---
  if (
    unifiedContext.clinicalTags.includes("hypertension") ||
    unifiedContext.restrictions.includes("hypertension")
  ) {
    applyExclusion(
      (f) => f.sodium < 300,
      "LIMIT_SODIUM_HYPERTENSION",
      i18next.t(
        "diet.log_hypertension",
        "Meta Rigorosa de Sódio para Hipertensão (< 300mg)",
      ),
      "hypertension",
    );
  }

  if (
    unifiedContext.clinicalTags.includes("diabetes_t1") ||
    unifiedContext.clinicalTags.includes("diabetes_t2") ||
    unifiedContext.restrictions.includes("diabetes")
  ) {
    applyExclusion(
      (f) =>
        f.category !== "Açúcares e Doces" && f.category !== "Industrializados",
      "EXCLUDE_SUGARS_DIABETES",
      i18next.t(
        "diet.log_diabetes_sugars",
        "Controle Glicêmico: Removendo açúcares refinados",
      ),
      "diabetes",
    );
    applyExclusion(
      (f) => f.glycemicIndex == null || f.glycemicIndex < 70,
      "LIMIT_GI_DIABETES",
      i18next.t(
        "diet.log_diabetes_gi",
        "Controle Glicêmico: Priorizando baixo/médio IG (removendo IG alto ≥ 70)",
      ),
      "diabetes_gi",
    );
  }

  if (
    unifiedContext.clinicalTags.includes("renal_ckd") ||
    unifiedContext.restrictions.includes("renal")
  ) {
    applyExclusion(
      (f) => f.sodium < 200,
      "LIMIT_SODIUM_RENAL",
      i18next.t(
        "diet.log_renal",
        "Proteção Renal: Sódio ultra-baixo (< 200mg)",
      ),
      "renal_ckd",
    );
  }

  if (
    unifiedContext.clinicalTags.includes("hepatic_steatosis") ||
    unifiedContext.restrictions.includes("hepatic")
  ) {
    applyExclusion(
      (f) =>
        f.category !== "Óleos e Gorduras" ||
        f.name.toLowerCase().includes("azeite"),
      "RESTRICT_SATURATED_FATS_HEPATIC",
      i18next.t(
        "diet.log_hepatic",
        "Esteatose Hepática: Restringindo gorduras saturadas/óleos",
      ),
      "hepatic_steatosis",
    );
  }

  // Safety net: filter any remaining clinical incompatibilities
  applyExclusion(
    (f) => evaluateFoodCompatibility(f, unifiedContext).status !== "incompatible",
    "EXCLUDE_CLINICALLY_INCOMPATIBLE",
    i18next.t(
      "diet.log_exclude_incompatible",
      "Excluindo alimentos incompatíveis com o perfil clínico e alergias do paciente",
    ),
    "clinical_screening",
  );

  const totalMealPercentage = mealPlanConfig.meals.reduce(
    (sum, m) => sum + (Number(m.caloriePercentage) || 0),
    0,
  );

  const generatedMeals: Meal[] = [];

  for (const mealConfig of mealPlanConfig.meals) {
    const normalizedPercentage =
      (mealConfig.caloriePercentage / totalMealPercentage) * 100;
    const factor = normalizedPercentage / 100;
    const mealTargetCalories = nutritionalTargets.calories * factor;
    const mealProtein = nutritionalTargets.protein * factor;
    const mealCarbs = nutritionalTargets.carbs * factor;
    const mealFat = nutritionalTargets.fat * factor;

    const archetype = classifyMealArchetype(mealConfig.name, mealConfig.time);
    const archDef = MEAL_ARCHETYPES[archetype];

    const selectFoodForRole = (
      role: "P" | "C" | "F",
      categories: string[],
      excludeFoodIds: string[] = [],
    ): Food => {
      const slot = archDef.slots.find((s) => s.role === role);
      const preferred = slot
        ? slot.preferredCategories.filter((c) => categories.includes(c))
        : [];

      // 1. Preferred categories for this archetype slot + suitable for archetype + not excluded
      if (preferred.length > 0) {
        const prefCandidates = availableFoods.filter(
          (f) =>
            preferred.includes(f.category) &&
            isFoodSuitableForArchetype(f, archetype) &&
            !excludeFoodIds.includes(f.id),
        );
        if (prefCandidates.length > 0) {
          const idx = Math.floor(rng() * prefCandidates.length);
          return prefCandidates[idx];
        }
      }

      // 2. Categories in template + suitable for archetype + not excluded
      let candidates = availableFoods.filter(
        (f) =>
          categories.includes(f.category) &&
          isFoodSuitableForArchetype(f, archetype) &&
          !excludeFoodIds.includes(f.id),
      );
      if (candidates.length === 0) {
        // 3. Categories in template + suitable for archetype
        candidates = availableFoods.filter(
          (f) =>
            categories.includes(f.category) &&
            isFoodSuitableForArchetype(f, archetype),
        );
      }
      if (candidates.length === 0) {
        // 4. Fallback to any food in template categories (for small/custom catalogs)
        candidates = availableFoods.filter((f) => categories.includes(f.category));
      }
      if (candidates.length === 0) {
        const roleName =
          role === "P" ? "Proteínas" : role === "C" ? "Carboidratos" : "Gorduras";
        throw new InfeasiblePlanError(
          `Catálogo esgotado: nenhum alimento compatível para ${roleName} (${categories.join(", ")}) na refeição "${mealConfig.name}" após aplicar as restrições selecionadas.`,
          "CATALOG_EXHAUSTED",
          { role, categories, mealName: mealConfig.name, restrictions, clinicalTags, mode },
        );
      }
      const idx = Math.floor(rng() * candidates.length);
      return candidates[idx];
    };

    const calculateStats = (food: Food, portionGrams: number) => {
      const portionSize = Number(food.portion) || 100;
      const f = portionSize > 0 ? portionGrams / portionSize : 0;
      const realMicros: Micronutrients = {};
      if (food.fiber != null && Number.isFinite(food.fiber)) {
        realMicros.fiber = parseFloat((food.fiber * f).toFixed(1));
      }
      if (food.sodium != null && Number.isFinite(food.sodium)) {
        realMicros.sodium = Math.round(food.sodium * f);
      }
      if (food.micros?.iron != null && Number.isFinite(food.micros.iron)) {
        realMicros.iron = parseFloat((food.micros.iron * f).toFixed(1));
      }
      if (
        food.micros?.calcium != null &&
        Number.isFinite(food.micros.calcium)
      ) {
        realMicros.calcium = Math.round(food.micros.calcium * f);
      }
      if (
        food.micros?.vitaminC != null &&
        Number.isFinite(food.micros.vitaminC)
      ) {
        realMicros.vitaminC = Math.round(food.micros.vitaminC * f);
      }
      if (
        food.micros?.potassium != null &&
        Number.isFinite(food.micros.potassium)
      ) {
        realMicros.potassium = Math.round(food.micros.potassium * f);
      }
      if (
        food.micros?.magnesium != null &&
        Number.isFinite(food.micros.magnesium)
      ) {
        realMicros.magnesium = Math.round(food.micros.magnesium * f);
      }
      if (food.micros?.zinc != null && Number.isFinite(food.micros.zinc)) {
        realMicros.zinc = parseFloat((food.micros.zinc * f).toFixed(1));
      }

      return {
        calories: Math.round(food.calories * f),
        protein: parseFloat((food.protein * f).toFixed(1)),
        carbs: parseFloat((food.carbs * f).toFixed(1)),
        fat: parseFloat((food.fat * f).toFixed(1)),
        ...(Object.keys(realMicros).length > 0 ? { micros: realMicros } : {}),
      };
    };

    const getWarnings = (
      food: Food,
      stats: ReturnType<typeof calculateStats>,
    ): string[] => {
      const warnings: string[] = [];
      if (
        clinicalTags.includes("hypertension") &&
        (stats.micros?.sodium ?? 0) > 400
      )
        warnings.push(i18next.t("diet.warn_high_sodium", "Sódio elevado"));
      if (
        (clinicalTags.includes("diabetes_t1") ||
          clinicalTags.includes("diabetes_t2")) &&
        food.category === "Frutas" &&
        stats.carbs > 25
      )
        warnings.push(
          i18next.t("diet.warn_moderate_gi", "Carga glicêmica moderada"),
        );
      return warnings;
    };

    const createItem = (
      food: Food,
      portionGrams: number,
      stats: ReturnType<typeof calculateStats>,
    ): MealOptionItem => {
      const warnings = getWarnings(food, stats);
      const roundedGrams = Math.round(portionGrams);
      const item: MealOptionItem = {
        name: getFoodName(food),
        portion: formatHouseholdMeasure(food, roundedGrams),
        portionGrams: roundedGrams,
        unit: food.unit || "g",
        ...stats,
        ...(warnings.length > 0 ? { clinicalWarnings: warnings } : {}),
      };
      if (food.id) {
        item.foodId = food.id;
      }
      return item;
    };

    const solvePortions = (
      pFood: Food,
      cFood: Food,
      fFood: Food,
      targetCalories: number,
      targetP: number,
      targetC: number,
      targetF: number,
    ): { pPortion: number; cPortion: number; fPortion: number } => {
      let pGrams = pFood.protein > 0 ? (targetP / pFood.protein) * (Number(pFood.portion) || 100) : 100;
      let cGrams = cFood.carbs > 0 ? (targetC / cFood.carbs) * (Number(cFood.portion) || 100) : 100;
      let fGrams = fFood.fat > 0 ? (targetF / fFood.fat) * (Number(fFood.portion) || 100) : 15;

      pGrams = clampPortion(pFood, pGrams);
      cGrams = clampPortion(cFood, cGrams);
      fGrams = clampPortion(fFood, fGrams);

      const currentStats = (p: number, c: number, f: number) =>
        calculateStats(pFood, p).calories +
        calculateStats(cFood, c).calories +
        calculateStats(fFood, f).calories;

      for (let iter = 0; iter < 3; iter++) {
        const currentCals = currentStats(pGrams, cGrams, fGrams);
        const calGap = targetCalories - currentCals;
        if (Math.abs(calGap) <= 12) break;

        const cCalPerGram = Math.max(0.5, (cFood.calories || 100) / (Number(cFood.portion) || 100));
        const pCalPerGram = Math.max(0.5, (pFood.calories || 100) / (Number(pFood.portion) || 100));

        const nextC = clampPortion(cFood, cGrams + (calGap * 0.6) / cCalPerGram);
        const nextP = clampPortion(pFood, pGrams + (calGap * 0.4) / pCalPerGram);

        if (nextC === cGrams && nextP === pGrams) {
          const bC = getPortionBoundaries(cFood);
          const bP = getPortionBoundaries(pFood);
          if (calGap > 0) {
            if (cGrams < bC.maxGrams) {
              const addC = Math.min(bC.maxGrams - cGrams, Math.round(calGap / cCalPerGram));
              cGrams += addC;
            } else if (pGrams < bP.maxGrams) {
              const addP = Math.min(bP.maxGrams - pGrams, Math.round(calGap / pCalPerGram));
              pGrams += addP;
            }
          } else {
            if (cGrams > bC.minGrams) {
              const remC = Math.min(cGrams - bC.minGrams, Math.round(Math.abs(calGap) / cCalPerGram));
              cGrams -= remC;
            } else if (pGrams > bP.minGrams) {
              const remP = Math.min(pGrams - bP.minGrams, Math.round(Math.abs(calGap) / pCalPerGram));
              pGrams -= remP;
            }
          }
          break;
        }

        cGrams = nextC;
        pGrams = nextP;
      }

      return {
        pPortion: Math.round(pGrams),
        cPortion: Math.round(cGrams),
        fPortion: Math.round(fGrams),
      };
    };

    const buildOption = (
      pFood: Food,
      cFood: Food,
      fFood: Food,
      portions: { pPortion: number; cPortion: number; fPortion: number },
    ): MealOption => {
      const pS = calculateStats(pFood, portions.pPortion);
      const cS = calculateStats(cFood, portions.cPortion);
      const fS = calculateStats(fFood, portions.fPortion);

      const items: MealOptionItem[] = [
        createItem(pFood, portions.pPortion, pS),
        createItem(cFood, portions.cPortion, cS),
        createItem(fFood, portions.fPortion, fS),
      ];

      const andStr = i18next.t("diet.and", "e");

      const optionMicros: Micronutrients = {
        fiber: parseFloat(
          (
            (pS.micros?.fiber ?? 0) +
            (cS.micros?.fiber ?? 0) +
            (fS.micros?.fiber ?? 0)
          ).toFixed(1),
        ),
        sodium:
          (pS.micros?.sodium ?? 0) +
          (cS.micros?.sodium ?? 0) +
          (fS.micros?.sodium ?? 0),
      };

      if (
        pS.micros?.iron != null ||
        cS.micros?.iron != null ||
        fS.micros?.iron != null
      ) {
        optionMicros.iron = parseFloat(
          (
            (pS.micros?.iron ?? 0) +
            (cS.micros?.iron ?? 0) +
            (fS.micros?.iron ?? 0)
          ).toFixed(1),
        );
      }

      if (
        pS.micros?.calcium != null ||
        cS.micros?.calcium != null ||
        fS.micros?.calcium != null
      ) {
        optionMicros.calcium =
          (pS.micros?.calcium ?? 0) +
          (cS.micros?.calcium ?? 0) +
          (fS.micros?.calcium ?? 0);
      }

      if (
        pS.micros?.vitaminC != null ||
        cS.micros?.vitaminC != null ||
        fS.micros?.vitaminC != null
      ) {
        optionMicros.vitaminC =
          (pS.micros?.vitaminC ?? 0) +
          (cS.micros?.vitaminC ?? 0) +
          (fS.micros?.vitaminC ?? 0);
      }

      const householdP = formatHouseholdMeasure(pFood, portions.pPortion);
      const householdC = formatHouseholdMeasure(cFood, portions.cPortion);
      const householdF = formatHouseholdMeasure(fFood, portions.fPortion);

      const prepDesc =
        (i18next.language === "en"
          ? archDef.defaultPreparationDesc.en
          : archDef.defaultPreparationDesc.pt) ||
        archDef.defaultPreparationDesc.pt;

      return {
        name: `${getFoodName(pFood)}, ${getFoodName(cFood)} ${andStr} ${getFoodName(fFood)}`,
        portion: `${householdP}, ${householdC} ${andStr} ${householdF}`,
        calories: pS.calories + cS.calories + fS.calories,
        protein: parseFloat((pS.protein + cS.protein + fS.protein).toFixed(1)),
        carbs: parseFloat((pS.carbs + cS.carbs + fS.carbs).toFixed(1)),
        fat: parseFloat((pS.fat + cS.fat + fS.fat).toFixed(1)),
        items,
        details: prepDesc,
        micros: optionMicros,
      };
    };

    // Main option selection and joint sizing
    const proteinSource = selectFoodForRole("P", template.P);
    const carbSource = selectFoodForRole("C", template.C);
    const fatSource = selectFoodForRole("F", template.F);

    const mainPortions = solvePortions(
      proteinSource,
      carbSource,
      fatSource,
      mealTargetCalories,
      mealProtein,
      mealCarbs,
      mealFat,
    );

    const main = buildOption(proteinSource, carbSource, fatSource, mainPortions);

    // Alternatives generation with functional substitution and auto-correction loop
    const createAlternative = (
      usedPIds: string[],
      usedCIds: string[],
      usedFIds: string[],
    ): MealOption => {
      let bestOption: MealOption | null = null;
      let minDivergence = Infinity;

      const currentUsedP = [...usedPIds];
      const currentUsedC = [...usedCIds];
      const currentUsedF = [...usedFIds];

      for (let attempt = 0; attempt < 3; attempt++) {
        const altProtein = selectFoodForRole("P", template.P, currentUsedP);
        const altCarb = selectFoodForRole("C", template.C, currentUsedC);
        const altFat = selectFoodForRole("F", template.F, currentUsedF);

        let altPortions = solvePortions(
          altProtein,
          altCarb,
          altFat,
          main.calories,
          main.protein,
          main.carbs,
          main.fat,
        );

        let option = buildOption(altProtein, altCarb, altFat, altPortions);
        let divergence =
          Math.abs(option.calories - main.calories) / Math.max(1, main.calories);

        // Auto-correction loop: fine-tune scaling if divergence is noticeable
        if (divergence > 0.10 && option.calories > 0) {
          const scale = main.calories / option.calories;
          altPortions = {
            pPortion: clampPortion(altProtein, altPortions.pPortion * scale),
            cPortion: clampPortion(altCarb, altPortions.cPortion * scale),
            fPortion: clampPortion(altFat, altPortions.fPortion * scale),
          };
          option = buildOption(altProtein, altCarb, altFat, altPortions);
          divergence =
            Math.abs(option.calories - main.calories) / Math.max(1, main.calories);
        }

        if (divergence < minDivergence) {
          minDivergence = divergence;
          bestOption = option;
        }

        if (divergence <= 0.20) {
          return option;
        }

        currentUsedP.push(altProtein.id);
        currentUsedC.push(altCarb.id);
        currentUsedF.push(altFat.id);
      }

      return bestOption!;
    };

    const alt1 = createAlternative(
      [proteinSource.id],
      [carbSource.id],
      [fatSource.id],
    );
    const alt2 = createAlternative(
      [proteinSource.id, alt1.items?.[0]?.foodId || ""],
      [carbSource.id, alt1.items?.[1]?.foodId || ""],
      [fatSource.id, alt1.items?.[2]?.foodId || ""],
    );

    generatedMeals.push({
      mealName: mealConfig.name,
      time: mealConfig.time,
      calories: main.calories,
      protein: main.protein,
      carbs: main.carbs,
      fat: main.fat,
      micros: main.micros,
      mainOption: main,
      alternatives: [alt1, alt2],
    });
  }

  const validation = validateDietPlan(generatedMeals, nutritionalTargets, {
    restrictions: unifiedContext.restrictions,
    clinicalTags: unifiedContext.clinicalTags,
    foodAllergies: unifiedContext.foodAllergies,
    mode: unifiedContext.mode,
    availableFoodsCatalog,
    catalogVersion: datasetVersion,
  });

  let planStatus: DietPlanStatus = "draft";
  if (validation.status === "infeasible") {
    planStatus = "blocked";
  } else if (validation.status === "requires_review") {
    planStatus = "awaiting_review";
  } else {
    planStatus = "draft";
  }

  return {
    meals: generatedMeals,
    decisionLog,
    validation,
    status: planStatus,
    metadata: {
      algorithmVersion: "2026.1",
      datasetVersion,
      seed: actualSeed,
      generatedAt: new Date().toISOString(),
    },
    calculatedTotals: validation.calculatedTotals,
  };
};

export const getGeneralObservations = (): string[] => {
  return [
    i18next.t(
      "diet.obs_hydration",
      "Mantenha-se bem hidratado ao longo do dia.",
    ),
    i18next.t(
      "diet.obs_seasoning",
      "Prefira temperos naturais como alho, cebola, ervas e especiarias.",
    ),
    i18next.t(
      "diet.obs_sugary_drinks",
      "Evite o consumo de bebidas açucaradas, como refrigerantes e sucos industrializados.",
    ),
    i18next.t(
      "diet.obs_exercise",
      "Pratique atividade física regularmente, conforme orientação profissional.",
    ),
    i18next.t(
      "diet.obs_chewing",
      "Mastigue bem os alimentos e faça suas refeições em um ambiente tranquilo.",
    ),
  ];
};
