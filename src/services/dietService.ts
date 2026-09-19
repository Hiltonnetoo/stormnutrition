import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getCountFromServer,
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
import type { MonthInstantRange } from "../utils/dateTime";
import type {
  DietPlan,
  AnyDietPlan,
  DietPlanFirestoreDto,
  DietPlanUpdateDto,
  Meal,
  MealOption,
  MealOptionItem,
  Micronutrients,
  LabTest,
  DecisionEntry,
  DietMode,
  CalculatedDietTotals,
  PlanValidationResult,
  DietPlanStatus,
  ClinicalApproval,
  PlanValidationIssue,
  PlanValidationStatus,
  ValidateDietPlanOptions,
} from "../types";
import { validateDietPlan } from "./dietAlgorithmService";

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

const isFiniteNumber = (val: unknown): val is number =>
  typeof val === "number" && Number.isFinite(val);

export const sanitizeMicronutrients = (
  micros?: Micronutrients,
): Micronutrients | undefined => {
  if (!micros || typeof micros !== "object") return undefined;
  const result: Micronutrients = {};
  const keys: (keyof Micronutrients)[] = [
    "vitaminA",
    "vitaminC",
    "vitaminD",
    "calcium",
    "iron",
    "magnesium",
    "zinc",
    "potassium",
    "sodium",
    "fiber",
  ];

  let hasAny = false;
  for (const k of keys) {
    const val = micros[k];
    if (isFiniteNumber(val)) {
      result[k] = val;
      hasAny = true;
    }
  }
  return hasAny ? result : undefined;
};

export const sanitizeMealOptionItem = (
  item: unknown,
  path = "item",
): MealOptionItem => {
  if (!item || typeof item !== "object") {
    throw new Error(`Item inválido em ${path}: deve ser um objeto.`);
  }
  const raw = item as Record<string, unknown>;

  if (typeof raw.name !== "string" || !raw.name.trim()) {
    throw new Error(`Nome do item obrigatório em ${path}.`);
  }
  if (!isFiniteNumber(raw.calories) || raw.calories < 0) {
    throw new Error(`Calorias inválidas no item "${raw.name}" em ${path}.`);
  }
  if (!isFiniteNumber(raw.protein) || raw.protein < 0) {
    throw new Error(`Proteínas inválidas no item "${raw.name}" em ${path}.`);
  }
  if (!isFiniteNumber(raw.carbs) || raw.carbs < 0) {
    throw new Error(`Carboidratos inválidos no item "${raw.name}" em ${path}.`);
  }
  if (!isFiniteNumber(raw.fat) || raw.fat < 0) {
    throw new Error(`Gorduras inválidas no item "${raw.name}" em ${path}.`);
  }

  const cleanItem: MealOptionItem = {
    name: raw.name.trim(),
    portion: typeof raw.portion === "string" ? raw.portion : "",
    calories: raw.calories,
    protein: raw.protein,
    carbs: raw.carbs,
    fat: raw.fat,
  };

  if (typeof raw.foodId === "string" && raw.foodId.trim()) {
    cleanItem.foodId = raw.foodId.trim();
  }
  if (isFiniteNumber(raw.portionGrams) && raw.portionGrams > 0) {
    cleanItem.portionGrams = raw.portionGrams;
  }
  if (typeof raw.unit === "string" && raw.unit.trim()) {
    cleanItem.unit = raw.unit.trim();
  }

  const cleanMicros = sanitizeMicronutrients(raw.micros as Micronutrients);
  if (cleanMicros) {
    cleanItem.micros = cleanMicros;
  }

  if (Array.isArray(raw.clinicalWarnings)) {
    const validWarnings = raw.clinicalWarnings.filter(
      (w): w is string => typeof w === "string" && w.trim().length > 0,
    );
    if (validWarnings.length > 0) {
      cleanItem.clinicalWarnings = validWarnings;
    }
  }

  return cleanItem;
};

export const sanitizeMealOption = (
  option: unknown,
  path = "option",
): MealOption => {
  if (!option || typeof option !== "object") {
    throw new Error(`Opção inválida em ${path}: deve ser um objeto.`);
  }
  const raw = option as Record<string, unknown>;

  if (typeof raw.name !== "string" || !raw.name.trim()) {
    throw new Error(`Nome da opção obrigatório em ${path}.`);
  }
  if (!isFiniteNumber(raw.calories) || raw.calories < 0) {
    throw new Error(`Calorias inválidas na opção "${raw.name}" em ${path}.`);
  }
  if (!isFiniteNumber(raw.protein) || raw.protein < 0) {
    throw new Error(`Proteínas inválidas na opção "${raw.name}" em ${path}.`);
  }
  if (!isFiniteNumber(raw.carbs) || raw.carbs < 0) {
    throw new Error(
      `Carboidratos inválidos na opção "${raw.name}" em ${path}.`,
    );
  }
  if (!isFiniteNumber(raw.fat) || raw.fat < 0) {
    throw new Error(`Gorduras inválidas na opção "${raw.name}" em ${path}.`);
  }

  const cleanOption: MealOption = {
    name: raw.name.trim(),
    portion: typeof raw.portion === "string" ? raw.portion : "",
    calories: raw.calories,
    protein: raw.protein,
    carbs: raw.carbs,
    fat: raw.fat,
  };

  if (typeof raw.details === "string" && raw.details.trim()) {
    cleanOption.details = raw.details.trim();
  }

  if (Array.isArray(raw.items)) {
    cleanOption.items = raw.items.map((it, idx) =>
      sanitizeMealOptionItem(it, `${path}.items[${idx}]`),
    );
  }

  const cleanMicros = sanitizeMicronutrients(raw.micros as Micronutrients);
  if (cleanMicros) {
    cleanOption.micros = cleanMicros;
  }

  if (Array.isArray(raw.clinicalWarnings)) {
    const validWarnings = raw.clinicalWarnings.filter(
      (w): w is string => typeof w === "string" && w.trim().length > 0,
    );
    if (validWarnings.length > 0) {
      cleanOption.clinicalWarnings = validWarnings;
    }
  }

  return cleanOption;
};

