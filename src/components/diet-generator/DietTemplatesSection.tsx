import React from "react";
import { useTranslation } from "react-i18next";
import type { DietTemplate } from "../../hooks/useDietTemplates";

interface DietTemplatesSectionProps {
  isOpen: boolean;
  templates: DietTemplate[];
  onApplyTemplate: (tmpl: DietTemplate) => void;
}

export const DietTemplatesSection: React.FC<DietTemplatesSectionProps> = ({
  isOpen,
  templates,
  onApplyTemplate,
}) => {
  const { t } = useTranslation();

  if (!isOpen || templates.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl animate-fade-in">
      <h4 className="text-sm font-bold text-violet-800 dark:text-violet-200 mb-3">
        📋 {t("diet_generator.saved_templates")}
      </h4>
      <div className="space-y-2">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-violet-100 dark:border-violet-700"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {tmpl.name}
              </p>
              <p className="text-xs text-slate-400">
                {tmpl.plan.dailyCalories} kcal · {tmpl.plan.dietType}
              </p>
            </div>
            <button
              onClick={() => onApplyTemplate(tmpl)}
              className="text-xs font-bold text-violet-600 hover:text-violet-800 bg-violet-100 hover:bg-violet-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              {t("diet_generator.use_template")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietTemplatesSection;
