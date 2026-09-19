import type { TFunction } from "i18next";
import type { PlanValidationIssue } from "../types";

/**
 * A1 — one place that turns validation issues into what the professional
 * reads (screen, review dialog and PDF): grouped by severity, one line per
 * alternative, nutrients in the reader's language and numbers in the
 * reader's format. The validation data itself stays numeric and unchanged.
 */

/* ------------------------------------------------------------- sodium */
/** Daily sodium ceiling (mg) used by every surface: renal 1500,
 *  hypertension 2000, otherwise 2300. */
export const getSodiumCeiling = (clinicalTags?: readonly string[]): number =>
  clinicalTags?.includes("renal_ckd")
    ? 1500
    : clinicalTags?.includes("hypertension")
      ? 2000
      : 2300;

/* ------------------------------------------------------------ numbers */
const numberLocale = (lng: string) =>
  lng?.startsWith("en") ? "en-US" : "pt-BR";

export const formatNumber = (
  value: number,
  lng: string,
  maxDigits = 1,
): string =>
  new Intl.NumberFormat(numberLocale(lng), {
    maximumFractionDigits: maxDigits,
  }).format(value);

/** "+44", "−30" (true minus sign), "0". */
export const formatSigned = (
  value: number,
  lng: string,
  maxDigits = 1,
): string => {
  const abs = formatNumber(Math.abs(value), lng, maxDigits);
  return value > 0 ? `+${abs}` : value < 0 ? `−${abs}` : abs;
};

type Nutrient = "calories" | "protein" | "carbs" | "fat";

export const formatNutrientValue = (
  nutrient: Nutrient,
  value: number,
  lng: string,
): string =>
  nutrient === "calories"
    ? `${formatNumber(value, lng, 0)} kcal`
    : `${formatNumber(value, lng)} g`;

/* ------------------------------------------------------------ grouping */
const DAILY: Record<string, Nutrient> = {
  CALORIE_DEVIATION: "calories",
  PROTEIN_DEVIATION: "protein",
  CARBS_DEVIATION: "carbs",
  FAT_DEVIATION: "fat",
};
const isAlternative = (code: string) =>
  code === "ALTERNATIVE_CALORIE_DEVIATION" ||
  code === "ALTERNATIVE_MACRO_DEVIATION";
const isWorstCase = (code: string) =>
  code.startsWith("WORST_CASE_") || code.startsWith("ZERO_TARGET_");
const isSodium = (code: string) => code.includes("SODIUM");

export interface AlternativeDeviation {
  nutrient: Nutrient;
  mainValue: number;
  alternativeValue: number;
  percentDiff: number;
}

export interface AlternativeGroup {
  mealName: string;
  /** 1-based position of the alternative in the meal, when known. */
  index?: number;
  items: string[];
  deviations: AlternativeDeviation[];
}

export interface GroupedIssues {
  blockers: PlanValidationIssue[];
  daily: PlanValidationIssue[];
  sodium: PlanValidationIssue[];
  worstCase: PlanValidationIssue[];
  alternativesByMeal: { mealName: string; groups: AlternativeGroup[] }[];
  other: PlanValidationIssue[];
  /** Lines shown to the reader (alternatives count once each). */
  warningLines: number;
}

const NUTRIENT_ORDER: Nutrient[] = ["calories", "protein", "carbs", "fat"];

