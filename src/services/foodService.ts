import i18n from "../i18n";
import { brazilianFoods } from "../data/foods";
import type { Food, NovaGroup, NovaClassificationOrigin } from "../types";

/* ============================================================================
   Classificação NOVA (processamento) + Carga Glicêmica
   ========================================================================== */

export const NOVA_LABELS = {
  get 1() {
    return {
      short: i18n.t("food.nova_labels.1_short"),
      full: i18n.t("food.nova_labels.1_full"),
      tone: "bg-emerald-50 text-emerald-700",
    };
  },
  get 2() {
    return {
      short: i18n.t("food.nova_labels.2_short"),
      full: i18n.t("food.nova_labels.2_full"),
      tone: "bg-sky-50 text-sky-700",
    };
  },
  get 3() {
    return {
      short: i18n.t("food.nova_labels.3_short"),
      full: i18n.t("food.nova_labels.3_full"),
      tone: "bg-amber-50 text-amber-700",
    };
  },
  get 4() {
    return {
      short: i18n.t("food.nova_labels.4_short"),
      full: i18n.t("food.nova_labels.4_full"),
      tone: "bg-rose-50 text-rose-700",
    };
  },
} as Record<NovaGroup, { short: string; full: string; tone: string }>;

export const getFoodName = (food: Food): string => {
  return i18n.language === "en" && food.nameEn ? food.nameEn : food.name;
};

export const getFoodCategoryName = (category: string): string => {
  return i18n.t(`food.categories.${category}`, { defaultValue: category });
};

const ULTRAPROCESSED_HINTS = [
  "refrigerante",
  "salgadinho",
  "biscoito recheado",
  "bolacha recheada",
  "nugget",
  "empanado",
  "salsicha",
  "mortadela",
  "presunto",
  "linguiça",
  "bacon",
  "miojo",
  "macarrão instantâneo",
  "margarina",
  "achocolatado",
  "gelatina",
  "sorvete",
  "barra de cereal",
  "cereal matinal",
  "energético",
  "suco em pó",
  "ketchup",
  "catchup",
  "maionese",
  "molho pronto",
  "tempero pronto",
  "embutido",
  "hambúrguer",
  "leite condensado",
  "chocolate",
  "bombom",
  "bala",
  "chiclete",
];

/**
 * Infers the NOVA group of a food from the explicit `novaGroup` field
 * or, in its absence, by a category + name heuristic. Used both in
 * the Foods screen and by the generator (which excludes NOVA 4).
 */
export const getNovaGroup = (food: Food): NovaGroup => {
  if (food.novaGroup) return food.novaGroup;
  const n = food.name.toLowerCase();
  if (ULTRAPROCESSED_HINTS.some((u) => n.includes(u))) return 4;

  switch (food.category) {
    case "Industrializados":
      return 4;
    case "Açúcares e Doces":
      return n.includes("açúcar") || n.includes("mel") || n.includes("rapadura")
        ? 2
        : 4;
    case "Bebidas":
      if (
        n.includes("água") ||
        n.includes("café") ||
        n.includes("chá") ||
        n.includes("suco natural") ||
        n.includes("suco de")
      )
        return 1;
      if (
        n.includes("refrigerante") ||
        n.includes("energético") ||
        n.includes("isotônico")
      )
        return 4;
      return 3;
    case "Óleos e Gorduras":
      if (n.includes("manteiga")) return 3;
      return 2; // oil, olive oil, lard
    case "Leite e Derivados":
      if (n.includes("leite") && !n.includes("condensado")) return 1;
      return 3; // cheese, yogurt, creamy cheese
    case "Cereais e Derivados":
      if (
        n.includes("pão") ||
        n.includes("biscoito") ||
        n.includes("bolacha") ||
        n.includes("torrada")
      )
        return 3;
      return 1; // rice, oats, cornmeal, corn
    case "Preparações":
      return 3;
    case "Carnes e Derivados":
    case "Frutas":
    case "Verduras e Legumes":
    case "Leguminosas":
    case "Oleaginosas":
    default:
      return 1;
  }
};

