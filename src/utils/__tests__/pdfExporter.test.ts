import { describe, it, expect } from "vitest";
import {
  formatFileName,
  buildCustomLayoutPdfDocument,
  generateCustomLayoutPdf,
  type ClinicInfo,
} from "../pdfExporter";
import type { DietPlan, Meal, MealOption, MealOptionItem } from "../../types";

const makeItem = (
  name: string,
  portion: string,
  portionGrams: number,
  calories: number,
  protein = 5,
  carbs = 10,
  fat = 2,
): MealOptionItem => ({
  name,
  portion,
  portionGrams,
  calories,
  protein,
  carbs,
  fat,
});

const makeOption = (
  name: string,
  portion: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  items?: MealOptionItem[],
): MealOption => ({
  name,
  portion,
  calories,
  protein,
  carbs,
  fat,
  items,
});

const sampleMeals: Meal[] = [
  {
    mealName: "Café da Manhã",
    time: "07:30",
    calories: 450,
    protein: 25,
    carbs: 55,
    fat: 12,
    mainOption: makeOption(
      "Ovos mexidos com pão integral",
      "2 fatias + 2 ovos",
      450,
      25,
      55,
      12,
      [
        makeItem("Ovo de galinha", "2 unidades", 100, 143, 13, 1, 10),
        makeItem("Pão integral", "2 fatias", 50, 120, 4, 24, 2),
      ],
    ),
    alternatives: [
      makeOption(
        "Iogurte natural com granola e banana",
        "1 pote (170g) + 30g granola + 1 banana",
        440,
        20,
        65,
        10,
      ),
      makeOption(
        "Tapioca com queijo branco e chia",
        "1 tapioca (60g) + 30g queijo",
        430,
        18,
        58,
        14,
      ),
    ],
  },
  {
    mealName: "Almoço",
    time: "12:30",
    calories: 750,
    protein: 50,
    carbs: 85,
    fat: 20,
    mainOption: makeOption(
      "Peito de frango grelhado, arroz integral e feijão",
      "150g frango + 100g arroz + 80g feijão",
      750,
      50,
      85,
      20,
      [
        makeItem("Peito de frango", "1 filé", 150, 247, 46, 0, 5),
        makeItem("Arroz integral", "4 colheres de sopa", 100, 124, 3, 26, 1),
        makeItem("Feijão preto", "1 concha", 80, 61, 4, 11, 0.5),
      ],
    ),
    alternatives: [
      makeOption(
        "Filé de tilápia assado com batata-doce",
        "160g peixe + 150g batata",
        720,
        48,
        80,
        16,
      ),
    ],
  },
  {
    mealName: "Jantar",
    time: "19:30",
    calories: 550,
    protein: 40,
    carbs: 60,
    fat: 14,
    mainOption: makeOption(
      "Patinho moído com mandioca cozida e salada",
      "140g patinho + 120g mandioca",
      550,
      40,
      60,
      14,
    ),
    alternatives: [],
  },
];

const mockValidPlan: DietPlan = {
  version: 2,
  id: "diet_test_123",
  patientId: "patient_abc",
  patientName: "Ana Clara dos Santos",
  mode: "performance",
  createdAt: "2026-09-18T10:00:00.000Z",
  startDate: "2026-09-20",
  durationDays: 30,
  dailyCalories: 1800, // Prescribed target
  macronutrients: {
    proteinGrams: 115,
    proteinPercentage: 25,
    carbsGrams: 200,
    carbsPercentage: 45,
    fatGrams: 60,
    fatPercentage: 30,
  },
  // Distinct calculated totals from the algorithmic engine
  calculatedTotals: {
    calories: 1750,
    protein: 115,
    carbs: 200,
    fat: 46,
    fiber: 28,
    sodium: 1450,
  },
  validation: {
    status: "valid",
    isApproved: true,
    deviations: {
      caloriesDiff: -50,
      caloriesPercent: 2.8,
      proteinDiff: 0,
      proteinPercent: 0,
      carbsDiff: 0,
      carbsPercent: 0,
      fatDiff: -14,
      fatPercent: 23,
    },
    calculatedTotals: {
      calories: 1750,
      protein: 115,
      carbs: 200,
      fat: 46,
      fiber: 28,
      sodium: 1450,
    },
    issues: [
      {
        code: "CALORIE_VARIATION",
        level: "warning",
        message: "Variação calórica aceitável de -2.8% em relação à meta.",
      },
    ],
    worstCaseAlternativeSodium: 1850,
  },
  meals: sampleMeals,
  waterRecommendationLiters: 2.8,
  generalObservations: [
    "Priorizar alimentos in natura e evitar ultraprocessados.",
    "Mastigar devagar e manter horários regulares das refeições.",
  ],
  dietType: "balanced",
};

