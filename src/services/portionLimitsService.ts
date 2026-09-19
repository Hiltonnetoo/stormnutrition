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
  if (category === "Óleos e Gorduras" || normName.includes("azeite") || normName.includes("oleo")) {
    return {
      minGrams: 5,
      maxGrams: 20,
      defaultServingGrams: 10,
      isLiquid: true,
    };
  }

  if (normName.includes("manteiga") || normName.includes("margarina") || normName.includes("requeijao")) {
    return {
      minGrams: 5,
      maxGrams: 30,
      defaultServingGrams: 15,
    };
  }

  if (category === "Oleaginosas" || normName.includes("castanha") || normName.includes("noz") || normName.includes("amendoim")) {
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

  if (normName.includes("queijo") || normName.includes("ricota") || normName.includes("cottage")) {
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

  if (category === "Leguminosas" || normName.includes("feijao") || normName.includes("lentilha") || normName.includes("grao-de-bico")) {
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
  const clamped = Math.max(bounds.minGrams, Math.min(bounds.maxGrams, rawGrams));
  return Math.round(clamped);
};

/**
 * Formats portion grams with friendly Brazilian household measures (medidas caseiras).
 */
export const formatHouseholdMeasure = (food: Food, grams: number): string => {
  const normName = normalize(food.name);
  const rounded = Math.round(grams);

  // Oils
  if (food.category === "Óleos e Gorduras" || normName.includes("azeite") || normName.includes("oleo")) {
    if (rounded <= 7) return `${rounded}ml (1 colher de sobremesa)`;
    if (rounded <= 12) return `${rounded}ml (1 colher de sopa)`;
    return `${rounded}ml (1 colher de sopa e meia)`;
  }

  // Butter
  if (normName.includes("manteiga") || normName.includes("margarina")) {
    if (rounded <= 8) return `${rounded}g (1 ponta de faca)`;
    if (rounded <= 15) return `${rounded}g (1 colher de sobremesa rasa)`;
    return `${rounded}g (1 colher de sobremesa)`;
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
  if (normName.includes("pao") && (normName.includes("forma") || normName.includes("integral"))) {
    const slices = Math.max(1, Math.round(rounded / 25));
    return `${rounded}g (${slices} ${slices === 1 ? "fatia" : "fatias"})`;
  }

  // Cheese
  if (normName.includes("queijo minas") || normName.includes("queijo branco") || normName.includes("ricota")) {
    const slices = Math.max(1, Math.round(rounded / 30));
    return `${rounded}g (${slices} ${slices === 1 ? "fatia média" : "fatias médias"})`;
  }
  if (normName.includes("mussarela") || normName.includes("prato")) {
    const slices = Math.max(1, Math.round(rounded / 20));
    return `${rounded}g (${slices} ${slices === 1 ? "fatia" : "fatias"})`;
  }

  // Rice
  if (normName.includes("arroz")) {
    const spoons = Math.max(1, Math.round(rounded / 30));
    return `${rounded}g (${spoons} colheres de sopa)`;
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

  // Fruits
  if (food.category === "Frutas") {
    if (normName.includes("banana") || normName.includes("maca") || normName.includes("pera") || normName.includes("laranja")) {
      return `${rounded}g (1 unidade média)`;
    }
    if (normName.includes("mamao") || normName.includes("melancia") || normName.includes("abacaxi")) {
      return `${rounded}g (1 fatia média)`;
    }
  }

  // Nuts
  if (food.category === "Oleaginosas") {
    const spoons = Math.max(1, Math.round(rounded / 15));
    return `${rounded}g (${spoons} ${spoons === 1 ? "colher de sopa" : "colheres de sopa"})`;
  }

  return `${rounded}${food.unit || "g"}`;
};
