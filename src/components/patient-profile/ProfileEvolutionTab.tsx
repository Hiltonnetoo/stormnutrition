import React from "react";
import { useTranslation } from "react-i18next";
import type { Patient } from "../../types";
import { Card } from "../ui";
import WeightEvolutionChart from "./WeightEvolutionChart";

interface ProfileEvolutionTabProps {
  patient: Patient;
}

export const ProfileEvolutionTab: React.FC<ProfileEvolutionTabProps> = ({
  patient,
}) => {
  const { t } = useTranslation();

  const initialWeight = patient.weightHistory?.[0]?.weight || patient.weight;
  const weightDelta = patient.weight - initialWeight;

  const weightData =
    patient.weightHistory && patient.weightHistory.length > 0
      ? patient.weightHistory
      : [
          {
            date: patient.createdAt,
            weight: patient.weight,
            origin:
              patient.anthropometryMetadata?.weightOrigin &&
              patient.anthropometryMetadata.weightOrigin !== "not_available"
                ? patient.anthropometryMetadata.weightOrigin
                : "self_reported",
          },
        ];

  return (
    <div className="py-2 space-y-6">
      <WeightEvolutionChart data={weightData} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1.5">
            {t("profile.evolution.initial_weight")}
          </p>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-white">
            {initialWeight} kg
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1.5">
            {t("profile.evolution.total_variation")}
          </p>
          <p
            className={`text-2xl font-extrabold ${weightDelta <= 0 ? "text-emerald-600" : "text-sky-600"}`}
          >
            {weightDelta.toFixed(1)} kg
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1.5">
            {t("profile.evolution.goal")}
          </p>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-white">
            {patient.nutritionalGoal === "weight_loss"
              ? t("profile.evolution.goal_reduction")
              : patient.nutritionalGoal === "weight_gain"
                ? t("profile.evolution.goal_gain")
                : t("profile.evolution.goal_maintenance")}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEvolutionTab;
