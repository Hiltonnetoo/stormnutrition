import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as M from "../../services/metabolicCalculations";
import { Button } from "../ui";

const fieldClass = "input-field";

interface QuickCalculatorProps {
  onUseTDEE: (tdee: number) => void;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  onUseTDEE,
}) => {
  const { t } = useTranslation();
  const [calcData, setCalcData] = useState({
    gender: "female" as M.Gender,
    age: "30",
    weight: "60",
    height: "165",
    activityLevel: "moderately_active" as M.ActivityLevel,
  });
  const [results, setResults] = useState<{
    bmr: number;
    tdee: number;
    bmi: number;
    bmiCategory: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setCalcData({ ...calcData, [e.target.name]: e.target.value });
  };

  const parsedData = useMemo(
    () => ({
      gender: calcData.gender,
      age: parseInt(calcData.age) || 0,
      weight: parseFloat(calcData.weight) || 0,
      height: parseFloat(calcData.height) || 0,
      activityLevel: calcData.activityLevel,
    }),
    [calcData],
  );

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const { gender, age, weight, height, activityLevel } = parsedData;
    if (age > 0 && weight > 0 && height > 0) {
      const bmr = M.calculateBMR({ gender, age, weight, height });
      const tdee = M.calculateTDEE({
        gender,
        age,
        weight,
        height,
        activityLevel,
      });
      const bmi = M.calculateBMI(weight, height);
      const bmiCategory = M.getBMICategory(bmi);
      setResults({ bmr, tdee, bmi, bmiCategory });
    }
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700">
      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
        {t("diet_generator.quick_calc.title")}
      </h4>
      <form
        onSubmit={calculate}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end"
      >
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            {t("diet_generator.quick_calc.gender")}
          </label>
          <select
            name="gender"
            value={calcData.gender}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="female">
              {t("diet_generator.quick_calc.female")}
            </option>
            <option value="male">{t("diet_generator.quick_calc.male")}</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            {t("diet_generator.quick_calc.age")}
          </label>
          <input
            type="number"
            name="age"
            value={calcData.age}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            {t("diet_generator.quick_calc.weight")}
          </label>
          <input
            type="number"
            name="weight"
            value={calcData.weight}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            {t("diet_generator.quick_calc.height")}
          </label>
          <input
            type="number"
            name="height"
            value={calcData.height}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
        <Button type="submit">
          {t("diet_generator.quick_calc.calculate")}
        </Button>
      </form>

      {results && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          {[
            [
              t("diet_generator.nutrition.bmr_short", "BMR"),
              `${results.bmr.toFixed(0)} kcal`,
            ],
            [
              t("diet_generator.nutrition.tdee_short", "TDEE"),
              `${results.tdee.toFixed(0)} kcal`,
            ],
            ["IMC", `${results.bmi.toFixed(1)} (${results.bmiCategory})`],
          ].map(([l, v]) => (
            <div key={l} className="text-center">
              <p className="text-xs text-slate-500">{l}</p>
              <p className="font-bold text-sage-600">{v}</p>
            </div>
          ))}
          <Button
            size="sm"
            className="bg-sky-600 hover:bg-sky-700 shadow-sky-600/25"
            onClick={() => onUseTDEE(results.tdee)}
          >
            {t("diet_generator.quick_calc.use_as_calorie_target")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickCalculator;
