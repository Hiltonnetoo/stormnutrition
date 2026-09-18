import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDietTemplates } from "../useDietTemplates";
import type { DietPlan } from "../../types";

describe("useDietTemplates", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockPlan: DietPlan = {
    patientId: "p1",
    patientName: "Bob",
    createdAt: "2026-09-01",
    durationDays: 7,
    startDate: "2026-09-01",
    dailyCalories: 2100,
    dietType: "traditional",
    macronutrients: {
      proteinGrams: 150,
      proteinPercentage: 30,
      carbsGrams: 200,
      carbsPercentage: 40,
      fatGrams: 70,
      fatPercentage: 30,
    },
    meals: [],
  };

  it("initializes with empty templates array when no uid", () => {
    const { result } = renderHook(() => useDietTemplates(undefined));
    expect(result.current.templates).toEqual([]);
  });

  it("can save a template and load it from storage", () => {
    const { result } = renderHook(() => useDietTemplates("user-123"));
    expect(result.current.templates).toEqual([]);

    act(() => {
      result.current.saveTemplate("Cutting Plan", mockPlan);
    });

    expect(result.current.templates).toHaveLength(1);
    expect(result.current.templates[0].name).toBe("Cutting Plan");
    expect(result.current.templates[0].plan.dailyCalories).toBe(2100);
  });

  it("can delete a template by id", () => {
    const { result } = renderHook(() => useDietTemplates("user-123"));

    act(() => {
      result.current.saveTemplate("Plan To Delete", mockPlan);
    });

    expect(result.current.templates).toHaveLength(1);
    const templateId = result.current.templates[0].id;

    act(() => {
      result.current.deleteTemplate(templateId);
    });

    expect(result.current.templates).toHaveLength(0);
  });
});
