import emailjs from "@emailjs/browser";
import i18n from "../i18n";
import { getNormalizedLanguage, type SupportedLanguage } from "../utils/locale";
import { AppError, safeLogError } from "../utils/errors";

/**
 * Real sending of emails via EmailJS (client).
 *
 * Configure the three variables in .env.local (see .env.example):
 *   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 *
 * When not configured, `sendDietEmail` throws "EMAIL_NOT_CONFIGURED" so that
 * the UI displays a clear guidance instead of pretending it sent the email.
 *
 * Abuse controls included:
 * - Recipient email syntax validation
 * - In-memory throttling (cooldown and sliding window rate limiting)
 * - Maximum payload size constraints
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_INTERVAL_PER_RECIPIENT_MS = 5000; // 5 seconds cooldown
const MAX_SENDS_PER_WINDOW = 5;
const RATE_WINDOW_MS = 60000; // 1 minute
const MAX_MESSAGE_LENGTH = 5000;

// Recipient email -> list of timestamps
const recipientSendHistory = new Map<string, number[]>();

export const clearEmailRateLimits = (): void => {
  recipientSendHistory.clear();
};

export const isValidEmail = (email: unknown): boolean => {
  return typeof email === "string" && EMAIL_REGEX.test(email.trim());
};

const enforceAbuseControls = (toEmail: string, messageLength: number): void => {
  const normalizedEmail = (toEmail || "").trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new AppError("EMAIL_INVALID_RECIPIENT", "validation", {
      originalCode: "EMAIL_INVALID_RECIPIENT",
    });
  }

  if (messageLength > MAX_MESSAGE_LENGTH) {
    throw new AppError("EMAIL_PAYLOAD_TOO_LARGE", "validation", {
      originalCode: "EMAIL_PAYLOAD_TOO_LARGE",
    });
  }

  const now = Date.now();
  const history = recipientSendHistory.get(normalizedEmail) || [];
  const recentHistory = history.filter((ts) => now - ts < RATE_WINDOW_MS);

  if (recentHistory.length > 0) {
    const lastSend = recentHistory[recentHistory.length - 1];
    if (now - lastSend < MIN_INTERVAL_PER_RECIPIENT_MS) {
      throw new AppError("EMAIL_RATE_LIMITED", "rate_limited", {
        originalCode: "EMAIL_RATE_LIMITED",
      });
    }
  }

  if (recentHistory.length >= MAX_SENDS_PER_WINDOW) {
    throw new AppError("EMAIL_RATE_LIMITED", "rate_limited", {
      originalCode: "EMAIL_RATE_LIMITED",
    });
  }

  recentHistory.push(now);
  recipientSendHistory.set(normalizedEmail, recentHistory);
};

const getEmailConfig = () => ({
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
});

export const DEMO_DOMAINS = [
  "demo.stormnutrition.com",
  "example.com",
  "example.org",
  "test.com",
];

export const isDemoRecipient = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  const lower = email.trim().toLowerCase();
  if (
    lower.endsWith("@demo.stormnutrition.com") ||
    lower.endsWith(".demo.stormnutrition.com")
  ) {
    return true;
  }
  const isDemoOrEmulator =
    import.meta.env.VITE_DEMO_MODE === "true" ||
    (import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true" &&
      DEMO_DOMAINS.some((d) => lower.endsWith(`@${d}`)));
  return isDemoOrEmulator;
};

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
  const messageText =
    params.message ||
    i18n.t("email.diet_message", {
      lng: getNormalizedLanguage(params.locale),
      toName: params.toName,
      dietDate: params.dietDate,
    });

  enforceAbuseControls(params.toEmail, messageText.length);

  if (isDemoRecipient(params.toEmail)) {
    console.info(
      "[EmailService:DemoSimulation] Disparo de dieta simulado com sucesso para ambiente de demonstração.",
      { recipient: params.toEmail, toName: params.toName },
    );
    return;
  }

  const { serviceId, templateId, publicKey } = getEmailConfig();
  if (!serviceId || !templateId || !publicKey) {
    throw new AppError("EMAIL_NOT_CONFIGURED", "unavailable", {
      originalCode: "EMAIL_NOT_CONFIGURED",
    });
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: params.toEmail,
        to_name: params.toName,
        from_name: params.fromName,
        diet_date: params.dietDate,
        portal_url: params.portalUrl || "",
        message: messageText,
      },
      { publicKey },
    );
  } catch (err) {
    safeLogError("emailService:sendDietEmail", err, undefined, {
      recipient: params.toEmail,
    });
    throw err;
  }
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
  const actionUrl = params.inviteUrl || params.portalUrl;
  const messageText = i18n.t("email.portal_message", {
    lng: getNormalizedLanguage(params.locale),
    toName: params.toName,
    fromName: params.fromName,
    toEmail: params.toEmail,
    portalUrl: actionUrl,
  });

  enforceAbuseControls(params.toEmail, messageText.length);

  if (isDemoRecipient(params.toEmail)) {
    console.info(
      "[EmailService:DemoSimulation] Disparo de convite de portal simulado com sucesso para ambiente de demonstração.",
      { recipient: params.toEmail, toName: params.toName },
    );
    return;
  }

  const { serviceId, templateId, publicKey } = getEmailConfig();
  if (!serviceId || !templateId || !publicKey) {
    throw new AppError("EMAIL_NOT_CONFIGURED", "unavailable", {
      originalCode: "EMAIL_NOT_CONFIGURED",
    });
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: params.toEmail,
        to_name: params.toName,
        from_name: params.fromName,
        portal_url: actionUrl,
        message: messageText,
      },
      { publicKey },
    );
  } catch (err) {
    safeLogError("emailService:sendPortalAccessEmail", err, undefined, {
      recipient: params.toEmail,
    });
    throw err;
  }
};
