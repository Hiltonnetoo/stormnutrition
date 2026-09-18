import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type DocumentData,
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

const toAppointment = (d: QueryDocumentSnapshot<DocumentData>) =>
  ({ ...d.data(), id: d.id }) as Appointment;

/**
 * Appointments whose wall-clock `dateTime` falls in [start, end) — e.g. the
 * month shown by the calendar. `dateTime` is stored as "YYYY-MM-DDTHH:mm:ss",
 * so string bounds such as "2026-09-01" compare chronologically.
 */
export const getAppointmentsInRange = (
  userId: string,
  start: string,
  end: string,
  callback: (appts: Appointment[]) => void,
  onError?: (e: FirestoreError) => void,
) => {
  if (!userId) return () => {};
  const q = query(
    getAppointmentsCollection(userId),
    where("dateTime", ">=", start),
    where("dateTime", "<", end),
    orderBy("dateTime"),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map(toAppointment)),
    (err) => {
      handleSnapshotError(err, "getAppointmentsInRange");
      if (onError) onError(err);
    },
  );
};

/**
 * Next `max` scheduled appointments from `from` (wall-clock) onwards.
 * Requires the composite index appointments(status ASC, dateTime ASC).
 */
export const getUpcomingAppointments = (
  userId: string,
  from: string,
  max: number,
  callback: (appts: Appointment[]) => void,
  onError?: (e: FirestoreError) => void,
) => {
  if (!userId) return () => {};
  const q = query(
    getAppointmentsCollection(userId),
    where("status", "==", "scheduled"),
    where("dateTime", ">=", from),
    orderBy("dateTime"),
    limit(max),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map(toAppointment)),
    (err) => {
      handleSnapshotError(err, "getUpcomingAppointments");
      if (onError) onError(err);
    },
  );
};

/**
 * The patient's next scheduled appointment (portal). The `patientId` filter is
 * required by the security rules for patient reads.
 * Requires the composite index appointments(patientId ASC, status ASC, dateTime ASC).
 */
export const getNextPatientAppointment = (
  nutritionistId: string,
  patientId: string,
  from: string,
  callback: (appt: Appointment | null) => void,
  onError?: (e: FirestoreError) => void,
) => {
  if (!nutritionistId || !patientId) return () => {};
  const q = query(
    getAppointmentsCollection(nutritionistId),
    where("patientId", "==", patientId),
    where("status", "==", "scheduled"),
    where("dateTime", ">=", from),
    orderBy("dateTime"),
    limit(1),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.empty ? null : toAppointment(snap.docs[0])),
    (err) => {
      handleSnapshotError(err, "getNextPatientAppointment");
      if (onError) onError(err);
    },
  );
};
