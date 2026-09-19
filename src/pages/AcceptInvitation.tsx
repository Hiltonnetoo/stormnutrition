import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../contexts/AuthContext";
import {
  getInvitationByToken,
  acceptInvitationWithNewAccount,
  acceptInvitationWithExistingAccount,
} from "../services/firebaseService";
import type { PatientInvitation } from "../types";
import { Button, Input } from "../components/ui";
import { LogoIcon, ShieldIcon, CheckCircleIcon } from "../components/icons";

const AcceptInvitation: React.FC = () => {
  const { token: routeToken } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get("token") || "";

  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    currentUser,
    beginInvitationActivation,
    completeInvitationActivation,
    cancelInvitationActivation,
    refreshUserProfile,
  } = useAuth();

  const [invitation, setInvitation] = useState<PatientInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states for new user
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Prevent memory leaks / updates on unmounted component
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchInvitation = useCallback(async () => {
    if (!token) {
      setError(t("invite.status_not_found"));
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const inv = await getInvitationByToken(token);
      if (!isMountedRef.current) return;

      if (!inv) {
        setError(t("invite.status_not_found"));
      } else {
        setInvitation(inv);
        if (inv.invalidReason === "legacy_format") {
          setError(t("invite.status_legacy"));
        } else if (inv.status === "expired") {
          setError(t("invite.status_expired"));
        } else if (inv.status === "revoked") {
          setError(t("invite.status_revoked"));
        } else if (inv.status === "accepted") {
          // Passo C03.6: Idempotência de retry para o mesmo usuário autenticado
          if (currentUser && currentUser.uid === inv.acceptedByUid) {
            setSuccess(true);
            await refreshUserProfile();
            if (isMountedRef.current) {
              navigate("/paciente");
            }
          } else {
            setError(t("invite.status_accepted"));
          }
        }
      }
    } catch (err) {
      console.error("Erro ao carregar convite:", err);
      if (isMountedRef.current) {
        setError(t("invite.status_not_found"));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [token, t, currentUser, navigate, refreshUserProfile]);

  useEffect(() => {
    fetchInvitation();
  }, [fetchInvitation]);

  const mapInvitationError = (err: unknown): string => {
    const rawCode =
      err instanceof FirebaseError
        ? err.code
        : err instanceof Error
          ? err.message
          : String(err || "");

    if (
      rawCode === "AUTH_EMAIL_ALREADY_IN_USE" ||
      rawCode === "auth/email-already-in-use"
    ) {
      return t("invite.error_email_already_in_use");
    }
    if (rawCode === "FIRESTORE_LINK_FAILED") {
      return t("invite.error_firestore_link_failed");
    }
    if (rawCode === "INVITATION_NOT_FOUND") {
      return t("invite.status_not_found");
    }
    if (rawCode === "INVITATION_LEGACY") {
      return t("invite.status_legacy");
    }
    if (rawCode === "INVITATION_EXPIRED") {
      return t("invite.status_expired");
    }
    if (rawCode === "INVITATION_REVOKED") {
      return t("invite.status_revoked");
    }
    if (rawCode === "INVITATION_ALREADY_ACCEPTED") {
      return t("invite.status_accepted");
    }
    if (rawCode === "EMAIL_MISMATCH") {
      return t("invite.error_email_mismatch");
    }
    if (rawCode.includes("MULTI_PROFESSIONAL_NOT_SUPPORTED")) {
      return t("invite.error_multi_professional");
    }
    return t("invite.error_generic");
  };

  const handleActivateNewAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setError(null);

    if (password.length < 6) {
      setPasswordError(t("invite.password_too_short"));
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(t("invite.password_mismatch"));
      return;
    }

    setSubmitting(true);
    beginInvitationActivation(token);
    try {
      await acceptInvitationWithNewAccount(token, password);
      // Passo C08.4: Atualizar perfil/papel do contexto após confirmar C03; só então redirecionar
      await completeInvitationActivation();
      if (!isMountedRef.current) return;

      setSuccess(true);
      navigate("/paciente");
    } catch (err: unknown) {
      await cancelInvitationActivation();
      if (!isMountedRef.current) return;

      setError(mapInvitationError(err));
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  const handleAcceptExistingAccount = async () => {
    if (!currentUser) return;
    setSubmitting(true);
    setError(null);
    beginInvitationActivation(token);
    try {
      await acceptInvitationWithExistingAccount(token, currentUser);
      // Passo C08.4: Atualizar perfil/papel do contexto após confirmar C03; só então redirecionar
      await completeInvitationActivation();
      if (!isMountedRef.current) return;

      setSuccess(true);
      navigate("/paciente");
    } catch (err: unknown) {
      await cancelInvitationActivation();
      if (!isMountedRef.current) return;

      setError(mapInvitationError(err));
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 mb-4 shadow-sm">
          <LogoIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("invite.accept_title")}
        </h1>
        {invitation && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t("invite.welcome_msg", {
              name: invitation.patientName,
              nutri: invitation.nutritionistName,
            })}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700/60">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500">{t("invite.verifying")}</p>
            </div>
          ) : success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <CheckCircleIcon className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("invite.link_success")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("invite.redirecting_portal")}
              </p>
            </div>
          ) : error && invitation?.status !== "pending" ? (
            <div className="space-y-6">
              <div
                role="alert"
                className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm"
              >
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <ShieldIcon className="w-5 h-5 text-amber-600" />
                  <span>{t("invite.notice_title")}</span>
                </div>
                <p>{error}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/paciente"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  {t("invite.btn_go_to_login")}
                </Link>
                <Link
                  to="/"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {t("invite.go_home")}
                </Link>
              </div>
            </div>
          ) : invitation ? (
            <div>
              {currentUser &&
              currentUser.email?.toLowerCase().trim() ===
                invitation.patientEmail.toLowerCase().trim() ? (
                // Explicit account linking for existing signed-in user
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-800 dark:text-emerald-300">
                    <p className="font-semibold mb-1">
                      {t("invite.existing_account_title")}
                    </p>
                    <p>
                      {t("invite.existing_account_desc", {
                        email: currentUser.email,
                        nutri: invitation.nutritionistName,
                      })}
                    </p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-400"
                    >
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleAcceptExistingAccount}
                    loading={submitting}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl"
                  >
                    {t("invite.btn_confirm_link")}
                  </Button>
                </div>
              ) : (
                // New user password definition form
                <form onSubmit={handleActivateNewAccount} className="space-y-4">
                  <div>
                    <label
                      htmlFor="invite-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      {t("modals.patient_access.email_label")}
                    </label>
                    <input
                      id="invite-email"
                      type="email"
                      autoComplete="email"
                      value={invitation.patientEmail}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Input
                      label={t("invite.set_password_title")}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("invite.password_placeholder")}
                      required
                    />
                  </div>

                  <div>
                    <Input
                      label={t("invite.confirm_password")}
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("invite.password_placeholder")}
                      required
                    />
                  </div>

                  {passwordError && (
                    <p
                      role="alert"
                      className="text-xs text-rose-700 font-medium"
                    >
                      {passwordError}
                    </p>
                  )}

                  {error && (
                    <div
                      role="alert"
                      className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-400"
                    >
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    loading={submitting}
                    disabled={submitting || !password || !confirmPassword}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl mt-2"
                  >
                    {submitting
                      ? t("invite.btn_activating")
                      : t("invite.btn_activate")}
                  </Button>

                  <div className="text-center pt-2">
                    <Link
                      to="/paciente"
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {t("modals.patient_access.error_already_use")}
                    </Link>
                  </div>
                </form>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
