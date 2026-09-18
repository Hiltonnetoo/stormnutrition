import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import {
  getPatientsCount,
  getActivePatientsCount,
  getNewPatientsThisMonthCount,
  getDietsCount,
  getDietsThisMonthCount,
  getAllDiets,
  getPatients,
} from "../services/firebaseService";
import type { AnyDietPlan, Patient } from "../types";
import {
  buildMonthlyDietBuckets,
  buildRecentActivity,
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
  diets: AnyDietPlan[];
  patients: Patient[];
  loading: boolean;
  successRate: string;
  dietBuckets: MonthBucket[];
  hasDietData: boolean;
  recentActivity: ActivityItem[];
  isEn: boolean;
}

export function useDashboardData(): UseDashboardDataReturn {
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith("en");

  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    newPatientsThisMonth: 0,
    totalDiets: 0,
    newDietsThisMonth: 0,
  });
  const [diets, setDiets] = useState<AnyDietPlan[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribers = [
      getPatientsCount(currentUser.uid, (count) =>
        setStats((s) => ({ ...s, totalPatients: count })),
      ),
      getActivePatientsCount(currentUser.uid, (count) =>
        setStats((s) => ({ ...s, activePatients: count })),
      ),
      getNewPatientsThisMonthCount(currentUser.uid, (count) =>
        setStats((s) => ({ ...s, newPatientsThisMonth: count })),
      ),
      getDietsCount(currentUser.uid, (count) =>
        setStats((s) => ({ ...s, totalDiets: count })),
      ),
      getDietsThisMonthCount(currentUser.uid, (count) =>
        setStats((s) => ({ ...s, newDietsThisMonth: count })),
      ),
      getAllDiets(currentUser.uid, (fetched) => setDiets(fetched)),
      getPatients(currentUser.uid, (fetched) => setPatients(fetched)),
    ];
    const timer = setTimeout(() => setLoading(false), 600);
    return () => {
      clearTimeout(timer);
      unsubscribers.forEach((unsub) => unsub && unsub());
    };
  }, [currentUser]);

  const dietBuckets = useMemo(
    () => buildMonthlyDietBuckets(diets, isEn),
    [diets, isEn],
  );

  const hasDietData = useMemo(
    () => dietBuckets.some((b) => b.count > 0),
    [dietBuckets],
  );

  const recentActivity = useMemo(
    () => buildRecentActivity(patients, diets, t, isEn),
    [patients, diets, t, isEn],
  );

  const successRate =
    stats.totalPatients > 0
      ? ((stats.activePatients / stats.totalPatients) * 100).toFixed(0)
      : "0";

  return {
    stats,
    diets,
    patients,
    loading,
    successRate,
    dietBuckets,
    hasDietData,
    recentActivity,
    isEn,
  };
}
