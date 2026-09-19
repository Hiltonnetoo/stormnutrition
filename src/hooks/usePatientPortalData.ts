import { useState, useEffect, useCallback } from "react";
import {
  getPatientById,
  getPatientDiets,
  getNextPatientAppointment,
} from "../services/firebaseService";
import { formatWallClock } from "../utils/dateTime";
import type {
  Patient,
  AnyDietPlan,
  Appointment,
  WeightRecord,
  PatientPortalProfile,
} from "../types";

export interface UsePatientPortalDataReturn {
  patient: Patient | null;
  diets: AnyDietPlan[];
  nextAppt: Appointment | null;
  localWeight: number | null;
  localWeightHistory: WeightRecord[] | null;
  setLocalWeight: (weight: number) => void;
  setLocalWeightHistory: (history: WeightRecord[]) => void;
  /** Resolves false when the read was denied (retried automatically). */
  refreshPatient: () => Promise<boolean>;
  /** True until the patient, diets and next appointment first resolve, so the
   *  portal shows a loading state instead of false "empty" sections (UI06). */
  loading: boolean;
  /** UI06: why data could not be read after the retries — "denied" (access
   *  revoked/unavailable) or "failed" (read error). Null when it loaded. */
  loadError: "denied" | "failed" | null;
  retryLoad: () => void;
}

const MAX_ACCESS_RETRIES = 4;

export function usePatientPortalData(
  patientProfile: PatientPortalProfile | null,
): UsePatientPortalDataReturn {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diets, setDiets] = useState<AnyDietPlan[]>([]);
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);
  const [localWeight, setLocalWeightState] = useState<number | null>(null);
  const [localWeightHistory, setLocalWeightHistoryState] = useState<
    WeightRecord[] | null
  >(null);
  const [loaded, setLoaded] = useState({
    patient: false,
    diets: false,
    appts: false,
  });
  const markLoaded = useCallback(
    (key: "patient" | "diets" | "appts") =>
      setLoaded((prev) => (prev[key] ? prev : { ...prev, [key]: true })),
    [],
  );

  // Right after an invitation is accepted, the profile can reach the client
  // before the acceptance batch is visible to the rules on the server, so
  // the first reads may be denied. Retry a few times before settling.
  const [accessRetry, setAccessRetry] = useState(0);
  const [loadError, setLoadError] = useState<"denied" | "failed" | null>(null);

  const refreshPatient = useCallback(async (): Promise<boolean> => {
    if (!patientProfile) return true;
    try {
      const p = await getPatientById(
        patientProfile.nutritionistId,
        patientProfile.patientId,
      );
      if (p) setPatient(p as Patient);
      return true;
    } catch (err) {
      console.error("Error refreshing patient:", err);
      return (err as { code?: string } | null)?.code !== "permission-denied";
    } finally {
      markLoaded("patient");
    }
  }, [patientProfile, markLoaded]);

  useEffect(() => {
    if (!patientProfile) return;
    let isMounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const canRetry = accessRetry < MAX_ACCESS_RETRIES;
    const scheduleRetry = () => {
      if (!isMounted || retryTimer || !canRetry) return;
      retryTimer = setTimeout(
        () => setAccessRetry((n) => n + 1),
        500 * (accessRetry + 1),
      );
    };
    const onListError =
      (key: "diets" | "appts") => (err?: { code?: string }) => {
        if (!isMounted) return;
        if (err?.code === "permission-denied" && canRetry) scheduleRetry();
        else {
          setLoadError(err?.code === "permission-denied" ? "denied" : "failed");
          markLoaded(key);
        }
      };

    void refreshPatient().then((ok) => {
      if (!ok) scheduleRetry();
    });
    // Without both ids the subscriptions below are no-ops that never call
    // back; the patient fetch above still runs (it resolves the patient on
    // its own), so only the list sections are marked as settled.
    if (!patientProfile.nutritionistId || !patientProfile.patientId) {
      markLoaded("diets");
      markLoaded("appts");
    }

    const unsubDiets = getPatientDiets(
      patientProfile.nutritionistId,
      patientProfile.patientId,
      (dietsList) => {
        if (!isMounted) return;
        setDiets(dietsList);
        markLoaded("diets");
      },
      onListError("diets"),
    );

    // Only the next scheduled appointment is shown, so only one is read.
    // `dateTime` is clinic wall-clock time: compare it with "now" on the same
    // clock, not with a UTC ISO string.
    const unsubAppts = getNextPatientAppointment(
      patientProfile.nutritionistId,
      patientProfile.patientId,
      formatWallClock(new Date()),
      (appt) => {
        if (!isMounted) return;
        setNextAppt(appt);
        markLoaded("appts");
      },
      onListError("appts"),
    );

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
      unsubDiets?.();
      unsubAppts?.();
    };
  }, [patientProfile, refreshPatient, markLoaded, accessRetry]);

  return {
    patient,
    diets,
    nextAppt,
    localWeight,
    localWeightHistory,
    setLocalWeight: setLocalWeightState,
    setLocalWeightHistory: setLocalWeightHistoryState,
    refreshPatient,
    loadError,
    retryLoad: () => {
      setLoadError(null);
      setAccessRetry((n) => n + 1);
    },
    loading:
      !!patientProfile && !(loaded.patient && loaded.diets && loaded.appts),
  };
}
