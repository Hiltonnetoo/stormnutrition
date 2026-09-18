import { describe, it, expect } from "vitest";
import {
  normalizeWeightRecord,
  normalizeAdherenceEntry,
  normalizeSelfEvaluation,
  normalizePatientHistories,
} from "../patientMigrationService";
import type { Patient } from "../../types";

const mockPatient: Patient = {
  id: "pat_123",
  firstName: "Maria",
  lastName: "Silva",
  dob: "1990-05-15",
  gender: "female",
  email: "maria@example.com",
  phone: "11999999999",
  address: {
    cep: "01001-000",
    street: "Rua Direita",
    number: "100",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
  },
  profession: "Engenheira",
  activityLevel: "moderately_active",
  mode: "general",
  clinicalTags: [],
  nutritionalGoal: "maintenance",
  consultationMode: "presencial",
  medications: "",
  familyHistory: "",
  mealsPerDay: 4,
  hydrationLevel: "moderate",
  dietaryRestrictions: [],
  foodAllergies: "",
  weight: 65.5,
  height: 168,
  anthropometryMetadata: {
    weightOrigin: "clinical",
    heightOrigin: "clinical",
  },
  termsAccepted: true,
  status: "Active",
  createdAt: "2026-01-10T10:00:00.000Z",
  avatarUrl: "",
};

describe("patientMigrationService - Legacy Normalization and Idempotency", () => {
  describe("normalizeWeightRecord", () => {
    it("generates deterministic ID when missing and preserves numeric weight", () => {
      const legacy = { date: "2026-02-10T10:00:00Z", weight: 64.2 };
      const normalized = normalizeWeightRecord(legacy, 0);

      expect(normalized).not.toBeNull();
      expect(normalized!.id).toMatch(/^w_/);
      expect(normalized!.weight).toBe(64.2);
      expect(normalized!.date).toBe("2026-02-10T10:00:00Z");

      // Idempotent: running again on identical data produces identical ID
      const secondRun = normalizeWeightRecord(legacy, 0);
      expect(secondRun!.id).toBe(normalized!.id);
    });

    it("preserves explicit ID, clientEventId and authorUid when present", () => {
      const modern = {
        id: "explicit_id_999",
        clientEventId: "client_evt_1",
        authorUid: "nutri_abc",
        date: "2026-03-01",
        weight: 63.8,
        origin: "self_reported",
      };
      const normalized = normalizeWeightRecord(modern);

      expect(normalized!.id).toBe("explicit_id_999");
      expect(normalized!.clientEventId).toBe("client_evt_1");
      expect(normalized!.authorUid).toBe("nutri_abc");
      expect(normalized!.origin).toBe("self_reported");
    });

    it("rejects non-numeric or negative weight values safely", () => {
      expect(normalizeWeightRecord({ weight: -5 })).toBeNull();
      expect(normalizeWeightRecord({ weight: "invalid" })).toBeNull();
      expect(normalizeWeightRecord(null)).toBeNull();
    });
  });

  describe("normalizeAdherenceEntry", () => {
    it("normalizes ISO timestamp to civil date format YYYY-MM-DD", () => {
      const entry = { date: "2026-09-17T20:30:00.000Z", followed: true };
      const normalized = normalizeAdherenceEntry(entry);

      expect(normalized).not.toBeNull();
      expect(normalized!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(normalized!.followed).toBe(true);
    });

    it("preserves already valid civil date", () => {
      const entry = { date: "2026-09-17", followed: false };
      const normalized = normalizeAdherenceEntry(entry);
      expect(normalized!.date).toBe("2026-09-17");
      expect(normalized!.followed).toBe(false);
    });

    it("rejects invalid date entries", () => {
      expect(normalizeAdherenceEntry({ date: "garbage" })).toBeNull();
    });
  });

  describe("normalizeSelfEvaluation", () => {
    it("ensures id and valid status", () => {
      const raw = { requestDate: "2026-05-01", status: "completed" };
      const norm = normalizeSelfEvaluation(raw, 0);

      expect(norm!.id).toMatch(/^eval_/);
      expect(norm!.status).toBe("completed");
    });
  });

  describe("normalizePatientHistories - End-to-End Idempotency", () => {
    it("deduplicates identical weight events and sorts chronologically", () => {
      const legacyPatient: Patient = {
        ...mockPatient,
        weightHistory: [
          { date: "2026-03-01T10:00:00Z", weight: 66 },
          { date: "2026-01-01T10:00:00Z", weight: 68 }, // Unsorted
          { date: "2026-03-01T10:00:00Z", weight: 66 }, // Duplicate
        ],
        adherenceLog: [
          { date: "2026-09-15", followed: true },
          { date: "2026-09-15", followed: false }, // Duplicate for same civil day: latest wins
          { date: "2026-09-14", followed: true }, // Unsorted
        ],
      };

      const result1 = normalizePatientHistories(legacyPatient);
      expect(result1.hasChanges).toBe(true);
      expect(result1.patient.weightHistory).toHaveLength(2);
      expect(result1.patient.weightHistory![0].date).toBe(
        "2026-01-01T10:00:00Z",
      );
      expect(result1.patient.weightHistory![1].date).toBe(
        "2026-03-01T10:00:00Z",
      );

      expect(result1.patient.adherenceLog).toHaveLength(2);
      expect(result1.patient.adherenceLog![0].date).toBe("2026-09-14");
      expect(result1.patient.adherenceLog![1].date).toBe("2026-09-15");
      // Latest update for 2026-09-15 was followed: false
      expect(result1.patient.adherenceLog![1].followed).toBe(false);

      // PURE IDEMPOTENCY: Re-running on normalized patient must report hasChanges = false
      const result2 = normalizePatientHistories(result1.patient);
      expect(result2.hasChanges).toBe(false);
      expect(result2.patient).toEqual(result1.patient);
    });
  });
});
