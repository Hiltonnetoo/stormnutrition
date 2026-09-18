import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import i18n from "../i18n";
import { translateMealName } from "./locale";
import type { DietPlan, Meal, MealOption } from "../types";

export interface ClinicInfo {
  clinicName?: string;
  clinicSpecialty?: string;
  clinicPhone?: string;
}

export interface CustomLayoutPdfOptions {
  locale?: "pt" | "en" | string;
}

export function formatFileName(plan: DietPlan, locale?: string): string {
  const rawName = (plan.patientName || "paciente")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents for safe OS filename
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const patientSlug = rawName || "paciente";

  const dateLocale = (locale || i18n.language || "en")
    .toLowerCase()
    .startsWith("pt")
    ? "pt-BR"
    : "en-US";
  const planDate = plan.createdAt ? new Date(plan.createdAt) : new Date();
  const dateStr = (isNaN(planDate.getTime()) ? new Date() : planDate)
    .toLocaleDateString(dateLocale)
    .replace(/\//g, "-");

  return `diet-${patientSlug}-${dateStr}.pdf`;
}

// --- MODE 1: EDITORIAL LAYOUT (Storm Nutrition visual identity) ---
// Brand palette converted to RGB (mirrors src/index.css).
type RGB = [number, number, number];
const SAGE800: RGB = [17, 94, 89];
const SAGE700: RGB = [15, 118, 110];
const SAGE600: RGB = [13, 148, 136];
const SAGE100: RGB = [204, 251, 241];
const SAGE50: RGB = [240, 253, 250];
const SKY: RGB = [2, 132, 199]; // carbohydrates
const AMBER: RGB = [217, 119, 6]; // fats
const INK: RGB = [15, 23, 42]; // slate-900
const SUBTLE: RGB = [100, 116, 139]; // slate-500
const FAINT: RGB = [148, 163, 184]; // slate-400
const HAIR: RGB = [226, 232, 240]; // slate-200
const PAPER: RGB = [248, 250, 252]; // slate-50
const ROSE_TEXT: RGB = [190, 18, 60]; // rose-700
const AMBER_TEXT: RGB = [180, 83, 9]; // amber-700

/**
 * Builds and returns a fully formatted, vector-based jsPDF document instance.
 *
 * Characteristics of Editorial Layout:
 * - Native vector text: 100% extractable, searchable, accessible to screen readers.
 * - Deterministic pagination: prevents orphaned headers and controls card placement.
 * - Strictly differentiates effective calculated totals from prescribed clinical targets.
 * - Lightweight footprint: ~40-70 KB per document (vs 2-10 MB in screenshot mode).
 */
export function buildCustomLayoutPdfDocument(
  plan: DietPlan,
  clinicInfo?: ClinicInfo,
  options?: CustomLayoutPdfOptions,
): jsPDF {
  const targetLocale = (options?.locale || i18n.language || "en")
    .toLowerCase()
    .startsWith("pt")
    ? "pt"
    : "en";
  const dateLocale = targetLocale === "en" ? "en-US" : "pt-BR";
  const t = (key: string, opts?: Record<string, unknown>) =>
    i18n.t(key, { lng: targetLocale, ...opts });

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 0;

  // Clinic data passed explicitly or fallback
  const clinicName = (clinicInfo?.clinicName || "").trim();
  const clinicSpecialty = (clinicInfo?.clinicSpecialty || "").trim();
  const clinicPhone = (clinicInfo?.clinicPhone || "").trim();

  const checkPageBreak = (need: number) => {
    if (yPos > 18 && yPos + need > pageHeight - 16) {
      doc.addPage();
      yPos = 18;
    }
  };

  /* ---------------------------------------------- Header (brand banner) */
  doc.setFillColor(...SAGE700);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setFillColor(...SAGE800);
  doc.rect(0, 40, pageWidth, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setCharSpace(1.5);
  doc.text("STORM NUTRITION", margin, 15);
  doc.setCharSpace(0);

  // Clinic name & specialty constrained to prevent collision with right header
  const maxBannerLeftW = contentWidth - 65;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const clinicNameLines = doc.splitTextToSize(
    clinicName || t("pdf.personalized_plan"),
    maxBannerLeftW,
  );
  doc.text(clinicNameLines.slice(0, 2), margin, 23);

  if (clinicSpecialty) {
    doc.setFontSize(8);
    doc.setTextColor(...SAGE100);
    const specialtyLines = doc.splitTextToSize(clinicSpecialty, maxBannerLeftW);
    doc.text(specialtyLines[0], margin, 28.5);
    doc.setTextColor(255, 255, 255);
  }

  // Right banner block: Document title & issue date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(t("pdf.nutritional_plan"), pageWidth - margin, 15, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SAGE100);

  const createdAtDate = plan.createdAt ? new Date(plan.createdAt) : new Date();
  const validCreatedAt = isNaN(createdAtDate.getTime())
    ? new Date()
    : createdAtDate;
  doc.text(
    t("pdf.issued_on", {
      date: validCreatedAt.toLocaleDateString(dateLocale),
    }),
    pageWidth - margin,
    22,
    { align: "right" },
  );
  doc.setTextColor(255, 255, 255);

  yPos = 54;

  /* ------------------------------------------------------- Patient Block */
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const patientDisplayName =
    plan.patientName || t("pdf.unnamed_patient", { defaultValue: "Paciente" });
  const patientNameLines = doc.splitTextToSize(
    patientDisplayName,
    contentWidth,
  );
  doc.text(patientNameLines, margin, yPos);
  yPos += patientNameLines.length * 6.5 + 2;

  let startD = "";
  if (plan.startDate) {
    const rawIso = plan.startDate.includes("T")
      ? plan.startDate
      : `${plan.startDate}T00:00:00`;
    const parsedStart = new Date(rawIso);
    startD = isNaN(parsedStart.getTime())
      ? validCreatedAt.toLocaleDateString(dateLocale)
      : parsedStart.toLocaleDateString(dateLocale);
  } else {
    startD = validCreatedAt.toLocaleDateString(dateLocale);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...SUBTLE);
  const durationText = t("pdf.plan_duration_start", {
    duration: plan.durationDays || 30,
    startDate: startD,
  });
  const durationLines = doc.splitTextToSize(durationText, contentWidth);
  doc.text(durationLines, margin, yPos);
  yPos += durationLines.length * 4.5 + 5;

  /* -------------------------------------------------- Nutritional Summary */
  // Passo C05: Sum meals directly to verify consistency with persisted calculatedTotals
  const meals = plan.meals || [];
  const mealSum = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const calcCal =
    plan.calculatedTotals?.calories ??
    plan.validation?.calculatedTotals?.calories;
  const calcProt =
    plan.calculatedTotals?.protein ??
    plan.validation?.calculatedTotals?.protein;
  const calcCarbs =
    plan.calculatedTotals?.carbs ?? plan.validation?.calculatedTotals?.carbs;
  const calcFat =
    plan.calculatedTotals?.fat ?? plan.validation?.calculatedTotals?.fat;

  // Use persisted totals if they match the sum of meals within rounding margin (2 kcal, 1g macro).
  // If totals are missing or diverge (e.g. stale plan edit), strictly prefer mealSum so the PDF summary matches the meal tables.
  const isTotalsConsistent =
    calcCal != null &&
    Math.abs(calcCal - mealSum.calories) <= 2 &&
    (calcProt == null || Math.abs(calcProt - mealSum.protein) <= 1) &&
    (calcCarbs == null || Math.abs(calcCarbs - mealSum.carbs) <= 1) &&
    (calcFat == null || Math.abs(calcFat - mealSum.fat) <= 1);

  const actualTotals = {
    calories: isTotalsConsistent ? calcCal : mealSum.calories,
    protein: isTotalsConsistent && calcProt != null ? calcProt : mealSum.protein,
    carbs: isTotalsConsistent && calcCarbs != null ? calcCarbs : mealSum.carbs,
    fat: isTotalsConsistent && calcFat != null ? calcFat : mealSum.fat,
  };

  const m = plan.macronutrients || {
    proteinPercentage: 0,
    carbsPercentage: 0,
    fatPercentage: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
  };
  const targetCalories = plan.dailyCalories || 0;
  const targetPrefix = t("pdf.target_label", {
    defaultValue: targetLocale === "en" ? "Target" : "Meta",
  });

  const cardH = 38;
  doc.setFillColor(...SAGE50);
  doc.setDrawColor(...SAGE100);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPos, contentWidth, cardH, 3, 3, "FD");

  // Card header & badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...SAGE700);
  doc.setCharSpace(0.8);
  doc.text(t("pdf.daily_summary"), margin + 6, yPos + 6.5);
  doc.setCharSpace(0);

  let totalsBadge = t("pdf.calculated_totals_badge", {
    defaultValue:
      targetLocale === "en"
        ? "Calculated Totals vs Targets"
        : "Totais Calculados vs Metas",
  });
  if (plan.isManuallyEdited) {
    totalsBadge = t("pdf.manually_edited_badge", {
      defaultValue:
        targetLocale === "en"
          ? "Manual Edit • Totals vs Targets"
          : "Edição Manual • Totais vs Metas",
    });
  } else if (!plan.validation && !plan.calculatedTotals) {
    totalsBadge = t("pdf.legacy_plan_badge", {
      defaultValue:
        targetLocale === "en"
          ? "Legacy Plan • Meal Totals vs Targets"
          : "Plano Legado • Totais vs Metas",
    });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...SUBTLE);
  doc.text(totalsBadge, pageWidth - margin - 6, yPos + 6.5, { align: "right" });

  const cols: Array<{ v: string; sub: string; meta: string; c: RGB }> = [
    {
      v: `${actualTotals.calories.toFixed(0)} kcal`,
      sub: t("pdf.calories_kcal"),
      meta: `${targetPrefix}: ${targetCalories.toFixed(0)} kcal`,
      c: INK,
    },
    {
      v: `${actualTotals.protein.toFixed(0)}g`,
      sub: t("pdf.proteins_pct", { pct: m.proteinPercentage }),
      meta: `${targetPrefix}: ${(m.proteinGrams || 0).toFixed(0)}g`,
      c: SAGE600,
    },
    {
      v: `${actualTotals.carbs.toFixed(0)}g`,
      sub: t("pdf.carbs_pct", { pct: m.carbsPercentage }),
      meta: `${targetPrefix}: ${(m.carbsGrams || 0).toFixed(0)}g`,
      c: SKY,
    },
    {
      v: `${actualTotals.fat.toFixed(0)}g`,
      sub: t("pdf.fats_pct", { pct: m.fatPercentage }),
      meta: `${targetPrefix}: ${(m.fatGrams || 0).toFixed(0)}g`,
      c: AMBER,
    },
  ];

  const colW = contentWidth / 4;
  cols.forEach((col, i) => {
    const cx = margin + colW * i + colW / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...col.c);
    doc.text(col.v, cx, yPos + 16, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SUBTLE);
    doc.text(col.sub, cx, yPos + 21, { align: "center" });
    doc.setFontSize(6.5);
    doc.setTextColor(...FAINT);
    doc.text(col.meta, cx, yPos + 25.5, { align: "center" });
  });

  // Macro distribution bar (protein / carbs / fat by kcal)
  const pK = actualTotals.protein * 4;
  const cK = actualTotals.carbs * 4;
  const fK = actualTotals.fat * 9;
  const totK = Math.max(1, pK + cK + fK);
  const barX = margin + 6;
  const barY = yPos + 31.5;
  const barW = contentWidth - 12;
  const segs: Array<{ k: number; c: RGB }> = [
    { k: pK, c: SAGE600 },
    { k: cK, c: SKY },
    { k: fK, c: AMBER },
  ];
  let bx = barX;
  segs.forEach((s) => {
    const w = (s.k / totK) * barW;
    doc.setFillColor(...s.c);
    doc.rect(bx, barY, w, 2.4, "F");
    bx += w;
  });
  yPos += cardH + 10;

  /* ---------------------------------------------------- Section Title Helper */
  // minSpace prevents orphaned headings by ensuring room for title + next block
  const sectionTitle = (title: string, minContentSpace = 30) => {
    checkPageBreak(16 + minContentSpace);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(title, margin, yPos);
    yPos += 2;
    doc.setDrawColor(...HAIR);
    doc.setLineWidth(0.4);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 7;
  };

  /* ----------------------- Clinical Warnings & Guidelines (Passo 17 item 3) */
  const issues = plan.validation?.issues || [];
  const hasSodiumAlert =
    plan.validation?.worstCaseAlternativeSodium != null &&
    plan.validation.worstCaseAlternativeSodium > 0;

  if (issues.length > 0 || hasSodiumAlert) {
    const alertHeading = t("pdf.clinical_alerts_title", {
      defaultValue:
        targetLocale === "en"
          ? "Clinical Alerts & Guidelines"
          : "Avisos e Diretrizes Clínicas",
    });
    sectionTitle(alertHeading, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    issues.forEach((issue) => {
      const isError = issue.level === "error";
      const bulletSymbol = isError ? "[!] " : "[*] ";
      const issueLines = doc.splitTextToSize(
        `${bulletSymbol}${issue.message}`,
        contentWidth - 8,
      );
      checkPageBreak(issueLines.length * 4.2 + 2);
      doc.setTextColor(...(isError ? ROSE_TEXT : AMBER_TEXT));
      doc.text(issueLines, margin + 4, yPos);
      yPos += issueLines.length * 4.2 + 2;
    });

    if (
      hasSodiumAlert &&
      !issues.some(
        (i) => i.message.includes("sódio") || i.message.includes("sodium"),
      )
    ) {
      const sodiumMsg = t("pdf.sodium_alert", {
        sodium: plan.validation!.worstCaseAlternativeSodium,
        defaultValue: `Atenção: Opções alternativas podem conter até ${plan.validation!.worstCaseAlternativeSodium}mg de sódio.`,
      });
      const sodiumLines = doc.splitTextToSize(
        `[*] ${sodiumMsg}`,
        contentWidth - 8,
      );
      checkPageBreak(sodiumLines.length * 4.2 + 2);
      doc.setTextColor(...AMBER_TEXT);
      doc.text(sodiumLines, margin + 4, yPos);
      yPos += sodiumLines.length * 4.2 + 2;
    }

    yPos += 4;
  }

  /* ------------------------------------------------------ Meal Plan */
  sectionTitle(t("pdf.meal_plan"), 35);

  const padX = 8;
  const innerW = contentWidth - padX * 2;

  meals.forEach((meal: Meal) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const mainOptionText = meal.mainOption
      ? `${meal.mainOption.name || ""}${meal.mainOption.portion ? ` — ${meal.mainOption.portion}` : ""}`
      : "";
    const mainLines = doc.splitTextToSize(mainOptionText, innerW);

    doc.setFontSize(9.5);
    const alternatives = meal.alternatives || [];
    const altWrapped = alternatives.map((alt: MealOption) => {
      const altText = `${alt.name || ""}${alt.portion ? ` — ${alt.portion}` : ""}`;
      return doc.splitTextToSize(altText, innerW - 6);
    });
    const altLineCount = altWrapped.reduce((s, l) => s + l.length, 0);
    const hasAlts = alternatives.length > 0;

    const blockH =
      19.5 +
      mainLines.length * 4.5 +
      (hasAlts ? 6 + altLineCount * 4.5 : 0) +
      5;

    checkPageBreak(blockH + 4);

    // Meal card background + accent on the left
    doc.setFillColor(...PAPER);
    doc.roundedRect(margin, yPos, contentWidth, blockH, 3, 3, "F");
    doc.setFillColor(...SAGE600);
    doc.roundedRect(margin, yPos, 2.2, blockH, 1, 1, "F");

    let cy = yPos + 8;

    // Kcal pill on the right
    const kcalStr = `${(meal.calories || 0).toFixed(0)} kcal`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const pillW = doc.getTextWidth(kcalStr) + 8;
    const pillX = pageWidth - margin - padX - pillW;
    doc.setFillColor(...SAGE100);
    doc.roundedRect(pillX, cy - 4.2, pillW, 6, 3, 3, "F");
    doc.setTextColor(...SAGE700);
    doc.text(kcalStr, pillX + pillW / 2, cy, { align: "center" });

    // Meal Name + time (constrained to avoid pill overlap)
    const maxMealNameW = pillX - (margin + padX) - 6;
    const localizedMealName = translateMealName(meal.mealName || "", t);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    const mealNameLines = doc.splitTextToSize(localizedMealName, maxMealNameW);
    doc.text(mealNameLines[0], margin + padX, cy);

    const nameW = doc.getTextWidth(mealNameLines[0]);
    if (meal.time) {
      const timeStr = `  ${meal.time}`;
      if (nameW + doc.getTextWidth(timeStr) < maxMealNameW) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...FAINT);
        doc.text(timeStr, margin + padX + nameW, cy);
      }
    }

    cy += 7;

    // Main option
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...SAGE700);
    doc.setCharSpace(0.5);
    doc.text(t("pdf.main_option"), margin + padX, cy);
    doc.setCharSpace(0);
    cy += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(mainLines, margin + padX, cy);
    cy += mainLines.length * 4.5;

    if (hasAlts) {
      cy += 1.5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...SUBTLE);
      doc.setCharSpace(0.5);
      doc.text(t("pdf.alternatives"), margin + padX, cy);
      doc.setCharSpace(0);
      cy += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...SUBTLE);
      altWrapped.forEach((lines) => {
        doc.setFillColor(...FAINT);
        doc.circle(margin + padX + 1, cy - 1.3, 0.5, "F");
        doc.text(lines, margin + padX + 4, cy);
        cy += lines.length * 4.5;
      });
    }

    yPos += blockH + 5;
  });

  /* -------------------------------------------------- General Recommendations */
  const obs = [
    ...(plan.generalObservations || []),
    t("pdf.water_recommendation", {
      liters: (plan.waterRecommendationLiters || 2).toFixed(1),
    }),
  ];
  if (obs.length > 0) {
    yPos += 4;
    sectionTitle(t("pdf.general_recommendations"), 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    obs.forEach((o) => {
      const lines = doc.splitTextToSize(o, contentWidth - 8);
      checkPageBreak(lines.length * 5 + 2);
      doc.setFillColor(...SAGE600);
      doc.circle(margin + 1.5, yPos - 1.3, 0.7, "F");
      doc.setTextColor(...SUBTLE);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 5 + 2;
    });
  }

  /* ---------------------------------------------------- Footer (every page) */
  const pageCount = doc.getNumberOfPages();
  const rawFooterLeft = clinicName
    ? `${clinicName}${clinicPhone ? "  ·  " + clinicPhone : ""}`
    : t("pdf.default_brand_footer", {
        defaultValue:
          targetLocale === "en"
            ? "Storm Nutrition · Nutritional Management"
            : "Storm Nutrition · Gestão Nutricional",
      });

  const maxFooterLeftW = pageWidth / 2 - margin - 8;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...HAIR);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...FAINT);

    const footerLeft =
      doc.getTextWidth(rawFooterLeft) > maxFooterLeftW
        ? doc.splitTextToSize(rawFooterLeft, maxFooterLeftW)[0] + "..."
        : rawFooterLeft;

    doc.text(footerLeft, margin, pageHeight - 7);
    doc.text(t("pdf.generated_by"), pageWidth / 2, pageHeight - 7, {
      align: "center",
    });
    doc.text(
      t("pdf.page_of", { page: i, total: pageCount }),
      pageWidth - margin,
      pageHeight - 7,
      { align: "right" },
    );
  }

  return doc;
}

