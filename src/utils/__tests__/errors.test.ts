import { describe, it, expect, vi } from "vitest";
import {
  AppError,
  generateCorrelationId,
  classifyError,
  sanitizeDataForLogging,
  safeLogError,
} from "../errors";

describe("errors utility and taxonomy", () => {
  it("generateCorrelationId produces ERR- prefixed 6-char alphanumeric tokens", () => {
    const id1 = generateCorrelationId();
    const id2 = generateCorrelationId();

    expect(id1).toMatch(/^ERR-[A-Z0-9]{6}$/);
    expect(id2).toMatch(/^ERR-[A-Z0-9]{6}$/);
    expect(id1).not.toBe(id2);
  });

  describe("classifyError", () => {
    it("classifies AppError preserving its assigned category", () => {
      const err = new AppError("CUSTOM", "rate_limited");
      expect(classifyError(err).category).toBe("rate_limited");
    });

    it("classifies permission denied codes and messages", () => {
      expect(classifyError({ code: "permission-denied" }).category).toBe(
        "permission_denied",
      );
      expect(
        classifyError(new Error("Missing or insufficient permissions"))
          .category,
      ).toBe("permission_denied");
    });

    it("classifies authentication failures", () => {
      expect(classifyError({ code: "auth/user-token-expired" }).category).toBe(
        "unauthenticated",
      );
      expect(classifyError(new Error("unauthenticated request")).category).toBe(
        "unauthenticated",
      );
    });

    it("classifies service unavailability and network failures", () => {
      expect(classifyError({ code: "unavailable" }).category).toBe(
        "unavailable",
      );
      expect(classifyError(new Error("Network request failed")).category).toBe(
        "unavailable",
      );
      expect(classifyError(new Error("Failed to fetch")).category).toBe(
        "unavailable",
      );
    });

    it("classifies not found errors", () => {
      expect(classifyError({ code: "not-found" }).category).toBe("not_found");
      expect(classifyError(new Error("document was not found")).category).toBe(
        "not_found",
      );
    });

    it("classifies rate limiting and quota errors", () => {
      expect(classifyError({ code: "resource-exhausted" }).category).toBe(
        "rate_limited",
      );
      expect(classifyError(new Error("EMAIL_RATE_LIMITED")).category).toBe(
        "rate_limited",
      );
      expect(classifyError(new Error("too many requests")).category).toBe(
        "rate_limited",
      );
    });

    it("classifies validation errors", () => {
      expect(classifyError({ name: "ZodError" }).category).toBe("validation");
      expect(
        classifyError(new Error("Validation failed for input")).category,
      ).toBe("validation");
    });

    it("falls back to unknown for unclassified errors", () => {
      expect(
        classifyError(new Error("Something completely random")).category,
      ).toBe("unknown");
      expect(classifyError(null).category).toBe("unknown");
    });
  });

  describe("sanitizeDataForLogging", () => {
    it("redacts sensitive fields like passwords, secrets, tokens, and medical records", () => {
      const raw = {
        userId: "user-123",
        name: "Dr. Silva",
        password: "SuperSecretPassword123!",
        userToken: "jwt.header.payload.signature",
        apiKey: "AIzaSyD-123456",
        cpf: "123.456.789-00",
        medicalRecord: "Patient has diagnosis X and treatment Y",
        metadata: {
          sessionSecret: "shhhh",
          patientNotes: "Clinical evaluation data",
          safeCounter: 42,
        },
      };

      const sanitized = sanitizeDataForLogging(raw) as Record<string, unknown>;

      expect(sanitized.userId).toBe("user-123");
      expect(sanitized.name).toBe("Dr. Silva");
      expect(sanitized.password).toBe("[REDACTED]");
      expect(sanitized.userToken).toBe("[REDACTED]");
      expect(sanitized.apiKey).toBe("[REDACTED]");
      expect(sanitized.cpf).toBe("[REDACTED]");
      expect(sanitized.medicalRecord).toBe("[REDACTED]");

      const nested = sanitized.metadata as Record<string, unknown>;
      expect(nested.sessionSecret).toBe("[REDACTED]");
      expect(nested.patientNotes).toBe("[REDACTED]");
      expect(nested.safeCounter).toBe(42);
    });

    it("handles primitives, arrays, null and undefined safely", () => {
      expect(sanitizeDataForLogging(null)).toBeNull();
      expect(sanitizeDataForLogging(undefined)).toBeUndefined();
      expect(sanitizeDataForLogging(123)).toBe(123);
      expect(sanitizeDataForLogging("hello")).toBe("hello");

      const arr = [{ password: "123" }, { id: "ok" }];
      const sanitizedArr = sanitizeDataForLogging(arr) as Record<
        string,
        unknown
      >[];
      expect(sanitizedArr[0].password).toBe("[REDACTED]");
      expect(sanitizedArr[1].id).toBe("ok");
    });
  });

  describe("safeLogError", () => {
    it("calls console.error without crashing and redacts sensitive metadata", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      safeLogError(
        "test-context",
        new Error("Db connection failed"),
        "ERR-TEST01",
        {
          secretToken: "hidden123",
          action: "sync",
        },
      );

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logPayload = consoleSpy.mock.calls[0][1] as {
        correlationId: string;
        metadata: Record<string, unknown>;
      };
      expect(logPayload.correlationId).toBe("ERR-TEST01");
      expect(logPayload.metadata.secretToken).toBe("[REDACTED]");
      expect(logPayload.metadata.action).toBe("sync");

      consoleSpy.mockRestore();
    });
  });
});
