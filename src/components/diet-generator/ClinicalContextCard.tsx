import React from "react";
import { useTranslation } from "react-i18next";
import { HeartIcon } from "../icons";

const modeTone: Record<string, string> = {
  clinical: "bg-rose-100 text-rose-700",
  performance: "bg-sky-100 text-sky-700",
  pediatric: "bg-violet-100 text-violet-700",
  recovery: "bg-indigo-100 text-indigo-700",
};

interface ClinicalContextCardProps {
  mode?: string;
  clinicalTags?: string[];
}

export const ClinicalContextCard: React.FC<ClinicalContextCardProps> = ({
  mode,
  clinicalTags,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 p-5 card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
          <HeartIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          {t("diet_generator.clinical_context")}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">
            {t("diet_generator.care_mode")}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${modeTone[mode ?? ""] || "bg-slate-100 text-slate-700"}`}
          >
            {t("profile.modes." + (mode ?? "general"))}
          </span>
        </div>
        {Array.isArray(clinicalTags) && clinicalTags.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">
              {t("diet_generator.monitored_conditions")}
            </p>
            <div className="flex flex-wrap gap-2">
              {clinicalTags.map((tag: string) => {
                const translatedTag = t(
                  "clinical_tags." + tag,
                  tag.replace(/_/g, " "),
                );
                return (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase rounded border border-rose-100 dark:border-rose-800"
                  >
                    {translatedTag}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-slate-400 italic">
        {t("diet_generator.on_behalf_of_patient")}
      </p>
    </div>
  );
};

export default ClinicalContextCard;
