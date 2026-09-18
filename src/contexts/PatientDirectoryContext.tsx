import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { FirestoreError } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { getPatients } from "../services/firebaseService";
import {
  PatientDirectoryContext,
  type PatientDirectoryStatus,
  type PatientDirectoryValue,
} from "../hooks/usePatientDirectory";
import type { Patient } from "../types";

interface DirectoryState {
  uid: string | null;
  patients: Patient[];
  status: PatientDirectoryStatus;
  error: FirestoreError | null;
}

const EMPTY: Patient[] = [];

/**
 * Shared, session-scoped patient roster.
 *
 * The sidebar search, the notification bell and several screens need the
 * whole roster (substring search, pickers, activity feed). Instead of each one
 * opening its own listener on the `patients` collection — re-downloaded on
 * every navigation — a single real-time subscription is opened the first time
 * a consumer asks for it and kept until logout or account switch.
 */
export const PatientDirectoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid ?? null;
  const [requested, setRequested] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<DirectoryState>({
    uid: null,
    patients: EMPTY,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    if (!uid || !requested) return;
    setState({ uid, patients: EMPTY, status: "loading", error: null });
    return getPatients(
      uid,
      (patients) => setState({ uid, patients, status: "ready", error: null }),
      (error) => setState((s) => ({ ...s, uid, status: "error", error })),
    );
  }, [uid, requested, attempt]);

  const request = useCallback(() => setRequested(true), []);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // Never expose a roster that belongs to a previous account.
  const own = state.uid === uid;
  const patients = own ? state.patients : EMPTY;
  const error = own ? state.error : null;
  const rawStatus = own ? state.status : "idle";
  const status: PatientDirectoryStatus =
    requested && rawStatus === "idle" ? "loading" : rawStatus;

  const value = useMemo<PatientDirectoryValue>(
    () => ({ available: true, patients, status, error, request, retry }),
    [patients, status, error, request, retry],
  );

  return (
    <PatientDirectoryContext.Provider value={value}>
      {children}
    </PatientDirectoryContext.Provider>
  );
};
