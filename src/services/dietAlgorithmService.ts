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
  MealOptionItem,
  DietMode,
  ClinicalTag,
  DecisionEntry,
  Micronutrients,
} from "../types";
import type { DietType } from "./metabolicCalculations";

/**
 * Input parameters for the algorithmic diet generator.
 *
 * @property nutritionalTargets  - Daily targets calculated by the metabolic module
 *   (total calories and grams of protein, carbohydrate, and fat).
 * @property mealPlanConfig      - Type of diet (e.g., 'low_carb', 'vegetarian') and
 *   list of meals with their names, times, and calorie percentages.
 * @property restrictions        - Dietary restrictions of the patient
 *   (e.g., ['lactose_free', 'gluten_free']).
 * @property mode                - Clinical generation mode. Influences additional safety
 *   filters (e.g., 'clinical' restricts sodium < 600 mg, 'pediatric' removes stimulant drinks).
 * @property clinicalTags        - Tags of patient clinical conditions. Apply specific
 *   nutritional filters: hypertension (< 300 mg sodium), CKD (< 200 mg sodium),
 *   diabetes (no refined sugars), hepatic steatosis (no saturated fats).
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
}

/**
 * Result returned by the algorithmic diet generator.
 *
 * @property meals       - List of generated meals, each with a main option
 *   and alternatives, with portions already adjusted to the meal's calorie targets.
 * @property decisionLog - Auditable log of each filter or substitution decision
 *   made during generation (for display in the UI's "Decision Log").
 */
export interface GenerationResult {
  meals: Meal[];
  decisionLog: DecisionEntry[];
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

// --- HELPER FUNCTIONS ---

const getFilteredFoods = (template: { avoid?: string[] }): Food[] => {
  return brazilianFoods.filter(
    (food) => !template.avoid?.includes(food.category),
  );
};

const getRandomFoodFromCategories = (
  categories: string[],
  filteredFoods: Food[],
): Food => {
  const candidateFoods = filteredFoods.filter((f) =>
    categories.includes(f.category),
  );
  if (candidateFoods.length === 0) {
    return filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
  }
  return candidateFoods[Math.floor(Math.random() * candidateFoods.length)];
};

// --- MAIN GENERATION LOGIC ---

/**
 * Generates a complete dietary plan based on the patient's nutritional targets,
 * applying progressive exclusion filters based on diet type, food restrictions,
 * clinical mode, and clinical tags.
 *
 * **Generation workflow:**
 * 1. Selects the food category template for the specified `dietType`.
 * 2. Applies cascade exclusion filters (restrictions → mode → clinical tags),
 *    registering each filter action in the `decisionLog`.
 * 3. For each configured meal, calculates partial macro targets (pro-rata to
 *    the meal's `caloriePercentage`) and selects food sources from P, C, and F categories.
 * 4. Adjusts portion sizes in grams to align with the meal's calorie target.
 * 5. Generates two alternative options per meal (via `createMealOption()`).
 * 6. Aggregates estimated micronutrients based on the selected items.
 *
 * @param params - {@link GenerationParams} with targets, meal configuration,
 *   restrictions, clinical mode, and tags.
 * @returns {@link GenerationResult} containing the generated meals and decision log.
 *
 * @example
 * ```ts
 * const result = generateAlgorithmicDietPlan({
 *   nutritionalTargets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
 *   mealPlanConfig: {
 *     dietType: 'low_carb',
 *     meals: [
 *       { name: 'Café da Manhã', time: '07:00', caloriePercentage: 25 },
 *       { name: 'Almoço',        time: '12:00', caloriePercentage: 35 },
 *       { name: 'Jantar',        time: '19:00', caloriePercentage: 30 },
 *       { name: 'Ceia',          time: '21:30', caloriePercentage: 10 },
 *     ],
 *   },
 *   restrictions: ['lactose_free'],
 *   mode: 'clinical',
 *   clinicalTags: ['hypertension'],
 * });
 * ```
 */
export const generateAlgorithmicDietPlan = ({
  nutritionalTargets,
  mealPlanConfig,
  restrictions = [],
  mode = "general",
  clinicalTags = [],
}: GenerationParams): GenerationResult => {
  const template = dietTemplates[mealPlanConfig.dietType];
  const decisionLog: DecisionEntry[] = [];

  let availableFoods = getFilteredFoods(template);

  /**
   * Applies an exclusion filter, logs the clinical decision (including the NAMES
   * of the removed foods - correction A3) and updates the available foods list.
   * Only registers an entry when at least 1 item is removed.
   */
  const applyExclusion = (
    keep: (f: Food) => boolean,
    reason: string,
    tag: string,
  ) => {
    const removed = availableFoods.filter((f) => !keep(f));
    if (removed.length === 0) return;
    availableFoods = availableFoods.filter(keep);
    decisionLog.push({
      type: "filter",
      reason,
      affectedCount: removed.length,
      removedFoods: removed.map(getFoodName),
      tag,
    });
  };

  if (template.avoid && template.avoid.length > 0) {
    const removedByDietType = brazilianFoods.filter((f) =>
      template.avoid?.includes(f.category),
    );
    decisionLog.push({
      type: "filter",
      reason: i18next.t("diet.log_restrict_categories", {
        categories: template.avoid.join(", "),
        defaultValue: `Restringindo categorias por tipo de dieta: ${template.avoid.join(", ")}`,
      }),
      affectedCount: removedByDietType.length,
      removedFoods: removedByDietType.map(getFoodName),
      tag: mealPlanConfig.dietType,
    });
  }

  // --- ULTRA-PROCESSED EXCLUSION (NOVA 4) ---
  // Aligned with dietary guidelines: generated diets only use raw foods,
  // culinary ingredients, and processed foods (NOVA 1-3). Ultra-processed foods
  // are only available for queries in the foods database, never in auto generation.
  applyExclusion(
    (f) => getNovaGroup(f) !== 4,
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
      i18next.t(
        "diet.log_diabetes_sugars",
        "Controle Glicêmico: Removendo açúcares refinados",
      ),
      "diabetes",
    );
    // Prioritizes low/medium glycemic index carbohydrates (removes GI >= 70).
    applyExclusion(
      (f) => f.glycemicIndex == null || f.glycemicIndex < 70,
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
      i18next.t(
        "diet.log_hepatic",
        "Esteatose Hepática: Restringindo gorduras saturadas/óleos",
      ),
      "hepatic_steatosis",
    );
  }

