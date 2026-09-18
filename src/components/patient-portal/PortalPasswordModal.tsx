import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { updatePassword } from "firebase/auth";
import { auth } from "../../services/firebaseCore";
import { Dialog } from "../Dialog";

export const PortalPasswordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [newPortalPassword, setNewPortalPassword] = useState("");
  const [confirmPortalPassword, setConfirmPortalPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const titleId = useId();
  const descId = useId();
  const newId = useId();
  const confirmId = useId();
  const errorId = useId();

  if (!isOpen) return null;

  const handlePortalPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError("");

    if (newPortalPassword.length < 6) {
      setPasswordChangeError(
        t("patient_portal.password_modal.errors.min_length", {
          defaultValue: "Password must be at least 6 characters.",
        }),
      );
      return;
    }
    if (newPortalPassword !== confirmPortalPassword) {
      setPasswordChangeError(
        t("patient_portal.password_modal.errors.mismatch", {
          defaultValue: "Passwords do not match.",
        }),
      );
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setPasswordChangeError(
        t("patient_portal.password_modal.errors.unauthenticated", {
          defaultValue: "User is not authenticated.",
        }),
      );
      return;
    }

    setPasswordChangeLoading(true);
    try {
      await updatePassword(currentUser, newPortalPassword);
      setPasswordChangeSuccess(true);
      setNewPortalPassword("");
      setConfirmPortalPassword("");
      setTimeout(() => {
        onClose();
        setPasswordChangeSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/requires-recent-login") {
        setPasswordChangeError(
          t("patient_portal.password_modal.errors.requires_recent_login", {
            defaultValue:
              "For security, please sign out and sign in again before changing your password.",
          }),
        );
      } else {
        setPasswordChangeError(
          t("patient_portal.password_modal.errors.generic", {
            defaultValue:
              "Could not update password. Please check your connection and try again.",
          }),
        );
      }
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descId}
      backdropClassName="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-pop border border-slate-100"
    >
      <h3 id={titleId} className="font-bold text-slate-800 text-lg mb-1">
        <span aria-hidden="true">🔐</span>{" "}
        {t("patient_portal.password_modal.title", {
          defaultValue: "Change Password",
        })}
      </h3>
      <p id={descId} className="text-xs text-slate-500 mb-4">
        {t("patient_portal.password_modal.desc", {
          defaultValue: "Choose a new password with at least 6 characters.",
        })}
      </p>

      {passwordChangeSuccess ? (
        <div role="status" className="text-center py-4">
          <span aria-hidden="true" className="text-4xl">
            ✅
          </span>
          <p className="text-sm font-bold text-emerald-700 mt-2">
            {t("patient_portal.password_modal.success", {
              defaultValue: "Password updated successfully!",
            })}
          </p>
        </div>
      ) : (
        <form onSubmit={handlePortalPasswordChange} className="space-y-3">
          <div>
            <label
              htmlFor={newId}
              className="text-xs font-semibold text-slate-600 block mb-1"
            >
              {t("patient_portal.password_modal.new_password", {
                defaultValue: "New password",
              })}
            </label>
            <input
              id={newId}
              type="password"
              autoComplete="new-password"
              minLength={6}
              aria-invalid={passwordChangeError ? true : undefined}
              aria-describedby={passwordChangeError ? errorId : undefined}
              value={newPortalPassword}
              onChange={(e) => {
                setNewPortalPassword(e.target.value);
                setPasswordChangeError("");
              }}
              className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label
              htmlFor={confirmId}
              className="text-xs font-semibold text-slate-600 block mb-1"
            >
              {t("patient_portal.password_modal.confirm_password", {
                defaultValue: "Confirm new password",
              })}
            </label>
            <input
              id={confirmId}
              type="password"
              autoComplete="new-password"
              aria-invalid={passwordChangeError ? true : undefined}
              aria-describedby={passwordChangeError ? errorId : undefined}
              value={confirmPortalPassword}
              onChange={(e) => {
                setConfirmPortalPassword(e.target.value);
                setPasswordChangeError("");
              }}
              className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          {passwordChangeError && (
            <p
              id={errorId}
              role="alert"
              className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2"
            >
              {passwordChangeError}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={passwordChangeLoading}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 focus-ring"
            >
              {t("patient_portal.password_modal.cancel_btn", {
                defaultValue: "Cancel",
              })}
            </button>
            <button
              type="submit"
              disabled={passwordChangeLoading}
              aria-busy={passwordChangeLoading || undefined}
              className="flex-1 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-bold hover:bg-sage-700 transition-colors disabled:opacity-50 focus-ring"
            >
              {passwordChangeLoading
                ? t("a11y.saving")
                : t("patient_portal.password_modal.save_btn", {
                    defaultValue: "Save",
                  })}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
};

export default PortalPasswordModal;
