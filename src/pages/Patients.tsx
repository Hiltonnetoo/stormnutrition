import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Patient } from "../types";
import {
  SearchIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
} from "../components/icons";
import { useAuth } from "../contexts/AuthContext";
import {
  deletePatientCascade,
  archivePatient,
  unarchivePatient,
} from "../services/firebaseService";
import { usePatientDirectory } from "../hooks/usePatientDirectory";
import { useLatestDiets } from "../hooks/useLatestDiets";
import PatientDietHistoryModal from "../components/modals/PatientDietHistoryModal";
import NewPatientModal from "../components/modals/NewPatientModal";
import { ConfirmationModal } from "../components/modals/PatientModal";

import LoadingState from "../components/patient-list/LoadingState";
import EmptyState from "../components/patient-list/EmptyState";
import PatientActionsMenu from "../components/patient-list/PatientActionsMenu";
import PatientAccessModal from "../components/modals/PatientAccessModal";
import {
  PageHeader,
  Input,
  Button,
  Badge,
  ErrorState,
  EmptyState as EmptyStateBase,
  Avatar,
} from "../components/ui";

/* ----------------------------------------------------------------- Toast */
interface ToastProps {
  title: string;
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, message, type, onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className="fixed top-4 left-4 right-4 sm:left-auto sm:w-full sm:max-w-sm z-50 animate-fade-in-down"
    >
      <div className="flex items-start gap-3 rounded-2xl bg-white border border-slate-200 shadow-pop p-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            type === "success"
              ? "bg-sage-50 text-sage-600"
              : type === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-rose-50 text-rose-600"
          }`}
        >
          {type === "success" ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : type === "warning" ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          ) : (
            <XCircleIcon className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="mt-0.5 text-sm text-slate-500">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-slate-100 transition-colors focus-ring"
          aria-label={t("a11y.dismiss")}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/** Rows rendered per page; diet status is only read for rendered rows. */
const PAGE_SIZE = 20;

const Patients: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  // Shared roster: search, status tabs and counters work over all patients
  // without re-reading them on every visit.
  const {
    patients,
    loading,
    error: patientsError,
    retry: retryPatients,
  } = usePatientDirectory();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] =
    useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [patientToArchive, setPatientToArchive] = useState<Patient | null>(
    null,
  );
  const [isArchiving, setIsArchiving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "archived"
  >("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [portalPatient, setPortalPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (toastInfo: {
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }) => {
    setToast(toastInfo);
  };

  // Load failures are shown in place (ErrorState with retry), not as a toast.
  useEffect(() => {
    if (patientsError) console.error("Error fetching patients:", patientsError);
  }, [patientsError]);

  const getDietStatus = (
    patientId: string,
  ): { text: string; tone: "emerald" | "amber" | "slate" } => {
    const diet = latestDiets.get(patientId);
    if (diet === undefined)
      return { text: t("patients.status_loading"), tone: "slate" };
    if (!diet || !diet.id)
      return { text: t("patients.status_no_diet"), tone: "slate" };
    const patient = patients.find((p) => p.id === patientId);
    if (patient?.dietNeedsReview)
      return { text: t("patients.status_needs_review"), tone: "amber" };
    const dietDate = new Date(diet.createdAt);
    const formattedDate = dietDate.toLocaleDateString(
      i18n.language === "en" ? "en-US" : "pt-BR",
    );
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return dietDate > thirtyDaysAgo
      ? {
          text: t("patients.status_active", { date: formattedDate }),
          tone: "emerald",
        }
      : {
          text: t("patients.status_outdated", { date: formattedDate }),
          tone: "amber",
        };
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };
  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };
  const handleViewHistory = (patient: Patient) => {
    setSelectedPatientForHistory(patient);
    setIsHistoryModalOpen(true);
  };
  const promptDeletePatient = (patient: Patient) => setPatientToDelete(patient);

  const executeDeletePatient = async () => {
    if (!patientToDelete || !patientToDelete.id || !currentUser) return;
    setIsDeleting(true);
    try {
      await deletePatientCascade(currentUser.uid, patientToDelete.id);
      showToast({
        title: t("patients.toast_success_title"),
        message: t("patients.success_delete_patient"),
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting patient:", error);
      showToast({
        title: t("patients.toast_error_title"),
        message: t("patients.error_delete_patient"),
        type: "error",
      });
    } finally {
      setPatientToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleArchiveToggle = async (patient: Patient) => {
    if (!currentUser || !patient.id) return;
    const isCurrentlyArchived = patient.status === "Archived";
    setIsArchiving(true);
    try {
      if (isCurrentlyArchived) {
        await unarchivePatient(currentUser.uid, patient.id);
        showToast({
          title: t("patients.toast_success_title"),
          message: t("patients.success_unarchive_patient", {
            defaultValue: "Paciente restaurado para a lista de ativos.",
          }),
          type: "success",
        });
      } else {
        await archivePatient(currentUser.uid, patient.id);
        showToast({
          title: t("patients.toast_success_title"),
          message: t("patients.success_archive_patient", {
            defaultValue:
              "Paciente arquivado com sucesso. Prontuário e histórico foram preservados.",
          }),
          type: "success",
        });
      }
    } catch (err) {
      console.error("Erro ao alterar arquivamento do paciente:", err);
      showToast({
        title: t("patients.toast_error_title"),
        message: t("patients.error_archive_patient", {
          defaultValue: "Falha ao alterar status de arquivamento.",
        }),
        type: "error",
      });
    } finally {
      setIsArchiving(false);
      setPatientToArchive(null);
    }
  };

  const getAge = (dob: string): number | "N/A" => {
    if (!dob || typeof dob !== "string" || !/^\d{2}\/\d{2}\/\d{4}$/.test(dob))
      return "N/A";
    const [day, month, year] = dob.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    if (isNaN(birthDate.getTime())) return "N/A";
    const ageDate = new Date(Date.now() - birthDate.getTime());
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 0 ? age : "N/A";
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === "active") {
      return patient.status !== "Archived";
    }
    if (statusFilter === "archived") {
      return patient.status === "Archived";
    }
    return true;
  });

  // Back to the first page whenever the search or the status tab changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, statusFilter]);

  const pagePatients = filteredPatients.slice(0, visibleCount);
  const remainingCount = filteredPatients.length - pagePatients.length;
  const { latest: latestDiets, error: dietsError } = useLatestDiets(
    currentUser?.uid,
    pagePatients.map((p) => p.id!),
  );

  useEffect(() => {
    if (!dietsError) return;
    console.error("Error fetching latest diets:", dietsError);
    showToast({
      title: t("patients.toast_error_title"),
      message: t("patients.error_load_diets"),
      type: "error",
    });
  }, [dietsError, t]);

  const actionsFor = (patient: Patient, variant: "table" | "card") => {
    // Desktop table and mobile cards both render a menu for each patient;
    // key the open state by layout so only the clicked instance opens.
    const menuKey = `${variant}:${patient.id}`;
    return (
      <PatientActionsMenu
        patient={patient}
        open={openMenuId === menuKey}
        onOpenChange={(open) => setOpenMenuId(open ? menuKey : null)}
        onViewHistory={() => handleViewHistory(patient)}
        onManagePortal={() => setPortalPatient(patient)}
        onEdit={() => handleEditPatient(patient)}
        onToggleArchive={() => setPatientToArchive(patient)}
        onDelete={() => promptDeletePatient(patient)}
      />
    );
  };

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (patientsError)
      return (
        <ErrorState
          message={t("patients.error_load_patients")}
          onRetry={retryPatients}
        />
      );
    if (patients.length === 0)
      return <EmptyState onAddPatient={handleAddPatient} />;
    if (filteredPatients.length === 0)
      return (
        <EmptyStateBase
          icon={<SearchIcon className="w-6 h-6" />}
          title={
            searchTerm
              ? t("patients.no_search_results", { query: searchTerm })
              : t("patients.no_filter_results")
          }
          description={t("patients.search_try_again")}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              {t("patients.clear_filters")}
            </Button>
          }
        />
      );

    return (
      <>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto relative">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">{t("patients.title")}</caption>
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {[
                  t("patients.header_patient"),
                  t("patients.header_age"),
                  t("patients.header_diet_status"),
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider ${i === 3 ? "text-right" : "text-left"}`}
                  >
                    {h || (
                      <span className="sr-only">
                        {t("patients.header_actions", {
                          defaultValue: "Ações",
                        })}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pagePatients.map((patient) => {
                const dietStatus = getDietStatus(patient.id!);
                const age = getAge(patient.dob);
                return (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="flex items-center gap-3 rounded-xl focus-ring"
                      >
                        <Avatar
                          className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
                          src={patient.avatarUrl}
                          name={`${patient.firstName} ${patient.lastName}`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sage-600 transition-colors truncate">
                              {patient.firstName} {patient.lastName}
                            </p>
                            {patient.status === "Archived" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                {t("patients.badge_archived", {
                                  defaultValue: "Arquivado",
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {patient.email}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                      {age === "N/A"
                        ? "N/A"
                        : t("patients.years_old", { count: age })}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge tone={dietStatus.tone}>{dietStatus.text}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end">
                        {actionsFor(patient, "table")}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {pagePatients.map((patient) => {
            const dietStatus = getDietStatus(patient.id!);
            const age = getAge(patient.dob);
            return (
              <div key={patient.id} className="p-4">
                <Link
                  to={`/patients/${patient.id}`}
                  className="flex items-center gap-3 rounded-xl focus-ring"
                >
                  <Avatar
                    className="h-11 w-11 rounded-xl object-cover ring-2 ring-white shadow-sm"
                    src={patient.avatarUrl}
                    name={`${patient.firstName} ${patient.lastName}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {patient.firstName} {patient.lastName}
                      </p>
                      {patient.status === "Archived" && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          {t("patients.badge_archived", {
                            defaultValue: "Arquivado",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {age === "N/A"
                        ? "N/A"
                        : t("patients.years_old", { count: age })}
                    </p>
                  </div>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <Badge tone={dietStatus.tone}>{dietStatus.text}</Badge>
                  {actionsFor(patient, "card")}
                </div>
              </div>
            );
          })}
        </div>

        {remainingCount > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              {t("patients.load_more", {
                count: Math.min(PAGE_SIZE, remainingCount),
              })}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <PageHeader
        icon={<UsersIcon className="w-6 h-6" />}
        title={t("patients.title")}
        subtitle={t("patients.subtitle")}
        actions={
          <Button
            onClick={handleAddPatient}
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            {t("patients.new_patient_btn")}
          </Button>
        }
      />

      <div className="mb-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="max-w-md w-full">
          <Input
            leftIcon={<SearchIcon className="h-4 w-4" />}
            placeholder={t("patients.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            type="button"
            aria-pressed={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "all"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                : "text-slate-600 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            {t("patients.filter_all", { defaultValue: "Todos" })} (
            {patients.length})
          </button>
          <button
            type="button"
            aria-pressed={statusFilter === "active"}
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "active"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            {t("patients.filter_active", { defaultValue: "Ativos" })} (
            {patients.filter((p) => p.status !== "Archived").length})
          </button>
          <button
            type="button"
            aria-pressed={statusFilter === "archived"}
            onClick={() => setStatusFilter("archived")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "archived"
                ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            {t("patients.filter_archived", { defaultValue: "Arquivados" })} (
            {patients.filter((p) => p.status === "Archived").length})
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">{renderContent()}</div>

      {patients.length > 0 && !loading && (
        <p className="mt-4 text-sm text-slate-400">
          {filteredPatients.length} {t("patients.counter_of")}{" "}
          {t("patients.counter_patient", { count: patients.length })}
        </p>
      )}

      {isModalOpen && (
        <NewPatientModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPatient(null);
          }}
          patient={editingPatient}
          showToast={showToast}
        />
      )}
      {isHistoryModalOpen && selectedPatientForHistory && (
        <PatientDietHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setSelectedPatientForHistory(null);
          }}
          patient={selectedPatientForHistory}
        />
      )}
      <ConfirmationModal
        isOpen={!!patientToArchive}
        onClose={() => !isArchiving && setPatientToArchive(null)}
        onConfirm={() =>
          patientToArchive && handleArchiveToggle(patientToArchive)
        }
        isConfirmLoading={isArchiving}
        title={
          patientToArchive?.status === "Archived"
            ? t("patients.unarchive_confirm_title", {
                defaultValue: "Desarquivar paciente",
              })
            : t("patients.archive_confirm_title", {
                defaultValue: "Arquivar paciente",
              })
        }
        message={
          patientToArchive?.status === "Archived"
            ? t("patients.unarchive_confirm_message", {
                name: patientToArchive?.firstName,
                defaultValue: `Deseja desarquivar ${patientToArchive?.firstName}? O paciente voltará a constar na lista de pacientes ativos.`,
              })
            : t("patients.archive_confirm_message", {
                name: patientToArchive?.firstName,
                defaultValue: `Deseja arquivar ${patientToArchive?.firstName}? Todo o histórico clínico, dietas e consultas serão preservados, mas o paciente deixará de constar na lista de ativos.`,
              })
        }
        confirmText={
          patientToArchive?.status === "Archived"
            ? t("patients.btn_unarchive", { defaultValue: "Desarquivar" })
            : t("patients.btn_archive", { defaultValue: "Arquivar" })
        }
      />
      <ConfirmationModal
        isOpen={!!patientToDelete}
        onClose={() => !isDeleting && setPatientToDelete(null)}
        onConfirm={executeDeletePatient}
        isConfirmLoading={isDeleting}
        title={t("patients.delete_confirm_title")}
        message={t("patients.delete_cascade_warning", {
          name: patientToDelete?.firstName,
          defaultValue: `Atenção: Esta ação é definitiva e irreversível. Serão excluídos permanentemente: o cadastro de ${patientToDelete?.firstName}, todas as dietas geradas, todas as consultas e convites pendentes. O vínculo com o portal será revogado (a conta individual do usuário não é deletada do Auth, mas perde todo acesso aos dados). Deseja continuar?`,
        })}
        confirmText={t("patients.btn_confirm_permanent_delete", {
          defaultValue: "Sim, Excluir Permanentemente",
        })}
      />
      {portalPatient && (
        <PatientAccessModal
          patient={portalPatient}
          onClose={() => setPortalPatient(null)}
        />
      )}
    </div>
  );
};

export default Patients;
