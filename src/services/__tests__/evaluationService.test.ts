import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  logPatientWeight,
  requestSelfEvaluation,
  completeSelfEvaluation,
  logAdherence,
} from "../evaluationService";
import type { Patient, WeightRecord } from "../../types";

// In-memory document storage for transaction testing
let mockStore: Record<string, Record<string, unknown>> = {};

vi.mock("../firebaseCore", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => {
  return {
    doc: vi.fn((_db, ...parts) => parts.join("/")),
    runTransaction: vi.fn(async (_db, updateFunction) => {
      const mockTx = {
        get: vi.fn(async (path: string) => {
          const data = mockStore[path];
          return {
            exists: () => Boolean(data),
            data: () => data,
            id: path.split("/").pop(),
          };
        }),
        update: vi.fn((path: string, updates: Record<string, unknown>) => {
          if (!mockStore[path]) {
            throw new Error("Doc not found in tx");
          }
          mockStore[path] = { ...mockStore[path], ...updates };
        }),
      };
      return updateFunction(mockTx);
    }),
    updateDoc: vi.fn(),
  };
});

const defaultPatientData: Patient = {
  id: "pat_123",
  firstName: "Juliana",
  lastName: "Costa",
  dob: "1992-08-20",
  gender: "female",
  email: "juliana@example.com",
  phone: "11988887777",
  address: {
    cep: "04001-000",
    street: "Av Paulista",
    number: "500",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
  },
  profession: "Advogada",
  activityLevel: "lightly_active",
  mode: "general",
  clinicalTags: [],
  nutritionalGoal: "weight_loss",
  consultationMode: "remoto",
  medications: "",
  familyHistory: "",
  mealsPerDay: 3,
  hydrationLevel: "moderate",
  dietaryRestrictions: [],
  foodAllergies: "",
  weight: 70.0,
  height: 165,
  anthropometryMetadata: {
    weightOrigin: "clinical",
    heightOrigin: "clinical",
  },
  termsAccepted: true,
  status: "Active",
  createdAt: "2026-01-01T10:00:00Z",
  avatarUrl: "",
  weightHistory: [
    {
      id: "w_initial",
      date: "2026-01-01T10:00:00Z",
      weight: 70.0,
      origin: "clinical",
    },
  ],
};

const DOC_PATH = "users/nutri_1/patients/pat_123";

const getPatientDoc = (): Patient => mockStore[DOC_PATH] as unknown as Patient;

