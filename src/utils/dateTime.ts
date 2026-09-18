/**
 * Comprehensive date/time and timezone utilities for Isanutri V5.
 *
 * Distinguishes three core concepts:
 * 1. Civil Date ("YYYY-MM-DD"): Pure calendar day with no hours and no timezone.
 *    Used for Date of Birth (dob), diet start dates, and daily adherence check-ins.
 * 2. Local Wall Time ("YYYY-MM-DDTHH:mm:ss"): Scheduled appointment time on clinic clock.
 * 3. UTC Instant ("ISO 8601 with Z"): Precise point-in-time timestamps for audits (createdAt).
 */

/**
 * Standard clinic timezone (Brasília / America/Sao_Paulo, UTC-3).
 * Used as the canonical reference for daily compliance, check-ins, and schedule cutoffs.
 */
export const DEFAULT_CLINIC_TIMEZONE = "America/Sao_Paulo";

/**
 * Converts "YYYY-MM-DDTHH:mm[:ss]" (or "YYYY-MM-DD") to a Date whose
 * local components correspond EXACTLY to those in the string, preventing UTC-offset skew.
 */
export const parseLocalDateTime = (value: string): Date => {
  if (!value) return new Date(NaN);
  const [datePart, timePart = "00:00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour = 0, minute = 0, second = 0] = timePart.split(":").map(Number);
  if (!year || !month || !day) return new Date(NaN);
  return new Date(year, month - 1, day, hour, minute, second);
};

/**
 * Formatter helper that produces "YYYY-MM-DD" for a specific timezone using Intl.
 */
const getIntlCivilFormatter = (timeZone: string) => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    // Fallback if specified timezone is unsupported in the current environment
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: DEFAULT_CLINIC_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
};

/**
 * Returns today's civil date ("YYYY-MM-DD") in the specified timezone.
 * Resolves the issue where patients checking in late evening (e.g. 21:15 BRT = 00:15 UTC)
 * were erroneously recorded into tomorrow's date.
 */
export const getCivilToday = (
  timeZone: string = DEFAULT_CLINIC_TIMEZONE,
): string => {
  return getIntlCivilFormatter(timeZone).format(new Date());
};

/**
 * Extracts the civil date ("YYYY-MM-DD") of a given Date instance in the specified timezone.
 */
export const getCivilDateFromDate = (
  date: Date,
  timeZone: string = DEFAULT_CLINIC_TIMEZONE,
): string => {
  if (isNaN(date.getTime())) return "";
  return getIntlCivilFormatter(timeZone).format(date);
};

/**
 * Validates whether a string represents a real, valid calendar date in "YYYY-MM-DD" format.
 * Rejects nonexistent dates like "2026-02-29" (non-leap year) or "2026-04-31".
 */
export const isValidCivilDate = (str: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [year, month, day] = str.split("-").map(Number);
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
};

/**
 * Formats a civil date string ("YYYY-MM-DD") into human-friendly locale format ("DD/MM/YYYY")
 * purely through numeric splitting, eliminating browser UTC-midnight timezone shifts.
 */
export const formatCivilDate = (
  civilDateStr: string,
  locale: "pt-BR" | "en-US" | string = "pt-BR",
): string => {
  if (!civilDateStr || !isValidCivilDate(civilDateStr)) return civilDateStr;
  const [year, month, day] = civilDateStr.split("-");
  const isEn =
    typeof locale === "string" && locale.toLowerCase().startsWith("en");
  if (isEn) {
    return `${month}/${day}/${year}`;
  }
  return `${day}/${month}/${year}`;
};

/**
 * Converts a Date or timestamp into a reliable ISO 8601 UTC string for persistent audit logs.
 */
export const toUtcIsoString = (date: Date | number = new Date()): string => {
  const d = typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
};

/**
 * Compares two dates or timestamps and determines whether they fall on the same civil day
 * in the specified clinic/patient timezone.
 */
export const isSameCivilDay = (
  d1: string | Date,
  d2: string | Date,
  timeZone: string = DEFAULT_CLINIC_TIMEZONE,
): boolean => {
  const civil1 =
    typeof d1 === "string" && isValidCivilDate(d1)
      ? d1
      : getCivilDateFromDate(
          typeof d1 === "string" ? new Date(d1) : d1,
          timeZone,
        );

  const civil2 =
    typeof d2 === "string" && isValidCivilDate(d2)
      ? d2
      : getCivilDateFromDate(
          typeof d2 === "string" ? new Date(d2) : d2,
          timeZone,
        );

  return Boolean(civil1 && civil2 && civil1 === civil2);
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Formats an instant as local wall time ("YYYY-MM-DDTHH:mm:ss") in the given
 * timezone — the same representation used by `Appointment.dateTime`, so the
 * result can be compared lexicographically in Firestore range queries.
 */
export const formatWallClock = (
  date: Date = new Date(),
  timeZone: string = DEFAULT_CLINIC_TIMEZONE,
): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
};

/**
 * Wall-clock bounds of a calendar month: [start, end) as "YYYY-MM-DD" strings,
 * suitable for `dateTime >= start && dateTime < end` on appointment documents.
 */
export const getCivilMonthRange = (
  year: number,
  monthIndex: number,
): { start: string; end: string } => {
  const first = new Date(year, monthIndex, 1);
  const next = new Date(year, monthIndex + 1, 1);
  return {
    start: `${first.getFullYear()}-${pad2(first.getMonth() + 1)}-01`,
    end: `${next.getFullYear()}-${pad2(next.getMonth() + 1)}-01`,
  };
};

export interface MonthInstantRange {
  year: number;
  monthIndex: number;
  /** UTC ISO instant of local midnight on the 1st (inclusive). */
  startIso: string;
  /** UTC ISO instant of local midnight on the 1st of the next month (exclusive). */
  endIso: string;
}

/**
 * The last `count` local calendar months (oldest first, current month last),
 * expressed as UTC ISO instants so they can bound `createdAt` audit timestamps.
 */
export const getRecentMonthRanges = (
  count: number,
  now: Date = new Date(),
): MonthInstantRange[] =>
  Array.from({ length: Math.max(0, count) }, (_, i) => {
    const offset = count - 1 - i;
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return {
      year: start.getFullYear(),
      monthIndex: start.getMonth(),
      startIso: start.toISOString(),
      endIso: end.toISOString(),
    };
  });
