import type { TFunction } from "i18next";
import type { AnyDietPlan, Patient } from "../../types";

export interface MonthBucket {
  label: string;
  count: number;
}

export const buildMonthlyDietBuckets = (
  diets: AnyDietPlan[],
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
  const now = new Date();
  const buckets: MonthBucket[] = [];
  const keyToIndex = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    keyToIndex.set(key, buckets.length);
    buckets.push({ label: MONTHS_SHORT[d.getMonth()], count: 0 });
  }
  diets.forEach((diet) => {
    if (!diet.createdAt) return;
    const d = new Date(diet.createdAt);
    if (isNaN(d.getTime())) return;
    const idx = keyToIndex.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (idx !== undefined) buckets[idx].count++;
  });
  return buckets;
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
    .slice(0, 6)
    .map((it) => ({ ...it, label: formatRelative(it.date, isEn) }));
};
