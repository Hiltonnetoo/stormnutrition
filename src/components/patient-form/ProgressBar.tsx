import React from "react";
import { useTranslation } from "react-i18next";
import StepProgress from "../StepProgress";

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

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  goToStep,
  isEditMode = false,
}) => {
  const { t } = useTranslation();
  return (
    <StepProgress
      steps={steps.map((s) => ({
        number: s.number,
        label: t("patient_form.steps." + s.key),
      }))}
      currentStep={currentStep}
      goToStep={goToStep}
      canNavigate={(n) => n < currentStep || isEditMode}
    />
  );
};

export default ProgressBar;
