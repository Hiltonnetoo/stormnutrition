import { describe, it, expect } from "vitest";
import {
  DEFAULT_CLINIC_TIMEZONE,
  getCivilToday,
  getCivilDateFromDate,
  isValidCivilDate,
  formatCivilDate,
  toUtcIsoString,
  parseLocalDateTime,
  isSameCivilDay,
  formatWallClock,
  getCivilMonthRange,
  getRecentMonthRanges,
} from "../dateTime";

describe("dateTime utilities - Timezone and Civil Date Contracts", () => {
  it("defaults to America/Sao_Paulo clinic timezone", () => {
    expect(DEFAULT_CLINIC_TIMEZONE).toBe("America/Sao_Paulo");
  });

  it("returns a valid YYYY-MM-DD civil date string for today", () => {
    const today = getCivilToday();
    expect(isValidCivilDate(today)).toBe(true);
  });

  it("correctly resolves the late-evening rollover bug (22h BRT vs 01h UTC tomorrow)", () => {
    // 2026-09-17 at 22:30:00 BRT is 2026-09-18 at 01:30:00Z in UTC
    const eveningDate = new Date("2026-09-18T01:30:00.000Z");

    const brtCivil = getCivilDateFromDate(eveningDate, "America/Sao_Paulo");
    const utcCivil = getCivilDateFromDate(eveningDate, "UTC");

    // In São Paulo, it was still September 17!
    expect(brtCivil).toBe("2026-09-17");
    // In UTC, it has rolled over to September 18
    expect(utcCivil).toBe("2026-09-18");

    // This proves evening check-ins in Brazil will NOT be assigned to tomorrow
    expect(brtCivil).not.toBe(utcCivil);
  });

  it("validates realistic calendar dates and strictly rejects invalid ones", () => {
    expect(isValidCivilDate("2026-09-17")).toBe(true);
    expect(isValidCivilDate("2024-02-29")).toBe(true); // 2024 is a leap year

    // Non-leap year 29 Feb
    expect(isValidCivilDate("2026-02-29")).toBe(false);
    // Nonexistent day 31 in 30-day month
    expect(isValidCivilDate("2026-04-31")).toBe(false);
    // Invalid format
    expect(isValidCivilDate("17/09/2026")).toBe(false);
    expect(isValidCivilDate("2026-13-01")).toBe(false);
    expect(isValidCivilDate("not-a-date")).toBe(false);
  });

  it("formats civil dates without browser timezone shift", () => {
    expect(formatCivilDate("2026-09-17", "pt-BR")).toBe("17/09/2026");
    expect(formatCivilDate("2026-09-17", "en-US")).toBe("09/17/2026");
    // Passthrough on invalid date
    expect(formatCivilDate("invalid")).toBe("invalid");
  });

  it("converts Date to ISO 8601 UTC string with timezone marker", () => {
    const fixed = new Date("2026-09-17T20:00:00Z");
    expect(toUtcIsoString(fixed)).toBe("2026-09-17T20:00:00.000Z");
  });

  it("parses local wall time preserving explicit hour and minute components", () => {
    const parsed = parseLocalDateTime("2026-09-17T14:30:00");
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(8); // 0-indexed September
    expect(parsed.getDate()).toBe(17);
    expect(parsed.getHours()).toBe(14);
    expect(parsed.getMinutes()).toBe(30);
  });

  it("determines if two moments belong to the same civil day in the clinic timezone", () => {
    // 2026-09-17 at 10:00 BRT and 2026-09-17 at 23:00 BRT
    const morning = new Date("2026-09-17T13:00:00Z"); // 10:00 BRT
    const night = new Date("2026-09-18T02:00:00Z"); // 23:00 BRT

    expect(isSameCivilDay(morning, night, "America/Sao_Paulo")).toBe(true);
    // In UTC they are different days
    expect(isSameCivilDay(morning, night, "UTC")).toBe(false);
  });
});

describe("dateTime utilities - query ranges (etapa 14)", () => {
  it("formats wall-clock time in the clinic timezone, comparable to appointment dateTime", () => {
    // 01:30 UTC on Sep 18 is still 22:30 on Sep 17 in São Paulo (UTC-3)
    const instant = new Date("2026-09-18T01:30:05Z");
    expect(formatWallClock(instant, "America/Sao_Paulo")).toBe(
      "2026-09-17T22:30:05",
    );
    expect(formatWallClock(instant, "UTC")).toBe("2026-09-18T01:30:05");
    // Lexicographic comparison works against stored "YYYY-MM-DDTHH:mm:ss"
    expect("2026-09-17T23:00:00" >= formatWallClock(instant)).toBe(true);
    expect("2026-09-17T22:00:00" >= formatWallClock(instant)).toBe(false);
  });

  it("uses 00 (not 24) for midnight wall-clock hours", () => {
    expect(formatWallClock(new Date("2026-09-18T03:00:00Z"))).toBe(
      "2026-09-18T00:00:00",
    );
  });

  it("builds [start, end) month bounds including the year rollover", () => {
    expect(getCivilMonthRange(2026, 8)).toEqual({
      start: "2026-09-01",
      end: "2026-10-01",
    });
    expect(getCivilMonthRange(2026, 11)).toEqual({
      start: "2026-12-01",
      end: "2027-01-01",
    });
    const { start, end } = getCivilMonthRange(2026, 1);
    expect("2026-02-28T23:30:00" >= start && "2026-02-28T23:30:00" < end).toBe(
      true,
    );
    expect("2026-03-01T00:00:00" < end).toBe(false);
  });

  it("returns the last N local months oldest-first, contiguous and ending with the current month", () => {
    const now = new Date(2026, 1, 15, 12, 0, 0); // 15 Feb 2026, local time
    const ranges = getRecentMonthRanges(6, now);
    expect(ranges.map((r) => [r.year, r.monthIndex])).toEqual([
      [2025, 8],
      [2025, 9],
      [2025, 10],
      [2025, 11],
      [2026, 0],
      [2026, 1],
    ]);
    for (let i = 1; i < ranges.length; i++) {
      expect(ranges[i].startIso).toBe(ranges[i - 1].endIso);
    }
    expect(ranges[5].startIso).toBe(new Date(2026, 1, 1).toISOString());
    expect(ranges[5].endIso).toBe(new Date(2026, 2, 1).toISOString());
    expect(getRecentMonthRanges(0, now)).toEqual([]);
  });
});
