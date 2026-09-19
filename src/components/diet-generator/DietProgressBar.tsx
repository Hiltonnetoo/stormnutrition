import React from "react";
import { useTranslation } from "react-i18next";
import StepProgress from "../StepProgress";

interface DietProgressBarProps {
  currentStep: number;
  goToStep: (step: number) => void;
  completedSteps: boolean[];
}

const DietProgressBar: React.FC<DietProgressBarProps> = ({
  currentStep,
  goToStep,
  completedSteps,
}) => {
  const { t } = useTranslation();
  return (
    <StepProgress
      className="w-full max-w-sm mx-auto"
      steps={[
        { number: 1, label: t("diet_generator.step1_title") },
        { number: 2, label: t("diet_generator.step2_title") },
        { number: 3, label: t("diet_generator.step3_title") },
      ]}
      currentStep={currentStep}
      goToStep={goToStep}
      canNavigate={(n) => completedSteps[n - 1] || n < currentStep}
    />
  );
};

export default DietProgressBar;
