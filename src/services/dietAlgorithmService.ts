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
} from "./foodService";
import type {
  Food,
  Meal,
  MealOption,
  MealOptionItem,
  DietMode,
  ClinicalTag,
  DecisionEntry,
  Micronutrients,
  PlanValidationResult,
  PlanValidationStatus,
  PlanValidationIssue,
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
      );
    }
  }
}

/**
 * Validates an existing or newly generated diet plan against targets, tolerances,
 * restrictions and clinical constraints across all meals and alternative combinations.
 */
export function validateDietPlan(
  meals: Meal[],
  targets: { calories: number; protein: number; carbs: number; fat: number },
  options?: {
    restrictions?: string[];
    clinicalTags?: ClinicalTag[];
    mode?: DietMode;
  },
): PlanValidationResult {
  const issues: PlanValidationIssue[] = [];

  const calculatedTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
  };

  let worstCaseAlternativeSodium = 0;

  for (const meal of meals) {
    calculatedTotals.calories += meal.mainOption.calories || 0;
    calculatedTotals.protein += meal.mainOption.protein || 0;
    calculatedTotals.carbs += meal.mainOption.carbs || 0;
    calculatedTotals.fat += meal.mainOption.fat || 0;
    calculatedTotals.fiber += meal.mainOption.micros?.fiber || 0;
    calculatedTotals.sodium += meal.mainOption.micros?.sodium || 0;

    const mainSod = meal.mainOption.micros?.sodium || 0;
    const altSods = (meal.alternatives || []).map((a) => a.micros?.sodium || 0);
    worstCaseAlternativeSodium += Math.max(mainSod, ...altSods);

    // Validate restrictions on main option and all alternatives
    const allOptions: MealOption[] = [
      meal.mainOption,
      ...(meal.alternatives || []),
    ];
    for (const opt of allOptions) {
      for (const item of opt.items || []) {
        const itemFood = brazilianFoods.find(
          (f) => (item.foodId && f.id === item.foodId) || f.name === item.name,
        );
        if (!itemFood) continue;

        if (
          options?.restrictions?.includes("gluten_free") &&
          foodContainsGluten(itemFood)
        ) {
          issues.push({
            level: "error",
            code: "GLUTEN_VIOLATION",
            message: `Alimento "${item.name}" na refeição "${meal.mealName}" contém glúten.`,
            details: { foodId: item.foodId, foodName: item.name },
          });
        }
        if (
          options?.restrictions?.includes("lactose_free") &&
          foodContainsLactose(itemFood)
        ) {
          issues.push({
            level: "error",
            code: "LACTOSE_VIOLATION",
            message: `Alimento "${item.name}" na refeição "${meal.mealName}" contém lactose.`,
            details: { foodId: item.foodId, foodName: item.name },
          });
        }
        if (
          options?.restrictions?.includes("dairy_free") &&
          foodContainsDairy(itemFood)
        ) {
          issues.push({
            level: "error",
            code: "DAIRY_VIOLATION",
            message: `Alimento "${item.name}" na refeição "${meal.mealName}" contém laticínios/APLV.`,
            details: { foodId: item.foodId, foodName: item.name },
          });
        }
        if (
          options?.restrictions?.includes("vegetarian") &&
          !foodIsVegetarian(itemFood)
        ) {
          issues.push({
            level: "error",
            code: "VEGETARIAN_VIOLATION",
            message: `Alimento "${item.name}" na refeição "${meal.mealName}" contém carnes/pescados.`,
            details: { foodId: item.foodId, foodName: item.name },
          });
        }
        if (
          options?.restrictions?.includes("vegan") &&
          !foodIsVegan(itemFood)
        ) {
          issues.push({
            level: "error",
            code: "VEGAN_VIOLATION",
            message: `Alimento "${item.name}" na refeição "${meal.mealName}" contém derivados de origem animal.`,
            details: { foodId: item.foodId, foodName: item.name },
          });
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

  // Warnings for deviations
  if (Math.abs(caloriesPercent) > 15) {
    issues.push({
      level: "warning",
      code: "CALORIE_DEVIATION",
      message: `Variação calórica de ${deviations.caloriesPercent}% em relação à meta prescrita (${targets.calories} kcal vs ${calculatedTotals.calories} kcal).`,
      details: { target: targets.calories, actual: calculatedTotals.calories },
    });
  }

  if (Math.abs(proteinPercent) > 20) {
    issues.push({
      level: "warning",
      code: "PROTEIN_DEVIATION",
      message: `Variação de proteína de ${deviations.proteinPercent}% em relação à meta (${targets.protein}g vs ${calculatedTotals.protein}g).`,
      details: { target: targets.protein, actual: calculatedTotals.protein },
    });
  }

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

  return {
    status,
    isApproved: status === "valid",
    issues,
    calculatedTotals,
    deviations,
    worstCaseAlternativeSodium,
  };
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
    mode = "general",
    clinicalTags = [],
    seed,
    datasetVersion = "2026.1",
    availableFoodsCatalog = brazilianFoods,
  } = params;

  const actualSeed =
    typeof seed === "number"
      ? seed >>> 0
      : typeof seed === "string"
        ? hashStringToSeed(seed)
        : Math.floor(Math.random() * 2147483647) >>> 0;

  const rng = createPrng(actualSeed);
  const template = dietTemplates[mealPlanConfig.dietType];
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

  // --- RESTRICTION LOGIC ---
  if (restrictions.includes("gluten_free")) {
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

  if (restrictions.includes("lactose_free")) {
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

  if (restrictions.includes("dairy_free")) {
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

  if (restrictions.includes("vegetarian")) {
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

  if (restrictions.includes("vegan")) {
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
  if (mode === "clinical") {
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

  if (mode === "pediatric") {
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
  if (clinicalTags.includes("hypertension")) {
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
    clinicalTags.includes("diabetes_t1") ||
    clinicalTags.includes("diabetes_t2")
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

  if (clinicalTags.includes("renal_ckd")) {
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

  if (clinicalTags.includes("hepatic_steatosis")) {
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

  const getFoodFromCategories = (
    categories: string[],
    role: "P" | "C" | "F",
    mealName: string,
  ): Food => {
    const candidateFoods = availableFoods.filter((f) =>
      categories.includes(f.category),
    );
    if (candidateFoods.length === 0) {
      const roleName =
        role === "P" ? "Proteínas" : role === "C" ? "Carboidratos" : "Gorduras";
      throw new InfeasiblePlanError(
        `Catálogo esgotado: nenhum alimento compatível para ${roleName} (${categories.join(", ")}) na refeição "${mealName}" após aplicar as restrições selecionadas.`,
        "CATALOG_EXHAUSTED",
        { role, categories, mealName, restrictions, clinicalTags, mode },
      );
    }
    const idx = Math.floor(rng() * candidateFoods.length);
    return candidateFoods[idx];
  };

  const totalMealPercentage = mealPlanConfig.meals.reduce(
    (sum, m) => sum + (Number(m.caloriePercentage) || 0),
    0,
  );

  const generatedMeals: Meal[] = [];

  for (const mealConfig of mealPlanConfig.meals) {
    const normalizedPercentage =
      (mealConfig.caloriePercentage / totalMealPercentage) * 100;
    const factor = normalizedPercentage / 100;
    const mealProtein = nutritionalTargets.protein * factor;
    const mealCarbs = nutritionalTargets.carbs * factor;
    const mealFat = nutritionalTargets.fat * factor;

    const createMealOption = (): MealOption => {
      const proteinSource = getFoodFromCategories(
        template.P,
        "P",
        mealConfig.name,
      );
      const carbSource = getFoodFromCategories(
        template.C,
        "C",
        mealConfig.name,
      );
      const fatSource = getFoodFromCategories(template.F, "F", mealConfig.name);

      const getPortion = (
        mealMacro: number,
        foodMacro: number,
        foodPortion: string,
      ) => {
        const portionSize = Number(foodPortion) || 100;
        return foodMacro > 0 ? (mealMacro / foodMacro) * portionSize : 0;
      };

      const MIN_PORTION_GRAMS = 5;
      const MAX_PORTION_GRAMS = 450;

      let proteinPortion = getPortion(
        mealProtein,
        proteinSource.protein,
        proteinSource.portion,
      );
      let carbPortion = getPortion(
        mealCarbs,
        carbSource.carbs,
        carbSource.portion,
      );
      let fatPortion = getPortion(mealFat, fatSource.fat, fatSource.portion);

      proteinPortion = Math.max(
        MIN_PORTION_GRAMS,
        Math.min(MAX_PORTION_GRAMS, proteinPortion || MIN_PORTION_GRAMS),
      );
      carbPortion = Math.max(
        MIN_PORTION_GRAMS,
        Math.min(MAX_PORTION_GRAMS, carbPortion || MIN_PORTION_GRAMS),
      );
      fatPortion = Math.max(
        MIN_PORTION_GRAMS,
        Math.min(MAX_PORTION_GRAMS, fatPortion || MIN_PORTION_GRAMS),
      );

      const calculateStats = (food: Food, portion: number) => {
        const portionSize = Number(food.portion) || 100;
        const f = portionSize > 0 ? portion / portionSize : 0;
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

      const mealTargetCalories = nutritionalTargets.calories * factor;
      const rawCalories =
        calculateStats(proteinSource, proteinPortion).calories +
        calculateStats(carbSource, carbPortion).calories +
        calculateStats(fatSource, fatPortion).calories;

      if (rawCalories > 0 && mealTargetCalories > 0) {
        const scaleFactor = Math.max(
          0.3,
          Math.min(3.5, mealTargetCalories / rawCalories),
        );
        proteinPortion = Math.max(
          MIN_PORTION_GRAMS,
          Math.min(MAX_PORTION_GRAMS, proteinPortion * scaleFactor),
        );
        carbPortion = Math.max(
          MIN_PORTION_GRAMS,
          Math.min(MAX_PORTION_GRAMS, carbPortion * scaleFactor),
        );
        fatPortion = Math.max(
          MIN_PORTION_GRAMS,
          Math.min(MAX_PORTION_GRAMS, fatPortion * scaleFactor),
        );
      }

      const pS = calculateStats(proteinSource, proteinPortion);
      const cS = calculateStats(carbSource, carbPortion);
      const fS = calculateStats(fatSource, fatPortion);

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
          portion: `${roundedGrams}g`,
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

      const items: MealOptionItem[] = [
        createItem(proteinSource, proteinPortion, pS),
        createItem(carbSource, carbPortion, cS),
        createItem(fatSource, fatPortion, fS),
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

      return {
        name: `${getFoodName(proteinSource)}, ${getFoodName(carbSource)} ${andStr} ${getFoodName(fatSource)}`,
        portion: `${Math.round(proteinPortion)}g, ${Math.round(carbPortion)}g ${andStr} ${Math.round(fatPortion)}g`,
        calories: pS.calories + cS.calories + fS.calories,
        protein: parseFloat((pS.protein + cS.protein + fS.protein).toFixed(1)),
        carbs: parseFloat((pS.carbs + cS.carbs + fS.carbs).toFixed(1)),
        fat: parseFloat((pS.fat + cS.fat + fS.fat).toFixed(1)),
        items,
        details: i18next.t("diet.healthy_preparation", "preparação saudável"),
        micros: optionMicros,
      };
    };

    const main = createMealOption();
    generatedMeals.push({
      mealName: mealConfig.name,
      time: mealConfig.time,
      calories: main.calories,
      protein: main.protein,
      carbs: main.carbs,
      fat: main.fat,
      micros: main.micros,
      mainOption: main,
      alternatives: [createMealOption(), createMealOption()],
    });
  }

  const validation = validateDietPlan(generatedMeals, nutritionalTargets, {
    restrictions,
    clinicalTags,
    mode,
  });

  return {
    meals: generatedMeals,
    decisionLog,
    validation,
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
