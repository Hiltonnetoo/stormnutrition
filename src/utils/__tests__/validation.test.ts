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
});
