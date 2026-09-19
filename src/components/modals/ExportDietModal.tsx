import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { DietPlan } from "../../types";
import {
  generateCustomLayoutPdf,
  generateScreenshotPdf,
} from "../../utils/pdfExporter";
import { useAuth } from "../../contexts/AuthContext";
import { loadUserState } from "../../utils/localStorage";
import { DocumentTextIcon, DownloadIcon } from "../icons";
import { Modal, Spinner } from "../ui";

interface ExportDietModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: DietPlan;
  targetElementId: string;
}

const ExportDietModal: React.FC<ExportDietModalProps> = ({
  isOpen,
  onClose,
  plan,
  targetElementId,
}) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [exportingType, setExportingType] = useState<
    "custom" | "screenshot" | null
  >(null);
  const [exportError, setExportError] = useState("");

  const handleExport = async (type: "custom" | "screenshot") => {
    setExportingType(type);
    setExportError("");
    try {
      if (type === "custom") {
        const clinicInfo = currentUser?.uid
          ? {
              clinicName: loadUserState(currentUser.uid, "clinicName", ""),
              clinicSpecialty: loadUserState(
                currentUser.uid,
                "clinicSpecialty",
                "",
              ),
              clinicPhone: loadUserState(currentUser.uid, "clinicPhone", ""),
            }
          : undefined;
        await generateCustomLayoutPdf(plan, clinicInfo, {
          locale: i18n.language,
        });
      } else {
        const element = document.getElementById(targetElementId);
        if (element) {
          document.body.classList.add("preparing-for-export");
          await generateScreenshotPdf(element, plan);
        } else {
          throw new Error(
            t("modals.export_diet.element_not_found", {
              defaultValue: "Target element for capture not found.",
            }),
          );
        }
      }
      onClose();
    } catch (error) {
      console.error("Falha na exportação do PDF:", error);
      setExportError(t("modals.export_diet.error"));
    } finally {
      document.body.classList.remove("preparing-for-export");
      setExportingType(null);
    }
  };

  const isLoading = exportingType !== null;

  const isScreenshotAvailable =
    typeof document !== "undefined" &&
    !!document.getElementById(targetElementId);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("modals.export_diet.title")}
      description={t("modals.export_diet.description", {
        name: plan.patientName,
      })}
      icon={
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-50 text-sage-600">
          <DownloadIcon className="w-6 h-6" />
        </span>
      }
    >
      <div className="space-y-3 py-1">
        {plan.status === "blocked" ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-rose-700">
              {t("modals.export_diet.blocked_title", {
                defaultValue: "Exportação Bloqueada",
              })}
            </p>
            <p>
              {t("modals.export_diet.blocked_desc", {
                defaultValue:
                  "Este plano contém restrições ou incompatibilidades clínicas impeditivas e não pode ser exportado. Corrija os erros antes de gerar o documento.",
              })}
            </p>
          </div>
        ) : plan.status === "clinically_approved" ? (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <p className="font-bold">
              {t("modals.export_diet.approved_doc_notice", {
                defaultValue: "Documento Oficial Aprovado",
              })}
            </p>
            <p className="text-emerald-700 mt-0.5">
              {t("modals.export_diet.approved_doc_desc", {
                defaultValue:
                  "O plano foi clinicamente aprovado e será emitido com carimbo profissional e assinatura.",
              })}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <p className="font-bold">
              {t("modals.export_diet.draft_notice", {
                defaultValue: "Cópia Interna de Rascunho",
              })}
            </p>
            <p className="text-amber-700 mt-0.5">
              {t("modals.export_diet.draft_desc", {
                defaultValue:
                  "Este plano ainda não recebeu aprovação clínica. O PDF será gerado com marca d'água ostensiva de rascunho não liberado ao paciente.",
              })}
            </p>
          </div>
        )}

        <button
          onClick={() => handleExport("custom")}
          disabled={isLoading || plan.status === "blocked"}
          className="w-full flex items-center gap-4 text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-sage-300 hover:bg-sage-50/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <DocumentTextIcon className="w-8 h-8 text-sage-500 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-slate-800 dark:text-white">
              {t("modals.export_diet.doc_pdf")}
            </p>
            <p className="text-xs text-slate-500">
              {t("modals.export_diet.doc_pdf_desc")}
            </p>
          </div>
          {exportingType === "custom" && (
            <Spinner className="w-5 h-5 text-slate-400" />
          )}
        </button>
        <button
          onClick={() => handleExport("screenshot")}
          disabled={
            isLoading || !isScreenshotAvailable || plan.status === "blocked"
          }
          title={
            !isScreenshotAvailable
              ? t("modals.export_diet.screenshot_unavailable")
              : undefined
          }
          className={`w-full flex items-center gap-4 text-left p-4 rounded-2xl border transition-all disabled:opacity-50 ${
            !isScreenshotAvailable || plan.status === "blocked"
              ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 cursor-not-allowed"
              : "border-slate-200 dark:border-slate-700 hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer"
          }`}
        >
          <DownloadIcon className="w-8 h-8 text-sky-500 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-slate-800 dark:text-white">
              {t("modals.export_diet.screenshot")}
            </p>
            <p className="text-xs text-slate-500">
              {isScreenshotAvailable
                ? t("modals.export_diet.screenshot_desc")
                : t("modals.export_diet.screenshot_unavailable")}
            </p>
          </div>
          {exportingType === "screenshot" && (
            <Spinner className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {exportError && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            {exportError}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ExportDietModal;
