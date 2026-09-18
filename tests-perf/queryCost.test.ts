/**
 * Query-cost benchmark (Etapa 14) — `npm run test:perf:queries`.
 *
 * Seeds a deterministic synthetic workspace in the Firestore emulator and
 * measures, per screen, what the client reads: the pre-Etapa-14 query plan
 * (replicated below, full-collection listeners) versus the current services.
 * Security rules are enforced (authenticated contexts), every bounded query is
 * checked against the seeded ground truth, read budgets that must not depend
 * on the workspace size are asserted, and every composite query must be
 * covered by firestore.indexes.json (the emulator does not enforce indexes).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, beforeAll, afterAll, expect, vi } from "vitest";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";

// Services read `db` from firebaseCore; point it at an authenticated emulator
// context so security rules are enforced during the measurement.
const holder = vi.hoisted(() => ({ db: null as unknown }));
vi.mock("../src/services/firebaseCore", () => ({
  get db() {
    return holder.db;
  },
}));
vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  const { createMeteredFirestore } = await import("./firestoreMeter");
  return createMeteredFirestore(actual);
});

import {
  collection,
  onSnapshot,
  query,
  where,
  type Firestore,
} from "firebase/firestore";
import {
  isIndexDeclared,
  measure,
  type IndexField,
  type ScreenMeasurement,
} from "./firestoreMeter";
import {
  SCENARIO,
  portalPatientId,
  seedScenario,
  type SeededAppointment,
  type SeededDiet,
} from "./syntheticScenario";
import {
  countPatients,
  getAppointmentsInRange,
  getDietCountSummary,
  getNextPatientAppointment,
  getPatientById,
  getPatientDiets,
  getPatients,
  getUpcomingAppointments,
  subscribeLatestDiet,
  subscribeRecentDiets,
} from "../src/services/firebaseService";
import { RECENT_ACTIVITY_LIMIT } from "../src/components/dashboard/dashboardUtils";
import {
  formatWallClock,
  getCivilMonthRange,
  getRecentMonthRanges,
} from "../src/utils/dateTime";
import type { AnyDietPlan, Appointment, Patient } from "../src/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const NUTRI = SCENARIO.nutritionistId;
// Mirror the UI constants in src/pages/Patients.tsx and src/pages/Calendar.tsx.
const PATIENTS_PAGE_SIZE = 20;
const UPCOMING_LIMIT = 5;

const declaredIndexes = (
  JSON.parse(
    readFileSync(resolve(__dirname, "../firestore.indexes.json"), "utf8"),
  ) as { indexes: Array<{ collectionGroup: string; fields: IndexField[] }> }
).indexes;

let testEnv: RulesTestEnvironment;
let truth: { diets: SeededDiet[]; appointments: SeededAppointment[] };
const legacy: Record<string, ScreenMeasurement> = {};
const current: Record<string, ScreenMeasurement> = {};

const nutriDb = () =>
  testEnv.authenticatedContext(NUTRI).firestore() as unknown as Firestore;
const portalDb = () =>
  testEnv
    .authenticatedContext(SCENARIO.portalUid)
    .firestore() as unknown as Firestore;

/** Full-collection listener, exactly as the pre-Etapa-14 services did. */
const listenAll = (db: Firestore, sub: string) =>
  onSnapshot(query(collection(db, "users", NUTRI, sub)), () => {});

/** Resolves with the first value delivered to a subscription callback. */
const firstValue = <T>(
  subscribe: (cb: (value: T) => void) => () => void,
): Promise<{ value: T; unsubscribe: () => void }> =>
  new Promise((resolveValue) => {
    let unsubscribe: () => void = () => {};
    let done = false;
    unsubscribe = subscribe((value) => {
      if (done) return;
      done = true;
      resolveValue({ value, unsubscribe });
    });
  });

const newestFirst = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-storm",
    firestore: {
      rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    truth = await seedScenario(ctx.firestore() as unknown as Firestore);
  });
}, 180_000);

