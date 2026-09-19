import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

/**
 * Renders the application. Loaded by index.tsx only after the configuration
 * has been validated, because importing App/AuthProvider initializes Firebase.
 */
export const mountApp = (rootElement: HTMLElement) => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary level="app">
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
};
