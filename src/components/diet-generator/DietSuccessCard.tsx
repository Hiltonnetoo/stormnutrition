import React from "react";
import { useTranslation } from "react-i18next";
import type { Patient } from "../../types";
import { Card, Button } from "../ui";

interface DietSuccessCardProps {
  savedPatientData: Patient;
  onViewPatientProfile: () => void;
  onSendByEmail: () => void;
  onCreateAnother: () => void;
}

export const DietSuccessCard: React.FC<DietSuccessCardProps> = ({
  savedPatientData,
  onViewPatientProfile,
  onSendByEmail,
  onCreateAnother,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="p-8 flex flex-col items-center text-center animate-scale-in">
      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-5">
        🎉
      </div>
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
        {t("diet_generator.success_title", {
          name: savedPatientData.firstName,
        })}
      </h3>
      <p className="text-slate-500 text-sm mt-2 mb-8">
        {t("diet_generator.what_to_do_now")}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={onViewPatientProfile}
          className="bg-sky-600 hover:bg-sky-700 shadow-sky-600/25"
        >
          {t("diet_generator.view_patient_profile")}
        </Button>
        <Button variant="secondary" onClick={onSendByEmail}>
          {t("diet_generator.send_by_email")}
        </Button>
        <Button variant="ghost" onClick={onCreateAnother}>
          {t("diet_generator.create_another_plan")}
        </Button>
      </div>
    </Card>
  );
};

export default DietSuccessCard;
