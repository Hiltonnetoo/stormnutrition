import i18n from "../i18n";
import { brazilianFoods } from "../data/foods";
import type {
  Food,
  NovaGroup,
  NovaClassificationOrigin,
  RestrictionEvaluation,
  FoodCompatibilityResult,
} from "../types";

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
 * Evaluates compatibility of a food with a specific dietary restriction or clinical requirement.
 * Returns a 3-state evaluation:
 * - "compatible": verified safe (explicit metadata or safe food category)
 * - "incompatible": explicit violation or high-risk classification
 * - "unknown": missing metadata / unclassified preparation requiring professional review
 */
export const evaluateFoodRestriction = (
  food: Food,
  restriction: string,
): RestrictionEvaluation => {
  const name = (food.name || "").toLowerCase();

  switch (restriction) {
    case "gluten_free": {
      if (food.restrictions?.containsGluten !== undefined) {
        return food.restrictions.containsGluten
          ? {
              status: "incompatible",
              reason: "Contém glúten",
              source: "explicit_metadata",
            }
          : { status: "compatible", source: "explicit_metadata" };
      }

      if (GLUTEN_HINTS.some((hint) => name.includes(hint))) {
        return {
          status: "incompatible",
          reason: "Contém glúten identificado no nome",
          source: "name_heuristic",
        };
      }

      if (
        name.includes("empanad") ||
        name.includes("milanesa") ||
        name.includes("shoyu") ||
        name.includes("molho de soja")
      ) {
        return {
          status: "incompatible",
          reason: "Preparação com provável presença de glúten/farinha",
          source: "name_heuristic",
        };
      }

      if (food.category === "Cereais e Derivados") {
        if (
          name.includes("arroz") ||
          name.includes("milho") ||
          name.includes("tapioca") ||
          name.includes("cuscuz") ||
          name.includes("quinoa") ||
          name.includes("mandioca") ||
          name.includes("polvilho")
        ) {
          return { status: "compatible", source: "name_heuristic" };
        }
        return {
          status: "incompatible",
          reason: "Cereal de alto risco sem comprovação de ausência de glúten",
          source: "category_heuristic",
        };
      }

      if (
        food.category === "Frutas" ||
        food.category === "Verduras e Legumes" ||
        food.category === "Leguminosas" ||
        food.category === "Carnes e Derivados" ||
        food.category === "Oleaginosas" ||
        food.category === "Óleos e Gorduras"
      ) {
        return { status: "compatible", source: "category_heuristic" };
      }

      return {
        status: "unknown",
        reason: "Ausência de metadados para verificação de glúten",
        source: "unknown_fallback",
      };
    }

    case "lactose_free": {
      if (food.restrictions?.containsLactose !== undefined) {
        return food.restrictions.containsLactose
          ? {
              status: "incompatible",
              reason: "Contém lactose",
              source: "explicit_metadata",
            }
          : { status: "compatible", source: "explicit_metadata" };
      }

      if (PLANT_MILK_HINTS.some((p) => name.includes(p))) {
        return { status: "compatible", source: "name_heuristic" };
      }

      if (name.includes("zero lactose") || name.includes("sem lactose")) {
        return { status: "compatible", source: "name_heuristic" };
      }

      if (name.includes("parmesão") || name.includes("provolone curado")) {
        return { status: "compatible", source: "name_heuristic" };
      }

      if (food.category === "Leite e Derivados") {
        return {
          status: "incompatible",
          reason: "Derivado lácteo com lactose",
          source: "category_heuristic",
        };
      }

      if (
        name.includes("leite") ||
        name.includes("queijo") ||
        name.includes("iogurte") ||
        name.includes("requeijão") ||
        name.includes("creme de leite") ||
        name.includes("manteiga")
      ) {
        return {
          status: "incompatible",
          reason: "Derivado lácteo identificado no nome",
          source: "name_heuristic",
        };
      }

      if (
        food.category === "Frutas" ||
        food.category === "Verduras e Legumes" ||
        food.category === "Leguminosas" ||
        food.category === "Carnes e Derivados" ||
        food.category === "Cereais e Derivados" ||
        food.category === "Oleaginosas" ||
        food.category === "Óleos e Gorduras" ||
        food.category === "Bebidas"
      ) {
        return { status: "compatible", source: "category_heuristic" };
      }

      return {
        status: "unknown",
        reason: "Ausência de metadados para verificação de lactose",
        source: "unknown_fallback",
      };
    }

    case "dairy_free": {
      if (food.restrictions?.containsDairy !== undefined) {
        return food.restrictions.containsDairy
          ? {
              status: "incompatible",
              reason: "Contém derivados de leite (APLV)",
              source: "explicit_metadata",
            }
          : { status: "compatible", source: "explicit_metadata" };
      }

      if (PLANT_MILK_HINTS.some((p) => name.includes(p))) {
        return { status: "compatible", source: "name_heuristic" };
      }

      if (food.category === "Leite e Derivados") {
        return {
          status: "incompatible",
          reason: "Derivado lácteo (contém proteína do leite de vaca)",
          source: "category_heuristic",
        };
      }

      if (
        name.includes("leite") ||
        name.includes("queijo") ||
        name.includes("iogurte") ||
        name.includes("requeijão") ||
        name.includes("creme de leite") ||
        name.includes("manteiga") ||
        name.includes("soro de leite") ||
        name.includes("caseína") ||
        name.includes("whey")
      ) {
        return {
          status: "incompatible",
          reason: "Contém derivados de leite de vaca (APLV)",
          source: "name_heuristic",
        };
      }

      if (
        food.category === "Frutas" ||
        food.category === "Verduras e Legumes" ||
        food.category === "Leguminosas" ||
        food.category === "Oleaginosas" ||
        food.category === "Óleos e Gorduras" ||
        food.category === "Carnes e Derivados" ||
        food.category === "Cereais e Derivados" ||
        food.category === "Bebidas"
      ) {
        return { status: "compatible", source: "category_heuristic" };
      }

      return {
        status: "unknown",
        reason:
          "Ausência de metadados para verificação de APLV (proteína do leite)",
        source: "unknown_fallback",
      };
    }

    case "vegetarian": {
      if (food.restrictions?.isVegetarian !== undefined) {
        return food.restrictions.isVegetarian === false
          ? {
              status: "incompatible",
              reason: "Contém carnes ou pescados",
              source: "explicit_metadata",
            }
          : { status: "compatible", source: "explicit_metadata" };
      }

      if (
        name.includes("ovo") ||
        name.includes("clara de ovo") ||
        name.includes("gema de ovo")
      ) {
        return { status: "compatible", source: "name_heuristic" };
      }

      if (food.category === "Carnes e Derivados") {
        return {
          status: "incompatible",
          reason: "Contém carnes ou pescados",
          source: "category_heuristic",
        };
      }

      if (MEAT_HINTS.some((hint) => name.includes(hint))) {
        return {
          status: "incompatible",
          reason: "Contém carnes ou pescados",
          source: "name_heuristic",
        };
      }

      if (
        food.category === "Frutas" ||
        food.category === "Verduras e Legumes" ||
        food.category === "Leguminosas" ||
        food.category === "Cereais e Derivados" ||
        food.category === "Oleaginosas" ||
        food.category === "Óleos e Gorduras" ||
        food.category === "Leite e Derivados" ||
        food.category === "Bebidas" ||
        food.category === "Açúcares e Doces"
      ) {
        return { status: "compatible", source: "category_heuristic" };
      }

      return {
        status: "unknown",
        reason:
          "Preparação sem lista de ingredientes verificada para vegetarianismo",
        source: "unknown_fallback",
      };
    }

    case "vegan": {
      if (food.restrictions?.isVegan !== undefined) {
        return food.restrictions.isVegan === false
          ? {
              status: "incompatible",
              reason: "Contém derivados de origem animal",
              source: "explicit_metadata",
            }
          : { status: "compatible", source: "explicit_metadata" };
      }

      const vegEval = evaluateFoodRestriction(food, "vegetarian");
      if (vegEval.status === "incompatible") {
        return {
          status: "incompatible",
          reason: vegEval.reason || "Contém carnes ou pescados",
          source: vegEval.source,
        };
      }

      const dairyEval = evaluateFoodRestriction(food, "dairy_free");
      if (dairyEval.status === "incompatible") {
        return {
          status: "incompatible",
          reason: dairyEval.reason || "Contém derivados de leite",
          source: dairyEval.source,
        };
      }

      if (
        name.includes("ovo") ||
        name.includes("mel") ||
        name.includes("gelatina")
      ) {
        return {
          status: "incompatible",
          reason: "Contém ovos, mel ou gelatina",
          source: "name_heuristic",
        };
      }

      if (
        food.category === "Frutas" ||
        food.category === "Verduras e Legumes" ||
        food.category === "Leguminosas" ||
        food.category === "Oleaginosas" ||
        food.category === "Cereais e Derivados"
      ) {
        return { status: "compatible", source: "category_heuristic" };
      }

      if (food.category === "Óleos e Gorduras") {
        if (name.includes("manteiga") || name.includes("banha")) {
          return {
            status: "incompatible",
            reason: "Gordura de origem animal",
            source: "name_heuristic",
          };
        }
        return { status: "compatible", source: "category_heuristic" };
      }

      return {
        status: "unknown",
        reason: "Preparação sem comprovação de ausência de derivados animais",
        source: "unknown_fallback",
      };
    }

    case "hypertension": {
      if (food.sodium !== undefined && Number.isFinite(food.sodium)) {
        return food.sodium >= 300
          ? {
              status: "incompatible",
              reason: "Sódio elevado (>= 300mg/porção)",
              source: "explicit_metadata",
            }
          : { status: "compatible", source: "explicit_metadata" };
      }
      return {
        status: "unknown",
        reason: "Teor de sódio não informado",
        source: "unknown_fallback",
      };
    }

    case "diabetes": {
      if (food.category === "Açúcares e Doces") {
        return {
          status: "incompatible",
          reason: "Açúcares simples / Doces",
          source: "category_heuristic",
        };
      }
      if (
        food.glycemicIndex !== undefined &&
        Number.isFinite(food.glycemicIndex)
      ) {
        return food.glycemicIndex >= 70
          ? {
              status: "incompatible",
              reason: "Alto Índice Glicêmico (>= 70)",
              source: "explicit_metadata",
            }
          : { status: "compatible", source: "explicit_metadata" };
      }
      return { status: "compatible", source: "category_heuristic" };
    }

    default:
      return {
        status: "unknown",
        reason: `Restrição não catalogada: ${restriction}`,
        source: "unknown_fallback",
      };
  }
};

