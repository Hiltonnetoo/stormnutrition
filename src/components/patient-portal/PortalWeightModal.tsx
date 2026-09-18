import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { logPatientWeight } from "../../services/firebaseService";
import type { PatientPortalProfile, WeightRecord } from "../../types";

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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-pop border border-slate-100">
        <h3 className="font-bold text-slate-800 text-lg mb-1">
          {t("patient_portal.weight_modal.title")}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {t("patient_portal.weight_modal.desc")}
        </p>
        <div className="relative mb-3">
          <input
            type="number"
            step="0.1"
            placeholder={t("patient_portal.weight_modal.input_placeholder")}
            value={newWeight}
            onChange={(e) => {
              setNewWeight(e.target.value);
              setWeightError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveWeight();
            }}
            autoFocus
            className="w-full text-2xl font-extrabold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
            kg
          </span>
        </div>
        {weightError && (
          <p className="text-xs text-rose-600 mb-3">{weightError}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
          >
            {t("patient_portal.weight_modal.cancel_btn")}
          </button>
          <button
            onClick={saveWeight}
            disabled={isSaving || !newWeight}
            className="flex-1 py-2.5 rounded-xl bg-sage-500 text-white text-sm font-bold hover:bg-sage-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? "..." : t("patient_portal.weight_modal.save_btn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortalWeightModal;
