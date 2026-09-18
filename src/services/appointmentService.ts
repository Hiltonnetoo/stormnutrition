import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "./firebaseCore";
import type { Appointment, AppointmentType, AppointmentStatus } from "../types";
import { parseLocalDateTime, toUtcIsoString } from "../utils/dateTime";

// Helper for error handling
const handleSnapshotError = (error: FirestoreError, context: string) => {
  if (error.code === "permission-denied") {
    console.warn(
      `[Firebase] Permission denied for ${context}. Check your Firestore Security Rules.`,
    );
  } else {
    console.error(`[Firebase] Error in ${context}:`, error);
  }
};

const getAppointmentsCollection = (userId: string) =>
  collection(db, "users", userId, "appointments");
const getAppointmentDoc = (userId: string, apptId: string) =>
  doc(db, "users", userId, "appointments", apptId);

const VALID_TYPES: AppointmentType[] = [
  "consultation",
  "followup",
  "assessment",
  "other",
];
const VALID_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
];

export const validateAppointmentData = (data: Partial<Appointment>): void => {
  if (!data || typeof data !== "object") {
    throw new Error("Dados da consulta inválidos.");
  }
  if (
    data.patientId !== undefined &&
    (!data.patientId ||
      typeof data.patientId !== "string" ||
      !data.patientId.trim())
  ) {
    throw new Error("ID do paciente é obrigatório para agendamento.");
  }
  if (data.dateTime !== undefined) {
    if (typeof data.dateTime !== "string" || !data.dateTime.trim()) {
      throw new Error("Data e horário são obrigatórios.");
    }
    const parsed = parseLocalDateTime(data.dateTime);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Data/horário inválido: "${data.dateTime}".`);
    }
  }
  if (data.durationMinutes !== undefined) {
    if (
      typeof data.durationMinutes !== "number" ||
      !Number.isFinite(data.durationMinutes) ||
      data.durationMinutes < 10 ||
      data.durationMinutes > 480
    ) {
      throw new Error("Duração da consulta deve estar entre 10 e 480 minutos.");
    }
  }
  if (data.type !== undefined && !VALID_TYPES.includes(data.type)) {
    throw new Error(`Tipo de consulta inválido: "${data.type}".`);
  }
  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    throw new Error(`Status de consulta inválido: "${data.status}".`);
  }
};

/**
 * Checks if a candidate appointment overlaps with any non-cancelled existing appointment.
 */
export const findAppointmentConflict = (
  existing: Appointment[],
  candidate: { dateTime: string; durationMinutes: number; id?: string },
): Appointment | null => {
  const candidateStart = parseLocalDateTime(candidate.dateTime).getTime();
  const candidateEnd =
    candidateStart + (candidate.durationMinutes || 60) * 60000;

  if (isNaN(candidateStart)) return null;

  for (const appt of existing) {
    if (appt.id && candidate.id && appt.id === candidate.id) continue;
    if (appt.status === "cancelled") continue;

    const apptStart = parseLocalDateTime(appt.dateTime).getTime();
    const apptEnd = apptStart + (appt.durationMinutes || 60) * 60000;

    if (isNaN(apptStart)) continue;

    // Overlap condition: startA < endB && endA > startB
    if (candidateStart < apptEnd && candidateEnd > apptStart) {
      return appt;
    }
  }

  return null;
};

export const addAppointment = async (
  userId: string,
  data: Omit<Appointment, "id">,
) => {
  validateAppointmentData(data);
  const patientSnap = await getDoc(
    doc(db, "users", userId, "patients", data.patientId.trim()),
  );
  if (patientSnap.exists()) {
    const patientData = patientSnap.data();
    if (patientData.deletionPending) {
      throw new Error(
        "PATIENT_DELETION_PENDING: Não é possível agendar consulta para um paciente em processo de exclusão.",
      );
    }
  }

  const cleanData: Omit<Appointment, "id"> = {
    patientId: data.patientId.trim(),
    patientName: data.patientName.trim(),
    dateTime: data.dateTime.trim(),
    durationMinutes: Math.round(data.durationMinutes),
    type: data.type,
    status: data.status || "scheduled",
    createdAt: data.createdAt || toUtcIsoString(),
  };
  if (typeof data.notes === "string" && data.notes.trim()) {
    cleanData.notes = data.notes.trim();
  }
  return addDoc(getAppointmentsCollection(userId), cleanData);
};

export const updateAppointment = (
  userId: string,
  apptId: string,
  data: Partial<Appointment>,
) => {
  validateAppointmentData(data);
  const cleanData: Partial<Appointment> = {};

  if (data.patientId !== undefined) cleanData.patientId = data.patientId.trim();
  if (data.patientName !== undefined)
    cleanData.patientName = data.patientName.trim();
  if (data.dateTime !== undefined) cleanData.dateTime = data.dateTime.trim();
  if (data.durationMinutes !== undefined)
    cleanData.durationMinutes = Math.round(data.durationMinutes);
  if (data.type !== undefined) cleanData.type = data.type;
  if (data.status !== undefined) cleanData.status = data.status;
  if (data.notes !== undefined) cleanData.notes = data.notes.trim();

  return updateDoc(getAppointmentDoc(userId, apptId), cleanData);
};

export const deleteAppointment = (userId: string, apptId: string) =>
  deleteDoc(getAppointmentDoc(userId, apptId));

export const getAppointments = (
  userId: string,
  callback: (appts: Appointment[]) => void,
  onError?: (e: FirestoreError) => void,
) => {
  if (!userId) return () => {};
  return onSnapshot(
    getAppointmentsCollection(userId),
    (snap) => {
      const appts = snap.docs.map(
        (d) => ({ ...d.data(), id: d.id }) as Appointment,
      );
      appts.sort(
        (a, b) =>
          parseLocalDateTime(a.dateTime).getTime() -
          parseLocalDateTime(b.dateTime).getTime(),
      );
      callback(appts);
    },
    (err) => {
      handleSnapshotError(err, "getAppointments");
      if (onError) onError(err);
    },
  );
};

export const getPatientAppointments = (
  nutritionistId: string,
  patientId: string,
  callback: (appts: Appointment[]) => void,
  onError?: (e: FirestoreError) => void,
) => {
  const q = query(
    collection(db, "users", nutritionistId, "appointments"),
    where("patientId", "==", patientId),
  );
  return onSnapshot(
    q,
    (snap) => {
      const appts = snap.docs.map(
        (d) => ({ ...d.data(), id: d.id }) as Appointment,
      );
      appts.sort(
        (a, b) =>
          parseLocalDateTime(a.dateTime).getTime() -
          parseLocalDateTime(b.dateTime).getTime(),
      );
      callback(appts);
    },
    (err) => {
      handleSnapshotError(err, "getPatientAppointments");
      if (onError) onError(err);
    },
  );
};
