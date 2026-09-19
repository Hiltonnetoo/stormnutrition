import { describe, it, expect } from "vitest";
import {
  DietReviewOutdatedError,
  validateAndSerializeDietPlan,
  validateAndSerializeDietUpdate,
  recalculateDietTotals,
  sanitizeMicronutrients,
  sanitizeMealOptionItem,
} from "../dietService";
import type { DietPlan, Meal } from "../../types";
import { validateDietPlan } from "../dietAlgorithmService";

const createValidMeal = (name = "Café da Manhã"): Meal => ({
  mealName: name,
  time: "08:00",
  calories: 400,
  protein: 30,
  carbs: 45,
  fat: 10,
  micros: {
    fiber: 5,
    sodium: 150,
  },
  mainOption: {
    name: "Ovos mexidos com pão integral",
    portion: "2 fatias + 2 ovos",
    calories: 400,
    protein: 30,
    carbs: 45,
    fat: 10,
    items: [
      {
        name: "Ovo",
        portion: "100g",
        calories: 140,
        protein: 13,
        carbs: 1,
        fat: 10,
      },
      {
        name: "Pão Integral",
        portion: "50g",
        calories: 120,
        protein: 4,
        carbs: 24,
        fat: 1,
      },
    ],
  },
  alternatives: [],
});

const createValidDietPlan = (): DietPlan => ({
  version: 2,
  id: "diet-doc-123", // Should be stripped by DTO
  patientId: "patient-1",
  patientName: "João da Silva",
  mode: "general",
  createdAt: "2026-09-17T12:00:00.000Z",
  startDate: "2026-09-18",
  durationDays: 30,
  dailyCalories: 2000,
  macronutrients: {
    proteinGrams: 150,
    proteinPercentage: 30,
    carbsGrams: 200,
    carbsPercentage: 40,
    fatGrams: 67,
    fatPercentage: 30,
  },
  meals: [createValidMeal()],
  waterRecommendationLiters: 2.5,
  generalObservations: ["Beber água regularmente"],
  dietType: "traditional",
});

// Recursively checks that NO key in an object has undefined value
function assertNoUndefined(obj: unknown, path = "root") {
  if (obj === null || typeof obj !== "object") return;
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = `${path}.${key}`;
    expect(
      value,
      `Expected ${currentPath} to not be undefined`,
    ).not.toBeUndefined();
    if (typeof value === "object" && value !== null) {
      assertNoUndefined(value, currentPath);
    }
  }
}

