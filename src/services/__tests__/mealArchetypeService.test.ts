import { describe, it, expect } from "vitest";
import {
  classifyMealArchetype,
  isFoodSuitableForArchetype,
  MEAL_ARCHETYPES,
} from "../mealArchetypeService";
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

describe("mealArchetypeService", () => {
  describe("classifyMealArchetype", () => {
    it("correctly identifies breakfast from Portuguese and English names", () => {
      expect(classifyMealArchetype("Café da Manhã")).toBe("breakfast");
      expect(classifyMealArchetype("Desjejum")).toBe("breakfast");
      expect(classifyMealArchetype("Breakfast")).toBe("breakfast");
      expect(classifyMealArchetype("Refeição Matinal")).toBe("breakfast");
    });

    it("correctly identifies lunch", () => {
      expect(classifyMealArchetype("Almoço")).toBe("lunch");
      expect(classifyMealArchetype("Lunch")).toBe("lunch");
      expect(classifyMealArchetype("Refeição Principal 1")).toBe("lunch");
    });

    it("correctly identifies snacks and supper", () => {
      expect(classifyMealArchetype("Colação")).toBe("morning_snack");
      expect(classifyMealArchetype("Lanche da Manhã")).toBe("morning_snack");
      expect(classifyMealArchetype("Lanche da Tarde")).toBe("afternoon_snack");
      expect(classifyMealArchetype("Snack Tarde")).toBe("afternoon_snack");
      expect(classifyMealArchetype("Pré-treino")).toBe("afternoon_snack");
      expect(classifyMealArchetype("Jantar")).toBe("dinner");
      expect(classifyMealArchetype("Dinner")).toBe("dinner");
      expect(classifyMealArchetype("Ceia")).toBe("supper");
      expect(classifyMealArchetype("Supper")).toBe("supper");
    });

    it("uses time of day as fallback when name is generic", () => {
      expect(classifyMealArchetype("Refeição 1", "07:30")).toBe("breakfast");
      expect(classifyMealArchetype("Refeição 2", "10:30")).toBe(
        "morning_snack",
      );
      expect(classifyMealArchetype("Refeição 3", "13:00")).toBe("lunch");
      expect(classifyMealArchetype("Refeição 4", "16:30")).toBe(
        "afternoon_snack",
      );
      expect(classifyMealArchetype("Refeição 5", "20:00")).toBe("dinner");
      expect(classifyMealArchetype("Refeição 6", "22:30")).toBe("supper");
    });
  });

  describe("isFoodSuitableForArchetype", () => {
    it("forbids beans and heavy red meat at breakfast", () => {
      const feijao = mockFood({
        name: "Feijão carioca, cozido",
        category: "Leguminosas",
      });
      const patinho = mockFood({
        name: "Carne bovina, patinho moído",
        category: "Carnes e Derivados",
      });
      const ovo = mockFood({
        name: "Ovo de galinha cozido",
        category: "Carnes e Derivados",
      });
      const pao = mockFood({
        name: "Pão francês",
        category: "Cereais e Derivados",
      });

      expect(isFoodSuitableForArchetype(feijao, "breakfast")).toBe(false);
      expect(isFoodSuitableForArchetype(patinho, "breakfast")).toBe(false);
      expect(isFoodSuitableForArchetype(ovo, "breakfast")).toBe(true);
      expect(isFoodSuitableForArchetype(pao, "breakfast")).toBe(true);
    });

    it("forbids heavy meats and beans at afternoon snack", () => {
      const tilapia = mockFood({
        name: "Filé de tilápia grelhado",
        category: "Carnes e Derivados",
      });
      const iogurte = mockFood({
        name: "Iogurte natural",
        category: "Leite e Derivados",
      });
      const banana = mockFood({
        name: "Banana prata",
        category: "Frutas",
      });

      expect(isFoodSuitableForArchetype(tilapia, "afternoon_snack")).toBe(
        false,
      );
      expect(isFoodSuitableForArchetype(iogurte, "afternoon_snack")).toBe(true);
      expect(isFoodSuitableForArchetype(banana, "afternoon_snack")).toBe(true);
    });

    it("allows appropriate lunch components (meat, rice, beans, olive oil)", () => {
      const frango = mockFood({
        name: "Peito de frango grelhado",
        category: "Carnes e Derivados",
      });
      const arroz = mockFood({
        name: "Arroz branco, cozido",
        category: "Cereais e Derivados",
      });
      const feijao = mockFood({
        name: "Feijão preto, cozido",
        category: "Leguminosas",
      });
      const azeite = mockFood({
        name: "Azeite de oliva extra virgem",
        category: "Óleos e Gorduras",
      });

      expect(isFoodSuitableForArchetype(frango, "lunch")).toBe(true);
      expect(isFoodSuitableForArchetype(arroz, "lunch")).toBe(true);
      expect(isFoodSuitableForArchetype(feijao, "lunch")).toBe(true);
      expect(isFoodSuitableForArchetype(azeite, "lunch")).toBe(true);
    });

    it("defines canonical archetypes with slots and descriptions", () => {
      const expectedArchetypes = [
        "breakfast",
        "morning_snack",
        "lunch",
        "afternoon_snack",
        "dinner",
        "supper",
      ];
      for (const arch of expectedArchetypes) {
        const def = MEAL_ARCHETYPES[arch as keyof typeof MEAL_ARCHETYPES];
        expect(def).toBeDefined();
        expect(def.slots.length).toBeGreaterThan(0);
        expect(def.defaultPreparationDesc.pt).toBeTruthy();
        expect(def.defaultPreparationDesc.en).toBeTruthy();
      }
    });
  });
});