const table = (title: string, results: Record<string, ScreenMeasurement>) => [
  `### ${title}`,
  "",
  "| Tela | Listeners | Alvos distintos | Documentos lidos | Agregações | Payload aprox. | Leituras estimadas |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ...Object.entries(results).map(
    ([screen, m]) =>
      `| ${screen} | ${m.listeners} | ${m.distinctTargets} | ${m.docsRead} | ${m.aggregations} | ${(m.payloadBytes / 1024).toFixed(0)} KB | ${m.estimatedBilledReads} |`,
  ),
  "",
];

const sessionTotal = (
  results: Record<string, ScreenMeasurement>,
  screens: string[],
) =>
  screens.reduce(
    (acc, s) => ({
      docs: acc.docs + results[s].docsRead,
      bytes: acc.bytes + results[s].payloadBytes,
      billed: acc.billed + results[s].estimatedBilledReads,
    }),
    { docs: 0, bytes: 0, billed: 0 },
  );

afterAll(async () => {
  // Typical professional session: login lands on the dashboard, then the
  // patient list, calendar, reports and settings.
  const legacySession = sessionTotal(legacy, [
    "Busca global (shell)",
    "Dashboard",
    "Pacientes",
    "Agenda",
    "Relatórios",
    "Configurações (plano)",
  ]);
  const currentSession = sessionTotal(current, [
    "Diretório de pacientes (1× por sessão)",
    "Dashboard",
    "Pacientes (1ª página)",
    "Agenda (mês visível + próximas)",
    "Relatórios",
    "Configurações (plano)",
  ]);
  const fmt = (t: { docs: number; bytes: number; billed: number }) =>
    `${t.docs} documentos · ${(t.bytes / 1024).toFixed(0)} KB · ~${t.billed} leituras`;
  process.stdout.write(
    [
      "",
      `Cenário: ${SCENARIO.patients} pacientes · ${SCENARIO.patients * SCENARIO.dietsPerPatient} dietas · ${truth.appointments.length} consultas`,
      "",
      ...table("Antes (réplica do plano anterior à etapa 14)", legacy),
      ...table("Depois (serviços atuais)", current),
      "### Sessão típica (dashboard → pacientes → agenda → relatórios → configurações)",
      "",
      `- Antes: ${fmt(legacySession)}`,
      `- Depois: ${fmt(currentSession)}`,
      "",
    ].join("\n"),
  );
  if (process.env.QUERY_COST_JSON) {
    writeFileSync(
      process.env.QUERY_COST_JSON,
      JSON.stringify(
        {
          scenario: SCENARIO,
          legacy,
          current,
          session: { legacy: legacySession, current: currentSession },
        },
        null,
        2,
      ),
    );
  }
  await testEnv?.cleanup();
});

describe("Antes: réplica do plano de consultas anterior à etapa 14", () => {
  it("busca global do shell: coleção completa de pacientes", async () => {
    const db = nutriDb();
    legacy["Busca global (shell)"] = await measure(() => [
      listenAll(db, "patients"),
    ]);
  });

  it("dashboard: 7 listeners sobre as coleções completas", async () => {
    const db = nutriDb();
    legacy["Dashboard"] = await measure(() => [
      // 3 contagens + lista de pacientes
      ...[0, 1, 2, 3].map(() => listenAll(db, "patients")),
      // 2 contagens + lista de dietas
      ...[0, 1, 2].map(() => listenAll(db, "diets")),
    ]);
  });

  it("pacientes: todos os pacientes e todas as dietas", async () => {
    const db = nutriDb();
    legacy["Pacientes"] = await measure(() => [
      listenAll(db, "patients"),
      listenAll(db, "diets"),
    ]);
  });

  it("agenda: todas as consultas e todos os pacientes", async () => {
    const db = nutriDb();
    legacy["Agenda"] = await measure(() => [
      listenAll(db, "appointments"),
      listenAll(db, "patients"),
    ]);
  });

  it("relatórios: contagens no cliente sobre as coleções completas", async () => {
    const db = nutriDb();
    legacy["Relatórios"] = await measure(() => [
      ...[0, 1, 2, 3].map(() => listenAll(db, "patients")),
      ...[0, 1].map(() => listenAll(db, "diets")),
    ]);
  });

  it("configurações: contagem de pacientes no cliente", async () => {
    const db = nutriDb();
    legacy["Configurações (plano)"] = await measure(() => [
      listenAll(db, "patients"),
    ]);
  });

  it("portal: todas as consultas do paciente", async () => {
    const db = portalDb();
    holder.db = db;
    legacy["Portal do paciente"] = await measure(async () => {
      await getPatientById(NUTRI, portalPatientId);
      return [
        getPatientDiets(NUTRI, portalPatientId, () => {}),
        onSnapshot(
          query(
            collection(db, "users", NUTRI, "appointments"),
            where("patientId", "==", portalPatientId),
          ),
          () => {},
        ),
      ];
    });
    expect(legacy["Portal do paciente"].errors).toEqual([]);
  });
});

