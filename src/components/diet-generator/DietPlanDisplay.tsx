import React, { useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { DietPlan, DecisionEntry } from "../../types";
import {
  ClipboardListIcon,
  DownloadIcon,
  AlertTriangleIcon,
  BrainIcon,
} from "../icons";
import ClinicalReviewModal from "../modals/ClinicalReviewModal";

const ExportDietModal = lazy(() => import("../modals/ExportDietModal"));
import MealOptionTable from "../MealOptionTable";
import { Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { loadUserState, saveUserState } from "../../utils/localStorage";

const translateMealName = (name: string, t: TFunction) => {
  const normalized = name.toLowerCase().trim();
  const keys: Record<string, string> = {
    "café da manhã": "meal_table.breakfast",
    "lanche da manhã": "meal_table.morning_snack",
    almoço: "meal_table.lunch",
    "lanche da tarde": "meal_table.afternoon_snack",
    jantar: "meal_table.dinner",
    ceia: "meal_table.supper",
  };
  const key = keys[normalized];
  return key ? t(key) : name;
};

/* ---------------------------------------------------------------- Log item */
const DecisionLogItem: React.FC<{ log: DecisionEntry }> = ({ log }) => {
  const { t } = useTranslation();
  const [showFoods, setShowFoods] = useState(false);
  const foods = log.removedFoods || [];
  return (
    <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
      <span className="mt-0.5 text-sky-500">•</span>
      <div className="min-w-0">
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {log.reason}
        </span>
        {log.affectedCount
          ? ` (${log.affectedCount} ${log.affectedCount === 1 ? t("diet_generator.display.removed_food_one") : t("diet_generator.display.removed_food_other")})`
          : ""}
        {foods.length > 0 && (
          <>
            {" "}
            <button
              onClick={() => setShowFoods((v) => !v)}
              className="font-semibold text-sky-600 hover:text-sky-700 underline decoration-dotted"
            >
              {showFoods
                ? t("diet_generator.display.hide_list")
                : t("diet_generator.display.see_which")}
            </button>
            {showFoods && (
              <p className="mt-1 leading-relaxed text-slate-500 dark:text-slate-400">
                {foods.join(", ")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface DietPlanDisplayProps {
  plan: DietPlan;
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

const DietPlanDisplay: React.FC<DietPlanDisplayProps> = ({
  plan,
  onSave,
  onDiscard,
  isSaving,
  saveSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLogExpanded, setIsLogExpanded] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);

  const handleSaveClick = () => {
    if (saveSuccess) return;
    setIsReviewModalOpen(true);
  };
  const handleConfirmSave = () => {
    setIsReviewModalOpen(false);
    onSave();
  };

  const handleSaveAsTemplate = () => {
    const formattedDate = new Date().toLocaleDateString(
      i18n.language === "pt" ? "pt-BR" : "en-US",
    );
    const defaultName = t("diet_generator.display.default_template_name", {
      date: formattedDate,
    });
    const name = window.prompt(
      t("diet_generator.display.template_name_prompt"),
      defaultName,
    );
    if (!name) return;
    const currentTemplates = currentUser?.uid
      ? loadUserState<{ id: string; name: string; plan: DietPlan }[]>(
          currentUser.uid,
          "dietPlanTemplates",
          [],
        )
      : [];
    const updated = [
      ...currentTemplates,
      { id: `tmpl_${Date.now()}`, name, plan },
    ];
    if (currentUser?.uid) {
      saveUserState(currentUser.uid, "dietPlanTemplates", updated);
    }
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 3000);
  };

  const mealTotals = plan.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  const calDiff = Math.abs(mealTotals.calories - plan.dailyCalories);
  const isDivergent = calDiff > plan.dailyCalories * 0.05;

  return (
    <>
      <div id="diet-plan-display-content" className="card p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t("diet_generator.display.title", { name: plan.patientName })}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {t("diet_generator.display.start_on", {
                date: new Date(plan.startDate + "T00:00:00").toLocaleDateString(
                  i18n.language === "pt" ? "pt-BR" : "en-US",
                ),
                days: plan.durationDays,
              })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0 no-export">
            {/* Ação destrutiva isolada à esquerda */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDiscard}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 mr-auto sm:mr-2"
            >
              {t("diet_generator.display.discard")}
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
                leftIcon={<DownloadIcon className="w-4 h-4" />}
              >
                {t("diet_generator.display.export")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveAsTemplate}
              >
                {templateSaved
                  ? t("diet_generator.display.saved_template_notice")
                  : t("diet_generator.display.save_as_template")}
              </Button>
              <Button
                size="md"
                onClick={handleSaveClick}
                disabled={isSaving || saveSuccess}
                loading={isSaving}
                className="bg-sky-600 hover:bg-sky-700 shadow-sky-600/25 font-bold"
              >
                {saveSuccess
                  ? t("diet_generator.display.save_success_btn")
                  : t("diet_generator.display.save_plan_btn")}
              </Button>
            </div>
          </div>
        </div>

        {/* Validation & log */}
        <div className="mb-5 space-y-3 no-export">
          {isDivergent && (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300 text-xs">
              <AlertTriangleIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {t("diet_generator.display.validation_warning_title")}
                </p>
                <p>
                  {t("diet_generator.display.validation_warning_desc", {
                    mealCal: mealTotals.calories.toFixed(0),
                    targetCal: plan.dailyCalories,
                  })}
                </p>
              </div>
            </div>
          )}
          {plan.decisionLog && plan.decisionLog.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setIsLogExpanded(!isLogExpanded)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BrainIcon className="w-4 h-4" />{" "}
                  {t("diet_generator.display.clinical_reasoning")}
                </span>
                <span>
                  {isLogExpanded
                    ? t("diet_generator.display.hide")
                    : t("diet_generator.display.view_details")}
                </span>
              </button>
              {isLogExpanded && (
                <div className="p-4 pt-0 space-y-2 max-h-56 overflow-y-auto">
                  {plan.decisionLog.map((log, i) => (
                    <DecisionLogItem key={i} log={log} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Seals & Validation Badges */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="badge badge-sky">
            {t("diet_generator.display.clinical_engine")}
          </span>
          {plan.validation && (
            <span
              className={`badge font-bold ${
                plan.validation.status === "valid"
                  ? "badge-emerald"
                  : plan.validation.status === "requires_review"
                    ? "badge-amber"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
              }`}
            >
              {plan.validation.status === "valid"
                ? t("diet_generator.display.status_valid")
                : plan.validation.status === "requires_review"
                  ? t("diet_generator.display.status_requires_review")
                  : t("diet_generator.display.status_infeasible")}
            </span>
          )}
          {plan.mode && (
            <span className="badge badge-sage uppercase">
              {t("diet_generator.display.mode", {
                mode: t("profile.modes." + plan.mode),
              })}
            </span>
          )}
          {(plan.clinicalTags || []).map((tag) => {
            const translatedTag = t(
              "clinical_tags." + tag,
              tag.replace(/_/g, " "),
            );
            return (
              <span key={tag} className="badge badge-emerald">
                {t("diet_generator.display.respected", { tag: translatedTag })}
              </span>
            );
          })}
          {(plan.labExams || []).length > 0 && (
            <span className="badge badge-amber">
              {t("diet_generator.display.based_on_exams")}
            </span>
          )}
        </div>

        {/* Clinical Validation Issues (if any) */}
        {plan.validation?.issues && plan.validation.issues.length > 0 && (
          <div className="mb-5 p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs space-y-1.5 no-export">
            {plan.validation.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span>{issue.level === "error" ? "⛔" : "⚠️"}</span>
                <span className="font-medium">{issue.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Summary: Prescribed Targets vs Calculated Totals */}
        <div className="bg-sage-50 dark:bg-sage-900/30 p-4 rounded-2xl mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-sage-200/60 dark:border-sage-800 pb-2">
            <div>
              <p className="text-xs font-bold text-sage-800 dark:text-sage-200 uppercase tracking-wider">
                {t("diet_generator.display.effective_totals")}
              </p>
              <p className="text-[11px] text-slate-500">
                {t("diet_generator.display.daily_summary")}
              </p>
            </div>
            {plan.validation?.worstCaseAlternativeSodium != null &&
              plan.validation.worstCaseAlternativeSodium > 0 && (
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-1 sm:mt-0">
                  {t("diet_generator.display.worst_case_sodium_warning", {
                    sodium: plan.validation.worstCaseAlternativeSodium,
                  })}
                </span>
              )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: t("diet_generator.display.calories"),
                calculated: `${mealTotals.calories.toFixed(0)} kcal`,
                target: `${(plan.dailyCalories || 0).toFixed(0)} kcal`,
                diff: mealTotals.calories - plan.dailyCalories,
              },
              {
                label: t("diet_generator.display.proteins_pct", {
                  pct: plan.macronutrients?.proteinPercentage || 0,
                }),
                calculated: `${mealTotals.protein.toFixed(1)}g`,
                target: `${(plan.macronutrients?.proteinGrams || 0).toFixed(1)}g`,
                diff:
                  mealTotals.protein - (plan.macronutrients?.proteinGrams || 0),
              },
              {
                label: t("diet_generator.display.carbs_pct", {
                  pct: plan.macronutrients?.carbsPercentage || 0,
                }),
                calculated: `${mealTotals.carbs.toFixed(1)}g`,
                target: `${(plan.macronutrients?.carbsGrams || 0).toFixed(1)}g`,
                diff: mealTotals.carbs - (plan.macronutrients?.carbsGrams || 0),
              },
              {
                label: t("diet_generator.display.fats_pct", {
                  pct: plan.macronutrients?.fatPercentage || 0,
                }),
                calculated: `${mealTotals.fat.toFixed(1)}g`,
                target: `${(plan.macronutrients?.fatGrams || 0).toFixed(1)}g`,
                diff: mealTotals.fat - (plan.macronutrients?.fatGrams || 0),
              },
            ].map((col) => {
              const diffNum = Math.round(col.diff);
              const isDiffZero = Math.abs(diffNum) <= 1;
              return (
                <div
                  key={col.label}
                  className="bg-white/80 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50"
                >
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    {col.label}
                  </p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 stat-number">
                    {col.calculated}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t("diet_generator.display.prescribed_targets")}:{" "}
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {col.target}
                    </span>
                    {!isDiffZero && (
                      <span
                        className={`ml-1 font-bold ${
                          Math.abs(diffNum) > 50
                            ? "text-amber-600"
                            : "text-slate-500"
                        }`}
                      >
                        ({diffNum > 0 ? `+${diffNum}` : diffNum})
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-4">
          {plan.meals.map((meal) => (
            <div
              key={meal.mealName}
              className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700"
            >
              <h4 className="font-bold text-lg text-slate-800 dark:text-white">
                {translateMealName(meal.mealName, t)}{" "}
                <span className="font-medium text-slate-400 text-sm">
                  — {meal.time}
                </span>
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                {t("diet_generator.display.approx")}{" "}
                <span className="font-semibold">
                  {(meal.calories || 0).toFixed(0)} kcal
                </span>{" "}
                (P: {(meal.protein || 0).toFixed(0)}g | C:{" "}
                {(meal.carbs || 0).toFixed(0)}g | G:{" "}
                {(meal.fat || 0).toFixed(0)}g)
              </p>
              <MealOptionTable
                mainOption={meal.mainOption}
                alternatives={meal.alternatives}
                accentColor="sage"
              />
            </div>
          ))}
        </div>

        {/* Observations */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ClipboardListIcon className="w-5 h-5" />{" "}
            {t("diet_generator.display.general_recommendations")}
          </h3>
          <ul className="mt-2 list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            {(plan.generalObservations || []).map((obs, i) => (
              <li key={i}>{obs}</li>
            ))}
            <li>
              {t("diet_generator.display.drink_water", {
                liters: (plan.waterRecommendationLiters || 2).toFixed(1),
              })}
            </li>
          </ul>
        </div>
      </div>

      <Suspense fallback={null}>
        <ExportDietModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          plan={plan}
          targetElementId="diet-plan-display-content"
        />
      </Suspense>
      <ClinicalReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={handleConfirmSave}
        plan={plan}
      />
    </>
  );
};

export default DietPlanDisplay;
