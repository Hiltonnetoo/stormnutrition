import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import DietPlanDisplay from "../diet-generator/DietPlanDisplay";
import type { DietPlan } from "../../types";
import i18n from "../../i18n";

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ currentUser: null }),
}));
afterEach(cleanup);

const plan: DietPlan = {
  version: 2,
  patientId: "synthetic",
  patientName: "Synthetic Patient",
  mode: "general",
  clinicalTags: ["hypertension"],
  createdAt: "2026-09-19",
  startDate: "2026-09-19",
  durationDays: 7,
  dailyCalories: 2000,
  meals: [],
  generalObservations: [],
  waterRecommendationLiters: 2,
  dietType: "traditional",
  macronutrients: {
    proteinGrams: 100,
    proteinPercentage: 20,
    carbsGrams: 250,
    carbsPercentage: 50,
    fatGrams: 67,
    fatPercentage: 30,
  },
  validation: {
    status: "requires_review",
    isApproved: false,
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
    issues: [
      {
        level: "warning",
        code: "HIGH_SODIUM_CEILING_HYPERTENSION",
        message: "Sodium warning",
        details: { worstCaseAlternativeSodium: 3000, limit: 2000 },
      },
    ],
  },
};

describe("Clinical context is not a validation guarantee", () => {
  it.each(["pt", "en"])(
    "labels a selected condition as context, even with a related warning (%s)",
    async (language) => {
      await i18n.changeLanguage(language);
      render(
        <DietPlanDisplay plan={plan} onSave={vi.fn()} onDiscard={vi.fn()} />,
      );
      const label = i18n.t("diet_generator.display.considered", {
        tag: i18n.t("clinical_tags.hypertension"),
      });
      const badge = screen.getByText(label);
      expect(badge).toHaveClass("badge-info");
      expect(badge).not.toHaveClass("badge-success");
      expect(
        screen.queryByText(/Respeitado|Respected/i),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(
          i18n.t("diet_generator.display.status_requires_review"),
        ),
      ).toBeInTheDocument();
    },
  );
});