export interface NovaInfo {
  group: NovaGroup;
  origin: NovaClassificationOrigin;
  description: string;
}

/**
 * Returns the NOVA group along with its provenance (explicit from database vs inferred by heuristic).
 */
export const getNovaInfo = (food: Food): NovaInfo => {
  if (food.novaGroup) {
    return {
      group: food.novaGroup,
      origin: food.novaOrigin || "explicit",
      description: `Classificação oficial ${food.novaGroup} (${food.source || "Base oficial"})`,
    };
  }
  const inferred = getNovaGroup(food);
  return {
    group: inferred,
    origin: "inferred",
    description: `Classificação ${inferred} inferida por categoria e composição`,
  };
};

/* ============================================================================
   Verificação de Restrições Alimentares e Alergênicos
   ========================================================================== */

const PLANT_MILK_HINTS = [
  "leite de coco",
  "leite de amêndoa",
  "leite de amêndoas",
  "leite de soja",
  "leite de arroz",
  "leite de aveia",
  "queijo vegano",
  "queijo de castanha",
];

const GLUTEN_HINTS = [
  "trigo",
  "centeio",
  "cevada",
  "malte",
  "pão",
  "macarrão",
  "biscoito",
  "bolacha",
  "torrada",
  "cerveja",
  "pizza",
  "farinha de trigo",
  "lasanha",
  "panqueca",
  "pastel",
  "croissant",
  "bolo",
  "torta",
  "empada",
  "esfiha",
  "quibe",
];

const MEAT_HINTS = [
  "carne",
  "frango",
  "peixe",
  "bife",
  "salmão",
  "tilápia",
  "atum",
  "linguiça",
  "bacon",
  "presunto",
  "porco",
  "salsicha",
  "camarão",
  "lombo",
  "peru",
  "costela",
  "hambúrguer",
  "patinho",
  "alcatra",
  "filé mignon",
  "peito de frango",
];

/**
 * Checks if a food contains gluten.
 * Follows conservative safety policy: missing metadata in grain/preparation/industrial categories
 * is treated as containing gluten to protect celiac patients.
 */
export const foodContainsGluten = (food: Food): boolean => {
  if (food.restrictions?.containsGluten !== undefined) {
    return food.restrictions.containsGluten;
  }

  const name = food.name.toLowerCase();
  if (GLUTEN_HINTS.some((hint) => name.includes(hint))) {
    return true;
  }

  // Safe raw categories
  if (
    food.category === "Frutas" ||
    food.category === "Verduras e Legumes" ||
    food.category === "Leguminosas" ||
    food.category === "Carnes e Derivados" ||
    food.category === "Oleaginosas" ||
    food.category === "Óleos e Gorduras"
  ) {
    return false;
  }

  // Cereal derivatives check
  if (food.category === "Cereais e Derivados") {
    // Naturally gluten-free grains
    if (
      name.includes("arroz") ||
      name.includes("milho") ||
      name.includes("tapioca") ||
      name.includes("cuscuz") ||
      name.includes("quinoa") ||
      name.includes("mandioca") ||
      name.includes("polvilho")
    ) {
      return false;
    }
    // High-risk unverified cereal is treated as containing gluten
    return true;
  }

  return false;
};

/**
 * Checks if a food contains lactose.
 * Does NOT confuse lactose with cow's milk protein (APLV):
 * items labeled "zero lactose" or naturally aged cheeses with 0g lactose return false.
 */
