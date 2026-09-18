import React from "react";
import { useTranslation } from "react-i18next";
import {
  UsersIcon,
  UtensilsIcon,
  DocumentTextIcon,
  ScaleIcon,
  ClockIcon,
} from "../icons";
import { Card, Skeleton } from "../ui";
import type { ActivityItem, ActivityIconKey } from "./dashboardUtils";

const ACTIVITY_ICON: Record<
  ActivityIconKey,
  { Icon: React.FC<{ className?: string }>; tone: string }
> = {
  patient: { Icon: UsersIcon, tone: "bg-sky-50 text-sky-600" },
  diet: { Icon: UtensilsIcon, tone: "bg-sage-50 text-sage-600" },
  eval: { Icon: DocumentTextIcon, tone: "bg-violet-50 text-violet-600" },
  weight: { Icon: ScaleIcon, tone: "bg-amber-50 text-amber-600" },
};

export interface RecentActivityCardProps {
  loading: boolean;
  recentActivity: ActivityItem[];
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  loading,
  recentActivity,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">
        {t("dashboard.recent_activity")}
      </h3>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : recentActivity.length === 0 ? (
        <div className="flex flex-col items-center text-center py-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <ClockIcon className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-400">
            {t("dashboard.recent_activity_empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {recentActivity.map((a) => {
            const { Icon, tone } = ACTIVITY_ICON[a.iconKey];
            return (
              <div key={a.id} className="flex items-start gap-3 py-2">
                <span
                  className={`shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg ${tone}`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-snug">
                    {a.text}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentActivityCard;
