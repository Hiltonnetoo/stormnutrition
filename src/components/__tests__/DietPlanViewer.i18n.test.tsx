import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DietPlanViewer from "../DietPlanViewer";
import type { DietPlan, Patient } from "../../types";
import i18n from "../../i18n";
import * as firestore from "firebase/firestore";

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    updateDoc: vi.fn(),
    setDoc: vi.fn(),
    writeBatch: vi.fn(),
  };
});

const mockPatient = {
  id: "pat-100",
  firstName: "Ana",
  lastName: "Silva",
  email: "ana.silva@demo.stormnutrition.com",
  gender: "female",
  dob: "1990-05-15",
  weight: 65,
  height: 168,
  activityLevel: "moderately_active",
  nutritionalGoal: "maintenance",
  createdAt: "2026-01-01T00:00:00.000Z",
  status: "Active",
} as unknown as Patient;

const historicalDietPlan: DietPlan = {
  version: 2,
  id: "diet-hist-1",
  patientId: "pat-100",
  patientName: "Ana Silva",
  mode: "general",
  createdAt: "2026-03-01T12:00:00.000Z",
  startDate: "2026-03-01",
  durationDays: 14,
  dailyCalories: 2000,
  macronutrients: {
    proteinGrams: 100,
    proteinPercentage: 20,
    carbsGrams: 250,
    carbsPercentage: 50,
    fatGrams: 67,
    fatPercentage: 30,
  },
  waterRecommendationLiters: 2.5,
  generalObservations: [
    "Observação clínica personalizada: consumir 500ml de água em jejum.",
    "Evitar café após as 17h.",
  ],
  decisionLog: [
    {
      code: "RULE_HYDRATION",
      type: "filter",
      reason: "Meta clínica de hidratação diária baseada em 35ml/kg",
      timestamp: "2026-03-01T12:00:00.000Z",
    },
  ],
  dietType: "traditional",
  meals: [
    {
      mealName: "Café da Manhã",
      time: "07:30",
      calories: 400,
      protein: 20,
      carbs: 50,
      fat: 13,
      mainOption: {
        name: "Ovo de galinha cozido",
        portion: "100g",
        calories: 146,
        protein: 13,
        carbs: 1,
        fat: 10,
        items: [
          {
            foodId: "food-1",
            name: "Ovo de galinha cozido",
            portion: "2 unidades (100g)",
            calories: 146,
            protein: 13,
            carbs: 1,
            fat: 10,
          },
        ],
      },
      alternatives: [],
    },
  ],
};

describe("DietPlanViewer i18n & Historical Clinical Integrity (Passo C11.6)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adapts surrounding UI chrome to English while preserving recorded clinical content", async () => {
    await act(async () => {
      await i18n.changeLanguage("en");
    });

    const { rerender } = render(
      <DietPlanViewer plan={historicalDietPlan} patient={mockPatient} />,
    );

    // English chrome
    expect(screen.getByText("Plan for Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Daily Nutritional Summary")).toBeInTheDocument();
    expect(screen.getByText("General Recommendations")).toBeInTheDocument();
    expect(screen.getByText(/Current Patient Data/i)).toBeInTheDocument();

    // Meal name translated at presentation time
    expect(screen.getByText(/Breakfast/i)).toBeInTheDocument();

    // Persisted clinical content preserved verbatim (never translated destructively)
    expect(
      screen.getByText(
        "Observação clínica personalizada: consumir 500ml de água em jejum.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Evitar café após as 17h.")).toBeInTheDocument();
    expect(screen.getByText("Ovo de galinha cozido")).toBeInTheDocument();

    // Changing language to Portuguese
    await act(async () => {
      await i18n.changeLanguage("pt");
    });

    rerender(
      <DietPlanViewer plan={historicalDietPlan} patient={mockPatient} />,
    );

    // Portuguese chrome
    expect(screen.getByText("Plano para Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Resumo Nutricional Diário")).toBeInTheDocument();
    expect(screen.getByText("Recomendações Gerais")).toBeInTheDocument();
    expect(screen.getByText(/Café da Manhã/i)).toBeInTheDocument();

    // Clinical content still preserved
    expect(
      screen.getByText(
        "Observação clínica personalizada: consumir 500ml de água em jejum.",
      ),
    ).toBeInTheDocument();

    // Absolute zero writes to Firestore on language toggle
    expect(firestore.updateDoc).not.toHaveBeenCalled();
    expect(firestore.setDoc).not.toHaveBeenCalled();
    expect(firestore.writeBatch).not.toHaveBeenCalled();
  });
});
