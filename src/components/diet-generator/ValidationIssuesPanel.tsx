import React from "react";
import { useTranslation } from "react-i18next";
import type { PlanValidationIssue } from "../../types";
import { AlertTriangleIcon, XCircleIcon } from "../icons";
import {
  formatAlternativeGroup,
  formatIssue,
  formatIssueSummary,
  groupValidationIssues,
} from "../../utils/validationPresentation";
import { translateMealName } from "../../utils/locale";

/**
 * A1 — validation issues as the professional reads them: a one-line summary,
 * blockers first (always open), then daily targets, sodium and alternatives
 * grouped by meal (one line per alternative, collapsed by meal).
 * `compact` is used inside the review dialog.
 */
const ValidationIssuesPanel: React.FC<{
  issues?: readonly PlanValidationIssue[];
  compact?: boolean;
  className?: string;
}> = ({ issues = [], compact, className }) => {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const grouped = groupValidationIssues(issues);
  if (!grouped.blockers.length && !grouped.warningLines) return null;

  const section = (title: string, lines: string[]) =>
    lines.length > 0 && (
      <div>
        <p className="font-bold text-amber-900">{title}</p>
        <ul className="mt-1 space-y-1">
          {lines.map((line, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div
      className={`space-y-3 no-export ${className ?? ""}`}
      data-testid="validation-issues"
    >
      <p className="text-sm font-semibold text-slate-800">
        {formatIssueSummary(grouped, t)}
      </p>

      {grouped.blockers.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800"
        >
          <p className="mb-1.5 flex items-center gap-2 font-bold">
            <XCircleIcon className="h-4 w-4 shrink-0" />
            {t("diet_generator.display.clinical_blockers_title")}
          </p>
          <ul className="space-y-1">
            {grouped.blockers.map((issue, i) => (
              <li key={i}>{formatIssue(issue, t, lng)}</li>
            ))}
          </ul>
        </div>
      )}

      {grouped.warningLines > 0 && (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
          <p className="flex items-center gap-2 font-bold">
            <AlertTriangleIcon className="h-4 w-4 shrink-0" />
            {t("diet_generator.display.clinical_warnings_title")}
          </p>
          {section(
            t("diet_validation.groups.daily"),
            grouped.daily.map((i) => formatIssue(i, t, lng)),
          )}
          {section(
            t("diet_validation.groups.sodium"),
            grouped.sodium.map((i) => formatIssue(i, t, lng)),
          )}
          {(grouped.alternativesByMeal.length > 0 ||
            grouped.worstCase.length > 0) && (
            <div>
              <p className="font-bold text-amber-900">
                {t("diet_validation.groups.alternatives")}
              </p>
              {grouped.worstCase.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                    {t("diet_validation.groups.worst_case")}
                  </p>
                  <ul className="mt-0.5 space-y-1">
                    {grouped.worstCase.map((issue, i) => (
                      <li key={i}>{formatIssue(issue, t, lng)}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2 space-y-1.5">
                {grouped.alternativesByMeal.map((meal) => (
                  <details
                    key={meal.mealName}
                    open={!compact && grouped.alternativesByMeal.length === 1}
                  >
                    <summary className="cursor-pointer rounded font-semibold focus-ring">
                      {t("diet_validation.groups.meal_alternatives", {
                        meal: translateMealName(meal.mealName, t),
                        count: meal.groups.length,
                      })}
                    </summary>
                    <ul className="mt-1 space-y-1 pl-4">
                      {meal.groups.map((group, i) => (
                        <li key={i} className="list-disc">
                          {formatAlternativeGroup(group, t, lng)}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          )}
          {section(
            t("diet_validation.groups.other"),
            grouped.other.map((i) => formatIssue(i, t, lng)),
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationIssuesPanel;
