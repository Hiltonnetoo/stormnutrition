import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Patient, PatientInvitation } from "../../types";
import {
  createOrGetPendingInvitation,
  revokeInvitation,
  getInvitationByToken,
  sendPortalPasswordReset,
  revokePatientPortalAccess,
} from "../../services/firebaseService";
import {
  isEmailConfigured,
  sendPortalAccessEmail,
} from "../../services/emailService";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Button } from "../ui";

interface Props {
  patient: Patient;
  onClose: () => void;
}

const CopyIcon: React.FC = () => (
  <svg
    className="w-4 h-4 text-slate-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg
    className="w-4 h-4 text-emerald-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const PatientAccessModal: React.FC<Props> = ({ patient, onClose }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [sendEmail, setSendEmail] = useState(isEmailConfigured());
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Invitation state
  const [activeInvitation, setActiveInvitation] =
    useState<PatientInvitation | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [revokedMessage, setRevokedMessage] = useState(false);

  // Portal Revocation state
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
  const [revokingAccess, setRevokingAccess] = useState(false);
  const [accessRevokedSuccess, setAccessRevokedSuccess] = useState(false);

  const alreadyHasAccess = !!patient.portalUid && !accessRevokedSuccess;

  const handleRevokePortalAccess = async () => {
    if (!currentUser || !patient.id) return;
    setRevokingAccess(true);
    setError("");
    try {
      await revokePatientPortalAccess(currentUser.uid, patient.id);
      setAccessRevokedSuccess(true);
      setRevokeConfirmOpen(false);
      setActiveInvitation(null);
    } catch (err) {
      console.error("Erro ao revogar acesso:", err);
      setError(
        t("modals.patient_access.error_revoke", {
          defaultValue: "Falha ao revogar acesso ao portal.",
        }),
      );
    } finally {
      setRevokingAccess(false);
    }
  };

  const checkExistingInvitation = useCallback(async () => {
    if (patient.pendingInvitationId) {
      try {
        const existing = await getInvitationByToken(
          patient.pendingInvitationId,
        );
        if (existing && existing.status === "pending") {
          setActiveInvitation(existing);
        }
      } catch (err) {
        console.warn("Erro ao buscar convite existente:", err);
      }
    }
  }, [patient.pendingInvitationId]);

  useEffect(() => {
    checkExistingInvitation();
  }, [checkExistingInvitation]);

  const handleGenerateInvitation = async () => {
    if (!currentUser || !patient.id || !patient.email) return;
    setLoading(true);
    setError("");
    setEmailStatus("idle");
    setRevokedMessage(false);

    try {
      const defaultSender = t("email_admin.default_sender", {
        defaultValue: "Seu nutricionista",
      });
      const senderName =
        currentUser.displayName || currentUser.email || defaultSender;

      const invitation = await createOrGetPendingInvitation({
        nutritionistId: currentUser.uid,
        nutritionistName: senderName,
        nutritionistEmail: currentUser.email || "",
        patientId: patient.id,
        patientEmail: patient.email,
        patientName: `${patient.firstName} ${patient.lastName}`,
        validityDays: 7,
      });

      setActiveInvitation(invitation);
      const inviteUrl = `${window.location.origin}/#/convite/${invitation.id}`;

      // Try sending invitation email
      if (sendEmail) {
        setEmailStatus("sending");
        try {
          await sendPortalAccessEmail({
            toEmail: patient.email,
            toName: `${patient.firstName} ${patient.lastName}`,
            fromName: senderName,
            portalUrl: inviteUrl,
            inviteUrl,
          });
          setEmailStatus("sent");
        } catch (mailErr) {
          console.error("Falha ao enviar e-mail de acesso:", mailErr);
          setEmailStatus("failed");
        }
      }

      setSuccess(true);
    } catch (e) {
      console.error("Erro ao gerar convite:", e);
      setError(t("modals.patient_access.error_create_access"));
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeInvitation = async () => {
    if (!currentUser || !activeInvitation) return;
    setRevoking(true);
    setError("");
    try {
      await revokeInvitation(activeInvitation.id, currentUser.uid);
      setActiveInvitation(null);
      setSuccess(false);
      setRevokedMessage(true);
    } catch (e) {
      console.error("Erro ao revogar convite:", e);
      setError("Falha ao revogar o convite.");
    } finally {
      setRevoking(false);
    }
  };

  const handleResetPassword = async () => {
    if (!patient.email) return;
    setResetLoading(true);
    setError("");
    setResetSuccess(false);
    try {
      await sendPortalPasswordReset(patient.email);
      setResetSuccess(true);
    } catch {
      setError(t("modals.patient_access.error_reset_email"));
    } finally {
      setResetLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const inviteUrl = activeInvitation
    ? `${window.location.origin}/#/convite/${activeInvitation.id}`
    : "";

  return (
    <Modal
      open
      onClose={onClose}
      title={t("modals.patient_access.title")}
      description={`${patient.firstName} ${patient.lastName}`}
      icon={
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 text-xl">
          ✉️
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {success
              ? t("modals.patient_access.btn_close")
              : t("modals.patient_access.btn_cancel")}
          </Button>
          {!success && !alreadyHasAccess && (
            <Button
              onClick={handleGenerateInvitation}
              loading={loading}
              disabled={loading || !patient.email}
            >
              {loading
                ? t("modals.patient_access.btn_creating")
                : activeInvitation
                  ? t("modals.patient_access.btn_resend")
                  : t("modals.patient_access.btn_generate")}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4 py-1">
        {alreadyHasAccess && !success && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-300">
            <p className="font-bold mb-1">
              🔑 {t("modals.patient_access.active_access")}
            </p>
            {t("modals.patient_access.active_access_desc")}
            <div className="mt-3">
              <Button
                onClick={handleResetPassword}
                loading={resetLoading}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 border-none text-white"
              >
                {resetLoading
                  ? t("modals.patient_access.btn_sending_reset")
                  : t("modals.patient_access.btn_send_reset")}
              </Button>
            </div>
            {resetSuccess && (
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {t("modals.patient_access.reset_success", {
                  email: patient.email,
                })}
              </p>
            )}

            <div className="mt-4 pt-3 border-t border-amber-200/80 dark:border-amber-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                    {t("modals.patient_access.revoke_title", {
                      defaultValue: "Revogar acesso ao portal",
                    })}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t("modals.patient_access.revoke_hint", {
                      defaultValue:
                        "Desconecta o paciente do app sem apagar histórico nem a conta Auth.",
                    })}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30"
                  onClick={() => setRevokeConfirmOpen(true)}
                  disabled={revokingAccess}
                >
                  {t("modals.patient_access.btn_revoke_access", {
                    defaultValue: "Revogar Acesso",
                  })}
                </Button>
              </div>

              {revokeConfirmOpen && (
                <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs space-y-2">
                  <p className="font-semibold text-rose-800 dark:text-rose-300">
                    ⚠️{" "}
                    {t("modals.patient_access.revoke_confirm_title", {
                      defaultValue: "Confirmar revogação de acesso ao portal?",
                    })}
                  </p>
                  <ul className="list-disc list-inside text-rose-700 dark:text-rose-400 space-y-1">
                    <li>
                      {t("modals.patient_access.revoke_effect_1", {
                        defaultValue:
                          "O paciente perderá acesso imediato ao aplicativo e histórico via portal.",
                      })}
                    </li>
                    <li>
                      {t("modals.patient_access.revoke_effect_2", {
                        defaultValue:
                          "Todas as dietas, consultas e prontuário serão mantidos no consultório.",
                      })}
                    </li>
                    <li>
                      {t("modals.patient_access.revoke_effect_3", {
                        defaultValue:
                          "A conta de e-mail do paciente é preservada e você poderá reemitir um convite futuramente.",
                      })}
                    </li>
                  </ul>
                  <div className="flex gap-2 justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={revokingAccess}
                      onClick={() => setRevokeConfirmOpen(false)}
                    >
                      {t("common.cancel", { defaultValue: "Cancelar" })}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700 text-white border-none"
                      loading={revokingAccess}
                      onClick={handleRevokePortalAccess}
                    >
                      {t("modals.patient_access.btn_confirm_revoke", {
                        defaultValue: "Sim, Revogar Acesso",
                      })}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {accessRevokedSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            ✅{" "}
            {t("modals.patient_access.revoke_success_message", {
              defaultValue:
                "Acesso ao portal revogado com sucesso. O paciente não consegue mais visualizar os dados via app, mas o prontuário foi preservado integralmente.",
            })}
          </div>
        )}

        {revokedMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            {t("modals.patient_access.revoked_success")}
          </div>
        )}

        {!alreadyHasAccess && !success && (
          <>
            <div>
              <label className="input-label">
                {t("modals.patient_access.email_label")}
              </label>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {patient.email}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {t("modals.patient_access.share_hint")}
              </p>
            </div>

            {activeInvitation && (
              <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                    {t("modals.patient_access.pending_notice", {
                      date: new Date(
                        activeInvitation.createdAt,
                      ).toLocaleDateString(),
                    })}
                  </span>
                  <button
                    onClick={handleRevokeInvitation}
                    disabled={revoking}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
                  >
                    {revoking
                      ? t("modals.patient_access.revoking")
                      : t("modals.patient_access.btn_revoke")}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-teal-100 dark:border-teal-900/50 rounded-lg p-2 text-xs">
                  <span className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-[280px]">
                    {inviteUrl}
                  </span>
                  <button
                    onClick={() => copyToClipboard(inviteUrl)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-teal-600"
                    title="Copiar"
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            )}

            {isEmailConfigured() ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="sendEmailCheckbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                />
                <label
                  htmlFor="sendEmailCheckbox"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {t("modals.patient_access.checkbox_send_email")}
                </label>
              </div>
            ) : (
              <div className="flex flex-col mt-2 gap-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendEmailCheckboxDisabled"
                    disabled
                    checked={false}
                    className="rounded border-slate-300 text-slate-400 h-4 w-4 cursor-not-allowed"
                  />
                  <label
                    htmlFor="sendEmailCheckboxDisabled"
                    className="text-xs font-semibold text-slate-400 cursor-not-allowed"
                  >
                    {t("modals.patient_access.checkbox_send_email")}
                  </label>
                </div>
                <span className="text-[10px] text-slate-400">
                  {t("modals.patient_access.email_not_configured_hint")}
                </span>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 text-sm text-rose-600 dark:text-rose-400">
                <p>{error}</p>
              </div>
            )}
          </>
        )}

        {success && activeInvitation && (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">✉️</div>
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                {t("modals.patient_access.success_title")}
              </p>
              {sendEmail && emailStatus === "sent" && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {t("modals.patient_access.success_email_sent")}
                </p>
              )}
              {sendEmail && emailStatus === "failed" && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {t("modals.patient_access.success_email_failed")}
                </p>
              )}
              {!sendEmail && (
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                  {t("modals.patient_access.success_share")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-xs text-slate-500">
                    {t("modals.patient_access.invite_link_label")}
                  </p>
                  <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {inviteUrl}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {t("modals.patient_access.invite_expires", {
                      date: new Date(
                        activeInvitation.expiresAt,
                      ).toLocaleDateString(),
                    })}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(inviteUrl)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0 text-slate-600 dark:text-slate-300"
                  title="Copiar link"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PatientAccessModal;
