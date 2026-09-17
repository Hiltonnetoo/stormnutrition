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

  const resolveUserProfile = useCallback(
    async (user: User, sessionId: number) => {
      setStatus("loading");
      setAuthError(null);

      try {
        // 1. Check patient portal profile
        const patient = await getPatientPortalProfile(user.uid);
        if (sessionId !== activeSessionId.current) return; // Discard stale response

        if (patient) {
          setPatientProfile(patient);
          setNutritionistProfile(null);
          setUserRole("patient");
          setStatus("authenticated");
          return;
        }

        // 2. Check nutritionist profile
        const nutri = await getNutritionistProfile(user.uid);
        if (sessionId !== activeSessionId.current) return; // Discard stale response

        if (nutri) {
          setNutritionistProfile(nutri);
          setPatientProfile(null);
          setUserRole("nutritionist");
          setStatus("authenticated");
          return;
        }

        // 3. Neither profile exists: user is authenticated in Auth but registration is incomplete.
        // DO NOT promote to nutritionist on missing profile!
        setPatientProfile(null);
        setNutritionistProfile(null);
        setUserRole(null);
        setStatus("incomplete_profile");
      } catch (err: unknown) {
        if (sessionId !== activeSessionId.current) return; // Discard stale response

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
      }
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const sessionId = ++activeSessionId.current;
      setCurrentUser(user);

      if (!user) {
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
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
