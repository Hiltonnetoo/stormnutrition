/**
 * Deterministic synthetic workspace used by the query-cost benchmark.
 *
 * Sizes are fixed so results are comparable across runs; dates are relative to
 * the moment of seeding so "this month", "upcoming" and "last 6 months" always
 * contain data. No real person or contact data is used.
 */
import {
  doc,
  writeBatch,
  type DocumentData,
  type Firestore,
} from "firebase/firestore";
import { generateAlgorithmicDietPlan } from "../src/services/dietAlgorithmService";
import { validateAndSerializeDietPlan } from "../src/services/dietService";
import type { DietPlan } from "../src/types";

export const SCENARIO = {
  nutritionistId: "perf-nutri",
  portalUid: "perf-portal-patient",
  patients: 300,
  archivedEvery: 7, // every 7th patient is archived
  dietsPerPatient: 5, // 1 500 diets
  historyMonths: 12,
  appointments: 900, // ~12 months past + 3 months ahead
} as const;

export const portalPatientId = "perf-patient-000";

const pad = (n: number, size = 2) => String(n).padStart(size, "0");

export const localWallTime = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:00`;

const DAY = 24 * 60 * 60 * 1000;

const buildDietTemplate = () => {
  const result = generateAlgorithmicDietPlan({
    nutritionalTargets: { calories: 2000, protein: 150, carbs: 200, fat: 67 },
    mealPlanConfig: {
      dietType: "traditional",
      meals: [
        { name: "Café da Manhã", time: "07:30", caloriePercentage: 25 },
        { name: "Lanche da Manhã", time: "10:00", caloriePercentage: 10 },
        { name: "Almoço", time: "12:30", caloriePercentage: 30 },
        { name: "Lanche da Tarde", time: "16:00", caloriePercentage: 10 },
        { name: "Jantar", time: "19:30", caloriePercentage: 25 },
      ],
    },
    mode: "general",
    clinicalTags: [],
    seed: "perf-benchmark",
  });
  const plan: DietPlan = {
    version: 2,
    patientId: "template",
    patientName: "Template",
    mode: "general",
    createdAt: new Date().toISOString(),
    durationDays: 30,
    startDate: "2026-01-01",
    dailyCalories: 2000,
    macronutrients: {
      proteinGrams: 150,
      proteinPercentage: 30,
      carbsGrams: 200,
      carbsPercentage: 40,
      fatGrams: 67,
      fatPercentage: 30,
    },
    meals: result.meals,
    decisionLog: result.decisionLog,
    waterRecommendationLiters: 2.5,
    generalObservations: ["Plano sintético para medição de custo"],
    dietType: "traditional",
  };
  return validateAndSerializeDietPlan(plan);
};

const buildPatient = (i: number, now: number): DocumentData => {
  const createdAt = new Date(now - ((i * 37) % 365) * DAY).toISOString();
  return {
    firstName: `Paciente${pad(i, 3)}`,
    lastName: "Sintético",
    email: `paciente${pad(i, 3)}@example.test`,
    phone: "(00) 00000-0000",
    dob: "01/01/1990",
    gender: i % 2 ? "female" : "male",
    address: {
      cep: "00000-000",
      street: "Rua Fictícia",
      number: String(i),
      neighborhood: "Centro",
      city: "Cidade",
      state: "SP",
    },
    profession: "Profissão",
    activityLevel: "moderately_active",
    mode: "general",
    clinicalTags: [],
    nutritionalGoal: "maintenance",
    consultationMode: "presencial",
    medications: "",
    familyHistory: "",
    mealsPerDay: 5,
    hydrationLevel: "moderate",
    dietaryRestrictions: [],
    foodAllergies: "",
    weight: 70,
    height: 170,
    anthropometryMetadata: {
      weightOrigin: "clinical",
      heightOrigin: "clinical",
    },
    termsAccepted: true,
    // Offset keeps patient 0 (the linked portal patient) active: archived
    // patients cannot read the portal (firestore.rules, Passo C01).
    status:
      i % SCENARIO.archivedEvery === SCENARIO.archivedEvery - 1
        ? "Archived"
        : "Active",
    createdAt,
    avatarUrl: "",
    weightHistory: Array.from({ length: 6 }, (_, k) => ({
      id: `w_${i}_${k}`,
      date: new Date(now - (k * 30 + (i % 5)) * DAY).toISOString(),
      weight: 70 - k * 0.5,
      origin: k === 0 ? "self_reported" : "clinical",
    })),
    selfEvaluations: [
      {
        id: `eval_${i}`,
        requestDate: new Date(now - 20 * DAY).toISOString(),
        completionDate: new Date(now - ((i % 10) + 1) * DAY).toISOString(),
        status: "completed",
        measurements: { weight: 70, waist: 80 },
        wellbeing: {
          sleepQuality: 4,
          energyLevel: 4,
          satiety: 3,
          digestiveHealth: "normal",
        },
      },
    ],
    ...(i === 0
      ? { portalUid: SCENARIO.portalUid, portalStatus: "active" }
      : {}),
  };
};

export interface SeededDiet {
  id: string;
  patientId: string;
  createdAt: string;
}
export interface SeededAppointment {
  id: string;
  patientId: string;
  dateTime: string;
  status: string;
}

/**
 * Writes the whole scenario with security rules disabled and returns the
 * ground truth used to check that bounded queries return the right documents.
 */
export const seedScenario = async (db: Firestore) => {
  const now = Date.now();
  const nutri = SCENARIO.nutritionistId;
  const dietTemplate = buildDietTemplate();
  const writes: Array<[string, DocumentData]> = [];
  const diets: SeededDiet[] = [];
  const appointments: SeededAppointment[] = [];

  writes.push([
    `users/${nutri}`,
    {
      displayName: "Profissional Sintético",
      email: "perf@example.test",
      role: "nutritionist",
      createdAt: new Date(now).toISOString(),
    },
  ]);
  writes.push([
    `patientProfiles/${SCENARIO.portalUid}`,
    {
      uid: SCENARIO.portalUid,
      patientId: portalPatientId,
      nutritionistId: nutri,
      nutritionistName: "Profissional Sintético",
      nutritionistEmail: "perf@example.test",
      role: "patient",
      status: "active",
      createdAt: new Date(now).toISOString(),
    },
  ]);

  for (let i = 0; i < SCENARIO.patients; i++) {
    const patientId = `perf-patient-${pad(i, 3)}`;
    writes.push([`users/${nutri}/patients/${patientId}`, buildPatient(i, now)]);
    for (let k = 0; k < SCENARIO.dietsPerPatient; k++) {
      const ageDays =
        ((i * 13 + k * 71) % (SCENARIO.historyMonths * 30)) + (k === 0 ? 0 : 1);
      // Seconds offset keeps instants unique, as real creation times are.
      const diet = {
        id: `perf-diet-${pad(i, 3)}-${k}`,
        patientId,
        createdAt: new Date(
          now - ageDays * DAY - (i * SCENARIO.dietsPerPatient + k) * 1000,
        ).toISOString(),
      };
      diets.push(diet);
      writes.push([
        `users/${nutri}/diets/${diet.id}`,
        {
          ...dietTemplate,
          patientId,
          patientName: `Paciente${pad(i, 3)} Sintético`,
          createdAt: diet.createdAt,
        },
      ]);
    }
  }

  const addAppointment = (
    id: string,
    patientIndex: number,
    when: Date,
    status: string,
  ) => {
    const appt = {
      id,
      patientId: `perf-patient-${pad(patientIndex, 3)}`,
      dateTime: localWallTime(when),
      status,
    };
    appointments.push(appt);
    writes.push([
      `users/${nutri}/appointments/${id}`,
      {
        patientId: appt.patientId,
        patientName: `Paciente${pad(patientIndex, 3)} Sintético`,
        dateTime: appt.dateTime,
        durationMinutes: 60,
        type: "followup",
        status,
        createdAt: new Date(now).toISOString(),
      },
    ]);
  };

  for (let a = 0; a < SCENARIO.appointments; a++) {
    // Spread over [-12 months, +3 months], business hours, deterministic.
    const offsetDays = Math.floor((a * 450) / SCENARIO.appointments) - 360;
    const when = new Date(now + offsetDays * DAY);
    when.setHours(8 + (a % 9), a % 2 ? 30 : 0, 0, 0);
    addAppointment(
      `perf-appt-${pad(a, 4)}`,
      (a * 7) % SCENARIO.patients,
      when,
      offsetDays < 0 ? "completed" : "scheduled",
    );
  }
  // The portal patient: a cancelled visit before the real next one.
  const portalVisit = (days: number, hour: number) => {
    const when = new Date(now + days * DAY);
    when.setHours(hour, 0, 0, 0);
    return when;
  };
  addAppointment("perf-portal-cancelled", 0, portalVisit(5, 9), "cancelled");
  addAppointment("perf-portal-next", 0, portalVisit(10, 15), "scheduled");
  addAppointment("perf-portal-later", 0, portalVisit(40, 11), "scheduled");

  // Firestore batches accept up to 500 writes.
  for (let start = 0; start < writes.length; start += 400) {
    const batch = writeBatch(db);
    for (const [path, data] of writes.slice(start, start + 400)) {
      batch.set(doc(db, path), data);
    }
    await batch.commit();
  }
  return { seededAt: now, documents: writes.length, diets, appointments };
};
