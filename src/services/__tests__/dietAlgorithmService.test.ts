import { describe, it, expect, beforeAll } from "vitest";
import i18next from "i18next";
import {
  generateAlgorithmicDietPlan,
  getGeneralObservations,
  validateDietPlan,
  InfeasiblePlanError,
  type GenerationParams,
} from "../dietAlgorithmService";
import { brazilianFoods } from "../../data/foods";
import {
  getNovaGroup,
  foodContainsGluten,
  foodContainsDairy,
  foodContainsLactose,
  foodIsVegetarian,
  foodIsVegan,
} from "../foodService";
import type { Food, Meal } from "../../types";

describe("dietAlgorithmService", () => {
  beforeAll(async () => {
    await i18next.init({
      lng: "pt",
      resources: {
        pt: {
          translation: {
            diet: {
              obs_hydration: "Mantenha-se bem hidratado ao longo do dia.",
              obs_seasoning:
                "Prefira temperos naturais como alho, cebola, ervas e especiarias.",
              obs_sugary_drinks:
                "Evite o consumo de bebidas açucaradas, como refrigerantes e sucos industrializados.",
              obs_exercise:
                "Pratique atividade física regularmente, conforme orientação profissional.",
              obs_chewing:
                "Mastigue bem os alimentos e faça suas refeições em um ambiente tranquilo.",
              log_restrict_categories:
                "Restringindo categorias por tipo de dieta: {{categories}}",
              log_exclude_ultraprocessed:
                "Excluindo ultraprocessados (NOVA 4) do plano",
              log_remove_gluten:
                "Removendo alimentos com glúten (Restrição: Sem Glúten)",
              log_remove_lactose:
                "Removendo alimentos com lactose (Restrição: Sem Lactose)",
              log_remove_dairy:
                "Removendo leite e derivados (Restrição: Sem Laticínios / APLV)",
              log_remove_meat:
                "Removendo carnes e pescados (Dieta Vegetariana)",
              log_remove_animal_products:
                "Removendo derivados de origem animal (Dieta Vegana)",
              log_clinical_mode:
                "Limpando banco para Modo Clínico (Sódio < 600mg)",
              log_pediatric_mode:
                "Modo Pediátrico: Restringindo bebidas estimulantes/alcoólicas",
              log_hypertension:
                "Meta Rigorosa de Sódio para Hipertensão (< 300mg)",
              log_diabetes_sugars:
                "Controle Glicêmico: Removendo açúcares refinados",
              log_diabetes_gi:
                "Controle Glicêmico: Priorizando baixo/médio IG (removendo IG alto ≥ 70)",
              log_renal: "Proteção Renal: Sódio ultra-baixo (< 200mg)",
              log_hepatic:
                "Esteatose Hepática: Restringindo gorduras saturadas/óleos",
              warn_high_sodium: "Sódio elevado",
              warn_moderate_gi: "Carga glicêmica moderada",
              and: "e",
              healthy_preparation: "preparação saudável",
            },
          },
        },
      },
    });
  });

  const defaultParams = {
    nutritionalTargets: {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 65,
    },
    mealPlanConfig: {
      dietType: "traditional" as const,
      meals: [
        { name: "Café da Manhã", time: "08:00", caloriePercentage: 30 },
        { name: "Almoço", time: "12:00", caloriePercentage: 40 },
        { name: "Jantar", time: "20:00", caloriePercentage: 30 },
      ],
    },
  };

  /**
   * Helper that retrieves the original food using stable foodId (with fallback to name).
   * Throws an immediate assertion failure if foodId is missing or food is not found in catalog,
   * completely eliminating silent conditional skips in assertions.
   */
  const getRequiredFood = (item: { foodId?: string; name: string }) => {
    expect(item.foodId).toBeDefined();
    expect(typeof item.foodId).toBe("string");
    expect(item.foodId!.length).toBeGreaterThan(0);
    const found = brazilianFoods.find(
      (f) => f.id === item.foodId || f.name === item.name,
    );
    expect(found).toBeDefined();
    return found!;
  };

  it("should generate the requested meals with options", () => {
    const result = generateAlgorithmicDietPlan(defaultParams);
    expect(result.meals.length).toBe(3);
    expect(result.meals[0].mealName).toBe("Café da Manhã");
    expect(result.meals[0].mainOption).toBeDefined();
    expect(result.meals[0].alternatives.length).toBe(2);
  });

  it("should exclude ultraprocessed foods (NOVA 4) from main options and all alternatives", () => {
    const result = generateAlgorithmicDietPlan({
      ...defaultParams,
      seed: 100,
    });

    result.meals.forEach((meal) => {
      // Main option items
      meal.mainOption.items?.forEach((item) => {
        const originalFood = getRequiredFood(item);
        expect(getNovaGroup(originalFood)).not.toBe(4);
      });

      // Alternative option items
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const originalFood = getRequiredFood(item);
          expect(getNovaGroup(originalFood)).not.toBe(4);
        });
      });
    });
  });

  it("should apply lactose-free restriction across main options and alternatives and log decision", () => {
    const params = {
      ...defaultParams,
      restrictions: ["lactose_free"],
      seed: 200,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = getRequiredFood(item);
        expect(foodContainsLactose(originalFood)).toBe(false);
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const originalFood = getRequiredFood(item);
          expect(foodContainsLactose(originalFood)).toBe(false);
        });
      });
    });

    const lactoseLog = result.decisionLog.find(
      (log) => log.tag === "lactose_free",
    );
    expect(lactoseLog).toBeDefined();
    expect(lactoseLog?.type).toBe("filter");
  });

  it("should enforce clinical mode sodium limit (< 600mg) across main options and alternatives", () => {
    const params = {
      ...defaultParams,
      mode: "clinical" as const,
      seed: 300,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = getRequiredFood(item);
        expect(originalFood.sodium).toBeLessThan(600);
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const originalFood = getRequiredFood(item);
          expect(originalFood.sodium).toBeLessThan(600);
        });
      });
    });

    const clinicalLog = result.decisionLog.find(
      (log) => log.tag === "clinical",
    );
    expect(clinicalLog).toBeDefined();
  });

  it("should enforce hypertension tag sodium limit (< 300mg) across main and alternative options", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["hypertension" as const],
      seed: 400,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = getRequiredFood(item);
        expect(originalFood.sodium).toBeLessThan(300);
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const originalFood = getRequiredFood(item);
          expect(originalFood.sodium).toBeLessThan(300);
        });
      });
    });

    const hyperLog = result.decisionLog.find(
      (log) => log.tag === "hypertension",
    );
    expect(hyperLog).toBeDefined();
  });

  it("should enforce diabetes tags removing high GI foods (>= 70) and sugars across options", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["diabetes_t2" as const],
      seed: 500,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = getRequiredFood(item);
        expect(originalFood.category).not.toBe("Açúcares e Doces");
        if (originalFood.glycemicIndex !== undefined) {
          expect(originalFood.glycemicIndex).toBeLessThan(70);
        }
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const originalFood = getRequiredFood(item);
          expect(originalFood.category).not.toBe("Açúcares e Doces");
          if (originalFood.glycemicIndex !== undefined) {
            expect(originalFood.glycemicIndex).toBeLessThan(70);
          }
        });
      });
    });

    const diabetesLog = result.decisionLog.find(
      (log) => log.tag === "diabetes_gi",
    );
    expect(diabetesLog).toBeDefined();
  });

  it("should enforce renal (CKD) ultra-low sodium limit (< 200mg) across all items", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["renal_ckd" as const],
      seed: 600,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = getRequiredFood(item);
        expect(originalFood.sodium).toBeLessThan(200);
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const originalFood = getRequiredFood(item);
          expect(originalFood.sodium).toBeLessThan(200);
        });
      });
    });

    const renalLog = result.decisionLog.find((log) => log.tag === "renal_ckd");
    expect(renalLog).toBeDefined();
  });

  it("should restrict saturated fats for hepatic steatosis across main and alternatives", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["hepatic_steatosis" as const],
      seed: 700,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = getRequiredFood(item);
        if (originalFood.category === "Óleos e Gorduras") {
          expect(originalFood.name.toLowerCase()).toContain("azeite");
        }
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const originalFood = getRequiredFood(item);
          if (originalFood.category === "Óleos e Gorduras") {
            expect(originalFood.name.toLowerCase()).toContain("azeite");
          }
        });
      });
    });

    const hepaticLog = result.decisionLog.find(
      (log) => log.tag === "hepatic_steatosis",
    );
    expect(hepaticLog).toBeDefined();
  });

  it("should enforce gluten-free restriction across all meal options and log the decision", () => {
    const params = {
      ...defaultParams,
      restrictions: ["gluten_free"],
      seed: 800,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = getRequiredFood(item);
        expect(foodContainsGluten(food)).toBe(false);
      });
      meal.alternatives?.forEach((alt) => {
        alt.items?.forEach((item) => {
          const food = getRequiredFood(item);
          expect(foodContainsGluten(food)).toBe(false);
        });
      });
    });

    const glutenLog = result.decisionLog.find(
      (log) => log.tag === "gluten_free",
    );
    expect(glutenLog).toBeDefined();
    expect(glutenLog?.type).toBe("filter");
  });

  it("should enforce dairy-free (APLV) restriction across all meal options and log the decision", () => {
    const params = {
      ...defaultParams,
      restrictions: ["dairy_free"],
      seed: 900,
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = getRequiredFood(item);
        expect(foodContainsDairy(food)).toBe(false);
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const food = getRequiredFood(item);
          expect(foodContainsDairy(food)).toBe(false);
        });
      });
    });

    const dairyLog = result.decisionLog.find((log) => log.tag === "dairy_free");
    expect(dairyLog).toBeDefined();
    expect(dairyLog?.type).toBe("filter");
  });

  it("should enforce vegetarian and vegan restrictions across main and alternative options", () => {
    const vegResult = generateAlgorithmicDietPlan({
      ...defaultParams,
      restrictions: ["vegetarian"],
      seed: 1010,
    });
    vegResult.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = getRequiredFood(item);
        expect(foodIsVegetarian(food)).toBe(true);
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const food = getRequiredFood(item);
          expect(foodIsVegetarian(food)).toBe(true);
        });
      });
    });

    const veganResult = generateAlgorithmicDietPlan({
      ...defaultParams,
      restrictions: ["vegan"],
      seed: 2020,
    });
    veganResult.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = getRequiredFood(item);
        expect(foodIsVegan(food)).toBe(true);
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          const food = getRequiredFood(item);
          expect(foodIsVegan(food)).toBe(true);
        });
      });
    });
  });

  it("should produce deterministic and strictly reproducible outputs for main and alternatives with a fixed seed", () => {
    const SEED = 4242;
    const run1 = generateAlgorithmicDietPlan({ ...defaultParams, seed: SEED });
    const run2 = generateAlgorithmicDietPlan({ ...defaultParams, seed: SEED });

    expect(run1.metadata.seed).toBe(SEED);
    expect(run2.metadata.seed).toBe(SEED);
    expect(run1.meals.length).toBe(run2.meals.length);

    run1.meals.forEach((meal1, idx) => {
      const meal2 = run2.meals[idx];
      expect(meal1.mealName).toBe(meal2.mealName);
      expect(meal1.calories).toBe(meal2.calories);
      expect(meal1.protein).toBe(meal2.protein);
      expect(meal1.carbs).toBe(meal2.carbs);
      expect(meal1.fat).toBe(meal2.fat);

      // Main option items
      expect(meal1.mainOption.items?.length).toBe(
        meal2.mainOption.items?.length,
      );
      meal1.mainOption.items?.forEach((item1, itemIdx) => {
        const item2 = meal2.mainOption.items![itemIdx];
        expect(item1.foodId).toBe(item2.foodId);
        expect(item1.portionGrams).toBe(item2.portionGrams);
        expect(item1.calories).toBe(item2.calories);
      });

      // Alternative options
      expect(meal1.alternatives.length).toBe(meal2.alternatives.length);
      meal1.alternatives.forEach((alt1, altIdx) => {
        const alt2 = meal2.alternatives[altIdx];
        expect(alt1.calories).toBe(alt2.calories);
        expect(alt1.items?.length).toBe(alt2.items?.length);
        alt1.items?.forEach((item1, itemIdx) => {
          const item2 = alt2.items![itemIdx];
          expect(item1.foodId).toBe(item2.foodId);
          expect(item1.portionGrams).toBe(item2.portionGrams);
        });
      });
    });
  });

  it("should produce distinct valid variations when given different seeds", () => {
    const runA = generateAlgorithmicDietPlan({
      ...defaultParams,
      seed: 101,
    });
    const runB = generateAlgorithmicDietPlan({
      ...defaultParams,
      seed: 999,
    });

    expect(runA.metadata.seed).not.toBe(runB.metadata.seed);
    const namesA = runA.meals.map((m) => m.mainOption.name).join("; ");
    const namesB = runB.meals.map((m) => m.mainOption.name).join("; ");
    expect(namesA).not.toBe(namesB);
  });

  it("should keep total meal calories close to daily target (complementary statistical evaluation)", () => {
    const target = defaultParams.nutritionalTargets.calories;
    const deviations: number[] = [];
    for (let i = 0; i < 25; i++) {
      const result = generateAlgorithmicDietPlan(defaultParams);
      const total = result.meals.reduce((sum, m) => sum + m.calories, 0);
      deviations.push(Math.abs(total - target) / target);
    }
    deviations.sort((a, b) => a - b);
    const median = deviations[Math.floor(deviations.length / 2)];
    expect(median).toBeLessThan(0.15); // typical run lands within 15% of target
  });

  it("should return general observations list", () => {
    const observations = getGeneralObservations();
    expect(observations.length).toBeGreaterThan(0);
    expect(observations[0]).toContain("Mantenha-se bem hidratado");
  });

  it("should calculate real micronutrients and not fabricate category guesses", () => {
    const result = generateAlgorithmicDietPlan({ ...defaultParams, seed: 123 });

    result.meals.forEach((meal) => {
      const micros = meal.mainOption.micros;
      if (micros) {
        if (micros.iron !== undefined) {
          expect(micros.iron).toBeGreaterThanOrEqual(0);
        }
        if (micros.calcium !== undefined) {
          expect(micros.calcium).toBeGreaterThanOrEqual(0);
        }
        if (micros.vitaminC !== undefined) {
          expect(micros.vitaminC).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  it("should throw InfeasiblePlanError when availableFoodsCatalog is empty (catálogo vazio)", () => {
    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        availableFoodsCatalog: [],
      }),
    ).toThrow(InfeasiblePlanError);

    try {
      generateAlgorithmicDietPlan({
        ...defaultParams,
        availableFoodsCatalog: [],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(InfeasiblePlanError);
      expect((err as InfeasiblePlanError).code).toBe("CATALOG_EXHAUSTED");
    }
  });

  it("should validate inputs and reject incoherent or non-finite parameters", () => {
    // Zero calories
    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        nutritionalTargets: {
          ...defaultParams.nutritionalTargets,
          calories: 0,
        },
      }),
    ).toThrow(InfeasiblePlanError);

    // Negative calories
    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        nutritionalTargets: {
          ...defaultParams.nutritionalTargets,
          calories: -500,
        },
      }),
    ).toThrow(InfeasiblePlanError);

    // Negative macronutrient
    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        nutritionalTargets: {
          ...defaultParams.nutritionalTargets,
          protein: -10,
        },
      }),
    ).toThrow(InfeasiblePlanError);

    // NaN calories
    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        nutritionalTargets: {
          ...defaultParams.nutritionalTargets,
          calories: NaN,
        },
      }),
    ).toThrow(InfeasiblePlanError);

    // Empty meals array
    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        mealPlanConfig: {
          dietType: "traditional",
          meals: [],
        },
      }),
    ).toThrow(InfeasiblePlanError);

    // Meal percentage sum way out of range (e.g. 50%)
    try {
      generateAlgorithmicDietPlan({
        ...defaultParams,
        mealPlanConfig: {
          dietType: "traditional",
          meals: [{ name: "Café", time: "08:00", caloriePercentage: 50 }],
        },
      });
      expect.unreachable("should have thrown InfeasiblePlanError");
    } catch (err) {
      expect(err).toBeInstanceOf(InfeasiblePlanError);
      expect((err as InfeasiblePlanError).code).toBe(
        "INVALID_MEAL_PERCENTAGES",
      );
      expect((err as InfeasiblePlanError).details).toEqual({
        totalPercentage: 50,
      });
    }

    // Meal with negative/zero percentage captures mealName details
    try {
      generateAlgorithmicDietPlan({
        ...defaultParams,
        mealPlanConfig: {
          dietType: "traditional",
          meals: [
            { name: "Café", time: "08:00", caloriePercentage: 100 },
            { name: "Almoço", time: "12:00", caloriePercentage: 0 },
          ],
        },
      });
      expect.unreachable("should have thrown InfeasiblePlanError");
    } catch (err) {
      expect(err).toBeInstanceOf(InfeasiblePlanError);
      expect((err as InfeasiblePlanError).code).toBe("INVALID_MEAL_PERCENT");
      expect((err as InfeasiblePlanError).details).toEqual({
        mealName: "Almoço",
      });
    }
  });

  it("should throw InfeasiblePlanError when filters eliminate all candidates and never select undefined", () => {
    const foodWithoutProtein = brazilianFoods.filter(
      (f) => f.category === "Frutas",
    );

    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        availableFoodsCatalog: foodWithoutProtein,
      }),
    ).toThrow(InfeasiblePlanError);
  });

  it("should satisfy multiple simultaneous restrictions without conflict", () => {
    const multiParams = {
      ...defaultParams,
      restrictions: ["gluten_free", "dairy_free", "vegetarian"],
      clinicalTags: ["hypertension" as const, "diabetes_t2" as const],
      seed: 8888,
    };

    const result = generateAlgorithmicDietPlan(multiParams);
    expect(result.meals.length).toBe(3);

    result.meals.forEach((meal) => {
      const allItems = [
        ...(meal.mainOption.items || []),
        ...meal.alternatives.flatMap((a) => a.items || []),
      ];

      allItems.forEach((item) => {
        const food = getRequiredFood(item);
        expect(foodContainsGluten(food)).toBe(false);
        expect(foodContainsDairy(food)).toBe(false);
        expect(foodIsVegetarian(food)).toBe(true);
        expect(food.sodium).toBeLessThan(300);
        expect(food.category).not.toBe("Açúcares e Doces");
        if (food.glycemicIndex !== undefined) {
          expect(food.glycemicIndex).toBeLessThan(70);
        }
      });
    });
  });

  it("should populate stable foodId, numeric portionGrams and unit on all meal items", () => {
    const result = generateAlgorithmicDietPlan({
      ...defaultParams,
      seed: 1234,
    });

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        expect(typeof item.foodId).toBe("string");
        expect(item.foodId?.length).toBeGreaterThan(0);
        expect(typeof item.portionGrams).toBe("number");
        expect(item.portionGrams).toBeGreaterThan(0);
        expect(typeof item.unit).toBe("string");
      });

      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          expect(typeof item.foodId).toBe("string");
          expect(item.foodId?.length).toBeGreaterThan(0);
          expect(typeof item.portionGrams).toBe("number");
          expect(item.portionGrams).toBeGreaterThan(0);
        });
      });
    });
  });

  it("should enforce realistic portion clamping (between 5g and 450g) across main and alternatives", () => {
    const result = generateAlgorithmicDietPlan({
      ...defaultParams,
      seed: 555,
    });

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        if (item.portionGrams !== undefined) {
          expect(item.portionGrams).toBeGreaterThanOrEqual(5);
          expect(item.portionGrams).toBeLessThanOrEqual(450);
        }
      });
      meal.alternatives.forEach((alt) => {
        alt.items?.forEach((item) => {
          if (item.portionGrams !== undefined) {
            expect(item.portionGrams).toBeGreaterThanOrEqual(5);
            expect(item.portionGrams).toBeLessThanOrEqual(450);
          }
        });
      });
    });
  });

  it("should assign structured decision codes to decisionLog entries", () => {
    const result = generateAlgorithmicDietPlan({
      ...defaultParams,
      restrictions: ["gluten_free", "dairy_free"],
      clinicalTags: ["hypertension"],
    });

    const codes = result.decisionLog.map((entry) => entry.code);
    expect(codes).toContain("EXCLUDE_ULTRAPROCESSED");
    expect(codes).toContain("EXCLUDE_GLUTEN");
    expect(codes).toContain("EXCLUDE_DAIRY");
    expect(codes).toContain("LIMIT_SODIUM_HYPERTENSION");
  });

  it("should validate generated plan and support complete revalidation cycle", () => {
    const result = generateAlgorithmicDietPlan({
      ...defaultParams,
      clinicalTags: ["hypertension"],
      seed: 777,
    });

    expect(result.validation).toBeDefined();
    expect(result.validation?.status).toBeDefined();
    expect(result.calculatedTotals?.calories).toBeGreaterThan(0);
    expect(result.validation?.deviations).toBeDefined();

    // Call standalone validateDietPlan to simulate plan reopening/rehydration
    const revalidation = validateDietPlan(
      result.meals,
      defaultParams.nutritionalTargets,
      {
        clinicalTags: ["hypertension"],
        restrictions: [],
      },
    );
    expect(revalidation.status).toBe(result.validation.status);
    expect(revalidation.worstCaseAlternativeSodium).toBeGreaterThanOrEqual(
      revalidation.calculatedTotals.sodium || 0,
    );
    // Totals live on the plan root (not inside `validation`).
    expect(revalidation.calculatedTotals.calories).toBe(
      result.calculatedTotals!.calories,
    );
    expect(revalidation.calculatedTotals.protein).toBe(
      result.calculatedTotals!.protein,
    );
  });

  describe("validateDietPlan — C06 comprehensive validation", () => {
    const customFood: Food = {
      id: "custom_cereal_1",
      name: "Cereal Personalizado Seguro",
      category: "Cereais e Derivados",
      portion: "100",
      unit: "g",
      calories: 350,
      protein: 10,
      carbs: 70,
      fat: 2,
      fiber: 5,
      sodium: 10,
      restrictions: {
        containsGluten: false,
        containsLactose: false,
        containsDairy: false,
        isVegetarian: true,
        isVegan: true,
      },
    };

    const validMeal: Meal = {
      mealName: "Café da Manhã",
      time: "08:00",
      calories: 350,
      protein: 10,
      carbs: 70,
      fat: 2,
      mainOption: {
        name: "Cereal Personalizado",
        portion: "100g",
        calories: 350,
        protein: 10,
        carbs: 70,
        fat: 2,
        items: [
          {
            foodId: "custom_cereal_1",
            name: "Cereal Personalizado Seguro",
            portion: "100g",
            portionGrams: 100,
            unit: "g",
            calories: 350,
            protein: 10,
            carbs: 70,
            fat: 2,
          },
        ],
      },
      alternatives: [],
    };

    it("resolves foods against custom/injected catalog without flagging unknown", () => {
      const result = validateDietPlan(
        [validMeal],
        { calories: 350, protein: 10, carbs: 70, fat: 2 },
        {
          availableFoodsCatalog: [customFood],
          restrictions: ["gluten_free"],
        },
      );

      expect(result.status).toBe("valid");
      expect(result.isStructurallyValid).toBe(true);
      expect(result.isApproved).toBe(false);
      expect(result.issues).toEqual([]);
    });

    it("flags UNKNOWN_FOOD_ITEM when food is not in active catalog (no silent continue)", () => {
      const mealWithUnknownFood: Meal = {
        ...validMeal,
        mainOption: {
          ...validMeal.mainOption,
          items: [
            {
              foodId: "non_existent_id",
              name: "Super Alimento Misterioso",
              portion: "100g",
              portionGrams: 100,
              unit: "g",
              calories: 350,
              protein: 10,
              carbs: 70,
              fat: 2,
            },
          ],
        },
      };

      const result = validateDietPlan(
        [mealWithUnknownFood],
        { calories: 350, protein: 10, carbs: 70, fat: 2 },
        {
          availableFoodsCatalog: [customFood],
        },
      );

      expect(result.status).toBe("requires_review");
      expect(result.isApproved).toBe(false);
      const unknownIssue = result.issues.find(
        (i) => i.code === "UNKNOWN_FOOD_ITEM",
      );
      expect(unknownIssue).toBeDefined();
      expect(unknownIssue?.level).toBe("warning");
      expect(unknownIssue?.details?.foodName).toBe("Super Alimento Misterioso");
    });

    it("emits UNVERIFIED_RESTRICTION on unknown food when restrictions are active", () => {
      const mealWithUnknownFood: Meal = {
        ...validMeal,
        mainOption: {
          ...validMeal.mainOption,
          items: [
            {
              foodId: "alien_food",
              name: "Pó Cósmico",
              portion: "50g",
              portionGrams: 50,
              unit: "g",
              calories: 350,
              protein: 10,
              carbs: 70,
              fat: 2,
            },
          ],
        },
      };

      const result = validateDietPlan(
        [mealWithUnknownFood],
        { calories: 350, protein: 10, carbs: 70, fat: 2 },
        {
          availableFoodsCatalog: [customFood],
          restrictions: ["gluten_free", "dairy_free"],
        },
      );

      expect(result.status).toBe("requires_review");
      const unverifiedIssue = result.issues.find(
        (i) => i.code === "UNVERIFIED_RESTRICTION",
      );
      expect(unverifiedIssue).toBeDefined();
      expect(unverifiedIssue?.level).toBe("warning");
      expect(unverifiedIssue?.details?.unverifiedRestrictions).toEqual([
        "gluten_free",
        "dairy_free",
      ]);
    });

    it("marks status as infeasible when an active restriction is violated, and forbids approval", () => {
      const glutenFood: Food = {
        ...customFood,
        id: "gluten_cereal",
        name: "Cereal de Trigo",
        restrictions: { containsGluten: true },
      };

      const mealWithGluten: Meal = {
        ...validMeal,
        mainOption: {
          ...validMeal.mainOption,
          items: [
            {
              foodId: "gluten_cereal",
              name: "Cereal de Trigo",
              portion: "100g",
              portionGrams: 100,
              unit: "g",
              calories: 350,
              protein: 10,
              carbs: 70,
              fat: 2,
            },
          ],
        },
      };

      const result = validateDietPlan(
        [mealWithGluten],
        { calories: 350, protein: 10, carbs: 70, fat: 2 },
        {
          availableFoodsCatalog: [glutenFood],
          restrictions: ["gluten_free"],
          allowApprovedReview: true, // Should still be rejected!
        },
      );

      expect(result.status).toBe("infeasible");
      expect(result.isApproved).toBe(false);
      const glutenViolation = result.issues.find(
        (i) => i.code === "GLUTEN_VIOLATION",
      );
      expect(glutenViolation).toBeDefined();
      expect(glutenViolation?.level).toBe("error");
    });

    it("allows approval of requires_review only when allowApprovedReview is explicitly provided", () => {
      const mealWithWarning: Meal = {
        ...validMeal,
        mainOption: {
          ...validMeal.mainOption,
          items: [
            {
              foodId: "unknown_id",
              name: "Fruta Exótica",
              portion: "100g",
              portionGrams: 100,
              unit: "g",
              calories: 350,
              protein: 10,
              carbs: 70,
              fat: 2,
            },
          ],
        },
      };

      const unapprovedResult = validateDietPlan(
        [mealWithWarning],
        { calories: 350, protein: 10, carbs: 70, fat: 2 },
        { availableFoodsCatalog: [customFood] },
      );
      expect(unapprovedResult.status).toBe("requires_review");
      expect(unapprovedResult.isApproved).toBe(false);

      // R06: the flag alone no longer approves — consent must name the
      // exact version that was presented (its issuesSignature).
      const flagOnly = validateDietPlan(
        [mealWithWarning],
        { calories: 350, protein: 10, carbs: 70, fat: 2 },
        { availableFoodsCatalog: [customFood], allowApprovedReview: true },
      );
      expect(flagOnly.isApproved).toBe(false);

      const approvedResult = validateDietPlan(
        [mealWithWarning],
        { calories: 350, protein: 10, carbs: 70, fat: 2 },
        {
          availableFoodsCatalog: [customFood],
          allowApprovedReview: true,
          reviewedSignature: unapprovedResult.issuesSignature,
          approvedByUid: "nutri-1",
        },
      );
      expect(approvedResult.status).toBe("requires_review");
      expect(approvedResult.isApproved).toBe(true);
      expect(approvedResult.approvedByUid).toBe("nutri-1");
      expect(approvedResult.approvedAt).toBeDefined();
    });

    describe("R06 — review identity follows content and context", () => {
      const targets = { calories: 350, protein: 10, carbs: 70, fat: 2 };
      const sig = (
        meals: Meal[],
        t = targets,
        opts: Record<string, unknown> = {},
      ) =>
        validateDietPlan(meals, t, {
          availableFoodsCatalog: [customFood],
          ...opts,
        });
      const withFood = (calories: number): Meal => ({
        ...validMeal,
        mainOption: {
          ...validMeal.mainOption,
          items: [
            {
              foodId: "unknown_id",
              name: "Fruta Exótica",
              portion: "100g",
              portionGrams: 100,
              unit: "g",
              calories,
              protein: 10,
              carbs: 70,
              fat: 2,
            },
          ],
        },
      });

      it("same content and context → same signature (deterministic)", () => {
        expect(sig([withFood(350)]).issuesSignature).toBe(
          sig([withFood(350)]).issuesSignature,
        );
      });

      it("content, targets, restrictions, tags, mode, catalog or tolerances change the signature", () => {
        const base = sig([withFood(350)]).issuesSignature;
        const variants = [
          sig([withFood(351)]),
          sig([withFood(350)], { ...targets, protein: 11 }),
          sig([withFood(350)], targets, { restrictions: ["lactose"] }),
          sig([withFood(350)], targets, { clinicalTags: ["diabetes_t2"] }),
          sig([withFood(350)], targets, { mode: "sports" }),
          sig([withFood(350)], targets, { catalogVersion: "2027.1" }),
          sig([withFood(350)], targets, {
            tolerances: {
              caloriePercent: 1,
              proteinPercent: 1,
              carbsPercent: 1,
              fatPercent: 1,
            },
          }),
        ].map((r) => r.issuesSignature);
        for (const v of variants) expect(v).not.toBe(base);
      });

      it("an alert with the same code but different values is a different review", () => {
        const a = validateDietPlan([validMeal], {
          calories: 1000,
          protein: 10,
          carbs: 70,
          fat: 2,
        });
        const b = validateDietPlan([validMeal], {
          calories: 1200,
          protein: 10,
          carbs: 70,
          fat: 2,
        });
        const codes = (r: typeof a) =>
          r.issues
            .map((i) => i.code)
            .sort()
            .join();
        expect(codes(a)).toBe(codes(b));
        expect(b.status).toBe("requires_review");
        expect(a.issuesSignature).not.toBe(b.issuesSignature);
        // Approving version A does not approve version B...
        expect(
          validateDietPlan(
            [validMeal],
            { calories: 1200, protein: 10, carbs: 70, fat: 2 },
            {
              allowApprovedReview: true,
              reviewedSignature: a.issuesSignature,
            },
          ).isApproved,
        ).toBe(false);
        // ...and a new explicit review of B is accepted (no stale blocker).
        expect(
          validateDietPlan(
            [validMeal],
            { calories: 1200, protein: 10, carbs: 70, fat: 2 },
            {
              allowApprovedReview: true,
              reviewedSignature: b.issuesSignature,
            },
          ).isApproved,
        ).toBe(true);
      });

      it("infeasible plans are never approved, whatever the signature", () => {
        const infeasible = validateDietPlan([validMeal], {
          calories: 0,
          protein: 10,
          carbs: 70,
          fat: 2,
        });
        expect(infeasible.status).toBe("infeasible");
        const attempt = validateDietPlan(
          [validMeal],
          { calories: 0, protein: 10, carbs: 70, fat: 2 },
          {
            allowApprovedReview: true,
            reviewedSignature: infeasible.issuesSignature,
          },
        );
        expect(attempt.isApproved).toBe(false);
      });
    });

    it("emits warnings for all 4 macronutrient deviations (calories, protein, carbs, fat)", () => {
      const deviatingMeal: Meal = {
        mealName: "Refeição Completa",
        time: "12:00",
        calories: 800, // target: 500 (+60%)
        protein: 50, // target: 30 (+66%)
        carbs: 10, // target: 50 (-80%)
        fat: 40, // target: 15 (+166%)
        mainOption: {
          name: "Opção",
          portion: "100g",
          calories: 800,
          protein: 50,
          carbs: 10,
          fat: 40,
          items: [
            {
              foodId: "custom_cereal_1",
              name: "Cereal Personalizado Seguro",
              portion: "100g",
              portionGrams: 100,
              unit: "g",
              calories: 800,
              protein: 50,
              carbs: 10,
              fat: 40,
            },
          ],
        },
        alternatives: [],
      };

      const result = validateDietPlan(
        [deviatingMeal],
        { calories: 500, protein: 30, carbs: 50, fat: 15 },
        { availableFoodsCatalog: [customFood] },
      );

      const codes = result.issues.map((i) => i.code);
      expect(codes).toContain("CALORIE_DEVIATION");
      expect(codes).toContain("PROTEIN_DEVIATION");
      expect(codes).toContain("CARBS_DEVIATION");
      expect(codes).toContain("FAT_DEVIATION");
      expect(result.status).toBe("requires_review");
    });

    it("evaluates alternative option caloric divergence (> 25%) and computes worstCaseAlternativeTotals", () => {
      const mealWithDivergentAlt: Meal = {
        mealName: "Almoço",
        time: "12:30",
        calories: 400,
        protein: 30,
        carbs: 40,
        fat: 10,
        mainOption: {
          name: "Frango com arroz",
          portion: "200g",
          calories: 400,
          protein: 30,
          carbs: 40,
          fat: 10,
          micros: { sodium: 300 },
          items: [],
        },
        alternatives: [
          {
            name: "Lanche rápido super calórico",
            portion: "150g",
            calories: 650, // +62.5% divergence from 400!
            protein: 20,
            carbs: 80,
            fat: 25,
            micros: { sodium: 800 },
            items: [],
          },
        ],
      };

      const result = validateDietPlan([mealWithDivergentAlt], {
        calories: 400,
        protein: 30,
        carbs: 40,
        fat: 10,
      });

      const altIssue = result.issues.find(
        (i) => i.code === "ALTERNATIVE_CALORIE_DEVIATION",
      );
      expect(altIssue).toBeDefined();
      expect(altIssue?.details?.alternativeName).toBe(
        "Lanche rápido super calórico",
      );
      expect(altIssue?.details?.percentDiff).toBe(63);

      const altMacroIssue = result.issues.find(
        (i) => i.code === "ALTERNATIVE_MACRO_DEVIATION",
      );
      expect(altMacroIssue).toBeDefined();
      expect(altMacroIssue?.details?.nutrient).toBe("protein");

      expect(result.worstCaseAlternativeTotals).toEqual({
        minCalories: 400,
        maxCalories: 650,
        worstCaseSodium: 800,
      });

      const worstCaseIssue = result.issues.find(
        (i) => i.code === "WORST_CASE_ALTERNATIVE_DEVIATION",
      );
      expect(worstCaseIssue).toBeDefined();
    });

    it("rejects non-finite and negative target or nutrient values with error status", () => {
      const corruptedMeal: Meal = {
        mealName: "Jantar",
        time: "20:00",
        calories: 300,
        protein: 20,
        carbs: 30,
        fat: 10,
        mainOption: {
          name: "Sopa",
          portion: "100g",
          calories: 300,
          protein: 20,
          carbs: 30,
          fat: 10,
          items: [
            {
              foodId: "custom_cereal_1",
              name: "Cereal",
              portion: "100g",
              portionGrams: -50, // NEGATIVE!
              unit: "g",
              calories: NaN, // NaN!
              protein: 10,
              carbs: 20,
              fat: 5,
            },
          ],
        },
        alternatives: [],
      };

      const result = validateDietPlan(
        [corruptedMeal],
        { calories: 300, protein: 20, carbs: 30, fat: 10 },
        { availableFoodsCatalog: [customFood] },
      );

      expect(result.status).toBe("infeasible");
      expect(result.isApproved).toBe(false);
      const invalidValueIssue = result.issues.find(
        (i) => i.code === "INVALID_NUTRIENT_VALUE",
      );
      expect(invalidValueIssue).toBeDefined();
      expect(invalidValueIssue?.level).toBe("error");
    });

    it("verifies that portion rounding in generation has zero drift with calculated nutrients", () => {
      const plan = generateAlgorithmicDietPlan({
        ...defaultParams,
        seed: 42,
      });

      plan.meals.forEach((meal) => {
        meal.mainOption.items?.forEach((item) => {
          expect(Number.isInteger(item.portionGrams)).toBe(true);
          const food = getRequiredFood(item);
          const factor =
            (item.portionGrams || 0) / (Number(food.portion) || 100);
          const expectedCalories = Math.round(food.calories * factor);
          expect(item.calories).toBe(expectedCalories);
        });
      });
    });
  });

  // R07 (11.3 R07-A/B): combined macros. Expected values are literal
  // fixtures (min/max of the options per meal, summed), never recomputed.
  describe("R07 — worst-case macro combinations", () => {
    type M = { kcal: number; p: number; c: number; f: number };
    const option = (name: string, m: M) => ({
      name,
      portion: "1 porção",
      calories: m.kcal,
      protein: m.p,
      carbs: m.c,
      fat: m.f,
      items: [],
    });
    const meal = (name: string, main: M, alts: M[] = []): Meal => ({
      mealName: name,
      time: "08:00",
      calories: main.kcal,
      protein: main.p,
      carbs: main.c,
      fat: main.f,
      mainOption: option(`${name} principal`, main),
      alternatives: alts.map((a, i) => option(`${name} alt ${i + 1}`, a)),
    });
    const run = (
      meals: Meal[],
      t: { protein: number; carbs: number; fat: number },
      tolerances?: Record<string, number>,
    ) =>
      validateDietPlan(
        meals,
        { calories: 1000, ...t },
        tolerances ? { tolerances } : undefined,
      );
    const find = (r: ReturnType<typeof run>, code: string) =>
      r.issues.find((i) => i.code === code);

    it("R07-A: 100 g target, 20% tolerance, main 119 g, alternative 124 g → daily worst-case alert", () => {
      const r = run(
        [
          meal("Almoço", { kcal: 1000, p: 119, c: 100, f: 30 }, [
            { kcal: 1000, p: 124, c: 100, f: 30 },
          ]),
        ],
        { protein: 100, carbs: 100, fat: 30 },
      );
      expect(find(r, "WORST_CASE_PROTEIN_DEVIATION")).toMatchObject({
        level: "warning",
        details: { min: 119, max: 124, target: 100 },
      });
      // The local difference (124 vs 119 = 4.2%) is under the 5% margin and
      // the main option alone (119 g, +19%) is within tolerance.
      expect(r.issues.filter((i) => i.code.startsWith("ALTERNATIVE_"))).toEqual(
        [],
      );
      expect(find(r, "PROTEIN_DEVIATION")).toBeUndefined();
    });

    const macros = [
      ["protein", "p", "WORST_CASE_PROTEIN_DEVIATION"],
      ["carbs", "c", "WORST_CASE_CARBS_DEVIATION"],
      ["fat", "f", "WORST_CASE_FAT_DEVIATION"],
    ] as const;
    for (const [target, key, code] of macros) {
      it(`R07-B ${target}: 120/80 g are within ±20% of 100 g; 121/79 g are not`, () => {
        const base: M = { kcal: 1000, p: 100, c: 100, f: 100 };
        const t = { protein: 100, carbs: 100, fat: 100 };
        const withAlt = (v: number) =>
          run([meal("Refeição", base, [{ ...base, [key]: v }])], t);
        expect(find(withAlt(120), code)).toBeUndefined();
        expect(find(withAlt(80), code)).toBeUndefined();
        expect(find(withAlt(121), code)?.details).toMatchObject({
          min: 100,
          max: 121,
          target: 100,
        });
        expect(find(withAlt(79), code)?.details).toMatchObject({
          min: 79,
          max: 100,
          target: 100,
        });
      });
    }

    it("R07-B several meals: the per-meal extremes are summed", () => {
      const t = { protein: 100, carbs: 100, fat: 30 };
      const main: M = { kcal: 500, p: 50, c: 50, f: 15 };
      const ok = run(
        [
          meal("A", main, [{ ...main, p: 60 }]),
          meal("B", main, [{ ...main, p: 60 }]),
        ],
        t,
      );
      expect(find(ok, "WORST_CASE_PROTEIN_DEVIATION")).toBeUndefined(); // max 120
      const over = run(
        [
          meal("A", main, [{ ...main, p: 60 }]),
          meal("B", main, [{ ...main, p: 61 }]),
        ],
        t,
      );
      expect(find(over, "WORST_CASE_PROTEIN_DEVIATION")?.details).toMatchObject(
        { min: 100, max: 121 },
      );
    });

    it("R07-B custom tolerance: 124 g passes with ±25% and legitimate alternatives get no alert", () => {
      const r = run(
        [
          meal("Almoço", { kcal: 1000, p: 119, c: 100, f: 30 }, [
            { kcal: 1000, p: 124, c: 100, f: 30 },
            { kcal: 1000, p: 110, c: 96, f: 29 },
          ]),
        ],
        { protein: 100, carbs: 100, fat: 30 },
        { proteinPercent: 25 },
      );
      expect(r.issues.filter((i) => i.code.startsWith("WORST_CASE_"))).toEqual(
        [],
      );
    });

    it("R07-B zero target: any amount in some combination asks for review; none when absent", () => {
      const t = { protein: 100, carbs: 100, fat: 0 };
      const main: M = { kcal: 1000, p: 100, c: 100, f: 0 };
      const flagged = run([meal("Almoço", main, [{ ...main, f: 3 }])], t);
      expect(find(flagged, "ZERO_TARGET_FAT")).toMatchObject({
        level: "warning",
        details: { max: 3 },
      });
      expect(find(flagged, "WORST_CASE_FAT_DEVIATION")).toBeUndefined();
      const clean = run([meal("Almoço", main, [{ ...main }])], t);
      expect(find(clean, "ZERO_TARGET_FAT")).toBeUndefined();
    });
  });

  describe("Passo P0: Regressões de Segurança Clínica e Alergias", () => {
    const baseTargets = {
      calories: 2000,
      protein: 150,
      carbs: 220,
      fat: 55,
    };
    const baseMealConfig: GenerationParams["mealPlanConfig"] = {
      dietType: "traditional",
      meals: [
        { name: "Café da Manhã", time: "08:00", caloriePercentage: 25 },
        { name: "Almoço", time: "12:30", caloriePercentage: 45 },
        { name: "Jantar", time: "19:30", caloriePercentage: 30 },
      ],
    };

    it("excludes foods matching foodAllergies during generation and logs EXCLUDE_ALLERGEN", () => {
      const result = generateAlgorithmicDietPlan({
        nutritionalTargets: baseTargets,
        mealPlanConfig: baseMealConfig,
        foodAllergies: "amendoim, camarão",
      });

      expect(["draft", "awaiting_review"]).toContain(result.status);
      const allergyLogs = result.decisionLog.filter(
        (entry) => entry.code === "EXCLUDE_ALLERGEN",
      );
      expect(allergyLogs.length).toBeGreaterThanOrEqual(1);

      // Verify none of the meals contain peanut or shrimp
      for (const meal of result.meals) {
        for (const item of meal.mainOption.items || []) {
          expect(item.name.toLowerCase()).not.toContain("amendoim");
          expect(item.name.toLowerCase()).not.toContain("camarão");
        }
      }
    });

    it("validateDietPlan flags food matching foodAllergies with ALLERGY_VIOLATION and marks status infeasible", () => {
      const peanutFood: Food = {
        id: "peanut_butter_test",
        name: "Pasta de Amendoim Integral",
        category: "Oleaginosas",
        portion: "30g",
        unit: "g",
        calories: 588,
        protein: 25,
        carbs: 20,
        fat: 50,
        fiber: 5,
        sodium: 10,
      };

      const mealWithAllergen: Meal = {
        mealName: "Café da Manhã",
        time: "08:00",
        calories: 588,
        protein: 25,
        carbs: 20,
        fat: 50,
        mainOption: {
          name: "Pasta de amendoim com torrada",
          portion: "30g",
          calories: 588,
          protein: 25,
          carbs: 20,
          fat: 50,
          items: [
            {
              foodId: "peanut_butter_test",
              name: "Pasta de Amendoim Integral",
              portion: "30g",
              portionGrams: 30,
              unit: "g",
              calories: 588,
              protein: 25,
              carbs: 20,
              fat: 50,
            },
          ],
        },
        alternatives: [],
      };

      const result = validateDietPlan(
        [mealWithAllergen],
        { calories: 588, protein: 25, carbs: 20, fat: 50 },
        {
          availableFoodsCatalog: [peanutFood],
          foodAllergies: "amendoim",
        },
      );

      expect(result.status).toBe("infeasible");
      expect(result.isApproved).toBe(false);
      expect(result.isStructurallyValid).toBe(false);
      const allergyIssue = result.issues.find(
        (issue) => issue.code === "ALLERGY_VIOLATION",
      );
      expect(allergyIssue).toBeDefined();
      expect(allergyIssue?.level).toBe("error");
    });

    it("initial plan from generateAlgorithmicDietPlan returns draft status and structural validity without auto-approval", () => {
      const result = generateAlgorithmicDietPlan({
        nutritionalTargets: baseTargets,
        mealPlanConfig: baseMealConfig,
      });

      expect(["draft", "awaiting_review"]).toContain(result.status);
      expect(result.validation.isApproved).toBe(false);
      expect(typeof result.validation.isStructurallyValid).toBe("boolean");
    });
  });

  describe("Passo P1: Inteligência Culinária, Arquétipos e Auto-Correção", () => {
    const fullDayConfig: GenerationParams["mealPlanConfig"] = {
      dietType: "traditional",
      meals: [
        { name: "Café da Manhã", time: "07:30", caloriePercentage: 20 },
        { name: "Lanche da Manhã", time: "10:30", caloriePercentage: 10 },
        { name: "Almoço", time: "12:30", caloriePercentage: 35 },
        { name: "Lanche da Tarde", time: "16:00", caloriePercentage: 15 },
        { name: "Jantar", time: "20:00", caloriePercentage: 20 },
      ],
    };
    const targets = {
      calories: 2000,
      protein: 150,
      carbs: 220,
      fat: 55,
    };

    it("respects culinary archetypes: no beans or heavy red meat at breakfast or snacks", () => {
      const result = generateAlgorithmicDietPlan({
        nutritionalTargets: targets,
        mealPlanConfig: fullDayConfig,
        seed: 42,
      });

      const breakfast = result.meals.find(
        (m) => m.mealName === "Café da Manhã",
      );
      const morningSnack = result.meals.find(
        (m) => m.mealName === "Lanche da Manhã",
      );
      const afternoonSnack = result.meals.find(
        (m) => m.mealName === "Lanche da Tarde",
      );

      expect(breakfast).toBeDefined();
      expect(morningSnack).toBeDefined();
      expect(afternoonSnack).toBeDefined();

      const forbiddenBreakfastSnack = [
        "feijão",
        "lentilha",
        "patinho",
        "alcatra",
        "picanha",
      ];

      const checkNoForbidden = (meal: Meal) => {
        const allOpts = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOpts) {
          for (const item of opt.items || []) {
            const lower = item.name.toLowerCase();
            for (const f of forbiddenBreakfastSnack) {
              expect(lower).not.toContain(f);
            }
          }
        }
      };

      checkNoForbidden(breakfast!);
      checkNoForbidden(morningSnack!);
      checkNoForbidden(afternoonSnack!);
    });

    it("strictly clamps oil and fat portions to culinary boundaries (<= 20ml/g)", () => {
      const result = generateAlgorithmicDietPlan({
        nutritionalTargets: targets,
        mealPlanConfig: fullDayConfig,
        seed: 123,
      });

      for (const meal of result.meals) {
        const allOpts = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOpts) {
          for (const item of opt.items || []) {
            const lower = item.name.toLowerCase();
            if (lower.includes("azeite") || lower.includes("óleo")) {
              expect(item.portionGrams).toBeLessThanOrEqual(20);
              expect(item.portionGrams).toBeGreaterThanOrEqual(5);
            }
          }
        }
      }
    });

    it("generates functionally equivalent alternatives with auto-correction keeping caloric divergence <= 20%", () => {
      const result = generateAlgorithmicDietPlan({
        nutritionalTargets: targets,
        mealPlanConfig: fullDayConfig,
        seed: 999,
      });

      for (const meal of result.meals) {
        const mainCal = meal.mainOption.calories;
        for (const alt of meal.alternatives) {
          const divergence = Math.abs(alt.calories - mainCal) / mainCal;
          expect(divergence).toBeLessThanOrEqual(0.2);
        }
      }
    });

    it("replaces arbitrary static string 'preparação saudável' with contextual preparation description", () => {
      const result = generateAlgorithmicDietPlan({
        nutritionalTargets: targets,
        mealPlanConfig: fullDayConfig,
        seed: 77,
      });

      for (const meal of result.meals) {
        expect(meal.mainOption.details).not.toBe("preparação saudável");
        expect(meal.mainOption.details).toBeTruthy();
      }
    });
  });
});
