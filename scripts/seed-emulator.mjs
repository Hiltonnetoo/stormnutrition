/**
 * Seed script for Firebase Firestore & Auth Emulators.
 * Generates deterministic demo data using administrative context:
 * - 2 Nutritionists (Dra. Clara Mendes, Dr. Marcos Lima)
 * - 2 Patients linked to Dra. Clara (Ana Silva, Bruno Costa) with diets, appointments, and evaluations.
 *
 * Usage:
 *   node scripts/seed-emulator.mjs
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, setDoc, Timestamp } from "firebase/firestore";

let host = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1";
let port = 8080;
if (host.includes(":")) {
  const parts = host.split(":");
  host = parts[0];
  port = Number(parts[1]);
}
let authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
if (!authHost.includes(":")) {
  authHost = `${authHost}:9099`;
}
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "demo-storm";

console.log(
  `🌱 Conectando ao emulador Firestore em ${host}:${port} e Auth em ${authHost} (Projeto: ${PROJECT_ID})...`,
);

const fbApp = initializeApp(
  { projectId: PROJECT_ID, apiKey: "fake-api-key" },
  "seed-auth-app",
);
const auth = getAuth(fbApp);
connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });

async function createOrGetAuthUser(email, password, displayName) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    console.log(`[Auth Seed] Created user ${email} (${cred.user.uid})`);
    return cred.user.uid;
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log(`[Auth Seed] Found existing user ${email} (${cred.user.uid})`);
      return cred.user.uid;
    }
    console.error(`[Auth Seed] Error creating ${email}:`, err);
    throw err;
  }
}

// Ensure Carlos auth account does not exist prior to invitation test
try {
  const res = await fetch(`http://${authHost}/emulator/v1/projects/${PROJECT_ID}/accounts`);
  if (res.ok) {
    const data = await res.json();
    const existingCarlos = data.users?.find((u) => u.email === "carlos.souza@demo.stormnutrition.com");
    if (existingCarlos) {
      await fetch(`http://${authHost}/emulator/v1/projects/${PROJECT_ID}/accounts/${existingCarlos.localId}`, {
        method: "DELETE",
      });
      console.log(`[Auth Seed] Cleaned up existing Carlos Auth account (${existingCarlos.localId}) for fresh invitation test`);
    }
  }
} catch {
  // If endpoint is unreachable, attempt password sign-in deletion
  try {
    const cred = await signInWithEmailAndPassword(auth, "carlos.souza@demo.stormnutrition.com", "Password123!");
    await cred.user.delete();
  } catch {
    // Ignore if not found
  }
}

// 1. Seed Auth users first to get their exact UIDs
console.log("1/7 Criando contas no Auth Emulator...");
const NUTRI_1_ID = await createOrGetAuthUser(
  "dra.clara@demo.stormnutrition.com",
  "Password123!",
  "Dra. Clara Mendes",
);
const NUTRI_2_ID = await createOrGetAuthUser(
  "dr.marcos@demo.stormnutrition.com",
  "Password123!",
  "Dr. Marcos Lima",
);
const PATIENT_1_PORTAL_UID = await createOrGetAuthUser(
  "ana.silva@demo.stormnutrition.com",
  "Password123!",
  "Ana Silva",
);
const PATIENT_2_PORTAL_UID = await createOrGetAuthUser(
  "bruno.costa@demo.stormnutrition.com",
  "Password123!",
  "Bruno Costa",
);

const testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: {
    host,
    port,
  },
});

const PATIENT_1_ID = "patient-ana-silva";
const PATIENT_2_ID = "patient-bruno-costa";
const PATIENT_3_ID = "patient-carlos-souza";

try {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();

    // 2. Perfis de Nutricionistas
    console.log("2/7 Criando perfis profissionais no Firestore...");
    await setDoc(doc(db, "users", NUTRI_1_ID), {
      displayName: "Dra. Clara Mendes",
      email: "dra.clara@demo.stormnutrition.com",
      role: "nutritionist",
      clinicName: "Clínica Vida & Saúde",
      clinicPhone: "(11) 98765-4321",
      specialty: "Nutrição Clínica e Esportiva",
      createdAt: new Date().toISOString(),
    });

    await setDoc(doc(db, "users", NUTRI_2_ID), {
      displayName: "Dr. Marcos Lima",
      email: "dr.marcos@demo.stormnutrition.com",
      role: "nutritionist",
      clinicName: "Consultório Dr. Marcos",
      clinicPhone: "(21) 91234-5678",
      specialty: "Nutrição Funcional",
      createdAt: new Date().toISOString(),
    });

    // 3. Pacientes vinculados à Dra. Clara
    console.log("3/7 Criando pacientes vinculados...");
    await setDoc(doc(db, `users/${NUTRI_1_ID}/patients/${PATIENT_1_ID}`), {
      firstName: "Ana",
      lastName: "Silva",
      email: "ana.silva@demo.stormnutrition.com",
      phone: "(11) 99999-1111",
      birthDate: "1994-05-12",
      dob: "12/05/1994",
      gender: "female",
      height: 165,
      weight: 64,
      activityLevel: "moderately_active",
      nutritionalGoal: "hypertrophy",
      status: "Active",
      clinicalTags: ["lactose_intolerance"],
      allergies: "Lactose",
      portalUid: PATIENT_1_PORTAL_UID,
      createdAt: new Date().toISOString(),
    });

    await setDoc(doc(db, `users/${NUTRI_1_ID}/patients/${PATIENT_2_ID}`), {
      firstName: "Bruno",
      lastName: "Costa",
      email: "bruno.costa@demo.stormnutrition.com",
      phone: "(11) 99999-2222",
      birthDate: "1981-11-20",
      dob: "20/11/1981",
      gender: "male",
      height: 178,
      weight: 88,
      activityLevel: "lightly_active",
      nutritionalGoal: "weight_loss",
      status: "Active",
      clinicalTags: ["hypertension"],
      allergies: "Nenhuma",
      portalUid: PATIENT_2_PORTAL_UID,
      createdAt: new Date().toISOString(),
    });

    await setDoc(doc(db, `users/${NUTRI_1_ID}/patients/${PATIENT_3_ID}`), {
      firstName: "Carlos",
      lastName: "Souza",
      email: "carlos.souza@demo.stormnutrition.com",
      phone: "(11) 99999-3333",
      birthDate: "1990-03-15",
      dob: "15/03/1990",
      gender: "male",
      height: 175,
      weight: 75,
      activityLevel: "moderately_active",
      nutritionalGoal: "maintenance",
      status: "Active",
      clinicalTags: [],
      allergies: "Nenhuma",
      pendingInvitationId: "inv-token-demo-carlos",
      createdAt: new Date().toISOString(),
    });

    // 4. Perfis do Portal de Acesso dos Pacientes
    console.log("4/7 Criando perfis de acesso do portal...");
    await setDoc(doc(db, `patientProfiles/${PATIENT_1_PORTAL_UID}`), {
      uid: PATIENT_1_PORTAL_UID,
      patientId: PATIENT_1_ID,
      nutritionistId: NUTRI_1_ID,
      nutritionistName: "Dra. Clara Mendes",
      email: "ana.silva@demo.stormnutrition.com",
      role: "patient",
      createdAt: new Date().toISOString(),
    });

    await setDoc(doc(db, `patientProfiles/${PATIENT_2_PORTAL_UID}`), {
      uid: PATIENT_2_PORTAL_UID,
      patientId: PATIENT_2_ID,
      nutritionistId: NUTRI_1_ID,
      nutritionistName: "Dra. Clara Mendes",
      email: "bruno.costa@demo.stormnutrition.com",
      role: "patient",
      createdAt: new Date().toISOString(),
    });

    // 5. Dietas de demonstração
    console.log("5/7 Criando planos alimentares estruturados...");
    await setDoc(doc(db, `users/${NUTRI_1_ID}/diets/diet-ana-hipertrofia`), {
      version: 2,
      patientId: PATIENT_1_ID,
      patientName: "Ana Silva",
      title: "Plano Hipertrofia & Definição",
      mode: "general",
      dailyCalories: 2200,
      durationDays: 30,
      startDate: new Date().toISOString().split("T")[0],
      macronutrients: {
        proteinGrams: 140,
        proteinPercentage: 25,
        carbsGrams: 260,
        carbsPercentage: 50,
        fatGrams: 65,
        fatPercentage: 25,
      },
      waterRecommendationLiters: 2.5,
      generalObservations: ["Hidratação constante ao longo do dia."],
      dietType: "traditional",
      meals: [
        {
          mealName: "Café da Manhã",
          time: "07:30",
          calories: 400,
          protein: 25,
          carbs: 37,
          fat: 17,
          mainOption: {
            name: "Ovos Mexidos com Pão Integral e Fruta",
            portion: "1 porção",
            calories: 400,
            protein: 25,
            carbs: 37,
            fat: 17,
            items: [
              {
                name: "Ovos Mexidos (3 unidades)",
                portion: "150g",
                portionGrams: 150,
                unit: "g",
                protein: 18,
                carbs: 2,
                fat: 15,
                calories: 215,
              },
              {
                name: "Pão Integral",
                portion: "50g",
                portionGrams: 50,
                unit: "g",
                protein: 5,
                carbs: 25,
                fat: 2,
                calories: 140,
              },
              {
                name: "Mamão Papaia",
                portion: "100g",
                portionGrams: 100,
                unit: "g",
                protein: 1,
                carbs: 10,
                fat: 0,
                calories: 45,
              },
            ],
          },
          alternatives: [],
        },
      ],
      createdAt: new Date().toISOString(),
    });

    // 6. Consultas / Agendamentos
    console.log("6/7 Criando agendamentos fictícios...");
    const nextVisit = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    await setDoc(doc(db, `users/${NUTRI_1_ID}/appointments/appt-ana-retorno`), {
      patientId: PATIENT_1_ID,
      patientName: "Ana Silva",
      dateTime: `${nextVisit.getFullYear()}-${pad(nextVisit.getMonth() + 1)}-${pad(nextVisit.getDate())}T14:00:00`,
      durationMinutes: 60,
      status: "scheduled",
      type: "followup",
      notes: "Retorno quinzenal para reavaliação de bioimpedância.",
      createdAt: new Date().toISOString(),
    });

    // 7. Convites determinísticos para testes E2E
    console.log("7/7 Criando convites determinísticos...");
    const now = new Date();
    const expiresAtDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const revokedCreatedAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const revokedExpiresAt = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    await setDoc(doc(db, "invitations", "inv-token-demo-carlos"), {
      nutritionistId: NUTRI_1_ID,
      nutritionistName: "Dra. Clara Mendes",
      nutritionistEmail: "dra.clara@demo.stormnutrition.com",
      patientId: PATIENT_3_ID,
      patientEmail: "carlos.souza@demo.stormnutrition.com",
      patientName: "Carlos Souza",
      status: "pending",
      createdAt: now.toISOString(),
      expiresAt: expiresAtDate.toISOString(),
      expiresAtTimestamp: Timestamp.fromDate(expiresAtDate),
    });

    await setDoc(doc(db, "invitations", "inv-token-revoked"), {
      nutritionistId: NUTRI_1_ID,
      nutritionistName: "Dra. Clara Mendes",
      nutritionistEmail: "dra.clara@demo.stormnutrition.com",
      patientId: PATIENT_3_ID,
      patientEmail: "carlos.souza@demo.stormnutrition.com",
      patientName: "Carlos Souza",
      status: "revoked",
      createdAt: revokedCreatedAt.toISOString(),
      expiresAt: revokedExpiresAt.toISOString(),
      expiresAtTimestamp: Timestamp.fromDate(revokedExpiresAt),
      revokedAt: now.toISOString(),
    });

    console.log("✅ Seed concluído com sucesso! Ambiente de testes pronto.");
  });
} finally {
  await testEnv.cleanup();
}
