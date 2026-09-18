import { useState, useEffect, useCallback } from "react";
import { loadUserState, saveUserState } from "../utils/localStorage";
import type { DietPlan } from "../types";

export interface DietTemplate {
  id: string;
  name: string;
  plan: DietPlan;
}

export function useDietTemplates(currentUserUid?: string) {
  const [templates, setTemplates] = useState<DietTemplate[]>([]);

  useEffect(() => {
    if (currentUserUid) {
      const loaded = loadUserState<DietTemplate[]>(
        currentUserUid,
        "dietPlanTemplates",
        [],
      );
      setTemplates(loaded);
    } else {
      setTemplates([]);
    }
  }, [currentUserUid]);

  const saveTemplate = useCallback(
    (name: string, plan: DietPlan) => {
      if (!currentUserUid || !name.trim()) return;
      const newTemplate: DietTemplate = {
        id: `tmpl_${Date.now()}`,
        name: name.trim(),
        plan,
      };
      const updated = [...templates, newTemplate];
      saveUserState(currentUserUid, "dietPlanTemplates", updated);
      setTemplates(updated);
    },
    [currentUserUid, templates],
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      if (!currentUserUid) return;
      const updated = templates.filter((t) => t.id !== id);
      saveUserState(currentUserUid, "dietPlanTemplates", updated);
      setTemplates(updated);
    },
    [currentUserUid, templates],
  );

  return {
    templates,
    saveTemplate,
    deleteTemplate,
  };
}
