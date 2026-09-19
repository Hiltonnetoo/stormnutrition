import type { FirebaseOptions } from "firebase/app";
import {
  getRuntimeEnv,
  validateAppConfiguration,
  type RuntimeEnv,
} from "./configValidation";

/** Invalid or unsafe Firebase configuration, detected before initialization. */
export class FirebaseConfigError extends Error {
  readonly problems: string[];

  constructor(problems: string[]) {
    super(
      `Invalid Firebase configuration:\n- ${problems.join("\n- ")}\n` +
        "Cloud mode: copy .env.example to .env.local with your project's values. " +
        "Local/tests: use the emulators (npm run dev:emulated), configured by config/emulator/.env.",
    );
    this.name = "FirebaseConfigError";
    this.problems = problems;
  }
}

export interface FirebaseRuntime {
  options: FirebaseOptions;
  useEmulator: boolean;
  emulator: { authUrl: string; firestoreHost: string; firestorePort: number };
}

/**
 * Resolves the Firebase options and, in emulator mode, the local endpoints.
 * Throws FirebaseConfigError when the configuration is incomplete or unsafe
 * (e.g. emulator mode pointing at a non-"demo-" project), so nothing is
 * initialized against the wrong environment.
 *
 * Node suites started by `firebase emulators:exec` expose
 * FIRESTORE_EMULATOR_HOST; it takes precedence over the Vite variables.
 */
export const resolveFirebaseRuntime = (
  env: RuntimeEnv = getRuntimeEnv(),
): FirebaseRuntime => {
  const check = validateAppConfiguration(env);
  if (!check.isValid) throw new FirebaseConfigError(check.errors);

  const processEmulatorHost =
    typeof process !== "undefined"
      ? process.env?.FIRESTORE_EMULATOR_HOST
      : undefined;
  const [processHost, processPort] = processEmulatorHost?.split(":") ?? [];

  return {
    options: {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
    },
    useEmulator: check.isEmulatorMode,
    emulator: {
      authUrl: env.VITE_FIREBASE_AUTH_EMULATOR_HOST || "http://127.0.0.1:9099",
      firestoreHost:
        processHost || env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST || "127.0.0.1",
      firestorePort: Number(
        processPort || env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT || 8080,
      ),
    },
  };
};

export const firebaseRuntime = resolveFirebaseRuntime();
export const firebaseConfig = firebaseRuntime.options;
