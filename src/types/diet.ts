import type { Food } from "./food";

// --- V1 Diet Plan Types (Legacy from old AI generator) ---
export interface V1_Meal {
  name: string;
  description: string;
  calories: number;
}

export interface V1_DietPlan {
  id?: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  daily_calories: number;
  macronutrients: {
    protein_grams: number;
    carbs_grams: number;
    fat_grams: number;
  };
  meals: {
    breakfast: V1_Meal;
    lunch: V1_Meal;
    dinner: V1_Meal;
    snacks: V1_Meal[];
  };
  recommendations: string[];
}

// --- V2 Diet Plan Types (New 3-Step Generator) ---
export interface Micronutrients {
  vitaminA?: number; // mcg or IU
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  zinc?: number; // mg
  potassium?: number; // mg
  sodium?: number; // mg
  fiber?: number; // g
}

export interface MealOptionItem {
  foodId?: string;
  name: string;
  portion: string;
  portionGrams?: number;
  unit?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micros?: Micronutrients;
  clinicalWarnings?: string[];
}

export interface MealOption {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items?: MealOptionItem[];
  details?: string;
  micros?: Micronutrients;
  clinicalWarnings?: string[];
}

/**
 * Represents a meal within a V2 diet plan.
 * Each meal has a main option and up to two substitution alternatives,
 * all with portions adjusted to meet the caloric targets of that meal.
 */
export interface Meal {
  mealName: string; // "Breakfast"
  time: string; // "08:00"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micros?: Micronutrients;
  mainOption: MealOption;
  alternatives: MealOption[];
}

/**
 * Generation mode of the diet plan. Controls safety filters applied
 * by `dietAlgorithmService` during food selection.
 *
 * - `general`     — No additional filters other than diet type.
 * - `clinical`    — Restricts foods with sodium >= 600 mg per serving.
 * - `performance` — Optimized for athletes (high protein and quality carbs).
 * - `pediatric`   — Removes stimulant and alcoholic drinks.
 * - `recovery`    — Focuses on anti-inflammatory and easily digestible foods.
 */
export type DietMode =
  | "general"
  | "clinical"
  | "performance"
  | "pediatric"
  | "recovery";

/**
 * Patient clinical condition tags. Used by `dietAlgorithmService`
 * to apply specific nutritional filters per pathology:
 *
 * | Tag                  | Filter applied by generator                          |
 * |----------------------|------------------------------------------------------|
 * | `diabetes_t1/t2`     | Removes refined sugars and processed foods           |
 * | `hypertension`       | Sodium < 300 mg per serving                          |
 * | `renal_ckd`          | Ultra-low sodium < 200 mg (renal protection)         |
 * | `hepatic_steatosis`  | Removes saturated oils (except olive oil)            |
 * | Others               | Visible in records, no automatic filter yet          |
 */
export type ClinicalTag =
  | "diabetes_t1"
  | "diabetes_t2"
  | "hypertension"
  | "renal_ckd"
  | "hepatic_steatosis"
  | "ibs"
  | "obesity"
  | "dyslipidemia"
  | "anemia"
  | "hyperthyroidism"
  | "hypothyroidism";

export interface LabTest {
  name: string;
  value: string;
  unit: string;
  referenceRange?: string;
  status?: "normal" | "alert" | "critical";
  date?: string;
  category?: string;
}

export interface DecisionEntry {
  code?: string;
  type: "filter" | "substitution" | "warning";
  reason: string;
  affectedCount?: number;
  /** Names of the foods removed by this filter (displayed in the clinical log). */
  removedFoods?: string[];
  tag?: string;
  timestamp?: string;
  params?: Record<string, unknown>;
}

export type PlanValidationStatus = "valid" | "requires_review" | "infeasible";

export interface PlanValidationIssue {
  level: "error" | "warning" | "info";
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface CalculatedDietTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
}

