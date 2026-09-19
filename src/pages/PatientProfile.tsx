import React, { useId, useRef, useState } from "react";
import {
  ClockIcon,
  TrendingUpIcon,
  ClipboardListIcon,
  UtensilsIcon,
  DocumentTextIcon,
} from "../components/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import LoadingState from "../components/patient-list/LoadingState";
import { Button, ErrorState } from "../components/ui";
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

  const { patient, diets, loading, loadError, refreshPatient, retry } =
    usePatientProfile(currentUser?.uid, id, () => navigate("/patients"));
  const tabsId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center gap-2 min-h-[40vh]">
        <ErrorState
          title={t("profile.error_load")}
          message={t("profile.error_load_desc")}
          onRetry={retry}
        />
        <Button variant="ghost" onClick={() => navigate("/patients")}>
          {t("profile.back_to_patients")}
        </Button>
      </div>
    );
  }

  if (!patient) return null;

  const tabs: { id: TabId; icon: React.ReactNode; label: string }[] = [
    {
      id: "timeline",
      icon: <ClockIcon className="w-4 h-4" />,
      label: t("profile.tabs.timeline"),
    },
    {
      id: "evolution",
      icon: <TrendingUpIcon className="w-4 h-4" />,
      label: t("profile.tabs.evolution"),
    },
    {
      id: "exams",
      icon: <ClipboardListIcon className="w-4 h-4" />,
      label: t("profile.tabs.exams"),
    },
    {
      id: "diets",
      icon: <UtensilsIcon className="w-4 h-4" />,
      label: t("profile.tabs.diets"),
    },
    {
      id: "assessment",
      icon: <DocumentTextIcon className="w-4 h-4" />,
      label: t("profile.tabs.assessment"),
    },
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

      {/* Tabs navigation (WAI-ARIA tabs: arrows/Home/End, roving tabindex) */}
      <div
        role="tablist"
        aria-label={t("a11y.profile_sections")}
        onKeyDown={(e) => {
          const index = tabs.findIndex((tab) => tab.id === activeTab);
          const next =
            e.key === "ArrowRight"
              ? (index + 1) % tabs.length
              : e.key === "ArrowLeft"
                ? (index - 1 + tabs.length) % tabs.length
                : e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? tabs.length - 1
                    : -1;
          if (next < 0) return;
          e.preventDefault();
          setActiveTab(tabs[next].id);
          tabRefs.current[tabs[next].id]?.focus();
        }}
        className="flex gap-1.5 overflow-x-auto no-scrollbar no-export p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full relative"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${tabsId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${tabsId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all focus-ring ${
                selected
                  ? "bg-white dark:bg-slate-700 text-sage-700 dark:text-sage-300 shadow-sm"
                  : "text-slate-600 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span className="sr-only sm:not-sr-only">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div
        role="tabpanel"
        id={`${tabsId}-panel`}
        aria-labelledby={`${tabsId}-tab-${activeTab}`}
        tabIndex={0}
        className="min-h-[360px] rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600"
      >
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
