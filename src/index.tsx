import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { runStartupDiagnostics } from "./services/configValidation";

// Run configuration validation diagnostics
runStartupDiagnostics();

// Initialize theme state (moved from index.html inline script to adhere to strict CSP)
try {
  localStorage.removeItem("theme");
  document.documentElement.classList.remove("dark");
} catch {
  // Gracefully ignore in restricted environments
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary level="app">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