export interface MacroTolerances {
  /** Maximum allowed percentage deviation for calories (default ±15%) */
  caloriePercent?: number;
  /** Maximum allowed percentage deviation for protein (default ±20%) */
  proteinPercent?: number;
  /** Maximum allowed percentage deviation for carbohydrates (default ±20%) */
  carbsPercent?: number;
  /** Maximum allowed percentage deviation for fats (default ±20%) */
  fatPercent?: number;
}

export interface WorstCaseAlternativeTotals {
  minCalories: number;
  maxCalories: number;
  worstCaseSodium: number;
}

export type DietPlanStatus =
  | "draft"
  | "blocked"
  | "awaiting_review"
  | "clinically_approved";

export interface ClinicalApproval {
  approvedByUid: string;
  professionalName?: string;
  professionalCrn?: string;
  approvedAt: string;
  signature: string;
  version: number;
  notes?: string;
}

export interface ValidateDietPlanOptions {
  restrictions?: string[];
  foodAllergies?: string | string[];
  clinicalTags?: ClinicalTag[];
  mode?: DietMode;
  availableFoodsCatalog?: Food[];
  catalogVersion?: string;
  tolerances?: MacroTolerances;
  allowApprovedReview?: boolean;
  approvedByUid?: string;
  /** R06: signature of the exact version the professional reviewed (the
   *  `issuesSignature` shown in the review dialog). Approval is granted only
   *  when it matches the version being saved. */
  reviewedSignature?: string;
}

export interface PlanValidationResult {
  status: PlanValidationStatus;
  isApproved: boolean;
  isStructurallyValid?: boolean;
  approvedByUid?: string;
  approvedAt?: string;
  issues: PlanValidationIssue[];
  issuesSignature?: string;
  deviations: {
    caloriesDiff: number;
    caloriesPercent: number;
    proteinDiff: number;
    proteinPercent: number;
    carbsDiff: number;
    carbsPercent: number;
    fatDiff: number;
    fatPercent: number;
  };
  worstCaseAlternativeSodium?: number;
  worstCaseAlternativeTotals?: WorstCaseAlternativeTotals;
}

/**
 * Complete diet plan generated by the system (version 2).
 *
 * Version 2 replaces the V1 format (AI/Gemini generated) and is produced by the
 * `dietAlgorithmService`. The field `version: 2` is used as a discriminant
 * to distinguish old plans from new ones when rendering history.
 *
 * The `labExams` and `decisionLog` fields are optional and can be attached
 * after generation (patient exams and algorithmic audit, respectively).
 */
export interface DietPlan {
  version: 2; // To distinguish from V1 plans
  id?: string;
  patientId: string;
  patientName: string;
  status?: DietPlanStatus;
  clinicalApproval?: ClinicalApproval;
  mode: DietMode;
  clinicalTags?: ClinicalTag[];
  createdAt: string;
  durationDays: number;
  startDate: string;
  dailyCalories: number;
  macronutrients: {
    proteinGrams: number;
    proteinPercentage: number;
    carbsGrams: number;
    carbsPercentage: number;
    fatGrams: number;
    fatPercentage: number;
  };
  calculatedTotals?: CalculatedDietTotals;
  validation?: PlanValidationResult;
  algorithmVersion?: string;
  datasetVersion?: string;
  seed?: number;
  meals: Meal[];
  waterRecommendationLiters: number;
  generalObservations: string[];
  dietType: string;
  labExams?: LabTest[];
  decisionLog?: DecisionEntry[];
  isManuallyEdited?: boolean;
  editedAt?: string;
}

// Combined type for use in listings and history
export type AnyDietPlan =
  | (V1_DietPlan & { version?: 1 | undefined })
  | DietPlan;

/**
 * Data Transfer Object (DTO) for saving a DietPlan in Firestore.
 * - Omits `id` (the document ID is the Firestore doc path key, not a payload field).
 * - Guarantees all numbers are finite.
 * - Strictly omits any `undefined` properties.
 */
export type DietPlanFirestoreDto = Omit<DietPlan, "id">;

/**
 * DTO for updating an existing DietPlan document in Firestore.
 * Must NOT contain `id`. All fields are optional partials.
 */
export type DietPlanUpdateDto = Partial<Omit<DietPlan, "id">>;
