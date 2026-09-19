import emailjs from "@emailjs/browser";
import i18n from "../i18n";
import { getNormalizedLanguage, type SupportedLanguage } from "../utils/locale";
import { AppError, safeLogError } from "../utils/errors";

/**
 * Email Transport Mode:
 * - 'simulated': Dispatches are intercepted locally, logged securely and returned with { simulated: true }.
 *   Always active in Firebase Emulators (VITE_USE_FIREBASE_EMULATOR=true), Demo Mode (VITE_DEMO_MODE=true),
 *   automated test suites, or for any address on a synthetic domain.
 * - 'real': Real client dispatch via EmailJS. Active ONLY in production/development with non-demo recipients,
 *   outside of emulators/demo, and when EmailJS keys are configured.
 */
export type EmailTransportMode = "simulated" | "real";

export interface EmailDispatchResult {
  status: "sent" | "simulated";
  simulated: boolean;
  recipient: string;
}

/**
 * Real sending of emails via EmailJS (client).
 *
 * Configure the three variables in .env.local (see .env.example):
 *   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 *
 * When not configured and in real mode, `sendDietEmail` throws "EMAIL_NOT_CONFIGURED" so that
 * the UI displays a clear guidance instead of pretending it sent the email.
 *
 * IMPORTANT SECURITY ARCHITECTURE NOTE (Passo C10.7):
 * - The in-memory rate limiting (cooldown and sliding window) implemented below in
 *   `enforceAbuseControls` is a client-side UX protection designed to prevent duplicate
 *   clicks, rapid accidental triggers, and obvious misuse in normal user sessions.
 * - Because it executes in the browser memory, it is NOT a trusted security perimeter
 *   against a malicious adversary with modified client code or automated tools.
 * - In production environments, strict anti-abuse must be configured at the provider
 *   or backend layer:
 *   1. EmailJS Console: Restricted Authorized Domains/Origins (whitelisting only the production app origin).
 *   2. EmailJS Console: IP Rate Limiting and strict monthly/daily quota controls.
 *   3. Optional reCAPTCHA v3 verification before dispatch.
 *   4. Or transitioning high-value email endpoints to an authenticated Firebase Cloud Function proxy.
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

/**
 * Passo C10.1: Classificação do domínio do destinatário (isolada do modo de transporte).
 * Identifica o domínio sintético oficial da plataforma Storm Nutrition.
 */
export const isDemoDomain = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  const lower = email.trim().toLowerCase();
  return (
    lower.endsWith("@demo.stormnutrition.com") ||
    lower.endsWith(".demo.stormnutrition.com")
  );
};

/**
 * Passo C10.1: Identifica domínios conhecidos sintéticos de demonstração e testes
 * (@demo.stormnutrition.com, @example.com, @test.com, @example.org).
 * Este conceito classifica o destinatário, independentemente do transporte do ambiente.
 */
export const isDemoRecipient = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  const lower = email.trim().toLowerCase();
  if (isDemoDomain(lower)) return true;
  const atIdx = lower.lastIndexOf("@");
  if (atIdx === -1) return false;
  const domain = lower.slice(atIdx + 1);
  return DEMO_DOMAINS.some((d) => domain === d || domain.endsWith("." + d));
};

/**
 * Passo C10.1, C10.2 e C10.3: Resolução do modo de transporte.
 * Garante que emuladores, testes e demo isolada usam transporte simulado para qualquer
 * endereço, independentemente de chaves reais presentes por engano no ambiente.
 */
export const resolveEmailTransport = (
  recipientEmail?: string,
): EmailTransportMode => {
  const envTransport = (
    import.meta.env.VITE_EMAIL_TRANSPORT as string | undefined
  )
    ?.trim()
    .toLowerCase();

  // 1. Ambientes isolados: Emulador Firebase, Modo Demonstração ou Suíte de Testes
  // NUNCA chamam APIs externas, MESMO se houver configuração explícita para "real".
  const isEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true";
  const isDemo = import.meta.env.VITE_DEMO_MODE === "true";
  const isTest = import.meta.env.MODE === "test";

  if (isEmulator || isDemo || isTest) {
    return "simulated";
  }

  // 2. Destinatários pertencentes a domínios sintéticos conhecidos são SEMPRE simulados
  if (recipientEmail && isDemoRecipient(recipientEmail)) {
    return "simulated";
  }

  // 3. Fora do isolamento, exigir configuração explícita válida para envio real.
  // Sem VITE_EMAIL_TRANSPORT=real explícito, o comportamento seguro é simular.
  if (envTransport === "real") {
    return "real";
  }

  return "simulated";
};

export const isSimulatedEmailTransport = (recipientEmail?: string): boolean => {
  return resolveEmailTransport(recipientEmail) === "simulated";
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

export const sendDietEmail = async (
  params: DietEmailParams,
): Promise<EmailDispatchResult> => {
  const messageText =
    params.message ||
    i18n.t("email.diet_message", {
      lng: getNormalizedLanguage(params.locale),
      toName: params.toName,
      dietDate: params.dietDate,
    });

  enforceAbuseControls(params.toEmail, messageText.length);

  const transport = resolveEmailTransport(params.toEmail);
  if (transport === "simulated") {
    console.info(
      "[EmailService:Simulation] Disparo de dieta simulado com sucesso no ambiente isolado.",
      { recipient: params.toEmail, toName: params.toName },
    );
    return {
      status: "simulated",
      simulated: true,
      recipient: params.toEmail,
    };
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
    return {
      status: "sent",
      simulated: false,
      recipient: params.toEmail,
    };
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
): Promise<EmailDispatchResult> => {
  const actionUrl = params.inviteUrl || params.portalUrl;
  const messageText = i18n.t("email.portal_message", {
    lng: getNormalizedLanguage(params.locale),
    toName: params.toName,
    fromName: params.fromName,
    toEmail: params.toEmail,
    portalUrl: actionUrl,
  });

  enforceAbuseControls(params.toEmail, messageText.length);

  const transport = resolveEmailTransport(params.toEmail);
  if (transport === "simulated") {
    console.info(
      "[EmailService:Simulation] Disparo de convite de portal simulado com sucesso no ambiente isolado.",
      { recipient: params.toEmail, toName: params.toName },
    );
    return {
      status: "simulated",
      simulated: true,
      recipient: params.toEmail,
    };
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
    return {
      status: "sent",
      simulated: false,
      recipient: params.toEmail,
    };
  } catch (err) {
    safeLogError("emailService:sendPortalAccessEmail", err, undefined, {
      recipient: params.toEmail,
    });
    throw err;
  }
};
