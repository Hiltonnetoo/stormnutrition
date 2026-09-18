import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { saveDietPlan, updateDietPlan } from "../services/firebaseService";
import { usePatientDirectory } from "../hooks/usePatientDirectory";
import { useFocusOnChange } from "../hooks/useFocusOnChange";
import { focusFirstInvalid } from "../utils/a11y";
import { calcAge } from "../utils/calcAge";
import {
  generateAlgorithmicDietPlan,
  getGeneralObservations,
} from "../services/dietAlgorithmService";
import usePersistentState from "../hooks/usePersistentState";
import { getUserStorageKey } from "../utils/localStorage";
import * as M from "../services/metabolicCalculations";
import { dietaryOptionsMap } from "../components/patient-form/Step4Nutritional";

import type { Patient, DietPlan } from "../types";
import type { DietFormData } from "../components/diet-generator/dietForm.types";
import { UtensilsIcon, HeartIcon } from "../components/icons";
import DietProgressBar from "../components/diet-generator/DietProgressBar";
import Step1Objectives from "../components/diet-generator/DietStep1Objectives";
import Step2Nutrition from "../components/diet-generator/DietStep2Nutrition";
import Step3MealPlan from "../components/diet-generator/DietStep3MealPlan";
import DietPlanDisplay from "../components/diet-generator/DietPlanDisplay";
import LabExamsModule from "../components/diet-generator/LabExamsModule";
import QuickCalculator from "../components/diet-generator/QuickCalculator";
import ClinicalContextCard from "../components/diet-generator/ClinicalContextCard";
import DietTemplatesSection from "../components/diet-generator/DietTemplatesSection";
import DietSuccessCard from "../components/diet-generator/DietSuccessCard";
import { useDietTemplates, type DietTemplate } from "../hooks/useDietTemplates";
import { PageHeader, Card, Button, Badge, Spinner } from "../components/ui";

const fieldClass = "input-field";

const defaultMealPlan = {
  numberOfMeals: 5,
  meals: [
    { name: "Café da Manhã", time: "07:00", percentage: 20 },
    { name: "Lanche da Manhã", time: "10:00", percentage: 10 },
    { name: "Almoço", time: "13:00", percentage: 30 },
    { name: "Lanche da Tarde", time: "16:00", percentage: 15 },
    { name: "Jantar", time: "20:00", percentage: 25 },
  ],
  durationDays: 7,
  startDate: new Date().toISOString().split("T")[0],
  finalObservations: "",
};

