import React, { Suspense, lazy } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./contexts/AuthContext";

// Layout Components
import AppShell from "./components/AppShell";
import { PatientDirectoryProvider } from "./contexts/PatientDirectoryContext";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Patients = lazy(() => import("./pages/Patients"));
const PatientProfile = lazy(() => import("./pages/PatientProfile"));
const DietGenerator = lazy(() => import("./pages/DietGenerator"));
const FoodDatabase = lazy(() => import("./pages/FoodDatabase"));
const EmailAdmin = lazy(() => import("./pages/EmailAdmin"));
const Settings = lazy(() => import("./pages/Settings"));
const Calendar = lazy(() => import("./pages/Calendar"));
const PatientPortal = lazy(() => import("./pages/PatientPortal"));
const Reports = lazy(() => import("./pages/Reports"));
const MetabolicCalculator = lazy(() => import("./pages/MetabolicCalculator"));
const AcceptInvitation = lazy(() => import("./pages/AcceptInvitation"));

const PageLoader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t("app.loading")}
      className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <svg
        className="animate-spin h-8 w-8 text-emerald-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">{t("app.loading")}</span>
    </div>
  );
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const {
    currentUser,
    status,
    userRole,
    authError,
    retryProfileFetch,
    completeProfessionalRegistration,
    logout,
  } = useAuth();

  if (status === "loading") {
    return <PageLoader />;
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-6 text-center"
      >
        <div className="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t("app.auth_error_title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6 text-sm">
          {authError?.message || t("app.auth_error_desc")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => retryProfileFetch()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("app.retry")}
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            {t("app.logout")}
          </button>
        </div>
      </div>
    );
  }

  if (status === "incomplete_profile") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-6 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t("app.incomplete_profile_title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6 text-sm">
          {t("app.incomplete_profile_desc")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => completeProfessionalRegistration()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("app.init_profile_button")}
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            {t("app.exit_button")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        {!currentUser || status === "unauthenticated" ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/paciente" element={<Login isPatient={true} />} />
            <Route path="/convite/:token" element={<AcceptInvitation />} />
            <Route path="/convite" element={<AcceptInvitation />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : userRole === "patient" ? (
          <Routes>
            <Route path="/paciente" element={<PatientPortal />} />
            <Route path="/convite/:token" element={<AcceptInvitation />} />
            <Route path="/convite" element={<AcceptInvitation />} />
            <Route path="*" element={<Navigate to="/paciente" />} />
          </Routes>
        ) : (
          <PatientDirectoryProvider>
            <AppShell>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/:id" element={<PatientProfile />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/diet-generator" element={<DietGenerator />} />
                <Route
                  path="/metabolic-calculator"
                  element={<MetabolicCalculator />}
                />
                <Route path="/food-database" element={<FoodDatabase />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/email-admin" element={<EmailAdmin />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/convite/:token" element={<AcceptInvitation />} />
                <Route path="/convite" element={<AcceptInvitation />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </AppShell>
          </PatientDirectoryProvider>
        )}
      </Suspense>
    </Router>
  );
};

export default App;
