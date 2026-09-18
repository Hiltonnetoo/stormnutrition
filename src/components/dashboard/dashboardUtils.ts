import type { TFunction } from "i18next";
import type { AnyDietPlan, Patient } from "../../types";
import type { MonthInstantRange } from "../../utils/dateTime";

export interface MonthBucket {
  label: string;
  count: number;
}

/**
 * Chart buckets from per-month counts (aggregation results) — the dashboard no
 * longer downloads every diet to count them.
 */
export const buildMonthlyDietBuckets = (
  months: Array<Pick<MonthInstantRange, "monthIndex">>,
  counts: number[],
  isEn: boolean,
): MonthBucket[] => {
  const MONTHS_SHORT = isEn
    ? [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ]
    : [
        "jan",
        "fev",
        "mar",
        "abr",
        "mai",
        "jun",
        "jul",
        "ago",
        "set",
        "out",
        "nov",
        "dez",
      ];
  return months.map((m, i) => ({
    label: MONTHS_SHORT[m.monthIndex],
    count: counts[i] ?? 0,
  }));
};

export type ActivityIconKey = "patient" | "diet" | "eval" | "weight";

export interface ActivityItem {
  id: string;
  iconKey: ActivityIconKey;
  text: string;
  date: number; // timestamp for sorting
  label: string; // formatted date label
}

export const formatRelative = (ts: number, isEn: boolean): string => {
  const diffMs = Date.now() - ts;
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < day && new Date(ts).toDateString() === new Date().toDateString())
    return isEn ? "Today" : "Hoje";
  if (diffMs < 2 * day) return isEn ? "Yesterday" : "Ontem";
  if (diffMs < 7 * day) {
    const days = Math.floor(diffMs / day);
    return isEn ? `${days} days ago` : `há ${days} dias`;
  }
  return new Date(ts).toLocaleDateString(isEn ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

/** How many feed items the dashboard shows (and how many recent diets it reads). */
export const RECENT_ACTIVITY_LIMIT = 6;

/**
 * Merges the latest events. Diets only need the RECENT_ACTIVITY_LIMIT most
 * recent documents: an older diet can never reach the top of the feed.
 */
export const buildRecentActivity = (
  patients: Patient[],
  diets: AnyDietPlan[],
  t: TFunction,
  isEn: boolean,
): ActivityItem[] => {
  const items: ActivityItem[] = [];

  patients.forEach((p) => {
    const name = `${p.firstName} ${p.lastName}`.trim();
    if (p.createdAt) {
      const ts = new Date(p.createdAt).getTime();
      if (!isNaN(ts))
        items.push({
          id: `pat_${p.id}`,
          iconKey: "patient",
          text: t("dashboard.activity_registered", { name }),
          date: ts,
          label: "",
        });
    }
    (p.selfEvaluations || [])
      .filter((e) => e.status === "completed" && e.completionDate)
      .forEach((e) => {
        const ts = new Date(e.completionDate!).getTime();
        if (!isNaN(ts))
          items.push({
            id: `eval_${e.id}`,
            iconKey: "eval",
            text: t("dashboard.activity_evaluation", { name }),
            date: ts,
            label: "",
          });
      });
    (p.weightHistory || [])
      .filter((w) => w.origin === "self_reported")
      .forEach((w) => {
        const ts = new Date(w.date).getTime();
        if (!isNaN(ts))
          items.push({
            id: `weight_${p.id}_${w.date}`,
            iconKey: "weight",
            text: t("dashboard.activity_weight", { name, weight: w.weight }),
            date: ts,
            label: "",
          });
      });
  });

  diets.forEach((d) => {
    if (!d.createdAt) return;
    const ts = new Date(d.createdAt).getTime();
    if (isNaN(ts)) return;
    items.push({
      id: `diet_${d.id}`,
      iconKey: "diet",
      text: t("dashboard.activity_diet", { name: d.patientName }),
      date: ts,
      label: "",
    });
  });

  return items
    .sort((a, b) => b.date - a.date)
    .slice(0, RECENT_ACTIVITY_LIMIT)
    .map((it) => ({ ...it, label: formatRelative(it.date, isEn) }));
};
