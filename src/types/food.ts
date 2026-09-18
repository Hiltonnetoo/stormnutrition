import type { Micronutrients } from "./diet";

/**
 * NOVA Classification (Dietary Guidelines for the Brazilian Population):
 * 1 = minimally processed / in natura
 * 2 = processed culinary ingredient
 * 3 = processed food
 * 4 = ultra-processed
 *
 * NOVA 4 foods are excluded from automatic diet generation.
 */
export type NovaGroup = 1 | 2 | 3 | 4;

export type NovaClassificationOrigin = "explicit" | "inferred";

/**
 * Structured dietary and allergen restrictions for a food item.
 * Explicit boolean indicates known verified presence/absence.
 * Undefined represents unknown/untested.
 */
export interface FoodRestrictions {
  /** Explicitly true if contains gluten, false if gluten-free, undefined if unknown */
  containsGluten?: boolean;
  /** Explicitly true if contains lactose, false if lactose-free, undefined if unknown */
  containsLactose?: boolean;
  /** Explicitly true if contains dairy/milk protein (APLV), false if dairy-free, undefined if unknown */
  containsDairy?: boolean;
  /** True if vegetarian-compatible (no meat/poultry/fish), false otherwise */
  isVegetarian?: boolean;
  /** True if vegan-compatible (no animal-derived ingredients), false otherwise */
  isVegan?: boolean;
}

/**
 * 3-state restriction status:
 * - compatible: verified safe for the restriction
 * - incompatible: confirmed violation / contains restricted ingredient or allergen
 * - unknown: untested, unverified or missing metadata requiring professional review
 */
export type RestrictionStatus = "compatible" | "incompatible" | "unknown";

export type RestrictionEvaluationSource =
  | "explicit_metadata"
  | "category_heuristic"
  | "name_heuristic"
  | "unknown_fallback";

export interface RestrictionEvaluation {
  status: RestrictionStatus;
  reason?: string;
  source: RestrictionEvaluationSource;
}

export interface FoodCompatibilityResult {
  compatible: boolean;
  status: "compatible" | "incompatible" | "requires_review";
  reason?: string;
  reasons: string[];
  unverifiedRestrictions: string[];
  evaluations: Record<string, RestrictionEvaluation>;
}

/**
 * Represents a food in the nutritional database.
 */
export interface Food {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  portion: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  glycemicIndex?: number;
  /** NOVA group. If absent, it is inferred by category/name in foodService. */
  novaGroup?: NovaGroup;
  /** Origin of the NOVA classification */
  novaOrigin?: NovaClassificationOrigin;
  /** Structured dietary restrictions and allergen metadata */
  restrictions?: FoodRestrictions;
  micros?: Micronutrients;
  /** Provenance of the nutritional data (e.g., 'TACO 4ª ed.', 'IBGE/POF', 'Custom') */
  source?: string;
  /** Dataset release version */
  datasetVersion?: string;
}
