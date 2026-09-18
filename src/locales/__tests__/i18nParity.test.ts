import { describe, it, expect, vi, beforeEach } from "vitest";
import en from "../en/common.json";
import pt from "../pt/common.json";
import { normalizeLanguage, syncDocumentLanguage } from "../../i18n";
import {
  getNormalizedLanguage,
  getAppLocale,
  translateMealName,
} from "../../utils/locale";
import {
  sendDietEmail,
  sendPortalAccessEmail,
} from "../../services/emailService";
import emailjs from "@emailjs/browser";

vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200, text: "OK" }),
  },
}));

// Helper to flatten nested JSON object into dot-separated paths
function getFlattenedKeys(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(
        result,
        getFlattenedKeys(val as Record<string, unknown>, newKey),
      );
    } else {
      result[newKey] = val;
    }
  }
  return result;
}

// Helper to extract {{var}} placeholders from string
function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{\{([^{}]+)\}\}/g) || [];
  return matches.map((m) => m.replace(/[{}]/g, "").trim()).sort();
}

describe("i18n Translation Parity (Passo 16)", () => {
  const flatEn = getFlattenedKeys(en as Record<string, unknown>);
  const flatPt = getFlattenedKeys(pt as Record<string, unknown>);

  it("should have identical translation keys in English and Portuguese", () => {
    const enKeys = Object.keys(flatEn).sort();
    const ptKeys = Object.keys(flatPt).sort();

    const missingInPt = enKeys.filter((k) => !(k in flatPt));
    const missingInEn = ptKeys.filter((k) => !(k in flatEn));

    expect(
      missingInPt,
      `Keys present in en but missing in pt: ${missingInPt.join(", ")}`,
    ).toEqual([]);
    expect(
      missingInEn,
      `Keys present in pt but missing in en: ${missingInEn.join(", ")}`,
    ).toEqual([]);
    expect(enKeys.length).toBe(ptKeys.length);
  });

  it("should have matching interpolation parameters for all translation keys", () => {
    const mismatchedVariables: string[] = [];

    for (const key of Object.keys(flatEn)) {
      const valEn = flatEn[key];
      const valPt = flatPt[key];

      if (typeof valEn === "string" && typeof valPt === "string") {
        const enVars = extractPlaceholders(valEn);
        const ptVars = extractPlaceholders(valPt);

        if (JSON.stringify(enVars) !== JSON.stringify(ptVars)) {
          mismatchedVariables.push(
            `Key: "${key}" -> EN: [${enVars.join(",")}] vs PT: [${ptVars.join(",")}]`,
          );
        }
      }
    }

    expect(
      mismatchedVariables,
      `Interpolation mismatches found:\n${mismatchedVariables.join("\n")}`,
    ).toEqual([]);
  });

  describe("Language normalization and document language sync", () => {
    it("normalizes diverse language variants to 'pt' or 'en'", () => {
      expect(normalizeLanguage("pt")).toBe("pt");
      expect(normalizeLanguage("pt-BR")).toBe("pt");
      expect(normalizeLanguage("PT-br")).toBe("pt");
      expect(normalizeLanguage("en")).toBe("en");
      expect(normalizeLanguage("en-US")).toBe("en");
      expect(normalizeLanguage("EN-gb")).toBe("en");
      expect(normalizeLanguage("")).toBe("en");
      expect(normalizeLanguage(null)).toBe("en");
      expect(normalizeLanguage(undefined)).toBe("en");

      expect(getNormalizedLanguage("pt-BR")).toBe("pt");
      expect(getNormalizedLanguage("en-US")).toBe("en");
      expect(getAppLocale("pt-BR")).toBe("pt-BR");
      expect(getAppLocale("en-US")).toBe("en-US");
    });

    it("syncs document.documentElement.lang correctly", () => {
      syncDocumentLanguage("pt");
      expect(document.documentElement.lang).toBe("pt-BR");

      syncDocumentLanguage("pt-BR");
      expect(document.documentElement.lang).toBe("pt-BR");

      syncDocumentLanguage("en");
      expect(document.documentElement.lang).toBe("en");

      syncDocumentLanguage("en-US");
      expect(document.documentElement.lang).toBe("en");
    });
  });

  describe("translateMealName", () => {
    const mockTranslator = (key: string) => {
      const map: Record<string, string> = {
        "meal_table.breakfast": "Café da Manhã",
        "meal_table.lunch": "Almoço",
        "meal_table.dinner": "Jantar",
        "meal_table.morning_snack": "Lanche da Manhã",
        "meal_table.afternoon_snack": "Lanche da Tarde",
        "meal_table.supper": "Ceia",
      };
      return map[key] || key;
    };

    it("translates meal names from Portuguese or English", () => {
      expect(translateMealName("Café da Manhã", mockTranslator)).toBe(
        "Café da Manhã",
      );
      expect(translateMealName("breakfast", mockTranslator)).toBe(
        "Café da Manhã",
      );
      expect(translateMealName("Lunch", mockTranslator)).toBe("Almoço");
      expect(translateMealName("almoço", mockTranslator)).toBe("Almoço");
      expect(translateMealName("Custom Pre-workout Meal", mockTranslator)).toBe(
        "Custom Pre-workout Meal",
      );
    });
  });

  describe("MealOptionTable bilingual conjunction parsing", () => {
    function parseAmounts(portion: string): string[] {
      return portion
        .replace(/\s+(?:e|and)\s+/gi, ", ")
        .split(/,\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    function parseFoodNames(name: string, count: number): string[] {
      if (count <= 1) return [name];
      const normalized = name.replace(/,?\s+(?:e|and)\s+(?=[^,]+$)/i, ", ");
      const parts = normalized.split(/,\s+/);
      if (parts.length === count) return parts.map((p) => p.trim());
      return [name];
    }

    it("parses Portuguese conjunction 'e'", () => {
      expect(parseAmounts("100g, 200g e 50g")).toEqual(["100g", "200g", "50g"]);
      expect(
        parseFoodNames("Frango grelhado, arroz integral e brócolis", 3),
      ).toEqual(["Frango grelhado", "arroz integral", "brócolis"]);
    });

    it("parses English conjunction 'and'", () => {
      expect(parseAmounts("100g, 200g and 50g")).toEqual([
        "100g",
        "200g",
        "50g",
      ]);
      expect(
        parseFoodNames("Grilled chicken, brown rice and broccoli", 3),
      ).toEqual(["Grilled chicken", "brown rice", "broccoli"]);
    });
  });

  describe("emailService explicit locale", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "test_svc");
      vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "test_tpl");
      vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "test_key");
    });

    it("sends diet email with explicit English locale", async () => {
      await sendDietEmail({
        toEmail: "patient@example.com",
        toName: "Jane Doe",
        fromName: "Dr. Smith",
        dietDate: "2026-09-18",
        locale: "en",
      });

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      const templateParams = callArgs[2];
      expect(templateParams.message).toContain("meal plan");
    });

    it("sends diet email with explicit Portuguese locale", async () => {
      await sendDietEmail({
        toEmail: "paciente@exemplo.com",
        toName: "João Silva",
        fromName: "Dra. Maria",
        dietDate: "2026-09-18",
        locale: "pt",
      });

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      const templateParams = callArgs[2];
      expect(templateParams.message).toContain("plano alimentar");
    });

    it("sends portal access email with explicit English locale", async () => {
      await sendPortalAccessEmail({
        toEmail: "patient@example.com",
        toName: "Jane Doe",
        fromName: "Dr. Smith",
        portalUrl: "https://example.com/portal",
        locale: "en",
      });

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      const templateParams = callArgs[2];
      expect(templateParams.message).toContain("Hello, Jane Doe!");
      expect(templateParams.message).toContain("invited by Dr. Smith");
    });

    it("sends portal access email with explicit Portuguese locale", async () => {
      await sendPortalAccessEmail({
        toEmail: "paciente@exemplo.com",
        toName: "João Silva",
        fromName: "Dra. Maria",
        portalUrl: "https://example.com/portal",
        locale: "pt",
      });

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      const callArgs = (emailjs.send as ReturnType<typeof vi.fn>).mock.calls[0];
      const templateParams = callArgs[2];
      expect(templateParams.message).toContain("Olá, João Silva!");
      expect(templateParams.message).toContain("convidado(a) por Dra. Maria");
    });
  });
});