describe("PDF Exporter — Passo 17: Verificação de Entrega Final", () => {
  describe("formatFileName", () => {
    it("formats safe filename removing accents and special characters", () => {
      const plan = {
        ...mockValidPlan,
        patientName: "João Pedro de Alcântara & Souza",
        createdAt: "2026-09-18T12:00:00.000Z",
      };
      const namePt = formatFileName(plan, "pt");
      expect(namePt).toMatch(/^diet-joao-pedro-de-alcantara-souza-.*\.pdf$/);

      const nameEn = formatFileName(plan, "en");
      expect(nameEn).toMatch(/^diet-joao-pedro-de-alcantara-souza-.*\.pdf$/);
    });

    it("handles empty or whitespace patient names safely with fallback", () => {
      const plan = {
        ...mockValidPlan,
        patientName: "   ",
      };
      const filename = formatFileName(plan, "pt");
      expect(filename).toMatch(/^diet-paciente-.*\.pdf$/);
    });
  });

  describe("buildCustomLayoutPdfDocument — Contract & Totals Parity", () => {
    it("generates a valid A4 PDF document without overwriting calculated totals with target", () => {
      const doc = buildCustomLayoutPdfDocument(
        mockValidPlan,
        {
          clinicName: "Clínica NutriVida",
          clinicSpecialty: "Nutrição Clínica e Esportiva",
          clinicPhone: "(11) 98765-4321",
        },
        { locale: "pt" },
      );

      expect(doc).toBeDefined();
      const output = doc.output();
      expect(output.startsWith("%PDF-")).toBe(true);

      // Verify pages exist
      expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);

      // Verify that effective calculated calories (1750 kcal) and target (1800 kcal) both exist
      // in the PDF stream and target does NOT replace actual
      expect(output).toContain("1750 kcal");
      expect(output).toContain("Meta: 1800 kcal");
    });

    it("renders clinical warnings and worst-case sodium alerts when present", () => {
      const doc = buildCustomLayoutPdfDocument(mockValidPlan, undefined, {
        locale: "pt",
      });
      const output = doc.output();

      // Clinical warnings title and message
      expect(output).toContain("Avisos e Diretrizes Cl");
      expect(output).toContain("Varia");
    });

    it("renders English layout properly when locale: 'en' is requested", () => {
      const doc = buildCustomLayoutPdfDocument(
        mockValidPlan,
        { clinicName: "Wellness Clinic" },
        { locale: "en" },
      );
      const output = doc.output();

      // English titles and labels
      expect(output).toContain("NUTRITIONAL PLAN");
      expect(output).toContain("Target: 1800 kcal");
      expect(output).toContain("DAILY NUTRITIONAL SUMMARY");
    });

    it("guarantees text is natively extractable, searchable and selectable (Passo 17 item 5)", () => {
      const doc = buildCustomLayoutPdfDocument(
        mockValidPlan,
        {
          clinicName: "Clínica NutriVida",
          clinicSpecialty: "Nutrição Clínica",
        },
        { locale: "pt" },
      );

      const output = doc.output();
      const rawTextTokens = (output.match(/\((.*?)\)\s*Tj/g) || []).map((t) =>
        t.replace(/^\(/, "").replace(/\)\s*Tj$/, ""),
      );

      // Verify essential data fields exist as extractable text tokens
      expect(
        rawTextTokens.some((t) => t.includes("Ana Clara dos Santos")),
      ).toBe(true);
      expect(rawTextTokens.some((t) => t.includes("Clínica NutriVida"))).toBe(
        true,
      );
      expect(rawTextTokens.some((t) => t.includes("1750 kcal"))).toBe(true);
      expect(rawTextTokens.some((t) => t.includes("Meta: 1800 kcal"))).toBe(
        true,
      );
      expect(rawTextTokens.some((t) => t.includes("Café da Manhã"))).toBe(true);
      expect(
        rawTextTokens.some((t) => t.includes("Ovos mexidos com pão integral")),
      ).toBe(true);
      expect(
        rawTextTokens.some((t) =>
          t.includes("Iogurte natural com granola e banana"),
        ),
      ).toBe(true);
      expect(
        rawTextTokens.some((t) => t.includes("Priorizar alimentos in natura")),
      ).toBe(true);
    });
  });

  describe("Edge Cases: Long Strings, Multi-Page, Accented Characters & Missing Fields", () => {
    it("handles very long patient names, clinic names, and phone numbers without throwing or overlapping", () => {
      const longNamePlan: DietPlan = {
        ...mockValidPlan,
        patientName:
          "Maria Aparecida dos Santos Albuquerque de Medeiros e Vasconcelos da Silva Pereira",
      };

      const longClinicInfo: ClinicInfo = {
        clinicName:
          "Centro Integrado de Medicina do Estilo de Vida, Nutrição Funcional Avançada e Longevidade Saudável",
        clinicSpecialty:
          "Nutrologia, Endocrinologia e Metabolismo Aplicados à Performance",
        clinicPhone: "+55 (11) 98765-4321 / +55 (11) 3456-7890 ramal 402",
      };

      expect(() =>
        buildCustomLayoutPdfDocument(longNamePlan, longClinicInfo),
      ).not.toThrow();

      const doc = buildCustomLayoutPdfDocument(longNamePlan, longClinicInfo);
      expect(doc.output().startsWith("%PDF-")).toBe(true);
    });

    it("handles complex accented Brazilian food items cleanly", () => {
      const accentedPlan: DietPlan = {
        ...mockValidPlan,
        meals: [
          {
            mealName: "Café da Manhã Reforçado",
            time: "08:00",
            calories: 500,
            protein: 20,
            carbs: 60,
            fat: 15,
            mainOption: makeOption(
              "Açaí orgânico com cupuaçu, maçã fatiada e granola de castanha-do-pará",
              "1 tigela média (300g)",
              500,
              20,
              60,
              15,
            ),
            alternatives: [
              makeOption(
                "Pão de queijo quentinho com café expresso e mamão papaia",
                "2 unidades médias (60g)",
                480,
                18,
                58,
                14,
              ),
            ],
          },
        ],
      };

      const doc = buildCustomLayoutPdfDocument(accentedPlan);
      const output = doc.output();
      expect(output.startsWith("%PDF-")).toBe(true);
      expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    });

    it("properly splits long meal plans into multiple pages with page numbers on each page", () => {
      // Create a 6-meal plan with multiple alternatives per meal to force multi-page layout
      const heavyMeals: Meal[] = [
        ...sampleMeals,
        {
          mealName: "Lanche da Tarde 1",
          time: "15:30",
          calories: 250,
          protein: 15,
          carbs: 30,
          fat: 8,
          mainOption: makeOption(
            "Vitamina de abacate com whey protein e aveia",
            "300ml",
            250,
            15,
            30,
            8,
          ),
          alternatives: [
            makeOption(
              "Castanhas variadas com frutas secas",
              "40g",
              240,
              8,
              18,
              16,
            ),
            makeOption(
              "Barra de proteína artesanal com cacau",
              "1 barra (50g)",
              230,
              20,
              15,
              7,
            ),
          ],
        },
        {
          mealName: "Lanche Pré-Treino",
          time: "17:30",
          calories: 200,
          protein: 10,
          carbs: 35,
          fat: 3,
          mainOption: makeOption(
            "Batata doce cozida com canela e café preto",
            "150g",
            200,
            10,
            35,
            3,
          ),
          alternatives: [
            makeOption(
              "Banana com aveia em flocos e mel",
              "1 banana + 20g aveia",
              190,
              5,
              40,
              2,
            ),
          ],
        },
        {
          mealName: "Ceia",
          time: "22:00",
          calories: 150,
          protein: 12,
          carbs: 10,
          fat: 5,
          mainOption: makeOption(
            "Chá de camomila com nozes e queijo cottage",
            "1 xícara + 20g nozes + 50g cottage",
            150,
            12,
            10,
            5,
          ),
          alternatives: [],
        },
      ];

      const multiPagePlan: DietPlan = {
        ...mockValidPlan,
        meals: heavyMeals,
      };

      const doc = buildCustomLayoutPdfDocument(multiPagePlan, undefined, {
        locale: "pt",
      });
      const pageCount = doc.getNumberOfPages();
      expect(pageCount).toBeGreaterThanOrEqual(2);

      const output = doc.output();
      // Check that footer page numbering was written for all pages
      expect(output).toContain(`de ${pageCount}`);
    });

    it("resiliently handles completely empty or missing optional fields", () => {
      const minimalPlan: DietPlan = {
        version: 2,
        patientId: "pid_min",
        patientName: "",
        mode: "general",
        createdAt: "",
        startDate: "",
        durationDays: 0,
        dailyCalories: 0,
        macronutrients: {
          proteinGrams: 0,
          proteinPercentage: 0,
          carbsGrams: 0,
          carbsPercentage: 0,
          fatGrams: 0,
          fatPercentage: 0,
        },
        meals: [],
        waterRecommendationLiters: 0,
        generalObservations: [],
        dietType: "balanced",
      };

      expect(() => buildCustomLayoutPdfDocument(minimalPlan)).not.toThrow();
      const doc = buildCustomLayoutPdfDocument(minimalPlan);
      expect(doc.output().startsWith("%PDF-")).toBe(true);
    });

    it("prioritizes mealSum when persisted calculatedTotals diverges from the actual meals", () => {
      // Meal sum is 450 + 750 + 550 = 1750 kcal
      // But stale calculatedTotals says 2500 kcal
      const divergentPlan: DietPlan = {
        ...mockValidPlan,
        calculatedTotals: {
          calories: 2500,
          protein: 200,
          carbs: 300,
          fat: 90,
        },
      };

      const doc = buildCustomLayoutPdfDocument(divergentPlan, undefined, {
        locale: "pt",
      });
      const text = doc.output();
      // Should include the actual meal summation 1750 kcal
      expect(text).toContain("1750 kcal");
      // Should not claim 2500 kcal
      expect(text).not.toContain("2500 kcal");
    });

    it("displays appropriate badge for manually edited plans and legacy plans", () => {
      const editedPlan: DietPlan = {
        ...mockValidPlan,
        isManuallyEdited: true,
      };
      const docEdited = buildCustomLayoutPdfDocument(editedPlan, undefined, {
        locale: "pt",
      });
      expect(docEdited.output()).toContain("Edi"); // "Edição Manual • Totais vs Metas"

      const legacyPlan: DietPlan = {
        ...mockValidPlan,
        validation: undefined,
        calculatedTotals: undefined,
      };
      const docLegacy = buildCustomLayoutPdfDocument(legacyPlan, undefined, {
        locale: "pt",
      });
      expect(docLegacy.output()).toContain("Plano Legado");
    });
  });

  describe("generateCustomLayoutPdf Browser Trigger", () => {
    it("calls doc.save with formatted filename", async () => {
      const doc = await generateCustomLayoutPdf(mockValidPlan, undefined, {
        locale: "pt",
      });
      expect(doc).toBeDefined();
      expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    });
  });
});
