import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Patient, DietPlan } from "../../types";
import { Card } from "../ui";
import { formatDateWithLocale } from "../../utils/locale";

interface ProfileTimelineTabProps {
  patient: Patient;
  diets: DietPlan[];
}

export const ProfileTimelineTab: React.FC<ProfileTimelineTabProps> = ({
  patient,
  diets,
}) => {
  const { t, i18n } = useTranslation();

  const timelineEvents = useMemo(() => {
    if (!patient) return [];
    const events: {
      date: string;
      title: string;
      description: string;
      icon: string;
      type: string;
    }[] = [];

    events.push({
      date: patient.createdAt,
      title: t("profile.timeline.patient_registered"),
      description: t("profile.timeline.patient_registered_desc"),
      icon: "👤",
      type: "registration",
    });

    diets.forEach((diet) => {
      events.push({
        date: diet.createdAt,
        title: t("profile.timeline.plan_generated"),
        description: t("profile.timeline.plan_generated_desc", {
          calories: diet.dailyCalories,
          mode: t(`profile.modes.${diet.mode}`, { defaultValue: diet.mode }),
        }),
        icon: "🍲",
        type: "diet",
      });
    });

    if (patient.lastLabExams && patient.lastLabExams.length > 0) {
      events.push({
        date: patient.lastLabExams[0].date || new Date().toISOString(),
        title: t("profile.timeline.exams_registered"),
        description: t("profile.timeline.exams_registered_desc", {
          count: patient.lastLabExams.length,
        }),
        icon: "🧪",
        type: "exam",
      });
    }

    if (patient.selfEvaluations) {
      patient.selfEvaluations.forEach((ev) => {
        if (ev.status === "completed") {
          events.push({
            date: ev.completionDate!,
            title: t("profile.timeline.assessment_completed"),
            description: t("profile.timeline.assessment_completed_desc", {
              weight: ev.measurements?.weight,
              sleep: ev.wellbeing?.sleepQuality,
            }),
            icon: "📝",
            type: "evaluation",
          });
        }
      });
    }

    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [patient, diets, t]);

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-8">
        {timelineEvents.map((event, i) => (
          <div key={i} className="relative pl-8">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-850 border-4 border-sage-500" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
              <h4 className="font-bold text-slate-800 dark:text-white">
                {event.title}
              </h4>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {formatDateWithLocale(event.date, i18n.language, {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <Card className="p-4 flex items-start gap-3">
              <div className="p-2 bg-sage-50 dark:bg-sage-900/30 rounded-lg text-lg shrink-0">
                {event.icon}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 self-center">
                {event.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileTimelineTab;
