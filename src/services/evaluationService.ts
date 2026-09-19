import { doc, runTransaction, type DocumentData } from "firebase/firestore";
import { db } from "./firebaseCore";
import type {
  Patient,
  WeightRecord,
  SelfEvaluation,
  AdherenceEntry,
} from "../types";
import { validatePatient, validateWeightNumber } from "../utils/validation";
import {
  getCivilToday,
  toUtcIsoString,
  isValidCivilDate,
  DEFAULT_CLINIC_TIMEZONE,
} from "../utils/dateTime";

/**
 * Array field exactly as stored. `weightHistory`, `adherenceLog` and
 * `selfEvaluations` are append-only for the patient: the rules require the
 * stored prefix to stay identical, so writes are `stored + [new]`. The
 * sanitized view from validatePatient (defaults filled in, invalid entries
 * dropped) and any re-sorting must never be written back — legacy histories
 * out of order or with future dates are preserved as they are (R02-C).
 * Readers sort for display.
 */
const storedArray = <T>(raw: DocumentData | undefined, field: string): T[] =>
  Array.isArray(raw?.[field]) ? (raw[field] as T[]) : [];

export interface LogWeightOptions {
  clientEventId?: string;
  authorUid?: string;
  date?: string;
  fatPercentage?: number;
  muscleMassKg?: number;
}

/**
 * Logs a patient weight measurement atomically using Firestore transactions.
 * Prevents race conditions and deduplicates retry requests matching clientEventId or ID.
 */
export const logPatientWeight = async (
  nutritionistId: string,
  patientId: string,
  weight: number,
  origin: WeightRecord["origin"] = "self_reported",
  options?: LogWeightOptions,
) => {
  const validWeight = validateWeightNumber(weight);
  const patientRef = doc(db, "users", nutritionistId, "patients", patientId);

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(patientRef);
    if (!snap.exists()) {
      throw new Error("Paciente não encontrado.");
    }

    const history = storedArray<WeightRecord>(snap.data(), "weightHistory");

    // Idempotency / Deduplication check
    if (options?.clientEventId) {
      const existing = history.find(
        (r) => r.clientEventId === options.clientEventId,
      );
      if (existing) {
        return { success: true, duplicated: true, record: existing };
      }
    }

    const recordId =
      options?.clientEventId ||
      `w_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const recordDate = options?.date || toUtcIsoString();

    const newRecord: WeightRecord = {
      id: recordId,
      date: recordDate,
      weight: validWeight,
      origin,
    };

    if (options?.authorUid) newRecord.authorUid = options.authorUid;
    if (options?.clientEventId) newRecord.clientEventId = options.clientEventId;
    if (options?.fatPercentage != null)
      newRecord.fatPercentage = options.fatPercentage;
    if (options?.muscleMassKg != null)
      newRecord.muscleMassKg = options.muscleMassKg;

    // Append-only: never reorder stored records (see storedArray).
    const updatedHistory = [...history, newRecord];

    tx.update(patientRef, {
      weight: validWeight,
      weightHistory: updatedHistory,
    });

    return { success: true, duplicated: false, record: newRecord };
  });
};

/**
 * Requests a new self-evaluation protocol atomically.
 */
export const requestSelfEvaluation = async (
  nutritionistId: string,
  patientId: string,
  options?: { protocolId?: string },
) => {
  const patientRef = doc(db, "users", nutritionistId, "patients", patientId);
  const protocolId =
    options?.protocolId ||
    `eval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(patientRef);
    if (!snap.exists()) {
      throw new Error("Paciente não encontrado.");
    }

    const data = validatePatient({ ...snap.data(), id: snap.id });
    const evaluations = data.selfEvaluations || [];

    // Idempotency: if protocol already requested
    const existing = evaluations.find((e) => e.id === protocolId);
    if (existing) {
      return { success: true, protocolId, duplicated: true };
    }

    const newProtocol: SelfEvaluation = {
      id: protocolId,
      requestDate: toUtcIsoString(),
      status: "pending",
    };

    tx.update(patientRef, {
      activeProtocolId: protocolId,
      selfEvaluations: [...evaluations, newProtocol],
    });

    return { success: true, protocolId, duplicated: false };
  });
};

export interface CompleteEvaluationOptions {
  clientEventId?: string;
  authorUid?: string;
}

/**
 * Completes a self-evaluation protocol atomically, updating protocol status and weight.
 */
