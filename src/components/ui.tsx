import React from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "./Dialog";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "./icons";

/* ============================================================================
   cn — tiny class combiner
   ========================================================================== */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ============================================================================
   Button
   ========================================================================== */
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};
const buttonSizes: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      loading,
      fullWidth,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "btn",
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner className="w-4 h-4" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
    </button>
  ),
);
Button.displayName = "Button";

/* ============================================================================
   IconButton — icon-only action (UI05). The accessible name is mandatory and
   also shown as a tooltip; the target is a square of at least 36–40px.
   ========================================================================== */
export interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** Accessible name (aria-label) and tooltip. */
  label: string;
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { label, icon, variant = "ghost", size = "md", className, type, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-label={label}
      title={label}
      className={cn(
        "btn btn-icon",
        buttonVariants[variant],
        size === "sm" && "btn-sm",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    </button>
  ),
);
IconButton.displayName = "IconButton";

/* ============================================================================
   Spinner
   ========================================================================== */
export const Spinner: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    aria-hidden="true"
    className={cn("animate-spin", className)}
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
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/* ============================================================================
   Card
   ========================================================================== */
export const Card: React.FC<
  React.ComponentPropsWithRef<"div"> & { hover?: boolean; elevated?: boolean }
> = ({ hover, elevated, className, children, ...props }) => (
  <div
    className={cn(
      elevated ? "card-elevated" : hover ? "card-hover" : "card",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

/* ============================================================================
   Badge
   ========================================================================== */
/** Semantic tones (UI02) — prefer these for states; palette tones remain as
 *  aliases (sage=brand, sky=info, amber=warning, rose=danger, slate=neutral,
 *  emerald=success). Color never carries meaning alone: always pair it with
 *  text and, for states, an icon. */
export type BadgeTone =
  | "brand"
  | "info"
  | "warning"
  | "danger"
  | "neutral"
  | "success"
  | "sage"
  | "sky"
  | "amber"
  | "rose"
  | "slate"
  | "emerald";

export const Badge: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & {
    tone?: BadgeTone;
    icon?: React.ReactNode;
  }
> = ({ tone = "neutral", icon, className, children, ...props }) => (
  <span className={cn("badge", `badge-${tone}`, className)} {...props}>
    {icon && (
      <span aria-hidden="true" className="inline-flex shrink-0">
        {icon}
      </span>
    )}
    {children}
  </span>
);

/* ============================================================================
   Input
   ========================================================================== */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, leftIcon, rightSlot, className, id, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || props.name || generatedId;
    const messageId = `${inputId}-message`;
    const describedBy =
      [props["aria-describedby"], error || hint ? messageId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input-field",
              // .input-field is in @layer components, so these utilities win
              // without "!" (UI01). The error border comes from aria-invalid.
              !!leftIcon && "pl-11",
              !!rightSlot && "pr-11",
              className,
            )}
            {...props}
            aria-invalid={error ? true : props["aria-invalid"]}
            aria-describedby={describedBy}
          />
          {rightSlot && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightSlot}
            </span>
          )}
        </div>
        <FieldMessage id={messageId} error={error} hint={hint} />
      </div>
    );
  },
);
Input.displayName = "Input";

/* ============================================================================
   Field primitives (UI05) — Select, Textarea and Checkbox share the label,
   help and error pattern of Input (aria-describedby + aria-invalid).
   ========================================================================== */
const FieldMessage: React.FC<{ id: string; error?: string; hint?: string }> = ({
  id,
  error,
  hint,
}) =>
  error ? (
    <p id={id} className="field-error">
      {error}
    </p>
  ) : hint ? (
    <p id={id} className="field-hint">
      {hint}
    </p>
  ) : null;

const useFieldIds = (
  id: string | undefined,
  name: string | undefined,
  describedBy: string | undefined,
  hasMessage: boolean,
) => {
  const generatedId = React.useId();
  const fieldId = id || name || generatedId;
  const messageId = `${fieldId}-message`;
  return {
    fieldId,
    messageId,
    describedBy:
      [describedBy, hasMessage ? messageId : undefined]
        .filter(Boolean)
        .join(" ") || undefined,
  };
};

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(({ label, hint, error, className, id, children, ...props }, ref) => {
  const ids = useFieldIds(
    id,
    props.name,
    props["aria-describedby"],
    !!(error || hint),
  );
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={ids.fieldId} className="input-label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={ids.fieldId}
        className={cn("input-field pr-9", className)}
        {...props}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={ids.describedBy}
      >
        {children}
      </select>
      <FieldMessage id={ids.messageId} error={error} hint={hint} />
    </div>
  );
});
Select.displayName = "Select";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ label, hint, error, className, id, ...props }, ref) => {
  const ids = useFieldIds(
    id,
    props.name,
    props["aria-describedby"],
    !!(error || hint),
  );
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={ids.fieldId} className="input-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={ids.fieldId}
        className={cn("input-field min-h-24", className)}
        {...props}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={ids.describedBy}
      />
      <FieldMessage id={ids.messageId} error={error} hint={hint} />
    </div>
  );
});
Textarea.displayName = "Textarea";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> &
    FieldProps & { label: React.ReactNode }
>(({ label, hint, error, className, id, ...props }, ref) => {
  const ids = useFieldIds(
    id,
    props.name,
    props["aria-describedby"],
    !!(error || hint),
  );
  return (
    <div className={className}>
      <label
        htmlFor={ids.fieldId}
        className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer"
      >
        <input
          ref={ref}
          id={ids.fieldId}
          type="checkbox"
          className="checkbox mt-0.5"
          {...props}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={ids.describedBy}
        />
        <span>{label}</span>
      </label>
      <FieldMessage id={ids.messageId} error={error} hint={hint} />
    </div>
  );
});
Checkbox.displayName = "Checkbox";

