import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { completeSelfEvaluation } from "../../services/firebaseService";
import type { Patient, PatientPortalProfile } from "../../types";

export const SelfEvaluationForm: React.FC<{
  protocolId: string;
  patientProfile: PatientPortalProfile;
  patient: Patient | null;
  onComplete: () => void;
}> = ({ protocolId, patientProfile, patient, onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    measurements: { weight: patient?.weight || 0, waist: 0, hip: 0, neck: 0 },
    wellbeing: {
      sleepQuality: 3,
      energyLevel: 3,
      satiety: 3,
      digestiveHealth: "Normal",
    },
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      await completeSelfEvaluation(
        patientProfile.nutritionistId,
        patientProfile.patientId,
        protocolId,
        data,
      );
      onComplete();
    } catch {
      setSubmitError(t("patient_portal.self_eval.error"));
    } finally {
      setLoading(false);
    }
  };

  const Scale: React.FC<{ value: number; onChange: (v: number) => void }> = ({
    value,
    onChange,
  }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
            value === n
              ? "bg-white text-sky-600 shadow-md scale-105"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-6 text-white shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
            {t("patient_portal.self_eval.title")}
          </span>
          <p className="text-xs text-sky-100 mt-1">
            {t("patient_portal.self_eval.subtitle")}
          </p>
        </div>
        <span className="text-xs font-bold text-sky-100">
          {step === 1 ? "1/2" : "2/2"}
        </span>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-sm font-bold">
            {t("patient_portal.self_eval.step1_title")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-sky-100 block mb-1">
                {t("patient_portal.self_eval.weight_label")}
              </label>
              <input
                type="number"
                step="0.1"
                value={data.measurements.weight || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    measurements: {
                      ...data.measurements,
                      weight: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-sky-200 text-sm focus:outline-none focus:bg-white/20"
                placeholder="Ex: 70.5"
              />
            </div>
            <div>
              <label className="text-xs text-sky-100 block mb-1">
                {t("patient_portal.self_eval.waist_label")}
              </label>
              <input
                type="number"
                step="0.5"
                value={data.measurements.waist || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    measurements: {
                      ...data.measurements,
                      waist: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-sky-200 text-sm focus:outline-none focus:bg-white/20"
                placeholder="Ex: 82"
              />
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-white text-sky-600 font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm"
          >
            {t("patient_portal.self_eval.next_btn")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-bold">
            {t("patient_portal.self_eval.step2_title")}
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-sky-100 block mb-1">
                {t("patient_portal.self_eval.sleep_label")}
              </label>
              <Scale
                value={data.wellbeing.sleepQuality}
                onChange={(v) =>
                  setData({
                    ...data,
                    wellbeing: { ...data.wellbeing, sleepQuality: v },
                  })
                }
              />
            </div>
            <div>
              <label className="text-xs text-sky-100 block mb-1">
                {t("patient_portal.self_eval.energy_label")}
              </label>
              <Scale
                value={data.wellbeing.energyLevel}
                onChange={(v) =>
                  setData({
                    ...data,
                    wellbeing: { ...data.wellbeing, energyLevel: v },
                  })
                }
              />
            </div>
          </div>
          {submitError && (
            <p className="text-sm font-medium bg-white/15 border border-white/30 rounded-xl px-3 py-2">
              {submitError}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-white/30 font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              {t("patient_portal.self_eval.back_btn")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-[2] py-3 bg-white text-sky-600 font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading
                ? t("patient_portal.self_eval.sending")
                : t("patient_portal.self_eval.submit_btn")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfEvaluationForm;
