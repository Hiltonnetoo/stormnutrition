import { describe, it, expect } from "vitest";
import { applyPortionEdit, rescaleItemPortion } from "../dietEditing";
import type { DietPlan, MealOption } from "../../types";

// R08 — expected values are literal (100 g → 150 g is ×1.5), never computed
// with the functions under test.
const item = {
  foodId: "f1",
  name: "Arroz",
  portion: "100g",
  portionGrams: 100,
  unit: "g",
  calories: 130,
  protein: 2.7,
  carbs: 28,
  fat: 0.3,
  micros: { fiber: 0.4, sodium: 1 },
};
const option = (name: string): MealOption => ({
  name,
  portion: "1 prato",
  calories: 230,
  protein: 22.7,
  carbs: 28,
  fat: 3.3,
  items: [
    item,
    {
      ...item,
      foodId: "f2",
      name: "Frango",
      calories: 100,
      protein: 20,
      carbs: 0,
      fat: 3,
    },
  ],
});
const plan = (): DietPlan =>
  ({
    patientId: "p1",
    patientName: "Paciente",
    dailyCalories: 460,
    meals: [
      {
        mealName: "Almoço",
        time: "12:00",
        calories: 230,
        protein: 22.7,
        carbs: 28,
        fat: 3.3,
        mainOption: option("A"),
        alternatives: [option("B")],
      },
      {
        mealName: "Jantar",
        time: "19:00",
        calories: 230,
        protein: 22.7,
        carbs: 28,
        fat: 3.3,
        mainOption: option("C"),
        alternatives: [],
      },
    ],
  }) as unknown as DietPlan;

describe("dietEditing (R08)", () => {
  it("rescales nutrients linearly with the portion", () => {
    expect(rescaleItemPortion(item, 150)).toMatchObject({
      portion: "150g",
      portionGrams: 150,
      calories: 195,
      protein: 4.1,
      carbs: 42,
      fat: 0.5,
      micros: { fiber: 0.6, sodium: 1.5 },
    });
  });

  it("ignores invalid portions and items without grams", () => {
    expect(rescaleItemPortion(item, 0)).toBe(item);
    const noGrams = { ...item, portionGrams: undefined };
    expect(rescaleItemPortion(noGrams, 150)).toBe(noGrams);
  });

  it("propagates a main-option edit to option, meal and plan totals", () => {
    const edited = applyPortionEdit(plan(), 0, "main", 0, 150);
    expect(edited.isManuallyEdited).toBe(true);
    expect(edited.meals[0].mainOption).toMatchObject({
      calories: 295,
      protein: 24.1,
      carbs: 42,
      fat: 3.5,
    });
    expect(edited.meals[0]).toMatchObject({
      calories: 295,
      protein: 24.1,
      carbs: 42,
      fat: 3.5,
    });
    // 295 (edited lunch) + 230 (dinner)
    expect(edited.calculatedTotals).toMatchObject({
      calories: 525,
      protein: 46.8,
      carbs: 70,
      fat: 6.8,
    });
    expect(edited.meals[1]).toEqual(plan().meals[1]);
  });

  it("an alternative edit changes only that alternative, not the meal or plan totals", () => {
    const edited = applyPortionEdit(plan(), 0, 0, 1, 50);
    expect(edited.meals[0].alternatives![0]).toMatchObject({
      calories: 180,
      protein: 12.7,
      fat: 1.8,
    });
    expect(edited.meals[0].calories).toBe(230);
    expect(edited.calculatedTotals?.calories).toBe(460);
  });
});
