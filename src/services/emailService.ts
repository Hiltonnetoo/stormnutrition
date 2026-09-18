import emailjs from "@emailjs/browser";
import i18n from "../i18n";
import { getNormalizedLanguage, type SupportedLanguage } from "../utils/locale";

/**
 * Real sending of emails via EmailJS (client).
 *
 * Configure the three variables in .env.local (see .env.example):
 *   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 *
 * When not configured, `sendDietEmail` throws "EMAIL_NOT_CONFIGURED" so that
 * the UI displays a clear guidance instead of pretending it sent the email.
 *
 * Evolutionary path (production): replace EmailJS with a Firebase Cloud Function
 * + transactional provider (Resend/SendGrid), maintaining the same
 * signature `sendDietEmail` here.
 */

const getEmailConfig = () => ({
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
});

export const isEmailConfigured = (): boolean => {
  const { serviceId, templateId, publicKey } = getEmailConfig();
  return Boolean(serviceId && templateId && publicKey);
};

export interface DietEmailParams {
  toEmail: string;
  toName: string;
  fromName: string;
  dietDate: string;
  portalUrl?: string;
  message?: string;
  locale?: SupportedLanguage | string;
}

export const sendDietEmail = async (params: DietEmailParams): Promise<void> => {
  const { serviceId, templateId, publicKey } = getEmailConfig();
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }
  const targetLng = getNormalizedLanguage(params.locale);
  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: params.toEmail,
      to_name: params.toName,
      from_name: params.fromName,
      diet_date: params.dietDate,
      portal_url: params.portalUrl || "",
      message:
        params.message ||
        i18n.t("email.diet_message", {
          lng: targetLng,
          toName: params.toName,
          dietDate: params.dietDate,
        }),
    },
    { publicKey },
  );
};

export interface PortalAccessEmailParams {
  toEmail: string;
  toName: string;
  fromName: string;
  portalUrl: string;
  inviteUrl?: string;
  /** @deprecated Plaintext passwords removed for security */
  passwordText?: string;
  locale?: SupportedLanguage | string;
}

export const sendPortalAccessEmail = async (
  params: PortalAccessEmailParams,
): Promise<void> => {
  const { serviceId, templateId, publicKey } = getEmailConfig();
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }
  const targetLng = getNormalizedLanguage(params.locale);
  const actionUrl = params.inviteUrl || params.portalUrl;
  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: params.toEmail,
      to_name: params.toName,
      from_name: params.fromName,
      portal_url: actionUrl,
      message: i18n.t("email.portal_message", {
        lng: targetLng,
        toName: params.toName,
        fromName: params.fromName,
        toEmail: params.toEmail,
        portalUrl: actionUrl,
      }),
    },
    { publicKey },
  );
};