export const foodContainsLactose = (food: Food): boolean => {
  if (food.restrictions?.containsLactose !== undefined) {
    return food.restrictions.containsLactose;
  }

  const name = food.name.toLowerCase();
  if (PLANT_MILK_HINTS.some((p) => name.includes(p))) {
    return false;
  }

  if (name.includes("zero lactose") || name.includes("sem lactose")) {
    return false;
  }

  // Aged cheeses with negligible lactose
  if (name.includes("parmesão") || name.includes("provolone curado")) {
    return false;
  }

  if (food.category === "Leite e Derivados") {
    return true;
  }

  if (
    name.includes("leite") ||
    name.includes("queijo") ||
    name.includes("iogurte") ||
    name.includes("requeijão") ||
    name.includes("creme de leite") ||
    name.includes("manteiga")
  ) {
    return true;
  }

  return false;
};

/**
 * Checks if a food contains dairy/cow's milk protein (for APLV).
 * Any product with milk protein is true, even if 100% lactose-free.
 */
export const foodContainsDairy = (food: Food): boolean => {
  if (food.restrictions?.containsDairy !== undefined) {
    return food.restrictions.containsDairy;
  }

  const name = food.name.toLowerCase();
  if (PLANT_MILK_HINTS.some((p) => name.includes(p))) {
    return false;
  }

  if (food.category === "Leite e Derivados") {
    return true;
  }

  if (
    name.includes("leite") ||
    name.includes("queijo") ||
    name.includes("iogurte") ||
    name.includes("requeijão") ||
    name.includes("creme de leite") ||
    name.includes("manteiga") ||
    name.includes("soro de leite") ||
    name.includes("caseína")
  ) {
    return true;
  }

  return false;
};

/**
 * Checks if a food is vegetarian (no meat, poultry, fish, seafood).
 */
export const foodIsVegetarian = (food: Food): boolean => {
  if (food.restrictions?.isVegetarian !== undefined) {
    return food.restrictions.isVegetarian;
  }

  const name = food.name.toLowerCase();

  // Eggs are vegetarian (ovo-lacto) even when categorized under 'Carnes e Derivados' (TACO group 4)
  if (
    name.includes("ovo") ||
    name.includes("clara de ovo") ||
    name.includes("gema de ovo")
  ) {
    return true;
  }

  if (food.category === "Carnes e Derivados") {
    return false;
  }

  if (MEAT_HINTS.some((hint) => name.includes(hint))) {
    return false;
  }

  return true;
};

/**
 * Checks if a food is vegan (no meat, dairy, eggs, honey).
 */
export const foodIsVegan = (food: Food): boolean => {
  if (food.restrictions?.isVegan !== undefined) {
    return food.restrictions.isVegan;
  }

  if (!foodIsVegetarian(food)) return false;
  if (foodContainsDairy(food)) return false;

  const name = food.name.toLowerCase();
  if (
    name.includes("ovo") ||
    name.includes("mel") ||
    name.includes("gelatina")
  ) {
    return false;
  }

  return true;
};

/**
 * Validates whether a food item is compatible with an active list of patient restrictions.
 */
export const isFoodCompatibleWithRestrictions = (
  food: Food,
  restrictions: string[] = [],
): { compatible: boolean; reason?: string } => {
  for (const r of restrictions) {
    if (r === "gluten_free" && foodContainsGluten(food)) {
      return { compatible: false, reason: "Contém glúten" };
    }
    if (r === "lactose_free" && foodContainsLactose(food)) {
      return { compatible: false, reason: "Contém lactose" };
    }
    if (r === "dairy_free" && foodContainsDairy(food)) {
      return { compatible: false, reason: "Contém derivados de leite (APLV)" };
    }
    if (r === "vegetarian" && !foodIsVegetarian(food)) {
      return { compatible: false, reason: "Contém carnes ou pescados" };
    }
    if (r === "vegan" && !foodIsVegan(food)) {
      return { compatible: false, reason: "Contém derivados de origem animal" };
    }
    if (r === "hypertension" && food.sodium >= 300) {
      return { compatible: false, reason: "Sódio elevado (> 300mg)" };
    }
    if (
      r === "diabetes" &&
      (food.category === "Açúcares e Doces" ||
        (food.glycemicIndex !== undefined && food.glycemicIndex >= 70))
    ) {
      return { compatible: false, reason: "Açúcares simples / Alto IG" };
    }
  }

  return { compatible: true };
};

