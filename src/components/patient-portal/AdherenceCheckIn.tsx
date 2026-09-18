import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCivilToday, DEFAULT_CLINIC_TIMEZONE } from "../../utils/dateTime";
import { logAdherence } from "../../services/firebaseService";
import type { AdherenceEntry } from "../../types";

export const AdherenceCheckIn: React.FC<{
  nutritionistId: string;
  patientId: string;
  currentLog?: AdherenceEntry[];
  onCheckInSuccess: () => void;
}> = ({ nutritionistId, patientId, currentLog, onCheckInSuccess }) => {
  const { t } = useTranslation();
  const today = getCivilToday(DEFAULT_CLINIC_TIMEZONE);
  const [optimisticEntry, setOptimisticEntry] = useState<AdherenceEntry | null>(
    null,
  );
  const todayEntry =
    optimisticEntry && optimisticEntry.date === today
      ? optimisticEntry
      : currentLog?.find((entry) => entry.date === today);
  const [loading, setLoading] = useState(false);
  const [checkError, setCheckError] = useState("");

  const handleCheck = async (followed: boolean) => {
    setLoading(true);
    setCheckError("");
    try {
      const clientEventId = `adh_${today}_${Date.now()}`;
      await logAdherence(nutritionistId, patientId, followed, {
        clientEventId,
      });
      const newEntry: AdherenceEntry = {
        date: today,
        followed,
        timestamp: new Date().toISOString(),
      };
      setOptimisticEntry(newEntry);
      onCheckInSuccess();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("patient_portal.adherence.error");
      setCheckError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (todayEntry)
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-soft flex items-center gap-4 animate-fade-in">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${todayEntry.followed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
        >
          {todayEntry.followed ? "🌟" : "💪"}
        </div>
        <div>
          <p className="text-xs font-bold text-sage-600 uppercase tracking-wider">
            {t("patient_portal.adherence.checkin_title")}
          </p>
          <p className="font-bold text-slate-800">
            {todayEntry.followed
              ? t("patient_portal.adherence.followed_msg")
              : t("patient_portal.adherence.not_followed_msg")}
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">
        {t("patient_portal.adherence.title")}
      </h3>
      <p className="text-sm text-slate-500 mb-5">
        {t("patient_portal.adherence.question")}
      </p>
      {checkError && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 mb-4">
          {checkError}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => handleCheck(true)}
          disabled={loading}
          className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "..." : t("patient_portal.adherence.yes_btn")}
        </button>
        <button
          onClick={() => handleCheck(false)}
          disabled={loading}
          className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {t("patient_portal.adherence.no_btn")}
        </button>
      </div>
    </div>
  );
};

export default AdherenceCheckIn;
