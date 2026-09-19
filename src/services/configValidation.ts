/**
 * Runtime and startup configuration validation.
 * Diagnoses missing environment variables, emulator configurations, and third-party integrations
 * without exposing sensitive credentials in logs.
 */

export interface ConfigValidationResult {
  isValid: boolean;
  isEmulatorMode: boolean;
  isEmailConfigured: boolean;
  environment: "development" | "production" | "test";
  missingFirebaseKeys: string[];
  warnings: string[];
  errors: string[];
}

export interface RuntimeEnv {
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_USE_FIREBASE_EMULATOR?: string;
  VITE_FIREBASE_AUTH_EMULATOR_HOST?: string;
  VITE_FIREBASE_FIRESTORE_EMULATOR_HOST?: string;
  VITE_FIREBASE_FIRESTORE_EMULATOR_PORT?: string;
  VITE_EMAILJS_SERVICE_ID?: string;
  VITE_EMAILJS_TEMPLATE_ID?: string;
  VITE_EMAILJS_PUBLIC_KEY?: string;
  MODE?: string;
  [key: string]: string | undefined;
}

/** Project ID of the synthetic emulator workspace (seed, rules, E2E). */
export const DEMO_PROJECT_ID = "demo-storm";
/** Firebase CLI treats "demo-" projects as fake: nothing reaches the cloud. */
export const DEMO_PROJECT_PREFIX = "demo-";

const REQUIRED_FIREBASE_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

export const getRuntimeEnv = (): RuntimeEnv => {
  return typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env as RuntimeEnv)
    : typeof process !== "undefined" && process.env
      ? (process.env as RuntimeEnv)
      : {};
};

export const validateAppConfiguration = (
  env: RuntimeEnv = getRuntimeEnv(),
): ConfigValidationResult => {
  const isEmulatorMode =
    env.VITE_USE_FIREBASE_EMULATOR === "true" ||
    (typeof process !== "undefined" &&
      Boolean(process.env?.FIRESTORE_EMULATOR_HOST));

  const environment =
    env.MODE === "production"
      ? "production"
      : env.MODE === "test" ||
          (typeof process !== "undefined" && process.env?.NODE_ENV === "test")
        ? "test"
        : "development";

  const missingFirebaseKeys: string[] = [];
  for (const key of REQUIRED_FIREBASE_KEYS) {
    const value = env[key];
    if (!value || value.includes("SUBSTITUA_PELA_SUA_CHAVE")) {
      missingFirebaseKeys.push(key);
    }
  }

  const isEmailConfigured = Boolean(
    env.VITE_EMAILJS_SERVICE_ID &&
    env.VITE_EMAILJS_TEMPLATE_ID &&
    env.VITE_EMAILJS_PUBLIC_KEY,
  );

  const errors: string[] = [];
  const warnings: string[] = [];

  if (isEmulatorMode) {
    // Emulator mode runs on the synthetic configuration in config/emulator/.env.
    // The SDK still needs a non-empty API key, and the project must be a
    // "demo-" project: services without an emulator (e.g. Storage) then cannot
    // reach a real Firebase project by accident.
    const projectId = env.VITE_FIREBASE_PROJECT_ID;
    if (!env.VITE_FIREBASE_API_KEY) {
      errors.push(
        "Emulator mode requires a synthetic VITE_FIREBASE_API_KEY (see config/emulator/.env).",
      );
    }
    if (!projectId) {
      errors.push(
        `Emulator mode requires VITE_FIREBASE_PROJECT_ID=${DEMO_PROJECT_ID} (see config/emulator/.env).`,
      );
    } else if (!projectId.startsWith(DEMO_PROJECT_PREFIX)) {
      errors.push(
        `Emulator mode refuses project "${projectId}": use a "${DEMO_PROJECT_PREFIX}" project (${DEMO_PROJECT_ID}) so tests never reach a real Firebase project.`,
      );
    }
    const optionalMissing = missingFirebaseKeys.filter(
      (key) =>
        key !== "VITE_FIREBASE_API_KEY" && key !== "VITE_FIREBASE_PROJECT_ID",
    );
    if (optionalMissing.length > 0) {
      warnings.push(
        `Firebase emulators active; synthetic values not provided for ${optionalMissing.join(", ")}.`,
      );
    }
  } else {
    // In live cloud mode, missing keys are blocking errors
    if (missingFirebaseKeys.length > 0) {
      errors.push(
        `Missing required Firebase configuration keys: ${missingFirebaseKeys.join(
          ", ",
        )}. Please check your .env.local file (see .env.example).`,
      );
    }
  }

  if (!isEmailConfigured) {
    warnings.push(
      "EmailJS service not configured. Outgoing email features will operate with explicit mock/notice state.",
    );
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    isEmulatorMode,
    isEmailConfigured,
    environment,
    missingFirebaseKeys,
    warnings,
    errors,
  };
};

let diagnosticsRan = false;

export const runStartupDiagnostics = (
  env: RuntimeEnv = getRuntimeEnv(),
  force = false,
): ConfigValidationResult => {
  if (diagnosticsRan && !force) {
    return validateAppConfiguration(env);
  }
  diagnosticsRan = true;

  const result = validateAppConfiguration(env);

  if (result.environment !== "test") {
    if (result.isEmulatorMode) {
      console.info(
        "🛠️ [Storm Nutrition Config] Executando em modo de emuladores locais (offline).",
      );
    } else if (result.isValid) {
      console.info(
        "🔥 [Storm Nutrition Config] Configuração do Firebase validada com sucesso.",
      );
    }

    if (result.errors.length > 0) {
      console.error(
        "❌ [Storm Nutrition Config] Erro de configuração na inicialização:",
      );
      for (const err of result.errors) {
        console.error(`   - ${err}`);
      }
    }

    if (result.warnings.length > 0 && !result.isEmulatorMode) {
      console.warn("⚠️ [Storm Nutrition Config] Avisos de configuração:");
      for (const warn of result.warnings) {
        console.warn(`   - ${warn}`);
      }
    }
  }

  return result;
};
