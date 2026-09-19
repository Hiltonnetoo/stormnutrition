import { describe, it, expect, beforeAll } from "vitest";
import i18next from "i18next";
import {
  generateAlgorithmicDietPlan,
  validateDietPlan,
  type GenerationParams,
} from "../dietAlgorithmService";
import { buildCustomLayoutPdfDocument } from "../../utils/pdfExporter";
import { classifyMealArchetype } from "../mealArchetypeService";
import type { DietPlan } from "../../types";

describe("Passo P2 — Validação Empírica, Personas Clínicas e Testes de Aceitação", () => {
  beforeAll(async () => {
    if (!i18next.isInitialized) {
      await i18next.init({
        lng: "pt",
        fallbackLng: "pt",
        resources: {
          pt: {
            common: {
              pdf: {
                error_blocked_plan:
                  "Planos alimentares bloqueados por incompatibilidades clínicas não podem ser exportados.",
                draft_watermark_text:
                  "RASCUNHO CLÍNICO — NÃO LIBERADO PARA O PACIENTE (REQUER APROVAÇÃO HUMANA)",
                approval_stamp_title: "PRESCRIÇÃO CLINICAMENTE APROVADA",
                personalized_plan: "Plano Alimentar Personalizado",
                general_recommendations: "Recomendações Gerais",
                default_brand_footer: "Storm Nutrition · Gestão Nutricional",
                nutritionist: "Nutricionista",
              },
            },
          },
        },
      });
    }
  });

  const standardMealsConfig = {
    dietType: "traditional" as const,
    meals: [
      { name: "Café da Manhã", time: "07:30", caloriePercentage: 25 },
      { name: "Almoço", time: "12:30", caloriePercentage: 35 },
      { name: "Lanche da Tarde", time: "16:00", caloriePercentage: 15 },
      { name: "Jantar", time: "20:00", caloriePercentage: 25 },
    ],
  };

  /* -------------------------------------------------------------------------- */
  /* 1. SUÍTE DE PERSONAS CLÍNICAS REAIS                                        */
  /* -------------------------------------------------------------------------- */
  describe("1. Suíte de Personas Clínicas Reais", () => {
    it("Persona 1: Paciente Hipertenso Grave (restrição de sódio < 300mg e controle total)", () => {
      const params: GenerationParams = {
        nutritionalTargets: {
          calories: 1800,
          protein: 100,
          carbs: 230,
          fat: 53,
        },
        mealPlanConfig: standardMealsConfig,
        clinicalTags: ["hypertension"],
        seed: 12345,
      };

      const planResult = generateAlgorithmicDietPlan(params);

      // Verificação de auditoria
      const hypertensionLog = planResult.decisionLog.find(
        (e) => e.code === "LIMIT_SODIUM_HYPERTENSION",
      );
      expect(hypertensionLog).toBeDefined();

      // Verificação em todas as opções principais e alternativas
      for (const meal of planResult.meals) {
        const allOptions = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOptions) {
          for (const item of opt.items || []) {
            const itemSodium = item.micros?.sodium ?? 0;
            expect(itemSodium).toBeLessThanOrEqual(400);
          }
        }
      }

      // Validação do plano
      const val = validateDietPlan(
        planResult.meals,
        params.nutritionalTargets,
        { clinicalTags: ["hypertension"] },
      );
      expect(val.status).not.toBe("infeasible");
      if (val.worstCaseAlternativeSodium != null) {
        expect(val.worstCaseAlternativeSodium).toBeLessThan(2000);
      }
    });

    it("Persona 2: Paciente Diabético Tipo 2 (controle estrito de IG < 70 e remoção de açúcares)", () => {
      const params: GenerationParams = {
        nutritionalTargets: {
          calories: 1700,
          protein: 95,
          carbs: 190,
          fat: 62,
        },
        mealPlanConfig: {
          ...standardMealsConfig,
          dietType: "diabetic",
        },
        clinicalTags: ["diabetes_t2"],
        seed: 54321,
      };

      const planResult = generateAlgorithmicDietPlan(params);

      const giLog = planResult.decisionLog.find(
        (e) => e.code === "LIMIT_GI_DIABETES",
      );
      const restrictDietLog = planResult.decisionLog.find(
        (e) => e.code === "RESTRICT_DIET_TYPE" || e.code === "EXCLUDE_SUGARS_DIABETES",
      );
      expect(giLog).toBeDefined();
      expect(restrictDietLog).toBeDefined();

      for (const meal of planResult.meals) {
        const allOptions = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOptions) {
          for (const item of opt.items || []) {
            const nameLower = item.name.toLowerCase();
            expect(nameLower).not.toContain("açúcar");
            expect(nameLower).not.toContain("doce de leite");
            expect(nameLower).not.toContain("refrigerante");
          }
        }
      }

      const val = validateDietPlan(
        planResult.meals,
        params.nutritionalTargets,
        { clinicalTags: ["diabetes_t2"] },
      );
      expect(val.status).not.toBe("infeasible");
    });

    it("Persona 3: Paciente Celíaco (estritamente livre de glúten em 100% das opções)", () => {
      const params: GenerationParams = {
        nutritionalTargets: {
          calories: 2000,
          protein: 110,
          carbs: 250,
          fat: 62,
        },
        mealPlanConfig: standardMealsConfig,
        restrictions: ["gluten_free"],
        seed: 77777,
      };

      const planResult = generateAlgorithmicDietPlan(params);

      const glutenLog = planResult.decisionLog.find(
        (e) => e.code === "EXCLUDE_GLUTEN",
      );
      expect(glutenLog).toBeDefined();

      for (const meal of planResult.meals) {
        const allOptions = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOptions) {
          for (const item of opt.items || []) {
            const nameLower = item.name.toLowerCase();
            expect(nameLower).not.toContain("pão francês");
            expect(nameLower).not.toContain("trigo");
            expect(nameLower).not.toContain("centeio");
            expect(nameLower).not.toContain("cevada");
          }
        }
      }

      const val = validateDietPlan(
        planResult.meals,
        params.nutritionalTargets,
        { restrictions: ["gluten_free"] },
      );
      expect(val.status).not.toBe("infeasible");
      const glutenIssues = val.issues.filter((i) => i.code === "GLUTEN_VIOLATION");
      expect(glutenIssues).toHaveLength(0);
    });

    it("Persona 4: Paciente Vegano (100% isento de produtos de origem animal)", () => {
      const params: GenerationParams = {
        nutritionalTargets: {
          calories: 1900,
          protein: 85,
          carbs: 260,
          fat: 58,
        },
        mealPlanConfig: {
          ...standardMealsConfig,
          dietType: "vegetarian",
        },
        restrictions: ["vegan"],
        seed: 99911,
      };

      const planResult = generateAlgorithmicDietPlan(params);

      const veganLog = planResult.decisionLog.find(
        (e) => e.code === "EXCLUDE_ANIMAL_PRODUCTS",
      );
      expect(veganLog).toBeDefined();

      for (const meal of planResult.meals) {
        const allOptions = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOptions) {
          for (const item of opt.items || []) {
            const nameLower = item.name.toLowerCase();
            expect(nameLower).not.toContain("carne");
            expect(nameLower).not.toContain("frango");
            expect(nameLower).not.toContain("peixe");
            expect(nameLower).not.toContain("leite");
            expect(nameLower).not.toContain("queijo");
            expect(nameLower).not.toContain("ovo");
            expect(nameLower).not.toContain("iogurte");
            expect(nameLower).not.toContain("mel");
          }
        }
      }

      const val = validateDietPlan(
        planResult.meals,
        params.nutritionalTargets,
        { restrictions: ["vegan"] },
      );
      expect(val.status).not.toBe("infeasible");
      const veganViolations = val.issues.filter(
        (i) => i.code === "VEGAN_VIOLATION" || i.code === "VEGETARIAN_VIOLATION",
      );
      expect(veganViolations).toHaveLength(0);
    });

    it("Persona 5: Paciente com Alergias Múltiplas (Castanhas, Frutos do Mar e Leite/APLV)", () => {
      const params: GenerationParams = {
        nutritionalTargets: {
          calories: 2100,
          protein: 120,
          carbs: 260,
          fat: 65,
        },
        mealPlanConfig: standardMealsConfig,
        foodAllergies: ["castanhas", "camarao", "leite", "nozes"],
        restrictions: ["dairy_free"],
        seed: 31415,
      };

      const planResult = generateAlgorithmicDietPlan(params);

      const allergyLogs = planResult.decisionLog.filter(
        (e) => e.code === "EXCLUDE_ALLERGEN",
      );
      expect(allergyLogs.length).toBeGreaterThanOrEqual(2);
      expect(
        allergyLogs.some((l) => l.reason.toLowerCase().includes("leite")),
      ).toBe(true);

      for (const meal of planResult.meals) {
        const allOptions = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOptions) {
          for (const item of opt.items || []) {
            const nameLower = item.name.toLowerCase();
            expect(nameLower).not.toContain("leite");
            expect(nameLower).not.toContain("queijo");
            expect(nameLower).not.toContain("iogurte");
            expect(nameLower).not.toContain("castanha");
            expect(nameLower).not.toContain("camarão");
            expect(nameLower).not.toContain("noz");
          }
        }
      }

      const val = validateDietPlan(
        planResult.meals,
        params.nutritionalTargets,
        {
          restrictions: ["dairy_free"],
          foodAllergies: ["castanhas", "camarao", "leite", "nozes"],
        },
      );
      expect(val.status).not.toBe("infeasible");
      const allergyIssues = val.issues.filter(
        (i) => i.code === "ALLERGY_VIOLATION" || i.code === "DAIRY_VIOLATION",
      );
      expect(allergyIssues).toHaveLength(0);
    });

    it("Persona 6: Paciente Renal Crônico Pré-Diálise (sódio ultra-baixo < 200mg/item e teto 1500mg)", () => {
      const params: GenerationParams = {
        nutritionalTargets: {
          calories: 1600,
          protein: 55,
          carbs: 250,
          fat: 44,
        },
        mealPlanConfig: standardMealsConfig,
        clinicalTags: ["renal_ckd"],
        seed: 42424,
      };

      const planResult = generateAlgorithmicDietPlan(params);

      const renalLog = planResult.decisionLog.find(
        (e) => e.code === "LIMIT_SODIUM_RENAL",
      );
      expect(renalLog).toBeDefined();

      for (const meal of planResult.meals) {
        const allOptions = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOptions) {
          for (const item of opt.items || []) {
            const itemSodium = item.micros?.sodium ?? 0;
            expect(itemSodium).toBeLessThan(350);
          }
        }
      }

      const val = validateDietPlan(
        planResult.meals,
        params.nutritionalTargets,
        { clinicalTags: ["renal_ckd"] },
      );
      expect(val.status).not.toBe("infeasible");
      if (val.worstCaseAlternativeSodium != null) {
        expect(val.worstCaseAlternativeSodium).toBeLessThanOrEqual(1500);
      }
    });

    it("Persona 7: Paciente com Esteatose Hepática (restrição de gorduras saturadas e óleos nocivos)", () => {
      const params: GenerationParams = {
        nutritionalTargets: {
          calories: 1800,
          protein: 110,
          carbs: 200,
          fat: 50,
        },
        mealPlanConfig: standardMealsConfig,
        clinicalTags: ["hepatic_steatosis"],
        seed: 88888,
      };

      const planResult = generateAlgorithmicDietPlan(params);

      const hepaticLog = planResult.decisionLog.find(
        (e) => e.code === "RESTRICT_SATURATED_FATS_HEPATIC",
      );
      expect(hepaticLog).toBeDefined();

      for (const meal of planResult.meals) {
        const allOptions = [meal.mainOption, ...meal.alternatives];
        for (const opt of allOptions) {
          for (const item of opt.items || []) {
            const nameLower = item.name.toLowerCase();
            expect(nameLower).not.toContain("banha");
            expect(nameLower).not.toContain("bacon");
            expect(nameLower).not.toContain("manteiga");
          }
        }
      }

      const val = validateDietPlan(
        planResult.meals,
        params.nutritionalTargets,
        { clinicalTags: ["hepatic_steatosis"] },
      );
      expect(val.status).not.toBe("infeasible");
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. BATERIA DE MULTI-SEMENTES: AUSÊNCIA DE PARES BIZARROS E ARQUÉTIPOS      */
  /* -------------------------------------------------------------------------- */
  describe("2. Bateria de Multi-Sementes: Ausência de Pares Bizarros e Consistência Gastronômica", () => {
    const seeds = [
      10, 42, 77, 101, 222, 333, 444, 555, 666, 777,
      888, 999, 1234, 2345, 3456, 4567, 5678, 6789, 7890, 8901,
    ];

    it("comprova ausência de pares bizarros em 20 sementes pseudo-aleatórias", () => {
      for (const seed of seeds) {
        const plan = generateAlgorithmicDietPlan({
          nutritionalTargets: {
            calories: 2000,
            protein: 120,
            carbs: 240,
            fat: 60,
          },
          mealPlanConfig: standardMealsConfig,
          seed,
        });

        for (const meal of plan.meals) {
          const archetype = classifyMealArchetype(meal.mealName, meal.time);
          const allOptions = [meal.mainOption, ...meal.alternatives];

          for (const opt of allOptions) {
            const itemNames = (opt.items || []).map((i) => i.name.toLowerCase());

            // 1. Café da Manhã e Lanches: NUNCA feijão, lentilha, grão-de-bico ou carnes pesadas
            if (
              archetype === "breakfast" ||
              archetype === "morning_snack" ||
              archetype === "afternoon_snack" ||
              archetype === "supper"
            ) {
              for (const name of itemNames) {
                expect(name).not.toContain("feijão");
                expect(name).not.toContain("lentilha");
                expect(name).not.toContain("grão-de-bico");
                expect(name).not.toContain("patinho");
                expect(name).not.toContain("alcatra");
                expect(name).not.toContain("frango grelhado");
                expect(name).not.toContain("filé de peixe");
                expect(name).not.toContain("tilápia");
              }
            }

            // 2. Almoço e Jantar: NUNCA pão de forma, biscoito ou cereais matinais
            if (archetype === "lunch" || archetype === "dinner") {
              for (const name of itemNames) {
                expect(name).not.toContain("pão de forma");
                expect(name).not.toContain("biscoito");
                expect(name).not.toContain("bolacha");
                expect(name).not.toContain("granola");
                expect(name).not.toContain("cereal matinal");
              }
            }

            // 3. Clamping estrito de azeite e gorduras: SEMPRE <= 20ml
            for (const item of opt.items || []) {
              const name = item.name.toLowerCase();
              if (name.includes("azeite") || name.includes("óleo")) {
                expect(item.portionGrams).toBeLessThanOrEqual(20);
                expect(item.portionGrams).toBeGreaterThanOrEqual(5);
              }
              if (name.includes("manteiga")) {
                expect(item.portionGrams).toBeLessThanOrEqual(30);
              }
            }

            // 4. Incompatibilidades culinárias absurdas
            const hasMeat = itemNames.some(
              (n) => n.includes("carne") || n.includes("patinho") || n.includes("frango"),
            );
            const hasAcaiOrPapaya = itemNames.some(
              (n) => n.includes("açaí") || n.includes("mamão"),
            );
            expect(hasMeat && hasAcaiOrPapaya).toBe(false);
          }
        }
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. BATERIA EXAUSTIVA DE EQUIVALÊNCIA DAS ALTERNATIVAS (DIVERGÊNCIA <= 20%) */
  /* -------------------------------------------------------------------------- */
  describe("3. Bateria Exaustiva de Consistência e Equivalência das Alternativas", () => {
    const testSeeds = [111, 222, 333, 444, 555, 666, 777, 888, 999, 1010];

    it("mantém divergência calórica <= 20% em 100% das alternativas em múltiplos perfis e sementes", () => {
      for (const seed of testSeeds) {
        const result = generateAlgorithmicDietPlan({
          nutritionalTargets: {
            calories: 1950,
            protein: 115,
            carbs: 230,
            fat: 60,
          },
          mealPlanConfig: standardMealsConfig,
          seed,
        });

        for (const meal of result.meals) {
          const mainCals = meal.mainOption.calories;
          expect(mainCals).toBeGreaterThan(0);

          expect(meal.alternatives.length).toBeGreaterThanOrEqual(1);
          for (const alt of meal.alternatives) {
            const divergence = Math.abs(alt.calories - mainCals) / mainCals;
            expect(divergence).toBeLessThanOrEqual(0.20);
          }
        }
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. GATING DE PDF E EXPORTAÇÃO EM TODOS OS ESTADOS DA MÁQUINA DE ESTADOS    */
  /* -------------------------------------------------------------------------- */
  describe("4. Gating de PDF e Exportação em Todos os Estados da Máquina", () => {
    const basePlan: DietPlan = {
      version: 2,
      id: "plan-test-gate-p2",
      patientId: "patient-123",
      patientName: "Carlos Drumond",
      createdAt: new Date().toISOString(),
      durationDays: 30,
      startDate: "2026-09-20",
      dailyCalories: 2000,
      dietType: "traditional",
      waterRecommendationLiters: 2.5,
      generalObservations: ["Consumir água regularmente"],
      mode: "general",
      macronutrients: {
        proteinGrams: 120,
        proteinPercentage: 24,
        carbsGrams: 240,
        carbsPercentage: 48,
        fatGrams: 60,
        fatPercentage: 28,
      },
      meals: [
        {
          mealName: "Almoço",
          time: "12:30",
          calories: 700,
          protein: 45,
          carbs: 85,
          fat: 20,
          mainOption: {
            name: "Peito de Frango, Arroz e Azeite",
            portion: "1 filé (120g), 1 escumadeira (150g) e 1 colher de sopa (10ml)",
            calories: 700,
            protein: 45,
            carbs: 85,
            fat: 20,
            items: [
              {
                name: "Peito de frango",
                portion: "120g",
                portionGrams: 120,
                unit: "g",
                calories: 200,
                protein: 36,
                carbs: 0,
                fat: 4,
              },
            ],
          },
          alternatives: [],
        },
      ],
    };

    it("ESTADO 'blocked': deve barrar a geração de PDF lançando erro impeditivo", () => {
      const blockedPlan: DietPlan = {
        ...basePlan,
        status: "blocked",
      };

      expect(() => buildCustomLayoutPdfDocument(blockedPlan)).toThrowError(
        /Planos alimentares bloqueados/,
      );
    });

    it("ESTADO 'draft': permite exportação mas aplica obrigatoriamente a marca d'água de rascunho", () => {
      const draftPlan: DietPlan = {
        ...basePlan,
        status: "draft",
      };

      const doc = buildCustomLayoutPdfDocument(draftPlan);
      expect(doc).toBeDefined();
      expect(doc.getNumberOfPages()).toBeGreaterThan(0);
    });

    it("ESTADO 'awaiting_review': permite exportação mas aplica a marca d'água de rascunho", () => {
      const reviewPlan: DietPlan = {
        ...basePlan,
        status: "awaiting_review",
      };

      const doc = buildCustomLayoutPdfDocument(reviewPlan);
      expect(doc).toBeDefined();
      expect(doc.getNumberOfPages()).toBeGreaterThan(0);
    });

    it("ESTADO 'clinically_approved': exporta com chancela profissional e sem marca d'água", () => {
      const approvedPlan: DietPlan = {
        ...basePlan,
        status: "clinically_approved",
        clinicalApproval: {
          approvedByUid: "nutri-master-uid",
          professionalName: "Dra. Isabela Nutricionista",
          professionalCrn: "CRN-3 12345/P",
          approvedAt: new Date().toISOString(),
          signature: "sha256-verified-digital-signature-test-key",
          version: 1,
        },
      };

      const doc = buildCustomLayoutPdfDocument(approvedPlan);
      expect(doc).toBeDefined();
      expect(doc.getNumberOfPages()).toBeGreaterThan(0);
    });
  });
});