export const groupValidationIssues = (
  issues: readonly PlanValidationIssue[] = [],
): GroupedIssues => {
  const grouped: GroupedIssues = {
    blockers: [],
    daily: [],
    sodium: [],
    worstCase: [],
    alternativesByMeal: [],
    other: [],
    warningLines: 0,
  };
  const altIndex = new Map<string, AlternativeGroup>();

  for (const issue of issues) {
    if (issue.level === "error") {
      grouped.blockers.push(issue);
      continue;
    }
    const d = (issue.details ?? {}) as Record<string, unknown>;
    if (DAILY[issue.code]) grouped.daily.push(issue);
    else if (isSodium(issue.code)) grouped.sodium.push(issue);
    else if (isWorstCase(issue.code)) grouped.worstCase.push(issue);
    else if (isAlternative(issue.code) && d.mealName) {
      const mealName = String(d.mealName);
      const index =
        typeof d.alternativeIndex === "number" ? d.alternativeIndex : undefined;
      const items = Array.isArray(d.alternativeItems)
        ? (d.alternativeItems as string[])
        : [String(d.alternativeName ?? "")];
      const key = `${mealName}|${index ?? items.join("+")}`;
      let group = altIndex.get(key);
      if (!group) {
        group = { mealName, index, items, deviations: [] };
        altIndex.set(key, group);
        let meal = grouped.alternativesByMeal.find(
          (m) => m.mealName === mealName,
        );
        if (!meal) {
          meal = { mealName, groups: [] };
          grouped.alternativesByMeal.push(meal);
        }
        meal.groups.push(group);
      }
      group.deviations.push({
        nutrient:
          (d.nutrient as Nutrient) ??
          (issue.code === "ALTERNATIVE_CALORIE_DEVIATION"
            ? "calories"
            : "protein"),
        mainValue: Number(d.mainValue ?? 0),
        alternativeValue: Number(d.alternativeValue ?? 0),
        percentDiff: Number(d.percentDiff ?? d.percent ?? 0),
      });
    } else grouped.other.push(issue);
  }
  for (const meal of grouped.alternativesByMeal) {
    for (const g of meal.groups) {
      g.deviations.sort(
        (a, b) =>
          NUTRIENT_ORDER.indexOf(a.nutrient) -
          NUTRIENT_ORDER.indexOf(b.nutrient),
      );
    }
  }
  grouped.warningLines =
    grouped.daily.length +
    grouped.sodium.length +
    grouped.worstCase.length +
    grouped.other.length +
    grouped.alternativesByMeal.reduce((n, m) => n + m.groups.length, 0);
  return grouped;
};

/* ------------------------------------------------------------- texts */
/** Any single issue: nutrient translated, numbers in the reader's format. */
export const formatIssue = (
  issue: PlanValidationIssue,
  t: TFunction,
  lng: string,
): string => {
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(issue.details ?? {})) {
    if (key === "nutrient" && typeof value === "string") {
      params[key] = t(`diet_validation.nutrients.${value}`);
    } else if (typeof value === "number") {
      params[key] = /percent/i.test(key)
        ? formatSigned(value, lng)
        : formatNumber(value, lng);
    } else params[key] = value;
  }
  const nutrient = DAILY[issue.code];
  if (nutrient)
    params.nutrientLabel = t(`diet_validation.nutrients.${nutrient}`);
  return issue.code
    ? t(`diet_validation.issues.${issue.code}`, {
        ...params,
        defaultValue: issue.message,
      })
    : issue.message;
};

/** One line per alternative with every deviating nutrient. */
export const formatAlternativeGroup = (
  group: AlternativeGroup,
  t: TFunction,
  lng: string,
): string =>
  t("diet_validation.alternative_line", {
    index: group.index ?? "",
    items: group.items.join(" + "),
    deviations: group.deviations
      .map((dev) =>
        t("diet_validation.deviation_part", {
          nutrient: t(`diet_validation.nutrients.${dev.nutrient}`),
          percent: formatSigned(dev.percentDiff, lng),
          alternative: formatNutrientValue(
            dev.nutrient,
            dev.alternativeValue,
            lng,
          ),
          main: formatNutrientValue(dev.nutrient, dev.mainValue, lng),
        }),
      )
      .join("; "),
  });

export const formatIssueSummary = (
  grouped: GroupedIssues,
  t: TFunction,
): string => {
  const parts: string[] = [];
  if (grouped.blockers.length)
    parts.push(
      t("diet_validation.summary.blockers", { count: grouped.blockers.length }),
    );
  if (grouped.daily.length)
    parts.push(
      t("diet_validation.summary.daily", { count: grouped.daily.length }),
    );
  if (grouped.sodium.length)
    parts.push(
      t("diet_validation.summary.sodium", { count: grouped.sodium.length }),
    );
  const alternatives = grouped.alternativesByMeal.reduce(
    (n, m) => n + m.groups.length,
    0,
  );
  if (alternatives)
    parts.push(
      t("diet_validation.summary.alternatives", {
        count: alternatives,
        meals: grouped.alternativesByMeal.length,
      }),
    );
  return parts.join(" · ");
};
