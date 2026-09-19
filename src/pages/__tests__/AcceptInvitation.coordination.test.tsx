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
import type { PatientInvitation, PatientPortalProfile } from "../../types";
import "../../i18n";

// Mock firebaseService
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

const createMockUser = (
  uid: string,
  email = "paciente@test.com",
): firebaseService.User =>
  ({
    uid,
    email,
    displayName: "Paciente Teste",
    emailVerified: true,
    isAnonymous: false,
    metadata: {} as firebaseService.User["metadata"],
    providerData: [],
    refreshToken: "",
    tenantId: null,
    delete: vi.fn(),
    getIdToken: vi.fn(),
    getIdTokenResult: vi.fn(),
    reload: vi.fn(),
    toJSON: vi.fn(),
    phoneNumber: null,
    photoURL: null,
    providerId: "firebase",
  }) as firebaseService.User;

const sampleInvitation: PatientInvitation = {
  id: "token-abc-123",
  nutritionistId: "nutri-1",
  nutritionistName: "Dra. Julia",
  nutritionistEmail: "julia@clinic.com",
  patientId: "patient-1",
  patientEmail: "paciente@test.com",
  patientName: "Paciente Teste",
  status: "pending",
  createdAt: "2026-09-18T10:00:00Z",
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
};

describe("AcceptInvitation Coordination (Passo C08)", () => {
  let authCallback: (user: firebaseService.User | null) => Promise<void>;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(firebaseService.onAuthStateChanged).mockImplementation(
      (_auth: unknown, callback: unknown) => {
        authCallback = callback as (
          user: firebaseService.User | null,
        ) => Promise<void>;
        return vi.fn();
      },
    );
  });

  const renderAcceptInvitation = (initialPath = "/convite/token-abc-123") => {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/convite/:token" element={<AcceptInvitation />} />
            <Route path="/convite" element={<AcceptInvitation />} />
            <Route
              path="/paciente"
              element={
                <div data-testid="patient-portal-page">Portal do Paciente</div>
              }
            />
            <Route
              path="/"
              element={<div data-testid="home-page">Home Page</div>}
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
  };

  it("1. Coordenar nova conta com atraso artificial: não promove a profissional incompleto e conclui no portal", async () => {
    vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce(
      sampleInvitation,
    );

    // Initial query on Auth start -> no user
    renderAcceptInvitation();

    await act(async () => {
      await authCallback(null);
    });

    // Invitation form loads
    await waitFor(() => {
      expect(screen.getByText(/Dra\. Julia/)).toBeInTheDocument();
    });

    const activeProfile: PatientPortalProfile = {
      uid: "new-user-uid",
      patientId: "patient-1",
      nutritionistId: "nutri-1",
      nutritionistName: "Dra. Julia",
      nutritionistEmail: "julia@clinic.com",
      role: "patient",
      status: "active",
      createdAt: "2026-09-18",
    };

    // Simulate artificial delay during activation:
    let finishFirestoreWrite!: () => void;
    const writePromise = new Promise<{ uid: string }>((resolve) => {
      finishFirestoreWrite = () => resolve({ uid: "new-user-uid" });
    });

    vi.mocked(
      firebaseService.acceptInvitationWithNewAccount,
    ).mockReturnValueOnce(writePromise);

    // Query 1: during account creation before batch commit -> null
    // Query 2: after completeInvitationActivation -> activeProfile
    vi.mocked(firebaseService.getPatientPortalProfile)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(activeProfile);
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValue(null);

    // Fill password form using password inputs
    const passInputs = screen.getAllByLabelText(/password|senha/i);
    fireEvent.change(passInputs[0], { target: { value: "senhaSegura123" } });
    fireEvent.change(passInputs[1], { target: { value: "senhaSegura123" } });

    // Click submit
    const submitBtn = screen.getByRole("button", {
      name: /Activate My Account|Ativar meu acesso|Ativando|Activating/i,
    });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Simulate Firebase Auth onAuthStateChanged firing immediately after createUserWithEmailAndPassword,
    // while the Firestore batch is STILL pending
    await act(async () => {
      await authCallback(createMockUser("new-user-uid", "paciente@test.com"));
    });

    // CRITICAL: The page must still be on the activation flow (NOT redirected to incomplete_profile onboarding!)
    expect(
      screen.queryByText(
        /Concluir cadastro profissional|Complete professional registration/i,
      ),
    ).not.toBeInTheDocument();

    // Now Firestore batch completes
    await act(async () => {
      finishFirestoreWrite();
    });

    // Once completeInvitationActivation runs and confirms the profile, navigation to /paciente happens
    await waitFor(() => {
      expect(screen.getByTestId("patient-portal-page")).toBeInTheDocument();
    });
  });

  it("2. Coordenar conta existente: atualiza contexto com perfil de paciente e navega ao portal", async () => {
    vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce(
      sampleInvitation,
    );

    const loggedInUser = createMockUser(
      "existing-user-uid",
      "paciente@test.com",
    );
    const activeProfile: PatientPortalProfile = {
      uid: "existing-user-uid",
      patientId: "patient-1",
      nutritionistId: "nutri-1",
      nutritionistName: "Dra. Julia",
      nutritionistEmail: "julia@clinic.com",
      role: "patient",
      status: "active",
      createdAt: "2026-09-18",
    };

    // First query when user logs in: not linked yet
    // Second query after acceptInvitationWithExistingAccount: activeProfile
    vi.mocked(firebaseService.getPatientPortalProfile)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(activeProfile);
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValue(null);

    vi.mocked(
      firebaseService.acceptInvitationWithExistingAccount,
    ).mockResolvedValueOnce({
      alreadyAccepted: false,
    });

    renderAcceptInvitation();

    await act(async () => {
      await authCallback(loggedInUser);
    });

    // Should display existing account link confirmation
    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Confirm and Link Account|Confirmar e vincular conta/i,
        }),
      ).toBeInTheDocument();
    });

    // Click confirm link
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /Confirm and Link Account|Confirmar e vincular conta/i,
        }),
      );
    });

    // Confirmed state redirects directly to patient portal
    await waitFor(() => {
      expect(screen.getByTestId("patient-portal-page")).toBeInTheDocument();
    });
  });

  it("3. Idempotência em reload: convite já aceito pelo mesmo usuário redireciona ao portal", async () => {
    const acceptedInvitation: PatientInvitation = {
      ...sampleInvitation,
      status: "accepted",
      acceptedByUid: "already-user-uid",
      acceptedAt: "2026-09-18T11:00:00Z",
    };

    vi.mocked(firebaseService.getInvitationByToken).mockResolvedValue(
      acceptedInvitation,
    );

    const activeProfile: PatientPortalProfile = {
      uid: "already-user-uid",
      patientId: "patient-1",
      nutritionistId: "nutri-1",
      nutritionistName: "Dra. Julia",
      nutritionistEmail: "julia@clinic.com",
      role: "patient",
      status: "active",
      createdAt: "2026-09-18",
    };

    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValue(
      activeProfile,
    );
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValue(null);

    renderAcceptInvitation();

    await act(async () => {
      await authCallback(
        createMockUser("already-user-uid", "paciente@test.com"),
      );
    });

    // Recognizes idempotent retry and redirects to /paciente
    await waitFor(() => {
      expect(screen.getByTestId("patient-portal-page")).toBeInTheDocument();
    });
  });

  it("4. Convite revogado exibe aviso explícito e impede ativação", async () => {
    const revokedInvitation: PatientInvitation = {
      ...sampleInvitation,
      status: "revoked",
      revokedAt: "2026-09-18T11:00:00Z",
    };

    vi.mocked(firebaseService.getInvitationByToken).mockResolvedValueOnce(
      revokedInvitation,
    );

    renderAcceptInvitation();

    await act(async () => {
      await authCallback(null);
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /revoked by your nutritionist|cancelado pelo seu nutricionista/i,
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByLabelText(/Create your access password|Crie sua senha/i),
    ).not.toBeInTheDocument();
  });

  it("5. Falha na ativação cancela estado no contexto e permite retry seguro", async () => {
    vi.mocked(firebaseService.getInvitationByToken).mockResolvedValue(
      sampleInvitation,
    );

    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValue(null);
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValue(null);

    vi.mocked(
      firebaseService.acceptInvitationWithNewAccount,
    ).mockRejectedValueOnce(new Error("FIRESTORE_LINK_FAILED"));

    renderAcceptInvitation();

    await act(async () => {
      await authCallback(null);
    });

    await waitFor(() => {
      expect(screen.getByText(/Dra\. Julia/)).toBeInTheDocument();
    });

    const passInputs = screen.getAllByLabelText(/password|senha/i);
    fireEvent.change(passInputs[0], { target: { value: "senhaSegura123" } });
    fireEvent.change(passInputs[1], { target: { value: "senhaSegura123" } });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /Activate My Account|Ativar meu acesso/i,
        }),
      );
    });

    // Error is displayed
    await waitFor(() => {
      expect(
        screen.getByText(
          /Falha ao concluir o vínculo do convite no servidor|Failed to complete invitation linking on the server/i,
        ),
      ).toBeInTheDocument();
    });

    // Button is restored so user can retry
    expect(
      screen.getByRole("button", {
        name: /Activate My Account|Ativar meu acesso/i,
      }),
    ).toBeInTheDocument();
  });
});
