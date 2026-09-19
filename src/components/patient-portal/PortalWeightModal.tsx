import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { logPatientWeight } from "../../services/firebaseService";
import type { PatientPortalProfile, WeightRecord } from "../../types";
import { Dialog } from "../Dialog";

export const PortalWeightModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  patientProfile: PatientPortalProfile;
  onWeightSaved: (newRecord: WeightRecord) => void;
}> = ({ isOpen, onClose, patientProfile, onWeightSaved }) => {
  const { t } = useTranslation();
  const [newWeight, setNewWeight] = useState("");
  const [weightError, setWeightError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const titleId = useId();
  const descId = useId();
  const inputId = useId();
  const errorId = useId();

  if (!isOpen) return null;

  const saveWeight = async () => {
    if (!newWeight || isSaving || !patientProfile) return;
    const parsed = parseFloat(newWeight.replace(",", "."));
    if (isNaN(parsed) || parsed < 20 || parsed > 350) {
      setWeightError(t("patient_portal.weight_modal.errors.invalid_weight"));
      return;
    }
    setWeightError("");
    setIsSaving(true);
    try {
      const clientEventId = `portal_weight_${Date.now()}`;
      const result = await logPatientWeight(
        patientProfile.nutritionistId,
        patientProfile.patientId,
        parsed,
        "self_reported",
        {
          clientEventId,
          authorUid: patientProfile.uid,
        },
      );
      onWeightSaved(result.record);
      setNewWeight("");
      onClose();
    } catch {
      setWeightError(t("patient_portal.weight_modal.errors.save_error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descId}
      backdropClassName="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-pop border border-slate-100"
    >
      <h3 id={titleId} className="font-bold text-slate-800 text-lg mb-1">
        {t("patient_portal.weight_modal.title")}
      </h3>
      <p id={descId} className="text-xs text-slate-500 mb-4">
        {t("patient_portal.weight_modal.desc")}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveWeight();
        }}
      >
        <div className="relative mb-3">
          <label htmlFor={inputId} className="sr-only">
            {t("a11y.weight_kg")}
          </label>
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder={t("patient_portal.weight_modal.input_placeholder")}
            value={newWeight}
            onChange={(e) => {
              setNewWeight(e.target.value);
              setWeightError("");
            }}
            aria-invalid={weightError ? true : undefined}
            aria-describedby={weightError ? errorId : undefined}
            className="w-full text-2xl font-extrabold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:bg-white"
          />
          <span
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm"
          >
            kg
          </span>
        </div>
        {weightError && (
          <p id={errorId} role="alert" className="text-xs text-rose-600 mb-3">
            {weightError}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
          >
            {t("patient_portal.weight_modal.cancel_btn")}
          </button>
          <button
            type="submit"
            disabled={isSaving || !newWeight}
            aria-busy={isSaving || undefined}
            className="btn btn-primary flex-1"
          >
            {isSaving
              ? t("a11y.saving")
              : t("patient_portal.weight_modal.save_btn")}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default PortalWeightModal;
