import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Patient } from "../../types";
import { Card, Button } from "../ui";
import {
  requestSelfEvaluation,
  updatePatientSettings,
  type User,
} from "../../services/firebaseService";
import { formatDateWithLocale } from "../../utils/locale";

interface ProfileAssessmentTabProps {
  patient: Patient;
  currentUser: User | null;
  onPatientUpdated?: () => void;
}

export const ProfileAssessmentTab: React.FC<ProfileAssessmentTabProps> = ({
  patient,
  currentUser,
  onPatientUpdated,
}) => {
  const { t, i18n } = useTranslation();
  const [notification, setNotification] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const requestEval = async () => {
    if (!patient || !patient.id || !currentUser) return;
    try {
      await requestSelfEvaluation(currentUser.uid, patient.id);
      notify(t("profile.assessment.success_request"), "success");
      onPatientUpdated?.();
    } catch (error) {
      console.error("Error requesting self-eval:", error);
      notify(t("profile.assessment.error_request"), "error");
    }
  };

  const toggleAutomation = async (checked: boolean) => {
    if (!currentUser || !patient || !patient.id) return;
    try {
      await updatePatientSettings(currentUser.uid, patient.id, {
        autoRequestAssessment: checked,
        intervalDays: patient?.automationSettings?.intervalDays || 15,
      });
      notify(
        checked
          ? t("profile.assessment.success_automation")
          : t("profile.assessment.success_automation_off"),
        "success",
      );
      onPatientUpdated?.();
    } catch (error) {
      console.error("Error updating patient settings:", error);
      notify(t("profile.assessment.error_save_settings"), "error");
    }
  };

  const changeInterval = async (intervalDays: number) => {
    if (!currentUser || !patient || !patient.id) return;
    try {
      await updatePatientSettings(currentUser.uid, patient.id, {
        intervalDays,
      });
      notify(
        t("profile.assessment.success_interval", { days: intervalDays }),
        "success",
      );
      onPatientUpdated?.();
    } catch (error) {
      console.error("Error updating interval days:", error);
      notify(t("profile.assessment.error_interval"), "error");
    }
  };

  return (
    <div className="py-2">
      {notification && (
        <div
          className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium border ${notification.type === "success" ? "bg-sage-50 border-sage-200 text-sage-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}
        >
          {notification.text}
        </div>
      )}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {t("profile.assessment.title")}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              {t("profile.assessment.desc")}
            </p>
          </div>
          <Button
            onClick={requestEval}
            disabled={!!patient?.activeProtocolId}
            size="lg"
          >
            {patient?.activeProtocolId
              ? t("profile.assessment.waiting_patient")
              : t("profile.assessment.request_assess_btn")}
          </Button>
        </div>

        {/* Automation */}
        <div className="mb-8 p-5 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100 dark:border-sky-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center text-lg shrink-0"
              >
                🤖
              </div>
              <div>
                <h4 className="font-bold text-sky-900 dark:text-sky-100 text-sm">
                  {t("profile.assessment.auto_scheduling")}
                </h4>
                <p className="text-xs text-sky-600 dark:text-sky-400">
                  {t("profile.assessment.auto_scheduling_desc")}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={
                  patient?.automationSettings?.autoRequestAssessment || false
                }
                onChange={(e) => toggleAutomation(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600" />
            </label>
          </div>
          {patient?.automationSettings?.autoRequestAssessment && (
            <div className="mt-4 pt-4 border-t border-sky-100 dark:border-sky-800 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                {t("profile.assessment.repeat_every")}
              </span>
              <select
                value={patient.automationSettings.intervalDays}
                onChange={(e) => changeInterval(parseInt(e.target.value))}
                className="bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 rounded-lg px-3 py-1 text-xs font-bold text-sky-800 dark:text-sky-200"
              >
                <option value={7}>
                  {t("profile.assessment.days_option", { days: 7 })}
                </option>
                <option value={15}>
                  {t("profile.assessment.days_option", { days: 15 })}
                </option>
                <option value={30}>
                  {t("profile.assessment.days_option", { days: 30 })}
                </option>
              </select>
              <span className="text-[11px] text-sky-400 font-medium">
                {patient.automationSettings.lastAutoRequestDate
                  ? t("profile.assessment.last_triggered", {
                      date: formatDateWithLocale(
                        patient.automationSettings.lastAutoRequestDate,
                        i18n.language,
                      ),
                    })
                  : t("profile.assessment.waiting_first_cycle")}
              </span>
            </div>
          )}
        </div>

        {/* Protocols History */}
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
          {t("profile.assessment.protocols_history")}
        </h4>
        <div className="space-y-3">
          {patient?.selfEvaluations?.length ? (
            [...patient.selfEvaluations].reverse().map((evalItem) => (
              <div
                key={evalItem.id}
                className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${evalItem.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                  >
                    {evalItem.status === "completed" ? "✅" : "⏳"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">
                      {evalItem.status === "completed"
                        ? t("profile.assessment.assessment_received")
                        : t("profile.assessment.waiting_fill")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {evalItem.status === "completed"
                        ? t("profile.assessment.completed_on", {
                            date: formatDateWithLocale(
                              evalItem.completionDate!,
                              i18n.language,
                            ),
                          })
                        : t("profile.assessment.requested_on", {
                            date: formatDateWithLocale(
                              evalItem.requestDate,
                              i18n.language,
                            ),
                          })}
                    </p>
                  </div>
                </div>
                {evalItem.status === "completed" && (
                  <div className="w-full mt-2 sm:mt-0">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                      {[
                        [
                          t("profile.assessment.labels.weight"),
                          evalItem.measurements?.weight != null
                            ? `${evalItem.measurements.weight}kg`
                            : "—",
                        ],
                        [
                          t("profile.assessment.labels.waist"),
                          evalItem.measurements?.waist != null
                            ? `${evalItem.measurements.waist}cm`
                            : "—",
                        ],
                        [
                          t("profile.assessment.labels.hip"),
                          evalItem.measurements?.hip != null
                            ? `${evalItem.measurements.hip}cm`
                            : "—",
                        ],
                        [
                          t("profile.assessment.labels.neck"),
                          evalItem.measurements?.neck != null
                            ? `${evalItem.measurements.neck}cm`
                            : "—",
                        ],
                        [
                          t("profile.assessment.labels.sleep"),
                          evalItem.wellbeing?.sleepQuality != null
                            ? `${evalItem.wellbeing.sleepQuality}/5`
                            : "—",
                        ],
                        [
                          t("profile.assessment.labels.energy"),
                          evalItem.wellbeing?.energyLevel != null
                            ? `${evalItem.wellbeing.energyLevel}/5`
                            : "—",
                        ],
                        [
                          t("profile.assessment.labels.satiety"),
                          evalItem.wellbeing?.satiety != null
                            ? `${evalItem.wellbeing.satiety}/5`
                            : "—",
                        ],
                        [
                          t("profile.assessment.labels.digestion"),
                          evalItem.wellbeing?.digestiveHealth || "—",
                        ],
                      ].map(([l, v]) => (
                        <div
                          key={l}
                          className="text-center px-2 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
                        >
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            {l}
                          </p>
                          <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-0.5">
                            {v}
                          </p>
                        </div>
                      ))}
                    </div>
                    {evalItem.notes && (
                      <div className="px-3 py-2 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-xl">
                        <p className="text-[11px] font-bold text-sky-600 uppercase mb-0.5">
                          {t("profile.assessment.patient_notes")}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                          "{evalItem.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
              <p className="text-sm text-slate-400 font-medium">
                {t("profile.assessment.no_protocols")}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileAssessmentTab;
