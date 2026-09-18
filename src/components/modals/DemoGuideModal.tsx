import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "../ui";
import { SparklesIcon, ShieldIcon } from "../icons";

interface DemoGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();

  const steps = [
    {
      num: 1,
      title: t("demo.step_1_title"),
      desc: t("demo.step_1_desc"),
      tag: "Dra. Clara Mendes",
      color: "bg-sage-600 text-white",
    },
    {
      num: 2,
      title: t("demo.step_2_title"),
      desc: t("demo.step_2_desc"),
      tag: "Gerador de Dietas",
      color: "bg-emerald-600 text-white",
    },
    {
      num: 3,
      title: t("demo.step_3_title"),
      desc: t("demo.step_3_desc"),
      tag: "PDF Editorial",
      color: "bg-amber-600 text-white",
    },
    {
      num: 4,
      title: t("demo.step_4_title"),
      desc: t("demo.step_4_desc"),
      tag: "Ana Silva (Portal)",
      color: "bg-teal-600 text-white",
    },
    {
      num: 5,
      title: t("demo.step_5_title"),
      desc: t("demo.step_5_desc"),
      tag: "Dr. Marcos Lima",
      color: "bg-indigo-600 text-white",
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t("demo.guide_modal_title")}
      description={t("demo.guide_modal_subtitle")}
      icon={
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 dark:bg-sage-900/30 dark:text-sage-400">
          <SparklesIcon className="h-6 w-6" />
        </div>
      }
      footer={
        <div className="flex justify-end w-full">
          <Button variant="primary" onClick={onClose}>
            {t("demo.close_guide")}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${step.color}`}
              >
                {step.num}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {step.title}
                  </h4>
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600">
                    {step.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security and Isolation Callout */}
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-100">
            <ShieldIcon className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Garantias do Ambiente de Demonstração</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-900/90 dark:text-amber-200/90 pl-1">
            <li>
              <strong>Multi-tenant estrito:</strong> O Firestore valida
              `request.auth.uid` em cada regra de segurança.
            </li>
            <li>
              <strong>Proteção anti-spam:</strong> E-mails para domínios
              `@demo.stormnutrition.com` são interceptados sem chamada externa.
            </li>
            <li>
              <strong>Faturamento desacoplado:</strong> O módulo de assinatura é
              ilustrativo via localStorage e não dita privilégios no banco.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