export const sanitizeMeal = (meal: unknown, index: number): Meal => {
  if (!meal || typeof meal !== "object") {
    throw new Error(`Refeição ${index} inválida: deve ser um objeto.`);
  }
  const raw = meal as Record<string, unknown>;

  if (typeof raw.mealName !== "string" || !raw.mealName.trim()) {
    throw new Error(`Nome da refeição ${index} é obrigatório.`);
  }
  if (!isFiniteNumber(raw.calories) || raw.calories < 0) {
    throw new Error(`Calorias inválidas na refeição ${raw.mealName}.`);
  }
  if (!isFiniteNumber(raw.protein) || raw.protein < 0) {
    throw new Error(`Proteínas inválidas na refeição ${raw.mealName}.`);
  }
  if (!isFiniteNumber(raw.carbs) || raw.carbs < 0) {
    throw new Error(`Carboidratos inválidos na refeição ${raw.mealName}.`);
  }
  if (!isFiniteNumber(raw.fat) || raw.fat < 0) {
    throw new Error(`Gorduras inválidas na refeição ${raw.mealName}.`);
  }

  const cleanMeal: Meal = {
    mealName: raw.mealName.trim(),
    time: typeof raw.time === "string" ? raw.time : "08:00",
    calories: raw.calories,
    protein: raw.protein,
    carbs: raw.carbs,
    fat: raw.fat,
    mainOption: sanitizeMealOption(
      raw.mainOption,
      `meals[${index}].mainOption`,
    ),
    alternatives: Array.isArray(raw.alternatives)
      ? raw.alternatives.map((alt, aIdx) =>
          sanitizeMealOption(alt, `meals[${index}].alternatives[${aIdx}]`),
        )
      : [],
  };

  const cleanMicros = sanitizeMicronutrients(raw.micros as Micronutrients);
  if (cleanMicros) {
    cleanMeal.micros = cleanMicros;
  }

  return cleanMeal;
};

export const recalculateDietTotals = (meals: Meal[]): CalculatedDietTotals => {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
  };

  for (const meal of meals) {
    totals.calories += isFiniteNumber(meal.mainOption?.calories)
      ? meal.mainOption.calories
      : isFiniteNumber(meal.calories)
        ? meal.calories
        : 0;
    totals.protein += isFiniteNumber(meal.mainOption?.protein)
      ? meal.mainOption.protein
      : isFiniteNumber(meal.protein)
        ? meal.protein
        : 0;
    totals.carbs += isFiniteNumber(meal.mainOption?.carbs)
      ? meal.mainOption.carbs
      : isFiniteNumber(meal.carbs)
        ? meal.carbs
        : 0;
    totals.fat += isFiniteNumber(meal.mainOption?.fat)
      ? meal.mainOption.fat
      : isFiniteNumber(meal.fat)
        ? meal.fat
        : 0;
    const fiber = meal.mainOption?.micros?.fiber ?? meal.micros?.fiber ?? 0;
    if (isFiniteNumber(fiber)) totals.fiber += fiber;
    const sodium = meal.mainOption?.micros?.sodium ?? meal.micros?.sodium ?? 0;
    if (isFiniteNumber(sodium)) totals.sodium += sodium;
  }

  const result: CalculatedDietTotals = {
    calories: Math.round(totals.calories),
    protein: Number(totals.protein.toFixed(1)),
    carbs: Number(totals.carbs.toFixed(1)),
    fat: Number(totals.fat.toFixed(1)),
  };

  if (isFiniteNumber(totals.fiber) && totals.fiber > 0) {
    result.fiber = Number(totals.fiber.toFixed(1));
  }
  if (isFiniteNumber(totals.sodium) && totals.sodium > 0) {
    result.sodium = Math.round(totals.sodium);
  }

  return result;
};

export const sanitizeCalculatedTotals = (
  raw: unknown,
): CalculatedDietTotals | undefined => {
  if (!raw || typeof raw !== "object") return undefined;
  const t = raw as Record<string, unknown>;
  const calories = isFiniteNumber(t.calories) ? Math.round(t.calories) : 0;
  const protein = isFiniteNumber(t.protein) ? Number(t.protein.toFixed(1)) : 0;
  const carbs = isFiniteNumber(t.carbs) ? Number(t.carbs.toFixed(1)) : 0;
  const fat = isFiniteNumber(t.fat) ? Number(t.fat.toFixed(1)) : 0;

  const result: CalculatedDietTotals = {
    calories,
    protein,
    carbs,
    fat,
  };
  if (isFiniteNumber(t.fiber)) {
    result.fiber = Number(t.fiber.toFixed(1));
  }
  if (isFiniteNumber(t.sodium)) {
    result.sodium = Math.round(t.sodium);
  }
  return result;
};

