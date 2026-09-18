import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { updatePassword } from "firebase/auth";
import { auth } from "../../services/firebaseCore";

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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-pop border border-slate-100">
        <h3 className="font-bold text-slate-800 text-lg mb-1">
          🔐{" "}
          {t("patient_portal.password_modal.title", {
            defaultValue: "Change Password",
          })}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {t("patient_portal.password_modal.desc", {
            defaultValue: "Choose a new password with at least 6 characters.",
          })}
        </p>

        {passwordChangeSuccess ? (
          <div className="text-center py-4">
            <span className="text-4xl">✅</span>
            <p className="text-sm font-bold text-emerald-600 mt-2">
              {t("patient_portal.password_modal.success", {
                defaultValue: "Password updated successfully!",
              })}
            </p>
          </div>
        ) : (
          <form onSubmit={handlePortalPasswordChange} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                {t("patient_portal.password_modal.new_password", {
                  defaultValue: "New password",
                })}
              </label>
              <input
                type="password"
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
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                {t("patient_portal.password_modal.confirm_password", {
                  defaultValue: "Confirm new password",
                })}
              </label>
              <input
                type="password"
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
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                {passwordChangeError}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={passwordChangeLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
              >
                {t("patient_portal.password_modal.cancel_btn", {
                  defaultValue: "Cancel",
                })}
              </button>
              <button
                type="submit"
                disabled={passwordChangeLoading}
                className="flex-1 py-2.5 rounded-xl bg-sage-500 text-white text-sm font-bold hover:bg-sage-600 transition-colors disabled:opacity-50"
              >
                {passwordChangeLoading
                  ? "..."
                  : t("patient_portal.password_modal.save_btn", {
                      defaultValue: "Save",
                    })}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PortalPasswordModal;
