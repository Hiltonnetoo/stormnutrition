import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import {
  getDietCountSummary,
  subscribeRecentDiets,
  type DietCountSummary,
} from "../services/firebaseService";
import { usePatientDirectory } from "./usePatientDirectory";
import type { AnyDietPlan } from "../types";
import { getRecentMonthRanges } from "../utils/dateTime";
import { summarizePatients } from "../utils/practiceStats";
import {
  buildMonthlyDietBuckets,
  buildRecentActivity,
  RECENT_ACTIVITY_LIMIT,
  type MonthBucket,
  type ActivityItem,
} from "../components/dashboard/dashboardUtils";

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  totalDiets: number;
  newDietsThisMonth: number;
}

export interface UseDashboardDataReturn {
  stats: DashboardStats;
  loading: boolean;
  successRate: string;
  dietBuckets: MonthBucket[];
  hasDietData: boolean;
  recentActivity: ActivityItem[];
  isEn: boolean;
}

const CHART_MONTHS = 6;

/**
 * Dashboard data with reads proportional to what is shown:
 * - patient counters and activity come from the shared roster (no extra read);
 * - diet counters and the 6-month chart use aggregation queries, fetched when
 *   the screen opens (they do not update in real time while it stays open);
 * - the activity feed reads only the latest RECENT_ACTIVITY_LIMIT diets.
 */
export function useDashboardData(): UseDashboardDataReturn {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith("en");

  const { patients, loading: patientsLoading } = usePatientDirectory();
  const [dietCounts, setDietCounts] = useState<DietCountSummary | null>(null);
  const [recentDiets, setRecentDiets] = useState<AnyDietPlan[]>([]);
  // Month boundaries are fixed when the screen opens.
  const months = useMemo(() => getRecentMonthRanges(CHART_MONTHS), []);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setDietCounts(null);
    getDietCountSummary(uid, months)
      .then((summary) => {
        if (!cancelled) setDietCounts(summary);
      })
      .catch((error) => {
        console.error("[Dashboard] Falha ao contar planos alimentares:", {
          code: (error as { code?: string })?.code ?? "unknown",
        });
        if (!cancelled)
          setDietCounts({ total: 0, perMonth: months.map(() => 0) });
      });
    const unsubscribe = subscribeRecentDiets(
      uid,
      RECENT_ACTIVITY_LIMIT,
      setRecentDiets,
    );
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [uid, months]);

  const patientSummary = useMemo(
    () => summarizePatients(patients, months[months.length - 1]),
    [patients, months],
  );

  const stats: DashboardStats = {
    totalPatients: patientSummary.total,
    activePatients: patientSummary.active,
    newPatientsThisMonth: patientSummary.newThisMonth,
    totalDiets: dietCounts?.total ?? 0,
    newDietsThisMonth: dietCounts?.perMonth[months.length - 1] ?? 0,
  };

  const dietBuckets = useMemo(
    () => buildMonthlyDietBuckets(months, dietCounts?.perMonth ?? [], isEn),
    [months, dietCounts, isEn],
  );

  const hasDietData = useMemo(
    () => dietBuckets.some((b) => b.count > 0),
    [dietBuckets],
  );

  const recentActivity = useMemo(
    () => buildRecentActivity(patients, recentDiets, t, isEn),
    [patients, recentDiets, t, isEn],
  );

  const successRate =
    stats.totalPatients > 0
      ? ((stats.activePatients / stats.totalPatients) * 100).toFixed(0)
      : "0";

  return {
    stats,
    loading: patientsLoading || dietCounts === null,
    successRate,
    dietBuckets,
    hasDietData,
    recentActivity,
    isEn,
  };
}
