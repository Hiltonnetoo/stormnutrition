import { useState, useEffect, useCallback, useRef } from "react";
import {
  loadState,
  saveState,
  removeState,
  STORAGE_PREFIX,
} from "../utils/localStorage";

type SetValue<T> = (value: T | ((val: T) => T)) => void;

/**
 * Hook for persisting state to localStorage with user isolation,
 * atomic functional updates, and cross-tab synchronization.
 *
 * @param key Storage key or null (if null, behaves purely in-memory).
 * @param initialValue Default value when no data exists in storage.
 */
function usePersistentState<T>(
  key: string | null,
  initialValue: T,
): [T, SetValue<T>, () => void] {
  const keyRef = useRef<string | null>(key);
  const initialValueRef = useRef<T>(initialValue);
  initialValueRef.current = initialValue;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!key) return initialValue;
    const fromStorage = loadState<T>(key);
    return fromStorage ?? initialValue;
  });

  // Track key changes: when key changes, reload fresh data from new key without saving previous state!
  useEffect(() => {
    keyRef.current = key;
    if (key) {
      const fromStorage = loadState<T>(key);
      setStoredValue(fromStorage ?? initialValueRef.current);
    } else {
      setStoredValue(initialValueRef.current);
    }
  }, [key]);

  // Atomic state updates: always evaluates functional updater with freshest value
  const setValue: SetValue<T> = useCallback((value) => {
    setStoredValue((currentVal) => {
      const nextVal =
        typeof value === "function"
          ? (value as (val: T) => T)(currentVal)
          : value;

      const currentKey = keyRef.current;
      if (currentKey) {
        saveState(currentKey, nextVal);
      }
      return nextVal;
    });
  }, []);

  // Explicitly clear persisted state
  const clearState = useCallback(() => {
    const currentKey = keyRef.current;
    if (currentKey) {
      removeState(currentKey);
    }
    setStoredValue(initialValueRef.current);
  }, []);

  // Cross-tab synchronization via storage event
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      const currentKey = keyRef.current;

      // When the current key is updated from another tab
      if (currentKey && event.key === currentKey) {
        if (event.newValue === null) {
          setStoredValue(initialValueRef.current);
        } else {
          try {
            const parsed = JSON.parse(event.newValue) as T;
            setStoredValue(parsed);
          } catch {
            setStoredValue(initialValueRef.current);
          }
        }
      }

      // When a global logout occurred in another tab
      if (event.key === `${STORAGE_PREFIX}:sync:logout`) {
        setStoredValue(initialValueRef.current);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return [storedValue, setValue, clearState];
}

export default usePersistentState;
