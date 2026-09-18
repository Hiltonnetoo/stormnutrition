import { useState, useEffect, useCallback, useRef } from "react";
import { getPatientById, getPatientDiets } from "../services/firebaseService";
import type { Patient, DietPlan } from "../types";

export interface UsePatientProfileReturn {
  patient: Patient | null;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  diets: DietPlan[];
  setDiets: React.Dispatch<React.SetStateAction<DietPlan[]>>;
  loading: boolean;
  loadError: boolean;
  refreshPatient: () => Promise<void>;
  /** Loads again after a failure. */
  retry: () => void;
}

export function usePatientProfile(
  nutritionistId: string | undefined,
  patientId: string | undefined,
  onNotFound?: () => void,
): UsePatientProfileReturn {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Callers pass `onNotFound` inline; keeping it in a ref stops a new function
  // identity from re-running the load effect on every render (which re-read
  // the patient and re-subscribed the diets in a loop).
  const onNotFoundRef = useRef(onNotFound);
  onNotFoundRef.current = onNotFound;

  const refreshPatient = useCallback(async () => {
    if (!nutritionistId || !patientId) return;
    try {
      const patientData = await getPatientById(nutritionistId, patientId);
      if (patientData) {
        setPatient(patientData as Patient);
      } else {
        onNotFoundRef.current?.();
      }
    } catch (err) {
      console.error("Error refreshing patient profile:", err);
      setLoadError(true);
    }
  }, [nutritionistId, patientId]);

  useEffect(() => {
    let unsubDiets: (() => void) | undefined;
    let isMounted = true;

    if (nutritionistId && patientId) {
      setLoading(true);
      setLoadError(false);

      const init = async () => {
        try {
          const patientData = await getPatientById(nutritionistId, patientId);
          if (!isMounted) return;

          if (patientData) {
            setPatient(patientData as Patient);
            unsubDiets = getPatientDiets(
              nutritionistId,
              patientId,
              (patientDiets) => {
                if (isMounted) {
                  setDiets(patientDiets as DietPlan[]);
                }
              },
            );
          } else {
            onNotFoundRef.current?.();
          }
        } catch (error) {
          console.error("Error fetching patient profile:", error);
          if (isMounted) setLoadError(true);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      init();
    }

    return () => {
      isMounted = false;
      if (unsubDiets) unsubDiets();
    };
  }, [nutritionistId, patientId, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    patient,
    setPatient,
    diets,
    setDiets,
    loading,
    loadError,
    refreshPatient,
    retry,
  };
}
