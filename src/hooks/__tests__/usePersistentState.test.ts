import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import usePersistentState from "../usePersistentState";
import { loadState, STORAGE_PREFIX } from "../../utils/localStorage";

describe("usePersistentState hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads initial value when storage is empty", () => {
    const { result } = renderHook(() =>
      usePersistentState<string>("test_key", "default_val"),
    );

    expect(result.current[0]).toBe("default_val");
  });

  it("loads existing value from storage", () => {
    localStorage.setItem("test_key", JSON.stringify("stored_val"));

    const { result } = renderHook(() =>
      usePersistentState<string>("test_key", "default_val"),
    );

    expect(result.current[0]).toBe("stored_val");
  });

  it("persists direct value updates to storage", () => {
    const { result } = renderHook(() =>
      usePersistentState<number>("count_key", 0),
    );

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    expect(loadState<number>("count_key")).toBe(42);
  });

  it("handles consecutive functional updates without losing state (atomic updates)", () => {
    const { result } = renderHook(() =>
      usePersistentState<{ count: number }>("counter_key", { count: 0 }),
    );

    act(() => {
      result.current[1]((prev) => ({ count: prev.count + 1 }));
      result.current[1]((prev) => ({ count: prev.count + 1 }));
      result.current[1]((prev) => ({ count: prev.count + 1 }));
    });

    expect(result.current[0]).toEqual({ count: 3 });
    expect(loadState<{ count: number }>("counter_key")).toEqual({ count: 3 });
  });

  it("prevents previous account's state from leaking into new account upon key change", () => {
    const { result, rerender } = renderHook(
      ({ key }) => usePersistentState<string>(key, "empty"),
      { initialProps: { key: "userA_draft" } },
    );

    // User A writes a confidential draft
    act(() => {
      result.current[1]("confidential draft of User A");
    });

    expect(result.current[0]).toBe("confidential draft of User A");
    expect(loadState<string>("userA_draft")).toBe(
      "confidential draft of User A",
    );

    // User A logs out and User B logs in (key changes to userB_draft)
    rerender({ key: "userB_draft" });

    // User B must receive their own initial/empty value, NOT User A's draft!
    expect(result.current[0]).toBe("empty");

    // CRITICAL: userB_draft must NOT have been overwritten with User A's data!
    expect(loadState<string>("userB_draft")).toBeNull();

    // userA_draft is still intact
    expect(loadState<string>("userA_draft")).toBe(
      "confidential draft of User A",
    );
  });

  it("operates in-memory when key is null", () => {
    const { result } = renderHook(() =>
      usePersistentState<string>(null, "anonymous_initial"),
    );

    expect(result.current[0]).toBe("anonymous_initial");

    act(() => {
      result.current[1]("in_memory_only");
    });

    expect(result.current[0]).toBe("in_memory_only");
    // Nothing in localStorage
    expect(localStorage.length).toBe(0);
  });

  it("clears state and removes from storage when clearState is called", () => {
    const { result } = renderHook(() =>
      usePersistentState<string>("clear_key", "default"),
    );

    act(() => {
      result.current[1]("updated");
    });
    expect(loadState<string>("clear_key")).toBe("updated");

    act(() => {
      result.current[2](); // clearState
    });

    expect(result.current[0]).toBe("default");
    expect(loadState<string>("clear_key")).toBeNull();
  });

  it("synchronizes state when a storage event is received from another tab", () => {
    const { result } = renderHook(() =>
      usePersistentState<string>("sync_key", "initial"),
    );

    // Simulate cross-tab storage change
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "sync_key",
          newValue: JSON.stringify("updated_from_tab_2"),
        }),
      );
    });

    expect(result.current[0]).toBe("updated_from_tab_2");
  });

  it("resets state when a cross-tab logout sync event is received", () => {
    const { result } = renderHook(() =>
      usePersistentState<string>("user_draft_key", "clean_state"),
    );

    act(() => {
      result.current[1]("dirty_draft");
    });
    expect(result.current[0]).toBe("dirty_draft");

    // Simulate cross-tab logout
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: `${STORAGE_PREFIX}:sync:logout`,
          newValue: JSON.stringify({ timestamp: Date.now() }),
        }),
      );
    });

    expect(result.current[0]).toBe("clean_state");
  });
});
