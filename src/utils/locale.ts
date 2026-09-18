import i18n from "../i18n";

export type SupportedLanguage = "pt" | "en";
export type SupportedLocale = "pt-BR" | "en-US";

/**
 * Normalizes any language string (e.g., "pt", "pt-BR", "en", "en-US") to "pt" or "en".
 */
export const getNormalizedLanguage = (
  lng?: string | null,
): SupportedLanguage => {
  const code = (
    lng ||
    (typeof i18n !== "undefined" ? i18n.language : "") ||
    "en"
  ).toLowerCase();
  return code.startsWith("pt") ? "pt" : "en";
};

/**
 * Returns canonical locale identifier ("pt-BR" or "en-US") for Intl formatters.
 */
export const getAppLocale = (lng?: string | null): SupportedLocale => {
  return getNormalizedLanguage(lng) === "pt" ? "pt-BR" : "en-US";
};

/**
 * Formats a Date, timestamp, or ISO string safely according to the specified or active locale.
 */
export const formatDateWithLocale = (
  dateInput: Date | string | number,
  lngOrLocale?: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const locale = getAppLocale(lngOrLocale);
  return d.toLocaleDateString(locale, options);
};

/**
 * Formats a number according to the specified or active locale.
 */
export const formatNumberWithLocale = (
  val: number,
  lngOrLocale?: string,
  options?: Intl.NumberFormatOptions,
): string => {
  if (typeof val !== "number" || isNaN(val)) return "";
  const locale = getAppLocale(lngOrLocale);
  return new Intl.NumberFormat(locale, options).format(val);
};

const MEAL_NAME_KEYS: Record<string, string> = {
  "café da manhã": "meal_table.breakfast",
  "cafe da manha": "meal_table.breakfast",
  breakfast: "meal_table.breakfast",
  "lanche da manhã": "meal_table.morning_snack",
  "lanche da manha": "meal_table.morning_snack",
  "morning snack": "meal_table.morning_snack",
  almoço: "meal_table.lunch",
  almoco: "meal_table.lunch",
  lunch: "meal_table.lunch",
  "lanche da tarde": "meal_table.afternoon_snack",
  "afternoon snack": "meal_table.afternoon_snack",
  jantar: "meal_table.dinner",
  dinner: "meal_table.dinner",
  ceia: "meal_table.supper",
  supper: "meal_table.supper",
};

/**
 * Translates standard meal names dynamically without altering the original record.
 */
export const translateMealName = (
  name: string,
  translator: (key: string) => string,
): string => {
  const normalized = (name || "").toLowerCase().trim();
  const key = MEAL_NAME_KEYS[normalized];
  return key ? translator(key) : name;
};
