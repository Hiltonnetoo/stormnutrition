import type { Food } from "../types";

export type MealArchetype =
  | "breakfast"
  | "morning_snack"
  | "lunch"
  | "afternoon_snack"
  | "dinner"
  | "supper";

export interface ArchetypeSlot {
  name: string;
  role: "P" | "C" | "F";
  preferredCategories: string[];
  fallbackCategories: string[];
  targetMacroRatio: { p: number; c: number; f: number }; // target share in this slot
  isOptional?: boolean;
}

export interface MealArchetypeDefinition {
  archetype: MealArchetype;
  labelPt: string;
  labelEn: string;
  defaultTime: string;
  allowedCategories: string[];
  forbiddenKeywords: string[];
  allowedSpecificKeywords?: string[];
  slots: ArchetypeSlot[];
  defaultPreparationDesc: { pt: string; en: string };
}

const normalize = (str: string): string =>
  (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/**
 * Classifies a meal name and optional time string into a canonical culinary archetype.
 */
export const classifyMealArchetype = (
  mealName: string,
  time?: string,
): MealArchetype => {
  const normName = normalize(mealName);

  // Exact or keyword matching on name
  if (
    normName.includes("cafe") ||
    normName.includes("desjejum") ||
    normName.includes("breakfast") ||
    normName.includes("matinal")
  ) {
    return "breakfast";
  }

  if (
    normName.includes("colacao") ||
    normName.includes("lanche da manha") ||
    normName.includes("morning snack")
  ) {
    return "morning_snack";
  }

  if (
    normName.includes("almoco") ||
    normName.includes("lunch") ||
    normName.includes("refeicao principal 1")
  ) {
    return "lunch";
  }

  if (
    normName.includes("ceia") ||
    normName.includes("supper") ||
    normName.includes("dormir") ||
    normName.includes("pos-jantar")
  ) {
    return "supper";
  }

  if (
    normName.includes("jantar") ||
    normName.includes("janta") ||
    normName.includes("dinner") ||
    normName.includes("noturna")
  ) {
    return "dinner";
  }

  if (
    normName.includes("lanche") ||
    normName.includes("snack") ||
    normName.includes("tarde") ||
    normName.includes("afternoon") ||
    normName.includes("pre-treino") ||
    normName.includes("pos-treino")
  ) {
    return "afternoon_snack";
  }

  // Fallback to time inspection if provided (HH:MM)
  if (time && time.includes(":")) {
    const [hStr] = time.split(":");
    const hour = parseInt(hStr, 10);
    if (!isNaN(hour)) {
      if (hour >= 5 && hour < 10) return "breakfast";
      if (hour >= 10 && hour < 12) return "morning_snack";
      if (hour >= 12 && hour < 15) return "lunch";
      if (hour >= 15 && hour < 19) return "afternoon_snack";
      if (hour >= 19 && hour < 22) return "dinner";
      return "supper";
    }
  }

  return "lunch";
};

/**
 * Meal archetype specifications enforcing culinary realism, valid categories,
 * and eliminating nonsensical pairings (e.g. beans or red meat in breakfast/snacks).
 */
export const MEAL_ARCHETYPES: Record<MealArchetype, MealArchetypeDefinition> = {
  breakfast: {
    archetype: "breakfast",
    labelPt: "Café da Manhã",
    labelEn: "Breakfast",
    defaultTime: "07:30",
    allowedCategories: [
      "Cereais e Derivados",
      "Leite e Derivados",
      "Frutas",
      "Oleaginosas",
      "Óleos e Gorduras",
      "Carnes e Derivados",
    ],
    // Forbid heavy meats, fish and beans at breakfast
    forbiddenKeywords: [
      "arroz",
      "macarrao",
      "quinoa",
      "lombo",
      "linguica",
      "salsicha",
      "peru",
      "bovino",
      "bovina",
      "carne",
      "patinho",
      "alcatra",
      "picanha",
      "frango",
      "peixe",
      "tilapia",
      "salmao",
      "sardinha",
      "atum",
      "feijao",
      "lentilha",
      "grao-de-bico",
    ],
    // Only allow egg from Carnes e Derivados
    allowedSpecificKeywords: ["ovo", "clara", "gema", "omelete"],
    slots: [
      {
        name: "Proteína / Laticínio",
        role: "P",
        preferredCategories: ["Leite e Derivados", "Carnes e Derivados"],
        fallbackCategories: ["Oleaginosas"],
        targetMacroRatio: { p: 0.6, c: 0.2, f: 0.2 },
      },
      {
        name: "Carboidrato / Base",
        role: "C",
        preferredCategories: ["Cereais e Derivados", "Frutas"],
        fallbackCategories: ["Cereais e Derivados"],
        targetMacroRatio: { p: 0.15, c: 0.75, f: 0.1 },
      },
      {
        name: "Gordura Saudável / Acompanhamento",
        role: "F",
        preferredCategories: ["Óleos e Gorduras", "Oleaginosas", "Frutas"],
        fallbackCategories: ["Leite e Derivados"],
        targetMacroRatio: { p: 0.1, c: 0.2, f: 0.7 },
        isOptional: true,
      },
    ],
    defaultPreparationDesc: {
      pt: "Preparação matinal rápida (grelhado, tostado ou in natura)",
      en: "Quick morning preparation (toasted, scrambled or fresh)",
    },
  },

  morning_snack: {
    archetype: "morning_snack",
    labelPt: "Lanche da Manhã",
    labelEn: "Morning Snack",
    defaultTime: "10:30",
    allowedCategories: [
      "Frutas",
      "Leite e Derivados",
      "Oleaginosas",
      "Cereais e Derivados",
    ],
    forbiddenKeywords: [
      "arroz",
      "macarrao",
      "quinoa",
      "lombo",
      "grao-de-bico",
      "ervilha",
      "soja",
      "bovino",
      "bovina",
      "carne",
      "frango",
      "peixe",
      "feijao",
      "azeite",
      "oleo",
      "lentilha",
    ],
    slots: [
      {
        name: "Fruta ou Carboidrato Leve",
        role: "C",
        preferredCategories: ["Frutas", "Cereais e Derivados"],
        fallbackCategories: ["Frutas"],
        targetMacroRatio: { p: 0.1, c: 0.8, f: 0.1 },
      },
      {
        name: "Proteína / Oleaginosa",
        role: "P",
        preferredCategories: ["Leite e Derivados", "Oleaginosas"],
        fallbackCategories: ["Leite e Derivados"],
        targetMacroRatio: { p: 0.5, c: 0.2, f: 0.3 },
      },
    ],
    defaultPreparationDesc: {
      pt: "Consumo prático in natura",
      en: "Fresh and ready to eat",
    },
  },

  lunch: {
    archetype: "lunch",
    labelPt: "Almoço",
    labelEn: "Lunch",
    defaultTime: "12:30",
    allowedCategories: [
      "Carnes e Derivados",
      "Cereais e Derivados",
      "Leguminosas",
      "Verduras e Legumes",
      "Óleos e Gorduras",
    ],
    forbiddenKeywords: [
      "iogurte",
      "leite em po",
      "aveia",
      "granola",
      "achocolatado",
      "pao",
      "torrada",
      "biscoito",
      "bolacha",
      "cereal matinal",
    ],
    slots: [
      {
        name: "Proteína Principal",
        role: "P",
        preferredCategories: ["Carnes e Derivados"],
        fallbackCategories: ["Leguminosas"],
        targetMacroRatio: { p: 0.7, c: 0.05, f: 0.25 },
      },
      {
        name: "Carboidrato Principal",
        role: "C",
        preferredCategories: ["Cereais e Derivados"],
        fallbackCategories: ["Verduras e Legumes"],
        targetMacroRatio: { p: 0.1, c: 0.85, f: 0.05 },
      },
      {
        name: "Leguminosa ou Vegetal",
        role: "C",
        preferredCategories: ["Leguminosas", "Verduras e Legumes"],
        fallbackCategories: ["Verduras e Legumes"],
        targetMacroRatio: { p: 0.3, c: 0.65, f: 0.05 },
        isOptional: true,
      },
      {
        name: "Gordura Saudável (Azeite)",
        role: "F",
        preferredCategories: ["Óleos e Gorduras", "Oleaginosas"],
        fallbackCategories: ["Óleos e Gorduras"],
        targetMacroRatio: { p: 0.0, c: 0.0, f: 1.0 },
      },
    ],
    defaultPreparationDesc: {
      pt: "Grelhado ou cozido com temperos naturais e azeite",
      en: "Grilled or steamed with natural herbs and olive oil",
    },
  },

  afternoon_snack: {
    archetype: "afternoon_snack",
    labelPt: "Lanche da Tarde",
    labelEn: "Afternoon Snack",
    defaultTime: "16:00",
    allowedCategories: [
      "Frutas",
      "Leite e Derivados",
      "Cereais e Derivados",
      "Oleaginosas",
      "Carnes e Derivados",
      "Óleos e Gorduras",
    ],
    forbiddenKeywords: [
      "arroz",
      "macarrao",
      "quinoa",
      "lombo",
      "grao-de-bico",
      "ervilha",
      "soja",
      "linguica",
      "bovino",
      "bovina",
      "carne",
      "patinho",
      "alcatra",
      "peixe",
      "tilapia",
      "salmao",
      "sardinha",
      "atum",
      "frango",
      "feijao",
      "lentilha",
      "arroz cozido",
    ],
    allowedSpecificKeywords: ["ovo", "clara", "frango desfiado"],
    slots: [
      {
        name: "Carboidrato / Fruta",
        role: "C",
        preferredCategories: ["Frutas", "Cereais e Derivados"],
        fallbackCategories: ["Frutas"],
        targetMacroRatio: { p: 0.1, c: 0.8, f: 0.1 },
      },
      {
        name: "Proteína / Laticínio",
        role: "P",
        preferredCategories: ["Leite e Derivados", "Carnes e Derivados"],
        fallbackCategories: ["Oleaginosas"],
        targetMacroRatio: { p: 0.55, c: 0.2, f: 0.25 },
      },
      {
        name: "Oleaginosa / Gordura",
        role: "F",
        preferredCategories: ["Oleaginosas", "Óleos e Gorduras"],
        fallbackCategories: ["Oleaginosas"],
        targetMacroRatio: { p: 0.15, c: 0.15, f: 0.7 },
        isOptional: true,
      },
    ],
    defaultPreparationDesc: {
      pt: "Consumo prático ou lanche tostado leve",
      en: "Convenient snack or lightly toasted sandwich",
    },
  },

  dinner: {
    archetype: "dinner",
    labelPt: "Jantar",
    labelEn: "Dinner",
    defaultTime: "19:30",
    allowedCategories: [
      "Carnes e Derivados",
      "Cereais e Derivados",
      "Verduras e Legumes",
      "Óleos e Gorduras",
      "Leguminosas",
    ],
    forbiddenKeywords: [
      "pao",
      "cereal",
      "iogurte",
      "leite em po",
      "aveia",
      "granola",
      "achocolatado",
      "torrada",
      "biscoito",
      "bolacha",
      "cereal matinal",
    ],
    slots: [
      {
        name: "Proteína Magra",
        role: "P",
        preferredCategories: ["Carnes e Derivados"],
        fallbackCategories: ["Leguminosas"],
        targetMacroRatio: { p: 0.75, c: 0.05, f: 0.2 },
      },
      {
        name: "Carboidrato / Tubérculo",
        role: "C",
        preferredCategories: ["Cereais e Derivados"],
        fallbackCategories: ["Verduras e Legumes"],
        targetMacroRatio: { p: 0.1, c: 0.85, f: 0.05 },
      },
      {
        name: "Legumes / Vegetais",
        role: "C",
        preferredCategories: ["Verduras e Legumes"],
        fallbackCategories: ["Verduras e Legumes"],
        targetMacroRatio: { p: 0.2, c: 0.75, f: 0.05 },
        isOptional: true,
      },
      {
        name: "Gordura Saudável (Azeite)",
        role: "F",
        preferredCategories: ["Óleos e Gorduras"],
        fallbackCategories: ["Óleos e Gorduras"],
        targetMacroRatio: { p: 0.0, c: 0.0, f: 1.0 },
      },
    ],
    defaultPreparationDesc: {
      pt: "Preparo leve grelhado ou no vapor com azeite",
      en: "Light grilled or steamed dinner with olive oil",
    },
  },

  supper: {
    archetype: "supper",
    labelPt: "Ceia",
    labelEn: "Supper",
    defaultTime: "22:00",
    allowedCategories: [
      "Leite e Derivados",
      "Oleaginosas",
      "Frutas",
      "Bebidas",
      "Cereais e Derivados",
    ],
    forbiddenKeywords: [
      "macarrao",
      "quinoa",
      "lentilha",
      "grao-de-bico",
      "ervilha",
      "soja",
      "carne",
      "frango",
      "peixe",
      "ovo",
      "feijao",
      "azeite",
      "arroz",
      "batata",
    ],
    slots: [
      {
        name: "Laticínio / Proteína Noturna",
        role: "P",
        preferredCategories: ["Leite e Derivados"],
        fallbackCategories: ["Oleaginosas"],
        targetMacroRatio: { p: 0.5, c: 0.3, f: 0.2 },
      },
      {
        name: "Oleaginosa ou Fruta Leve",
        role: "F",
        preferredCategories: ["Oleaginosas", "Frutas"],
        fallbackCategories: ["Frutas"],
        targetMacroRatio: { p: 0.15, c: 0.25, f: 0.6 },
      },
    ],
    defaultPreparationDesc: {
      pt: "Preparo leve e digestivo para o repouso noturno",
      en: "Light and digestive snack before night rest",
    },
  },
};

/**
 * Checks whether a given food is culinarily suitable for a meal archetype.
 */
const LIGHT_MEAL_ARCHETYPES: MealArchetype[] = [
  "breakfast",
  "morning_snack",
  "afternoon_snack",
  "supper",
];

export const isFoodSuitableForArchetype = (
  food: Food,
  archetype: MealArchetype,
): boolean => {
  const def = MEAL_ARCHETYPES[archetype];
  if (!def) return true;

  // 1. Check allowed categories
  if (!def.allowedCategories.includes(food.category)) {
    return false;
  }

  const normName = normalize(food.name);

  // A2: at breakfast and snacks the meat category is allowed only for the
  // listed exceptions (eggs; "frango desfiado" in the afternoon snack).
  // Keyword blocklists alone let pork loin or cold cuts through.
  if (
    food.category === "Carnes e Derivados" &&
    LIGHT_MEAL_ARCHETYPES.includes(archetype)
  ) {
    return (def.allowedSpecificKeywords ?? []).some((kw) =>
      normName.includes(normalize(kw)),
    );
  }

  // 2. Check forbidden keywords
  const hasForbidden = def.forbiddenKeywords.some((kw) =>
    normName.includes(normalize(kw)),
  );
  if (hasForbidden) {
    // If specific allowed keywords exist (e.g. egg at breakfast), check exemption
    if (def.allowedSpecificKeywords && def.allowedSpecificKeywords.length > 0) {
      const isExempt = def.allowedSpecificKeywords.some((kw) =>
        normName.includes(normalize(kw)),
      );
      if (isExempt) return true;
    }
    return false;
  }

  return true;
};