/* ============================================================================
   PageHeader — consistent page title block
   ========================================================================== */
export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: string;
}> = ({ title, subtitle, icon, actions, eyebrow }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
    <div className="flex items-start gap-4">
      {icon && (
        <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 dark:bg-sage-500/15 dark:text-sage-400">
          {icon}
        </div>
      )}
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-slate-500 dark:text-slate-400 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {actions && (
      // Wraps on narrow screens instead of overflowing (UI05).
      <div className="flex flex-wrap items-center gap-3 sm:shrink-0 sm:justify-end">
        {actions}
      </div>
    )}
  </div>
);

/* ============================================================================
   EmptyState
   ========================================================================== */
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ icon, title, description, action, className }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-6",
      className,
    )}
  >
    {icon && (
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
      {title}
    </h3>
    {description && (
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

/* ============================================================================
   LoadingState / ErrorState — standard async states. Loading is announced
   politely (role="status"); errors interrupt (role="alert") and offer retry.
   ========================================================================== */
export const LoadingState: React.FC<{
  label?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ label, className, children }) => {
  const { t } = useTranslation();
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label ?? t("a11y.loading")}</span>
      {children ?? (
        <div className="flex justify-center py-10 text-sage-600">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}> = ({ title, message, onRetry, className }) => {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-xl font-bold"
      >
        !
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {title ?? t("a11y.error_title")}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {message ?? t("a11y.error_load")}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-5"
          onClick={onRetry}
        >
          {t("a11y.retry")}
        </Button>
      )}
    </div>
  );
};

/* ============================================================================
   Modal — accessible, animated dialog shell (built on Dialog: focus trap,
   Escape, inert background, scroll lock, focus returned to the trigger)
   ========================================================================== */
export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  icon?: React.ReactNode;
  /** Accessible name when `title` is not provided. */
  label?: string;
  /** "alertdialog" for confirmations. */
  role?: "dialog" | "alertdialog";
  initialFocus?: React.RefObject<HTMLElement | null>;
}> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  icon,
  label,
  role,
  initialFocus,
}) => {
  const { t } = useTranslation();
  const titleId = React.useId();
  const descriptionId = React.useId();

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  } as const;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      role={role}
      labelledBy={title ? titleId : undefined}
      label={label}
      describedBy={description ? descriptionId : undefined}
      initialFocus={initialFocus}
      overlayClassName="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      backdropClassName="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      className={cn(
        "relative w-full bg-white dark:bg-slate-850 shadow-pop animate-scale-in",
        "rounded-t-3xl sm:rounded-3xl border border-slate-200/70 dark:border-slate-700/60",
        "max-h-[92vh] flex flex-col",
        sizes[size],
      )}
    >
      {(title || icon) && (
        <div className="flex items-start gap-4 p-6 pb-4">
          {icon && (
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 dark:bg-sage-500/15 dark:text-sage-400"
            >
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h2
                id={titleId}
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id={descriptionId}
                className="mt-0.5 text-sm text-slate-500 dark:text-slate-400"
              >
                {description}
              </p>
            )}
          </div>
          <CloseButton onClick={onClose} label={t("a11y.close")} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-6 py-2">{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center justify-end gap-3 p-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {footer}
        </div>
      )}
    </Dialog>
  );
};

/** Icon-only close button with an accessible name. */
export const CloseButton: React.FC<{
  onClick: () => void;
  label: string;
  className?: string;
}> = ({ onClick, label, className }) => (
  <IconButton
    onClick={onClick}
    label={label}
    size="sm"
    className={cn("text-slate-500", className)}
    icon={
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    }
  />
);

/* ============================================================================
   Avatar — photo with an initials fallback when there is no URL or the image
   fails to load (never a broken-image icon).
   ========================================================================== */
export const Avatar: React.FC<{
  src?: string | null;
  name: string;
  /** Empty when the name is already next to the avatar (decorative). */
  alt?: string;
  className?: string;
}> = ({ src, name, alt = "", className }) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn(
        "inline-flex items-center justify-center bg-sage-50 font-bold text-sage-700",
        className,
      )}
    >
      {initials}
    </span>
  );
};

/* ============================================================================
   Skeleton
   ========================================================================== */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden="true" className={cn("skeleton", className)} />
);

/* ============================================================================
   Alert (UI02)
   ========================================================================== */
export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
  action?: React.ReactNode;
}

const alertStyles = {
  success: "bg-success-bg border-success/20 text-success",
  warning: "bg-warning-bg border-warning/20 text-warning",
  danger: "bg-danger-bg border-danger/20 text-danger",
  info: "bg-info-bg border-info/20 text-info",
  neutral: "bg-slate-50 border-slate-200 text-slate-700",
};

const alertIcons = {
  success: <CheckCircleIcon className="w-5 h-5 shrink-0" />,
  warning: <AlertTriangleIcon className="w-5 h-5 shrink-0" />,
  danger: <XCircleIcon className="w-5 h-5 shrink-0" />,
  info: <InformationCircleIcon className="w-5 h-5 shrink-0" />,
  neutral: <InformationCircleIcon className="w-5 h-5 shrink-0" />,
};

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  tone = "info",
  className,
  action,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 p-4 border rounded-xl items-start",
        alertStyles[tone],
        className,
      )}
    >
      {alertIcons[tone]}
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="opacity-90">{children}</div>
      </div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
};