describe("dietService - Data Transfer Object and Validation", () => {
  describe("validateAndSerializeDietPlan", () => {
    it("should serialize a valid diet plan into a Firestore DTO and strip the id property", () => {
      const plan = createValidDietPlan();
      const dto = validateAndSerializeDietPlan(plan);

      expect(dto).toBeDefined();
      expect((dto as unknown as { id?: string }).id).toBeUndefined();
      expect(dto.patientId).toBe("patient-1");
      expect(dto.patientName).toBe("João da Silva");
      expect(dto.dailyCalories).toBe(2000);
      expect(dto.durationDays).toBe(30);
      expect(dto.version).toBe(2);
      expect(dto.meals).toHaveLength(1);

      // Verify no undefined properties exist anywhere in the DTO tree
      assertNoUndefined(dto);
    });

    it("should omit empty optional arrays like clinicalTags, labExams, and decisionLog", () => {
      const plan = createValidDietPlan();
      plan.clinicalTags = [];
      plan.labExams = [];
      plan.decisionLog = [];

      const dto = validateAndSerializeDietPlan(plan);
      expect(dto.clinicalTags).toBeUndefined();
      expect(dto.labExams).toBeUndefined();
      expect(dto.decisionLog).toBeUndefined();
      expect("clinicalTags" in dto).toBe(false);
      expect("labExams" in dto).toBe(false);
      expect("decisionLog" in dto).toBe(false);
    });

    it("should retain non-empty optional arrays like clinicalTags", () => {
      const plan = createValidDietPlan();
      plan.clinicalTags = ["hypertension"];

      const dto = validateAndSerializeDietPlan(plan);
      expect(dto.clinicalTags).toEqual(["hypertension"]);
    });

    it("should reject a diet plan with missing patientId", () => {
      const plan = createValidDietPlan();
      plan.patientId = "";
      expect(() => validateAndSerializeDietPlan(plan)).toThrow(
        "ID do paciente é obrigatório",
      );
    });

    it("should reject a diet plan with missing patientName", () => {
      const plan = createValidDietPlan();
      plan.patientName = "   ";
      expect(() => validateAndSerializeDietPlan(plan)).toThrow(
        "Nome do paciente é obrigatório",
      );
    });

    it("should reject non-finite dailyCalories (NaN, Infinity, negative)", () => {
      const plan = createValidDietPlan();
      plan.dailyCalories = NaN;
      expect(() => validateAndSerializeDietPlan(plan)).toThrow(
        "Calorias diárias devem ser um número positivo finito",
      );

      plan.dailyCalories = Infinity;
      expect(() => validateAndSerializeDietPlan(plan)).toThrow(
        "Calorias diárias devem ser um número positivo finito",
      );

      plan.dailyCalories = -100;
      expect(() => validateAndSerializeDietPlan(plan)).toThrow(
        "Calorias diárias devem ser um número positivo finito",
      );
    });

    it("should reject non-finite macronutrients", () => {
      const plan = createValidDietPlan();
      plan.macronutrients.proteinGrams = NaN;
      expect(() => validateAndSerializeDietPlan(plan)).toThrow(
        "Todos os macronutrientes devem conter números finitos",
      );
    });

    it("should reject a diet plan with empty meals array", () => {
      const plan = createValidDietPlan();
      plan.meals = [];
      expect(() => validateAndSerializeDietPlan(plan)).toThrow(
        "O plano alimentar deve conter pelo menos uma refeição",
      );
    });
  });

  describe("sanitizeMealOptionItem and clinicalWarnings", () => {
    it("should omit clinicalWarnings if array is empty or undefined", () => {
      const itemWithUndefinedWarnings = {
        name: "Frango Grelhado",
        portion: "150g",
        calories: 240,
        protein: 45,
        carbs: 0,
        fat: 5,
        clinicalWarnings: undefined,
      };

      const clean = sanitizeMealOptionItem(itemWithUndefinedWarnings);
      expect(clean.clinicalWarnings).toBeUndefined();
      expect("clinicalWarnings" in clean).toBe(false);
      assertNoUndefined(clean);
    });

    it("should preserve clinicalWarnings when non-empty strings are present", () => {
      const itemWithWarnings = {
        name: "Carne Seca",
        portion: "100g",
        calories: 300,
        protein: 35,
        carbs: 0,
        fat: 18,
        clinicalWarnings: ["Sódio elevado"],
      };

      const clean = sanitizeMealOptionItem(itemWithWarnings);
      expect(clean.clinicalWarnings).toEqual(["Sódio elevado"]);
    });

    it("should reject item with NaN calories", () => {
      const itemWithNaN = {
        name: "Alimento",
        portion: "100g",
        calories: NaN,
        protein: 10,
        carbs: 10,
        fat: 10,
      };

      expect(() => sanitizeMealOptionItem(itemWithNaN)).toThrow(
        "Calorias inválidas no item",
      );
    });
  });

  describe("sanitizeMicronutrients", () => {
    it("should return undefined if micronutrients is empty or not an object", () => {
      expect(sanitizeMicronutrients(undefined)).toBeUndefined();
      expect(sanitizeMicronutrients({})).toBeUndefined();
    });

    it("should omit non-finite numbers from micronutrients", () => {
      const micros = {
        fiber: 10,
        sodium: NaN,
        calcium: Infinity,
      };
      const clean = sanitizeMicronutrients(micros);
      expect(clean).toEqual({ fiber: 10 });
      expect("sodium" in (clean || {})).toBe(false);
      expect("calcium" in (clean || {})).toBe(false);
    });
  });

  describe("recalculateDietTotals", () => {
    it("should calculate exact nutritional totals from meals list with proper rounding", () => {
      const meal1 = createValidMeal("Café");
      const meal2 = createValidMeal("Almoço");
      meal2.calories = 650;
      meal2.protein = 45.4;
      meal2.carbs = 70.3;
      meal2.fat = 20.1;
      meal2.mainOption.calories = 650;
      meal2.mainOption.protein = 45.4;
      meal2.mainOption.carbs = 70.3;
      meal2.mainOption.fat = 20.1;
      meal2.mainOption.micros = { fiber: 8.2, sodium: 320 };

      const totals = recalculateDietTotals([meal1, meal2]);
      expect(totals.calories).toBe(1050); // 400 + 650
      expect(totals.protein).toBe(75.4); // 30 + 45.4
      expect(totals.carbs).toBe(115.3); // 45 + 70.3
      expect(totals.fat).toBe(30.1); // 10 + 20.1
      expect(totals.fiber).toBe(13.2); // 5 + 8.2
      expect(totals.sodium).toBe(470); // 150 + 320
    });
  });

  describe("validateAndSerializeDietUpdate", () => {
    it("should validate and clean partial update DTO", () => {
      const update = {
        dailyCalories: 1800,
        waterRecommendationLiters: 2.0,
      };
      const dto = validateAndSerializeDietUpdate(update);
      expect(dto.dailyCalories).toBe(1800);
      expect(dto.waterRecommendationLiters).toBe(2.0);
      expect((dto as unknown as { id?: string }).id).toBeUndefined();
    });

    it("should reject non-finite numbers in partial update", () => {
      expect(() =>
        validateAndSerializeDietUpdate({ dailyCalories: NaN }),
      ).toThrow("dailyCalories inválido");
      expect(() =>
        validateAndSerializeDietUpdate({ durationDays: -5 }),
      ).toThrow("durationDays inválido");
    });

    it("should serialize calculatedTotals, validation, algorithmVersion, datasetVersion, seed, and manual edit metadata", () => {
      const update = {
        algorithmVersion: "2.1.0",
        datasetVersion: "tbca-2026.1",
        seed: 42,
        isManuallyEdited: true,
        editedAt: "2026-09-18T15:00:00.000Z",
        calculatedTotals: {
          calories: 1950,
          protein: 145.5,
          carbs: 190.2,
          fat: 65.1,
          fiber: 25.0,
          sodium: 1800,
        },
        validation: {
          status: "valid" as const,
          isApproved: true,
          issues: [],
          calculatedTotals: {
            calories: 1950,
            protein: 145.5,
            carbs: 190.2,
            fat: 65.1,
          },
          deviations: {
            caloriesDiff: -50,
            caloriesPercent: -2.5,
            proteinDiff: -4.5,
            proteinPercent: -3.0,
            carbsDiff: -9.8,
            carbsPercent: -4.9,
            fatDiff: -1.9,
            fatPercent: -2.8,
          },
        },
      };

      const dto = validateAndSerializeDietUpdate(update);
      expect(dto.algorithmVersion).toBe("2.1.0");
      expect(dto.datasetVersion).toBe("tbca-2026.1");
      expect(dto.seed).toBe(42);
      expect(dto.isManuallyEdited).toBe(true);
      expect(dto.editedAt).toBe("2026-09-18T15:00:00.000Z");
      expect(dto.calculatedTotals?.calories).toBe(1950);
      expect(dto.validation?.status).toBe("valid");
      expect(dto.validation?.deviations.caloriesDiff).toBe(-50);
      assertNoUndefined(dto);
    });

    it("automatically recalculates calculatedTotals and sets isManuallyEdited when updating meals", () => {
      const newMeal = createValidMeal("Jantar Proteico");
      newMeal.calories = 550;
      newMeal.protein = 40;
      newMeal.carbs = 50;
      newMeal.fat = 15;
      newMeal.mainOption.calories = 550;
      newMeal.mainOption.protein = 40;
      newMeal.mainOption.carbs = 50;
      newMeal.mainOption.fat = 15;

      const dto = validateAndSerializeDietUpdate({
        meals: [newMeal],
        dailyCalories: 2000,
        macronutrients: {
          proteinGrams: 150,
          proteinPercentage: 30,
          carbsGrams: 200,
          carbsPercentage: 40,
          fatGrams: 67,
          fatPercentage: 30,
        },
      });

      expect(dto.meals).toHaveLength(1);
      expect(dto.calculatedTotals).toBeDefined();
      expect(dto.calculatedTotals?.calories).toBe(550);
      expect(dto.calculatedTotals?.protein).toBe(40);
      expect(dto.calculatedTotals?.carbs).toBe(50);
      expect(dto.calculatedTotals?.fat).toBe(15);
      expect(dto.isManuallyEdited).toBe(true);
      expect(typeof dto.editedAt).toBe("string");

      // Validation deviations should be recomputed against target goals (550 - 2000 = -1450 kcal)
      expect(dto.validation).toBeDefined();
      expect(dto.validation?.deviations.caloriesDiff).toBe(-1450);
      assertNoUndefined(dto);
    });

    it("respects explicit isManuallyEdited: false when passed", () => {
      const meal = createValidMeal();
      const dto = validateAndSerializeDietUpdate({
        meals: [meal],
        isManuallyEdited: false,
      });
      expect(dto.isManuallyEdited).toBe(false);
    });
  });

  // R06 (11.3 R06-A/B): persisted approval always refers to the saved version.
  describe("R06 — review identity on create and update", () => {
    // A plan whose only issue is a moderate calorie deviation (warning):
    // the meal has 400 kcal and matching macros; pick the first target that
    // yields "requires_review" so the scenario does not depend on tolerances.
    const reviewPlan = (): DietPlan => {
      const base = createValidDietPlan();
      for (const kcal of [430, 440, 450, 460, 480, 500, 520]) {
        const targets = { calories: kcal, protein: 30, carbs: 45, fat: 10 };
        if (
          validateDietPlan(base.meals, targets).status === "requires_review"
        ) {
          return {
            ...base,
            dailyCalories: kcal,
            macronutrients: {
              ...base.macronutrients,
              proteinGrams: 30,
              carbsGrams: 45,
              fatGrams: 10,
            },
          };
        }
      }
      throw new Error("no requires_review scenario");
    };
    const signatureOf = (plan: DietPlan) =>
      validateDietPlan(
        plan.meals,
        {
          calories: plan.dailyCalories,
          protein: plan.macronutrients.proteinGrams,
          carbs: plan.macronutrients.carbsGrams,
          fat: plan.macronutrients.fatGrams,
        },
        {
          clinicalTags: plan.clinicalTags,
          mode: plan.mode,
          catalogVersion: plan.datasetVersion,
        },
      ).issuesSignature;

    it("R06-B: a received validation claiming approval is ignored on create", () => {
      const plan = reviewPlan();
      plan.validation = {
        status: "valid",
        isApproved: true,
        approvedByUid: "forged",
        issues: [],
        issuesSignature: "stale",
        deviations: plan.validation?.deviations ?? {
          caloriesDiff: 0,
          caloriesPercent: 0,
          proteinDiff: 0,
          proteinPercent: 0,
          carbsDiff: 0,
          carbsPercent: 0,
          fatDiff: 0,
          fatPercent: 0,
        },
      };
      const dto = validateAndSerializeDietPlan(plan);
      expect(dto.validation?.status).toBe("requires_review");
      expect(dto.validation?.isApproved).toBe(false);
      expect(dto.validation?.approvedByUid).toBeUndefined();
    });

    it("R06-B: approval is persisted with author/date only for the reviewed version", () => {
      const plan = reviewPlan();
      const dto = validateAndSerializeDietPlan(plan, {
        allowApprovedReview: true,
        approvedByUid: "nutri-1",
        reviewedSignature: signatureOf(plan),
      });
      expect(dto.validation?.isApproved).toBe(true);
      expect(dto.validation?.approvedByUid).toBe("nutri-1");
      expect(dto.validation?.approvedAt).toBeDefined();
    });

    it("R06-B: approving a version that is not the one being saved is refused", () => {
      const plan = reviewPlan();
      const reviewed = signatureOf(plan);
      const edited = {
        ...plan,
        meals: [{ ...plan.meals[0], mealName: "Lanche editado" }],
      };
      expect(() =>
        validateAndSerializeDietPlan(edited, {
          allowApprovedReview: true,
          approvedByUid: "nutri-1",
          reviewedSignature: reviewed,
        }),
      ).toThrow(DietReviewOutdatedError);
    });

    it("R06-A: a tags/mode-only update revalidates and drops the old approval", () => {
      const plan = reviewPlan();
      const approved = validateAndSerializeDietPlan(plan, {
        allowApprovedReview: true,
        approvedByUid: "nutri-1",
        reviewedSignature: signatureOf(plan),
      });
      const existing = { ...plan, ...approved } as DietPlan;
      const update = validateAndSerializeDietUpdate(
        {
          clinicalTags: ["diabetes_t2"],
          mode: "clinical",
        } as Partial<DietPlan>,
        existing,
      );
      expect(update.validation?.isApproved).toBe(false);
      expect(update.validation?.issuesSignature).not.toBe(
        approved.validation?.issuesSignature,
      );
    });
  });
});
