import { describe, it, expect } from "vitest";
import type { Food } from "../../types";
import {
  getNovaGroup,
  getNovaInfo,
  getAvailableCarbs,
  glycemicLoad,
  giLevel,
  glLevel,
  NOVA_LABELS,
  foodContainsGluten,
  foodContainsLactose,
  foodContainsDairy,
  foodIsVegetarian,
  foodIsVegan,
  isFoodCompatibleWithRestrictions,
} from "../foodService";

/** Builds a Food with sane defaults so each test only sets what it asserts. */
const food = (overrides: Partial<Food>): Food => ({
  id: "t",
  name: "Test",
  category: "Cereais e Derivados",
  portion: "100",
  unit: "g",
  calories: 100,
  protein: 1,
  carbs: 20,
  fat: 1,
  fiber: 1,
  sodium: 1,
  ...overrides,
});

describe("foodService — NOVA classification", () => {
  it("respects an explicit novaGroup over inference", () => {
    expect(getNovaGroup(food({ novaGroup: 2, category: "Frutas" }))).toBe(2);
  });

  it("flags ultraprocessed foods by name hint", () => {
    expect(
      getNovaGroup(
        food({ name: "Salsicha de frango", category: "Carnes e Derivados" }),
      ),
    ).toBe(4);
    expect(
      getNovaGroup(food({ name: "Refrigerante de cola", category: "Bebidas" })),
    ).toBe(4);
    expect(
      getNovaGroup(
        food({ name: "Margarina cremosa", category: "Óleos e Gorduras" }),
      ),
    ).toBe(4);
  });

  it("classifies whole/minimally processed foods as NOVA 1", () => {
    expect(getNovaGroup(food({ name: "Maçã", category: "Frutas" }))).toBe(1);
    expect(
      getNovaGroup(
        food({ name: "Arroz integral", category: "Cereais e Derivados" }),
      ),
    ).toBe(1);
    expect(
      getNovaGroup(food({ name: "Lentilha cozida", category: "Leguminosas" })),
    ).toBe(1);
    expect(
      getNovaGroup(
        food({ name: "Peito de frango", category: "Carnes e Derivados" }),
      ),
    ).toBe(1);
    expect(
      getNovaGroup(
        food({ name: "Leite integral", category: "Leite e Derivados" }),
      ),
    ).toBe(1);
  });

  it("classifies bread/biscuits in cereals as processed (NOVA 3)", () => {
    expect(
      getNovaGroup(
        food({ name: "Pão francês", category: "Cereais e Derivados" }),
      ),
    ).toBe(3);
    expect(
      getNovaGroup(
        food({ name: "Torrada integral", category: "Cereais e Derivados" }),
      ),
    ).toBe(3);
  });

  it("classifies cheese/yogurt (dairy, not milk) as processed (NOVA 3)", () => {
    expect(
      getNovaGroup(
        food({ name: "Queijo minas frescal", category: "Leite e Derivados" }),
      ),
    ).toBe(3);
  });

  it("classifies culinary oils as NOVA 2 and butter as NOVA 3", () => {
    expect(
      getNovaGroup(
        food({ name: "Azeite de oliva", category: "Óleos e Gorduras" }),
      ),
    ).toBe(2);
    expect(
      getNovaGroup(
        food({ name: "Manteiga com sal", category: "Óleos e Gorduras" }),
      ),
    ).toBe(3);
  });

  it("classifies refined sugars/sweets", () => {
    expect(
      getNovaGroup(
        food({ name: "Açúcar refinado", category: "Açúcares e Doces" }),
      ),
    ).toBe(2);
    expect(
      getNovaGroup(
        food({ name: "Doce de abóbora", category: "Açúcares e Doces" }),
      ),
    ).toBe(4);
  });

  it("classifies anything in Industrializados as ultraprocessed", () => {
    expect(
      getNovaGroup(
        food({ name: "Lasanha congelada", category: "Industrializados" }),
      ),
    ).toBe(4);
  });

  it("treats Preparações (home-cooked dishes) as processed (NOVA 3)", () => {
    expect(
      getNovaGroup(food({ name: "Feijoada", category: "Preparações" })),
    ).toBe(3);
  });

  it("exposes a label and tone for every NOVA group", () => {
    ([1, 2, 3, 4] as const).forEach((g) => {
      expect(NOVA_LABELS[g].short).toBeTruthy();
      expect(NOVA_LABELS[g].full).toBeTruthy();
      expect(NOVA_LABELS[g].tone).toContain("bg-");
    });
  });
});

describe("foodService — glycemic load", () => {
  it("computes available carbs as total carbs minus fiber (never negative)", () => {
    expect(getAvailableCarbs(food({ carbs: 30, fiber: 9 }))).toBe(21);
    expect(getAvailableCarbs(food({ carbs: 2, fiber: 5 }))).toBe(0);
  });

  it("computes glycemic load as GI × available carbs ÷ 100", () => {
    // GI 55, carbs 66, fiber 9 -> avail 57 -> 55*57/100 = 31.35 -> 31
    expect(glycemicLoad(food({ glycemicIndex: 55, carbs: 66, fiber: 9 }))).toBe(
      31,
    );
  });

  it("returns undefined glycemic load when GI is unknown", () => {
    expect(glycemicLoad(food({ glycemicIndex: undefined }))).toBeUndefined();
  });

  it("classifies glycemic index into low/medium/high bands", () => {
    expect(giLevel(50)).toBe("low");
    expect(giLevel(60)).toBe("medium");
    expect(giLevel(80)).toBe("high");
    expect(giLevel(undefined)).toBeNull();
  });

  it("classifies glycemic load into low/medium/high bands", () => {
    expect(glLevel(8)).toBe("low");
    expect(glLevel(15)).toBe("medium");
    expect(glLevel(25)).toBe("high");
    expect(glLevel(undefined)).toBeNull();
  });
});

