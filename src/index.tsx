import "./index.css";
import { runStartupDiagnostics } from "./services/configValidation";
import { renderStartupError } from "./startupErrorScreen";

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

// Validate the configuration BEFORE loading the app: importing App or
// AuthProvider initializes Firebase, which throws on a missing API key or an
// unsafe emulator setup. With a static import that error would happen before
// this check could report it.
const config = runStartupDiagnostics();

if (!config.isValid) {
  renderStartupError(rootElement, config.errors);
} else {
  import("./mountApp")
    .then(({ mountApp }) => mountApp(rootElement))
    .catch((error: unknown) => {
      console.error("[Storm Nutrition] Falha ao carregar a aplicação:", error);
      renderStartupError(rootElement, [
        error instanceof Error ? error.message : String(error),
      ]);
    });
}
