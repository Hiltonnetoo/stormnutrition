import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendDietEmail,
  sendPortalAccessEmail,
  isEmailConfigured,
  isValidEmail,
  isDemoDomain,
  isDemoRecipient,
  resolveEmailTransport,
  isSimulatedEmailTransport,
  clearEmailRateLimits,
} from "../emailService";
import emailjs from "@emailjs/browser";
import { AppError } from "../../utils/errors";

vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200, text: "OK" }),
  },
}));

describe("emailService, transport isolation, and abuse controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearEmailRateLimits();
    // Default to real transport with mocked EmailJS for functional dispatch tests
    vi.stubEnv("VITE_EMAIL_TRANSPORT", "real");
    vi.stubEnv("VITE_USE_FIREBASE_EMULATOR", "false");
    vi.stubEnv("VITE_DEMO_MODE", "false");
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test123");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test456");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_test789");
    vi.stubEnv("MODE", "development"); // Add this to allow real transport testing
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

  describe("Domain classification vs Transport isolation (Passo C10.1 & C10.2)", () => {
    it("isDemoDomain strictly classifies @demo.stormnutrition.com addresses", () => {
      expect(isDemoDomain("ana.silva@demo.stormnutrition.com")).toBe(true);
      expect(isDemoDomain("dra.clara@demo.stormnutrition.com")).toBe(true);
      expect(isDemoDomain("user@clinic.demo.stormnutrition.com")).toBe(true);
      expect(isDemoDomain("evaluator@example.com")).toBe(false);
      expect(isDemoDomain("patient@clinic.com.br")).toBe(false);
    });

    it("isDemoRecipient classifies all synthetic/test domains", () => {
      expect(isDemoRecipient("ana.silva@demo.stormnutrition.com")).toBe(true);
      expect(isDemoRecipient("tester@example.com")).toBe(true);
      expect(isDemoRecipient("tester@example.org")).toBe(true);
      expect(isDemoRecipient("qa@test.com")).toBe(true);
      expect(isDemoRecipient("patient@clinic.com.br")).toBe(false);
    });

    it("resolveEmailTransport resolves 'simulated' in emulator mode for any recipient", () => {
      vi.stubEnv("VITE_USE_FIREBASE_EMULATOR", "true");
      vi.stubEnv("VITE_EMAIL_TRANSPORT", "");

      expect(resolveEmailTransport("adversary@gmail.com")).toBe("simulated");
      expect(resolveEmailTransport("realpatient@uol.com.br")).toBe("simulated");
      expect(isSimulatedEmailTransport("adversary@gmail.com")).toBe(true);
    });

    it("resolveEmailTransport resolves 'simulated' in demo mode for any recipient", () => {
      vi.stubEnv("VITE_DEMO_MODE", "true");
      vi.stubEnv("VITE_EMAIL_TRANSPORT", "");

      expect(resolveEmailTransport("stranger@corporatedomain.com")).toBe(
        "simulated",
      );
    });

    it("resolveEmailTransport resolves 'simulated' when VITE_EMAIL_TRANSPORT=simulated", () => {
      vi.stubEnv("VITE_EMAIL_TRANSPORT", "simulated");

      expect(resolveEmailTransport("external@anydomain.com")).toBe("simulated");
    });

    it("resolveEmailTransport forces simulation for demo recipients even when VITE_EMAIL_TRANSPORT=real", () => {
      vi.stubEnv("VITE_EMAIL_TRANSPORT", "real");

      expect(resolveEmailTransport("ana.silva@demo.stormnutrition.com")).toBe(
        "simulated",
      );
      expect(resolveEmailTransport("qa@test.com")).toBe("simulated");
    });

    it("resolveEmailTransport resolves 'real' only when transport is real and recipient is non-demo", () => {
      vi.stubEnv("VITE_EMAIL_TRANSPORT", "real");
      vi.stubEnv("VITE_USE_FIREBASE_EMULATOR", "false");
      vi.stubEnv("VITE_DEMO_MODE", "false");

      expect(resolveEmailTransport("patient@clinic.com.br")).toBe("real");
    });
  });

  describe("External recipient blocking in isolated environments (Passo C10.2)", () => {
    it("NEVER calls EmailJS for non-demo recipient when VITE_USE_FIREBASE_EMULATOR=true, even with keys and real transport set", async () => {
      vi.stubEnv("VITE_USE_FIREBASE_EMULATOR", "true");
      vi.stubEnv("VITE_EMAIL_TRANSPORT", "real");
      vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test123");
      vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test456");
      vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_test789");

      const result = await sendDietEmail({
        toEmail: "external.stranger@anydomain.com.br",
        toName: "External Recipient",
        fromName: "Doctor",
        dietDate: "2026-09-18",
      });

      expect(result).toEqual({
        status: "simulated",
        simulated: true,
        recipient: "external.stranger@anydomain.com.br",
      });
      expect(emailjs.send).not.toHaveBeenCalled();
    });

    it("NEVER calls EmailJS for non-demo recipient when VITE_DEMO_MODE=true, even with keys and real transport set", async () => {
      vi.stubEnv("VITE_DEMO_MODE", "true");
      vi.stubEnv("VITE_EMAIL_TRANSPORT", "real");
      vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test123");
      vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test456");
      vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_test789");

      const result = await sendPortalAccessEmail({
        toEmail: "unrelated.doctor@hospital.org",
        toName: "Unrelated Doctor",
        fromName: "Admin",
        portalUrl: "https://demo.stormnutrition.com/paciente",
      });

      expect(result).toEqual({
        status: "simulated",
        simulated: true,
        recipient: "unrelated.doctor@hospital.org",
      });
      expect(emailjs.send).not.toHaveBeenCalled();
    });
  });

  describe("sendDietEmail (real transport path)", () => {
    it("throws EMAIL_NOT_CONFIGURED when service keys are missing", async () => {
      vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");

      await expect(
        sendDietEmail({
          toEmail: "patient@clinic.com.br",
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
          toEmail: "patient@clinic.com.br",
          toName: "Patient",
          fromName: "Doctor",
          dietDate: "2026-09-18",
          message: hugeMessage,
        }),
      ).rejects.toThrow("EMAIL_PAYLOAD_TOO_LARGE");
    });

    it("sends diet email successfully and passes expected template params", async () => {
      const result = await sendDietEmail({
        toEmail: "patient@clinic.com.br",
        toName: "Maria Silva",
        fromName: "Dra. Ana",
        dietDate: "2026-09-18",
        portalUrl: "https://clinic.com.br/portal",
      });

      expect(result).toEqual({
        status: "sent",
        simulated: false,
        recipient: "patient@clinic.com.br",
      });
      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(callArgs[0]).toBe("service_test123");
      expect(callArgs[1]).toBe("template_test456");
      expect(callArgs[2].to_email).toBe("patient@clinic.com.br");
      expect(callArgs[2].to_name).toBe("Maria Silva");
      expect(callArgs[3]).toEqual({ publicKey: "pub_test789" });
    });

    it("enforces in-memory rate limiting when spamming the same recipient", async () => {
      const firstResult = await sendDietEmail({
        toEmail: "repeat@clinic.com.br",
        toName: "Patient",
        fromName: "Doctor",
        dietDate: "2026-09-18",
      });
      expect(firstResult.status).toBe("sent");

      // Immediate second send to same email should trigger rate limit
      await expect(
        sendDietEmail({
          toEmail: "repeat@clinic.com.br",
          toName: "Patient",
          fromName: "Doctor",
          dietDate: "2026-09-18",
        }),
      ).rejects.toThrow(AppError);

      // Sending to a DIFFERENT recipient is unaffected
      const diffResult = await sendDietEmail({
        toEmail: "other@clinic.com.br",
        toName: "Patient 2",
        fromName: "Doctor",
        dietDate: "2026-09-18",
      });
      expect(diffResult.status).toBe("sent");
    });
  });

  describe("sendPortalAccessEmail (real transport path)", () => {
    it("throws EMAIL_NOT_CONFIGURED when keys missing", async () => {
      vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");

      await expect(
        sendPortalAccessEmail({
          toEmail: "patient@clinic.com.br",
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
      const result = await sendPortalAccessEmail({
        toEmail: "patient@clinic.com.br",
        toName: "Carlos Souza",
        fromName: "Dr. Roberto",
        portalUrl: "https://clinic.com.br/portal",
        inviteUrl: "https://clinic.com.br/accept-invite?token=abc",
      });

      expect(result).toEqual({
        status: "sent",
        simulated: false,
        recipient: "patient@clinic.com.br",
      });
      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(callArgs[2].to_email).toBe("patient@clinic.com.br");
      expect(callArgs[2].portal_url).toBe(
        "https://clinic.com.br/accept-invite?token=abc",
      );
    });
  });

  describe("demo recipient simulation and rate limiting", () => {
    it("safely intercepts sending to demo recipients without calling EmailJS even without keys", async () => {
      vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");
      vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");

      const dietResult = await sendDietEmail({
        toEmail: "ana.silva@demo.stormnutrition.com",
        toName: "Ana Silva",
        fromName: "Dra. Clara",
        dietDate: "2026-09-18",
      });

      expect(dietResult).toEqual({
        status: "simulated",
        simulated: true,
        recipient: "ana.silva@demo.stormnutrition.com",
      });
      expect(emailjs.send).not.toHaveBeenCalled();

      clearEmailRateLimits();

      const accessResult = await sendPortalAccessEmail({
        toEmail: "ana.silva@demo.stormnutrition.com",
        toName: "Ana Silva",
        fromName: "Dra. Clara",
        portalUrl: "https://demo.stormnutrition.com/paciente",
      });

      expect(accessResult).toEqual({
        status: "simulated",
        simulated: true,
        recipient: "ana.silva@demo.stormnutrition.com",
      });
      expect(emailjs.send).not.toHaveBeenCalled();
    });

    it("still enforces abuse and syntax validation for demo recipients", async () => {
      await expect(
        sendDietEmail({
          toEmail: "invalid-demo-syntax",
          toName: "Demo User",
          fromName: "Doctor",
          dietDate: "2026-09-18",
        }),
      ).rejects.toThrow("EMAIL_INVALID_RECIPIENT");
    });

    it("applies in-memory client rate limiting even to simulated dispatches", async () => {
      await sendDietEmail({
        toEmail: "bruno.costa@demo.stormnutrition.com",
        toName: "Bruno Costa",
        fromName: "Dra. Clara",
        dietDate: "2026-09-18",
      });

      await expect(
        sendDietEmail({
          toEmail: "bruno.costa@demo.stormnutrition.com",
          toName: "Bruno Costa",
          fromName: "Dra. Clara",
          dietDate: "2026-09-18",
        }),
      ).rejects.toThrow(AppError);
    });
  });

  // R05 (11.3 R05-A/B): adversarial matrix. The provider (EmailJS) is the only
  // outbound path; its spy must stay at zero calls in every isolated case.
  describe("R05 — adversarial isolation matrix", () => {
    const external = "paciente.real@clinica-externa.com.br";
    const send = {
      diet: () =>
        sendDietEmail({
          toEmail: external,
          toName: "Paciente",
          fromName: "Dra.",
          dietDate: "2026-09-18",
        }),
      portal: () =>
        sendPortalAccessEmail({
          toEmail: external,
          toName: "Paciente",
          fromName: "Dra.",
          portalUrl: "https://example.test/#/paciente",
          inviteUrl: "https://example.test/#/convite/x",
        }),
    };
    const isolated: [string, () => void][] = [
      ["emulator", () => vi.stubEnv("VITE_USE_FIREBASE_EMULATOR", "true")],
      ["demo", () => vi.stubEnv("VITE_DEMO_MODE", "true")],
      ["test", () => vi.stubEnv("MODE", "test")],
    ];
    for (const [mode, enable] of isolated) {
      for (const fn of ["diet", "portal"] as const) {
        it(`R05-A ${mode} + transport=real + keys + external domain → ${fn} simulated, 0 provider calls`, async () => {
          enable(); // keys and VITE_EMAIL_TRANSPORT=real come from beforeEach
          const result = await send[fn]();
          expect(result).toMatchObject({
            status: "simulated",
            simulated: true,
          });
          expect(emailjs.send).not.toHaveBeenCalled();
        });
      }
    }

    for (const [label, value] of [
      ["absent", undefined],
      ["invalid", "smtp"],
      ["simulated", "simulated"],
    ] as const) {
      it(`R05-B outside isolation, transport ${label} → simulated, 0 provider calls`, async () => {
        vi.stubEnv("VITE_EMAIL_TRANSPORT", value as string);
        if (value === undefined) vi.stubEnv("VITE_EMAIL_TRANSPORT", "");
        expect(resolveEmailTransport(external)).toBe("simulated");
        const result = await send.diet();
        expect(result.simulated).toBe(true);
        expect(emailjs.send).not.toHaveBeenCalled();
      });
    }

    it("R05-B explicit transport=real outside isolation reaches only the mocked provider", async () => {
      const result = await send.portal();
      expect(result.simulated).toBe(false);
      expect(emailjs.send).toHaveBeenCalledTimes(1);
      expect(vi.mocked(emailjs.send).mock.calls[0][2]).toMatchObject({
        to_email: external,
      });
    });
  });
});
