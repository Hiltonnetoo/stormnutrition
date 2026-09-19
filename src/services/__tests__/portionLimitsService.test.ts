import { describe, it, expect } from "vitest";
import {
  clampPortion,
  formatHouseholdMeasure,
  getPortionBoundaries,
} from "../portionLimitsService";
import type { Food } from "../../types";

const mockFood = (partial: Partial<Food>): Food => ({
  id: "test",
  name: "Alimento Teste",
  category: "Cereais e Derivados",
  portion: "100",
  unit: "g",
  calories: 100,
  protein: 5,
  carbs: 20,
  fat: 1,
  fiber: 2,
  sodium: 10,
  ...partial,
});

describe("portionLimitsService", () => {
  describe("getPortionBoundaries and clampPortion", () => {
    it("strictly clamps olive oil between 5g and 20g/ml (never 93g or 450g)", () => {
      const azeite = mockFood({
        name: "Azeite de oliva extra virgem",
        category: "Óleos e Gorduras",
      });
      const bounds = getPortionBoundaries(azeite);
      expect(bounds.minGrams).toBe(5);
      expect(bounds.maxGrams).toBe(20);

      expect(clampPortion(azeite, 100)).toBe(20);
      expect(clampPortion(azeite, 2)).toBe(5);
      expect(clampPortion(azeite, 12)).toBe(12);
    });

    it("clamps meat portions between 60g and 200g", () => {
      const frango = mockFood({
        name: "Peito de frango grelhado",
        category: "Carnes e Derivados",
      });
      expect(clampPortion(frango, 450)).toBe(200);
      expect(clampPortion(frango, 30)).toBe(60);
      expect(clampPortion(frango, 130)).toBe(130);
    });

    it("clamps nuts between 10g and 40g", () => {
      const castanha = mockFood({
        name: "Castanha-do-pará",
        category: "Oleaginosas",
      });
      expect(clampPortion(castanha, 120)).toBe(40);
      expect(clampPortion(castanha, 5)).toBe(10);
      expect(clampPortion(castanha, 25)).toBe(25);
    });
  });

  describe("formatHouseholdMeasure", () => {
    // A5: the measure follows the catalog's reference (15 ml = 1 colher de
    // sopa) and the standard spoons (chá 5 ml, sobremesa 10 ml). The old
    // expectation assumed an 8 ml tablespoon, contradicting the catalog.
    it("formats olive oil in ml with standard spoons", () => {
      const azeite = mockFood({
        name: "Azeite de oliva",
        category: "Óleos e Gorduras",
        portion: "15",
        unit: "ml (1 colher de sopa)",
      });
      expect(formatHouseholdMeasure(azeite, 5)).toBe("5ml (1 colher de chá)");
      expect(formatHouseholdMeasure(azeite, 10)).toBe(
        "10ml (1 colher de sobremesa)",
      );
      expect(formatHouseholdMeasure(azeite, 15)).toBe(
        "15ml (1 colher de sopa)",
      );
      expect(formatHouseholdMeasure(azeite, 20)).toBe(
        "20ml (1 e 1/2 colheres de sopa)",
      );
    });

    it("never shows solid fats in ml and scales catalog references", () => {
      const banha = mockFood({
        name: "Banha de porco",
        category: "Óleos e Gorduras",
        portion: "15",
        unit: "g (1 colher de sopa)",
      });
      expect(formatHouseholdMeasure(banha, 14)).toBe("14g (1 colher de sopa)");
      const creme = mockFood({
        name: "Creme de leite",
        category: "Leite e Derivados",
        portion: "15",
        unit: "g (1 colher de sopa)",
      });
      expect(formatHouseholdMeasure(creme, 100)).toBe(
        "100g (6 e 1/2 colheres de sopa)",
      );
      const castanha = mockFood({
        name: "Castanha-do-pará",
        category: "Oleaginosas",
        portion: "15",
        unit: "g (3 unidades)",
      });
      expect(formatHouseholdMeasure(castanha, 10)).toBe("10g (2 unidades)");
      const maca = mockFood({
        name: "Maçã",
        category: "Frutas",
        portion: "100",
        unit: "g",
      });
      expect(formatHouseholdMeasure(maca, 65)).toBe("65g (1/2 unidade média)");
      const leite = mockFood({
        name: "Leite desnatado",
        category: "Leite e Derivados",
        portion: "200",
        unit: "ml",
      });
      expect(formatHouseholdMeasure(leite, 300)).toBe("300ml (1 e 1/2 copos)");
    });

    it("formats eggs with unit counts", () => {
      const ovo = mockFood({
        name: "Ovo de galinha cozido",
        category: "Carnes e Derivados",
      });
      expect(formatHouseholdMeasure(ovo, 50)).toContain("50g (1 unidade)");
      expect(formatHouseholdMeasure(ovo, 100)).toContain("100g (2 unidades)");
    });

    it("formats cooked rice and beans with spoons and ladles", () => {
      const arroz = mockFood({
        name: "Arroz branco cozido",
        category: "Cereais e Derivados",
      });
      const feijao = mockFood({
        name: "Feijão carioca cozido",
        category: "Leguminosas",
      });
      expect(formatHouseholdMeasure(arroz, 120)).toContain(
        "120g (4 colheres de sopa)",
      );
      expect(formatHouseholdMeasure(feijao, 80)).toContain(
        "80g (1 concha média)",
      );
    });
  });
});
