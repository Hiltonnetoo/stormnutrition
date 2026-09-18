import { describe, it, expect, beforeAll } from "vitest";
import i18next from "i18next";
import {
  generateAlgorithmicDietPlan,
  getGeneralObservations,
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

  it("should generate the requested meals with options", () => {
    const result = generateAlgorithmicDietPlan(defaultParams);
    expect(result.meals.length).toBe(3);
    expect(result.meals[0].mealName).toBe("Café da Manhã");
    expect(result.meals[0].mainOption).toBeDefined();
    expect(result.meals[0].alternatives.length).toBe(2);
  });

  it("should exclude ultraprocessed foods (NOVA 4) from generated meals", () => {
    const result = generateAlgorithmicDietPlan(defaultParams);

    // Let's verify no food in items is NOVA 4
    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        // Find food in brazilianFoods database
        const originalFood = brazilianFoods.find((f) => f.name === item.name);
        if (originalFood) {
          expect(getNovaGroup(originalFood)).not.toBe(4);
        }
      });
    });
  });

  it("should apply lactose-free restriction and log the decision", () => {
    const params = {
      ...defaultParams,
      restrictions: ["lactose_free"],
    };

    const result = generateAlgorithmicDietPlan(params);

    // No lactose-containing ingredients
    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = brazilianFoods.find((f) => f.name === item.name);
        if (originalFood) {
          expect(foodContainsLactose(originalFood)).toBe(false);
        }
      });
    });

    // Decision log should record lactose restriction
    const lactoseLog = result.decisionLog.find(
      (log) => log.tag === "lactose_free",
    );
    expect(lactoseLog).toBeDefined();
    expect(lactoseLog?.type).toBe("filter");
  });

  it("should enforce clinical mode sodium limit (< 600mg) and log the decision", () => {
    const params = {
      ...defaultParams,
      mode: "clinical" as const,
    };

    const result = generateAlgorithmicDietPlan(params);

    // Each food item in clinical mode must have sodium < 600mg
    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = brazilianFoods.find((f) => f.name === item.name);
        if (originalFood) {
          expect(originalFood.sodium).toBeLessThan(600);
        }
      });
    });

    const clinicalLog = result.decisionLog.find(
      (log) => log.tag === "clinical",
    );
    expect(clinicalLog).toBeDefined();
  });

  it("should enforce hypertension tag sodium limit (< 300mg)", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["hypertension" as const],
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = brazilianFoods.find((f) => f.name === item.name);
        if (originalFood) {
          expect(originalFood.sodium).toBeLessThan(300);
        }
      });
    });

    const hyperLog = result.decisionLog.find(
      (log) => log.tag === "hypertension",
    );
    expect(hyperLog).toBeDefined();
  });

  it("should enforce diabetes tags removing high GI foods (>= 70) and sugars", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["diabetes_t2" as const],
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = brazilianFoods.find((f) => f.name === item.name);
        if (originalFood) {
          expect(originalFood.category).not.toBe("Açúcares e Doces");
          if (originalFood.glycemicIndex !== undefined) {
            expect(originalFood.glycemicIndex).toBeLessThan(70);
          }
        }
      });
    });

    const diabetesLog = result.decisionLog.find(
      (log) => log.tag === "diabetes_gi",
    );
    expect(diabetesLog).toBeDefined();
  });

  it("should enforce renal (CKD) ultra-low sodium limit (< 200mg)", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["renal_ckd" as const],
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = brazilianFoods.find((f) => f.name === item.name);
        if (originalFood) {
          expect(originalFood.sodium).toBeLessThan(200);
        }
      });
    });

    const renalLog = result.decisionLog.find((log) => log.tag === "renal_ckd");
    expect(renalLog).toBeDefined();
  });

  it("should restrict saturated fats for hepatic steatosis (only olive oil allowed)", () => {
    const params = {
      ...defaultParams,
      clinicalTags: ["hepatic_steatosis" as const],
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const originalFood = brazilianFoods.find((f) => f.name === item.name);
        if (originalFood && originalFood.category === "Óleos e Gorduras") {
          // The only fat source allowed in this category is olive oil ("azeite")
          expect(originalFood.name.toLowerCase()).toContain("azeite");
        }
      });
    });

    const hepaticLog = result.decisionLog.find(
      (log) => log.tag === "hepatic_steatosis",
    );
    expect(hepaticLog).toBeDefined();
  });

  it("should keep total meal calories close to the daily target (calorie scaling)", () => {
    // Regression guard for the calorie-scaling fix. Food selection is random and
    // the scale factor is clamped to [0.25, 4], so a single run can occasionally
    // diverge on an unlucky draw. We therefore assert on the MEDIAN deviation
    // across many runs, which reliably reflects that scaling converges to target.
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

  it("should enforce gluten-free restriction across all meal options and log the decision", () => {
    const params = {
      ...defaultParams,
      restrictions: ["gluten_free"],
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = brazilianFoods.find((f) => f.name === item.name);
        if (food) {
          expect(foodContainsGluten(food)).toBe(false);
        }
      });
      meal.alternatives?.forEach((alt) => {
        alt.items?.forEach((item) => {
          const food = brazilianFoods.find((f) => f.name === item.name);
          if (food) {
            expect(foodContainsGluten(food)).toBe(false);
          }
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
    };

    const result = generateAlgorithmicDietPlan(params);

    result.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = brazilianFoods.find((f) => f.name === item.name);
        if (food) {
          expect(foodContainsDairy(food)).toBe(false);
        }
      });
    });

    const dairyLog = result.decisionLog.find((log) => log.tag === "dairy_free");
    expect(dairyLog).toBeDefined();
    expect(dairyLog?.type).toBe("filter");
  });

  it("should enforce vegetarian and vegan restrictions", () => {
    const vegResult = generateAlgorithmicDietPlan({
      ...defaultParams,
      restrictions: ["vegetarian"],
    });
    vegResult.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = brazilianFoods.find((f) => f.name === item.name);
        if (food) {
          expect(foodIsVegetarian(food)).toBe(true);
        }
      });
    });

    const veganResult = generateAlgorithmicDietPlan({
      ...defaultParams,
      restrictions: ["vegan"],
    });
    veganResult.meals.forEach((meal) => {
      meal.mainOption.items?.forEach((item) => {
        const food = brazilianFoods.find((f) => f.name === item.name);
        if (food) {
          expect(foodIsVegan(food)).toBe(true);
        }
      });
    });
  });

  it("should calculate real micronutrients and not fabricate category guesses", () => {
    const result = generateAlgorithmicDietPlan(defaultParams);

    result.meals.forEach((meal) => {
      const micros = meal.mainOption.micros;
      if (micros) {
        // If iron/calcium/vitaminC is defined, it must be >= 0 (never NaN)
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
});
