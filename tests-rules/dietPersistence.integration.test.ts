import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { collection, doc, addDoc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { generateAlgorithmicDietPlan } from "../src/services/dietAlgorithmService";
import {
  validateAndSerializeDietPlan,
  validateAndSerializeDietUpdate,
} from "../src/services/dietService";
import { buildCustomLayoutPdfDocument } from "../src/utils/pdfExporter";
import type { DietPlan } from "../src/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const NUTRI_A = "nutritionistA";
const NUTRI_B = "nutritionistB";
const PATIENT_ID = "patient123";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-storm",
    firestore: {
      rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, `users/${NUTRI_A}`), {
      role: "nutritionist",
      email: "nutriA@test.com",
    });
    await setDoc(doc(db, `users/${NUTRI_B}`), {
      role: "nutritionist",
      email: "nutriB@test.com",
    });
  });
});

describe("Diet Persistence Contract - Firestore Integration", () => {
  it("generates and saves a diet plan without clinical warnings into the emulator cleanly", async () => {
    // 1. Generate plan using the real algorithmic service with no clinical tags
    const result = generateAlgorithmicDietPlan({
      nutritionalTargets: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 67,
      },
      mealPlanConfig: {
        dietType: "traditional",
        meals: [
          { name: "Café da Manhã", time: "08:00", caloriePercentage: 25 },
          { name: "Almoço", time: "12:30", caloriePercentage: 35 },
          { name: "Jantar", time: "19:30", caloriePercentage: 40 },
        ],
      },
      mode: "general",
      clinicalTags: [],
    });

    const fullPlan: DietPlan = {
      version: 2,
      patientId: PATIENT_ID,
      patientName: "Paciente Teste Sem Avisos",
      mode: "general",
      createdAt: new Date().toISOString(),
      durationDays: 30,
      startDate: "2026-09-18",
      dailyCalories: 2000,
      macronutrients: {
        proteinGrams: 150,
        proteinPercentage: 30,
        carbsGrams: 200,
        carbsPercentage: 40,
        fatGrams: 67,
        fatPercentage: 30,
      },
      meals: result.meals,
      decisionLog: result.decisionLog,
      waterRecommendationLiters: 2.5,
      generalObservations: ["Hidratação adequada"],
      dietType: "traditional",
    };

    // 2. Validate and convert to persistence DTO
    const dto = validateAndSerializeDietPlan(fullPlan);

    // 3. Write to Firestore emulator under authenticated nutritionist context
    const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
    const dietsCol = collection(nutriDb, "users", NUTRI_A, "diets");

    const docRef = await assertSucceeds(addDoc(dietsCol, dto));
    expect(docRef.id).toBeDefined();

    // 4. Read back and verify equivalence of relevant data
    const readSnap = await getDoc(
      doc(nutriDb, "users", NUTRI_A, "diets", docRef.id),
    );
    expect(readSnap.exists()).toBe(true);

    const data = readSnap.data()!;
    expect(data.patientId).toBe(PATIENT_ID);
    expect(data.patientName).toBe("Paciente Teste Sem Avisos");
    expect(data.dailyCalories).toBe(2000);
    expect(data.durationDays).toBe(30);
    expect(data.meals).toHaveLength(3);

    // Ensure items do not contain undefined values
    for (const meal of data.meals) {
      expect(meal.mainOption).toBeDefined();
      for (const item of meal.mainOption.items || []) {
        expect(item.name).toBeDefined();
        expect(item.calories).toBeGreaterThan(0);
        // clinicalWarnings should be omitted rather than undefined
        expect(item.clinicalWarnings).toBeUndefined();
        expect("clinicalWarnings" in item).toBe(false);
      }
    }
  });

  it("persists clinical warnings when generated for clinical conditions (e.g. hypertension)", async () => {
    const result = generateAlgorithmicDietPlan({
      nutritionalTargets: {
        calories: 1800,
        protein: 130,
        carbs: 180,
        fat: 60,
      },
      mealPlanConfig: {
        dietType: "traditional",
        meals: [
          { name: "Almoço", time: "12:00", caloriePercentage: 50 },
          { name: "Jantar", time: "20:00", caloriePercentage: 50 },
        ],
      },
      mode: "clinical",
      clinicalTags: ["hypertension"],
    });

    const planWithWarnings: DietPlan = {
      version: 2,
      patientId: PATIENT_ID,
      patientName: "Paciente com Hipertensão",
      mode: "clinical",
      clinicalTags: ["hypertension"],
      createdAt: new Date().toISOString(),
      durationDays: 14,
      startDate: "2026-09-18",
      dailyCalories: 1800,
      macronutrients: {
        proteinGrams: 130,
        proteinPercentage: 30,
        carbsGrams: 180,
        carbsPercentage: 40,
        fatGrams: 60,
        fatPercentage: 30,
      },
      meals: result.meals,
      decisionLog: result.decisionLog,
      waterRecommendationLiters: 2.0,
      generalObservations: ["Controle de sódio"],
      dietType: "traditional",
    };

    const dto = validateAndSerializeDietPlan(planWithWarnings);
    const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
    const docRef = await assertSucceeds(
      addDoc(collection(nutriDb, "users", NUTRI_A, "diets"), dto),
    );

    const snap = await getDoc(
      doc(nutriDb, "users", NUTRI_A, "diets", docRef.id),
    );
    expect(snap.exists()).toBe(true);
    const data = snap.data()!;
    expect(data.clinicalTags).toEqual(["hypertension"]);
  });

  it("updates an existing diet plan preserving existing fields and rejecting invalid updates", async () => {
    const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
    const dietsCol = collection(nutriDb, "users", NUTRI_A, "diets");

    // Initial creation
    const initialPlan: DietPlan = {
      version: 2,
      patientId: PATIENT_ID,
      patientName: "Carlos Edição",
      mode: "general",
      createdAt: new Date().toISOString(),
      durationDays: 7,
      startDate: "2026-09-18",
      dailyCalories: 2000,
      macronutrients: {
        proteinGrams: 150,
        proteinPercentage: 30,
        carbsGrams: 200,
        carbsPercentage: 40,
        fatGrams: 67,
        fatPercentage: 30,
      },
      meals: [
        {
          mealName: "Almoço",
          time: "12:00",
          calories: 800,
          protein: 50,
          carbs: 80,
          fat: 25,
          mainOption: {
            name: "Frango com arroz",
            portion: "Prato",
            calories: 800,
            protein: 50,
            carbs: 80,
            fat: 25,
          },
          alternatives: [],
        },
      ],
      waterRecommendationLiters: 2.0,
      generalObservations: ["Inicial"],
      dietType: "traditional",
    };

    const docRef = await assertSucceeds(
      addDoc(dietsCol, validateAndSerializeDietPlan(initialPlan)),
    );

    // Update with valid DTO
    const updateDto = validateAndSerializeDietUpdate({
      dailyCalories: 2200,
      durationDays: 14,
      generalObservations: ["Atualizado para fase de ganho"],
    });

    await assertSucceeds(
      updateDoc(doc(nutriDb, "users", NUTRI_A, "diets", docRef.id), updateDto),
    );

    // Check updated values
    const updatedSnap = await getDoc(
      doc(nutriDb, "users", NUTRI_A, "diets", docRef.id),
    );
    const data = updatedSnap.data()!;
    expect(data.dailyCalories).toBe(2200);
    expect(data.durationDays).toBe(14);
    expect(data.generalObservations).toEqual(["Atualizado para fase de ganho"]);
    // Original meals were preserved
    expect(data.meals).toHaveLength(1);
    expect(data.patientName).toBe("Carlos Edição");
  });

  it("Passo C05 regression: updates meals, totals, validation, and traceability together and produces consistent PDF", async () => {
    const nutriDb = testEnv.authenticatedContext(NUTRI_A).firestore();
    const dietsCol = collection(nutriDb, "users", NUTRI_A, "diets");

    // 1. Initial Plan A with 2000 kcal meals and metadata
    const planA: DietPlan = {
      version: 2,
      patientId: "patient-c05",
      patientName: "Paciente C05 Regressao",
      mode: "general",
      createdAt: new Date().toISOString(),
      durationDays: 30,
      startDate: "2026-09-18",
      dailyCalories: 2000,
      macronutrients: {
        proteinGrams: 150,
        proteinPercentage: 30,
        carbsGrams: 200,
        carbsPercentage: 40,
        fatGrams: 67,
        fatPercentage: 30,
      },
      meals: [
        {
          mealName: "Almoço Inicial",
          time: "12:00",
          calories: 1100,
          protein: 80,
          carbs: 110,
          fat: 35,
          mainOption: {
            name: "Frango com Batata",
            portion: "Prato cheio",
            calories: 1100,
            protein: 80,
            carbs: 110,
            fat: 35,
          },
          alternatives: [],
        },
        {
          mealName: "Jantar Inicial",
          time: "19:30",
          calories: 900,
          protein: 70,
          carbs: 90,
          fat: 32,
          mainOption: {
            name: "Carne com Arroz",
            portion: "Prato médio",
            calories: 900,
            protein: 70,
            carbs: 90,
            fat: 32,
          },
          alternatives: [],
        },
      ],
      calculatedTotals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 67,
      },
      validation: {
        status: "valid",
        isApproved: true,
        issues: [],
        calculatedTotals: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 67,
        },
        deviations: {
          caloriesDiff: 0,
          caloriesPercent: 0,
          proteinDiff: 0,
          proteinPercent: 0,
          carbsDiff: 0,
          carbsPercent: 0,
          fatDiff: 0,
          fatPercent: 0,
        },
      },
      algorithmVersion: "2.1.0",
      datasetVersion: "tbca-2026.1",
      seed: 98765,
      waterRecommendationLiters: 2.5,
      generalObservations: ["Plano inicial gerado pelo algoritmo"],
      dietType: "traditional",
    };

    const docRef = await assertSucceeds(
      addDoc(dietsCol, validateAndSerializeDietPlan(planA)),
    );

    // 2. Update to Plan B with new meals totaling 1400 kcal
    const newMeals = [
      {
        mealName: "Café Leve",
        time: "08:00",
        calories: 500,
        protein: 40,
        carbs: 50,
        fat: 15,
        mainOption: {
          name: "Ovos com Torrada",
          portion: "2 ovos + 2 torradas",
          calories: 500,
          protein: 40,
          carbs: 50,
          fat: 15,
        },
        alternatives: [],
      },
      {
        mealName: "Almoço Leve",
        time: "12:30",
        calories: 900,
        protein: 70,
        carbs: 90,
        fat: 30,
        mainOption: {
          name: "Peixe com Legumes",
          portion: "1 filé grande",
          calories: 900,
          protein: 70,
          carbs: 90,
          fat: 30,
        },
        alternatives: [],
      },
    ];

    const updateDto = validateAndSerializeDietUpdate({
      meals: newMeals,
      dailyCalories: 2000,
      macronutrients: planA.macronutrients,
      algorithmVersion: planA.algorithmVersion,
      datasetVersion: planA.datasetVersion,
      seed: planA.seed,
    });

    await assertSucceeds(
      updateDoc(doc(nutriDb, "users", NUTRI_A, "diets", docRef.id), updateDto),
    );

    // 3. Read back from Firestore and verify complete coherence
    const updatedSnap = await getDoc(
      doc(nutriDb, "users", NUTRI_A, "diets", docRef.id),
    );
    expect(updatedSnap.exists()).toBe(true);
    const data = updatedSnap.data()!;

    // Meals match Plan B
    expect(data.meals).toHaveLength(2);
    expect(data.meals[0].mealName).toBe("Café Leve");
    expect(data.meals[1].mealName).toBe("Almoço Leve");

    // Calculated totals match Plan B (1400 kcal, NOT the stale 2000 kcal)
    expect(data.calculatedTotals).toBeDefined();
    expect(data.calculatedTotals.calories).toBe(1400);
    expect(data.calculatedTotals.protein).toBe(110);
    expect(data.calculatedTotals.carbs).toBe(140);
    expect(data.calculatedTotals.fat).toBe(45);

    // Validation metadata recalculated against target (1400 - 2000 = -600 kcal)
    expect(data.validation).toBeDefined();
    expect(data.validation.calculatedTotals.calories).toBe(1400);
    expect(data.validation.deviations.caloriesDiff).toBe(-600);

    // Traceability metadata records manual edit truthfully
    expect(data.isManuallyEdited).toBe(true);
    expect(typeof data.editedAt).toBe("string");
    expect(data.seed).toBe(98765);
    expect(data.algorithmVersion).toBe("2.1.0");
    expect(data.datasetVersion).toBe("tbca-2026.1");

    // 4. Verify that exported PDF reflects Plan B (1400 kcal), not Plan A (2000 kcal)
    const readPlan: DietPlan = {
      ...data,
      id: docRef.id,
    } as DietPlan;
    const pdfDoc = buildCustomLayoutPdfDocument(readPlan, undefined, {
      locale: "pt",
    });
    const pdfText = pdfDoc.output();
    expect(pdfText).toContain("1400 kcal");
    expect(pdfText).toContain("Edi"); // "Edição Manual • Totais vs Metas"
  });

  it("forbids an unrelated nutritionist from reading or modifying another nutritionist's diet plans", async () => {
    const nutriADb = testEnv.authenticatedContext(NUTRI_A).firestore();
    const nutriBDb = testEnv.authenticatedContext(NUTRI_B).firestore();

    // Nutri A creates a diet
    const plan: DietPlan = {
      version: 2,
      patientId: "patient-isolated",
      patientName: "Privado",
      mode: "general",
      createdAt: new Date().toISOString(),
      durationDays: 7,
      startDate: "2026-09-18",
      dailyCalories: 1500,
      macronutrients: {
        proteinGrams: 100,
        proteinPercentage: 30,
        carbsGrams: 150,
        carbsPercentage: 40,
        fatGrams: 50,
        fatPercentage: 30,
      },
      meals: [
        {
          mealName: "Lanche",
          time: "15:00",
          calories: 300,
          protein: 20,
          carbs: 30,
          fat: 10,
          mainOption: {
            name: "Iogurte",
            portion: "1 pote",
            calories: 300,
            protein: 20,
            carbs: 30,
            fat: 10,
          },
          alternatives: [],
        },
      ],
      waterRecommendationLiters: 1.5,
      generalObservations: [],
      dietType: "traditional",
    };

    const docRef = await addDoc(
      collection(nutriADb, "users", NUTRI_A, "diets"),
      validateAndSerializeDietPlan(plan),
    );

    // Nutri B tries to read Nutri A's diet
    await assertFails(
      getDoc(doc(nutriBDb, "users", NUTRI_A, "diets", docRef.id)),
    );

    // Nutri B tries to overwrite Nutri A's diet
    await assertFails(
      updateDoc(doc(nutriBDb, "users", NUTRI_A, "diets", docRef.id), {
        dailyCalories: 9999,
      }),
    );
  });
});