export const sanitizeValidation = (
  raw: unknown,
): PlanValidationResult | undefined => {
  if (!raw || typeof raw !== "object") return undefined;
  const v = raw as Record<string, unknown>;
  const validStatuses: PlanValidationStatus[] = [
    "valid",
    "requires_review",
    "infeasible",
  ];
  const status: PlanValidationStatus = validStatuses.includes(
    v.status as PlanValidationStatus,
  )
    ? (v.status as PlanValidationStatus)
    : "requires_review";

  const isApproved = Boolean(v.isApproved);

  const dev = (
    v.deviations && typeof v.deviations === "object" ? v.deviations : {}
  ) as Record<string, unknown>;

  const deviations = {
    caloriesDiff: isFiniteNumber(dev.caloriesDiff)
      ? Number(dev.caloriesDiff.toFixed(1))
      : 0,
    caloriesPercent: isFiniteNumber(dev.caloriesPercent)
      ? Number(dev.caloriesPercent.toFixed(1))
      : 0,
    proteinDiff: isFiniteNumber(dev.proteinDiff)
      ? Number(dev.proteinDiff.toFixed(1))
      : 0,
    proteinPercent: isFiniteNumber(dev.proteinPercent)
      ? Number(dev.proteinPercent.toFixed(1))
      : 0,
    carbsDiff: isFiniteNumber(dev.carbsDiff)
      ? Number(dev.carbsDiff.toFixed(1))
      : 0,
    carbsPercent: isFiniteNumber(dev.carbsPercent)
      ? Number(dev.carbsPercent.toFixed(1))
      : 0,
    fatDiff: isFiniteNumber(dev.fatDiff) ? Number(dev.fatDiff.toFixed(1)) : 0,
    fatPercent: isFiniteNumber(dev.fatPercent)
      ? Number(dev.fatPercent.toFixed(1))
      : 0,
  };

  const issues: PlanValidationIssue[] = Array.isArray(v.issues)
    ? v.issues
        .filter((issue): issue is Record<string, unknown> =>
          Boolean(
            issue &&
            typeof issue === "object" &&
            typeof issue.code === "string" &&
            typeof issue.message === "string",
          ),
        )
        .map((issue) => {
          const cleanIssue: PlanValidationIssue = {
            code: String(issue.code).trim(),
            level:
              issue.level === "error" || issue.level === "info"
                ? issue.level
                : "warning",
            message: String(issue.message).trim(),
          };
          if (issue.details && typeof issue.details === "object") {
            cleanIssue.details = issue.details as Record<string, unknown>;
          }
          return cleanIssue;
        })
    : [];

  const result: PlanValidationResult = {
    status,
    isApproved,
    issues,
    deviations,
  };

  if (typeof v.issuesSignature === "string" && v.issuesSignature.trim()) {
    result.issuesSignature = v.issuesSignature.trim();
  }

  if (typeof v.approvedByUid === "string" && v.approvedByUid.trim()) {
    result.approvedByUid = v.approvedByUid.trim();
  }

  if (typeof v.approvedAt === "string" && v.approvedAt.trim()) {
    result.approvedAt = v.approvedAt.trim();
  }

  if (isFiniteNumber(v.worstCaseAlternativeSodium)) {
    result.worstCaseAlternativeSodium = Math.round(
      v.worstCaseAlternativeSodium,
    );
  }

  if (
    v.worstCaseAlternativeTotals &&
    typeof v.worstCaseAlternativeTotals === "object"
  ) {
    const wcat = v.worstCaseAlternativeTotals as Record<string, unknown>;
    result.worstCaseAlternativeTotals = {
      minCalories: isFiniteNumber(wcat.minCalories)
        ? Number(wcat.minCalories)
        : 0,
      maxCalories: isFiniteNumber(wcat.maxCalories)
        ? Number(wcat.maxCalories)
        : 0,
      worstCaseSodium: isFiniteNumber(wcat.worstCaseSodium)
        ? Number(wcat.worstCaseSodium)
        : 0,
    };
  }

  return result;
};

export const sanitizeLabExams = (raw: unknown): LabTest[] | undefined => {
  if (!Array.isArray(raw)) return undefined;
  const cleaned = raw
    .filter((exam): exam is Record<string, unknown> =>
      Boolean(
        exam &&
        typeof exam === "object" &&
        typeof exam.name === "string" &&
        exam.name.trim() &&
        typeof exam.value === "string" &&
        typeof exam.unit === "string",
      ),
    )
    .map((exam) => {
      const clean: LabTest = {
        name: String(exam.name).trim(),
        value: String(exam.value).trim(),
        unit: String(exam.unit).trim(),
      };
      if (
        typeof exam.referenceRange === "string" &&
        exam.referenceRange.trim()
      ) {
        clean.referenceRange = exam.referenceRange.trim();
      }
      if (
        exam.status === "normal" ||
        exam.status === "alert" ||
        exam.status === "critical"
      ) {
        clean.status = exam.status;
      }
      if (typeof exam.date === "string" && exam.date.trim()) {
        clean.date = exam.date.trim();
      }
      if (typeof exam.category === "string" && exam.category.trim()) {
        clean.category = exam.category.trim();
      }
      return clean;
    });
  return cleaned.length > 0 ? cleaned : undefined;
};

