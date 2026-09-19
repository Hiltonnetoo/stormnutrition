import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import {
  UsersIcon,
  UtensilsIcon,
  CheckCircleIcon,
  BarChart3Icon,
} from "../components/icons";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  StatCard,
  QuickActionsSection,
  PerformanceSection,
  MonthSummaryCard,
  RecentActivityCard,
  OnboardingBanner,
} from "../components/dashboard";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const {
    stats,
    loading,
    successRate,
    dietBuckets,
    hasDietData,
    recentActivity,
    isEn,
  } = useDashboardData();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.greeting_morning");
    if (hour < 18) return t("dashboard.greeting_afternoon");
    return t("dashboard.greeting_evening");
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Greeting header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">👋</span>
            <span className="text-sm font-medium text-slate-500">
              {greeting()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("dashboard.greeting_nutri", {
              // "Dra. Clara Mendes" → "Clara": the title comes from the
              // translation ("Dr(a). {{name}}"), not from the display name.
              name:
                currentUser?.displayName
                  ?.split(/\s+/)
                  .find((w) => w && !/^dr(a|\(a\))?\.?$/i.test(w)) ||
                t("settings.profile"),
            })}
          </h1>
          <p className="text-slate-500 mt-1">
            {t("dashboard.summary_subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 capitalize">
              {new Date().toLocaleDateString(isEn ? "en-US" : "pt-BR", {
                weekday: "long",
              })}
            </p>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString(isEn ? "en-US" : "pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatCard
          title={t("dashboard.total_patients")}
          value={stats.totalPatients.toLocaleString()}
          icon={<UsersIcon />}
          trend={t("dashboard.new_this_month", {
            count: stats.newPatientsThisMonth,
          })}
          trendUp={stats.newPatientsThisMonth > 0}
          loading={loading}
          tone={{ icon: "bg-sky-50", text: "text-sky-600" }}
        />
        <StatCard
          title={t("dashboard.active_patients")}
          value={stats.activePatients.toLocaleString()}
          icon={<CheckCircleIcon />}
          trend={t("dashboard.retention", { rate: successRate })}
          trendUp={parseInt(successRate) > 50}
          loading={loading}
          tone={{ icon: "bg-emerald-50", text: "text-emerald-600" }}
        />
        <StatCard
          title={t("dashboard.created_plans")}
          value={stats.totalDiets.toLocaleString()}
          icon={<UtensilsIcon />}
          trend={t("dashboard.new_this_month", {
            count: stats.newDietsThisMonth,
          })}
          trendUp={stats.newDietsThisMonth > 0}
          loading={loading}
          tone={{ icon: "bg-sage-50", text: "text-sage-600" }}
        />
        <StatCard
          title={t("dashboard.average_per_patient")}
          value={
            stats.totalPatients > 0
              ? (stats.totalDiets / stats.totalPatients).toFixed(1)
              : "0"
          }
          icon={<BarChart3Icon />}
          trend={t("dashboard.plans_per_patient")}
          trendUp={false}
          loading={loading}
          tone={{ icon: "bg-violet-50", text: "text-violet-600" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActionsSection />
          <PerformanceSection
            loading={loading}
            hasDietData={hasDietData}
            dietBuckets={dietBuckets}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <MonthSummaryCard
            loading={loading}
            newPatientsThisMonth={stats.newPatientsThisMonth}
            newDietsThisMonth={stats.newDietsThisMonth}
            successRate={successRate}
          />
          <RecentActivityCard
            loading={loading}
            recentActivity={recentActivity}
          />
        </div>
      </div>

      {/* Onboarding */}
      <OnboardingBanner visible={!loading && stats.totalPatients === 0} />
    </div>
  );
};

export default Dashboard;
