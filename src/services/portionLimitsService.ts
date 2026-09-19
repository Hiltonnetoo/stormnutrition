import type { Food } from "../types";

export interface PortionBoundary {
  minGrams: number;
  maxGrams: number;
  defaultServingGrams: number;
  isLiquid?: boolean;
}

const normalize = (str: string): string =>
  (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/**
 * Returns realistic physiological and culinary portion bounds for a food.
 */
export const getPortionBoundaries = (food: Food): PortionBoundary => {
  const normName = normalize(food.name);
  const category = food.category;

  // 1. Specific food checks
  if (
    category === "Óleos e Gorduras" ||
    normName.includes("azeite") ||
    normName.includes("oleo")
  ) {
    return {
      minGrams: 5,
      maxGrams: 20,
      defaultServingGrams: 10,
      isLiquid: true,
    };
  }

  if (
    normName.includes("manteiga") ||
    normName.includes("margarina") ||
    normName.includes("requeijao")
  ) {
    return {
      minGrams: 5,
      maxGrams: 30,
      defaultServingGrams: 15,
    };
  }

  if (
    category === "Oleaginosas" ||
    normName.includes("castanha") ||
    normName.includes("noz") ||
    normName.includes("amendoim")
  ) {
    return {
      minGrams: 10,
      maxGrams: 40,
      defaultServingGrams: 20,
    };
  }

  if (normName.includes("ovo") || normName.includes("omelete")) {
    return {
      minGrams: 50, // 1 egg
      maxGrams: 200, // up to 4 eggs
      defaultServingGrams: 100, // 2 eggs
    };
  }

  if (
    normName.includes("queijo") ||
    normName.includes("ricota") ||
    normName.includes("cottage")
  ) {
    return {
      minGrams: 20,
      maxGrams: 70,
      defaultServingGrams: 35,
    };
  }

  if (normName.includes("leite") || normName.includes("iogurte")) {
    return {
      minGrams: 100,
      maxGrams: 250,
      defaultServingGrams: 170,
      isLiquid: true,
    };
  }

  if (category === "Carnes e Derivados") {
    return {
      minGrams: 60,
      maxGrams: 200,
      defaultServingGrams: 120,
    };
  }

  if (
    category === "Leguminosas" ||
    normName.includes("feijao") ||
    normName.includes("lentilha") ||
    normName.includes("grao-de-bico")
  ) {
    return {
      minGrams: 40,
      maxGrams: 160,
      defaultServingGrams: 80,
    };
  }

  if (normName.includes("pao")) {
    return {
      minGrams: 25,
      maxGrams: 80,
      defaultServingGrams: 50,
    };
  }

  if (normName.includes("tapioca")) {
    return {
      minGrams: 30,
      maxGrams: 80,
      defaultServingGrams: 50,
    };
  }

  if (normName.includes("aveia")) {
    return {
      minGrams: 15,
      maxGrams: 50,
      defaultServingGrams: 30,
    };
  }

  if (category === "Cereais e Derivados") {
    return {
      minGrams: 50,
      maxGrams: 220,
      defaultServingGrams: 120,
    };
  }

  if (category === "Frutas") {
    return {
      minGrams: 60,
      maxGrams: 200,
      defaultServingGrams: 110,
    };
  }

  if (category === "Verduras e Legumes") {
    return {
      minGrams: 30,
      maxGrams: 180,
      defaultServingGrams: 80,
    };
  }

  // General fallback
  const parsedDefault = Number(food.portion) || 100;
  return {
    minGrams: 10,
    maxGrams: 300,
    defaultServingGrams: parsedDefault,
  };
};

/**
 * Clamps portion strictly within realistic boundaries for the specific food.
 */
export const clampPortion = (food: Food, rawGrams: number): number => {
  const bounds = getPortionBoundaries(food);
  const clamped = Math.max(
    bounds.minGrams,
    Math.min(bounds.maxGrams, rawGrams),
  );
  return Math.round(clamped);
};

/**
 * Formats portion grams with friendly Brazilian household measures (medidas caseiras).
 */
/* A5 — household measures derived from the quantity, never a fixed label.
   Quantities are rounded to the nearest half and pluralized. */
const SINGULAR: Record<string, string> = {
  colheres: "colher",
  unidades: "unidade",
  fatias: "fatia",
  copos: "copo",
  xicaras: "xícara",
  xícaras: "xícara",
  conchas: "concha",
  potes: "pote",
  medias: "média",
  médias: "média",
  pequenas: "pequena",
  grandes: "grande",
};
const PLURAL: Record<string, string> = {
  colher: "colheres",
  unidade: "unidades",
  fatia: "fatias",
  copo: "copos",
  xícara: "xícaras",
  concha: "conchas",
  pote: "potes",
  média: "médias",
  médio: "médios",
  pequena: "pequenas",
  pequeno: "pequenos",
  grande: "grandes",
};
const formatHalf = (value: number): { text: string; plural: boolean } => {
  const q = Math.max(0.5, Math.round(value * 2) / 2);
  const whole = Math.floor(q);
  const half = q - whole >= 0.5;
  const text = whole === 0 ? "1/2" : half ? `${whole} e 1/2` : `${whole}`;
  return { text, plural: q > 1 };
};
const householdLabel = (label: string, quantity: number): string => {
  // Below one tablespoon (15 ml/g reference), use the smaller standard
  // spoons: colher de chá = 5, colher de sobremesa = 10.
  if (label === "colher de sopa" && quantity < 0.75) {
    return quantity * 15 <= 7.5
      ? householdLabel("colher de chá", quantity * 3)
      : householdLabel("colher de sobremesa", quantity * 1.5);
  }
  const words = label.split(" ").map((w) => SINGULAR[w] ?? w);
  const { text, plural } = formatHalf(quantity);
  const shown = plural ? words.map((w) => PLURAL[w] ?? w) : words;
  return `${text} ${shown.join(" ")}`;
};
/** "(N label)" of the catalog unit, e.g. "ml (1 colher de sopa)". */
const catalogReference = (food: Food) => {
  const match = /\(([\d.,]+)\s+([^)]+)\)/.exec(food.unit || "");
  const base = Number(food.portion);
  if (!match || !base) return null;
  return {
    count: Number(match[1].replace(",", ".")),
    label: match[2].trim(),
    base,
  };
};
/** Solid fats are weighed in grams even if listed near the oils. */
const isSolidFat = (normName: string) =>
  normName.includes("manteiga") ||
  normName.includes("margarina") ||
  normName.includes("banha");
