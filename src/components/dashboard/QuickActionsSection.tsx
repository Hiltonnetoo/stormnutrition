import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UsersIcon,
  UtensilsIcon,
  ClockIcon,
  BarChart3Icon,
  ChevronRightIcon,
} from "../icons";
import { Card } from "../ui";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  onClick?: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  desc,
  color,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700 hover:border-sage-300 hover:shadow-md transition-all group text-left w-full cursor-pointer"
  >
    <div
      className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sage-700 transition-colors">
        {title}
      </p>
      <p className="text-xs text-slate-500 truncate">{desc}</p>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-sage-500 group-hover:translate-x-1 transition-all" />
  </button>
);

export const QuickActionsSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t("dashboard.quick_actions")}
        </h2>
        <p className="text-sm text-slate-500">
          {t("dashboard.quick_actions_subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickActionCard
          icon={<UsersIcon className="w-5 h-5 text-sky-600" />}
          title={t("dashboard.action_new_patient")}
          desc={t("dashboard.action_new_patient_desc")}
          color="bg-sky-50"
          onClick={() => navigate("/patients")}
        />
        <QuickActionCard
          icon={<UtensilsIcon className="w-5 h-5 text-sage-600" />}
          title={t("dashboard.action_generate_diet")}
          desc={t("dashboard.action_generate_diet_desc")}
          color="bg-sage-50"
          onClick={() => navigate("/diet-generator")}
        />
        <QuickActionCard
          icon={<ClockIcon className="w-5 h-5 text-amber-600" />}
          title={t("dashboard.action_calendar")}
          desc={t("dashboard.action_calendar_desc")}
          color="bg-amber-50"
          onClick={() => navigate("/calendar")}
        />
        <QuickActionCard
          icon={<BarChart3Icon className="w-5 h-5 text-violet-600" />}
          title={t("dashboard.action_foods")}
          desc={t("dashboard.action_foods_desc")}
          color="bg-violet-50"
          onClick={() => navigate("/food-database")}
        />
      </div>
    </Card>
  );
};

export default QuickActionsSection;
