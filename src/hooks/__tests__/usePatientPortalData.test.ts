import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// UI06 — the portal distinguishes "no data" from "could not read".
const getPatientById = vi.fn();
const getPatientDiets = vi.fn();
const getNextPatientAppointment = vi.fn();
vi.mock("../../services/firebaseService", () => ({
  getPatientById: (...a: unknown[]) => getPatientById(...a),
  getPatientDiets: (...a: unknown[]) => getPatientDiets(...a),
  getNextPatientAppointment: (...a: unknown[]) =>
    getNextPatientAppointment(...a),
}));

import { usePatientPortalData } from "../usePatientPortalData";

const profile = { uid: "u1", nutritionistId: "n1", patientId: "p1" } as never;
const denied = { code: "permission-denied" };

describe("usePatientPortalData — load states (UI06)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    getPatientById.mockReset();
    getPatientDiets.mockReset();
    getNextPatientAppointment.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it("empty data is empty, not an error", async () => {
    getPatientById.mockResolvedValue({ id: "p1", firstName: "Ana" });
    getPatientDiets.mockImplementation((_n, _p, cb) => (cb([]), () => {}));
    getNextPatientAppointment.mockImplementation(
      (_n, _p, _f, cb) => (cb(null), () => {}),
    );
    const { result } = renderHook(() => usePatientPortalData(profile));
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.loadError).toBeNull();
    expect(result.current.diets).toEqual([]);
  });

  it("access still denied after the retries → 'denied' (not an empty plan)", async () => {
    getPatientById.mockRejectedValue(denied);
    getPatientDiets.mockImplementation(
      (_n, _p, _cb, onError) => (onError(denied), () => {}),
    );
    getNextPatientAppointment.mockImplementation(
      (_n, _p, _f, _cb, onError) => (onError(denied), () => {}),
    );
    const { result } = renderHook(() => usePatientPortalData(profile));
    for (let i = 0; i < 6; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });
    }
    expect(result.current.loading).toBe(false);
    expect(result.current.loadError).toBe("denied");
  });

  it("other read failures → 'failed'", async () => {
    getPatientById.mockResolvedValue({ id: "p1" });
    getPatientDiets.mockImplementation(
      (_n, _p, _cb, onError) => (onError({ code: "unavailable" }), () => {}),
    );
    getNextPatientAppointment.mockImplementation(
      (_n, _p, _f, cb) => (cb(null), () => {}),
    );
    const { result } = renderHook(() => usePatientPortalData(profile));
    await act(async () => {});
    expect(result.current.loadError).toBe("failed");
  });
});
