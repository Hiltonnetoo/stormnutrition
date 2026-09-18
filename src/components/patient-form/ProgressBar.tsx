import React from "react";
import { useTranslation } from "react-i18next";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  isEditMode?: boolean;
}

const steps = [
  { number: 1, key: "personal" },
  { number: 2, key: "contact" },
  { number: 3, key: "professional" },
  { number: 4, key: "nutritional" },
  { number: 5, key: "anthropometric" },
  { number: 6, key: "exams" },
  { number: 7, key: "summary" },
];

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
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

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  goToStep,
  isEditMode = false,
}) => {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("a11y.form_progress")}>
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const canNavigate = isCompleted || isEditMode;
          const label = t("patient_form.steps." + step.key);
          const stepName = t(
            isCompleted
              ? "a11y.step_completed"
              : isActive
                ? "a11y.step_current"
                : "a11y.step_upcoming",
            { number: step.number, label },
          );

          return (
            <li key={step.key} className="relative flex-1">
              {stepIdx < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${isCompleted ? "bg-sage-500" : "bg-slate-200 dark:bg-slate-700"}`}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={() => canNavigate && goToStep(step.number)}
                disabled={!canNavigate}
                aria-label={stepName}
                aria-current={isActive ? "step" : undefined}
                className={`relative z-10 flex flex-col items-center justify-center w-full rounded-lg focus-ring ${canNavigate ? "cursor-pointer" : "cursor-default"}`}
              >
                <div
                  aria-hidden="true"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-sage-600 text-white shadow-md shadow-sage-600/25"
                      : isActive
                        ? "border-2 border-sage-500 bg-white dark:bg-slate-800"
                        : "border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : isActive ? (
                    <>
                      <span
                        className="absolute h-5 w-5 rounded-full bg-sage-200 animate-ping"
                        aria-hidden="true"
                      />
                      <span
                        className="relative h-2.5 w-2.5 bg-sage-500 rounded-full"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <span className="text-slate-400 text-sm font-semibold">
                      {step.number}
                    </span>
                  )}
                </div>
                <p
                  aria-hidden="true"
                  className={`mt-2 text-[11px] text-center font-semibold transition-colors hidden sm:block ${isActive ? "text-sage-600 dark:text-sage-300" : "text-slate-500"}`}
                >
                  {label}
                </p>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressBar;