const isLiquidUnit = (food: Food) => /^ml\b/i.test((food.unit || "").trim());
/** Reference weights (g) of one medium unit or slice for common fruits. */
const FRUIT_UNIT_GRAMS: [string, number, string][] = [
  ["banana", 70, "unidade média"],
  ["maca", 130, "unidade média"],
  ["pera", 130, "unidade média"],
  ["laranja", 150, "unidade média"],
  ["tangerina", 135, "unidade média"],
  ["mamao", 100, "fatia média"],
  ["melancia", 200, "fatia média"],
  ["abacaxi", 75, "fatia média"],
  ["manga", 140, "unidade pequena"],
  ["morango", 12, "unidade"],
  ["uva", 8, "unidade"],
  ["abacate", 100, "colher de sopa cheia"],
];

export const formatHouseholdMeasure = (food: Food, grams: number): string => {
  const normName = normalize(food.name);
  const rounded = Math.round(grams);
  const liquid = isLiquidUnit(food) && !isSolidFat(normName);
  const unit = liquid ? "ml" : "g";

  // Butter/margarine without a catalog reference keep the practical labels
  if (isSolidFat(normName) && !catalogReference(food)) {
    if (rounded <= 8) return `${rounded}g (1 ponta de faca)`;
    if (rounded <= 15) return `${rounded}g (1 colher de sobremesa rasa)`;
    return `${rounded}g (${householdLabel("colher de sobremesa", rounded / 10)})`;
  }

  // The catalog's own reference, scaled to the quantity (oils: 15 ml =
  // 1 colher de sopa; creme de leite: 15 g = 1 colher de sopa; nuts…)
  const ref = catalogReference(food);
  if (ref) {
    return `${rounded}${unit} (${householdLabel(ref.label, (ref.count * rounded) / ref.base)})`;
  }

  // Oils listed in grams: shown in ml (density 0.92 g/ml), 15 ml per spoon
  if (normName.includes("azeite") || normName.includes("oleo")) {
    const ml = Math.round(rounded / 0.92);
    return `${ml}ml (${householdLabel("colher de sopa", ml / 15)})`;
  }

  // Eggs
  if (normName.includes("ovo") && !normName.includes("clara")) {
    const units = Math.max(1, Math.round(rounded / 50));
    return `${rounded}g (${units} ${units === 1 ? "unidade" : "unidades"})`;
  }

  // Bread
  if (normName.includes("pao frances")) {
    const units = Math.max(0.5, Math.round((rounded / 50) * 2) / 2);
    return `${rounded}g (${units} ${units === 1 ? "unidade" : "unidades"})`;
  }
  if (
    normName.includes("pao") &&
    (normName.includes("forma") || normName.includes("integral"))
  ) {
    const slices = Math.max(1, Math.round(rounded / 25));
    return `${rounded}g (${slices} ${slices === 1 ? "fatia" : "fatias"})`;
  }

  // Cheese
  if (
    normName.includes("queijo minas") ||
    normName.includes("queijo branco") ||
    normName.includes("ricota")
  ) {
    const slices = Math.max(1, Math.round(rounded / 30));
    return `${rounded}g (${slices} ${slices === 1 ? "fatia média" : "fatias médias"})`;
  }
  if (normName.includes("mussarela") || normName.includes("prato")) {
    const slices = Math.max(1, Math.round(rounded / 20));
    return `${rounded}g (${slices} ${slices === 1 ? "fatia" : "fatias"})`;
  }

  // Rice
  if (normName.includes("arroz")) {
    return `${rounded}g (${householdLabel("colher de sopa", rounded / 30)})`;
  }

  // Beans
  if (food.category === "Leguminosas" || normName.includes("feijao")) {
    if (rounded <= 50) return `${rounded}g (1/2 concha)`;
    if (rounded <= 90) return `${rounded}g (1 concha média)`;
    if (rounded <= 130) return `${rounded}g (1 concha cheia)`;
    return `${rounded}g (2 conchas)`;
  }

  // Oats
  if (normName.includes("aveia")) {
    const spoons = Math.max(1, Math.round(rounded / 15));
    return `${rounded}g (${spoons} ${spoons === 1 ? "colher de sopa" : "colheres de sopa"})`;
  }

  // Yogurt
  if (normName.includes("iogurte")) {
    if (rounded <= 130) return `${rounded}g (1 pote pequeno)`;
    if (rounded <= 180) return `${rounded}g (1 pote padrão)`;
    return `${rounded}g (1 copo)`;
  }

  // Meats
  if (food.category === "Carnes e Derivados") {
    if (rounded <= 90) return `${rounded}g (1 filé pequeno)`;
    if (rounded <= 140) return `${rounded}g (1 filé médio)`;
    return `${rounded}g (1 filé grande)`;
  }

  // Fruits: units or slices from the reference weight of each fruit
  if (food.category === "Frutas") {
    const fruit = FRUIT_UNIT_GRAMS.find(([key]) => normName.includes(key));
    if (fruit)
      return `${rounded}g (${householdLabel(fruit[2], rounded / fruit[1])})`;
  }

  // Nuts
  if (food.category === "Oleaginosas") {
    const spoons = Math.max(1, Math.round(rounded / 15));
    return `${rounded}g (${spoons} ${spoons === 1 ? "colher de sopa" : "colheres de sopa"})`;
  }

  // Liquids without a catalog reference: glasses of 200 ml
  if (liquid) return `${rounded}ml (${householdLabel("copo", rounded / 200)})`;

  return `${rounded}${unit}`;
};
