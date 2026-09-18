import React, { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Patient, DietPlan } from "../../types";
import { Button } from "../ui";
import { DownloadIcon, EditIcon, TrashIcon } from "../icons";
import DietPlanViewer from "../DietPlanViewer";
import { ConfirmationModal } from "../modals/PatientModal";
import { deleteDietPlan } from "../../services/firebaseService";
import { useAuth } from "../../contexts/AuthContext";

const ExportDietModal = lazy(() => import("../modals/ExportDietModal"));

interface ProfileDietsTabProps {
  patient: Patient;
  diets: DietPlan[];
  selectedDietIds: string[];
  setSelectedDietIds: React.Dispatch<React.SetStateAction<string[]>>;
  onOpenCompare: () => void;
}

export const ProfileDietsTab: React.FC<ProfileDietsTabProps> = ({
  patient,
  diets,
  selectedDietIds,
  setSelectedDietIds,
  onOpenCompare,
}) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [viewingDiet, setViewingDiet] = useState<DietPlan | null>(null);
  const [exportDiet, setExportDiet] = useState<DietPlan | null>(null);
  const [dietToDelete, setDietToDelete] = useState<string | null>(null);
  const [dietActionError, setDietActionError] = useState("");

  return (
    <div className="py-2 space-y-5">
      {/* Inline Viewer */}
      {viewingDiet && patient && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {t("profile.diets.plan_of", {
                date: new Date(viewingDiet.createdAt).toLocaleDateString(
                  i18n.language === "pt" ? "pt-BR" : "en-US",
                ),
              })}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExportDiet(viewingDiet)}
                className="btn-secondary btn-sm flex items-center gap-1.5"
              >
                <DownloadIcon className="w-4 h-4" />{" "}
                {t("profile.diets.export_btn")}
              </button>
              <button
                onClick={() => setViewingDiet(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          <div
            className="p-5 max-h-[60vh] overflow-y-auto"
            id="diet-plan-viewer-content"
          >
            <DietPlanViewer plan={viewingDiet} patient={patient} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          {t("profile.diets.plan_title")}
        </h3>
        {selectedDietIds.length === 2 ? (
          <Button
            onClick={onOpenCompare}
            className="bg-sky-600 hover:bg-sky-700 shadow-sky-600/25"
          >
            {t("profile.diets.compare_btn")}
          </Button>
        ) : selectedDietIds.length > 0 ? (
          <span className="text-xs text-sky-600 font-bold">
            {t("profile.diets.compare_select_more")}
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            {t("profile.diets.compare_select_hint")}
          </span>
        )}
      </div>

      {dietActionError && (
        <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
          {dietActionError}
        </div>
      )}

      {diets.length === 0 ? (
        <div className="text-center py-14 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-400 font-medium">
            {t("profile.diets.no_plans_desc", {
              name: patient?.firstName,
            })}
          </p>
          <button
            onClick={() => navigate(`/diet-generator?patient=${patient?.id}`)}
            className="mt-3 text-sm font-bold text-sage-600 hover:underline"
          >
            {t("profile.diets.generate_first_plan")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diets.map((diet, i) => {
            const did = diet.id || String(i);
            const isSelected = selectedDietIds.includes(did);
            return (
              <div
                key={diet.id || i}
                className={`rounded-2xl border transition-all relative ${
                  isSelected
                    ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200 ring-2 ring-sky-500 shadow-lg"
                    : "bg-white dark:bg-slate-850 border-slate-200/70 dark:border-slate-700 shadow-soft"
                }`}
              >
                {/* Header card */}
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-t-2xl transition-colors"
                  onClick={() =>
                    setSelectedDietIds((prev) =>
                      isSelected
                        ? prev.filter((x) => x !== did)
                        : prev.length < 2
                          ? [...prev, did]
                          : prev,
                    )
                  }
                >
                  {isSelected && (
                    <div
                      aria-hidden="true"
                      className="absolute top-3 right-3 w-6 h-6 bg-sky-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                    >
                      ✓
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-sage-50 dark:bg-sage-900/30 rounded-lg text-xl">
                      🍲
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {new Date(diet.createdAt).toLocaleDateString(
                        i18n.language === "pt" ? "pt-BR" : "en-US",
                      )}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white">
                    {t("profile.diets.meal_plan_header")}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {diet.dailyCalories} kcal · {diet.dietType}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingDiet(diet)}
                    className="flex-1 text-xs font-semibold text-slate-600 hover:text-sage-700 hover:bg-sage-50 px-2 py-1.5 rounded-lg transition-colors"
                  >
                    {t("profile.diets.view_btn")}
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.setItem(
                        "dietToEdit",
                        JSON.stringify(diet),
                      );
                      sessionStorage.setItem(
                        "patientForDiet",
                        JSON.stringify(patient),
                      );
                      navigate("/diet-generator");
                    }}
                    className="flex-1 text-xs font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <EditIcon className="w-3.5 h-3.5" />{" "}
                    {t("profile.diets.edit_btn")}
                  </button>
                  <button
                    onClick={() => setExportDiet(diet)}
                    className="flex-1 text-xs font-semibold text-slate-600 hover:text-violet-700 hover:bg-violet-50 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />{" "}
                    {t("profile.diets.export_btn")}
                  </button>
                  <button
                    onClick={() => {
                      setDietActionError("");
                      setDietToDelete(diet.id || null);
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Export and Delete Modals */}
      {exportDiet && patient && (
        <Suspense fallback={null}>
          <ExportDietModal
            isOpen
            plan={exportDiet}
            targetElementId="diet-plan-viewer-content"
            onClose={() => setExportDiet(null)}
          />
        </Suspense>
      )}

      <ConfirmationModal
        isOpen={!!dietToDelete}
        onClose={() => setDietToDelete(null)}
        onConfirm={async () => {
          if (!currentUser || !dietToDelete) return;
          try {
            await deleteDietPlan(currentUser.uid, dietToDelete);
          } catch {
            setDietActionError(t("profile.diets.error_delete"));
          } finally {
            setDietToDelete(null);
          }
        }}
        title={t("profile.diets.delete_confirm_title")}
        message={t("profile.diets.delete_confirm_msg")}
        confirmText={t("profile.diets.delete_confirm_btn")}
      />
    </div>
  );
};

export default ProfileDietsTab;