  const generatedMeals: Meal[] = [];

  for (const mealConfig of mealPlanConfig.meals) {
    const factor = mealConfig.caloriePercentage / 100;
    const mealProtein = nutritionalTargets.protein * factor;
    const mealCarbs = nutritionalTargets.carbs * factor;
    const mealFat = nutritionalTargets.fat * factor;

    const createMealOption = () => {
      const proteinSource = getRandomFoodFromCategories(
        template.P,
        availableFoods,
      );
      const carbSource = getRandomFoodFromCategories(
        template.C,
        availableFoods,
      );
      const fatSource = getRandomFoodFromCategories(template.F, availableFoods);

      const getPortion = (
        mealMacro: number,
        foodMacro: number,
        foodPortion: string,
      ) => {
        const portionSize = Number(foodPortion) || 100;
        return foodMacro > 0 ? (mealMacro / foodMacro) * portionSize : 0;
      };

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

      const calculateStats = (food: Food, portion: number) => {
        const portionSize = Number(food.portion) || 100;
        const f = portionSize > 0 ? portion / portionSize : 0;
        const realMicros: Micronutrients = {
          fiber:
            food.fiber != null
              ? parseFloat((food.fiber * f).toFixed(1))
              : undefined,
          sodium: food.sodium != null ? Math.round(food.sodium * f) : undefined,
          iron:
            food.micros?.iron != null
              ? parseFloat((food.micros.iron * f).toFixed(1))
              : undefined,
          calcium:
            food.micros?.calcium != null
              ? Math.round(food.micros.calcium * f)
              : undefined,
          vitaminC:
            food.micros?.vitaminC != null
              ? Math.round(food.micros.vitaminC * f)
              : undefined,
          potassium:
            food.micros?.potassium != null
              ? Math.round(food.micros.potassium * f)
              : undefined,
          magnesium:
            food.micros?.magnesium != null
              ? Math.round(food.micros.magnesium * f)
              : undefined,
          zinc:
            food.micros?.zinc != null
              ? parseFloat((food.micros.zinc * f).toFixed(1))
              : undefined,
        };

        return {
          calories: Math.round(food.calories * f),
          protein: parseFloat((food.protein * f).toFixed(1)),
          carbs: parseFloat((food.carbs * f).toFixed(1)),
          fat: parseFloat((food.fat * f).toFixed(1)),
          micros: realMicros,
        };
      };

      // --- GLOBAL CALORIE SCALE ADJUSTMENT (correction A1) ---
      // Each portion size is scaled based on ONE single macro (protein, carbs OR fat),
      // but every food carries calories from other macros they contain.
      // Without adjustment, these "extra" combined calories from the 3 sources will
      // overshoot the meal's target. Here we measure raw calories and apply
      // a proportional factor to all portions to converge to the meal's target.
      const mealTargetCalories = nutritionalTargets.calories * factor;
      const rawCalories =
        calculateStats(proteinSource, proteinPortion).calories +
        calculateStats(carbSource, carbPortion).calories +
        calculateStats(fatSource, fatPortion).calories;
      if (rawCalories > 0 && mealTargetCalories > 0) {
        // Clamp avoids absurd portions when a target food macro is close to 0.
        const scaleFactor = Math.max(
          0.25,
          Math.min(4, mealTargetCalories / rawCalories),
        );
        proteinPortion *= scaleFactor;
        carbPortion *= scaleFactor;
        fatPortion *= scaleFactor;
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
          (stats.micros.sodium ?? 0) > 400
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
        return {
          name: getFoodName(food),
          portion: `${portionGrams.toFixed(0)}g`,
          ...stats,
          ...(warnings.length > 0 ? { clinicalWarnings: warnings } : {}),
        };
      };

      const items: MealOptionItem[] = [
        createItem(proteinSource, proteinPortion, pS),
        createItem(carbSource, carbPortion, cS),
        createItem(fatSource, fatPortion, fS),
      ];

      const andStr = i18next.t("diet.and", "e");

      return {
        name: `${getFoodName(proteinSource)}, ${getFoodName(carbSource)} ${andStr} ${getFoodName(fatSource)}`,
        portion: `${proteinPortion.toFixed(0)}g, ${carbPortion.toFixed(0)}g ${andStr} ${fatPortion.toFixed(0)}g`,
        calories: pS.calories + cS.calories + fS.calories,
        protein: pS.protein + cS.protein + fS.protein,
        carbs: pS.carbs + cS.carbs + fS.carbs,
        fat: pS.fat + cS.fat + fS.fat,
        items,
        details: i18next.t("diet.healthy_preparation", "preparação saudável"),
        micros: {
          fiber: parseFloat(
            (
              (pS.micros.fiber ?? 0) +
              (cS.micros.fiber ?? 0) +
              (fS.micros.fiber ?? 0)
            ).toFixed(1),
          ),
          sodium:
            (pS.micros.sodium ?? 0) +
            (cS.micros.sodium ?? 0) +
            (fS.micros.sodium ?? 0),
          iron:
            pS.micros.iron != null ||
            cS.micros.iron != null ||
            fS.micros.iron != null
              ? parseFloat(
                  (
                    (pS.micros.iron ?? 0) +
                    (cS.micros.iron ?? 0) +
                    (fS.micros.iron ?? 0)
                  ).toFixed(1),
                )
              : undefined,
          calcium:
            pS.micros.calcium != null ||
            cS.micros.calcium != null ||
            fS.micros.calcium != null
              ? (pS.micros.calcium ?? 0) +
                (cS.micros.calcium ?? 0) +
                (fS.micros.calcium ?? 0)
              : undefined,
          vitaminC:
            pS.micros.vitaminC != null ||
            cS.micros.vitaminC != null ||
            fS.micros.vitaminC != null
              ? (pS.micros.vitaminC ?? 0) +
                (cS.micros.vitaminC ?? 0) +
                (fS.micros.vitaminC ?? 0)
              : undefined,
        },
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

  return { meals: generatedMeals, decisionLog };
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
