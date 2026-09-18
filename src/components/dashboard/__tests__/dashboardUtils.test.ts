import type { TFunction } from "i18next";
import {
  buildMonthlyDietBuckets,
  formatRelative,
  buildRecentActivity,
  RECENT_ACTIVITY_LIMIT,
} from "../dashboardUtils";
import type { AnyDietPlan, Patient } from "../../../types";
import { validatePatient } from "../../../utils/validation";
import { getRecentMonthRanges } from "../../../utils/dateTime";

const dietFixture = (id: string, createdAt: string): AnyDietPlan => ({
  version: 2,
  id,
  patientId: "p1",
  patientName: "John Doe",
  mode: "general",
  createdAt,
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
  waterRecommendationLiters: 2,
  generalObservations: [],
  dietType: "traditional",
});

describe("dashboardUtils", () => {
  describe("buildMonthlyDietBuckets", () => {
    const months = getRecentMonthRanges(6, new Date(2026, 1, 10));

    it("maps one bucket per aggregated month, oldest first", () => {
      const buckets = buildMonthlyDietBuckets(
        months,
        [1, 0, 2, 0, 3, 4],
        false,
      );
      expect(buckets).toHaveLength(6);
      expect(buckets.map((b) => b.label)).toEqual([
        "set",
        "out",
        "nov",
        "dez",
        "jan",
        "fev",
      ]);
      // The last bucket represents the current month
      expect(buckets[5].count).toBe(4);
    });

    it("treats missing counts (aggregation not loaded yet) as zero", () => {
      const buckets = buildMonthlyDietBuckets(months, [], false);
      expect(buckets.every((b) => b.count === 0)).toBe(true);
    });

    it("uses english month labels when isEn is true", () => {
      const buckets = buildMonthlyDietBuckets(months, [], true);
      expect(buckets.map((b) => b.label)).toEqual([
        "sep",
        "oct",
        "nov",
        "dec",
        "jan",
        "feb",
      ]);
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
        validatePatient({
          id: "p1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          createdAt: new Date("2026-09-10T10:00:00Z").toISOString(),
          weightHistory: [
            {
              date: "2026-09-12T10:00:00Z",
              weight: 74,
              origin: "self_reported",
            },
          ],
        }),
      ];

      const mockDiets: AnyDietPlan[] = [
        dietFixture("d1", new Date("2026-09-15T10:00:00Z").toISOString()),
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

    it("gives the same feed from the latest 6 diets as from the full history", () => {
      const mockT = ((key: string, opts?: { name?: string }) =>
        `${key}:${opts?.name || ""}`) as unknown as TFunction;
      const allDiets = Array.from({ length: 30 }, (_, i) =>
        dietFixture(
          `d${i}`,
          new Date(Date.UTC(2026, 0, 1 + i, 12)).toISOString(),
        ),
      );
      const newestFirst = [...allDiets].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
      const fromAll = buildRecentActivity([], allDiets, mockT, true);
      const fromLatest = buildRecentActivity(
        [],
        newestFirst.slice(0, RECENT_ACTIVITY_LIMIT),
        mockT,
        true,
      );
      expect(fromLatest).toEqual(fromAll);
      expect(fromAll).toHaveLength(RECENT_ACTIVITY_LIMIT);
    });
  });
});
