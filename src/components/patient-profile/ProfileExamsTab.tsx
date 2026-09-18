import React from "react";
import { useTranslation } from "react-i18next";
import type { Patient } from "../../types";
import { Card, Badge } from "../ui";
import BiomarkerEvolutionChart from "./BiomarkerEvolutionChart";

interface ProfileExamsTabProps {
  patient: Patient;
}

export const ProfileExamsTab: React.FC<ProfileExamsTabProps> = ({
  patient,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 py-2">
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
          {t("profile.biomarkers.title")}
        </h3>
        {patient.labExamHistory && patient.labExamHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BiomarkerEvolutionChart
              data={patient.labExamHistory
                .map((h) => {
                  const raw = h.exams.find((e) =>
                    e.name.toLowerCase().includes("glic"),
                  )?.value;
                  const parsed = raw ? parseFloat(raw) : 0;
                  return {
                    date: h.date,
                    value: isNaN(parsed) ? 0 : parsed,
                  };
                })
                .filter((d) => d.value > 0)}
              label={t("profile.biomarkers.fasting_glucose")}
              unit="mg/dL"
              color="#ef4444"
            />
            <BiomarkerEvolutionChart
              data={patient.labExamHistory
                .map((h) => {
                  const raw = h.exams.find((e) =>
                    e.name.toLowerCase().includes("ldl"),
                  )?.value;
                  const parsed = raw ? parseFloat(raw) : 0;
                  return {
                    date: h.date,
                    value: isNaN(parsed) ? 0 : parsed,
                  };
                })
                .filter((d) => d.value > 0)}
              label={t("profile.biomarkers.ldl_cholesterol")}
              unit="mg/dL"
              color="#3b82f6"
            />
          </div>
        ) : (
          <div className="text-center py-10 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-400 font-medium">
              {t("profile.biomarkers.insufficient_data")}
            </p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patient.lastLabExams && patient.lastLabExams.length > 0 ? (
          patient.lastLabExams.map((test, i) => (
            <Card key={i} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">
                  {test.name}
                </p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">
                  {test.value}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    {test.unit}
                  </span>
                </p>
              </div>
              <Badge tone={test.status === "alert" ? "rose" : "emerald"}>
                {test.status === "alert"
                  ? t("profile.biomarkers.altered")
                  : t("profile.biomarkers.normal")}
              </Badge>
            </Card>
          ))
        ) : (
          <p className="col-span-2 text-center text-slate-400 py-10">
            {t("profile.biomarkers.no_exams")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileExamsTab;
