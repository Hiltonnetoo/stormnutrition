import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import LoadingState from "../components/patient-list/LoadingState";
import { Button } from "../components/ui";
import { usePatientProfile } from "../hooks/usePatientProfile";
import ProfileHeader from "../components/patient-profile/ProfileHeader";
import ProfileTimelineTab from "../components/patient-profile/ProfileTimelineTab";
import ProfileEvolutionTab from "../components/patient-profile/ProfileEvolutionTab";
import ProfileExamsTab from "../components/patient-profile/ProfileExamsTab";
import ProfileDietsTab from "../components/patient-profile/ProfileDietsTab";
import ProfileAssessmentTab from "../components/patient-profile/ProfileAssessmentTab";
import DietComparisonModal from "../components/patient-profile/DietComparisonModal";

type TabId = "timeline" | "evolution" | "exams" | "diets" | "assessment";

const PatientProfile: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { patient, diets, loading, loadError, refreshPatient } =
    usePatientProfile(currentUser?.uid, id, () => navigate("/patients"));

  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [selectedDietIds, setSelectedDietIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <LoadingState />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center gap-6 min-h-[40vh]">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            {t("profile.error_load")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("profile.error_load_desc")}
          </p>
        </div>
        <Button onClick={() => navigate("/patients")}>
          {t("profile.back_to_patients")}
        </Button>
      </div>
    );
  }

  if (!patient) return null;

  const tabs: { id: TabId; icon: string; label: string }[] = [
    { id: "timeline", icon: "🕒", label: t("profile.tabs.timeline") },
    { id: "evolution", icon: "📈", label: t("profile.tabs.evolution") },
    { id: "exams", icon: "🧪", label: t("profile.tabs.exams") },
    { id: "diets", icon: "🍲", label: t("profile.tabs.diets") },
    { id: "assessment", icon: "📝", label: t("profile.tabs.assessment") },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <ProfileHeader
        patient={patient}
        onNewConsultation={() =>
          navigate("/calendar", {
            state: {
              prePatientId: patient.id,
              prePatientName: `${patient.firstName} ${patient.lastName}`,
            },
          })
        }
        onGenerateDiet={() => navigate(`/diet-generator?patient=${patient.id}`)}
      />

      {/* Tabs navigation */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar no-export p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-sage-700 dark:text-sage-300 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[360px]">
        {activeTab === "timeline" && (
          <ProfileTimelineTab patient={patient} diets={diets} />
        )}

        {activeTab === "evolution" && <ProfileEvolutionTab patient={patient} />}

        {activeTab === "exams" && <ProfileExamsTab patient={patient} />}

        {activeTab === "diets" && (
          <ProfileDietsTab
            patient={patient}
            diets={diets}
            selectedDietIds={selectedDietIds}
            setSelectedDietIds={setSelectedDietIds}
            onOpenCompare={() => setIsCompareModalOpen(true)}
          />
        )}

        {activeTab === "assessment" && (
          <ProfileAssessmentTab
            patient={patient}
            currentUser={currentUser}
            onPatientUpdated={refreshPatient}
          />
        )}
      </div>

      {/* Compare Modal */}
      <DietComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        patient={patient}
        diets={diets}
        selectedDietIds={selectedDietIds}
      />
    </div>
  );
};

export default PatientProfile;
