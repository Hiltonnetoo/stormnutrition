import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AcceptInvitation from "../AcceptInvitation";
import { AuthProvider } from "../../contexts/AuthContext";
import * as firebaseService from "../../services/firebaseService";
import type { PatientInvitation } from "../../types";
import i18n from "../../i18n";

vi.mock("../../services/firebaseService", async () => {
  return {
    auth: { currentUser: null },
    onAuthStateChanged: vi.fn(),
    firebaseSignOut: vi.fn().mockResolvedValue(undefined),
    getPatientPortalProfile: vi.fn(),
    getNutritionistProfile: vi.fn(),
    createNutritionistProfile: vi.fn(),
    getInvitationByToken: vi.fn(),
    acceptInvitationWithNewAccount: vi.fn(),
    acceptInvitationWithExistingAccount: vi.fn(),
  };
});

const samplePendingInvitation: PatientInvitation = {
  id: "token-i18n-test",
  nutritionistId: "nutri-1",
  nutritionistName: "Dra. Julia",
  nutritionistEmail: "julia@clinic.com",
  patientId: "patient-1",
  patientEmail: "paciente@test.com",
  patientName: "Ana Silva",
  status: "pending",
  createdAt: "2026-09-18T10:00:00Z",
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
};

describe("AcceptInvitation i18n and domain error translation (Passo C11)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(firebaseService.onAuthStateChanged).mockImplementation(
      (_auth: unknown, callback: unknown) => {
        const authCb = callback as (user: null) => Promise<void>;
        authCb(null);
        return vi.fn();
      },
    );
  });

  const renderComponent = (path = "/convite/token-i18n-test") => {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/convite/:token" element={<AcceptInvitation />} />
            <Route path="/convite" element={<AcceptInvitation />} />
            <Route
              path="/paciente"
              element={
                <div data-testid="patient-portal-page">Portal do Paciente</div>
              }
            />
            <Route path="/" element={<div data-testid="home-page">Home</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
  };

  describe("English translation and safe error mapping", () => {
    beforeEach(async () => {
      await act(async () => {
        await i18n.changeLanguage("en");
      });
    });

    it("renders loading and form in English without Portuguese strings", async () => {
      let resolvePromise: (inv: PatientInvitation) => void;
      const delayedPromise = new Promise<PatientInvitation>((res) => {
        resolvePromise = res;
      });
      vi.mocked(firebaseService.getInvitationByToken).mockReturnValueOnce(
        delayedPromise as Promise<PatientInvitation | null>,
      );

      renderComponent();

      expect(screen.getByText("Verifying invitation...")).toBeInTheDocument();

      await act(async () => {
        resolvePromise!(samplePendingInvitation);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Portal Access Activation"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Create your access password"),
        ).toBeInTheDocument();
        expect(screen.getByText("Confirm your password")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Activate My Account" }),
        ).toBeInTheDocument();
      });
    });

    it("maps expired invitation state with English localized notice and link", async () => {
      vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce({
        ...samplePendingInvitation,
        status: "expired",
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Invitation Notice")).toBeInTheDocument();
        expect(
          screen.getByText(
            "This invitation has expired. Contact your nutritionist to request a new invitation.",
          ),
        ).toBeInTheDocument();
        expect(screen.getByText("Go to homepage")).toBeInTheDocument();
      });
    });

    it("maps revoked invitation state with English localized notice", async () => {
      vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce({
        ...samplePendingInvitation,
        status: "revoked",
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Invitation Notice")).toBeInTheDocument();
        expect(
          screen.getByText(
            "This invitation has been revoked by your nutritionist.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("maps already accepted invitation state with English localized notice", async () => {
      vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce({
        ...samplePendingInvitation,
        status: "accepted",
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Invitation Notice")).toBeInTheDocument();
        expect(
          screen.getByText("This invitation has already been accepted."),
        ).toBeInTheDocument();
      });
    });

    it("maps FIRESTORE_LINK_FAILED to localized English compensation message", async () => {
      vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce(
        samplePendingInvitation,
      );
      vi.mocked(
        firebaseService.acceptInvitationWithNewAccount,
      ).mockRejectedValueOnce(new Error("FIRESTORE_LINK_FAILED"));

      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Create your access password"),
        ).toBeInTheDocument();
      });

      const pwdInputs = screen.getAllByPlaceholderText("Minimum 6 characters");
      fireEvent.change(pwdInputs[0], { target: { value: "Password123!" } });
      fireEvent.change(pwdInputs[1], { target: { value: "Password123!" } });

      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: "Activate My Account" }),
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "Failed to complete invitation linking on the server. Registration was safely reverted. Please try again.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("maps MULTI_PROFESSIONAL_NOT_SUPPORTED to localized English message", async () => {
      vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce(
        samplePendingInvitation,
      );
      vi.mocked(
        firebaseService.acceptInvitationWithNewAccount,
      ).mockRejectedValueOnce(
        new Error(
          "MULTI_PROFESSIONAL_NOT_SUPPORTED: Esta conta já está vinculada a outro nutricionista.",
        ),
      );

      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Create your access password"),
        ).toBeInTheDocument();
      });

      const pwdInputs = screen.getAllByPlaceholderText("Minimum 6 characters");
      fireEvent.change(pwdInputs[0], { target: { value: "Password123!" } });
      fireEvent.change(pwdInputs[1], { target: { value: "Password123!" } });

      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: "Activate My Account" }),
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "This account is already linked to another nutritionist. Single-professional linking is supported in this version.",
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Portuguese translation", () => {
    beforeEach(async () => {
      await act(async () => {
        await i18n.changeLanguage("pt");
      });
    });

    it("renders loading and form in Portuguese", async () => {
      let resolvePromise: (inv: PatientInvitation) => void;
      const delayedPromise = new Promise<PatientInvitation>((res) => {
        resolvePromise = res;
      });
      vi.mocked(firebaseService.getInvitationByToken).mockReturnValueOnce(
        delayedPromise as Promise<PatientInvitation | null>,
      );

      renderComponent();

      expect(screen.getByText("Verificando convite...")).toBeInTheDocument();

      await act(async () => {
        resolvePromise!(samplePendingInvitation);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Ativação de Acesso ao Portal"),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Ativar meu acesso" }),
        ).toBeInTheDocument();
      });
    });
  });
});
