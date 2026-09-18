import { describe, it, expect, vi } from "vitest";
import {
  validateAppConfiguration,
  runStartupDiagnostics,
  type RuntimeEnv,
} from "../configValidation";

describe("configValidation service", () => {
  const completeLiveEnv: RuntimeEnv = {
    VITE_FIREBASE_API_KEY: "AIzaSyRealApiKey12345",
    VITE_FIREBASE_AUTH_DOMAIN: "isamais-prod.firebaseapp.com",
    VITE_FIREBASE_PROJECT_ID: "isamais-prod",
    VITE_FIREBASE_STORAGE_BUCKET: "isamais-prod.appspot.com",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "1234567890",
    VITE_FIREBASE_APP_ID: "1:1234567890:web:abcdef",
    VITE_EMAILJS_SERVICE_ID: "service_abc",
    VITE_EMAILJS_TEMPLATE_ID: "template_xyz",
    VITE_EMAILJS_PUBLIC_KEY: "pub_12345",
    MODE: "production",
  };

  it("validates successfully when all required Firebase keys are present", () => {
    const result = validateAppConfiguration(completeLiveEnv);

    expect(result.isValid).toBe(true);
    expect(result.isEmulatorMode).toBe(false);
    expect(result.isEmailConfigured).toBe(true);
    expect(result.missingFirebaseKeys).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it("detects missing or placeholder Firebase keys in live cloud mode", () => {
    const brokenEnv: RuntimeEnv = {
      ...completeLiveEnv,
      VITE_FIREBASE_API_KEY: "AIzaSy_SUBSTITUA_PELA_SUA_CHAVE",
      VITE_FIREBASE_PROJECT_ID: undefined,
    };

    const result = validateAppConfiguration(brokenEnv);

    expect(result.isValid).toBe(false);
    expect(result.missingFirebaseKeys).toContain("VITE_FIREBASE_API_KEY");
    expect(result.missingFirebaseKeys).toContain("VITE_FIREBASE_PROJECT_ID");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("permits missing keys when in emulator mode with appropriate warning", () => {
    const emulatorEnv: RuntimeEnv = {
      VITE_USE_FIREBASE_EMULATOR: "true",
      MODE: "development",
    };

    const result = validateAppConfiguration(emulatorEnv);

    expect(result.isValid).toBe(true);
    expect(result.isEmulatorMode).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings.some((w) => w.includes("Firebase emulators"))).toBe(
      true,
    );
  });

  it("flags unconfigured EmailJS as inactive without breaking valid Firebase status", () => {
    const noEmailEnv: RuntimeEnv = {
      ...completeLiveEnv,
      VITE_EMAILJS_SERVICE_ID: undefined,
    };

    const result = validateAppConfiguration(noEmailEnv);

    expect(result.isValid).toBe(true);
    expect(result.isEmailConfigured).toBe(false);
    expect(result.warnings.some((w) => w.includes("EmailJS"))).toBe(true);
  });

  it("runStartupDiagnostics runs and produces structured result", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const result = runStartupDiagnostics(completeLiveEnv, true);

    expect(result.isValid).toBe(true);
    expect(result.environment).toBe("production");

    infoSpy.mockRestore();
  });
});
