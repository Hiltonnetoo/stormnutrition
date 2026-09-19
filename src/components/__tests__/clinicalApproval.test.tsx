import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import i18n from "../../i18n";
import type { DietPlan } from "../../types";

// A6 — approval needs the professional's CRN; the portal only shows plans a
// professional approved (not the automatic "isApproved" of older plans).
const getProfessionalCredentials = vi.fn();
const saveProfessionalCrn = vi.fn();
vi.mock("../../services/professionalProfileService", () => ({
  getProfessionalCredentials: (...a: unknown[]) =>
    getProfessionalCredentials(...a),
  saveProfessionalCrn: (...a: unknown[]) => saveProfessionalCrn(...a),
}));
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "nutri-1", displayName: "Dra. Teste" },
  }),
}));

import ClinicalReviewModal from "../modals/ClinicalReviewModal";
import { PortalDietsSection } from "../patient-portal/PortalDietsSection";

const plan = {
  version: 2,
  patientId: "p1",
  patientName: "Paciente",
  dailyCalories: 2000,
  macronutrients: {
    proteinGrams: 100,
    proteinPercentage: 20,
    carbsGrams: 250,
    carbsPercentage: 50,
    fatGrams: 67,
    fatPercentage: 30,
  },
  meals: [],
  createdAt: "2026-09-18T10:00:00Z",
} as unknown as DietPlan;

describe("A6 — clinical approval", () => {
  beforeEach(async () => {
    getProfessionalCredentials.mockReset();
    saveProfessionalCrn.mockReset().mockResolvedValue(undefined);
    await i18n.changeLanguage("pt");
  });

  it("without CRN the confirm button stays disabled until one is typed, then saves it", async () => {
    getProfessionalCredentials.mockResolvedValue({
      name: "Dra. Teste",
      crn: "",
    });
    const onConfirm = vi.fn();
    render(
      <ClinicalReviewModal
        isOpen
        onClose={() => {}}
        onConfirm={onConfirm}
        plan={plan}
      />,
    );
    const confirm = await screen.findByRole("button", {
      name: /Confirmar e Salvar Plano/,
    });
    const crn = await screen.findByLabelText("CRN do profissional");
    expect(confirm).toBeDisabled();
    fireEvent.change(crn, { target: { value: "CRN-3 12345" } });
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    await waitFor(() =>
      expect(onConfirm).toHaveBeenCalledWith({
        name: "Dra. Teste",
        crn: "CRN-3 12345",
      }),
    );
    expect(saveProfessionalCrn).toHaveBeenCalledWith("nutri-1", "CRN-3 12345");
  });

  it("with a CRN on file, it shows who approves and confirms directly", async () => {
    getProfessionalCredentials.mockResolvedValue({
      name: "Dra. Teste",
      crn: "CRN-3 00000",
    });
    const onConfirm = vi.fn();
    render(
      <ClinicalReviewModal
        isOpen
        onClose={() => {}}
        onConfirm={onConfirm}
        plan={plan}
      />,
    );
    expect(await screen.findByText("CRN CRN-3 00000")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Confirmar e Salvar Plano/ }),
    );
    await waitFor(() =>
      expect(onConfirm).toHaveBeenCalledWith({
        name: "Dra. Teste",
        crn: "CRN-3 00000",
      }),
    );
    expect(saveProfessionalCrn).not.toHaveBeenCalled();
  });

  it("portal hides plans without a professional approval (legacy automatic isApproved)", () => {
    const legacy = {
      ...plan,
      id: "old",
      validation: { isApproved: true, status: "valid" },
    } as unknown as DietPlan;
    render(<PortalDietsSection diets={[legacy]} />);
    expect(
      screen.getByText(i18n.t("patient_portal.no_diet_plans")),
    ).toBeInTheDocument();
  });
});
