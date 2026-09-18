import type { Patient } from "../types";
import type { MonthInstantRange } from "./dateTime";

export interface PatientSummary {
  total: number;
  active: number;
  newThisMonth: number;
}

const toTime = (value: string | undefined): number =>
  value ? new Date(value).getTime() : NaN;

/**
 * Patient counters derived in memory from the shared patient directory, so
 * screens that already hold the roster do not issue extra Firestore reads.
 */
export const summarizePatients = (
  patients: Patient[],
  currentMonth: Pick<MonthInstantRange, "startIso">,
): PatientSummary => {
  const monthStart = toTime(currentMonth.startIso);
  return patients.reduce<PatientSummary>(
    (acc, p) => {
      acc.total += 1;
      if (p.status === "Active") acc.active += 1;
      if (toTime(p.createdAt) >= monthStart) acc.newThisMonth += 1;
      return acc;
    },
    { total: 0, active: 0, newThisMonth: 0 },
  );
};

/** Number of items whose `createdAt` falls inside each [startIso, endIso) range. */
export const countCreatedPerMonth = (
  items: Array<{ createdAt?: string }>,
  ranges: MonthInstantRange[],
): number[] => {
  const bounds = ranges.map((r) => [toTime(r.startIso), toTime(r.endIso)]);
  const counts = ranges.map(() => 0);
  for (const item of items) {
    const t = toTime(item.createdAt);
    if (Number.isNaN(t)) continue;
    const idx = bounds.findIndex(([start, end]) => t >= start && t < end);
    if (idx > -1) counts[idx] += 1;
  }
  return counts;
};
