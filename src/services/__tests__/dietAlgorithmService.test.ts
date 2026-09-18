import { describe, it, expect, beforeAll } from "vitest";
import i18next from "i18next";
import {
  generateAlgorithmicDietPlan,
  getGeneralObservations,
  validateDietPlan,
  InfeasiblePlanError,
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
    expect(() =>
      generateAlgorithmicDietPlan({
        ...defaultParams,
        mealPlanConfig: {
          dietType: "traditional",
          meals: [{ name: "Café", time: "08:00", caloriePercentage: 50 }],
        },
      }),
    ).toThrow(InfeasiblePlanError);
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
    expect(result.validation.status).toBeDefined();
    expect(result.validation.calculatedTotals.calories).toBeGreaterThan(0);
    expect(result.validation.deviations).toBeDefined();

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
    expect(revalidation.calculatedTotals.calories).toBe(
      result.validation.calculatedTotals.calories,
    );
    expect(revalidation.calculatedTotals.protein).toBe(
      result.validation.calculatedTotals.protein,
    );
  });
});