describe("evaluationService - Atomic Transactions and Idempotency", () => {
  beforeEach(() => {
    mockStore = {
      [DOC_PATH]: JSON.parse(JSON.stringify(defaultPatientData)),
    };
  });

  describe("logPatientWeight", () => {
    it("atomically updates current weight and appends to weightHistory", async () => {
      const result = await logPatientWeight(
        "nutri_1",
        "pat_123",
        69.2,
        "self_reported",
        { clientEventId: "evt_w1" },
      );

      expect(result.success).toBe(true);
      expect(result.duplicated).toBe(false);

      const patient = getPatientDoc();
      expect(patient.weight).toBe(69.2);
      expect(patient.weightHistory).toHaveLength(2);
      expect(patient.weightHistory![1].weight).toBe(69.2);
      expect(patient.weightHistory![1].clientEventId).toBe("evt_w1");
    });

    it("is idempotent: retrying with the same clientEventId does not duplicate records", async () => {
      // First submission
      await logPatientWeight("nutri_1", "pat_123", 69.0, "self_reported", {
        clientEventId: "retry_evt_weight",
      });
      expect(getPatientDoc().weightHistory).toHaveLength(2);

      // Network retry with exact same idempotency key
      const retryResult = await logPatientWeight(
        "nutri_1",
        "pat_123",
        69.0,
        "self_reported",
        { clientEventId: "retry_evt_weight" },
      );

      expect(retryResult.duplicated).toBe(true);
      // Still 2 records! No duplicate appended!
      expect(getPatientDoc().weightHistory).toHaveLength(2);
    });

    it("rejects invalid or non-numeric weight values", async () => {
      await expect(logPatientWeight("nutri_1", "pat_123", 0)).rejects.toThrow();

      await expect(
        logPatientWeight("nutri_1", "pat_123", -10),
      ).rejects.toThrow();

      await expect(
        logPatientWeight("nutri_1", "pat_123", 500),
      ).rejects.toThrow();
    });
  });

  describe("logAdherence", () => {
    it("records daily adherence for the specified civil date", async () => {
      const res = await logAdherence("nutri_1", "pat_123", true, {
        date: "2026-09-17",
        clientEventId: "adh_1",
      });

      expect(res.success).toBe(true);
      expect(res.date).toBe("2026-09-17");

      const patient = getPatientDoc();
      expect(patient.adherenceLog).toHaveLength(1);
      expect(patient.adherenceLog![0].date).toBe("2026-09-17");
      expect(patient.adherenceLog![0].followed).toBe(true);
    });

    it("updates existing check-in on the same civil date without creating duplicate entries", async () => {
      // First check-in: followed = false
      await logAdherence("nutri_1", "pat_123", false, {
        date: "2026-09-17",
      });
      expect(getPatientDoc().adherenceLog).toHaveLength(1);
      expect(getPatientDoc().adherenceLog![0].followed).toBe(false);

      // Patient changes mind or updates today's check-in: followed = true
      await logAdherence("nutri_1", "pat_123", true, {
        date: "2026-09-17",
      });

      // Still 1 entry for 2026-09-17, but updated to true!
      const patient = getPatientDoc();
      expect(patient.adherenceLog).toHaveLength(1);
      expect(patient.adherenceLog![0].followed).toBe(true);
    });
  });

  describe("requestSelfEvaluation and completeSelfEvaluation", () => {
    it("creates protocol, clears active trigger on completion, and records weight atomically", async () => {
      // 1. Request
      const reqRes = await requestSelfEvaluation("nutri_1", "pat_123", {
        protocolId: "eval_test_protocol",
      });
      expect(reqRes.success).toBe(true);

      const patient1 = getPatientDoc();
      expect(patient1.activeProtocolId).toBe("eval_test_protocol");
      expect(patient1.selfEvaluations).toHaveLength(1);
      expect(patient1.selfEvaluations![0].status).toBe("pending");

      // 2. Complete
      const compRes = await completeSelfEvaluation(
        "nutri_1",
        "pat_123",
        "eval_test_protocol",
        {
          measurements: { weight: 68.5, waist: 75 },
          wellbeing: {
            sleepQuality: 4,
            energyLevel: 4,
            satiety: 4,
            digestiveHealth: "Ótima",
          },
        },
      );

      expect(compRes.success).toBe(true);

      const patient2 = getPatientDoc();
      // Active protocol cleared
      expect(patient2.activeProtocolId).toBeNull();
      expect(patient2.selfEvaluations![0].status).toBe("completed");
      expect(patient2.selfEvaluations![0].completionDate).toBeDefined();

      // Current weight updated and appended to history
      expect(patient2.weight).toBe(68.5);
      const evalWeightRecord = (patient2.weightHistory as WeightRecord[]).find(
        (r) => r.id === "eval_weight_eval_test_protocol",
      );
      expect(evalWeightRecord).toBeDefined();
      expect(evalWeightRecord!.weight).toBe(68.5);
    });
  });

  // R02-C: append-only fields are written as "stored + new". The expected
  // arrays are literal fixtures, not recomputed by the service under test.
  describe("R02-C — legacy histories are preserved as stored", () => {
    const legacyHistory = [
      { date: "2026-03-01", weight: 62, origin: "clinical" },
      { date: "2025-12-01", weight: 64 }, // no origin (legacy)
      { date: "2031-01-01", weight: 61, origin: "clinical" }, // future-dated
    ];

    it("logPatientWeight appends at the end without sorting or normalizing", async () => {
      mockStore[DOC_PATH].weightHistory = JSON.parse(
        JSON.stringify(legacyHistory),
      );
      await logPatientWeight("nutri_1", "pat_123", 60.4, "self_reported", {
        clientEventId: "evt_legacy",
        authorUid: "patient_uid",
        date: "2026-09-18T12:00:00.000Z",
      });
      const history = getPatientDoc().weightHistory as unknown[];
      expect(history.slice(0, 3)).toEqual(legacyHistory);
      expect(history[3]).toEqual({
        id: "evt_legacy",
        date: "2026-09-18T12:00:00.000Z",
        weight: 60.4,
        origin: "self_reported",
        authorUid: "patient_uid",
        clientEventId: "evt_legacy",
      });
      // Repeating the same event is a no-op.
      const again = await logPatientWeight(
        "nutri_1",
        "pat_123",
        60.4,
        "self_reported",
        {
          clientEventId: "evt_legacy",
          authorUid: "patient_uid",
        },
      );
      expect(again.duplicated).toBe(true);
      expect(getPatientDoc().weightHistory).toHaveLength(4);
    });

    it("logAdherence appends to an out-of-order log and updates the same day in place", async () => {
      const legacyLog = [
        { date: "2026-09-10", followed: true },
        { date: "2026-09-01", followed: false },
      ];
      mockStore[DOC_PATH].adherenceLog = JSON.parse(JSON.stringify(legacyLog));
      await logAdherence("nutri_1", "pat_123", true, { date: "2026-09-05" });
      let log = getPatientDoc().adherenceLog as {
        date: string;
        followed: boolean;
      }[];
      expect(log.map((e) => e.date)).toEqual([
        "2026-09-10",
        "2026-09-01",
        "2026-09-05",
      ]);
      await logAdherence("nutri_1", "pat_123", false, { date: "2026-09-05" });
      log = getPatientDoc().adherenceLog as {
        date: string;
        followed: boolean;
      }[];
      expect(log).toHaveLength(3);
      expect(log[2]).toMatchObject({ date: "2026-09-05", followed: false });
      expect(log.slice(0, 2)).toEqual(legacyLog);
    });

    it("completeSelfEvaluation only changes the answered protocol and appends its weight", async () => {
      const otherEval = {
        id: "ev0",
        requestDate: "2026-08-01",
        status: "completed",
        legacyFlag: "kept",
      };
      mockStore[DOC_PATH].weightHistory = JSON.parse(
        JSON.stringify(legacyHistory),
      );
      mockStore[DOC_PATH].selfEvaluations = [
        otherEval,
        { id: "ev1", requestDate: "2026-09-17", status: "pending" },
      ];
      mockStore[DOC_PATH].activeProtocolId = "ev1";
      await completeSelfEvaluation(
        "nutri_1",
        "pat_123",
        "ev1",
        {
          measurements: { weight: 60 },
          notes: "ok",
        },
        { authorUid: "patient_uid" },
      );
      const patient = getPatientDoc() as unknown as Record<string, unknown[]>;
      expect(patient.selfEvaluations[0]).toEqual(otherEval);
      expect(patient.selfEvaluations[1]).toMatchObject({
        id: "ev1",
        requestDate: "2026-09-17",
        status: "completed",
        measurements: { weight: 60 },
        notes: "ok",
      });
      expect(patient.selfEvaluations[1]).not.toHaveProperty("wellbeing");
      expect(patient.weightHistory.slice(0, 3)).toEqual(legacyHistory);
      expect(patient.weightHistory[3]).toMatchObject({
        id: "eval_weight_ev1",
        weight: 60,
      });
    });
  });
});
