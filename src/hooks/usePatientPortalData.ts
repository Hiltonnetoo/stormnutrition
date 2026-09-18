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
  refreshPatient: () => Promise<void>;
}

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

  const refreshPatient = useCallback(async () => {
    if (!patientProfile) return;
    try {
      const p = await getPatientById(
        patientProfile.nutritionistId,
        patientProfile.patientId,
      );
      if (p) setPatient(p as Patient);
    } catch (err) {
      console.error("Error refreshing patient:", err);
    }
  }, [patientProfile]);

  useEffect(() => {
    if (!patientProfile) return;
    let isMounted = true;

    refreshPatient();

    const unsubDiets = getPatientDiets(
      patientProfile.nutritionistId,
      patientProfile.patientId,
      (dietsList) => {
        if (isMounted) setDiets(dietsList);
      },
    );

    // Only the next scheduled appointment is shown, so only one is read.
    // `dateTime` is clinic wall-clock time: compare it with "now" on the same
    // clock, not with a UTC ISO string.
    const unsubAppts = getNextPatientAppointment(
      patientProfile.nutritionistId,
      patientProfile.patientId,
      formatWallClock(new Date()),
      (appt) => {
        if (isMounted) setNextAppt(appt);
      },
    );

    return () => {
      isMounted = false;
      unsubDiets?.();
      unsubAppts?.();
    };
  }, [patientProfile, refreshPatient]);

  return {
    patient,
    diets,
    nextAppt,
    localWeight,
    localWeightHistory,
    setLocalWeight: setLocalWeightState,
    setLocalWeightHistory: setLocalWeightHistoryState,
    refreshPatient,
  };
}