/* ------------------------------------------------------------- Diet generator */
const DietGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);

  const { patients, error: patientsError } = usePatientDirectory();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const formStorageKey = currentUser?.uid
    ? getUserStorageKey(currentUser.uid, "dietGeneratorDraft")
    : null;
  const [formData, setFormData, clearFormData] =
    usePersistentState<DietFormData>(formStorageKey, {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [tdeeAppliedMsg, setTdeeAppliedMsg] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const { templates: dietTemplates } = useDietTemplates(currentUser?.uid);

  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Focus follows the wizard: new step heading, generated plan, save result.
  const stepRegionRef = useRef<HTMLDivElement>(null);
  const resultRegionRef = useRef<HTMLDivElement>(null);
  const [resultFocusKey, setResultFocusKey] = useState(0);
  const [savedPatientData, setSavedPatientData] = useState<Patient | null>(
    null,
  );
  const [apiError, setApiError] = useState<string | null>(null);
  useFocusOnChange(step, stepRegionRef, "h3");
  useFocusOnChange(resultFocusKey, resultRegionRef, "h2, h3");
  const [editingDietId, setEditingDietId] = useState<string | null>(null);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId),
    [patients, selectedPatientId],
  );

  // Editing from sessionStorage
  useEffect(() => {
    const dietToEditStr = sessionStorage.getItem("dietToEdit");
    const patientForDietStr = sessionStorage.getItem("patientForDiet");
    if (dietToEditStr && patientForDietStr && patients.length > 0) {
      try {
        const dietToEdit = JSON.parse(dietToEditStr) as DietPlan;
        const patientForDiet = JSON.parse(patientForDietStr) as Patient;
        const patient = patients.find((p) => p.id === patientForDiet.id);
        if (patient) {
          setSelectedPatientId(patient.id!);
          setEditingDietId(dietToEdit.id || null);
          const dailyCalories = dietToEdit.dailyCalories || 2000;
          setFormData({
            goal: "weight_loss",
            currentWeight: patient.weight || 0,
            targetWeight: patient.weight || 0,
            deadlineWeeks: 4,
            activityLevel: patient.activityLevel || "moderately_active",
            dietType: dietToEdit.dietType || "traditional",
            dailyCalories,
            macros: {
              protein: dietToEdit.macronutrients?.proteinPercentage || 30,
              carbs: dietToEdit.macronutrients?.carbsPercentage || 40,
              fat: dietToEdit.macronutrients?.fatPercentage || 30,
            },
            durationDays: dietToEdit.durationDays || 7,
            startDate:
              dietToEdit.startDate || new Date().toISOString().split("T")[0],
            numberOfMeals: (dietToEdit.meals || []).length || 5,
            meals: (dietToEdit.meals || []).map((m) => ({
              name: m.mealName,
              time: m.time,
              percentage:
                dailyCalories > 0
                  ? Math.round((m.calories / dailyCalories) * 100)
                  : 20,
            })),
            finalObservations: Array.isArray(dietToEdit.generalObservations)
              ? dietToEdit.generalObservations.join("\n")
              : "",
          });
          setGeneratedPlan(dietToEdit);
          setStep(3);
          setCompletedSteps([true, true, true]);
        }
        // Limpa o sessionStorage SOMENTE após processamento bem-sucedido
        sessionStorage.removeItem("dietToEdit");
        sessionStorage.removeItem("patientForDiet");
      } catch (err) {
        console.error("Error parsing diet to edit:", err);
        setApiError(
          "Não foi possível carregar o plano para edição. Recarregue a página para tentar novamente.",
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients]);

  const updateFormData = (newData: Partial<DietFormData>) =>
    setFormData((prev) => ({ ...prev, ...newData }));

  useEffect(() => {
    if (patientsError) {
      console.error(
        "Error fetching patients for diet generator:",
        patientsError,
      );
      setApiError(
        "Falha ao carregar a lista de pacientes. Recarregue a página.",
      );
    }
  }, [patientsError]);

  // Auto-seleciona o paciente quando vindo de /patients/:id?patient=:id
  useEffect(() => {
    const prePatientId = searchParams.get("patient");
    if (prePatientId && patients.length > 0 && !selectedPatientId) {
      const patient = patients.find((p) => p.id === prePatientId);
      if (patient) {
        const event = {
          target: { value: patient.id },
        } as React.ChangeEvent<HTMLSelectElement>;
        handlePatientChange(event);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients, searchParams]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      clearFormData();
      const translatedRestrictions = (patient.dietaryRestrictions || [])
        .map((key) => dietaryOptionsMap[key] || key)
        .join(", ");
      setFormData({
        goal: patient.nutritionalGoal || "weight_loss",
        currentWeight: patient.weight || 0,
        targetWeight: patient.weight || 0,
        deadlineWeeks: 4,
        activityLevel: patient.activityLevel || "moderately_active",
        mode: patient.mode || "general",
        clinicalTags: patient.clinicalTags || [],
        specialObservations:
          translatedRestrictions +
          (patient.foodAllergies ? `, ${patient.foodAllergies}` : ""),
        macros: M.getMacroDistributionForMode(patient.mode || "general"),
        ...defaultMealPlan,
        lastLabExams: patient.lastLabExams || [],
      });
      setGeneratedPlan(null);
      setApiError(null);
      setSaveSuccess(false);
      setStep(1);
      setCompletedSteps([false, false, false]);
    }
  };

  const calculations = useMemo(() => {
    if (!selectedPatient || !formData.currentWeight || !formData.activityLevel)
      return null;
    const patientAge = calcAge(selectedPatient.dob) || 30;
    const calcGender: M.Gender =
      selectedPatient.gender === "male" ? "male" : "female";
    const currentWeight = Number(formData.currentWeight);
    const bmr = M.calculateBMR({
      gender: calcGender,
      weight: currentWeight,
      height: selectedPatient.height,
      age: patientAge,
    });
    const tdee = M.calculateTDEE({
      gender: calcGender,
      weight: currentWeight,
      height: selectedPatient.height,
      age: patientAge,
      activityLevel: formData.activityLevel as M.ActivityLevel,
    });
    const targetCalories = M.calculateTargetCalories(
      tdee,
      currentWeight,
      Number(formData.targetWeight),
      Number(formData.deadlineWeeks),
    );
    const dailyCalories = Number(formData.dailyCalories) || targetCalories;
    const macros =
      formData.macros ||
      M.getMacroDistributionForDiet(
        (formData.dietType as M.DietType) || "traditional",
      );
    const macrosInGrams = M.calculateMacrosInGrams(
      dailyCalories,
      macros.protein,
      macros.carbs,
      macros.fat,
    );
    const validationWarnings = M.validateNutrition(
      dailyCalories,
      macrosInGrams.proteinGrams,
      currentWeight,
    );
    return {
      bmr,
      tdee,
      targetCalories,
      water: (currentWeight * 35) / 1000,
      macrosInGrams,
      validationWarnings,
    };
  }, [selectedPatient, formData]);

  useEffect(() => {
    if (calculations && !formData.dailyCalories) {
      updateFormData({
        dailyCalories: Math.round(calculations.targetCalories),
        dietType: "traditional",
        macros: M.getMacroDistributionForDiet("traditional"),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculations]);

  useEffect(() => {
    if (formData.dietType) {
      updateFormData({
        macros: M.getMacroDistributionForDiet(formData.dietType as M.DietType),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.dietType]);

  const validateStep = (stepToValidate: number) => {
    const newErrors: Record<string, string> = {};
    if (stepToValidate === 1) {
      if (!formData.currentWeight || Number(formData.currentWeight) < 20)
        newErrors.currentWeight = t("diet_generator.validation.invalid_weight");
      if (!formData.targetWeight || Number(formData.targetWeight) < 20)
        newErrors.targetWeight = t("diet_generator.validation.invalid_weight");
      if (!formData.deadlineWeeks || Number(formData.deadlineWeeks) < 1)
        newErrors.deadlineWeeks = t(
          "diet_generator.validation.deadline_min_weeks",
        );
      if (
        formData.goal === "weight_loss" &&
        Number(formData.targetWeight) >= Number(formData.currentWeight)
      ) {
        newErrors.targetWeight = t(
          "diet_generator.validation.weight_loss_target",
        );
      }
      if (
        formData.goal === "weight_gain" &&
        Number(formData.targetWeight) <= Number(formData.currentWeight)
      ) {
        newErrors.targetWeight = t(
          "diet_generator.validation.weight_gain_target",
        );
      }
    }
    if (stepToValidate === 2) {
      if (!formData.dailyCalories || Number(formData.dailyCalories) < 800)
        newErrors.dailyCalories = t("diet_generator.validation.calories_min");
      const { protein, carbs, fat } = formData.macros ?? {
        protein: 0,
        carbs: 0,
        fat: 0,
      };
      if (protein + carbs + fat !== 100)
        newErrors.macros = t("diet_generator.validation.macros_sum");
    }
    setErrors(newErrors);
    const invalid = Object.keys(newErrors);
    // The macro split has no single field: send focus to its first input.
    if (invalid.length > 0)
      focusFirstInvalid(invalid.map((k) => (k === "macros" ? "protein" : k)));
    return invalid.length === 0;
  };

  const goToStep = (targetStep: number) => {
    if (targetStep > step && !validateStep(step)) return;
    const newCompleted = [...completedSteps];
    for (let i = 0; i < targetStep; i++) newCompleted[i] = true;
    setCompletedSteps(newCompleted);
    setStep(targetStep);
  };

  const handleGenerate = async () => {
    if (
      !validateStep(1) ||
      !validateStep(2) ||
      !calculations ||
      !selectedPatient
    )
      return;
    setLoading(true);
    setApiError(null);
    setGeneratedPlan(null);
    const numericDailyCalories = Number(formData.dailyCalories);
    if (isNaN(numericDailyCalories)) {
      setApiError(t("diet_generator.validation.calories_invalid"));
      setLoading(false);
      return;
    }
    try {
      await new Promise((res) => setTimeout(res, 500));
      const result = generateAlgorithmicDietPlan({
        nutritionalTargets: {
          calories: numericDailyCalories,
          protein: calculations.macrosInGrams.proteinGrams,
          carbs: calculations.macrosInGrams.carbsGrams,
          fat: calculations.macrosInGrams.fatGrams,
        },
        mealPlanConfig: {
          dietType: (formData.dietType as M.DietType) || "traditional",
          meals: (formData.meals ?? []).map((m) => ({
            name: m.name,
            time: m.time,
            caloriePercentage: m.percentage,
          })),
        },
        restrictions: selectedPatient.dietaryRestrictions,
        mode: formData.mode || "general",
        clinicalTags: formData.clinicalTags || [],
      });
      const finalPlan: DietPlan = {
        version: 2,
        patientId: selectedPatient.id!,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        createdAt: new Date().toISOString(),
        durationDays: Number(formData.durationDays) || 7,
        startDate: formData.startDate || new Date().toISOString().split("T")[0],
        dailyCalories: numericDailyCalories,
        macronutrients: {
          proteinGrams: calculations.macrosInGrams.proteinGrams,
          proteinPercentage: formData.macros?.protein ?? 0,
          carbsGrams: calculations.macrosInGrams.carbsGrams,
          carbsPercentage: formData.macros?.carbs ?? 0,
          fatGrams: calculations.macrosInGrams.fatGrams,
          fatPercentage: formData.macros?.fat ?? 0,
        },
        calculatedTotals: result.calculatedTotals,
        validation: result.validation,
        algorithmVersion: result.metadata.algorithmVersion,
        datasetVersion: result.metadata.datasetVersion,
        seed: result.metadata.seed,
        meals: result.meals,
        decisionLog: result.decisionLog,
        waterRecommendationLiters: calculations.water,
        generalObservations: getGeneralObservations(),
        dietType: (formData.dietType as M.DietType) || "traditional",
        mode: formData.mode || "general",
        clinicalTags: formData.clinicalTags || [],
        labExams: formData.lastLabExams || [],
      };
      setGeneratedPlan(finalPlan);
      setResultFocusKey((k) => k + 1);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : t("diet_generator.generation_failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving || !generatedPlan || !currentUser) return;
    if (generatedPlan.validation?.status === "infeasible") {
      setApiError(t("diet_generator.validation.infeasible_plan"));
      return;
    }
    setSaving(true);
    setApiError(null);
    try {
      if (editingDietId) {
        await updateDietPlan(currentUser.uid, editingDietId, generatedPlan);
      } else {
        await saveDietPlan(currentUser.uid, generatedPlan);
      }
      setSavedPatientData(selectedPatient || null);
      setSaveSuccess(true);
      setResultFocusKey((k) => k + 1);
    } catch (err) {
      console.error("[DietGenerator] Erro ao salvar plano alimentar:", {
        code: (err as { code?: string })?.code || "unknown",
        dietId: editingDietId || "new",
        message: err instanceof Error ? err.message : String(err),
      });
      setApiError(
        t(
          "diet_generator.save_error",
          "Não foi possível salvar o plano alimentar. Verifique sua conexão e tente novamente.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAnother = () => {
    clearFormData();
    setSelectedPatientId("");
    setGeneratedPlan(null);
    setEditingDietId(null);
    setApiError(null);
    setSaveSuccess(false);
    setSavedPatientData(null);
    setStep(1);
    setCompletedSteps([false, false, false]);
  };

  const handleUseTDEE = (tdee: number) => {
    updateFormData({ dailyCalories: Math.round(tdee) });
    setShowCalculator(false);
    setTdeeAppliedMsg(
      `✅ Calorias diárias atualizadas para ${Math.round(tdee)} kcal.`,
    );
    setTimeout(() => {
      setTdeeAppliedMsg("");
      document.getElementById("dailyCalories")?.focus();
    }, 4000);
  };

  const handleApplyTemplate = (tmpl: DietTemplate) => {
    updateFormData({
      dailyCalories: tmpl.plan.dailyCalories,
      dietType: tmpl.plan.dietType,
      macros: {
        protein: tmpl.plan.macronutrients.proteinPercentage,
        carbs: tmpl.plan.macronutrients.carbsPercentage,
        fat: tmpl.plan.macronutrients.fatPercentage,
      },
      mealsPerDay: tmpl.plan.meals.length,
      durationDays: tmpl.plan.durationDays,
    });
    setShowTemplates(false);
    setTdeeAppliedMsg(
      `✅ ${t("diet_generator.template_loaded", { name: tmpl.name })}`,
    );
    setTimeout(() => setTdeeAppliedMsg(""), 4000);
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        icon={<UtensilsIcon className="w-6 h-6" />}
        title={t("diet_generator.title")}
        subtitle={t("diet_generator.subtitle")}
      />

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <label htmlFor="patient" className="input-label">
              {t("diet_generator.select_patient")}
            </label>
            <select
              id="patient"
              name="patient"
              value={selectedPatientId}
              onChange={handlePatientChange}
              className={`${fieldClass} w-full sm:w-80`}
              required
            >
              <option value="" disabled>
                {t("diet_generator.select_placeholder")}
              </option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            {dietTemplates.length > 0 && (
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
              >
                📋{" "}
                {showTemplates
                  ? t("diet_generator.close_templates")
                  : `${t("diet_generator.templates")} (${dietTemplates.length})`}
              </button>
            )}
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="flex items-center gap-2 text-sm font-semibold text-sage-600 hover:text-sage-700"
            >
              <HeartIcon className="w-5 h-5" />
              {showCalculator
                ? t("diet_generator.close_calculator")
                : t("diet_generator.quick_calculator")}
            </button>
          </div>
        </div>

        <DietTemplatesSection
          isOpen={showTemplates}
          templates={dietTemplates}
          onApplyTemplate={handleApplyTemplate}
        />
        {showCalculator && <QuickCalculator onUseTDEE={handleUseTDEE} />}
        {tdeeAppliedMsg && (
          <div className="mb-4 px-4 py-3 bg-sage-50 border border-sage-200 rounded-xl text-sm font-medium text-sage-700 animate-fade-in">
            {tdeeAppliedMsg}
          </div>
        )}

        {selectedPatient && (
          <>
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/40 border-l-4 border-sage-500 rounded-r-2xl flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">
                  {t("nav.patients")}: {selectedPatient.firstName}{" "}
                  {selectedPatient.lastName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedPatient.gender === "male"
                    ? t("profile.gender_male")
                    : t("profile.gender_female")}
                  , {calcAge(selectedPatient.dob) || "?"}{" "}
                  {t("diet_generator.years")},{" "}
                  {(selectedPatient.height / 100).toFixed(2).replace(".", ",")}{" "}
                  m
                </p>
              </div>
              <Badge tone="sage">{t("diet_generator.active")}</Badge>
            </div>

            <ClinicalContextCard
              mode={formData.mode}
              clinicalTags={formData.clinicalTags}
            />

            <div className="mb-6">
              <LabExamsModule
                mode={formData.mode || "general"}
                clinicalTags={
                  Array.isArray(formData.clinicalTags)
                    ? formData.clinicalTags
                    : []
                }
                exams={
                  Array.isArray(formData.lastLabExams)
                    ? formData.lastLabExams
                    : []
                }
                onUpdate={(lastLabExams) => updateFormData({ lastLabExams })}
              />
            </div>

            <div className="mb-6">
              <DietProgressBar
                currentStep={step}
                goToStep={goToStep}
                completedSteps={completedSteps}
              />
            </div>

            <div ref={stepRegionRef}>
              {step === 1 && (
                <Step1Objectives
                  formData={formData}
                  onUpdate={updateFormData}
                  patientData={selectedPatient}
                  errors={errors}
                />
              )}
              {step === 2 && calculations && (
                <Step2Nutrition
                  formData={formData}
                  onUpdate={updateFormData}
                  calculations={calculations}
                  errors={errors}
                  validationWarnings={calculations.validationWarnings}
                />
              )}
              {step === 3 && calculations && (
                <Step3MealPlan
                  formData={formData}
                  onUpdate={updateFormData}
                  dailyCalories={Number(formData.dailyCalories) || 0}
                  calculations={calculations}
                />
              )}
            </div>

            <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <Button
                variant="secondary"
                onClick={() => goToStep(step - 1)}
                disabled={step === 1}
              >
                {t("diet_generator.previous")}
              </Button>
              {step < 3 ? (
                <Button onClick={() => goToStep(step + 1)}>
                  {t("diet_generator.next")}
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  loading={loading}
                  className="bg-sky-600 hover:bg-sky-700 shadow-sky-600/25"
                >
                  {loading
                    ? t("diet_generator.generating")
                    : t("diet_generator.generate_plan")}
                </Button>
              )}
            </div>
          </>
        )}
      </Card>

      <div className="mt-6" ref={resultRegionRef}>
        {loading && (
          <Card
            role="status"
            className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed"
          >
            <Spinner className="h-10 w-10 text-sage-500" />
            <p className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-200">
              {t("diet_generator.generating_perfect_plan")}
            </p>
            <p className="text-sm text-slate-500">
              {t("diet_generator.generating_perfect_plan_desc")}
            </p>
          </Card>
        )}
        {apiError && (
          <div
            role="alert"
            className="text-rose-700 bg-rose-50 border border-rose-100 p-4 rounded-xl text-sm"
          >
            {apiError}
          </div>
        )}

        {saveSuccess && savedPatientData && (
          <DietSuccessCard
            savedPatientData={savedPatientData}
            onViewPatientProfile={() =>
              navigate(`/patients/${savedPatientData.id}`)
            }
            onSendByEmail={() => navigate("/email-admin")}
            onCreateAnother={handleCreateAnother}
          />
        )}

        {!saveSuccess && generatedPlan && (
          <DietPlanDisplay
            plan={generatedPlan}
            onSave={handleSave}
            onDiscard={() => setGeneratedPlan(null)}
            isSaving={saving}
            saveSuccess={saveSuccess}
          />
        )}

        {!loading && !generatedPlan && !apiError && selectedPatient && (
          <div className="flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <UtensilsIcon className="w-8 h-8" />
            </div>
            <p className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-200">
              {t("diet_generator.waiting_generation")}
            </p>
            <p className="text-sm text-slate-500">
              {t("diet_generator.fill_steps_desc")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietGenerator;