/**
 * Checks if a food contains gluten.
 * Conservative safety policy: unverified high-risk cereal or unclassified preparation returns true.
 */
export const foodContainsGluten = (food: Food): boolean => {
  return evaluateFoodRestriction(food, "gluten_free").status !== "compatible";
};

/**
 * Checks if a food contains lactose.
 */
export const foodContainsLactose = (food: Food): boolean => {
  return (
    evaluateFoodRestriction(food, "lactose_free").status === "incompatible"
  );
};

/**
 * Checks if a food contains dairy/cow's milk protein (for APLV).
 */
export const foodContainsDairy = (food: Food): boolean => {
  return evaluateFoodRestriction(food, "dairy_free").status === "incompatible";
};

/**
 * Checks if a food is vegetarian (no meat, poultry, fish, seafood).
 */
export const foodIsVegetarian = (food: Food): boolean => {
  return evaluateFoodRestriction(food, "vegetarian").status === "compatible";
};

/**
 * Checks if a food is vegan (no meat, dairy, eggs, honey).
 */
export const foodIsVegan = (food: Food): boolean => {
  return evaluateFoodRestriction(food, "vegan").status === "compatible";
};

/**
 * Validates whether a food item is compatible with an active list of patient restrictions.
 * Returns structured 3-state compatibility results.
 */
export const isFoodCompatibleWithRestrictions = (
  food: Food,
  restrictions: string[] = [],
): FoodCompatibilityResult => {
  const evaluations: Record<string, RestrictionEvaluation> = {};
  const reasons: string[] = [];
  const unverifiedRestrictions: string[] = [];

  for (const r of restrictions) {
    const evaluation = evaluateFoodRestriction(food, r);
    evaluations[r] = evaluation;

    if (evaluation.status === "incompatible") {
      reasons.push(evaluation.reason || `Incompatível com ${r}`);
    } else if (evaluation.status === "unknown") {
      unverifiedRestrictions.push(r);
      if (evaluation.reason) reasons.push(evaluation.reason);
    }
  }

  const hasIncompatible = Object.values(evaluations).some(
    (e) => e.status === "incompatible",
  );
  const hasUnknown = Object.values(evaluations).some(
    (e) => e.status === "unknown",
  );

  let status: "compatible" | "incompatible" | "requires_review" = "compatible";
  if (hasIncompatible) {
    status = "incompatible";
  } else if (hasUnknown) {
    status = "requires_review";
  }

  return {
    compatible: !hasIncompatible,
    status,
    reason: reasons[0],
    reasons,
    unverifiedRestrictions,
    evaluations,
  };
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
