/**
 * Standardized error handling, categorization, and secure logging.
 *
 * Requirements (Passo 18):
 * - Standardized error classification and correlation IDs without leaking passwords,
 *   tokens, API keys, or complete patient medical records.
 * - Distinguish between legitimate empty data, permission-denied, and service unavailability.
 */

export type ErrorCategory =
  | "permission_denied"
  | "unavailable"
  | "not_found"
  | "unauthenticated"
  | "validation"
  | "rate_limited"
  | "unknown";

const SENSITIVE_KEY_REGEX =
  /password|passwd|token|secret|apiKey|api_key|auth|credential|cpf|rg|medicalRecord|prontuario|notes|clinical|anamnese|jwt|authorization|privateKey/i;

export function generateCorrelationId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "ERR-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface AppErrorOptions {
  originalCode?: string;
  cause?: unknown;
  correlationId?: string;
}

export class AppError extends Error {
  public readonly category: ErrorCategory;
  public readonly originalCode?: string;
  public readonly correlationId: string;
  public readonly timestamp: string;

  constructor(
    message: string,
    category: ErrorCategory = "unknown",
    options?: AppErrorOptions,
  ) {
    super(message);
    this.name = "AppError";
    this.category = category;
    this.originalCode = options?.originalCode;
    this.correlationId = options?.correlationId || generateCorrelationId();
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Classifies an arbitrary caught error into a structured AppError.
 */
export function classifyError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const code = (error as { code?: string })?.code || "";
  const name = (error as { name?: string })?.name || "";
  const message = error instanceof Error ? error.message : String(error || "");
  const normalizedMsg = message.toLowerCase();

  // Firestore & Firebase Auth error codes
  if (
    code === "permission-denied" ||
    code.includes("permission-denied") ||
    normalizedMsg.includes("insufficient permissions") ||
    normalizedMsg.includes("permission denied")
  ) {
    return new AppError(
      "Acesso não autorizado a este recurso.",
      "permission_denied",
      { originalCode: code, cause: error },
    );
  }

  if (
    code === "unavailable" ||
    code.includes("unavailable") ||
    code.includes("network-request-failed") ||
    normalizedMsg.includes("network error") ||
    normalizedMsg.includes("network request failed") ||
    normalizedMsg.includes("failed to fetch")
  ) {
    return new AppError(
      "Serviço temporariamente indisponível. Verifique sua conexão com a internet.",
      "unavailable",
      { originalCode: code, cause: error },
    );
  }

  if (
    code === "not-found" ||
    code.includes("not-found") ||
    normalizedMsg.includes("not found")
  ) {
    return new AppError(
      "O recurso solicitado não foi encontrado.",
      "not_found",
      {
        originalCode: code,
        cause: error,
      },
    );
  }

  if (
    code === "unauthenticated" ||
    code.includes("auth/user-not-found") ||
    code.includes("auth/id-token-expired") ||
    code.includes("auth/user-token-expired") ||
    normalizedMsg.includes("unauthenticated")
  ) {
    return new AppError(
      "Sessão expirada ou usuário não autenticado.",
      "unauthenticated",
      { originalCode: code, cause: error },
    );
  }

  if (
    code === "resource-exhausted" ||
    code.includes("rate-limited") ||
    code.includes("EMAIL_RATE_LIMITED") ||
    normalizedMsg.includes("rate limit") ||
    normalizedMsg.includes("too many requests") ||
    normalizedMsg.includes("email_rate_limited")
  ) {
    return new AppError(
      "Limite de requisições excedido. Aguarde alguns instantes antes de tentar novamente.",
      "rate_limited",
      { originalCode: code, cause: error },
    );
  }

  if (
    code === "validation" ||
    code.includes("validation") ||
    name === "ZodError" ||
    normalizedMsg.includes("validation") ||
    normalizedMsg.includes("inválido") ||
    normalizedMsg.includes("invalid")
  ) {
    return new AppError(message || "Dados inválidos.", "validation", {
      originalCode: code,
      cause: error,
    });
  }

  return new AppError(message || "Ocorreu um erro inesperado.", "unknown", {
    originalCode: code || undefined,
    cause: error,
  });
}

/**
 * Recursively redacts sensitive properties from error logs.
 */
export function sanitizeDataForLogging(data: unknown, depth = 0): unknown {
  if (depth > 5 || data === null || data === undefined) {
    return data;
  }

  if (typeof data !== "object") {
    if (typeof data === "string" && data.length > 200) {
      return `${data.slice(0, 200)}... [truncated]`;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeDataForLogging(item, depth + 1));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEY_REGEX.test(key)) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = sanitizeDataForLogging(value, depth + 1);
    }
  }
  return sanitized;
}

/**
 * Logs errors to console in a sanitized, standardized format with correlation ID.
 * Strictly avoids logging passwords, auth tokens, API keys, or full patient records.
 */
export function safeLogError(
  context: string,
  error: unknown,
  customCorrelationId?: string,
  extraMetadata?: Record<string, unknown>,
): void {
  const appError = classifyError(error);
  const correlationId = customCorrelationId || appError.correlationId;

  const logPayload = {
    correlationId,
    category: appError.category,
    originalCode: appError.originalCode,
    message: appError.message,
    timestamp: appError.timestamp,
    ...(extraMetadata
      ? { metadata: sanitizeDataForLogging(extraMetadata) }
      : {}),
  };

  console.error(`[Diagnostics][${context}] ${correlationId}:`, logPayload);
}
