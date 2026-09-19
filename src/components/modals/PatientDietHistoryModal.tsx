import React, {
  useState,
  useEffect,
  useId,
  useRef,
  lazy,
  Suspense,
} from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPatientDiets,
  deleteDietPlan,
} from "../../services/firebaseService";
import type { Patient, DietPlan, AnyDietPlan } from "../../types";
import { UtensilsIcon, DownloadIcon, EditIcon, TrashIcon } from "../icons";
import DietPlanViewer from "../DietPlanViewer";
const ExportDietModal = lazy(() => import("./ExportDietModal"));
import { ConfirmationModal } from "./PatientModal";
import { useNavigate } from "react-router-dom";
import { Badge, CloseButton, LoadingState } from "../ui";
import { Dialog } from "../Dialog";
import { useFocusOnChange } from "../../hooks/useFocusOnChange";

interface PatientDietHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

const PatientDietHistoryModal: React.FC<PatientDietHistoryModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [diets, setDiets] = useState<AnyDietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiet, setSelectedDiet] = useState<AnyDietPlan | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [dietToDelete, setDietToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const titleId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  // Switching between the list and one diet replaces the dialog content:
  // move focus to the new heading.
  useFocusOnChange(selectedDiet?.id ?? "list", contentRef, "h2");

  useEffect(() => {
    if (isOpen && currentUser && patient.id) {
      setLoading(true);
      const unsubscribe = getPatientDiets(
        currentUser.uid,
        patient.id,
        (fetchedDiets) => {
          setDiets(fetchedDiets);
          setLoading(false);
        },
      );
      return () => unsubscribe();
    }
  }, [isOpen, currentUser, patient.id]);

  const handleEditDiet = (diet: DietPlan) => {
    sessionStorage.setItem("dietToEdit", JSON.stringify(diet));
    sessionStorage.setItem("patientForDiet", JSON.stringify(patient));
    onClose();
    navigate("/diet-generator");
  };

  const handleDeleteDiet = async (dietId: string) => {
    setDietToDelete(dietId);
  };

  const confirmDeleteDiet = async () => {
    if (!currentUser || !dietToDelete) return;
    setDeleteError("");
    try {
      await deleteDietPlan(currentUser.uid, dietToDelete);
    } catch (error) {
      console.error("Error deleting diet:", error);
      setDeleteError(t("modals.patient_diet_history.delete_error"));
    } finally {
      setDietToDelete(null);
    }
  };

  if (!isOpen) return null;

  const confirmDelete = (
    <ConfirmationModal
      isOpen={!!dietToDelete}
      onClose={() => setDietToDelete(null)}
      onConfirm={confirmDeleteDiet}
      title={t("modals.patient_diet_history.confirm_delete_title")}
      message={t("modals.patient_diet_history.confirm_delete_message")}
      confirmText={t("modals.patient_diet_history.confirm_delete_btn")}
    />
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(
      i18n.language === "en" ? "en-US" : "pt-BR",
    );
  const isV2 = (selectedDiet as DietPlan | null)?.version === 2;

  return (
    <>
      {confirmDelete}
      <Dialog
        open
        onClose={selectedDiet ? () => setSelectedDiet(null) : onClose}
        labelledBy={titleId}
        backdropClassName="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        className={`relative bg-white dark:bg-slate-850 rounded-3xl shadow-pop border border-slate-200/70 dark:border-slate-700/60 w-full flex flex-col max-h-[95vh] animate-scale-in ${selectedDiet ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <div ref={contentRef} className="flex flex-col min-h-0">
          {selectedDiet ? (
            <>
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 justify-between items-center shrink-0">
                <h2
                  id={titleId}
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {t("modals.patient_diet_history.diet_of", {
                    date: formatDate(selectedDiet.createdAt),
                  })}
                </h2>
                <div className="flex items-center gap-2 no-export">
                  {isV2 && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditDiet(selectedDiet as DietPlan)}
                        className="btn btn-secondary btn-sm"
                      >
                        <EditIcon className="w-4 h-4" aria-hidden="true" />{" "}
                        {t("modals.patient_diet_history.edit_btn")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsExportModalOpen(true)}
                        className="btn btn-secondary btn-sm"
                      >
                        <DownloadIcon className="w-4 h-4" aria-hidden="true" />{" "}
                        {t("modals.patient_diet_history.export_btn")}
                      </button>
                    </>
                  )}
                  <CloseButton
                    onClick={() => setSelectedDiet(null)}
                    label={t("a11y.back_to_list")}
                  />
                </div>
              </div>
              <div
                id="diet-plan-viewer-content"
                className="p-6 overflow-y-auto"
              >
                <DietPlanViewer
                  plan={selectedDiet as DietPlan}
                  patient={patient}
                />
              </div>
            </>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2
                  id={titleId}
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {t("modals.patient_diet_history.title", {
                    name: patient.firstName,
                  })}
                </h2>
                <CloseButton onClick={onClose} label={t("a11y.close")} />
              </div>
              <div className="p-6 overflow-y-auto">
                {loading && (
                  <LoadingState
                    label={t("modals.patient_diet_history.loading")}
                  />
                )}
                {!loading && diets.length === 0 && (
                  <div className="text-center py-12">
                    <div
                      aria-hidden="true"
                      className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
                    >
                      <UtensilsIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {t("modals.patient_diet_history.empty_title")}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {t("modals.patient_diet_history.empty_desc")}
                    </p>
                  </div>
                )}
                {deleteError && (
                  <p
                    role="alert"
                    className="mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2"
                  >
                    {deleteError}
                  </p>
                )}
                {!loading && diets.length > 0 && (
                  <ul className="space-y-2">
                    {diets.map((diet) => {
                      const date = formatDate(diet.createdAt);
                      return (
                        <li
                          key={diet.id}
                          className="flex flex-wrap gap-2 justify-between items-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-800 dark:text-white">
                                {t(
                                  "modals.patient_diet_history.diet_plan_label",
                                )}
                              </p>
                              <Badge
                                tone={
                                  (diet as DietPlan).version === 2
                                    ? "sage"
                                    : "slate"
                                }
                              >
                                {(diet as DietPlan).version === 2
                                  ? "v2"
                                  : t(
                                      "modals.patient_diet_history.legacy_badge",
                                    )}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {t("modals.patient_diet_history.created_on", {
                                date,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDiet(diet)}
                              aria-label={t("a11y.view_diet", { date })}
                              className="px-3 py-1.5 text-xs font-bold text-sage-700 bg-sage-50 border border-sage-200 rounded-lg hover:bg-sage-100 transition-colors focus-ring"
                            >
                              {t("modals.patient_diet_history.view_btn")}
                            </button>
                            {(diet as DietPlan).version === 2 && (
                              <button
                                type="button"
                                onClick={() => handleEditDiet(diet as DietPlan)}
                                className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors focus-ring"
                                aria-label={t("a11y.edit_diet", { date })}
                                title={t(
                                  "modals.patient_diet_history.edit_btn",
                                )}
                              >
                                <EditIcon
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                diet.id && handleDeleteDiet(diet.id)
                              }
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring"
                              aria-label={t("a11y.delete_diet", { date })}
                              title={t("a11y.delete_diet", { date })}
                            >
                              <TrashIcon
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </Dialog>
      {selectedDiet && isV2 && (
        <Suspense fallback={null}>
          <ExportDietModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            plan={selectedDiet as DietPlan}
            targetElementId="diet-plan-viewer-content"
          />
        </Suspense>
      )}
    </>
  );
};

export default PatientDietHistoryModal;
