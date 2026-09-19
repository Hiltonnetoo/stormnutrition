import React from "react";
import { useTranslation } from "react-i18next";
import { UsersIcon, PlusIcon } from "../icons";
import { Button, EmptyState as EmptyStateBase } from "../ui";

interface EmptyStateProps {
  onAddPatient: () => void;
}

/** First-use state of the patient list: nothing registered yet (UI06).
 *  "No search results" and loading/error are separate states in Patients. */
const EmptyState: React.FC<EmptyStateProps> = ({ onAddPatient }) => {
  const { t } = useTranslation();
  return (
    <EmptyStateBase
      className="py-20"
      icon={<UsersIcon className="w-8 h-8" />}
      title={t("patients.empty_title")}
      description={t("patients.empty_description")}
      action={
        <Button
          size="lg"
          onClick={onAddPatient}
          leftIcon={<PlusIcon className="h-5 w-5" />}
        >
          {t("patients.empty_cta")}
        </Button>
      }
    />
  );
};

export default EmptyState;
