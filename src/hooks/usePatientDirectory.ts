import { createContext, useContext, useEffect } from "react";
import type { FirestoreError } from "firebase/firestore";
import type { Patient } from "../types";

export type PatientDirectoryStatus = "idle" | "loading" | "ready" | "error";

export interface PatientDirectoryValue {
  /** false when no provider is mounted (e.g. isolated component tests). */
  available: boolean;
  patients: Patient[];
  status: PatientDirectoryStatus;
  error: FirestoreError | null;
  request: () => void;
  /** Re-opens the subscription after an error. */
  retry: () => void;
}

export const PatientDirectoryContext = createContext<PatientDirectoryValue>({
  available: false,
  patients: [],
  status: "idle",
  error: null,
  request: () => {},
  retry: () => {},
});

/**
 * Reads the shared patient roster provided by `PatientDirectoryProvider`.
 * With `enabled` (default) the component asks the provider to start the
 * subscription; pass `false` to only observe data that another consumer
 * already loaded (e.g. a closed notification panel).
 */
export function usePatientDirectory(enabled = true) {
  const { available, patients, status, error, request, retry } = useContext(
    PatientDirectoryContext,
  );

  useEffect(() => {
    if (enabled) request();
  }, [enabled, request]);

  return {
    patients,
    error,
    retry,
    ready: status === "ready",
    loading:
      available && enabled && (status === "loading" || status === "idle"),
  };
}