export const completeSelfEvaluation = async (
  nutritionistId: string,
  patientId: string,
  protocolId: string,
  evaluationData: Partial<SelfEvaluation>,
  options?: CompleteEvaluationOptions,
) => {
  const patientRef = doc(db, "users", nutritionistId, "patients", patientId);

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(patientRef);
    if (!snap.exists()) {
      throw new Error("Paciente não encontrado.");
    }

    const raw = snap.data();
    let found = false;

    // Only the answered protocol changes; every other stored entry is written
    // back untouched (the rules compare them element by element).
    const evaluations = storedArray<SelfEvaluation>(raw, "selfEvaluations").map(
      (ev) => {
        if (ev.id !== protocolId) return ev;
        found = true;
        const completed: SelfEvaluation = {
          ...ev,
          status: "completed",
          completionDate: ev.completionDate || toUtcIsoString(),
        };
        const measurements = evaluationData.measurements ?? ev.measurements;
        const wellbeing = evaluationData.wellbeing ?? ev.wellbeing;
        const notes = evaluationData.notes ?? ev.notes;
        if (measurements !== undefined) completed.measurements = measurements;
        if (wellbeing !== undefined) completed.wellbeing = wellbeing;
        if (notes !== undefined) completed.notes = notes;
        return completed;
      },
    );

    if (!found) {
      throw new Error(
        `Protocolo de autoavaliação "${protocolId}" não encontrado.`,
      );
    }

    const updates: DocumentData = {
      activeProtocolId: null,
      selfEvaluations: evaluations,
    };

    if (evaluationData.measurements?.weight != null) {
      const validWeight = validateWeightNumber(
        evaluationData.measurements.weight,
      );
      updates.weight = validWeight;

      const history = storedArray<WeightRecord>(raw, "weightHistory");
      const weightRecordId = `eval_weight_${protocolId}`;

      // Deduplicate if weight for this evaluation was already registered
      const alreadyHasWeight = history.some(
        (r) =>
          r.id === weightRecordId ||
          (options?.clientEventId && r.clientEventId === options.clientEventId),
      );

      if (!alreadyHasWeight) {
        const newRecord: WeightRecord = {
          id: weightRecordId,
          date: toUtcIsoString(),
          weight: validWeight,
          origin: "remote_guided",
        };
        if (options?.authorUid) newRecord.authorUid = options.authorUid;
        if (options?.clientEventId)
          newRecord.clientEventId = options.clientEventId;

        updates.weightHistory = [...history, newRecord];
      }
    }

    tx.update(patientRef, updates);
    return { success: true, protocolId };
  });
};

export interface LogAdherenceOptions {
  date?: string; // Explicit civil date ("YYYY-MM-DD")
  timeZone?: string; // Canonical timezone (default: America/Sao_Paulo)
  clientEventId?: string;
}

/**
 * Logs patient daily adherence atomically in the patient's local civil calendar day.
 * Eliminates UTC rollover issues where evening check-ins (e.g. 21h Brasilia) were assigned to tomorrow.
 */
export const logAdherence = async (
  nutritionistId: string,
  patientId: string,
  followed: boolean,
  options?: LogAdherenceOptions,
) => {
  const patientRef = doc(db, "users", nutritionistId, "patients", patientId);
  const civilDate =
    options?.date && isValidCivilDate(options.date)
      ? options.date
      : getCivilToday(options?.timeZone || DEFAULT_CLINIC_TIMEZONE);

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(patientRef);
    if (!snap.exists()) {
      throw new Error("Paciente não encontrado.");
    }

    const log = storedArray<AdherenceEntry>(snap.data(), "adherenceLog");

    const nowUtc = toUtcIsoString();
    let updatedLog: AdherenceEntry[];

    const existingIndex = log.findIndex((entry) => entry.date === civilDate);
    if (existingIndex >= 0) {
      // Update existing entry for today idempotently
      updatedLog = log.map((entry, idx) => {
        if (idx === existingIndex) {
          return {
            ...entry,
            followed,
            timestamp: nowUtc,
            ...(options?.clientEventId
              ? { clientEventId: options.clientEventId }
              : {}),
          };
        }
        return entry;
      });
    } else {
      // Append new entry for this civil date
      const newEntry: AdherenceEntry = {
        date: civilDate,
        followed,
        timestamp: nowUtc,
        ...(options?.clientEventId
          ? { clientEventId: options.clientEventId }
          : {}),
      };
      updatedLog = [...log, newEntry];
    }

    tx.update(patientRef, {
      adherenceLog: updatedLog,
    });

    return { success: true, date: civilDate, followed };
  });
};

export const updatePatientSettings = async (
  nutritionistId: string,
  patientId: string,
  settings: Partial<NonNullable<Patient["automationSettings"]>>,
) => {
  const patientRef = doc(db, "users", nutritionistId, "patients", patientId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(patientRef);
    if (!snap.exists()) {
      throw new Error("Paciente não encontrado.");
    }
    const data = validatePatient({ ...snap.data(), id: snap.id });
    tx.update(patientRef, {
      automationSettings: {
        ...data.automationSettings,
        ...settings,
      },
    });
  });
};
