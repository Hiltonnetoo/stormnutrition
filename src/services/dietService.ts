import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  type FirestoreError,
  type Query,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebaseCore";
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
  PlanValidationIssue,
} from "../types";

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

export const validateAndSerializeDietPlan = (
  plan: DietPlan,
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

  if (Array.isArray(plan.labExams) && plan.labExams.length > 0) {
    dto.labExams = plan.labExams.filter((exam): exam is LabTest =>
      Boolean(
        exam && typeof exam.name === "string" && typeof exam.value === "string",
      ),
    );
  }

  if (Array.isArray(plan.decisionLog) && plan.decisionLog.length > 0) {
    dto.decisionLog = plan.decisionLog
      .filter((entry): entry is DecisionEntry =>
        Boolean(
          entry &&
          typeof entry.reason === "string" &&
          typeof entry.type === "string",
        ),
      )
      .map((entry) => {
        const cleanEntry: DecisionEntry = {
          type: entry.type,
          reason: entry.reason,
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
          cleanEntry.removedFoods = entry.removedFoods.filter(
            (f): f is string => typeof f === "string" && f.trim().length > 0,
          );
        }
        if (entry.params && typeof entry.params === "object") {
          cleanEntry.params = entry.params;
        }
        return cleanEntry;
      });
  }

  if (plan.calculatedTotals && typeof plan.calculatedTotals === "object") {
    const calc: CalculatedDietTotals = {
      calories: Math.round(plan.calculatedTotals.calories || 0),
      protein: Number((plan.calculatedTotals.protein || 0).toFixed(1)),
      carbs: Number((plan.calculatedTotals.carbs || 0).toFixed(1)),
      fat: Number((plan.calculatedTotals.fat || 0).toFixed(1)),
    };
    if (isFiniteNumber(plan.calculatedTotals.fiber)) {
      calc.fiber = Number(plan.calculatedTotals.fiber.toFixed(1));
    }
    if (isFiniteNumber(plan.calculatedTotals.sodium)) {
      calc.sodium = Math.round(plan.calculatedTotals.sodium);
    }
    dto.calculatedTotals = calc;
  }

  if (plan.validation && typeof plan.validation === "object") {
    const val: PlanValidationResult = {
      status: plan.validation.status,
      isApproved: Boolean(plan.validation.isApproved),
      issues: Array.isArray(plan.validation.issues)
        ? plan.validation.issues.map((issue) => {
            const cleanIssue: PlanValidationIssue = {
              code: issue.code,
              level: issue.level,
              message: issue.message,
            };
            if (issue.details && typeof issue.details === "object") {
              cleanIssue.details = issue.details;
            }
            return cleanIssue;
          })
        : [],
      calculatedTotals: {
        calories: Math.round(plan.validation.calculatedTotals?.calories || 0),
        protein: Number(
          (plan.validation.calculatedTotals?.protein || 0).toFixed(1),
        ),
        carbs: Number(
          (plan.validation.calculatedTotals?.carbs || 0).toFixed(1),
        ),
        fat: Number((plan.validation.calculatedTotals?.fat || 0).toFixed(1)),
      },
      deviations: {
        caloriesDiff: plan.validation.deviations?.caloriesDiff ?? 0,
        caloriesPercent: plan.validation.deviations?.caloriesPercent ?? 0,
        proteinDiff: plan.validation.deviations?.proteinDiff ?? 0,
        proteinPercent: plan.validation.deviations?.proteinPercent ?? 0,
        carbsDiff: plan.validation.deviations?.carbsDiff ?? 0,
        carbsPercent: plan.validation.deviations?.carbsPercent ?? 0,
        fatDiff: plan.validation.deviations?.fatDiff ?? 0,
        fatPercent: plan.validation.deviations?.fatPercent ?? 0,
      },
    };
    if (isFiniteNumber(plan.validation.calculatedTotals?.fiber)) {
      val.calculatedTotals.fiber = Number(
        plan.validation.calculatedTotals.fiber.toFixed(1),
      );
    }
    if (isFiniteNumber(plan.validation.calculatedTotals?.sodium)) {
      val.calculatedTotals.sodium = Math.round(
        plan.validation.calculatedTotals.sodium,
      );
    }
    if (isFiniteNumber(plan.validation.worstCaseAlternativeSodium)) {
      val.worstCaseAlternativeSodium = Math.round(
        plan.validation.worstCaseAlternativeSodium,
      );
    }
    dto.validation = val;
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

  return dto;
};

export const validateAndSerializeDietUpdate = (
  partial: Partial<DietPlan>,
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

  if (partial.meals !== undefined) {
    if (!Array.isArray(partial.meals) || partial.meals.length === 0) {
      throw new Error(
        "meals deve conter pelo menos uma refeição na atualização.",
      );
    }
    dto.meals = partial.meals.map((m, idx) => sanitizeMeal(m, idx));
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

  if (partial.labExams !== undefined && Array.isArray(partial.labExams)) {
    dto.labExams = partial.labExams.filter((e): e is LabTest =>
      Boolean(e && typeof e.name === "string"),
    );
  }

  if (partial.decisionLog !== undefined && Array.isArray(partial.decisionLog)) {
    dto.decisionLog = partial.decisionLog.filter((e): e is DecisionEntry =>
      Boolean(e && typeof e.reason === "string"),
    );
  }

  return dto;
};

const getDietsCollection = (userId: string) =>
  collection(db, "users", userId, "diets");
const getDietDoc = (userId: string, dietId: string) =>
  doc(db, "users", userId, "diets", dietId);

export const saveDietPlan = async (userId: string, dietPlan: DietPlan) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("ID do usuário nutricionista é obrigatório.");
  }
  const dto = validateAndSerializeDietPlan(dietPlan);
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
) => {
  if (!userId || !dietId) {
    throw new Error(
      "ID de usuário e ID da dieta são obrigatórios para atualização.",
    );
  }
  const updateDto = validateAndSerializeDietUpdate(dietPlan);
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

export const getDietPlansForPatient = (
  userId: string,
  patientId: string,
  callback: (diets: AnyDietPlan[]) => void,
  onError?: (error: FirestoreError) => void,
) => {
  if (!userId) return () => {};
  const q = query(
    getDietsCollection(userId),
    where("patientId", "==", patientId),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const diets = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt;
        return { ...data, id: doc.id, createdAt } as AnyDietPlan;
      });
      diets.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      callback(diets);
    },
    (error) => {
      handleSnapshotError(error, "getDietPlansForPatient");
      if (onError) onError(error);
    },
  );
};

