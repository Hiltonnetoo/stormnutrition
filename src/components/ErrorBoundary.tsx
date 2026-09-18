import React, { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "../i18n";
import { generateCorrelationId, safeLogError } from "../utils/errors";

export interface ErrorBoundaryProps {
  children: ReactNode;
  level?: "app" | "route" | "component";
  resetKey?: unknown;
  fallback?:
    | ReactNode
    | ((error: Error, reset: () => void, correlationId: string) => ReactNode);
  onCatch?: (error: Error, info: ErrorInfo, correlationId: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  correlationId: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    correlationId: null,
  };

  public static getDerivedStateFromError(
    error: Error,
  ): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      correlationId: generateCorrelationId(),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const correlationId = this.state.correlationId || generateCorrelationId();
    safeLogError(
      `ErrorBoundary:${this.props.level || "route"}`,
      error,
      correlationId,
    );
    this.props.onCatch?.(error, errorInfo, correlationId);
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.handleReset();
    }
  }

  public handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      correlationId: null,
    });
  };

  public handleGoHome = (): void => {
    this.handleReset();
    window.location.hash = "#/dashboard";
  };

  public handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    const { hasError, error, correlationId } = this.state;
    const { children, fallback, level = "route" } = this.props;

    if (!hasError || !error) {
      return children;
    }

    if (fallback) {
      if (typeof fallback === "function") {
        return fallback(
          error,
          this.handleReset,
          correlationId || "ERR-UNKNOWN",
        );
      }
      return fallback;
    }

    const t = (key: string, def: string) => i18n.t(key, { defaultValue: def });

    const isAppLevel = level === "app";

    return (
      <div
        role="alert"
        aria-live="assertive"
        className={`flex items-center justify-center p-6 ${
          isAppLevel
            ? "min-h-screen bg-slate-50 dark:bg-slate-900"
            : "min-h-[320px] w-full"
        }`}
      >
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-soft p-6 sm:p-8 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("error_boundary.title", "Algo deu errado nesta seção")}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t(
              "error_boundary.desc",
              "Ocorreu um erro inesperado. As outras seções do aplicativo continuam disponíveis.",
            )}
          </p>

          {correlationId && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <span className="text-slate-400 font-sans">
                {t("error_boundary.correlation_id", "Código")}:
              </span>
              <span className="font-bold">{correlationId}</span>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs sm:text-sm font-semibold transition-colors focus-ring"
            >
              {t("error_boundary.btn_retry", "Tentar novamente")}
            </button>

            {isAppLevel ? (
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors focus-ring"
              >
                {t("error_boundary.btn_reload", "Recarregar página")}
              </button>
            ) : (
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors focus-ring"
              >
                {t("error_boundary.btn_home", "Ir para o Início")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