/**
 * Generates and triggers browser download of the editorial custom layout PDF.
 */
export const generateCustomLayoutPdf = async (
  plan: DietPlan,
  clinicInfo?: ClinicInfo,
  options?: CustomLayoutPdfOptions,
): Promise<jsPDF> => {
  const doc = buildCustomLayoutPdfDocument(plan, clinicInfo, options);
  const targetLocale = options?.locale || i18n.language || "en";
  doc.save(formatFileName(plan, targetLocale));
  return doc;
};

// --- MODE 2: SCREENSHOT CAPTURE ---
/**
 * Renders an HTML DOM node to canvas using html2canvas and exports it as a multi-page PDF.
 *
 * TECHNICAL LIMITATIONS OF SCREENSHOT MODE:
 * 1. Text is rasterized into pixels: NOT searchable (Ctrl+F), NOT extractable, NOT accessible to screen readers.
 * 2. File size is significantly larger (typically 2-10 MB vs ~50 KB for vector editorial layout).
 * 3. Breakpoints cut directly through HTML elements at arbitrary vertical pixel lines.
 * 4. Captures the current theme and viewport state of the user's browser.
 *
 * Use editorial mode (`generateCustomLayoutPdf`) as the primary deliverable for patients;
 * use screenshot mode only as an occasional visual capture fallback when on-screen presentation is specifically needed.
 */
export const generateScreenshotPdf = async (
  element: HTMLElement,
  plan: DietPlan,
) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const ratio = canvasWidth / pdfWidth;
    const imgHeight = canvasHeight / ratio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(formatFileName(plan));
  } catch (error) {
    console.error("Error generating screenshot PDF:", error);
    throw error;
  }
};
