import { describe, it, expect, afterEach } from "vitest";
import {
  resolveFirebaseRuntime,
  firebaseRuntime,
  FirebaseConfigError,
} from "../firebase.config";

const synthetic = {
  VITE_USE_FIREBASE_EMULATOR: "true",
  VITE_FIREBASE_API_KEY: "demo-api-key-not-a-secret",
  VITE_FIREBASE_AUTH_DOMAIN: "demo-storm.firebaseapp.com",
  VITE_FIREBASE_PROJECT_ID: "demo-storm",
  VITE_FIREBASE_APP_ID: "1:000000000000:web:demostorm000000",
};

describe("firebase.config — resolveFirebaseRuntime", () => {
  const savedHost = process.env.FIRESTORE_EMULATOR_HOST;
  afterEach(() => {
    if (savedHost === undefined) delete process.env.FIRESTORE_EMULATOR_HOST;
    else process.env.FIRESTORE_EMULATOR_HOST = savedHost;
  });

  it("the test suite itself runs on the synthetic emulator configuration, never .env.local", () => {
    // Vitest reads env files only from config/emulator (vite.config.ts).
    expect(import.meta.env.VITE_USE_FIREBASE_EMULATOR).toBe("true");
    expect(import.meta.env.VITE_FIREBASE_PROJECT_ID).toBe("demo-storm");
    expect(import.meta.env.VITE_EMAILJS_PUBLIC_KEY).toBeUndefined();
    expect(firebaseRuntime.useEmulator).toBe(true);
    expect(firebaseRuntime.options.projectId).toBe("demo-storm");
  });

  it("resolves emulator endpoints from the synthetic configuration", () => {
    delete process.env.FIRESTORE_EMULATOR_HOST;
    const runtime = resolveFirebaseRuntime({
      ...synthetic,
      VITE_FIREBASE_AUTH_EMULATOR_HOST: "http://127.0.0.1:9099",
      VITE_FIREBASE_FIRESTORE_EMULATOR_HOST: "127.0.0.1",
      VITE_FIREBASE_FIRESTORE_EMULATOR_PORT: "8080",
    });
    expect(runtime.useEmulator).toBe(true);
    expect(runtime.options.apiKey).toBe("demo-api-key-not-a-secret");
    expect(runtime.emulator).toEqual({
      authUrl: "http://127.0.0.1:9099",
      firestoreHost: "127.0.0.1",
      firestorePort: 8080,
    });
  });

  it("prefers FIRESTORE_EMULATOR_HOST exported by firebase emulators:exec", () => {
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8181";
    const runtime = resolveFirebaseRuntime(synthetic);
    expect(runtime.emulator.firestorePort).toBe(8181);
  });

  it("throws a clear error instead of initializing with a missing API key", () => {
    delete process.env.FIRESTORE_EMULATOR_HOST;
    expect(() =>
      resolveFirebaseRuntime({ VITE_FIREBASE_PROJECT_ID: "my-project" }),
    ).toThrow(FirebaseConfigError);
  });

  it("refuses emulator mode against a real project (no silent cloud fallback)", () => {
    expect(() =>
      resolveFirebaseRuntime({
        ...synthetic,
        VITE_FIREBASE_PROJECT_ID: "stormnutrition-prod",
      }),
    ).toThrow(/demo-/);
  });
});
