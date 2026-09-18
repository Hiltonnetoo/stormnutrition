import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AnyDietPlan } from "../../types";

type Sub = {
  patientId: string;
  emit: (diet: AnyDietPlan | null) => void;
  unsubscribe: ReturnType<typeof vi.fn>;
};
const subs = vi.hoisted(() => [] as Sub[]);
vi.mock("../../services/firebaseService", () => ({
  subscribeLatestDiet: vi.fn(
    (_uid: string, patientId: string, cb: (d: AnyDietPlan | null) => void) => {
      const unsubscribe = vi.fn();
      subs.push({ patientId, emit: cb, unsubscribe });
      return unsubscribe;
    },
  ),
}));

import { useLatestDiets } from "../useLatestDiets";

const active = (patientId: string) =>
  subs.filter(
    (s) => s.patientId === patientId && !s.unsubscribe.mock.calls.length,
  );

describe("useLatestDiets", () => {
  beforeEach(() => {
    subs.length = 0;
  });

  it("opens one limit(1) listener per visible patient and reports loading/none/diet", () => {
    const { result } = renderHook(() => useLatestDiets("u1", ["p1", "p2"]));
    expect(subs.map((s) => s.patientId)).toEqual(["p1", "p2"]);
    expect(result.current.latest.get("p1")).toBeUndefined(); // loading

    act(() => subs[0].emit({ id: "d1", patientId: "p1" } as AnyDietPlan));
    act(() => subs[1].emit(null));
    expect(result.current.latest.get("p1")?.id).toBe("d1");
    expect(result.current.latest.get("p2")).toBeNull();
  });

  it("keeps existing listeners when the page grows and drops rows that leave", () => {
    const { rerender } = renderHook(({ ids }) => useLatestDiets("u1", ids), {
      initialProps: { ids: ["p1", "p2"] },
    });
    rerender({ ids: ["p1", "p2", "p3"] }); // "show more"
    expect(subs).toHaveLength(3);
    expect(subs.every((s) => s.unsubscribe.mock.calls.length === 0)).toBe(true);

    rerender({ ids: ["p3"] }); // search narrowed the list
    expect(active("p1")).toHaveLength(0);
    expect(active("p2")).toHaveLength(0);
    expect(active("p3")).toHaveLength(1);
  });

  it("stops every listener on unmount", () => {
    const { unmount } = renderHook(() => useLatestDiets("u1", ["p1", "p2"]));
    unmount();
    expect(subs.every((s) => s.unsubscribe.mock.calls.length === 1)).toBe(true);
  });

  it("does nothing without an authenticated user", () => {
    renderHook(() => useLatestDiets(undefined, ["p1"]));
    expect(subs).toHaveLength(0);
  });
});
