import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getUserStorageKey,
  saveState,
  loadState,
  removeState,
  saveUserState,
  loadUserState,
  removeUserState,
  purgeLegacyDrafts,
  clearUserSessionData,
  STORAGE_PREFIX,
  STORAGE_VERSION,
  LEGACY_DRAFT_KEYS,
} from "../localStorage";

describe("localStorage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getUserStorageKey", () => {
    it("formats key as isanutri:{uid}:{subKey}:v1", () => {
      expect(STORAGE_VERSION).toBe("v1");
      const key = getUserStorageKey("user123", "clinicName");
      expect(key).toBe(`isanutri:user123:clinicName:v1`);
    });
  });

  describe("saveState and loadState", () => {
    it("saves and retrieves objects successfully", () => {
      const data = { foo: "bar", count: 42 };
      const saved = saveState("test_key", data);
      expect(saved).toBe(true);

      const loaded = loadState<typeof data>("test_key");
      expect(loaded).toEqual(data);
    });

    it("returns fallback when key does not exist", () => {
      const loaded = loadState<string>("non_existent", "default_val");
      expect(loaded).toBe("default_val");
    });

    it("handles corrupted JSON gracefully without crashing", () => {
      localStorage.setItem("corrupt_key", "{ invalid json");
      const loaded = loadState<string>("corrupt_key", "safe_fallback");
      expect(loaded).toBe("safe_fallback");
    });

    it("validates data using validator function when provided", () => {
      saveState("number_key", "this is not a number");

      const isNumber = (val: unknown): val is number => typeof val === "number";
      const loaded = loadState<number>("number_key", 999, isNumber);
      expect(loaded).toBe(999);
    });

    it("handles QuotaExceededError gracefully without throwing", () => {
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation((key) => {
          if (key === "huge_key") {
            throw new DOMException("Quota exceeded", "QuotaExceededError");
          }
        });

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = saveState("huge_key", { huge: "data" });
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });

  describe("removeState", () => {
    it("removes specified key from localStorage", () => {
      saveState("to_remove", { a: 1 });
      expect(loadState("to_remove")).toEqual({ a: 1 });

      removeState("to_remove");
      expect(loadState("to_remove")).toBeNull();
    });
  });

  describe("user-scoped helpers (saveUserState, loadUserState, removeUserState)", () => {
    it("isolates data between two users", () => {
      saveUserState("userA", "settings", { theme: "dark" });
      saveUserState("userB", "settings", { theme: "light" });

      const settingsA = loadUserState("userA", "settings", {
        theme: "default",
      });
      const settingsB = loadUserState("userB", "settings", {
        theme: "default",
      });

      expect(settingsA).toEqual({ theme: "dark" });
      expect(settingsB).toEqual({ theme: "light" });

      removeUserState("userA", "settings");
      expect(loadUserState("userA", "settings", { theme: "default" })).toEqual({
        theme: "default",
      });
      expect(loadUserState("userB", "settings", { theme: "default" })).toEqual({
        theme: "light",
      });
    });
  });

  describe("purgeLegacyDrafts", () => {
    it("removes all legacy un-scoped draft keys", () => {
      for (const key of LEGACY_DRAFT_KEYS) {
        localStorage.setItem(key, JSON.stringify({ secret: "data" }));
      }

      purgeLegacyDrafts();

      for (const key of LEGACY_DRAFT_KEYS) {
        expect(localStorage.getItem(key)).toBeNull();
      }
    });
  });

  describe("clearUserSessionData", () => {
    it("clears user-specific data and legacy drafts and sets sync logout event", () => {
      saveUserState("userA", "newPatientDraft", { name: "Alice" });
      saveUserState("userA", "clinicName", "Clinic A");
      saveUserState("userB", "clinicName", "Clinic B");
      localStorage.setItem("newPatientFormState", "legacy patient");

      clearUserSessionData("userA", true);

      // User A data is purged
      expect(loadUserState("userA", "newPatientDraft", null)).toBeNull();
      expect(loadUserState("userA", "clinicName", null)).toBeNull();

      // Legacy draft is purged
      expect(localStorage.getItem("newPatientFormState")).toBeNull();

      // User B data remains intact!
      expect(loadUserState("userB", "clinicName", null)).toBe("Clinic B");

      // Cross-tab sync event was written
      const syncVal = localStorage.getItem(`${STORAGE_PREFIX}:sync:logout`);
      expect(syncVal).not.toBeNull();
      const parsedSync = JSON.parse(syncVal!);
      expect(parsedSync.uid).toBe("userA");
    });
  });
});