export const sanitizeDecisionLog = (
  raw: unknown,
): DecisionEntry[] | undefined => {
  if (!Array.isArray(raw)) return undefined;
  const cleaned = raw
    .filter((entry): entry is Record<string, unknown> =>
      Boolean(
        entry &&
        typeof entry === "object" &&
        typeof entry.reason === "string" &&
        entry.reason.trim() &&
        (entry.type === "filter" ||
          entry.type === "substitution" ||
          entry.type === "warning"),
      ),
    )
    .map((entry) => {
      const cleanEntry: DecisionEntry = {
        type: entry.type as "filter" | "substitution" | "warning",
        reason: String(entry.reason).trim(),
      };
      if (typeof entry.code === "string" && entry.code.trim()) {
        cleanEntry.code = entry.code.trim();
      }
      if (typeof entry.tag === "string" && entry.tag.trim()) {
        cleanEntry.tag = entry.tag.trim();
      }
      if (typeof entry.timestamp === "string" && entry.timestamp.trim()) {
        cleanEntry.timestamp = entry.timestamp.trim();
      }
      if (isFiniteNumber(entry.affectedCount)) {
        cleanEntry.affectedCount = entry.affectedCount;
      }
      if (Array.isArray(entry.removedFoods)) {
        const foods = entry.removedFoods.filter(
          (f): f is string => typeof f === "string" && f.trim().length > 0,
        );
        if (foods.length > 0) {
          cleanEntry.removedFoods = foods;
        }
      }
      if (entry.params && typeof entry.params === "object") {
        cleanEntry.params = entry.params as Record<string, unknown>;
      }
      return cleanEntry;
    });
  return cleaned.length > 0 ? cleaned : undefined;
};

/**
 * R06: the professional asked to approve a plan that needs review, but the
 * version being saved is not the one they reviewed (content, targets,
 * restrictions, catalog or alerts changed). Nothing is saved; the UI must
 * present the current alerts for a new explicit decision.
 */
export class DietReviewOutdatedError extends Error {
  readonly code = "REVIEW_OUTDATED";
  constructor() {
    super("REVIEW_OUTDATED");
    this.name = "DietReviewOutdatedError";
  }
}

const assertReviewMatches = (
  result: PlanValidationResult,
  options?: ValidateDietPlanOptions,
): void => {
  if (
    options?.allowApprovedReview &&
    result.status === "requires_review" &&
    !result.isApproved
  ) {
    throw new DietReviewOutdatedError();
  }
};

/** A6: approving requires the professional's registration (CRN). */
export class ApprovalCredentialsError extends Error {
  readonly code = "APPROVAL_CREDENTIALS_REQUIRED";
  constructor() {
    super("APPROVAL_CREDENTIALS_REQUIRED");
    this.name = "ApprovalCredentialsError";
  }
}

/**
 * A6: status and clinical approval are derived only from the revalidation of
 * the version being saved — never taken from the client payload, so a plan
 * cannot arrive "approved" and an old approval never survives an edit.
 */
const deriveApprovalState = (
  revalidated: PlanValidationResult,
  options?: ValidateDietPlanOptions,
): { status: DietPlanStatus; clinicalApproval: ClinicalApproval | null } => {
  const status: DietPlanStatus =
    revalidated.status === "infeasible"
      ? "blocked"
      : revalidated.isApproved
        ? "clinically_approved"
        : revalidated.status === "requires_review"
          ? "awaiting_review"
          : "draft";
  if (!revalidated.isApproved) return { status, clinicalApproval: null };
  const crn = options?.approverCrn?.trim();
  if (!crn) throw new ApprovalCredentialsError();
  const approval: ClinicalApproval = {
    approvedByUid: options?.approvedByUid ?? revalidated.approvedByUid ?? "",
    professionalCrn: crn,
    approvedAt: revalidated.approvedAt ?? new Date().toISOString(),
    signature: revalidated.issuesSignature ?? "",
    version: 2,
  };
  const name = options?.approverName?.trim();
  if (name) approval.professionalName = name;
  return { status, clinicalApproval: approval };
};

