import type { DietPlan, Meal, MealOption, MealOptionItem } from "../types";
import { recalculateDietTotals } from "../services/dietService";
import { brazilianFoods } from "../data/foods";
import { formatHouseholdMeasure } from "../services/portionLimitsService";

/** Which option of a meal is edited: the main one or alternative `n`. */
export type OptionKey = "main" | number;

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * R08 — manual portion edit. Nutrients scale linearly with the portion in
 * grams (the item's stored values are for its current `portionGrams`).
 * Items without a gram portion cannot be rescaled and are returned as is.
 */
export const rescaleItemPortion = (
  item: MealOptionItem,
  grams: number,
): MealOptionItem => {
  const current = item.portionGrams;
  if (!current || current <= 0 || !Number.isFinite(grams) || grams <= 0) {
    return item;
  }
  const factor = grams / current;
  const micros = item.micros
    ? (Object.fromEntries(
        Object.entries(item.micros).map(([k, v]) => [
          k,
          typeof v === "number" ? round1(v * factor) : v,
        ]),
      ) as MealOptionItem["micros"])
    : undefined;
  return {
    ...item,
    portionGrams: grams,
    // A5: same household measure as the generator when the food is known
    portion: (() => {
      const food = brazilianFoods.find(
        (f) => f.id === item.foodId || f.name === item.name,
      );
      return food
        ? formatHouseholdMeasure(food, grams)
        : `${grams}${item.unit && item.unit !== "g" ? ` ${item.unit}` : "g"}`;
    })(),
    calories: Math.round(item.calories * factor),
    protein: round1(item.protein * factor),
    carbs: round1(item.carbs * factor),
    fat: round1(item.fat * factor),
    ...(micros ? { micros } : {}),
  };
};

/** Option totals are the sum of its items. */
const withItemTotals = (option: MealOption): MealOption => {
  if (!option.items?.length) return option;
  const sum = (key: "calories" | "protein" | "carbs" | "fat") =>
    option.items!.reduce((acc, item) => acc + (item[key] || 0), 0);
  return {
    ...option,
    calories: Math.round(sum("calories")),
    protein: round1(sum("protein")),
    carbs: round1(sum("carbs")),
    fat: round1(sum("fat")),
  };
};

/**
 * Applies a portion change to one item and propagates it: option totals,
 * meal totals (which follow the main option), plan totals, and the
 * manual-edit flag. Validation is recomputed by the caller.
 */
export const applyPortionEdit = (
  plan: DietPlan,
  mealIndex: number,
  optionKey: OptionKey,
  itemIndex: number,
  grams: number,
): DietPlan => {
  const meals: Meal[] = plan.meals.map((meal, mi) => {
    if (mi !== mealIndex) return meal;
    const editOption = (option: MealOption): MealOption =>
      withItemTotals({
        ...option,
        items: (option.items ?? []).map((item, ii) =>
          ii === itemIndex ? rescaleItemPortion(item, grams) : item,
        ),
      });
    if (optionKey === "main") {
      const mainOption = editOption(meal.mainOption);
      return {
        ...meal,
        mainOption,
        calories: mainOption.calories,
        protein: mainOption.protein,
        carbs: mainOption.carbs,
        fat: mainOption.fat,
      };
    }
    return {
      ...meal,
      alternatives: (meal.alternatives ?? []).map((alt, ai) =>
        ai === optionKey ? editOption(alt) : alt,
      ),
    };
  });
  return {
    ...plan,
    meals,
    calculatedTotals: recalculateDietTotals(meals),
    isManuallyEdited: true,
  };
};
