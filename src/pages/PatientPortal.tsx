import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import type { WeightRecord } from "../types";
import AdherenceCheckIn from "../components/patient-portal/AdherenceCheckIn";
import SelfEvaluationForm from "../components/patient-portal/SelfEvaluationForm";
import PortalWeightModal from "../components/patient-portal/PortalWeightModal";
import PortalPasswordModal from "../components/patient-portal/PortalPasswordModal";
import PortalDietsSection from "../components/patient-portal/PortalDietsSection";
import { usePatientPortalData } from "../hooks/usePatientPortalData";

/* ------------------------------------------------------------- Section shell */
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, right, children }) => (
  <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
      <span className="text-sage-600">{icon}</span>
      <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
      {right && <div className="ml-auto">{right}</div>}
    </div>
    {children}
  </div>
);

/* ----------------------------------------------------------------- Portal */
const PatientPortal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { patientProfile, logout } = useAuth();

  const {
    patient,
    diets,
    nextAppt,
    localWeight,
    localWeightHistory,
    setLocalWeight,
    setLocalWeightHistory,
    refreshPatient,
  } = usePatientPortalData(patientProfile);

  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [weightSavedMsg, setWeightSavedMsg] = useState("");

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(
      i18n.language === "pt" ? "pt-BR" : "en-US",
      { weekday: "long", day: "2-digit", month: "long", year: "numeric" },
    );
  const formatTime = (iso: string) => iso.slice(11, 16);

  const displayWeight = localWeight ?? patient?.weight ?? 0;
  const displayHistory = localWeightHistory ?? patient?.weightHistory ?? [];
  const weightDelta =
    displayWeight - (displayHistory[0]?.weight ?? displayWeight);

  const handleWeightSaved = (newRecord: WeightRecord) => {
    setLocalWeight(newRecord.weight);
    setLocalWeightHistory([
      ...(localWeightHistory ?? patient?.weightHistory ?? []),
      newRecord,
    ]);
    setWeightSavedMsg(t("patient_portal.weight_modal.success_msg"));
    setTimeout(() => setWeightSavedMsg(""), 4000);
    refreshPatient();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Banner */}
      <header className="bg-gradient-to-r from-sage-700 via-teal-700 to-sky-700 text-white pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center font-black text-xl"
            >
              🌿
            </div>
            <div>
              <p className="text-xs font-bold text-sage-200 uppercase tracking-widest">
                {t("nav.patient_portal_nav")}
              </p>
              <h1 className="font-extrabold text-lg leading-tight">
                {patient
                  ? `${patient.firstName} ${patient.lastName}`
                  : "Storm Nutrition"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-xs font-semibold text-white hover:text-white/90 transition-colors rounded-lg px-1 py-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">🔐</span>{" "}
              {t("patient_portal.change_password_btn", {
                defaultValue: "Change Password",
              })}
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-xs font-semibold text-white hover:text-rose-100 transition-colors rounded-lg px-1 py-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("nav.sign_out")}
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6 -mt-10 relative z-10 pb-24">
        {/* Daily Adherence Check-in */}
        {patientProfile && (
          <AdherenceCheckIn
            nutritionistId={patientProfile.nutritionistId}
            patientId={patientProfile.patientId}
            currentLog={patient?.adherenceLog}
            onCheckInSuccess={refreshPatient}
          />
        )}

        {/* Pending Self Evaluation Form */}
        {patient?.activeProtocolId && patientProfile && (
          <SelfEvaluationForm
            protocolId={patient.activeProtocolId}
            patientProfile={patientProfile}
            patient={patient}
            onComplete={refreshPatient}
          />
        )}

        {/* Next consultation */}
        <Section
          title={t("patient_portal.next_consultation")}
          icon={
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        >
          <div className="p-5">
            {nextAppt ? (
              <div className="flex items-start gap-4">
                <div className="bg-sage-50 text-sage-700 rounded-xl p-3 text-center min-w-[60px]">
                  <p className="text-2xl font-extrabold">
                    {new Date(nextAppt.dateTime).getDate()}
                  </p>
                  <p className="text-xs font-semibold uppercase">
                    {new Date(nextAppt.dateTime).toLocaleDateString(
                      i18n.language === "pt" ? "pt-BR" : "en-US",
                      { month: "short" },
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 capitalize">
                    {formatDate(nextAppt.dateTime)}
                  </p>
                  <p className="text-sage-600 font-semibold text-sm mt-0.5">
                    {t("calendar.time_label")} {formatTime(nextAppt.dateTime)}
                  </p>
                  {nextAppt.notes && (
                    <p className="text-slate-500 text-sm mt-2 bg-slate-50 rounded-lg px-3 py-2">
                      {nextAppt.notes}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                {t("patient_portal.no_consultations")}
              </p>
            )}
          </div>
        </Section>

        {/* Progress & Weight Evolution */}
        <Section
          title={t("patient_portal.my_progress")}
          icon={
            <svg
              className="w-4 h-4 text-sky-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
          right={
            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="btn-secondary btn-sm flex items-center gap-1.5 text-xs"
            >
              + {t("patient_portal.register_weight_btn")}
            </button>
          }
        >
          <div className="p-5 space-y-4">
            {weightSavedMsg && (
              <div
                role="status"
                className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <span aria-hidden="true">✓</span> {weightSavedMsg}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-500 font-semibold">
                  {t("patient_portal.current_weight")}
                </p>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">
                  {displayWeight || "—"}{" "}
                  <span className="text-sm font-semibold">kg</span>
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-500 font-semibold">
                  {t("patient_portal.total_variation")}
                </p>
                <p
                  className={`text-2xl font-extrabold mt-1 ${
                    weightDelta < 0
                      ? "text-emerald-600"
                      : weightDelta > 0
                        ? "text-amber-600"
                        : "text-slate-800"
                  }`}
                >
                  {weightDelta > 0
                    ? `+${weightDelta.toFixed(1)}`
                    : weightDelta.toFixed(1)}{" "}
                  <span className="text-sm font-semibold">kg</span>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Assigned Meal Plans */}
        <PortalDietsSection diets={diets} />
      </main>

      {/* Weight Modal */}
      {patientProfile && (
        <PortalWeightModal
          isOpen={isWeightModalOpen}
          onClose={() => setIsWeightModalOpen(false)}
          patientProfile={patientProfile}
          onWeightSaved={handleWeightSaved}
        />
      )}

      {/* Password Modal */}
      <PortalPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default PatientPortal;
