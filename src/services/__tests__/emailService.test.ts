import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendDietEmail,
  sendPortalAccessEmail,
  isEmailConfigured,
  isValidEmail,
  clearEmailRateLimits,
} from "../emailService";
import emailjs from "@emailjs/browser";
import { AppError } from "../../utils/errors";

vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200, text: "OK" }),
  },
}));

describe("emailService and abuse controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearEmailRateLimits();
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test123");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test456");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_test789");
  });

  describe("isValidEmail helper", () => {
    it("validates standard and subdomained email addresses", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@sub.domain.org")).toBe(true);
    });

    it("rejects invalid email formats, spaces, or non-string inputs", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("not-an-email")).toBe(false);
      expect(isValidEmail("missing@domain")).toBe(false);
      expect(isValidEmail("@missingusername.com")).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe("isEmailConfigured", () => {
    it("returns true when all 3 env variables are defined", () => {
      expect(isEmailConfigured()).toBe(true);
    });

    it("returns false if any of the 3 env variables is missing", () => {
      vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");
      expect(isEmailConfigured()).toBe(false);
    });
  });

  describe("sendDietEmail", () => {
    it("throws EMAIL_NOT_CONFIGURED when service keys are missing", async () => {
      vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");

      await expect(
        sendDietEmail({
          toEmail: "patient@test.com",
          toName: "Patient",
          fromName: "Doctor",
          dietDate: "2026-09-18",
        }),
      ).rejects.toThrow("EMAIL_NOT_CONFIGURED");
    });

    it("throws EMAIL_INVALID_RECIPIENT when recipient email is malformed", async () => {
      await expect(
        sendDietEmail({
          toEmail: "invalid-email-format",
          toName: "Patient",
          fromName: "Doctor",
          dietDate: "2026-09-18",
        }),
      ).rejects.toThrow("EMAIL_INVALID_RECIPIENT");
    });

    it("throws EMAIL_PAYLOAD_TOO_LARGE when message exceeds 5000 characters", async () => {
      const hugeMessage = "A".repeat(5001);

      await expect(
        sendDietEmail({
          toEmail: "patient@test.com",
          toName: "Patient",
          fromName: "Doctor",
          dietDate: "2026-09-18",
          message: hugeMessage,
        }),
      ).rejects.toThrow("EMAIL_PAYLOAD_TOO_LARGE");
    });

    it("sends diet email successfully and passes expected template params", async () => {
      await sendDietEmail({
        toEmail: "patient@test.com",
        toName: "Maria Silva",
        fromName: "Dra. Ana",
        dietDate: "2026-09-18",
        portalUrl: "https://example.com/portal",
      });

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(callArgs[0]).toBe("service_test123");
      expect(callArgs[1]).toBe("template_test456");
      expect(callArgs[2].to_email).toBe("patient@test.com");
      expect(callArgs[2].to_name).toBe("Maria Silva");
      expect(callArgs[3]).toEqual({ publicKey: "pub_test789" });
    });

    it("enforces in-memory rate limiting when spamming the same recipient", async () => {
      await sendDietEmail({
        toEmail: "repeat@test.com",
        toName: "Patient",
        fromName: "Doctor",
        dietDate: "2026-09-18",
      });

      // Immediate second send to same email should trigger rate limit
      await expect(
        sendDietEmail({
          toEmail: "repeat@test.com",
          toName: "Patient",
          fromName: "Doctor",
          dietDate: "2026-09-18",
        }),
      ).rejects.toThrow(AppError);

      // Sending to a DIFFERENT recipient is unaffected
      await expect(
        sendDietEmail({
          toEmail: "other@test.com",
          toName: "Patient 2",
          fromName: "Doctor",
          dietDate: "2026-09-18",
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe("sendPortalAccessEmail", () => {
    it("throws EMAIL_NOT_CONFIGURED when keys missing", async () => {
      vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");

      await expect(
        sendPortalAccessEmail({
          toEmail: "patient@test.com",
          toName: "Patient",
          fromName: "Doctor",
          portalUrl: "https://example.com/portal",
        }),
      ).rejects.toThrow("EMAIL_NOT_CONFIGURED");
    });

    it("throws EMAIL_INVALID_RECIPIENT when recipient email is malformed", async () => {
      await expect(
        sendPortalAccessEmail({
          toEmail: "notanemail",
          toName: "Patient",
          fromName: "Doctor",
          portalUrl: "https://example.com/portal",
        }),
      ).rejects.toThrow("EMAIL_INVALID_RECIPIENT");
    });

    it("sends portal access email with correct parameters", async () => {
      await sendPortalAccessEmail({
        toEmail: "patient@test.com",
        toName: "Carlos Souza",
        fromName: "Dr. Roberto",
        portalUrl: "https://example.com/portal",
        inviteUrl: "https://example.com/accept-invite?token=abc",
      });

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(callArgs[2].to_email).toBe("patient@test.com");
      expect(callArgs[2].portal_url).toBe(
        "https://example.com/accept-invite?token=abc",
      );
    });
  });
});