export const getAllDiets = (
  userId: string,
  callback: (diets: AnyDietPlan[]) => void,
  onError?: (error: FirestoreError) => void,
) => {
  if (!userId) return () => {};
  const q = query(getDietsCollection(userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const diets = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt;
        return { ...data, id: doc.id, createdAt } as AnyDietPlan;
      });
      diets.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      callback(diets);
    },
    (error) => {
      handleSnapshotError(error, "getAllDiets");
      if (onError) onError(error);
    },
  );
};

const getCountClientSide = (
  q: Query<DocumentData>,
  filterFn: (docData: DocumentData) => boolean,
  callback: (count: number) => void,
  contextName: string,
) => {
  return onSnapshot(
    q,
    (snapshot) => {
      let count = 0;
      snapshot.docs.forEach((doc) => {
        if (filterFn(doc.data())) {
          count++;
        }
      });
      callback(count);
    },
    (error) => {
      handleSnapshotError(error, contextName);
    },
  );
};

export const getDietsCount = (
  userId: string,
  callback: (count: number) => void,
) => {
  if (!userId) return () => {};
  return getCountClientSide(
    query(getDietsCollection(userId)),
    () => true,
    callback,
    "getDietsCount",
  );
};

export const getDietsThisMonthCount = (
  userId: string,
  callback: (count: number) => void,
) => {
  if (!userId) return () => {};
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const isoStart = startOfMonth.toISOString();

  return getCountClientSide(
    query(getDietsCollection(userId)),
    (data) => {
      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt;
      return createdAt >= isoStart;
    },
    callback,
    "getDietsThisMonthCount",
  );
};

export const getPatientDiets = (
  nutritionistId: string,
  patientId: string,
  callback: (diets: AnyDietPlan[]) => void,
  onError?: (e: FirestoreError) => void,
) => {
  const q = query(
    collection(db, "users", nutritionistId, "diets"),
    where("patientId", "==", patientId),
  );
  return onSnapshot(
    q,
    (snap) => {
      const diets = snap.docs
        .map((d) => {
          const data = d.data();
          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt;
          return { ...data, id: d.id, createdAt } as AnyDietPlan;
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      callback(diets);
    },
    (err) => {
      handleSnapshotError(err, "getPatientDiets");
      if (onError) onError(err);
    },
  );
};
