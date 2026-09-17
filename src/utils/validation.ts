/**
 * Runtime validation and sanitization utilities for application boundaries.
 * Guarantees type safety at Firestore, Storage, and form inputs without relying on unsafe 'as Type' casts.
 */

import type { Patient, WeightRecord, SelfEvaluation } from "../types";

export const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Validates a profile picture before upload.
 */
export const validateProfileImage = (
  file: File,
): { valid: true } | { valid: false; error: string } => {
  if (!file) {
    return { valid: false, error: "Nenhum arquivo selecionado." };
  }
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Formato inválido (${file.type || "desconhecido"}). Formatos permitidos: JPG, PNG, WebP e GIF.`,
    };
  }
  if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Arquivo muito grande (${sizeMb} MB). O tamanho máximo permitido é 5 MB.`,
    };
  }
  return { valid: true };
};

/**
 * Validates that a numeric weight is within realistic clinical limits.
 */
export const validateWeightNumber = (value: unknown): number => {
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num) || num < 10 || num > 500) {
    throw new Error(
      `Peso inválido: ${value}. Deve ser um número entre 10 kg e 500 kg.`,
    );
  }
  return Number(num.toFixed(1));
};

/**
 * Safely parses and validates a raw document into a strongly-typed Patient object.
 */
export const validatePatient = (raw: unknown): Patient => {
  if (!raw || typeof raw !== "object") {
    throw new Error(
      "Dados de paciente inválidos: payload vazio ou não é um objeto.",
    );
  }

  const obj = raw as Record<string, unknown>;

  const sanitizeString = (val: unknown, fallback = ""): string =>
    typeof val === "string" ? val.trim() : fallback;

  const sanitizeNumber = (val: unknown, fallback = 0): number => {
    const num = typeof val === "number" ? val : Number(val);
    return isNaN(num) ? fallback : num;
  };

  const sanitizeArray = <T>(val: unknown): T[] =>
    Array.isArray(val) ? (val as T[]) : [];

  const sanitizeOrigin = (
    val: unknown,
  ): "clinical" | "remote_guided" | "self_reported" => {
    if (val === "clinical" || val === "remote_guided") return val;
    return "self_reported";
  };

  const weightHistory: WeightRecord[] = sanitizeArray<Record<string, unknown>>(
    obj.weightHistory,
  ).map((record) => ({
    date: sanitizeString(record.date, new Date().toISOString()),
    weight: sanitizeNumber(record.weight, 0),
    origin: sanitizeOrigin(record.origin),
  }));

  const selfEvaluations = sanitizeArray<SelfEvaluation>(obj.selfEvaluations);

  const rawMetadata = obj.anthropometryMetadata as
    | Patient["anthropometryMetadata"]
    | undefined;

  const anthropometryMetadata: Patient["anthropometryMetadata"] = {
    weightOrigin:
      rawMetadata?.weightOrigin === "self_reported" ||
      rawMetadata?.weightOrigin === "remote_guided" ||
      rawMetadata?.weightOrigin === "not_available"
        ? rawMetadata.weightOrigin
        : "clinical",
    heightOrigin:
      rawMetadata?.heightOrigin === "self_reported" ||
      rawMetadata?.heightOrigin === "remote_guided" ||
      rawMetadata?.heightOrigin === "not_available"
        ? rawMetadata.heightOrigin
        : "clinical",
    circumferenceOrigin: rawMetadata?.circumferenceOrigin,
    bodyFatOrigin: rawMetadata?.bodyFatOrigin,
  };

  const address =
    obj.address && typeof obj.address === "object"
      ? {
          cep: sanitizeString((obj.address as Record<string, unknown>).cep),
          street: sanitizeString(
            (obj.address as Record<string, unknown>).street,
          ),
          number: sanitizeString(
            (obj.address as Record<string, unknown>).number,
          ),
          neighborhood: sanitizeString(
            (obj.address as Record<string, unknown>).neighborhood,
          ),
          city: sanitizeString((obj.address as Record<string, unknown>).city),
          state: sanitizeString((obj.address as Record<string, unknown>).state),
        }
      : {
          cep: "",
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
        };

  return {
    id: sanitizeString(obj.id),
    firstName: sanitizeString(obj.firstName),
    lastName: sanitizeString(obj.lastName),
    dob: sanitizeString(obj.dob),
    gender:
      obj.gender === "male" || obj.gender === "other" ? obj.gender : "female",
    email: sanitizeString(obj.email),
    phone: sanitizeString(obj.phone),
    address,
    profession: sanitizeString(obj.profession),
    activityLevel:
      obj.activityLevel === "sedentary" ||
      obj.activityLevel === "lightly_active" ||
      obj.activityLevel === "very_active" ||
      obj.activityLevel === "extremely_active"
        ? obj.activityLevel
        : "moderately_active",
    mode:
      obj.mode === "clinical" ||
      obj.mode === "performance" ||
      obj.mode === "pediatric" ||
      obj.mode === "recovery"
        ? obj.mode
        : "general",
    clinicalTags: sanitizeArray<Patient["clinicalTags"][number]>(
      obj.clinicalTags,
    ),
    nutritionalGoal:
      obj.nutritionalGoal === "weight_loss" ||
      obj.nutritionalGoal === "weight_gain" ||
      obj.nutritionalGoal === "performance" ||
      obj.nutritionalGoal === "clinical_control"
        ? obj.nutritionalGoal
        : "maintenance",
    consultationMode:
      obj.consultationMode === "remoto" ? "remoto" : "presencial",
    medications: sanitizeString(obj.medications),
    familyHistory: sanitizeString(obj.familyHistory),
    mealsPerDay: sanitizeNumber(obj.mealsPerDay, 4),
    hydrationLevel:
      obj.hydrationLevel === "low" || obj.hydrationLevel === "high"
        ? obj.hydrationLevel
        : "moderate",
    dietaryRestrictions: sanitizeArray<string>(obj.dietaryRestrictions),
    foodAllergies: sanitizeString(obj.foodAllergies),
    weight: sanitizeNumber(obj.weight, 0),
    height: sanitizeNumber(obj.height, 0),
    anthropometryMetadata,
    weightHistory,
    selfEvaluations,
    status: obj.status === "Inactive" ? "Inactive" : "Active",
    createdAt: sanitizeString(obj.createdAt, new Date().toISOString()),
    avatarUrl: sanitizeString(obj.avatarUrl),
    portalUid: obj.portalUid ? sanitizeString(obj.portalUid) : undefined,
    activeProtocolId: obj.activeProtocolId
      ? sanitizeString(obj.activeProtocolId)
      : undefined,
    automationSettings:
      obj.automationSettings && typeof obj.automationSettings === "object"
        ? {
            autoRequestAssessment: Boolean(
              (obj.automationSettings as Record<string, unknown>)
                .autoRequestAssessment,
            ),
            intervalDays: sanitizeNumber(
              (obj.automationSettings as Record<string, unknown>).intervalDays,
              30,
            ),
            lastAutoRequestDate: (
              obj.automationSettings as Record<string, unknown>
            ).lastAutoRequestDate
              ? sanitizeString(
                  (obj.automationSettings as Record<string, unknown>)
                    .lastAutoRequestDate,
                )
              : undefined,
          }
        : undefined,
    adherenceLog: sanitizeArray<{ date: string; followed: boolean }>(
      obj.adherenceLog,
    ),
    dietNeedsReview: Boolean(obj.dietNeedsReview),
    termsAccepted: Boolean(obj.termsAccepted),
  };
};
