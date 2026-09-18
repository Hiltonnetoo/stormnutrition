import React from "react";
import { useTranslation } from "react-i18next";
import type { Patient } from "../../types";
import { Card, Button } from "../ui";
import { calcAge } from "../../utils/calcAge";
import { formatNumberWithLocale } from "../../utils/locale";

interface ProfileHeaderProps {
  patient: Patient;
  onNewConsultation: () => void;
  onGenerateDiet: () => void;
}

const modeTone: Record<string, string> = {
  clinical: "bg-rose-100 text-rose-700",
  performance: "bg-sky-100 text-sky-700",
  recovery: "bg-violet-100 text-violet-700",
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  patient,
  onNewConsultation,
  onGenerateDiet,
}) => {
  const { t, i18n } = useTranslation();

  const headerStats = [
    {
      icon: "⚖️",
      label: t("profile.label_weight"),
      value: `${patient.weight} kg`,
    },
    {
      icon: "📏",
      label: t("profile.label_height"),
      value: `${formatNumberWithLocale(patient.height / 100, i18n.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} m`,
    },
    {
      icon: "🎯",
      label: t("profile.label_goal"),
      value: t(`profile.goals.${patient.nutritionalGoal || "maintenance"}`, {
        defaultValue: "Maintenance",
      }),
    },
  ];

  return (
    <Card className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
      <img
        src={patient.avatarUrl}
        alt={patient.firstName}
        className="w-24 h-24 rounded-2xl ring-4 ring-sage-50 shadow-md object-cover shrink-0"
      />
      <div className="flex-1 text-center md:text-left min-w-0">
        <div className="flex flex-col md:flex-row md:items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {patient.firstName} {patient.lastName}
          </h1>
          <span
            className={`mx-auto md:mx-0 w-fit px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${modeTone[patient.mode || ""] || "bg-sage-100 text-sage-700"}`}
          >
            {t("profile.label_mode")}:{" "}
            {t(`profile.modes.${patient.mode || "general"}`, {
              defaultValue: "General",
            })}
          </span>
        </div>
        <p className="text-slate-500 mt-1 font-medium">
          {patient.gender === "male"
            ? t("profile.gender_male")
            : t("profile.gender_female")}{" "}
          ·{" "}
          {calcAge(patient.dob)
            ? t("profile.years_old", { count: calcAge(patient.dob) })
            : "N/A"}{" "}
          · {patient.profession}
        </p>
        <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
          {headerStats.map((m) => (
            <div
              key={m.label}
              className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <span className="text-lg">{m.icon}</span>
              <div className="text-left">
                <p className="text-[11px] text-slate-400 font-bold uppercase">
                  {m.label}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">
                  {m.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <Button onClick={onNewConsultation}>
          {t("profile.new_consultation_btn")}
        </Button>
        <Button variant="secondary" onClick={onGenerateDiet}>
          {t("profile.generate_diet_btn")}
        </Button>
      </div>
    </Card>
  );
};

export default ProfileHeader;
