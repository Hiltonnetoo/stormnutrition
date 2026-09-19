import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import * as firebaseService from "../../services/firebaseService";
import type { PatientPortalProfile } from "../../types";

// Mock firebaseService methods
vi.mock("../../services/firebaseService", async () => {
  return {
    auth: { currentUser: null },
    onAuthStateChanged: vi.fn(),
    firebaseSignOut: vi.fn().mockResolvedValue(undefined),
    getPatientPortalProfile: vi.fn(),
    getNutritionistProfile: vi.fn(),
    createNutritionistProfile: vi.fn(),
  };
});

const createMockUser = (
  uid: string,
  email = "test@example.com",
): firebaseService.User =>
  ({
    uid,
    email,
    displayName: "Test User",
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

// Test consumer component
const TestConsumer: React.FC = () => {
  const {
    status,
    currentUser,
    userRole,
    patientProfile,
    nutritionistProfile,
    authError,
    retryProfileFetch,
    completeProfessionalRegistration,
    logout,
    beginInvitationActivation,
    completeInvitationActivation,
    cancelInvitationActivation,
    refreshUserProfile,
  } = useAuth();

  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="user">{currentUser?.uid || "none"}</div>
      <div data-testid="role">{userRole || "none"}</div>
      <div data-testid="patient">{patientProfile ? "has-patient" : "none"}</div>
      <div data-testid="nutri">
        {nutritionistProfile ? "has-nutri" : "none"}
      </div>
      <div data-testid="error">{authError?.message || "none"}</div>
      <button onClick={() => retryProfileFetch()} data-testid="btn-retry">
        Retry
      </button>
      <button
        onClick={() => completeProfessionalRegistration("Dr. Test")}
        data-testid="btn-complete"
      >
        Complete
      </button>
      <button onClick={() => logout()} data-testid="btn-logout">
        Logout
      </button>
      <button
        onClick={() => beginInvitationActivation("token-123")}
        data-testid="btn-begin-activation"
      >
        BeginActivation
      </button>
      <button
        onClick={() => completeInvitationActivation()}
        data-testid="btn-complete-activation"
      >
        CompleteActivation
      </button>
      <button
        onClick={() => cancelInvitationActivation()}
        data-testid="btn-cancel-activation"
      >
        CancelActivation
      </button>
      <button
        onClick={() => refreshUserProfile()}
        data-testid="btn-refresh-profile"
      >
        RefreshProfile
      </button>
    </div>
  );
};

describe("AuthContext - Explicit Finite State Machine", () => {
  let authCallback: (user: firebaseService.User | null) => Promise<void>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(firebaseService.onAuthStateChanged).mockImplementation(
      (_auth: unknown, callback: unknown) => {
        authCallback = callback as (
          user: firebaseService.User | null,
        ) => Promise<void>;
        return vi.fn(); // unsubscribe
      },
    );
  });

  it("starts in loading status with no user or role", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("status")).toHaveTextContent("loading");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(screen.getByTestId("role")).toHaveTextContent("none");
  });

  it("transitions to unauthenticated when no user is signed in", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(null);
    });

    expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(screen.getByTestId("role")).toHaveTextContent("none");
  });

  it("resolves patient role when patient portal profile exists", async () => {
    const mockProfile: PatientPortalProfile = {
      uid: "patient-123",
      patientId: "p1",
      nutritionistId: "n1",
      nutritionistName: "Dr. Silva",
      nutritionistEmail: "silva@test.com",
      role: "patient",
      createdAt: "2026-09-17",
    };

    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValueOnce(
      mockProfile,
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(createMockUser("patient-123", "paciente@test.com"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
    expect(screen.getByTestId("role")).toHaveTextContent("patient");
    expect(screen.getByTestId("patient")).toHaveTextContent("has-patient");
    expect(screen.getByTestId("nutri")).toHaveTextContent("none");
  });

  it("resolves nutritionist role when nutritionist profile exists", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValueOnce(
      null,
    );
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValueOnce({
      uid: "nutri-123",
      email: "nutri@test.com",
      displayName: "Dra. Paula",
      role: "nutritionist",
      createdAt: "2026-09-17",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(createMockUser("nutri-123", "nutri@test.com"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
    expect(screen.getByTestId("role")).toHaveTextContent("nutritionist");
    expect(screen.getByTestId("nutri")).toHaveTextContent("has-nutri");
  });

  it("transitions to incomplete_profile when neither profile exists, WITHOUT promoting to nutritionist", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValueOnce(
      null,
    );
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValueOnce(
      null,
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(createMockUser("new-user-123", "novo@test.com"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent(
      "incomplete_profile",
    );
    expect(screen.getByTestId("role")).toHaveTextContent("none");
    expect(screen.getByTestId("patient")).toHaveTextContent("none");
    expect(screen.getByTestId("nutri")).toHaveTextContent("none");
  });

  it("transitions to error state on profile query rejection WITHOUT promoting to nutritionist", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile).mockRejectedValueOnce(
      new Error("PERMISSION_DENIED: Missing security permissions"),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(createMockUser("error-user-123", "err@test.com"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent("error");
    expect(screen.getByTestId("role")).toHaveTextContent("none"); // NEVER promote to nutritionist on error!
    expect(screen.getByTestId("error")).toHaveTextContent("PERMISSION_DENIED");
  });

  it("allows retrying profile resolution after error", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile)
      .mockRejectedValueOnce(new Error("Network timeout"))
      .mockResolvedValueOnce(null);

    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValueOnce({
      uid: "retry-user",
      email: "retry@test.com",
      displayName: "Dr. Retry",
      role: "nutritionist",
      createdAt: "2026-09-17",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(createMockUser("retry-user", "retry@test.com"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent("error");

    // Click retry
    await act(async () => {
      screen.getByTestId("btn-retry").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
      expect(screen.getByTestId("role")).toHaveTextContent("nutritionist");
    });
  });

  it("ignores stale asynchronous responses when logout occurs before resolution finishes", async () => {
    let slowResolve: (val: PatientPortalProfile | null) => void;
    const slowPromise = new Promise<PatientPortalProfile | null>((resolve) => {
      slowResolve = resolve;
    });

    vi.mocked(firebaseService.getPatientPortalProfile).mockReturnValueOnce(
      slowPromise,
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    // User logs in
    await act(async () => {
      authCallback(createMockUser("slow-user", "slow@test.com"));
    });

    // User logs out before slowPromise resolves
    await act(async () => {
      screen.getByTestId("btn-logout").click();
    });

    expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated");

    // Now slow promise finally resolves
    await act(async () => {
      slowResolve!({
        uid: "p-stale",
        patientId: "p-stale",
        nutritionistId: "n-stale",
        nutritionistName: "Dr. Stale",
        nutritionistEmail: "stale@test.com",
        role: "patient",
        createdAt: "2026-09-17",
      });
    });

    // Verify it remained unauthenticated and was NOT overwritten by the slow response!
    expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated");
    expect(screen.getByTestId("role")).toHaveTextContent("none");
    expect(screen.getByTestId("patient")).toHaveTextContent("none");
  });

  it("completes professional registration and transitions to authenticated nutritionist", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValueOnce(
      null,
    );
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValueOnce(
      null,
    );
    vi.mocked(firebaseService.createNutritionistProfile).mockResolvedValueOnce({
      uid: "incomplete-user",
      email: "incomplete@test.com",
      displayName: "Dr. Test",
      role: "nutritionist",
      createdAt: "2026-09-17",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(
        createMockUser("incomplete-user", "incomplete@test.com"),
      );
    });

    expect(screen.getByTestId("status")).toHaveTextContent(
      "incomplete_profile",
    );

    // Complete registration
    await act(async () => {
      screen.getByTestId("btn-complete").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
      expect(screen.getByTestId("role")).toHaveTextContent("nutritionist");
      expect(screen.getByTestId("nutri")).toHaveTextContent("has-nutri");
    });
  });

  it("resolves patient with revoked status to 'revoked' (Passo C08.7)", async () => {
    const revokedProfile: PatientPortalProfile = {
      uid: "revoked-patient-123",
      patientId: "p-revoked",
      nutritionistId: "n1",
      nutritionistName: "Dr. Silva",
      nutritionistEmail: "silva@test.com",
      role: "patient",
      status: "revoked",
      createdAt: "2026-09-17",
    };

    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValueOnce(
      revokedProfile,
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      await authCallback(
        createMockUser("revoked-patient-123", "revogado@test.com"),
      );
    });

    expect(screen.getByTestId("status")).toHaveTextContent("revoked");
    expect(screen.getByTestId("role")).toHaveTextContent("patient");
    expect(screen.getByTestId("patient")).toHaveTextContent("has-patient");
  });

  it("transitions to invitation_pending when activation is in progress before profile exists (Passo C08.1 / C08.2)", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile).mockResolvedValueOnce(
      null,
    );
    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValueOnce(
      null,
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    // Simulate clicking beginInvitationActivation before Auth state resolution completes
    await act(async () => {
      screen.getByTestId("btn-begin-activation").click();
    });

    expect(screen.getByTestId("status")).toHaveTextContent(
      "invitation_pending",
    );

    // Firebase Auth triggers onAuthStateChanged with the newly created account
    await act(async () => {
      await authCallback(
        createMockUser("new-patient-123", "paciente.novo@test.com"),
      );
    });

    // CRUCIAL: It must NOT transition to incomplete_profile (which would show professional onboarding)
    expect(screen.getByTestId("status")).toHaveTextContent(
      "invitation_pending",
    );
    expect(screen.getByTestId("role")).toHaveTextContent("none");
  });

  it("completes invitation activation and transitions to authenticated patient (Passo C08.4 / C08.5)", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile)
      .mockResolvedValueOnce(null) // First query during Auth account creation: not ready yet
      .mockResolvedValueOnce({
        uid: "activated-patient-123",
        patientId: "p-act",
        nutritionistId: "n-act",
        nutritionistName: "Dr. Active",
        nutritionistEmail: "nutri@test.com",
        role: "patient",
        status: "active",
        createdAt: "2026-09-18",
      }); // Second query after completeInvitationActivation commits to Firestore

    vi.mocked(firebaseService.getNutritionistProfile).mockResolvedValueOnce(
      null,
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByTestId("btn-begin-activation").click();
      await authCallback(
        createMockUser("activated-patient-123", "activated@test.com"),
      );
    });

    expect(screen.getByTestId("status")).toHaveTextContent(
      "invitation_pending",
    );

    // Finish activation (simulating Firestore batch commit and explicit context completion)
    await act(async () => {
      screen.getByTestId("btn-complete-activation").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
      expect(screen.getByTestId("role")).toHaveTextContent("patient");
      expect(screen.getByTestId("patient")).toHaveTextContent("has-patient");
    });
  });

  it("cancels invitation activation and recovers user state on failure (Passo C08.6)", async () => {
    vi.mocked(firebaseService.getPatientPortalProfile)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    vi.mocked(firebaseService.getNutritionistProfile)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByTestId("btn-begin-activation").click();
      await authCallback(createMockUser("cancel-user", "cancel@test.com"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent(
      "invitation_pending",
    );

    // Activation fails or is cancelled
    await act(async () => {
      screen.getByTestId("btn-cancel-activation").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent(
        "incomplete_profile",
      );
    });
  });
});
