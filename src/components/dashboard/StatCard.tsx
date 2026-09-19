import React from "react";
import { Card, Skeleton } from "../ui";

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  loading: boolean;
  tone: { icon: string; text: string };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  loading,
  tone,
}) => (
  <Card className="p-5">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${tone.icon}`}>
        {React.cloneElement(
          icon as React.ReactElement<{ className?: string }>,
          {
            className: `w-5 h-5 ${tone.text}`,
          },
        )}
      </div>
      {!loading && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            trendUp
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {trendUp && (
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          )}
          {trend}
        </span>
      )}
    </div>
    <p className="text-sm font-medium text-slate-500">{title}</p>
    {loading ? (
      <Skeleton className="h-9 w-20 mt-1" />
    ) : (
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white stat-number mt-1">
        {value}
      </p>
    )}
  </Card>
);

export default StatCard;
