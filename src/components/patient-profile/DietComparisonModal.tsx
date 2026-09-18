import React from "react";
import { useTranslation } from "react-i18next";
import type { Patient, DietPlan } from "../../types";
import { Button } from "../ui";

interface DietComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  diets: DietPlan[];
  selectedDietIds: string[];
}

export const DietComparisonModal: React.FC<DietComparisonModalProps> = ({
  isOpen,
  onClose,
  patient,
  diets,
  selectedDietIds,
}) => {
  const { t, i18n } = useTranslation();

  if (!isOpen || selectedDietIds.length !== 2) return null;

  /* Ordena por data: índice 0 = mais antigo ("Anterior"), índice 1 = mais recente ("Atual") */
  const sortedCompareDiets = selectedDietIds
    .map((sid) =>
      diets.find((d) => d.id === sid || diets.indexOf(d) === parseInt(sid)),
    )
    .filter((d): d is DietPlan => !!d)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const calDiff =
    (sortedCompareDiets[1]?.dailyCalories || 0) -
    (sortedCompareDiets[0]?.dailyCalories || 0);

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-[100] flex flex-col animate-fade-in">
      <div className="px-6 py-4 border-b border-slate-200/70 dark:border-slate-800 flex justify-between items-center glass sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl text-sky-600">
              📊
            </span>
            {t("profile.compare.title")}
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            {t("profile.compare.subtitle", {
              name: `${patient.firstName} ${patient.lastName}`,
            })}
          </p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          {t("profile.compare.close")}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedCompareDiets.map((diet, idx) => (
            <div
              key={diet.id || idx}
              className={`relative p-6 rounded-3xl border-2 shadow-card bg-white dark:bg-slate-850 ${idx === 0 ? "border-sky-100 dark:border-sky-900/40" : "border-emerald-100 dark:border-emerald-900/40"}`}
            >
              <div
                className={`absolute -top-3 -right-3 w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg ${idx === 0 ? "bg-sky-500" : "bg-emerald-500"}`}
              >
                {idx + 1}
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-1 tracking-widest">
                {t(
                  idx === 0
                    ? "profile.compare.plan_previous"
                    : "profile.compare.plan_current",
                )}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-6">
                {new Date(diet.createdAt).toLocaleDateString(
                  i18n.language === "pt" ? "pt-BR" : "en-US",
                )}
              </h3>
              <p className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-6">
                {diet.dailyCalories}
                <span className="text-base font-bold text-slate-400 ml-2">
                  kcal
                </span>
              </p>
              {[
                [
                  t("profile.compare.proteins"),
                  diet.macronutrients?.proteinGrams,
                  diet.macronutrients?.proteinPercentage,
                ],
                [
                  t("profile.compare.carbohydrates"),
                  diet.macronutrients?.carbsGrams,
                  diet.macronutrients?.carbsPercentage,
                ],
                [
                  t("profile.compare.fats"),
                  diet.macronutrients?.fatGrams,
                  diet.macronutrients?.fatPercentage,
                ],
              ].map(([label, grams, pct]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between py-2.5 border-t border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
                      {(Number(grams) || 0).toFixed(0)}g
                    </p>
                    <p className="text-xs text-slate-400 font-semibold">
                      {label}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
                    {pct}%
                  </span>
                </div>
              ))}
              <div className="mt-4">
                <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  {diet.dietType}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-8 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl text-white shadow-pop">
          <h4 className="text-lg font-extrabold mb-5">
            {t("profile.compare.clinical_considerations")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                {t("profile.compare.energy_adjustment")}
              </p>
              <p className="text-3xl font-extrabold">
                {calDiff > 0 ? "+" : ""}
                {calDiff}
                <span className="text-sm ml-2">
                  kcal{" "}
                  {calDiff === 0
                    ? t("profile.compare.no_change")
                    : calDiff > 0
                      ? t("profile.compare.increase")
                      : t("profile.compare.reduction")}
                </span>
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t("profile.compare.date_comparison", {
                  prevDate: sortedCompareDiets[0]
                    ? new Date(
                        sortedCompareDiets[0].createdAt,
                      ).toLocaleDateString(
                        i18n.language === "pt" ? "pt-BR" : "en-US",
                      )
                    : "—",
                  currDate: sortedCompareDiets[1]
                    ? new Date(
                        sortedCompareDiets[1].createdAt,
                      ).toLocaleDateString(
                        i18n.language === "pt" ? "pt-BR" : "en-US",
                      )
                    : "—",
                })}
              </p>
            </div>
            <div className="bg-slate-700/40 p-5 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                {t("profile.compare.clinical_advice_title")}
              </p>
              <p className="text-sm leading-relaxed text-slate-300 italic">
                {t("profile.compare.clinical_advice_text")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietComparisonModal;