describe("Depois: plano de consultas atual", () => {
  let roster: Patient[] = [];

  it("diretório de pacientes: uma assinatura compartilhada por sessão", async () => {
    holder.db = nutriDb();
    let unsubscribe = () => {};
    current["Diretório de pacientes (1× por sessão)"] = await measure(
      async () => {
        const first = await firstValue<Patient[]>((cb) =>
          getPatients(NUTRI, cb),
        );
        roster = first.value;
        unsubscribe = first.unsubscribe;
        return [unsubscribe];
      },
    );
    expect(roster).toHaveLength(SCENARIO.patients);
  });

  it("dashboard: agregações + só as dietas mais recentes", async () => {
    holder.db = nutriDb();
    const months = getRecentMonthRanges(6);
    let recent: AnyDietPlan[] = [];
    let summary = { total: 0, perMonth: [] as number[] };
    const m = await measure(async () => {
      summary = await getDietCountSummary(NUTRI, months);
      const first = await firstValue<AnyDietPlan[]>((cb) =>
        subscribeRecentDiets(NUTRI, RECENT_ACTIVITY_LIMIT, cb),
      );
      recent = first.value;
      return [first.unsubscribe];
    });
    current["Dashboard"] = m;

    // Correctness against the seeded ground truth
    expect(summary.total).toBe(truth.diets.length);
    const expectedPerMonth = months.map(
      (r) =>
        truth.diets.filter(
          (d) => d.createdAt >= r.startIso && d.createdAt < r.endIso,
        ).length,
    );
    expect(summary.perMonth).toEqual(expectedPerMonth);
    expect(recent.map((d) => d.id)).toEqual(
      [...truth.diets]
        .sort(newestFirst)
        .slice(0, RECENT_ACTIVITY_LIMIT)
        .map((d) => d.id),
    );
    // Budget: independent of how many diets the workspace has
    expect(m.docsRead).toBe(RECENT_ACTIVITY_LIMIT);
    expect(m.aggregations).toBe(1 + months.length);
    expect(m.errors).toEqual([]);
  });

  it("pacientes: status de dieta só para a página visível", async () => {
    holder.db = nutriDb();
    const page = roster.slice(0, PATIENTS_PAGE_SIZE);
    const latest = new Map<string, AnyDietPlan | null>();
    const m = await measure(async () =>
      Promise.all(
        page.map(async (p) => {
          const first = await firstValue<AnyDietPlan | null>((cb) =>
            subscribeLatestDiet(NUTRI, p.id!, cb),
          );
          latest.set(p.id!, first.value);
          return first.unsubscribe;
        }),
      ),
    );
    current["Pacientes (1ª página)"] = m;

    for (const p of page) {
      const expected = truth.diets
        .filter((d) => d.patientId === p.id)
        .sort(newestFirst)[0];
      expect(latest.get(p.id!)?.id).toBe(expected.id);
    }
    expect(m.docsRead).toBeLessThanOrEqual(PATIENTS_PAGE_SIZE);
    expect(m.errors).toEqual([]);
  });

  it("agenda: consultas do mês visível e as próximas", async () => {
    holder.db = nutriDb();
    const now = new Date();
    const { start, end } = getCivilMonthRange(
      now.getFullYear(),
      now.getMonth(),
    );
    const todayStr = start.slice(0, 8) + String(now.getDate()).padStart(2, "0");
    let monthAppts: Appointment[] = [];
    let upcoming: Appointment[] = [];
    const m = await measure(async () => {
      const month = await firstValue<Appointment[]>((cb) =>
        getAppointmentsInRange(NUTRI, start, end, cb),
      );
      const next = await firstValue<Appointment[]>((cb) =>
        getUpcomingAppointments(NUTRI, todayStr, UPCOMING_LIMIT, cb),
      );
      monthAppts = month.value;
      upcoming = next.value;
      return [month.unsubscribe, next.unsubscribe];
    });
    current["Agenda (mês visível + próximas)"] = m;

    const expectedMonth = truth.appointments.filter(
      (a) => a.dateTime >= start && a.dateTime < end,
    );
    expect(monthAppts.map((a) => a.id).sort()).toEqual(
      expectedMonth.map((a) => a.id).sort(),
    );
    const expectedUpcoming = truth.appointments
      .filter((a) => a.status === "scheduled" && a.dateTime >= todayStr)
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
      .slice(0, UPCOMING_LIMIT);
    expect(upcoming.map((a) => a.dateTime)).toEqual(
      expectedUpcoming.map((a) => a.dateTime),
    );
    expect(m.docsRead).toBe(expectedMonth.length + expectedUpcoming.length);
    expect(m.errors).toEqual([]);
  });

  it("relatórios: contagens de dietas por agregação", async () => {
    holder.db = nutriDb();
    const months = getRecentMonthRanges(1);
    let summary = { total: 0, perMonth: [] as number[] };
    const m = await measure(async () => {
      summary = await getDietCountSummary(NUTRI, months);
      return [];
    });
    current["Relatórios"] = m;
    expect(summary.total).toBe(truth.diets.length);
    expect(m.docsRead).toBe(0);
    expect(m.aggregations).toBe(2);
  });

  it("configurações: contagem de pacientes por agregação", async () => {
    holder.db = nutriDb();
    let count = 0;
    const m = await measure(async () => {
      count = await countPatients(NUTRI);
      return [];
    });
    current["Configurações (plano)"] = m;
    expect(count).toBe(SCENARIO.patients);
    expect(m.docsRead).toBe(0);
    expect(m.estimatedBilledReads).toBe(1);
  });

  it("portal: só a próxima consulta agendada (regras de segurança aplicadas)", async () => {
    holder.db = portalDb();
    let next: Appointment | null = null;
    const m = await measure(async () => {
      await getPatientById(NUTRI, portalPatientId);
      const diets = await firstValue<AnyDietPlan[]>((cb) =>
        getPatientDiets(NUTRI, portalPatientId, cb),
      );
      const appt = await firstValue<Appointment | null>((cb) =>
        getNextPatientAppointment(
          NUTRI,
          portalPatientId,
          formatWallClock(new Date()),
          cb,
        ),
      );
      next = appt.value;
      return [diets.unsubscribe, appt.unsubscribe];
    });
    current["Portal do paciente"] = m;
    // The cancelled visit that happens earlier must be skipped.
    expect((next as Appointment | null)?.id).toBe("perf-portal-next");
    expect(m.errors).toEqual([]);
  });
});

describe("Índices compostos", () => {
  it("toda consulta composta executada está declarada em firestore.indexes.json", () => {
    const required = Object.values(current)
      .flatMap((m) => m.records)
      .map((r) => r.requiredIndex)
      .filter((r): r is NonNullable<typeof r> => Boolean(r));
    // Latest diet, upcoming appointments and portal next appointment.
    expect(required.length).toBeGreaterThanOrEqual(3);
    const missing = required.filter(
      (r) => !isIndexDeclared(r, declaredIndexes),
    );
    expect(missing).toEqual([]);
  });
});
