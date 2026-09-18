import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/firebaseService", () => ({
  getPatientById: vi.fn(async () => ({ id: "p1", firstName: "Ana" })),
  getPatientDiets: vi.fn(() => () => {}),
}));

import { usePatientProfile } from "../usePatientProfile";
import {
  getPatientById,
  getPatientDiets,
} from "../../services/firebaseService";

describe("usePatientProfile", () => {
  beforeEach(() => {
    vi.mocked(getPatientById).mockClear();
    vi.mocked(getPatientDiets).mockClear();
  });

  it("loads once even when the caller passes a new onNotFound every render", async () => {
    const { result, rerender } = renderHook(() =>
      // Inline callback, exactly as PatientProfile passes it.
      usePatientProfile("u1", "p1", () => {}),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    rerender();
    rerender();
    await new Promise((r) => setTimeout(r, 20));
    expect(getPatientById).toHaveBeenCalledTimes(1);
    expect(getPatientDiets).toHaveBeenCalledTimes(1);
    expect(result.current.patient?.firstName).toBe("Ana");
  });

  it("retries after a load error", async () => {
    vi.mocked(getPatientById).mockRejectedValueOnce(new Error("unavailable"));
    const { result } = renderHook(() => usePatientProfile("u1", "p1"));
    await waitFor(() => expect(result.current.loadError).toBe(true));

    result.current.retry();
    await waitFor(() => expect(result.current.patient?.firstName).toBe("Ana"));
    expect(result.current.loadError).toBe(false);
  });
});
