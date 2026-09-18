import type { TFunction } from "i18next";
import {
  buildMonthlyDietBuckets,
  formatRelative,
  buildRecentActivity,
} from "../dashboardUtils";
import type { AnyDietPlan, Patient } from "../../../types";

describe("dashboardUtils", () => {
  describe("buildMonthlyDietBuckets", () => {
    it("returns 6 month buckets ending with current month", () => {
      const buckets = buildMonthlyDietBuckets([], false);
      expect(buckets).toHaveLength(6);
      expect(buckets.every((b) => b.count === 0)).toBe(true);
    });

    it("aggregates diets into correct buckets", () => {
      const now = new Date();
      const mockDiets: AnyDietPlan[] = [
        {
          id: "d1",
          patientId: "p1",
          patientName: "Alice",
          createdAt: now.toISOString(),
          durationDays: 7,
          startDate: "2026-09-01",
          dailyCalories: 2000,
          macronutrients: {
            proteinGrams: 150,
            proteinPercentage: 30,
            carbsGrams: 200,
            carbsPercentage: 40,
            fatGrams: 67,
            fatPercentage: 30,
          },
          meals: [],
        },
      ];

      const buckets = buildMonthlyDietBuckets(mockDiets, false);
      // The last bucket represents the current month
      expect(buckets[5].count).toBe(1);
    });

    it("uses english month labels when isEn is true", () => {
      const buckets = buildMonthlyDietBuckets([], true);
      const enLabels = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ];
      expect(buckets.every((b) => enLabels.includes(b.label))).toBe(true);
    });
  });

  describe("formatRelative", () => {
    it("formats today correctly", () => {
      const now = Date.now();
      expect(formatRelative(now, false)).toBe("Hoje");
      expect(formatRelative(now, true)).toBe("Today");
    });

    it("formats yesterday correctly", () => {
      const yesterday = Date.now() - 25 * 60 * 60 * 1000;
      expect(formatRelative(yesterday, false)).toBe("Ontem");
      expect(formatRelative(yesterday, true)).toBe("Yesterday");
    });

    it("formats days ago correctly within a week", () => {
      const fourDaysAgo = Date.now() - 4 * 24 * 60 * 60 * 1000;
      expect(formatRelative(fourDaysAgo, false)).toBe("há 4 dias");
      expect(formatRelative(fourDaysAgo, true)).toBe("4 days ago");
    });
  });

  describe("buildRecentActivity", () => {
    it("sorts activities chronologically and limits to 6 items", () => {
      const mockT = ((key: string, opts?: { name?: string }) =>
        `${key}:${opts?.name || ""}`) as unknown as TFunction;

      const mockPatients: Patient[] = [
        {
          id: "p1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "123",
          dob: "1990-01-01",
          gender: "male",
          height: 180,
          weight: 75,
          createdAt: new Date("2026-09-10T10:00:00Z").toISOString(),
          weightHistory: [
            {
              date: "2026-09-12T10:00:00Z",
              weight: 74,
              origin: "self_reported",
            },
          ],
        },
      ];

      const mockDiets: AnyDietPlan[] = [
        {
          id: "d1",
          patientId: "p1",
          patientName: "John Doe",
          createdAt: new Date("2026-09-15T10:00:00Z").toISOString(),
          durationDays: 7,
          startDate: "2026-09-15",
          dailyCalories: 2000,
          macronutrients: {
            proteinGrams: 150,
            proteinPercentage: 30,
            carbsGrams: 200,
            carbsPercentage: 40,
            fatGrams: 67,
            fatPercentage: 30,
          },
          meals: [],
        },
      ];

      const activity = buildRecentActivity(
        mockPatients,
        mockDiets,
        mockT,
        false,
      );
      expect(activity.length).toBe(3);
      // Most recent should be diet (Sep 15), then weight (Sep 12), then patient registration (Sep 10)
      expect(activity[0].iconKey).toBe("diet");
      expect(activity[1].iconKey).toBe("weight");
      expect(activity[2].iconKey).toBe("patient");
    });
  });
});
