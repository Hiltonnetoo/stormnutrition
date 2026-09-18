import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BarChart3Icon } from "../icons";
import { Card, LoadingState, Skeleton } from "../ui";
import type { MonthBucket } from "./dashboardUtils";
import ChartDataTable from "../ChartDataTable";

export const PerformanceBars: React.FC<{ buckets: MonthBucket[] }> = ({
  buckets,
}) => {
  const { t } = useTranslation();
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return (
    <>
      <div
        aria-hidden="true"
        className="h-48 flex items-end justify-between gap-3 px-2 pt-4"
      >
        {buckets.map((b, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
          >
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 stat-number">
              {b.count}
            </span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-sage-300 to-sage-500 transition-all duration-500 min-h-[4px]"
              style={{ height: `${(b.count / max) * 100}%` }}
              title={`${b.count} plano(s) em ${b.label}`}
            />
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              {b.label}
            </span>
          </div>
        ))}
      </div>
      <ChartDataTable
        caption={t("dashboard.performance_subtitle")}
        columns={[t("a11y.col_month"), t("a11y.col_plans")]}
        rows={buckets.map((b) => [b.label, b.count])}
      />
    </>
  );
};

export interface PerformanceSectionProps {
  loading: boolean;
  hasDietData: boolean;
  dietBuckets: MonthBucket[];
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  loading,
  hasDietData,
  dietBuckets,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("dashboard.performance")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("dashboard.performance_subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/patients")}
          className="text-sm font-semibold text-sage-700 hover:text-sage-800 bg-sage-50 hover:bg-sage-100 px-4 py-2 rounded-lg transition-colors cursor-pointer focus-ring"
        >
          {t("dashboard.view_patients")}
        </button>
      </div>
      {loading ? (
        <LoadingState>
          <Skeleton className="h-48 w-full rounded-xl" />
        </LoadingState>
      ) : hasDietData ? (
        <PerformanceBars buckets={dietBuckets} />
      ) : (
        <div className="h-48 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-6 group hover:border-sage-300 transition-colors">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <BarChart3Icon className="w-8 h-8 text-sage-500" />
          </div>
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            {t("dashboard.performance_empty_title")}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {t("dashboard.performance_empty_desc")}
          </p>
        </div>
      )}
    </Card>
  );
};

export default PerformanceSection;
