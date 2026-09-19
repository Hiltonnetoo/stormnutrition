import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import i18n from "../../i18n";
import pt from "../pt/common.json";
import en from "../en/common.json";

// R07 (criterion 4): every alert code the algorithm can emit has a PT and an
// EN message, and the message interpolates its parameters (no "{{max}}" or
// raw code reaches the UI or the PDF, which both use this same key).
const source = readFileSync(
  resolve(__dirname, "../../services/dietAlgorithmService.ts"),
  "utf8",
);
const emitted = new Set(
  // Validation issues only (decision-log codes are not user messages).
  [
    ...source.matchAll(/issues\.push\(\{[^}]*?code: "([A-Z_]+)"/gs),
    ...source.matchAll(/"((?:WORST_CASE|ZERO_TARGET)_[A-Z_]+)"/g),
  ].map((m) => m[1]),
);

const issues = (locale: typeof pt) =>
  (locale as unknown as { diet_validation: { issues: Record<string, string> } })
    .diet_validation.issues;

describe("diet validation messages (R07)", () => {
  it("finds the emitted codes", () => {
    for (const code of [
      "WORST_CASE_PROTEIN_DEVIATION",
      "WORST_CASE_CARBS_DEVIATION",
      "WORST_CASE_FAT_DEVIATION",
      "ZERO_TARGET_FAT",
    ]) {
      expect(emitted.has(code), code).toBe(true);
    }
  });

  it.each([...emitted])("%s has PT and EN text", (code) => {
    expect(issues(pt)[code], `pt: ${code}`).toBeTruthy();
    expect(issues(en)[code], `en: ${code}`).toBeTruthy();
  });

  it("interpolates combined-macro parameters in both languages", async () => {
    for (const lng of ["pt", "en"]) {
      await i18n.changeLanguage(lng);
      const text = i18n.t(
        "diet_validation.issues.WORST_CASE_PROTEIN_DEVIATION",
        {
          min: 119,
          max: 124,
          target: 100,
        },
      );
      expect(text).toMatch(/119/);
      expect(text).toMatch(/124/);
      expect(text).toMatch(/100/);
      expect(text).not.toMatch(/\{\{|WORST_CASE/);
      const zero = i18n.t("diet_validation.issues.ZERO_TARGET_FAT", { max: 3 });
      expect(zero).toMatch(/3 g/);
      expect(zero).not.toMatch(/\{\{/);
    }
  });
});