describe("foodService — NOVA provenance (explicit vs inferred)", () => {
  it("marks NOVA group origin as explicit when provided on food", () => {
    const res = getNovaInfo(food({ novaGroup: 1, novaOrigin: "explicit" }));
    expect(res.group).toBe(1);
    expect(res.origin).toBe("explicit");
  });

  it("marks NOVA group origin as inferred when calculated from heuristics", () => {
    const res = getNovaInfo(
      food({ name: "Maçã", category: "Frutas", novaGroup: undefined }),
    );
    expect(res.group).toBe(1);
    expect(res.origin).toBe("inferred");
  });
});

describe("foodService — Dietary Restrictions Detection", () => {
  it("detects gluten accurately with explicit overrides and heuristics", () => {
    // Explicit override
    expect(
      foodContainsGluten(
        food({
          name: "Bolo especial",
          restrictions: { containsGluten: false },
        }),
      ),
    ).toBe(false);

    // Heuristics
    expect(foodContainsGluten(food({ name: "Pão de trigo" }))).toBe(true);
    expect(foodContainsGluten(food({ name: "Macarrão espaguete" }))).toBe(true);
    expect(foodContainsGluten(food({ name: "Cerveja pilsen" }))).toBe(true);
    expect(foodContainsGluten(food({ name: "Arroz branco" }))).toBe(false);
  });

  it("detects lactose accurately with zero-lactose / plant exceptions", () => {
    expect(
      foodContainsLactose(
        food({ name: "Leite desnatado", category: "Leite e Derivados" }),
      ),
    ).toBe(true);
    expect(
      foodContainsLactose(
        food({ name: "Leite zero lactose", category: "Leite e Derivados" }),
      ),
    ).toBe(false);
    expect(
      foodContainsLactose(
        food({ name: "Bebida de aveia", category: "Bebidas" }),
      ),
    ).toBe(false);
  });

  it("distinguishes dairy (cow's milk protein / APLV) from lactose", () => {
    // Zero lactose dairy still contains cow's milk protein
    const zeroLactoseMilk = food({
      name: "Leite zero lactose",
      category: "Leite e Derivados",
    });
    expect(foodContainsLactose(zeroLactoseMilk)).toBe(false);
    expect(foodContainsDairy(zeroLactoseMilk)).toBe(true);

    // Plant based milk has neither lactose nor dairy
    const soyMilk = food({
      name: "Leite de soja",
      category: "Bebidas",
    });
    expect(foodContainsLactose(soyMilk)).toBe(false);
    expect(foodContainsDairy(soyMilk)).toBe(false);
  });

  it("detects vegetarian and vegan foods correctly", () => {
    expect(
      foodIsVegetarian(
        food({ name: "Patinho grelhado", category: "Carnes e Derivados" }),
      ),
    ).toBe(false);
    expect(
      foodIsVegetarian(
        food({ name: "Salmão assado", category: "Carnes e Derivados" }),
      ),
    ).toBe(false);
    expect(
      foodIsVegetarian(
        food({ name: "Ovo mexido", category: "Carnes e Derivados" }),
      ),
    ).toBe(true);
    expect(
      foodIsVegetarian(
        food({ name: "Queijo coalho", category: "Leite e Derivados" }),
      ),
    ).toBe(true);

    // Vegan
    expect(
      foodIsVegan(food({ name: "Ovo mexido", category: "Carnes e Derivados" })),
    ).toBe(false);
    expect(
      foodIsVegan(food({ name: "Iogurte", category: "Leite e Derivados" })),
    ).toBe(false);
    expect(
      foodIsVegan(
        food({ name: "Mel de abelha", category: "Açúcares e Doces" }),
      ),
    ).toBe(false);
    expect(foodIsVegan(food({ name: "Tofu", category: "Leguminosas" }))).toBe(
      true,
    );
    expect(
      foodIsVegan(
        food({ name: "Arroz integral", category: "Cereais e Derivados" }),
      ),
    ).toBe(true);
  });

  it("enforces conservative safety policy for unknown metadata in high-risk categories", () => {
    // A food in Cereais without explicit containsGluten metadata must be rejected under gluten_free
    const unknownCereal = food({
      name: "Mingau misterioso",
      category: "Cereais e Derivados",
      restrictions: undefined,
    });
    expect(
      isFoodCompatibleWithRestrictions(unknownCereal, ["gluten_free"])
        .compatible,
    ).toBe(false);

    // But an explicit containsGluten: false cereal is accepted
    const safeCereal = food({
      name: "Arroz branco",
      category: "Cereais e Derivados",
      restrictions: { containsGluten: false },
    });
    expect(
      isFoodCompatibleWithRestrictions(safeCereal, ["gluten_free"]).compatible,
    ).toBe(true);

    // An in-natura fruit without explicit metadata is safe by category nature
    const banana = food({
      name: "Banana prata",
      category: "Frutas",
      restrictions: undefined,
    });
    expect(
      isFoodCompatibleWithRestrictions(banana, ["gluten_free"]).compatible,
    ).toBe(true);
  });
});
