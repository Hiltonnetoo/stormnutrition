/**
 * LocalStorage utility with namespacing, versioning, error resilience, and user session isolation.
 */

export const STORAGE_VERSION = "v1";
export const STORAGE_PREFIX = "isanutri";

/**
 * Legacy keys that historically held un-scoped drafts (containing sensitive patient/diet data).
 */
export const LEGACY_DRAFT_KEYS = [
  "newPatientFormState",
  "dietGeneratorFormState",
] as const;

/**
 * Generates a scoped storage key for a specific user and data domain.
 * Format: isanutri:{uid}:{subKey}:v1
 */
export const getUserStorageKey = (uid: string, subKey: string): string => {
  return `${STORAGE_PREFIX}:${uid}:${subKey}:${STORAGE_VERSION}`;
};

/**
 * Checks if localStorage is available in the current environment.
 */
export const isStorageAvailable = (): boolean => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return false;
  }
  try {
    const testKey = `__${STORAGE_PREFIX}_test__`;
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Saves state to localStorage safely with quota and availability error handling.
 * @returns true if saved successfully, false otherwise.
 */
export const saveState = <T>(key: string, state: T): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
    return true;
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      console.warn(`[Storage] Quota exceeded while saving key "${key}".`);
    } else {
      console.warn(`[Storage] Could not save state for key "${key}":`, error);
    }
    return false;
  }
};

/**
 * Loads state from localStorage safely with JSON corruption resilience and optional schema validation.
 */
export const loadState = <T>(
  key: string,
  fallback: T | null = null,
  validator?: (data: unknown) => data is T,
): T | null => {
  if (!isStorageAvailable()) {
    return fallback;
  }
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return fallback;
    }
    const parsed = JSON.parse(serializedState) as unknown;
    if (validator && !validator(parsed)) {
      console.warn(`[Storage] State for key "${key}" failed validation.`);
      return fallback;
    }
    return parsed as T;
  } catch (error) {
    console.warn(`[Storage] Could not parse state for key "${key}":`, error);
    return fallback;
  }
};

/**
 * Removes a key from localStorage safely.
 */
export const removeState = (key: string): void => {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Storage] Could not remove key "${key}":`, error);
  }
};

/**
 * Saves state scoped to an authenticated user UID.
 */
export const saveUserState = <T>(
  uid: string,
  subKey: string,
  state: T,
): boolean => {
  return saveState(getUserStorageKey(uid, subKey), state);
};

/**
 * Loads state scoped to an authenticated user UID.
 */
export const loadUserState = <T>(
  uid: string,
  subKey: string,
  fallback: T,
  validator?: (data: unknown) => data is T,
): T => {
  const result = loadState<T>(
    getUserStorageKey(uid, subKey),
    fallback,
    validator,
  );
  return result ?? fallback;
};

/**
 * Removes state scoped to an authenticated user UID.
 */
export const removeUserState = (uid: string, subKey: string): void => {
  removeState(getUserStorageKey(uid, subKey));
};

/**
 * Purges legacy un-scoped draft keys from localStorage so unknown drafts
 * are never adopted by a newly signed-in user.
 */
export const purgeLegacyDrafts = (): void => {
  if (!isStorageAvailable()) return;
  for (const key of LEGACY_DRAFT_KEYS) {
    removeState(key);
  }
};

/**
 * Clears user session drafts and data from localStorage.
 * Called on logout or when switching accounts.
 *
 * @param uid Optional UID to clean only that user's scoped items.
 * @param clearAllUserData If true, removes all data keys for this user (drafts + preferences). If false, only drafts.
 */
export const clearUserSessionData = (
  uid?: string,
  clearAllUserData: boolean = true,
): void => {
  if (!isStorageAvailable()) return;

  try {
    // 1. Always purge legacy un-scoped drafts
    purgeLegacyDrafts();

    // 2. Iterate through localStorage keys to clean user-scoped items
    const keysToRemove: string[] = [];
    const prefixToMatch = uid
      ? `${STORAGE_PREFIX}:${uid}:`
      : `${STORAGE_PREFIX}:`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (key.startsWith(prefixToMatch)) {
        if (
          clearAllUserData ||
          key.includes("Draft") ||
          key.includes("newPatientDraft") ||
          key.includes("dietGeneratorDraft")
        ) {
          keysToRemove.push(key);
        }
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }

    // 3. Broadcast cross-tab logout/sync notification
    localStorage.setItem(
      `${STORAGE_PREFIX}:sync:logout`,
      JSON.stringify({ timestamp: Date.now(), uid: uid ?? null }),
    );
  } catch (error) {
    console.warn("[Storage] Error clearing user session data:", error);
  }
};