export const validateAndSerializeDietPlan = (
  plan: DietPlan,
  validationOptions?: ValidateDietPlanOptions,
): DietPlanFirestoreDto => {
  if (!plan || typeof plan !== "object") {
    throw new Error("Plano alimentar inválido: deve ser um objeto.");
  }

  if (typeof plan.patientId !== "string" || !plan.patientId.trim()) {
    throw new Error(
      "ID do paciente é obrigatório para salvar o plano alimentar.",
    );
  }
  if (typeof plan.patientName !== "string" || !plan.patientName.trim()) {
    throw new Error(
      "Nome do paciente é obrigatório para salvar o plano alimentar.",
    );
  }
  if (!isFiniteNumber(plan.dailyCalories) || plan.dailyCalories <= 0) {
    throw new Error("Calorias diárias devem ser um número positivo finito.");
  }
  if (!isFiniteNumber(plan.durationDays) || plan.durationDays <= 0) {
    throw new Error(
      "Duração do plano em dias deve ser um número positivo finito.",
    );
  }
  if (!plan.macronutrients || typeof plan.macronutrients !== "object") {
    throw new Error("Macronutrientes são obrigatórios.");
  }

  const macros = plan.macronutrients;
  if (
    !isFiniteNumber(macros.proteinGrams) ||
    !isFiniteNumber(macros.proteinPercentage) ||
    !isFiniteNumber(macros.carbsGrams) ||
    !isFiniteNumber(macros.carbsPercentage) ||
    !isFiniteNumber(macros.fatGrams) ||
    !isFiniteNumber(macros.fatPercentage)
  ) {
    throw new Error("Todos os macronutrientes devem conter números finitos.");
  }

  if (!Array.isArray(plan.meals) || plan.meals.length === 0) {
    throw new Error("O plano alimentar deve conter pelo menos uma refeição.");
  }

  const cleanMeals = plan.meals.map((m, idx) => sanitizeMeal(m, idx));

  const validModes: DietMode[] = [
    "general",
    "clinical",
    "performance",
    "pediatric",
    "recovery",
  ];
  const mode: DietMode = validModes.includes(plan.mode) ? plan.mode : "general";

  const dto: DietPlanFirestoreDto = {
    version: 2,
    patientId: plan.patientId.trim(),
    patientName: plan.patientName.trim(),
    mode,
    createdAt:
      typeof plan.createdAt === "string" && plan.createdAt.trim()
        ? plan.createdAt
        : new Date().toISOString(),
    startDate:
      typeof plan.startDate === "string" && plan.startDate.trim()
        ? plan.startDate
        : new Date().toISOString().split("T")[0],
    durationDays: Math.round(plan.durationDays),
    dailyCalories: Math.round(plan.dailyCalories),
    macronutrients: {
      proteinGrams: Number(macros.proteinGrams.toFixed(1)),
      proteinPercentage: Math.round(macros.proteinPercentage),
      carbsGrams: Number(macros.carbsGrams.toFixed(1)),
      carbsPercentage: Math.round(macros.carbsPercentage),
      fatGrams: Number(macros.fatGrams.toFixed(1)),
      fatPercentage: Math.round(macros.fatPercentage),
    },
    meals: cleanMeals,
    waterRecommendationLiters: isFiniteNumber(plan.waterRecommendationLiters)
      ? Number(plan.waterRecommendationLiters.toFixed(2))
      : 2.0,
    generalObservations: Array.isArray(plan.generalObservations)
      ? plan.generalObservations.filter(
          (obs): obs is string =>
            typeof obs === "string" && obs.trim().length > 0,
        )
      : [],
    dietType: typeof plan.dietType === "string" ? plan.dietType : "traditional",
  };

  if (Array.isArray(plan.clinicalTags) && plan.clinicalTags.length > 0) {
    dto.clinicalTags = plan.clinicalTags;
  }

  const cleanExams = sanitizeLabExams(plan.labExams);
  if (cleanExams) {
    dto.labExams = cleanExams;
  }

  const cleanLog = sanitizeDecisionLog(plan.decisionLog);
  if (cleanLog) {
    dto.decisionLog = cleanLog;
  }

  const cleanTotals = sanitizeCalculatedTotals(plan.calculatedTotals);
  if (cleanTotals) {
    dto.calculatedTotals = cleanTotals;
  }

  // Re-validate unconditionally during creation
  const targets = {
    calories: dto.dailyCalories,
    protein: dto.macronutrients.proteinGrams,
    carbs: dto.macronutrients.carbsGrams,
    fat: dto.macronutrients.fatGrams,
  };
  // Context defaults come from the plan itself; explicit options win (R06).
  const revalidated = validateDietPlan(dto.meals, targets, {
    ...validationOptions,
    clinicalTags: validationOptions?.clinicalTags ?? dto.clinicalTags,
    mode: validationOptions?.mode ?? dto.mode,
    catalogVersion: validationOptions?.catalogVersion ?? dto.datasetVersion,
  });
  assertReviewMatches(revalidated, validationOptions);
  const { calculatedTotals: _revalTotals, ...revalidatedClean } = revalidated;
  dto.validation = revalidatedClean;

  // A6: derived from the revalidation, never from the payload.
  const approvalState = deriveApprovalState(revalidated, validationOptions);
  dto.status = approvalState.status;
  if (approvalState.clinicalApproval) {
    dto.clinicalApproval = approvalState.clinicalApproval;
  }

  if (
    typeof plan.algorithmVersion === "string" &&
    plan.algorithmVersion.trim()
  ) {
    dto.algorithmVersion = plan.algorithmVersion.trim();
  }

  if (typeof plan.datasetVersion === "string" && plan.datasetVersion.trim()) {
    dto.datasetVersion = plan.datasetVersion.trim();
  }

  if (isFiniteNumber(plan.seed)) {
    dto.seed = plan.seed;
  }

  if (plan.isManuallyEdited !== undefined) {
    dto.isManuallyEdited = Boolean(plan.isManuallyEdited);
  }

  if (typeof plan.editedAt === "string" && plan.editedAt.trim()) {
    dto.editedAt = plan.editedAt.trim();
  }

  return dto;
};

