import React from "react";
import { useTranslation } from "react-i18next";
import { UsersIcon, UtensilsIcon, TrendingUpIcon } from "../icons";
import { Card } from "../ui";

export interface MonthSummaryCardProps {
  loading: boolean;
  newPatientsThisMonth: number;
  newDietsThisMonth: number;
  successRate: string;
}

export const MonthSummaryCard: React.FC<MonthSummaryCardProps> = ({
  loading,
  newPatientsThisMonth,
  newDietsThisMonth,
  successRate,
}) => {
  const { t } = useTranslation();

  const summaryItems = [
    {
      label: t("dashboard.summary_new_patients"),
      value: newPatientsThisMonth,
      Icon: UsersIcon,
      color: "text-sky-600 bg-sky-50",
    },
    {
      label: t("dashboard.summary_plans_created"),
      value: newDietsThisMonth,
      Icon: UtensilsIcon,
      color: "text-sage-600 bg-sage-50",
    },
    {
      label: t("dashboard.summary_retention_rate"),
      value: `${successRate}%`,
      Icon: TrendingUpIcon,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
        {t("dashboard.month_summary")}
      </h3>
      <p className="text-sm text-slate-500 mb-5">
        {t("dashboard.month_summary_desc")}
      </p>
      <div className="space-y-3">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.color}`}
              >
                <item.Icon className="w-4 h-4" />
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {item.label}
              </span>
            </div>
            {loading ? (
              <div className="h-5 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ) : (
              <span className="font-bold text-slate-800 dark:text-white">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MonthSummaryCard;
