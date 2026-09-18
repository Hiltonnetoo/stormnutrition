import type {
  Patient,
  WeightRecord,
  AdherenceEntry,
  SelfEvaluation,
} from "../types";
import { isValidCivilDate, getCivilDateFromDate } from "../utils/dateTime";

/**
 * Creates a deterministic, collision-resistant identifier for legacy records lacking an ID.
 */
const generateDeterministicId = (prefix: string, input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `${prefix}_${Math.abs(hash).toString(36)}`;
};

/**
 * Normalizes a single weight record, generating deterministic ID if missing and ensuring finite values.
 */
export const normalizeWeightRecord = (
  raw: unknown,
  fallbackIndex = 0,
): WeightRecord | null => {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const weight = Number(item.weight);
  if (!Number.isFinite(weight) || weight <= 0) return null;

  const date =
    typeof item.date === "string" && item.date.trim()
      ? item.date.trim()
      : new Date().toISOString();

  const id =
    typeof item.id === "string" && item.id.trim()
      ? item.id.trim()
      : generateDeterministicId("w", `${date}_${weight}_${fallbackIndex}`);

  const record: WeightRecord = {
    id,
    date,
    weight: Number(weight.toFixed(2)),
  };

  const validOrigins: WeightRecord["origin"][] = [
    "clinical",
    "remote_guided",
    "self_reported",
  ];
  if (
    typeof item.origin === "string" &&
    validOrigins.includes(item.origin as WeightRecord["origin"])
  ) {
    record.origin = item.origin as WeightRecord["origin"];
  }

  if (typeof item.authorUid === "string" && item.authorUid.trim()) {
    record.authorUid = item.authorUid.trim();
  }
  if (typeof item.clientEventId === "string" && item.clientEventId.trim()) {
    record.clientEventId = item.clientEventId.trim();
  }
  if (Number.isFinite(item.fatPercentage)) {
    record.fatPercentage = Number((item.fatPercentage as number).toFixed(1));
  }
  if (Number.isFinite(item.muscleMassKg)) {
    record.muscleMassKg = Number((item.muscleMassKg as number).toFixed(1));
  }

  return record;
};

/**
 * Normalizes a single adherence entry, ensuring standard civil date format "YYYY-MM-DD".
 */
export const normalizeAdherenceEntry = (
  raw: unknown,
): AdherenceEntry | null => {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  let date = typeof item.date === "string" ? item.date.trim() : "";
  if (!isValidCivilDate(date)) {
    // If full ISO timestamp was stored, extract civil date
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      date = getCivilDateFromDate(parsed);
    }
  }

  if (!isValidCivilDate(date)) return null;

  const entry: AdherenceEntry = {
    date,
    followed: Boolean(item.followed),
  };

  if (typeof item.timestamp === "string" && item.timestamp.trim()) {
    entry.timestamp = item.timestamp.trim();
  }
  if (typeof item.clientEventId === "string" && item.clientEventId.trim()) {
    entry.clientEventId = item.clientEventId.trim();
  }

  return entry;
};

/**
 * Normalizes self-evaluation entries, guaranteeing ID and valid status.
 */
export const normalizeSelfEvaluation = (
  raw: unknown,
  fallbackIndex = 0,
): SelfEvaluation | null => {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const requestDate =
    typeof item.requestDate === "string" && item.requestDate.trim()
      ? item.requestDate.trim()
      : new Date().toISOString();

  const id =
    typeof item.id === "string" && item.id.trim()
      ? item.id.trim()
      : generateDeterministicId("eval", `${requestDate}_${fallbackIndex}`);

  const status = item.status === "completed" ? "completed" : "pending";

  const evaluation: SelfEvaluation = {
    id,
    requestDate,
    status,
  };

  if (typeof item.completionDate === "string" && item.completionDate.trim()) {
    evaluation.completionDate = item.completionDate.trim();
  }
  if (item.measurements && typeof item.measurements === "object") {
    evaluation.measurements =
      item.measurements as SelfEvaluation["measurements"];
  }
  if (item.wellbeing && typeof item.wellbeing === "object") {
    evaluation.wellbeing = item.wellbeing as SelfEvaluation["wellbeing"];
  }
  if (typeof item.notes === "string" && item.notes.trim()) {
    evaluation.notes = item.notes.trim();
  }

  return evaluation;
};

/**
 * Performs idempotent normalization and deduplication of a patient's historical records.
 * Safe to execute multiple times on synthetic or production documents.
 */
export const normalizePatientHistories = (
  patient: Patient,
): { patient: Patient; hasChanges: boolean } => {
  let hasChanges = false;

  // 1. Weight History
  let normalizedWeightHistory: WeightRecord[] | undefined = undefined;
  if (Array.isArray(patient.weightHistory)) {
    const records: WeightRecord[] = [];
    const seenEventKeys = new Set<string>();

    patient.weightHistory.forEach((raw, idx) => {
      const norm = normalizeWeightRecord(raw, idx);
      if (!norm) {
        hasChanges = true;
        return;
      }

      // Deduplication key: prefer clientEventId if present, else composite of date + weight
      const eventKey = norm.clientEventId || `${norm.date}_${norm.weight}`;
      if (seenEventKeys.has(eventKey)) {
        hasChanges = true;
        return;
      }
      seenEventKeys.add(eventKey);

      if (!raw.id && norm.id) {
        hasChanges = true;
      }
      records.push(norm);
    });

    records.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    normalizedWeightHistory = records;
    if (records.length !== patient.weightHistory.length) {
      hasChanges = true;
    }
  }

  // 2. Adherence Log
  let normalizedAdherenceLog: AdherenceEntry[] | undefined = undefined;
  if (Array.isArray(patient.adherenceLog)) {
    const entriesByDate = new Map<string, AdherenceEntry>();

    patient.adherenceLog.forEach((raw) => {
      const norm = normalizeAdherenceEntry(raw);
      if (!norm) {
        hasChanges = true;
        return;
      }
      // If multiple check-ins exist for the same civil date, retain the latest
      entriesByDate.set(norm.date, norm);
    });

    const entries = Array.from(entriesByDate.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    normalizedAdherenceLog = entries;
    if (entries.length !== patient.adherenceLog.length) {
      hasChanges = true;
    }
  }

  // 3. Self Evaluations
  let normalizedSelfEvaluations: SelfEvaluation[] | undefined = undefined;
  if (Array.isArray(patient.selfEvaluations)) {
    const evalsById = new Map<string, SelfEvaluation>();

    patient.selfEvaluations.forEach((raw, idx) => {
      const norm = normalizeSelfEvaluation(raw, idx);
      if (!norm) {
        hasChanges = true;
        return;
      }
      evalsById.set(norm.id, norm);
    });

    const evals = Array.from(evalsById.values()).sort(
      (a, b) =>
        new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
    );

    normalizedSelfEvaluations = evals;
    if (evals.length !== patient.selfEvaluations.length) {
      hasChanges = true;
    }
  }

  const updatedPatient: Patient = {
    ...patient,
    ...(normalizedWeightHistory
      ? { weightHistory: normalizedWeightHistory }
      : {}),
    ...(normalizedAdherenceLog ? { adherenceLog: normalizedAdherenceLog } : {}),
    ...(normalizedSelfEvaluations
      ? { selfEvaluations: normalizedSelfEvaluations }
      : {}),
  };

  return {
    patient: updatedPatient,
    hasChanges,
  };
};