export const validateAndSerializeDietUpdate = (
  partial: Partial<DietPlan>,
  existingPlan?: DietPlan,
  validationOptions?: ValidateDietPlanOptions,
): DietPlanUpdateDto => {
  if (!partial || typeof partial !== "object") {
    throw new Error(
      "Atualização de plano alimentar inválida: deve ser um objeto.",
    );
  }

  const dto: DietPlanUpdateDto = {};

  // Never allow 'id' in Firestore update payload
  if (partial.patientId !== undefined) {
    if (typeof partial.patientId !== "string" || !partial.patientId.trim()) {
      throw new Error("patientId inválido.");
    }
    dto.patientId = partial.patientId.trim();
  }

  if (partial.patientName !== undefined) {
    if (
      typeof partial.patientName !== "string" ||
      !partial.patientName.trim()
    ) {
      throw new Error("patientName inválido.");
    }
    dto.patientName = partial.patientName.trim();
  }

  if (partial.dailyCalories !== undefined) {
    if (!isFiniteNumber(partial.dailyCalories) || partial.dailyCalories <= 0) {
      throw new Error("dailyCalories inválido.");
    }
    dto.dailyCalories = Math.round(partial.dailyCalories);
  }

  if (partial.durationDays !== undefined) {
    if (!isFiniteNumber(partial.durationDays) || partial.durationDays <= 0) {
      throw new Error("durationDays inválido.");
    }
    dto.durationDays = Math.round(partial.durationDays);
  }

  if (
    partial.startDate !== undefined &&
    typeof partial.startDate === "string"
  ) {
    dto.startDate = partial.startDate;
  }

  if (partial.macronutrients !== undefined) {
    const macros = partial.macronutrients;
    if (
      !isFiniteNumber(macros.proteinGrams) ||
      !isFiniteNumber(macros.proteinPercentage) ||
      !isFiniteNumber(macros.carbsGrams) ||
      !isFiniteNumber(macros.carbsPercentage) ||
      !isFiniteNumber(macros.fatGrams) ||
      !isFiniteNumber(macros.fatPercentage)
    ) {
      throw new Error("Macronutrientes inválidos na atualização.");
    }
    dto.macronutrients = {
      proteinGrams: Number(macros.proteinGrams.toFixed(1)),
      proteinPercentage: Math.round(macros.proteinPercentage),
      carbsGrams: Number(macros.carbsGrams.toFixed(1)),
      carbsPercentage: Math.round(macros.carbsPercentage),
      fatGrams: Number(macros.fatGrams.toFixed(1)),
      fatPercentage: Math.round(macros.fatPercentage),
    };
  }

  if (partial.waterRecommendationLiters !== undefined) {
    if (
      !isFiniteNumber(partial.waterRecommendationLiters) ||
      partial.waterRecommendationLiters < 0
    ) {
      throw new Error("waterRecommendationLiters inválido.");
    }
    dto.waterRecommendationLiters = Number(
      partial.waterRecommendationLiters.toFixed(2),
    );
  }

  if (
    partial.generalObservations !== undefined &&
    Array.isArray(partial.generalObservations)
  ) {
    dto.generalObservations = partial.generalObservations.filter(
      (o): o is string => typeof o === "string" && o.trim().length > 0,
    );
  }

  if (partial.dietType !== undefined && typeof partial.dietType === "string") {
    dto.dietType = partial.dietType;
  }

  if (partial.mode !== undefined) {
    const validModes: DietMode[] = [
      "general",
      "clinical",
      "performance",
      "pediatric",
      "recovery",
    ];
    if (validModes.includes(partial.mode)) {
      dto.mode = partial.mode;
    }
  }

  if (
    partial.clinicalTags !== undefined &&
    Array.isArray(partial.clinicalTags)
  ) {
    dto.clinicalTags = partial.clinicalTags;
  }

  if (partial.labExams !== undefined) {
    const exams = sanitizeLabExams(partial.labExams);
    if (exams) dto.labExams = exams;
  }

  if (partial.decisionLog !== undefined) {
    const log = sanitizeDecisionLog(partial.decisionLog);
    if (log) dto.decisionLog = log;
  }

  if (partial.meals !== undefined) {
    if (!Array.isArray(partial.meals) || partial.meals.length === 0) {
      throw new Error(
        "meals deve conter pelo menos uma refeição na atualização.",
      );
    }
    dto.meals = partial.meals.map((m, idx) => sanitizeMeal(m, idx));

    // Passo C05: Recalculate derived totals whenever meals change
    const recalculatedTotals = recalculateDietTotals(dto.meals);
    dto.calculatedTotals = recalculatedTotals;

    // Passo C05: Mark manual edit unless explicitly specified otherwise
    if (partial.isManuallyEdited !== undefined) {
      dto.isManuallyEdited = Boolean(partial.isManuallyEdited);
    } else {
      dto.isManuallyEdited = true;
    }
  }

  // Determine target goals to recompute validation deviations
  let targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null = null;

  if (dto.dailyCalories !== undefined && dto.macronutrients !== undefined) {
    targets = {
      calories: dto.dailyCalories,
      protein: dto.macronutrients.proteinGrams,
      carbs: dto.macronutrients.carbsGrams,
      fat: dto.macronutrients.fatGrams,
    };
  } else if (
    existingPlan &&
    existingPlan.dailyCalories &&
    existingPlan.macronutrients
  ) {
    targets = {
      calories: existingPlan.dailyCalories,
      protein: existingPlan.macronutrients.proteinGrams,
      carbs: existingPlan.macronutrients.carbsGrams,
      fat: existingPlan.macronutrients.fatGrams,
    };
  } else if (
    (partial.calculatedTotals || existingPlan?.calculatedTotals) &&
    (partial.validation?.deviations || existingPlan?.validation?.deviations)
  ) {
    const prevCalc = partial.calculatedTotals || existingPlan?.calculatedTotals;
    const prevDev =
      partial.validation?.deviations || existingPlan?.validation?.deviations;
    if (prevCalc && prevDev) {
      targets = {
        calories: Math.max(
          1,
          Math.round(prevCalc.calories - prevDev.caloriesDiff),
        ),
        protein: Math.max(
          0,
          Number((prevCalc.protein - prevDev.proteinDiff).toFixed(1)),
        ),
        carbs: Math.max(
          0,
          Number((prevCalc.carbs - prevDev.carbsDiff).toFixed(1)),
        ),
        fat: Math.max(0, Number((prevCalc.fat - prevDev.fatDiff).toFixed(1))),
      };
    }
  }

  let didRevalidate = false;
  if (targets) {
    const options: ValidateDietPlanOptions = {
      clinicalTags:
        dto.clinicalTags || partial.clinicalTags || existingPlan?.clinicalTags,
      mode: dto.mode || partial.mode || existingPlan?.mode,
      restrictions:
        validationOptions?.restrictions ||
        (partial as unknown as { restrictions?: string[] })?.restrictions ||
        (existingPlan as unknown as { restrictions?: string[] })?.restrictions,
      availableFoodsCatalog: validationOptions?.availableFoodsCatalog,
      catalogVersion:
        validationOptions?.catalogVersion ||
        dto.datasetVersion ||
        partial.datasetVersion ||
        existingPlan?.datasetVersion,
      tolerances: validationOptions?.tolerances,
      allowApprovedReview: validationOptions?.allowApprovedReview ?? false,
      approvedByUid: validationOptions?.approvedByUid,
      reviewedSignature: validationOptions?.reviewedSignature,
    };

    // Always validate with latest meals, whether from dto or existingPlan
    const mealsToValidate = dto.meals || existingPlan?.meals || [];
    if (mealsToValidate.length > 0) {
      const revalidated = validateDietPlan(mealsToValidate, targets, options);
      assertReviewMatches(revalidated, options);
      const { calculatedTotals: _revalTotals, ...revalidatedClean } =
        revalidated;
      dto.validation = revalidatedClean;
      // A6: an edit re-derives status and approval; null removes a stale one.
      const approvalState = deriveApprovalState(revalidated, {
        ...options,
        approverName: validationOptions?.approverName,
        approverCrn: validationOptions?.approverCrn,
      });
      dto.status = approvalState.status;
      (dto as { clinicalApproval?: ClinicalApproval | null }).clinicalApproval =
        approvalState.clinicalApproval;
      didRevalidate = true;
    }
  }

  if (!didRevalidate) {
    if (partial.calculatedTotals !== undefined) {
      const cleanTotals = sanitizeCalculatedTotals(partial.calculatedTotals);
      if (cleanTotals) dto.calculatedTotals = cleanTotals;
    }
    if (partial.validation !== undefined) {
      const cleanVal = sanitizeValidation(partial.validation);
      if (cleanVal) dto.validation = cleanVal;
    }
  }

  if (
    partial.isManuallyEdited !== undefined &&
    dto.isManuallyEdited === undefined
  ) {
    dto.isManuallyEdited = Boolean(partial.isManuallyEdited);
  }

  if (typeof partial.editedAt === "string" && partial.editedAt.trim()) {
    dto.editedAt = partial.editedAt.trim();
  } else if (dto.isManuallyEdited) {
    dto.editedAt = new Date().toISOString();
  }

  if (
    typeof partial.algorithmVersion === "string" &&
    partial.algorithmVersion.trim()
  ) {
    dto.algorithmVersion = partial.algorithmVersion.trim();
  }

  if (
    typeof partial.datasetVersion === "string" &&
    partial.datasetVersion.trim()
  ) {
    dto.datasetVersion = partial.datasetVersion.trim();
  }

  if (isFiniteNumber(partial.seed)) {
    dto.seed = partial.seed;
  }

  if (partial.status) {
    dto.status = partial.status;
  }

  if (partial.clinicalApproval) {
    dto.clinicalApproval = {
      approvedByUid: partial.clinicalApproval.approvedByUid,
      professionalName: partial.clinicalApproval.professionalName,
      professionalCrn: partial.clinicalApproval.professionalCrn,
      approvedAt: partial.clinicalApproval.approvedAt,
      signature: partial.clinicalApproval.signature,
      version: partial.clinicalApproval.version || 2,
      ...(partial.clinicalApproval.notes
        ? { notes: partial.clinicalApproval.notes }
        : {}),
    };
    dto.status = "clinically_approved";
  }

  return dto;
};

