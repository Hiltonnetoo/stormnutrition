import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRightIcon } from "../icons";

export interface OnboardingBannerProps {
  visible: boolean;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  visible,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!visible) return null;

  const steps = [
    {
      step: "1",
      icon: "👤",
      title: t("dashboard.onboarding_step_1_title"),
      desc: t("dashboard.onboarding_step_1_desc"),
    },
    {
      step: "2",
      icon: "🥗",
      title: t("dashboard.onboarding_step_2_title"),
      desc: t("dashboard.onboarding_step_2_desc"),
    },
    {
      step: "3",
      icon: "📱",
      title: t("dashboard.onboarding_step_3_title"),
      desc: t("dashboard.onboarding_step_3_desc"),
    },
  ];

  return (
    <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-sage-50 to-teal-50 dark:from-sage-900/20 dark:to-teal-900/20 border-2 border-dashed border-sage-200 dark:border-sage-800">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-5xl mb-4">🌱</div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">
          {t("dashboard.onboarding_title")}
        </h2>
        <p className="text-slate-500 mb-8">{t("dashboard.onboarding_desc")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-soft text-center"
            >
              <div className="w-8 h-8 rounded-full bg-sage-600 text-white text-xs font-extrabold flex items-center justify-center shadow-glow">
                {s.step}
              </div>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">
                  {s.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate("/patients")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl shadow-lg shadow-sage-600/25 transition-all hover:scale-105 cursor-pointer"
        >
          <span>{t("dashboard.onboarding_cta")}</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingBanner;
