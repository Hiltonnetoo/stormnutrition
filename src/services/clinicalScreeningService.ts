import type { Food, ClinicalTag, DietMode } from "../types";
import { evaluateFoodRestriction } from "./foodService";

export interface UnifiedClinicalContext {
  restrictions: string[];
  clinicalTags: ClinicalTag[];
  foodAllergies: string[];
  mode: DietMode;
}

export interface CompatibilityResult {
  status: "compatible" | "incompatible" | "unknown";
  code?: string;
  reason?: string;
  matchedConstraint?: string;
  source?: string;
}

/**
 * Normalizes an arbitrary text string (removing accents, lowercase, trimmed).
 */
export const normalizeText = (str: string): string => {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const NOISE_PREFIXES = [
  /^alergia\s+(a|ao|aos|as|de)\s+/i,
  /^intolerancia\s+(a|ao|aos|as|de)\s+/i,
  /^alergico\s+(a|ao|aos|as|de)\s+/i,
  /^sensibilidade\s+(a|ao|aos|as|de)\s+/i,
];

/**
 * Parses free text or array of allergies into clean, normalized tokens.
 */
export const parseAllergies = (
  raw: string | string[] | undefined | null,
): string[] => {
  if (!raw) return [];
  const rawList = Array.isArray(raw) ? raw : raw.split(/[,;\n/]|(?:\be\b)/gi);
  const result: string[] = [];

  for (const item of rawList) {
    let normalized = normalizeText(item);
    for (const prefix of NOISE_PREFIXES) {
      normalized = normalized.replace(prefix, "").trim();
    }
    if (normalized.length > 1) {
      result.push(normalized);
      // Also extract single core words if compound (e.g. "leite e derivados" -> "leite")
      const words = normalized.split(/\s+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (!result.includes(w) && !["derivados", "produtos"].includes(w)) {
          result.push(w);
        }
      }
    }
  }

  return Array.from(new Set(result));
};

/**
 * Known allergen mapping rules for robust keyword matching against Brazilian food catalog.
 */
const ALLERGEN_KEYWORD_MAP: Record<string, string[]> = {
  amendoim: ["amendoim", "pasta de amendoim", "pacoca"],
  leite: [
    "leite",
    "queijo",
    "iogurte",
    "requeijao",
    "manteiga",
    "creme de leite",
    "soro de leite",
    "whey",
    "caseina",
  ],
  lactose: [
    "leite",
    "queijo",
    "iogurte",
    "requeijao",
    "manteiga",
    "creme de leite",
  ],
  ovo: ["ovo", "omelete", "clara de ovo", "gema de ovo"],
  peixe: ["peixe", "salmao", "tilapia", "atum", "sardinha", "bacalhau", "pescada"],
  "frutos do mar": [
    "camarao",
    "crustaceo",
    "frutos do mar",
    "lula",
    "polvo",
    "marisco",
    "ostra",
    "caranguejo",
    "siri",
  ],
  camarao: ["camarao", "crustaceo"],
  trigo: [
    "trigo",
    "farinha de trigo",
    "pao",
    "macarrao",
    "biscoito",
    "bolacha",
    "torrada",
    "centeio",
    "cevada",
    "malte",
  ],
  gluten: [
    "trigo",
    "farinha de trigo",
    "pao",
    "macarrao",
    "biscoito",
    "bolacha",
    "torrada",
    "centeio",
    "cevada",
    "malte",
  ],
  soja: ["soja", "tofu", "shoyu", "leite de soja", "edamame"],
  castanha: [
    "castanha",
    "noz",
    "nozes",
    "amendoa",
    "amendoas",
    "pistache",
    "avela",
    "macadamia",
  ],
  castanhas: [
    "castanha",
    "noz",
    "nozes",
    "amendoa",
    "amendoas",
    "pistache",
    "avela",
    "macadamia",
  ],
  nozes: [
    "castanha",
    "noz",
    "nozes",
    "amendoa",
    "amendoas",
    "pistache",
    "avela",
    "macadamia",
  ],
};

/**
 * Checks if a specific food triggers an allergy token.
 */
export const matchFoodAllergen = (
  food: Food,
  allergyToken: string,
): { matches: boolean; matchedKeyword?: string } => {
  const normalizedName = normalizeText(food.name);
  const normalizedCat = normalizeText(food.category);
  const normalizedToken = normalizeText(allergyToken);

  // Check specific keywords mapping
  for (const [categoryKey, keywords] of Object.entries(ALLERGEN_KEYWORD_MAP)) {
    if (normalizedToken === categoryKey || normalizedToken.includes(categoryKey) || categoryKey.includes(normalizedToken)) {
      for (const kw of keywords) {
        if (normalizedName.includes(kw)) {
          return { matches: true, matchedKeyword: kw };
        }
      }
    }
  }

  // Direct substring check
  if (normalizedName.includes(normalizedToken)) {
    return { matches: true, matchedKeyword: normalizedToken };
  }

  // Cross-category check
  if (normalizedCat.includes(normalizedToken)) {
    return { matches: true, matchedKeyword: food.category };
  }

  return { matches: false };
};

/**
 * Builds a unified, bidirectional clinical context ensuring parity between
 * clinical tags, dietary restrictions, and parsed allergies.
 */
export const buildUnifiedClinicalContext = (params: {
  restrictions?: string[];
  clinicalTags?: ClinicalTag[];
  foodAllergies?: string | string[];
  mode?: DietMode;
}): UnifiedClinicalContext => {
  const restrictionsSet = new Set<string>(params.restrictions || []);
  const clinicalTagsSet = new Set<ClinicalTag>(params.clinicalTags || []);
  const parsedAllergies = parseAllergies(params.foodAllergies);
  const mode = params.mode || "general";

  // Bidirectional synchronization:
  // 1. Hypertension
  if (clinicalTagsSet.has("hypertension")) {
    restrictionsSet.add("hypertension");
  } else if (restrictionsSet.has("hypertension")) {
    clinicalTagsSet.add("hypertension");
  }

  // 2. Diabetes
  if (clinicalTagsSet.has("diabetes_t1") || clinicalTagsSet.has("diabetes_t2")) {
    restrictionsSet.add("diabetes");
  } else if (restrictionsSet.has("diabetes")) {
    clinicalTagsSet.add("diabetes_t2");
  }

  // 3. Allergies promoting strict restrictions
  for (const allergy of parsedAllergies) {
    if (allergy.includes("leite") || allergy.includes("lactose")) {
      restrictionsSet.add("dairy_free");
      restrictionsSet.add("lactose_free");
    }
    if (allergy.includes("gluten") || allergy.includes("trigo")) {
      restrictionsSet.add("gluten_free");
    }
  }

  return {
    restrictions: Array.from(restrictionsSet),
    clinicalTags: Array.from(clinicalTagsSet),
    foodAllergies: parsedAllergies,
    mode,
  };
};

/**
 * Evaluates whether a food is compatible with the entire unified clinical context.
 * Single source of truth for both generator food selection and plan validation.
 */
export const evaluateFoodCompatibility = (
  food: Food,
  context: UnifiedClinicalContext,
): CompatibilityResult => {
  // 1. Check Allergies (strictly incompatible, high severity)
  for (const allergyToken of context.foodAllergies) {
    const match = matchFoodAllergen(food, allergyToken);
    if (match.matches) {
      return {
        status: "incompatible",
        code: "ALLERGY_VIOLATION",
        reason: `Contém alérgeno "${allergyToken}" (identificado por "${match.matchedKeyword}")`,
        matchedConstraint: allergyToken,
        source: "allergy_screening",
      };
    }
  }

  // 2. Check Dietary Restrictions
  for (const r of context.restrictions) {
    const evalResult = evaluateFoodRestriction(food, r);
    if (evalResult.status === "incompatible") {
      let code = "RESTRICTION_VIOLATION";
      if (r === "gluten_free") code = "GLUTEN_VIOLATION";
      else if (r === "lactose_free") code = "LACTOSE_VIOLATION";
      else if (r === "dairy_free") code = "DAIRY_VIOLATION";
      else if (r === "vegetarian") code = "VEGETARIAN_VIOLATION";
      else if (r === "vegan") code = "VEGAN_VIOLATION";
      else if (r === "diabetes") code = "DIABETES_VIOLATION";
      else if (r === "hypertension") code = "HYPERTENSION_VIOLATION";

      return {
        status: "incompatible",
        code,
        reason: evalResult.reason || `Incompatível com restrição "${r}"`,
        matchedConstraint: r,
        source: evalResult.source,
      };
    }
  }

  // 3. Check Clinical Tags
  if (context.clinicalTags.includes("hypertension")) {
    if (food.sodium !== undefined && food.sodium >= 300) {
      return {
        status: "incompatible",
        code: "HYPERTENSION_VIOLATION",
        reason: `Sódio excessivo (${food.sodium}mg >= 300mg) para paciente hipertenso`,
        matchedConstraint: "hypertension",
        source: "clinical_tag",
      };
    }
  }

  if (context.clinicalTags.includes("renal_ckd")) {
    if (food.sodium !== undefined && food.sodium >= 200) {
      return {
        status: "incompatible",
        code: "RENAL_CKD_VIOLATION",
        reason: `Sódio excessivo (${food.sodium}mg >= 200mg) para paciente com doença renal`,
        matchedConstraint: "renal_ckd",
        source: "clinical_tag",
      };
    }
  }

  if (
    context.clinicalTags.includes("diabetes_t1") ||
    context.clinicalTags.includes("diabetes_t2")
  ) {
    if (food.category === "Açúcares e Doces") {
      return {
        status: "incompatible",
        code: "DIABETES_VIOLATION",
        reason: "Alimento da categoria Açúcares e Doces contraindicado para diabetes",
        matchedConstraint: "diabetes",
        source: "clinical_tag",
      };
    }
    if (food.glycemicIndex !== undefined && food.glycemicIndex >= 70) {
      return {
        status: "incompatible",
        code: "DIABETES_VIOLATION",
        reason: `Alto índice glicêmico (${food.glycemicIndex} >= 70) contraindicado para diabetes`,
        matchedConstraint: "diabetes",
        source: "clinical_tag",
      };
    }
  }

  if (context.clinicalTags.includes("hepatic_steatosis")) {
    if (
      food.category === "Óleos e Gorduras" &&
      !food.name.toLowerCase().includes("azeite")
    ) {
      return {
        status: "incompatible",
        code: "STEATOSIS_VIOLATION",
        reason: "Gordura saturada/óleo contraindicado para esteatose hepática",
        matchedConstraint: "hepatic_steatosis",
        source: "clinical_tag",
      };
    }
  }

  // 4. Mode-specific checks
  if (context.mode === "clinical" && food.sodium !== undefined && food.sodium >= 600) {
    return {
      status: "incompatible",
      code: "CLINICAL_MODE_VIOLATION",
      reason: `Sódio excessivo (${food.sodium}mg >= 600mg) para modo clínico`,
      matchedConstraint: "mode_clinical",
      source: "mode",
    };
  }

  return { status: "compatible" };
};
