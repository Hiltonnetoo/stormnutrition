import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Shared step indicator (UI09) for the patient form and the diet generator:
 * same vocabulary ("Etapa X de Y"), same completed/current/upcoming states
 * and no infinite animation on the current step.
 */
export interface StepProgressStep {
  number: number;
  label: string;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const StepProgress: React.FC<{
  steps: StepProgressStep[];
  currentStep: number;
  canNavigate: (stepNumber: number) => boolean;
  goToStep: (step: number) => void;
  className?: string;
}> = ({ steps, currentStep, canNavigate, goToStep, className }) => {
  const { t } = useTranslation();
  const current = steps.find((s) => s.number === currentStep);
  return (
    <nav aria-label={t("a11y.form_progress")} className={className}>
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const navigable = canNavigate(step.number);
          const stepName = t(
            isCompleted
              ? "a11y.step_completed"
              : isActive
                ? "a11y.step_current"
                : "a11y.step_upcoming",
            { number: step.number, label: step.label },
          );
          return (
            <li key={step.number} className="relative flex-1">
              {stepIdx < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${isCompleted ? "bg-sage-600" : "bg-slate-200"}`}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={() => navigable && goToStep(step.number)}
                disabled={!navigable}
                aria-label={stepName}
                aria-current={isActive ? "step" : undefined}
                className={`relative z-10 flex flex-col items-center justify-center w-full rounded-lg focus-ring ${navigable ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  aria-hidden="true"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                    isCompleted
                      ? "bg-sage-600 text-white"
                      : isActive
                        ? "border-2 border-sage-600 bg-sage-50 text-sage-800"
                        : "border-2 border-slate-300 bg-white text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-2 text-xs text-center font-semibold hidden sm:block ${isActive ? "text-sage-700" : "text-slate-500"}`}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {current && (
        // Phones hide per-step labels; this line keeps the context visible.
        <p
          aria-hidden="true"
          className="sm:hidden mt-2 text-center text-xs font-semibold text-slate-600"
        >
          {t("progress.step_of", {
            current: current.number,
            total: steps.length,
            label: current.label,
          })}
        </p>
      )}
    </nav>
  );
};

export default StepProgress;
