import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  auth,
  onAuthStateChanged,
  firebaseSignOut,
  User,
  getPatientPortalProfile,
  getNutritionistProfile,
  createNutritionistProfile,
} from "../services/firebaseService";
import { clearUserSessionData, purgeLegacyDrafts } from "../utils/localStorage";
import type {
  PatientPortalProfile,
  NutritionistProfile,
  AuthStatus,
  UserRole,
  AuthError,
} from "../types";

export interface AuthContextType {
  currentUser: User | null;
  status: AuthStatus;
  userRole: UserRole | null;
  patientProfile: PatientPortalProfile | null;
  nutritionistProfile: NutritionistProfile | null;
  authError: AuthError | null;
  loading: boolean;
  retryProfileFetch: () => Promise<void>;
  completeProfessionalRegistration: (displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  beginInvitationActivation: (token: string) => void;
  completeInvitationActivation: () => Promise<PatientPortalProfile | null>;
  cancelInvitationActivation: () => Promise<void>;
  refreshUserProfile: () => Promise<{
    role: UserRole | null;
    status: AuthStatus;
  }>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  status: "loading",
  userRole: null,
  patientProfile: null,
  nutritionistProfile: null,
  authError: null,
  loading: true,
  retryProfileFetch: async () => {},
  completeProfessionalRegistration: async () => {},
  logout: async () => {},
  beginInvitationActivation: () => {},
  completeInvitationActivation: async () => null,
  cancelInvitationActivation: async () => {},
  refreshUserProfile: async () => ({ role: null, status: "unauthenticated" }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [patientProfile, setPatientProfile] =
    useState<PatientPortalProfile | null>(null);
  const [nutritionistProfile, setNutritionistProfile] =
    useState<NutritionistProfile | null>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // Stale async response token / race-condition protection
  const activeSessionId = useRef(0);
  const isActivatingInvitationRef = useRef(false);

  const resolveUserProfile = useCallback(
    async (
      user: User,
      sessionId: number,
    ): Promise<{ role: UserRole | null; status: AuthStatus }> => {
      setStatus("loading");
      setAuthError(null);

      try {
        // 1. Check patient portal profile
        const patient = await getPatientPortalProfile(user.uid);
        if (sessionId !== activeSessionId.current) {
          return { role: null, status: "loading" };
        }

        if (patient) {
          setPatientProfile(patient);
          setNutritionistProfile(null);
          setUserRole("patient");
          if (patient.status === "revoked") {
            setStatus("revoked");
            return { role: "patient", status: "revoked" };
          }
          setStatus("authenticated");
          return { role: "patient", status: "authenticated" };
        }

        // 2. Check nutritionist profile
        const nutri = await getNutritionistProfile(user.uid);
        if (sessionId !== activeSessionId.current) {
          return { role: null, status: "loading" };
        }

        if (nutri) {
          setNutritionistProfile(nutri);
          setPatientProfile(null);
          setUserRole("nutritionist");
          setStatus("authenticated");
          return { role: "nutritionist", status: "authenticated" };
        }

        // 3. Neither profile exists: user is authenticated in Auth but registration is incomplete.
        // Check if invitation activation is underway (in ref, sessionStorage, or URL)
        const hasPendingActivation =
          isActivatingInvitationRef.current ||
          (typeof window !== "undefined" &&
            (Boolean(
              window.sessionStorage?.getItem("active_invitation_token"),
            ) ||
              window.location?.hash?.includes("/convite")));

        setPatientProfile(null);
        setNutritionistProfile(null);
        setUserRole(null);

        if (hasPendingActivation) {
          setStatus("invitation_pending");
          return { role: null, status: "invitation_pending" };
        }

        // DO NOT promote to nutritionist on missing profile!
        setStatus("incomplete_profile");
        return { role: null, status: "incomplete_profile" };
      } catch (err: unknown) {
        if (sessionId !== activeSessionId.current) {
          return { role: null, status: "loading" };
        }

        const code =
          (err as { code?: string })?.code || "auth/profile-fetch-failed";
        const message =
          err instanceof Error
            ? err.message
            : "Falha ao verificar perfil do usuário.";

        console.error("[AuthContext] Erro ao consultar perfil:", {
          code,
          message,
          uid: user.uid,
        });

        // DO NOT promote to nutritionist on error!
        setUserRole(null);
        setPatientProfile(null);
        setNutritionistProfile(null);
        setAuthError({ code, message });
        setStatus("error");
        return { role: null, status: "error" };
      }
    },
    [],
  );

  useEffect(() => {
    // Purge any legacy un-scoped drafts on initialization
    purgeLegacyDrafts();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const sessionId = ++activeSessionId.current;
      setCurrentUser(user);

      if (!user) {
        isActivatingInvitationRef.current = false;
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.removeItem("active_invitation_token");
        }
        clearUserSessionData();
        setUserRole(null);
        setPatientProfile(null);
        setNutritionistProfile(null);
        setAuthError(null);
        setStatus("unauthenticated");
      } else {
        await resolveUserProfile(user, sessionId);
      }
    });

    const sessionRef = activeSessionId;
    return () => {
      sessionRef.current++;
      unsubscribe();
    };
  }, [resolveUserProfile]);

  const retryProfileFetch = useCallback(async () => {
    if (!currentUser) return;
    const sessionId = ++activeSessionId.current;
    await resolveUserProfile(currentUser, sessionId);
  }, [currentUser, resolveUserProfile]);

  const beginInvitationActivation = useCallback((token: string) => {
    isActivatingInvitationRef.current = true;
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem("active_invitation_token", token);
    }
    setStatus("invitation_pending");
  }, []);

  const completeInvitationActivation =
    useCallback(async (): Promise<PatientPortalProfile | null> => {
      isActivatingInvitationRef.current = false;
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.removeItem("active_invitation_token");
      }
      if (!currentUser) return null;
      const sessionId = ++activeSessionId.current;
      setStatus("loading");
      try {
        const patient = await getPatientPortalProfile(currentUser.uid);
        if (sessionId !== activeSessionId.current) return null;
        if (patient) {
          setPatientProfile(patient);
          setNutritionistProfile(null);
          setUserRole("patient");
          if (patient.status === "revoked") {
            setStatus("revoked");
          } else {
            setStatus("authenticated");
          }
          return patient;
        }
        return null;
      } catch (err) {
        console.error(
          "[AuthContext] Erro ao finalizar ativação do convite:",
          err,
        );
        return null;
      }
    }, [currentUser]);

  const cancelInvitationActivation = useCallback(async () => {
    isActivatingInvitationRef.current = false;
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.removeItem("active_invitation_token");
    }
    if (currentUser) {
      const sessionId = ++activeSessionId.current;
      await resolveUserProfile(currentUser, sessionId);
    }
  }, [currentUser, resolveUserProfile]);

  const refreshUserProfile = useCallback(async (): Promise<{
    role: UserRole | null;
    status: AuthStatus;
  }> => {
    if (!currentUser) return { role: null, status: "unauthenticated" };
    const sessionId = ++activeSessionId.current;
    return await resolveUserProfile(currentUser, sessionId);
  }, [currentUser, resolveUserProfile]);

  const completeProfessionalRegistration = useCallback(
    async (displayName?: string) => {
      if (!currentUser) throw new Error("Nenhum usuário autenticado.");
      const sessionId = ++activeSessionId.current;
      setStatus("loading");
      setAuthError(null);

      try {
        const profile = await createNutritionistProfile(currentUser.uid, {
          email: currentUser.email || "",
          displayName: displayName || currentUser.displayName || "",
        });
        if (sessionId !== activeSessionId.current) return;

        setNutritionistProfile(profile);
        setPatientProfile(null);
        setUserRole("nutritionist");
        setStatus("authenticated");
      } catch (err) {
        if (sessionId !== activeSessionId.current) return;
        const code =
          (err as { code?: string })?.code || "auth/registration-failed";
        const message =
          err instanceof Error
            ? err.message
            : "Falha ao completar cadastro profissional.";
        setAuthError({ code, message });
        setStatus("error");
      }
    },
    [currentUser],
  );

  const logout = useCallback(async () => {
    activeSessionId.current++; // Invalidate in-flight responses immediately
    isActivatingInvitationRef.current = false;
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.removeItem("active_invitation_token");
    }
    const uidToClear = currentUser?.uid;
    clearUserSessionData(uidToClear);
    setCurrentUser(null);
    setUserRole(null);
    setPatientProfile(null);
    setNutritionistProfile(null);
    setAuthError(null);
    setStatus("unauthenticated");
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("[AuthContext] Erro ao deslogar:", err);
    }
  }, [currentUser]);

  const loading = status === "loading";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        status,
        userRole,
        patientProfile,
        nutritionistProfile,
        authError,
        loading,
        retryProfileFetch,
        completeProfessionalRegistration,
        logout,
        beginInvitationActivation,
        completeInvitationActivation,
        cancelInvitationActivation,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
