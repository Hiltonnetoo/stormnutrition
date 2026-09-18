import { useState, useEffect, useCallback } from "react";
import {
  getPatientById,
  getPatientDiets,
  getPatientAppointments,
} from "../services/firebaseService";
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

    const unsubAppts = getPatientAppointments(
      patientProfile.nutritionistId,
      patientProfile.patientId,
      (appts) => {
        if (!isMounted) return;
        const now = new Date().toISOString();
        const upcoming = appts.filter(
          (a) => a.status === "scheduled" && a.dateTime >= now,
        );
        setNextAppt(upcoming[0] || null);
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
