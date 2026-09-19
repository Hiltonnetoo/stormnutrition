import React, { useState } from "react";
import { UtensilsIcon } from "../icons";
import { useTranslation } from "react-i18next";
import type { AnyDietPlan, DietPlan, Meal } from "../../types";
import { translateMealName } from "../../utils/locale";

const r = (n: number) => Math.round(n);

export const PortalDietsSection: React.FC<{ diets: AnyDietPlan[] }> = ({
  diets,
}) => {
  const { t, i18n } = useTranslation();
  const [expandedDiet, setExpandedDiet] = useState<string | null>(null);

  // Passo P0: Paciente só visualiza planos liberados com aprovação clínica
  const approvedDiets = diets.filter((d) => {
    const isV2 = (d as DietPlan).version === 2;
    if (!isV2) return true; // Preservar planos legados V1
    const d2 = d as DietPlan;
    // A6: only a professional's approval releases a plan. Plans saved before
    // 19/09/2026 (no status, automatic "isApproved") stay hidden until the
    // professional approves them again.
    return d2.status === "clinically_approved" || !!d2.clinicalApproval;
  });

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200/70 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
        <span className="text-sage-600">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </span>
        <h2 className="font-bold text-slate-800 text-sm">
          {t("patient_portal.my_diet_plan")}
        </h2>
        {approvedDiets.length > 0 && (
          <div className="ml-auto">
            <span className="badge badge-sage">
              {approvedDiets.length}{" "}
              {approvedDiets.length > 1
                ? t("meal_table.alternative_plural")
                : t("meal_table.alternative_singular")}
            </span>
          </div>
        )}
      </div>

      <div className="divide-y divide-slate-50">
        {approvedDiets.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            {t("patient_portal.no_diet_plans")}
          </p>
        ) : (
          approvedDiets.map((diet, idx) => {
            const isV2 = (diet as DietPlan).version === 2;
            const d2 = isV2 ? (diet as DietPlan) : null;
            const key = diet.id || String(idx);
            const isExpanded = expandedDiet === key;
            const panelId = `portal-diet-panel-${key}`;
            const mac = d2?.macronutrients;

            return (
              <div key={diet.id || idx}>
                <button
                  type="button"
                  onClick={() => setExpandedDiet(isExpanded ? null : key)}
                  aria-expanded={isExpanded}
                  aria-controls={isV2 ? panelId : undefined}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors focus-ring"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {idx === 0
                          ? t("patient_portal.current_plan")
                          : t("patient_portal.previous_plan")}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t("nav.home")}{" "}
                        {d2?.startDate
                          ? new Date(
                              d2.startDate + "T00:00:00",
                            ).toLocaleDateString(
                              i18n.language === "pt" ? "pt-BR" : "en-US",
                            )
                          : new Date(diet.createdAt).toLocaleDateString(
                              i18n.language === "pt" ? "pt-BR" : "en-US",
                            )}
                        {d2?.durationDays
                          ? ` · ${t("diet_generator.meal_plan.duration")}: ${d2.durationDays} ${t("diet_generator.active").toLowerCase() === "ativo" ? "dias" : "days"}`
                          : ""}
                      </p>
                    </div>
                    <svg
                      aria-hidden="true"
                      className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {isExpanded && d2 && (
                  <div id={panelId} className="px-5 pb-5 space-y-4">
                    {mac && (
                      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="font-bold text-slate-800">
                            {t("patient_portal.plan_goals")}
                          </h3>
                          <span className="badge badge-sage">
                            {t("patient_portal.daily_target")}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            {
                              label: t("patient_portal.calories"),
                              value: r(d2.dailyCalories),
                              unit: "kcal",
                              color: "text-slate-800",
                              bg: "bg-slate-100",
                            },
                            {
                              label: t("patient_portal.proteins"),
                              value: r(mac.proteinGrams),
                              unit: "g",
                              color: "text-sky-600",
                              bg: "bg-sky-50",
                            },
                            {
                              label: t("patient_portal.carbs"),
                              value: r(mac.carbsGrams),
                              unit: "g",
                              color: "text-amber-600",
                              bg: "bg-amber-50",
                            },
                            {
                              label: t("patient_portal.fats"),
                              value: r(mac.fatGrams),
                              unit: "g",
                              color: "text-orange-600",
                              bg: "bg-orange-50",
                            },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className={`${stat.bg} p-3 rounded-2xl`}
                            >
                              <p className="text-xs font-bold text-slate-500 uppercase">
                                {stat.label}
                              </p>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span
                                  className={`text-xl font-extrabold ${stat.color}`}
                                >
                                  {stat.value}
                                </span>
                                <span className="text-xs font-bold text-slate-500">
                                  {stat.unit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic mt-4">
                          "
                          {d2.dietType === "low_carb"
                            ? t("patient_portal.advice_low_carb")
                            : t("patient_portal.advice_general")}
                          "
                        </p>
                      </div>
                    )}

                    {/* Meals */}
                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-4 pb-2 no-scrollbar snap-x snap-mandatory relative">
                      {d2.meals?.map((meal: Meal, mIdx: number) => (
                        <div
                          key={mIdx}
                          className="min-w-[85vw] md:min-w-0 bg-white border border-slate-200 rounded-2xl p-5 shadow-soft snap-center flex flex-col"
                        >
                          <div className="flex items-start justify-between mb-4 gap-2">
                            <div className="flex items-center gap-3">
                              <div
                                aria-hidden="true"
                                className="w-11 h-11 rounded-xl bg-sage-50 text-sage-700 flex items-center justify-center"
                              >
                                <UtensilsIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-800">
                                  {translateMealName(meal.mealName, t)}
                                </h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  {meal.time}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-extrabold text-slate-800">
                                {r(meal.calories)} kcal
                              </p>
                              <p className="text-xs font-bold text-slate-500">
                                P:{r(meal.protein)}g C:{r(meal.carbs)}g G:
                                {r(meal.fat)}g
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1.5 flex-1">
                            {meal.mainOption?.items?.map((item, iIdx) => (
                              <div
                                key={iIdx}
                                className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 last:border-0"
                              >
                                <span className="font-medium text-slate-700">
                                  {item.name}
                                </span>
                                <span className="font-bold text-slate-400">
                                  {item.portionGrams}g
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PortalDietsSection;
