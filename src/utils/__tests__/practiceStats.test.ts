import { describe, it, expect } from "vitest";
import { summarizePatients, countCreatedPerMonth } from "../practiceStats";
import { getRecentMonthRanges } from "../dateTime";
import { validatePatient } from "../validation";

const now = new Date(2026, 8, 17, 12); // 17 Sep 2026, local time
const months = getRecentMonthRanges(3, now); // Jul, Aug, Sep 2026
const at = (y: number, m: number, d: number) =>
  new Date(y, m, d, 10).toISOString();

const patient = (
  id: string,
  createdAt: string,
  status: "Active" | "Inactive" | "Archived" = "Active",
) => validatePatient({ id, firstName: id, createdAt, status });

describe("practiceStats", () => {
  it("summarizes total, active and new-this-month patients in memory", () => {
    const patients = [
      patient("a", at(2026, 8, 2)),
      patient("b", at(2026, 8, 16), "Archived"),
      patient("c", at(2026, 7, 31)),
      patient("d", at(2025, 0, 1), "Inactive"),
    ];
    expect(summarizePatients(patients, months[2])).toEqual({
      total: 4,
      active: 2,
      newThisMonth: 2,
    });
  });

  it("counts creation per month with inclusive start and exclusive end", () => {
    const items = [
      { createdAt: months[0].startIso }, // first instant of July → July
      { createdAt: at(2026, 7, 15) },
      { createdAt: months[2].startIso }, // first instant of September
      { createdAt: months[2].endIso }, // first instant of October → outside
      { createdAt: at(2026, 5, 30) }, // June → outside
      { createdAt: "not-a-date" },
      {},
    ];
    expect(countCreatedPerMonth(items, months)).toEqual([1, 1, 1]);
  });

  it("returns zeros for an empty roster", () => {
    expect(summarizePatients([], months[2])).toEqual({
      total: 0,
      active: 0,
      newThisMonth: 0,
    });
    expect(countCreatedPerMonth([], months)).toEqual([0, 0, 0]);
  });
});
