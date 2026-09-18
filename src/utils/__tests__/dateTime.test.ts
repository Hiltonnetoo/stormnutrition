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
