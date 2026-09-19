import { describe, it, expect } from "vitest";
import {
  validatePatient,
  validateWeightNumber,
  validateProfileImage,
  MAX_PROFILE_IMAGE_SIZE_BYTES,
} from "../validation";

describe("validation utilities", () => {
  describe("validateWeightNumber", () => {
    it("accepts valid numbers within clinical limits", () => {
      expect(validateWeightNumber(70)).toBe(70);
      expect(validateWeightNumber(72.56)).toBe(72.6);
      expect(validateWeightNumber("65.4")).toBe(65.4);
    });

    it("rejects non-numeric or out-of-range weights", () => {
      expect(() => validateWeightNumber(5)).toThrow(/Peso inválido/);
      expect(() => validateWeightNumber(501)).toThrow(/Peso inválido/);
      expect(() => validateWeightNumber("not_a_number")).toThrow(
        /Peso inválido/,
      );
      expect(() => validateWeightNumber(-10)).toThrow(/Peso inválido/);
    });
  });

  describe("validateProfileImage", () => {
    it("accepts valid image formats within size limit", () => {
      const file = new File(["dummy content"], "avatar.png", {
        type: "image/png",
      });
      const res = validateProfileImage(file);
      expect(res.valid).toBe(true);
    });

    it("rejects non-image MIME types", () => {
      const file = new File(["dummy content"], "exploit.html", {
        type: "text/html",
      });
      const res = validateProfileImage(file);
      expect(res.valid).toBe(false);
      if (!res.valid) {
        expect(res.error).toContain("Formato inválido");
      }
    });

    it("rejects files exceeding 5MB", () => {
      // Mock large file
      const largeFile = {
        name: "huge.jpg",
        type: "image/jpeg",
        size: MAX_PROFILE_IMAGE_SIZE_BYTES + 1024,
      } as unknown as File;

      const res = validateProfileImage(largeFile);
      expect(res.valid).toBe(false);
      if (!res.valid) {
        expect(res.error).toContain("Arquivo muito grande");
      }
    });
  });

  describe("validatePatient", () => {
    it("validates and parses a full valid patient document", () => {
      const raw = {
        id: "p-123",
        firstName: "Maria",
        lastName: "Silva",
        dob: "1990-01-01",
        gender: "female",
        email: "maria@example.com",
        phone: "11999999999",
        status: "Active",
        weight: 65,
        height: 165,
        clinicalTags: ["diabetes_t2"],
        weightHistory: [{ date: "2026-01-01", weight: 66, origin: "clinical" }],
      };

      const parsed = validatePatient(raw);
      expect(parsed.id).toBe("p-123");
      expect(parsed.firstName).toBe("Maria");
      expect(parsed.status).toBe("Active");
      expect(parsed.weight).toBe(65);
      expect(parsed.clinicalTags).toEqual(["diabetes_t2"]);
      expect(parsed.weightHistory).toHaveLength(1);
    });

    it("sanitizes missing and unexpected fields with safe defaults", () => {
      const raw = {
        firstName: "  João  ",
        weight: "invalid_weight",
        clinicalTags: "not_an_array",
        status: "UnknownStatus",
      };

      const parsed = validatePatient(raw);
      expect(parsed.firstName).toBe("João");
      expect(parsed.weight).toBe(0);
      expect(parsed.clinicalTags).toEqual([]);
      expect(parsed.status).toBe("Active"); // defaults to Active
      expect(parsed.gender).toBe("female"); // defaults safely
    });

    it("throws when raw is null or not an object", () => {
      expect(() => validatePatient(null)).toThrow(/payload vazio/);
      expect(() => validatePatient("not an object")).toThrow(/payload vazio/);
    });
  });

  // The sanitized read model (what the screens render). Writers of
  // append-only fields no longer use it (R02-C), so its contract is covered
  // here directly.
  describe("validatePatient — read model of histories and settings", () => {
    const parsed = validatePatient({
      firstName: " Ana ",
      weightHistory: [
        {
          id: " w1 ",
          date: "2026-01-01",
          weight: 60,
          authorUid: " u1 ",
          clientEventId: " e1 ",
          fatPercentage: 22.5,
          muscleMassKg: 40,
        },
        { date: "2026-02-01", weight: "61", origin: "remote_guided" },
        { weight: 62, origin: "clinical", fatPercentage: Number.NaN },
      ],
      adherenceLog: [
        {
          date: "2026-09-10",
          followed: 1,
          timestamp: " 2026-09-10T12:00:00Z ",
          clientEventId: " c1 ",
        },
        { date: "", followed: true },
        { followed: false },
      ],
      automationSettings: {
        autoRequestAssessment: "yes",
        intervalDays: "15",
        lastAutoRequestDate: " 2026-09-01 ",
      },
      portalStatus: "revoked",
      status: "Archived",
      pendingInvitationId: " inv1 ",
    });

    it("normalizes weight records without dropping them", () => {
      expect(parsed.weightHistory).toEqual([
        {
          id: "w1",
          date: "2026-01-01",
          weight: 60,
          origin: "self_reported",
          authorUid: "u1",
          clientEventId: "e1",
          fatPercentage: 22.5,
          muscleMassKg: 40,
        },
        { date: "2026-02-01", weight: 61, origin: "remote_guided" },
        expect.objectContaining({ weight: 62, origin: "clinical" }),
      ]);
      expect(parsed.weightHistory![2]).not.toHaveProperty("fatPercentage");
    });

    it("keeps dated check-ins only, with trimmed audit fields", () => {
      expect(parsed.adherenceLog).toEqual([
        {
          date: "2026-09-10",
          followed: true,
          timestamp: "2026-09-10T12:00:00Z",
          clientEventId: "c1",
        },
      ]);
    });

    it("parses automation settings, portal status and lifecycle fields", () => {
      expect(parsed.automationSettings).toEqual({
        autoRequestAssessment: true,
        intervalDays: 15,
        lastAutoRequestDate: "2026-09-01",
      });
      expect(parsed.portalStatus).toBe("revoked");
      expect(parsed.status).toBe("Archived");
      expect(parsed.pendingInvitationId).toBe("inv1");
      expect(
        validatePatient({ portalStatus: "weird" }).portalStatus,
      ).toBeUndefined();
      expect(validatePatient({}).automationSettings).toBeUndefined();
    });
  });
});