const getDietsCollection = (userId: string) =>
  collection(db, "users", userId, "diets");
const getDietDoc = (userId: string, dietId: string) =>
  doc(db, "users", userId, "diets", dietId);

export const saveDietPlan = async (
  userId: string,
  dietPlan: DietPlan,
  validationOptions?: ValidateDietPlanOptions,
) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("ID do usuário nutricionista é obrigatório.");
  }
  if (
    !dietPlan.patientId ||
    typeof dietPlan.patientId !== "string" ||
    !dietPlan.patientId.trim()
  ) {
    throw new Error("ID do paciente é obrigatório para prescrever dieta.");
  }
  const patientSnap = await getDoc(
    doc(db, "users", userId, "patients", dietPlan.patientId.trim()),
  );
  if (!patientSnap.exists()) {
    throw new Error("PACIENTE_NAO_ENCONTRADO: Paciente inexistente.");
  }
  const patientData = patientSnap.data();
  if (patientData?.deletionPending) {
    throw new Error(
      "PATIENT_DELETION_PENDING: Não é possível prescrever dieta para um paciente em processo de exclusão.",
    );
  }
  if (patientData?.status === "Archived") {
    throw new Error(
      "PATIENT_ARCHIVED: Não é possível prescrever dieta para um paciente arquivado.",
    );
  }

  const dto = validateAndSerializeDietPlan(dietPlan, validationOptions);
  try {
    return await addDoc(getDietsCollection(userId), dto);
  } catch (error) {
    const code = (error as FirestoreError)?.code || "unknown";
    console.error(
      "[dietService] Falha ao persistir plano alimentar no Firestore:",
      {
        code,
        message: error instanceof Error ? error.message : String(error),
      },
    );
    throw error;
  }
};

