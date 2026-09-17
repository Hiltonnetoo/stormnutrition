/**
 * Seed script for Firebase Firestore & Auth Emulators.
 * Generates deterministic demo data using administrative context:
 * - 2 Nutritionists (Dra. Clara Mendes, Dr. Marcos Lima)
 * - 2 Patients linked to Dra. Clara (Ana Silva, Bruno Costa) with diets, appointments, and evaluations.
 *
 * Usage:
 *   node scripts/seed-emulator.mjs
 */

import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, setDoc } from "firebase/firestore";

let host = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1";
let port = 8080;
if (host.includes(":")) {
  const parts = host.split(":");
  host = parts[0];
  port = Number(parts[1]);
}
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "demo-storm";

console.log(`🌱 Conectando ao emulador Firestore em ${host}:${port} (Projeto: ${PROJECT_ID})...`);

const testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: {
    host,
    port,
  },
});

const NUTRI_1_ID = "demo-nutri-1";
const NUTRI_2_ID = "demo-nutri-2";
const PATIENT_1_ID = "patient-ana-silva";
const PATIENT_2_ID = "patient-bruno-costa";
const PATIENT_1_PORTAL_UID = "demo-patient-ana";
const PATIENT_2_PORTAL_UID = "demo-patient-bruno";

try {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();

    // 1. Perfis de Nutricionistas
    console.log("1/5 Criando profissionais de demonstração...");
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

    // 2. Pacientes vinculados à Dra. Clara
    console.log("2/5 Criando pacientes vinculados...");
    await setDoc(doc(db, `users/${NUTRI_1_ID}/patients/${PATIENT_1_ID}`), {
      firstName: "Ana",
      lastName: "Silva",
      email: "ana.silva@demo.stormnutrition.com",
      phone: "(11) 99999-1111",
      birthDate: "1994-05-12",
      gender: "female",
      height: 165,
      weight: 64,
      activityLevel: 1.55,
      goal: "hypertrophy",
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
      gender: "male",
      height: 178,
      weight: 88,
      activityLevel: 1.375,
      goal: "weight_loss",
      clinicalTags: ["hypertension"],
      allergies: "Nenhuma",
      portalUid: PATIENT_2_PORTAL_UID,
      createdAt: new Date().toISOString(),
    });

    // 3. Perfis do Portal de Acesso dos Pacientes
    console.log("3/5 Criando perfis de acesso do portal...");
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

    // 4. Dietas de demonstração
    console.log("4/5 Criando planos alimentares estruturados...");
    await setDoc(doc(db, `users/${NUTRI_1_ID}/diets/diet-ana-hipertrofia`), {
      patientId: PATIENT_1_ID,
      title: "Plano Hipertrofia & Definição",
      calories: 2200,
      protein: 140,
      carbs: 260,
      fats: 65,
      meals: [
        {
          name: "Café da Manhã",
          time: "07:30",
          items: [
            { name: "Ovos Mexidos (3 unidades)", portion: "150g", protein: 18, carbs: 2, fats: 15, calories: 215 },
            { name: "Pão Integral", portion: "50g", protein: 5, carbs: 25, fats: 2, calories: 140 },
            { name: "Mamão Papaia", portion: "100g", protein: 1, carbs: 10, fats: 0, calories: 45 },
          ],
        },
        {
          name: "Almoço",
          time: "12:30",
          items: [
            { name: "Peito de Frango Grelhado", portion: "150g", protein: 45, carbs: 0, fats: 5, calories: 240 },
            { name: "Arroz Integral Cozido", portion: "150g", protein: 4, carbs: 38, fats: 2, calories: 185 },
            { name: "Feijão Preto Cozido", portion: "100g", protein: 7, carbs: 20, fats: 1, calories: 115 },
            { name: "Azeite de Oliva Extra Virgem", portion: "10g", protein: 0, carbs: 0, fats: 10, calories: 90 },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
    });

    // 5. Consultas / Agendamentos
    console.log("5/5 Criando agendamentos fictícios...");
    await setDoc(doc(db, `users/${NUTRI_1_ID}/appointments/appt-ana-retorno`), {
      patientId: PATIENT_1_ID,
      patientName: "Ana Silva",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "14:00",
      status: "scheduled",
      notes: "Retorno quinzenal para reavaliação de bioimpedância.",
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Seed concluído com sucesso! Ambiente de testes pronto.");
  });
} finally {
  await testEnv.cleanup();
}
