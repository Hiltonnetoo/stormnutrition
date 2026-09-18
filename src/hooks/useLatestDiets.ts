import { useEffect, useRef, useState } from "react";
import type { FirestoreError } from "firebase/firestore";
import { subscribeLatestDiet } from "../services/firebaseService";
import type { AnyDietPlan } from "../types";

/**
 * Latest diet of each patient currently on screen, one `limit(1)` listener per
 * row. Rows that stay visible keep their listener when the list grows ("show
 * more"); rows that leave the screen are unsubscribed.
 *
 * Map value: `undefined` while loading, `null` when the patient has no diet.
 */
export function useLatestDiets(
  userId: string | undefined,
  patientIds: string[],
) {
  const [latest, setLatest] = useState<Map<string, AnyDietPlan | null>>(
    () => new Map(),
  );
  const [error, setError] = useState<FirestoreError | null>(null);
  const subscriptions = useRef(new Map<string, () => void>());
  const key = patientIds.join("|");

  useEffect(() => {
    if (!userId) return;
    const subs = subscriptions.current;
    const wanted = new Set(key ? key.split("|") : []);
    for (const [id, unsubscribe] of subs) {
      if (!wanted.has(id)) {
        unsubscribe();
        subs.delete(id);
      }
    }
    for (const id of wanted) {
      if (subs.has(id)) continue;
      subs.set(
        id,
        subscribeLatestDiet(
          userId,
          id,
          (diet) =>
            setLatest((prev) => {
              const next = new Map(prev);
              next.set(id, diet);
              return next;
            }),
          setError,
        ),
      );
    }
  }, [userId, key]);

  // Stop everything on unmount or account switch.
  useEffect(() => {
    const subs = subscriptions.current;
    return () => {
      subs.forEach((unsubscribe) => unsubscribe());
      subs.clear();
      setLatest(new Map());
    };
  }, [userId]);

  return { latest, error };
}