export const updateDietPlan = async (
  userId: string,
  dietId: string,
  dietPlan: Partial<DietPlan>,
  options?: ValidateDietPlanOptions,
) => {
  if (!userId || !dietId) {
    throw new Error(
      "ID de usuário e ID da dieta são obrigatórios para atualização.",
    );
  }

  let fullPartial = { ...dietPlan };
  let existing: DietPlan | undefined;
  const existingSnap = await getDoc(getDietDoc(userId, dietId));
  if (existingSnap.exists()) {
    existing = existingSnap.data() as DietPlan;
  }

  const targetPatientId = dietPlan.patientId || existing?.patientId;
  if (targetPatientId) {
    const patientSnap = await getDoc(
      doc(db, "users", userId, "patients", targetPatientId.trim()),
    );
    if (!patientSnap.exists()) {
      throw new Error("PACIENTE_NAO_ENCONTRADO: Paciente inexistente.");
    }
    const patientData = patientSnap.data();
    if (patientData?.deletionPending) {
      throw new Error(
        "PATIENT_DELETION_PENDING: Não é possível atualizar dieta para um paciente em processo de exclusão.",
      );
    }
    if (patientData?.status === "Archived") {
      throw new Error(
        "PATIENT_ARCHIVED: Não é possível atualizar dieta para um paciente arquivado.",
      );
    }
  }

  const needsMerge = Boolean(
    dietPlan.meals ||
    dietPlan.dailyCalories ||
    dietPlan.macronutrients ||
    dietPlan.clinicalTags ||
    dietPlan.mode ||
    dietPlan.algorithmVersion,
  );
  if (needsMerge && existing) {
    fullPartial = {
      meals: existing.meals,
      dailyCalories: existing.dailyCalories,
      macronutrients: existing.macronutrients,
      clinicalTags: existing.clinicalTags,
      mode: existing.mode,
      algorithmVersion: existing.algorithmVersion,
      datasetVersion: existing.datasetVersion,
      seed: existing.seed,
      ...dietPlan,
    };
  }

  const updateDto = validateAndSerializeDietUpdate(
    fullPartial,
    existing,
    options,
  );
  try {
    return await updateDoc(getDietDoc(userId, dietId), updateDto);
  } catch (error) {
    const code = (error as FirestoreError)?.code || "unknown";
    console.error(
      "[dietService] Falha ao atualizar plano alimentar no Firestore:",
      {
        code,
        dietId,
        message: error instanceof Error ? error.message : String(error),
      },
    );
    throw error;
  }
};

export const deleteDietPlan = (userId: string, dietId: string) => {
  return deleteDoc(getDietDoc(userId, dietId));
};

const toDietPlan = (snap: QueryDocumentSnapshot<DocumentData>): AnyDietPlan => {
  const data = snap.data();
  const createdAt = data.createdAt?.toDate
    ? data.createdAt.toDate().toISOString()
    : data.createdAt;
  return { ...data, id: snap.id, createdAt } as AnyDietPlan;
};

const byNewestFirst = (a: AnyDietPlan, b: AnyDietPlan) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

/**
 * Real-time diet history of ONE patient (profile, history modal, e-mail, portal).
 * Bounded by that patient's history; the `patientId` filter is also what the
 * security rules require for portal (patient) reads.
 */
export const getPatientDiets = (
  nutritionistId: string,
  patientId: string,
  callback: (diets: AnyDietPlan[]) => void,
  onError?: (e: FirestoreError) => void,
) => {
  if (!nutritionistId || !patientId) return () => {};
  const q = query(
    getDietsCollection(nutritionistId),
    where("patientId", "==", patientId),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map(toDietPlan).sort(byNewestFirst)),
    (err) => {
      handleSnapshotError(err, "getPatientDiets");
      if (onError) onError(err);
    },
  );
};

/**
 * Most recent diet of one patient (`limit(1)`), used by the patients list to
 * show plan status only for the rows on screen.
 * Requires the composite index diets(patientId ASC, createdAt DESC).
 */
export const subscribeLatestDiet = (
  userId: string,
  patientId: string,
  callback: (diet: AnyDietPlan | null) => void,
  onError?: (e: FirestoreError) => void,
) => {
  if (!userId || !patientId) return () => {};
  const q = query(
    getDietsCollection(userId),
    where("patientId", "==", patientId),
    orderBy("createdAt", "desc"),
    limit(1),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.empty ? null : toDietPlan(snap.docs[0])),
    (err) => {
      handleSnapshotError(err, "subscribeLatestDiet");
      if (onError) onError(err);
    },
  );
};

/** The `max` most recently created diets (dashboard activity feed). */
export const subscribeRecentDiets = (
  userId: string,
  max: number,
  callback: (diets: AnyDietPlan[]) => void,
  onError?: (e: FirestoreError) => void,
) => {
  if (!userId) return () => {};
  const q = query(
    getDietsCollection(userId),
    orderBy("createdAt", "desc"),
    limit(max),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map(toDietPlan)),
    (err) => {
      handleSnapshotError(err, "subscribeRecentDiets");
      if (onError) onError(err);
    },
  );
};

export interface DietCountSummary {
  total: number;
  /** One count per requested month range, in the same order. */
  perMonth: number[];
}

/**
 * Diet counters via aggregation queries: 1 + ranges.length requests, each
 * billed as one read per 1 000 index entries. One-shot (no real-time update):
 * screens fetch it when they open.
 *
 * `createdAt` is stored as a UTC ISO string, so range filters compare
 * lexicographically. Legacy documents with a Firestore Timestamp `createdAt`
 * are counted in `total` but not in the per-month ranges.
 */
export const getDietCountSummary = async (
  userId: string,
  ranges: MonthInstantRange[],
): Promise<DietCountSummary> => {
  if (!userId) return { total: 0, perMonth: ranges.map(() => 0) };
  const dietsCol = getDietsCollection(userId);
  const [totalSnap, ...monthSnaps] = await Promise.all([
    getCountFromServer(query(dietsCol)),
    ...ranges.map((r) =>
      getCountFromServer(
        query(
          dietsCol,
          where("createdAt", ">=", r.startIso),
          where("createdAt", "<", r.endIso),
        ),
      ),
    ),
  ]);
  return {
    total: totalSnap.data().count,
    perMonth: monthSnaps.map((m) => m.data().count),
  };
};
