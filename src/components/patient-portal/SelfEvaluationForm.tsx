import React, { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { completeSelfEvaluation } from "../../services/firebaseService";
import type { Patient, PatientPortalProfile } from "../../types";
import { useFocusOnChange } from "../../hooks/useFocusOnChange";

/**
 * 1–5 rating as a group of toggle buttons. Defined outside the form so it is
 * not re-created on every render (which remounted the buttons and dropped
 * keyboard focus after each choice).
 */
const Scale: React.FC<{
  labelledBy: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ labelledBy, value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-pressed={value === n}
          aria-label={t("a11y.scale_value", { value: n })}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            value === n
              ? "bg-white text-sky-800 shadow-md scale-105"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
};

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
  const ids = {
    weight: useId(),
    waist: useId(),
    sleep: useId(),
    energy: useId(),
    error: useId(),
  };
  const stepRef = useRef<HTMLDivElement>(null);
  useFocusOnChange(step, stepRef, "h4");

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      await completeSelfEvaluation(
        patientProfile.nutritionistId,
        patientProfile.patientId,
        protocolId,
        data,
        { authorUid: patientProfile.uid },
      );
      onComplete();
    } catch {
      setSubmitError(t("patient_portal.self_eval.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sky-800 rounded-2xl p-6 text-white shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
            {t("patient_portal.self_eval.title")}
          </span>
          <p className="text-xs text-sky-50 mt-1">
            {t("patient_portal.self_eval.subtitle")}
          </p>
        </div>
        <span className="text-xs font-bold text-sky-50">
          <span aria-hidden="true">{step === 1 ? "1/2" : "2/2"}</span>
          <span className="sr-only">
            {t("a11y.step_of", { current: step, total: 2 })}
          </span>
        </span>
      </div>

      <div ref={stepRef}>
        {step === 1 ? (
          <div className="space-y-4">
            <h4 className="text-sm font-bold focus:outline-none">
              {t("patient_portal.self_eval.step1_title")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={ids.weight}
                  className="text-xs text-sky-50 block mb-1"
                >
                  {t("patient_portal.self_eval.weight_label")}
                </label>
                <input
                  id={ids.weight}
                  type="number"
                  inputMode="decimal"
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
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-white placeholder-sky-100 text-sm focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white"
                  placeholder="Ex: 70.5"
                />
              </div>
              <div>
                <label
                  htmlFor={ids.waist}
                  className="text-xs text-sky-50 block mb-1"
                >
                  {t("patient_portal.self_eval.waist_label")}
                </label>
                <input
                  id={ids.waist}
                  type="number"
                  inputMode="decimal"
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
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-white placeholder-sky-100 text-sm focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white"
                  placeholder="Ex: 82"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 bg-white text-sky-800 font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("patient_portal.self_eval.next_btn")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-bold focus:outline-none">
              {t("patient_portal.self_eval.step2_title")}
            </h4>
            <div className="space-y-3">
              <div>
                <p id={ids.sleep} className="text-xs text-sky-50 block mb-1">
                  {t("patient_portal.self_eval.sleep_label")}
                </p>
                <Scale
                  labelledBy={ids.sleep}
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
                <p id={ids.energy} className="text-xs text-sky-50 block mb-1">
                  {t("patient_portal.self_eval.energy_label")}
                </p>
                <Scale
                  labelledBy={ids.energy}
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
              <p
                id={ids.error}
                role="alert"
                className="text-sm font-medium bg-white/15 border border-white/30 rounded-xl px-3 py-2"
              >
                {submitError}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-white/40 font-bold rounded-xl hover:bg-white/10 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("patient_portal.self_eval.back_btn")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                aria-busy={loading || undefined}
                className="flex-[2] py-3 bg-white text-sky-800 font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {loading
                  ? t("patient_portal.self_eval.sending")
                  : t("patient_portal.self_eval.submit_btn")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfEvaluationForm;
