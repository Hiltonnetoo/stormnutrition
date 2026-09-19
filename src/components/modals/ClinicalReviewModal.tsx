import React, { useEffect, useState } from "react";
import { ClipboardListIcon, CheckCircleIcon } from "../icons";
import { useTranslation } from "react-i18next";
import type { DietPlan } from "../../types";
import { Modal, Button, Input } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import {
  getProfessionalCredentials,
  saveProfessionalCrn,
  type ProfessionalCredentials,
} from "../../services/professionalProfileService";
import ValidationIssuesPanel from "../diet-generator/ValidationIssuesPanel";

interface ClinicalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** A6: called with the approving professional's name and CRN. */
  onConfirm: (approver: ProfessionalCredentials) => void;
  plan: DietPlan;
}

const ClinicalReviewModal: React.FC<ClinicalReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  plan,
}) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [approver, setApprover] = useState<ProfessionalCredentials | null>(
    null,
  );
  const [crnInput, setCrnInput] = useState("");
  const [savingCrn, setSavingCrn] = useState(false);

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    let active = true;
    getProfessionalCredentials(currentUser.uid)
      .then((c) => {
        if (!active) return;
        setApprover({
          name: c.name || currentUser.displayName || "",
          crn: c.crn,
        });
        setCrnInput(c.crn);
      })
      .catch(
        () =>
          active &&
          setApprover({ name: currentUser.displayName || "", crn: "" }),
      );
    return () => {
      active = false;
    };
  }, [isOpen, currentUser]);

  const crn = crnInput.trim();
  const handleConfirm = async () => {
    if (!approver || !crn || !currentUser) return;
    if (crn !== approver.crn) {
      setSavingCrn(true);
      try {
        await saveProfessionalCrn(currentUser.uid, crn);
      } finally {
        setSavingCrn(false);
      }
    }
    onConfirm({ name: approver.name, crn });
  };
  const totalSodium = plan.meals.reduce(
    (acc, meal) => acc + (meal.micros?.sodium || 0),
    0,
  );
  const totalFiber = plan.meals.reduce(
    (acc, meal) => acc + (meal.micros?.fiber || 0),
    0,
  );

  const mealCalories = Math.round(
    plan.meals.reduce((acc, meal) => acc + (meal.calories || 0), 0),
  );
  const targetCalories = Math.round(plan.dailyCalories || 0);
  const isDivergent = Math.abs(mealCalories - targetCalories) > 5;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      title={t("modals.clinical_review.title")}
      description={t("modals.clinical_review.subtitle")}
      icon={<ClipboardListIcon className="w-5 h-5" />}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("modals.clinical_review.back_btn")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!approver || !crn}
            loading={savingCrn}
            className="bg-sky-600 hover:bg-sky-700 shadow-sky-600/25"
          >
            {t("modals.clinical_review.confirm_btn")}
          </Button>
        </>
      }
    >
      <div className="space-y-6 py-1">
        {/* A6: who approves, with CRN (asked once, saved to the profile). */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            {t("modals.clinical_review.approver", {
              name: approver?.name || "—",
            })}
          </p>
          {approver && !approver.crn ? (
            <div className="mt-2">
              <Input
                name="professionalCrn"
                label={t("modals.clinical_review.crn_label")}
                hint={t("modals.clinical_review.crn_hint")}
                value={crnInput}
                onChange={(e) => setCrnInput(e.target.value)}
                maxLength={30}
              />
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-600">
              {t("modals.clinical_review.crn_value", {
                crn: approver?.crn || "…",
              })}
            </p>
          )}
        </div>

        {/* A1: the professional sees exactly which alerts they approve. */}
        {(plan.validation?.issues?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <ValidationIssuesPanel issues={plan.validation?.issues} compact />
            <p className="text-sm font-semibold text-slate-800">
              {t("modals.clinical_review.approve_with_alerts")}
            </p>
          </div>
        )}

        {/* Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
              {t("modals.clinical_review.goals")}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-sage-600">
                {mealCalories}
              </span>
              <span className="text-sm text-slate-500">
                {t("modals.clinical_review.kcal_day")}
              </span>
            </div>
            {isDivergent && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Meta prescrita:{" "}
                <span className="font-semibold">{targetCalories} kcal</span>
              </p>
            )}
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div className="bg-sage-500 h-1.5 rounded-full w-full" />
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
              {t("modals.clinical_review.macros")}
            </h3>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-sky-600">
                P: {plan.macronutrients.proteinPercentage}%
              </span>
              <span className="text-amber-600">
                C: {plan.macronutrients.carbsPercentage}%
              </span>
              <span className="text-orange-600">
                G: {plan.macronutrients.fatPercentage}%
              </span>
            </div>
            <div className="flex h-1.5 w-full rounded-full overflow-hidden">
              <div
                className="bg-sky-500"
                style={{ width: `${plan.macronutrients.proteinPercentage}%` }}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${plan.macronutrients.carbsPercentage}%` }}
              />
              <div
                className="bg-orange-500"
                style={{ width: `${plan.macronutrients.fatPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircleIcon
              aria-hidden="true"
              className="w-4 h-4 text-emerald-700"
            />{" "}
            {t("modals.clinical_review.checklist")}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-xl">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t("modals.clinical_review.daily_fiber", {
                  grams: totalFiber.toFixed(1),
                })}
              </span>
              <span
                className={`badge ${totalFiber >= 25 ? "badge-emerald" : "badge-amber"}`}
              >
                {totalFiber >= 25
                  ? t("modals.clinical_review.ideal")
                  : t("modals.clinical_review.moderate")}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-xl">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t("modals.clinical_review.total_sodium", {
                  sodium: totalSodium,
                })}
              </span>
              <span
                className={`badge ${totalSodium <= 2000 ? "badge-emerald" : "badge-rose"}`}
              >
                {totalSodium <= 2000
                  ? t("modals.clinical_review.safe")
                  : t("modals.clinical_review.high")}
              </span>
            </div>
            {(plan.clinicalTags || []).map((tag) => {
              const translatedTag = t(
                "clinical_tags." + tag,
                tag.replace(/_/g, " "),
              );
              return (
                <div
                  key={tag}
                  className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-xl"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {t("modals.clinical_review.restriction", {
                      tag: translatedTag,
                    })}
                  </span>
                  <span className="badge badge-sky">
                    {t("modals.clinical_review.respected")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed italic">
            {t("modals.clinical_review.disclaimer")}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ClinicalReviewModal;