/** Available carbohydrate (total - fiber), basis of glycemic load. */
export const getAvailableCarbs = (food: Food): number =>
  Math.max(0, food.carbs - (food.fiber || 0));

/** Glycemic Load of the listed portion = GI * available carb / 100. */
export const glycemicLoad = (food: Food): number | undefined => {
  if (food.glycemicIndex == null) return undefined;
  return Math.round((food.glycemicIndex * getAvailableCarbs(food)) / 100);
};

export type GlycemicLevel = "low" | "medium" | "high";

export const giLevel = (gi?: number): GlycemicLevel | null => {
  if (gi == null) return null;
  if (gi <= 55) return "low";
  if (gi <= 69) return "medium";
  return "high";
};

export const glLevel = (gl?: number): GlycemicLevel | null => {
  if (gl == null) return null;
  if (gl <= 10) return "low";
  if (gl <= 19) return "medium";
  return "high";
};

export const GLYCEMIC_TONE: Record<GlycemicLevel, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
};

export const GLYCEMIC_LABEL = {
  get low() {
    return i18n.t("food.glycemic_label.low");
  },
  get medium() {
    return i18n.t("food.glycemic_label.medium");
  },
  get high() {
    return i18n.t("food.glycemic_label.high");
  },
} as Record<GlycemicLevel, string>;

export const foodCategories = [
  "Cereais e Derivados",
  "Verduras e Legumes",
  "Frutas",
  "Carnes e Derivados",
  "Leite e Derivados",
  "Leguminosas",
  "Oleaginosas",
  "Óleos e Gorduras",
  "Açúcares e Doces",
  "Industrializados",
  "Bebidas",
  "Preparações",
];

/**
 * Retrieves all foods belonging to a specific category.
 * @param category The category to filter by.
 * @returns An array of Food objects.
 */
export const getFoodsByCategory = (category: string): Food[] => {
  return brazilianFoods.filter((food) => food.category === category);
};

/**
 * Searches for foods by name.
 * @param query The search term.
 * @returns An array of Food objects that match the query.
 */
export const searchFoods = (query: string): Food[] => {
  if (!query) return [];
  const lowercasedQuery = query.toLowerCase();
  return brazilianFoods.filter(
    (food) =>
      food.name.toLowerCase().includes(lowercasedQuery) ||
      (food.nameEn && food.nameEn.toLowerCase().includes(lowercasedQuery)),
  );
};

/**
 * Retrieves a single food by its unique ID.
 * @param id The ID of the food to retrieve.
 * @returns A Food object or undefined if not found.
 */
export const getFoodById = (id: string): Food | undefined => {
  return brazilianFoods.find((food) => food.id === id);
};

export interface NutrientTotals {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSodium: number;
}

/**
 * Calculates the total nutritional values for a list of foods and their quantities.
 * @param items An array of objects, each containing a Food object and the quantity in portions.
 * @returns An object with the summed nutritional values.
 */
export const calculateNutrition = (
  items: { food: Food; quantity: number }[],
): NutrientTotals => {
  const totals: NutrientTotals = {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSodium: 0,
  };

  items.forEach((item) => {
    totals.totalCalories += item.food.calories * item.quantity;
    totals.totalProtein += item.food.protein * item.quantity;
    totals.totalCarbs += item.food.carbs * item.quantity;
    totals.totalFat += item.food.fat * item.quantity;
    totals.totalFiber += item.food.fiber * item.quantity;
    totals.totalSodium += item.food.sodium * item.quantity;
  });

  // Rounding to 2 decimal places for cleaner display
  for (const key in totals) {
    totals[key as keyof NutrientTotals] = parseFloat(
      totals[key as keyof NutrientTotals].toFixed(2),
    );
  }

  return totals;
};
