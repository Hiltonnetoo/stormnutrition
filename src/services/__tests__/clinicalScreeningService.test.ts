import { describe, it, expect } from "vitest";
import {
  parseAllergies,
  buildUnifiedClinicalContext,
  evaluateFoodCompatibility,
  matchFoodAllergen,
} from "../clinicalScreeningService";
import type { Food } from "../../types";

const mockFood = (partial: Partial<Food>): Food => ({
  id: "f_test",
  name: "Alimento Teste",
  category: "Cereais e Derivados",
  portion: "100g",
  unit: "g",
  calories: 100,
  protein: 2,
  carbs: 20,
  fat: 1,
  fiber: 2,
  sodium: 50,
  ...partial,
});

describe("clinicalScreeningService", () => {
  describe("parseAllergies", () => {
    it("parses comma/semicolon/and separated text into normalized tokens", () => {
      expect(parseAllergies("Amendoim, Camarão e Leite; Glúten")).toEqual([
        "amendoim",
        "camarao",
        "leite",
        "gluten",
      ]);
    });

    it("returns empty array for empty or whitespace input", () => {
      expect(parseAllergies("")).toEqual([]);
      expect(parseAllergies(undefined)).toEqual([]);
      expect(parseAllergies(null)).toEqual([]);
    });

    it("handles array inputs cleanly", () => {
      expect(parseAllergies(["Castanhas", "Soja"])).toEqual(["castanhas", "soja"]);
    });
  });

  describe("buildUnifiedClinicalContext", () => {
    it("synchronizes clinicalTags and dietaryRestrictions bidirectionally", () => {
      const ctx1 = buildUnifiedClinicalContext({
        clinicalTags: ["hypertension"],
      });
      expect(ctx1.restrictions).toContain("hypertension");

      const ctx2 = buildUnifiedClinicalContext({
        restrictions: ["diabetes"],
      });
      expect(ctx2.clinicalTags).toContain("diabetes_t2");
    });

    it("derives strict restrictions from food allergies", () => {
      const ctx = buildUnifiedClinicalContext({
        foodAllergies: "alergia a leite e derivados",
      });
      expect(ctx.restrictions).toContain("dairy_free");
      expect(ctx.restrictions).toContain("lactose_free");
      expect(ctx.foodAllergies).toContain("leite");
    });
  });

  describe("matchFoodAllergen", () => {
    it("matches direct keywords and synonyms", () => {
      const peanutButter = mockFood({
        name: "Pasta de amendoim integral",
        category: "Oleaginosas",
      });
      expect(matchFoodAllergen(peanutButter, "amendoim").matches).toBe(true);

      const cheese = mockFood({
        name: "Queijo Minas Frescal",
        category: "Leite e Derivados",
      });
      expect(matchFoodAllergen(cheese, "leite").matches).toBe(true);
    });

    it("matches seafood and crustaceans", () => {
      const shrimp = mockFood({
        name: "Camarão cozido",
        category: "Carnes e Derivados",
      });
      expect(matchFoodAllergen(shrimp, "frutos do mar").matches).toBe(true);
      expect(matchFoodAllergen(shrimp, "camarao").matches).toBe(true);
    });
  });

  describe("evaluateFoodCompatibility", () => {
    it("flags allergy violation as incompatible", () => {
      const peanut = mockFood({ name: "Amendoim torrado", category: "Oleaginosas" });
      const ctx = buildUnifiedClinicalContext({ foodAllergies: "amendoim" });
      const res = evaluateFoodCompatibility(peanut, ctx);

      expect(res.status).toBe("incompatible");
      expect(res.code).toBe("ALLERGY_VIOLATION");
    });

    it("flags hypertension high sodium as incompatible", () => {
      const saltyFood = mockFood({ name: "Carne seca salgada", sodium: 800 });
      const ctx = buildUnifiedClinicalContext({ clinicalTags: ["hypertension"] });
      const res = evaluateFoodCompatibility(saltyFood, ctx);

      expect(res.status).toBe("incompatible");
      expect(res.code).toBe("HYPERTENSION_VIOLATION");
    });

    it("flags diabetes sugar food as incompatible", () => {
      const candy = mockFood({ name: "Doce de leite", category: "Açúcares e Doces" });
      const ctx = buildUnifiedClinicalContext({ clinicalTags: ["diabetes_t2"] });
      const res = evaluateFoodCompatibility(candy, ctx);

      expect(res.status).toBe("incompatible");
      expect(res.code).toBe("DIABETES_VIOLATION");
    });

    it("returns compatible for safe foods", () => {
      const apple = mockFood({
        name: "Maçã Fuji",
        category: "Frutas",
        sodium: 2,
        glycemicIndex: 38,
      });
      const ctx = buildUnifiedClinicalContext({
        clinicalTags: ["hypertension", "diabetes_t2"],
        foodAllergies: "amendoim",
      });
      const res = evaluateFoodCompatibility(apple, ctx);

      expect(res.status).toBe("compatible");
    });
  });
});
